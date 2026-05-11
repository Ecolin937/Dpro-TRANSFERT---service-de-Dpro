import React, { useState, useRef, useEffect } from 'react';
import { Upload, File, X, Check, Copy, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { signInAnonymously } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, storage, db } from '../lib/firebase';
import { handleFirestoreError } from '../lib/utils';
import { OperationType } from '../types';
import { addDays } from 'date-fns';

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transferId, setTransferId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const validateAndSetFile = (f: File) => {
    if (f.size > MAX_FILE_SIZE) {
      setError("Le fichier est trop volumineux.");
      return;
    }
    setFile(f);
    setError(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // 1. Sign in anonymously
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }

      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Auth failed");

      const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const storagePath = `transfers/${uid}/${id}/${file.name}`;
      const storageRef = ref(storage, storagePath);

      // 2. Upload to Storage
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p);
        },
        (error) => {
          console.error("Upload error:", error);
          setError("Échec du téléchargement. Veuillez réessayer.");
          setUploading(false);
        },
        async () => {
          // 3. Get Download URL
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          // 4. Save metadata to Firestore
          const transferData = {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type || 'application/octet-stream',
            downloadUrl,
            createdAt: serverTimestamp(),
            expiresAt: addDays(new Date(), 7), // Expires in 7 days
            ownerId: uid,
            storagePath,
          };

          const path = `transfers/${id}`;
          try {
            await setDoc(doc(db, 'transfers', id), transferData);
            setTransferId(id);
            setUploading(false);
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, path);
          }
        }
      );
    } catch (err: any) {
      console.error(err);
      setError("Une erreur est survenue lors de la préparation.");
      setUploading(false);
    }
  };

  const copyLink = () => {
    if (!transferId) return;
    const url = `${window.location.origin}/download/${transferId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setFile(null);
    setTransferId(null);
    setProgress(0);
    setUploading(false);
    setError(null);
  };

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
      <AnimatePresence mode="wait">
        {!file && !transferId && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-2xl py-16 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors group"
          >
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-gray-400 group-hover:text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cliquez ou glissez un fichier</h3>
            <p className="text-gray-400 text-sm">Prêt pour vos transferts</p>
          </motion.div>
        )}

        {file && !uploading && !transferId && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <File className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{file.name}</h4>
                <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} Mo</p>
              </div>
              <button
                onClick={reset}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-2">
                <Info className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              onClick={handleUpload}
              className="w-full bg-black text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
            >
              Démarrer le transfert
            </button>
          </motion.div>
        )}

        {uploading && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-6 py-8"
          >
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-lg font-bold">Transfert en cours...</h3>
                <p className="text-sm text-gray-500">Votre fichier est en route vers les nuages</p>
              </div>
              <span className="text-2xl font-black">{Math.round(progress)}%</span>
            </div>
            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-black"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
               <Loader2 className="w-3 h-3 animate-spin" />
               Cryptage de bout en bout activé
            </div>
          </motion.div>
        )}

        {transferId && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center gap-6 py-4"
          >
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1">C'est prêt !</h3>
              <p className="text-gray-500">Partagez ce lien avec vos destinataires.</p>
            </div>

            <div className="w-full flex items-center gap-2 bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/download/${transferId}`}
                className="flex-1 bg-transparent border-none text-sm font-medium focus:ring-0 truncate"
              />
              <button
                onClick={copyLink}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all active:scale-95"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>

            <button
              onClick={reset}
              className="text-sm font-bold text-gray-400 hover:text-black transition-colors"
            >
              Envoyer un autre fichier
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
