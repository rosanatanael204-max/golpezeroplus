import React from 'react';
import { Send, Aperture, AlertTriangle, ShieldX, CheckCircle2, Cpu } from 'lucide-react';

export default function Verificador({ mensagem, setMensagem, handleVerificarGolpe, carregando, erro, resultado }) {
  return (
    <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800/80 shadow-2xl space-y-6 backdrop-blur-md">
      
      {/* Cabeçalho do Módulo */}
      <div className="flex justify-between items-start border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Cpu className="w-4 h-4" /> Análise Heurística & IA
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Verificador Anti-Fraude</h2>
          <p className="text-slate-400 text-sm mt-1">
            Insira o texto de mensagens suspeitas para varredura imediata de engenharia social.
          </p>
        </div>
      </div>

      {/* Campo de Entrada */}
      <div className="space-y-4">
        <div className="relative">
          <textarea
            rows="6"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Cole aqui o texto da mensagem recebida via WhatsApp, SMS ou e-mail..."
            className="w-full p-5 bg-slate-900/90 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none resize-none transition-all shadow-inner text-sm md:text-base leading-relaxed"
          />
          <div className="absolute bottom-4 right-4 text-xs font-mono text-slate-500">
            {mensagem.length} caracteres
          </div>
        </div>

        <button
          type="button"
          onClick={handleVerificarGolpe}
          disabled={carregando}
          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 transition-all cursor-pointer text-base uppercase tracking-wider"
        >
          {carregando ? (
            <span className="flex items-center gap-2.5">
              <Aperture className="w-5 h-5 animate-spin text-blue-300" />
              Processando Algoritmos de IA...
            </span>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Executar Varredura de Segurança</span>
            </>
          )}
        </button>
      </div>

      {/* Alerta de Erro */}
      {erro && (
        <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3.5 text-red-400">
          <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5 text-red-500" />
          <div>
            <strong className="block font-extrabold text-sm uppercase tracking-wider">Erro na Conexão</strong>
            <span className="text-xs md:text-sm text-red-300/90">{erro}</span>
          </div>
        </div>
      )}

      {/* Painel do Resultado */}
      {resultado && (
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl space-y-5">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3.5">
              {resultado.suspeito !== false ? (
                <div className="p-3 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20 shadow-lg shadow-red-500/5">
                  <ShieldX className="w-7 h-7" />
                </div>
              ) : (
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-black text-white">Relatório de Diagnóstico</h3>
                <p className="text-xs text-slate-400">Motor de análise: Spring Boot v3.2 & PyAI Microservice</p>
              </div>
            </div>

            <span className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
              resultado.suspeito !== false 
                ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}>
              {resultado.suspeito !== false ? 'ALTO RISCO' : 'SEGURO'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resultado.classificacao && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Categoria Detectada</span>
                <p className="text-white font-extrabold text-sm mt-1">{resultado.classificacao}</p>
              </div>
            )}

            {resultado.probabilidadeGolpe !== undefined && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Índice de Ameaça</span>
                <p className="text-blue-400 font-extrabold text-sm mt-1">
                  {(resultado.probabilidadeGolpe * 100).toFixed(0)}% de probabilidade de fraude
                </p>
              </div>
            )}
          </div>

          {resultado.recomendacao && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Diretriz Recomendada</span>
              <p className="text-slate-200 font-medium text-xs md:text-sm mt-1 leading-relaxed">{resultado.recomendacao}</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}