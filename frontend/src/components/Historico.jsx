import React from 'react';
import { History, Info } from 'lucide-react';

export default function Historico({ historico }) {
  return (
    <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-white">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <History className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-extrabold">Histórico da Sessão</h3>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full">
          {historico.length}
        </span>
      </div>

      {historico.length === 0 ? (
        <div className="text-center py-10 text-slate-500 space-y-2">
          <Info className="w-8 h-8 mx-auto opacity-40" />
          <p className="text-xs font-medium">Nenhuma mensagem analisada nesta sessão.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {historico.map((item) => (
            <div key={item.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 hover:border-slate-700 transition-all">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-blue-400">{item.hora}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  item.resultado?.suspeito !== false ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {item.resultado?.suspeito !== false ? 'Suspeito' : 'Seguro'}
                </span>
              </div>
              <p className="text-slate-300 text-xs font-medium line-clamp-2">{item.texto}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}