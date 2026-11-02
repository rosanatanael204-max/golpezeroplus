import React from 'react';
import { ShieldCheck, Type, LogOut, Sparkles } from 'lucide-react';

export default function Header({ usuario, fonteGrande, setFonteGrande, handleLogout }) {
  return (
    <header className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-sm opacity-70"></div>
            <div className="relative bg-slate-950 p-2.5 rounded-2xl border border-slate-700/50">
              <ShieldCheck className="w-7 h-7 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white font-sans">
                GolpeZero <span className="text-blue-500">50+</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full tracking-wider uppercase">
                <Sparkles className="w-3 h-3" /> Enterprise
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Plataforma Inteligente de Prevenção a Fraudes</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setFonteGrande(!fonteGrande)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 border border-slate-800 transition-all cursor-pointer shadow-sm"
          >
            <Type className="w-4 h-4 text-blue-400" />
            <span className="hidden md:inline">{fonteGrande ? 'Fonte Padrão' : 'Aumentar Fonte'}</span>
          </button>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          {/* Encadeamento opcional ?. impede o erro caso 'usuario' esteja indefinido */}
          <div className="text-right hidden sm:block">
            <p className="font-bold text-slate-200 text-xs">{usuario?.nome || 'Usuário'}</p>
            <p className="text-[10px] text-slate-400 font-mono">{usuario?.email || 'usuario@email.com'}</p>
          </div>

          <button
            onClick={handleLogout}
            className="p-2.5 bg-slate-900 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-xl border border-slate-800 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}