import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Transfer } from '../types';
import { File, Download as DownloadIcon, Clock, HardDrive, Info, Loader2 } from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'motion/react';

export default function Download() {
  const { id } = useParams<{ id: string }>();
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransfer() {
      if (!id) return;
      try {
        const docRef = doc(db, 'transfers', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Transfer;
          // Check expiry
          const expiryDate = data.expiresAt.toDate();
          if (isAfter(new Date(), expiryDate)) {
            setError("Ce lien a expiré.");
          } else {
            setTransfer({ ...data, id: docSnap.id });
          }
        } else {
          setError("Ce transfert n'existe pas.");
        }
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les données du transfert.");
      } finally {
        setLoading(false);
      }
    }

    fetchTransfer();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-gray-300" />
        <p className="text-gray-500 font-medium tracking-tight">Récupération de vos fichiers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-[32px] p-12 text-center shadow-sm border border-gray-100 max-w-xl mx-auto">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Info className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Oups !</h2>
        <p className="text-gray-500 mb-8">{error}</p>
        <a 
          href="/" 
          className="inline-block bg-black text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition-all"
        >
          Retour à l'accueil
        </a>
      </div>
    );
  }

  if (!transfer) return null;

  const fileSizeMo = (transfer.fileSize / (1024 * 1024)).toFixed(2);
  const expiryStr = format(transfer.expiresAt.toDate(), "d MMMM yyyy HH:mm", { locale: fr });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100">
        <div className="bg-black p-12 text-white flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-white/10 rounded-[32px] backdrop-blur-md flex items-center justify-center mb-8 relative">
            <File className="w-12 h-12 text-white" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-black flex items-center justify-center">
               <DownloadIcon className="w-3 h-3 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight leading-none truncate w-full px-4">
            {transfer.fileName}
          </h1>
          <div className="flex items-center gap-4 text-white/50 text-sm font-medium">
            <div className="flex items-center gap-1.5">
               <HardDrive className="w-4 h-4" />
               <span>{fileSizeMo} Mo</span>
            </div>
          </div>
        </div>

        <div className="p-12">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                 <Clock className="w-5 h-5 text-gray-400" />
               </div>
               <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">Expire le</p>
                  <p className="text-sm font-medium">{expiryStr}</p>
               </div>
            </div>

            <a
              href={transfer.downloadUrl}
              download={transfer.fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-black text-white font-black py-6 rounded-[24px] hover:bg-gray-800 transition-all flex items-center justify-center gap-3 text-lg shadow-xl shadow-black/10 group"
            >
              Télécharger le fichier
              <DownloadIcon className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </a>

            <div className="text-center pt-4">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Dpro Transfert Sécurisé</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
