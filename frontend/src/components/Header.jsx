import React from 'react';
import { ShieldCheck, Type, LogOut, Sun, Moon, BadgeCheck } from 'lucide-react';

export default function Header({
  usuario,
  fonteGrande,
  setFonteGrande,
  modoClaro,
  setModoClaro,
  handleLogout
}) {
  return (
    <header
      className={`sticky top-0 z-30 border-b backdrop-blur-xl transition-colors duration-300 ${
        modoClaro
          ? 'bg-white/95 border-slate-200/90 shadow-sm'
          : 'bg-slate-900/90 border-slate-800 shadow-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Marca */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/25">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight">GolpeZero 50+</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                <BadgeCheck className="w-3.5 h-3.5" /> Escudo Ativo
              </span>
            </div>
            <p className={`text-xs ${modoClaro ? 'text-slate-500' : 'text-slate-400'}`}>
              Olá, <strong>{usuario?.nome}</strong> • Proteção Digital Simplificada
            </p>
          </div>
        </div>

        {/* Controles de Acessibilidade e Sessão */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setModoClaro(!modoClaro)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
              modoClaro
                ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
          >
            {modoClaro ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span className="hidden sm:inline">{modoClaro ? 'Tema Escuro' : 'Tema Claro'}</span>
          </button>

          <button
            type="button"
            onClick={() => setFonteGrande(!fonteGrande)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
              fonteGrande
                ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                : modoClaro
                  ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                  : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>{fonteGrande ? 'Letra Normal' : 'A+ Letra Grande'}</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-extrabold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border border-rose-500/25 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}