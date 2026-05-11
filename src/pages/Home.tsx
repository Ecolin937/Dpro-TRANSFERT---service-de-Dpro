import React from 'react';
import FileUploader from '../components/FileUploader';
import { Shield, Zap, RefreshCw, Send } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <section className="text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-black text-[10px] text-white font-black uppercase tracking-[0.2em] rounded-full mb-6">
            Libre et Rapide
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[0.9]">
            Envoyez de gros<br />fichiers, <span className="text-gray-400">simplement.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Pas d'inscription, pas de publicité. Partagez vos fichiers 
            avec un lien sécurisé qui expire après 7 jours.
          </p>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7">
           <FileUploader />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-8 pt-4">
           <div className="flex gap-4">
             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
               <Shield className="w-6 h-6 text-black" />
             </div>
             <div>
               <h3 className="font-bold mb-1">Sécurité Maximale</h3>
               <p className="text-sm text-gray-500">Vos fichiers sont chiffrés au repos et en transit. Personne d'autre que vous n'a accès à vos données.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
               <Zap className="w-6 h-6 text-black" />
             </div>
             <div>
               <h3 className="font-bold mb-1">Vitesse Éclair</h3>
               <p className="text-sm text-gray-500">Nos serveurs européens optimisés garantissent des vitesses de téléchargement maximales pour vos destinataires.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
               <RefreshCw className="w-6 h-6 text-black" />
             </div>
             <div>
               <h3 className="font-bold mb-1">Autodestruction</h3>
               <p className="text-sm text-gray-500">Les liens expirent automatiquement après 7 jours, garantissant que vos fichiers ne restent pas sur le cloud éternellement.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
               <Send className="w-6 h-6 text-black" />
             </div>
             <div>
               <h3 className="font-bold mb-1">Pas de barrières</h3>
               <p className="text-sm text-gray-500">Envoyez des photos, des vidéos ou des documents sans avoir à vous connecter ou à laisser vos coordonnées.</p>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}
