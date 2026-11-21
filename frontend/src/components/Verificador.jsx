
import React from 'react';
import {
  Send,
  Aperture,
  AlertTriangle,
  ShieldX,
  CheckCircle2,
  Cpu,
  HelpCircle
} from 'lucide-react';

export default function Verificador({
  mensagem,
  setMensagem,
  handleVerificarGolpe,
  carregando,
  erro,
  resultado
}) {
  // Classificação recebida da IA Python através do Java
  const classificacao = resultado?.classificacao;

  // Configuração visual para cada classificação
  const estados = {
    SEGURO: {
      texto: 'SEGURO',
      estilo: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      Icone: CheckCircle2
    },
    SUSPEITO: {
      texto: 'SUSPEITO',
      estilo: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      Icone: AlertTriangle
    },
    ALTO_RISCO: {
      texto: 'ALTO RISCO',
      estilo: 'bg-red-500/10 text-red-400 border-red-500/30',
      Icone: ShieldX
    },
    INCONCLUSIVO: {
      texto: 'INCONCLUSIVO',
      estilo: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
      Icone: HelpCircle
    }
  };

  const estado = estados[classificacao] ?? {
    texto: 'NÃO CLASSIFICADO',
    estilo: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
    Icone: HelpCircle
  };

  const IconeResultado = estado.Icone;

  const pontuacao = Number(resultado?.score_suspeita);
  const pontuacaoValida = Number.isFinite(pontuacao);

  return (
    <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800/80 shadow-2xl space-y-6 backdrop-blur-md">

      {/* Cabeçalho do Módulo */}
      <div className="flex justify-between items-start border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Cpu className="w-4 h-4" />
            Análise Heurística & IA
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            Verificador Anti-Fraude
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            Insira o texto de mensagens suspeitas para varredura imediata
            de engenharia social.
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
          disabled={carregando || !mensagem.trim()}
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
            <strong className="block font-extrabold text-sm uppercase tracking-wider">
              Erro na Conexão
            </strong>

            <span className="text-xs md:text-sm text-red-300/90">
              {erro}
            </span>
          </div>
        </div>
      )}

      {/* Painel do Resultado */}
      {resultado && (
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl space-y-5">

          {/* Cabeçalho do Diagnóstico */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-4 gap-3">

            <div className="flex items-center gap-3.5">

              {/* Ícone conforme a classificação */}
              <div className={`p-3 rounded-2xl border ${estado.estilo}`}>
                <IconeResultado className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-black text-white">
                  Relatório de Diagnóstico
                </h3>

                <p className="text-xs text-slate-400">
                  Motor de análise: Spring Boot v3.2 & PyAI Microservice
                </p>
              </div>
            </div>

            {/* Indicador correto da IA */}
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${estado.estilo}`}
            >
              {estado.texto}
            </span>
          </div>

          {/* Informações do Resultado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Categoria detectada */}
            {resultado.classificacao && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Categoria Detectada
                </span>

                <p className="text-white font-extrabold text-sm mt-1">
                  {estado.texto}
                </p>
              </div>
            )}

            {/* Pontuação do modelo */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Índice de Ameaça
              </span>

              <p className="text-blue-400 font-extrabold text-sm mt-1">
                {classificacao === 'INCONCLUSIVO'
                  ? 'Não avaliado — informações insuficientes'
                  : pontuacaoValida && resultado?.score_suspeita != null
                    ? `${pontuacao.toFixed(1)}% de pontuação do modelo`
                    : 'Pontuação indisponível'}
              </p>
            </div>
          </div>

          {/* Motivos identificados */}
          {Array.isArray(resultado.motivos) &&
            resultado.motivos.length > 0 && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Sinais Identificados
                </span>

                <ul className="mt-2 space-y-2">
                  {resultado.motivos.map((motivo, index) => (
                    <li
                      key={index}
                      className="text-slate-200 text-xs md:text-sm leading-relaxed flex items-start gap-2"
                    >
                      <span className="text-blue-400">•</span>
                      <span>{motivo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Recomendação */}
          {resultado.recomendacao && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Diretriz Recomendada
              </span>

              <p className="text-slate-200 font-medium text-xs md:text-sm mt-1 leading-relaxed">
                {resultado.recomendacao}
              </p>
            </div>
          )}

          {/* Aviso educativo */}
          <p className="text-xs text-slate-400 leading-relaxed">
            Esta análise é uma ferramenta educativa e não garante
            que uma mensagem seja segura ou fraudulenta.
            Confirme informações pelos canais oficiais.
          </p>

        </div>
      )}
    </div>
  );
}
