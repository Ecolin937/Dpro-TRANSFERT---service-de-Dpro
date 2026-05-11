import { MoveUp, ShieldCheck, Zap, History } from 'lucide-react';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-[#1A1A1A] selection:bg-black selection:text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
              <MoveUp className="w-6 h-6 rotate-45" />
            </div>
            <span className="font-bold text-xl tracking-tight">Dpro Transfert</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-black transition-colors">Comment ça marche</a>
            <a href="#" className="hover:text-black transition-colors">Sécurité</a>
            <a href="#" className="hover:text-black transition-colors">Aide</a>
          </nav>
          <button className="text-sm font-semibold bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-all">
            Transférer
          </button>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      <footer className="py-12 border-t border-gray-200 bg-white px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                <MoveUp className="w-4 h-4 rotate-45" />
              </div>
              <span className="font-bold text-lg">Dpro Transfert</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Transfert de fichiers gratuit et sécurisé sans inscription. 
              Simple, rapide et confidentiel.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Produit</span>
              <a href="#" className="text-sm font-medium hover:text-black transition-colors">Transférer</a>
              <a href="#" className="text-sm font-medium hover:text-black transition-colors">Tarifs</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Légal</span>
              <a href="#" className="text-sm font-medium hover:text-black transition-colors">Confidentialité</a>
              <a href="#" className="text-sm font-medium hover:text-black transition-colors">Conditions</a>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-[#F9F9F9] p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 mb-2 text-green-600">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Certifié Sécurisé</span>
              </div>
              <p className="text-xs text-gray-500">
                Tous vos fichiers sont chiffrés et supprimés automatiquement après expiration.
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs text-gray-400">© 2024 Dpro Transfert. Conçu avec soin.</span>
          <div className="flex gap-6">
             <Zap className="w-4 h-4 text-gray-300" />
             <History className="w-4 h-4 text-gray-300" />
          </div>
        </div>
      </footer>
    </div>
  );
}
