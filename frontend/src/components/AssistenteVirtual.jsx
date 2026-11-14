import React, { useState, useEffect, useRef } from 'react';
import {
  Bot, Send, HelpCircle, Volume2, VolumeX, Siren,
  CheckCircle2, Sparkles, RotateCcw, ShieldAlert
} from 'lucide-react';
import {
  GUIAS_EMERGENCIA,
  PERGUNTAS_RAPIDAS,
  responderAssistenteCompleto
} from '../data/baseConhecimento';

export default function AssistenteVirtual({ usuario, tema = {} }) {
  const modoClaro = tema.modoClaro || false;
  const bgCard = tema.bgCard || (modoClaro ? 'bg-white border-slate-200 shadow-lg' : 'bg-slate-900/90 border-slate-800 shadow-xl');
  const bgSubCard = tema.bgSubCard || (modoClaro ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800');
  const bgInput = tema.bgInput || (modoClaro ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white');
  const textMuted = tema.textMuted || (modoClaro ? 'text-slate-600' : 'text-slate-400');

  const mensagemInicial = {
    id: 1,
    remetente: 'bot',
    titulo: `Olá, ${usuario?.nome || 'amigo(a)'}! Sou o Guardião Digital`,
    texto: 'Estou aqui 24 horas por dia para tirar suas dúvidas com calma e segurança. Você pode escrever o que aconteceu, tocar em uma dúvida pronta ou abrir o Guia de Emergência.',
    dicaExtra: 'Você também pode clicar no ícone de alto-falante em qualquer resposta para eu ler em voz alta para você!'
  };

  const [mensagens, setMensagens] = useState(() => {
    const salvo = localStorage.getItem('golpezero_chat_assistente');
    return salvo ? JSON.parse(salvo) : [mensagemInicial];
  });

  const [inputTexto, setInputTexto] = useState('');
  const [modoLateral, setModoLateral] = useState('duvidas'); // 'duvidas' | 'emergencia'
  const [guiaSelecionado, setGuiaSelecionado] = useState(GUIAS_EMERGENCIA[0]);
  const [falandoId, setFalandoId] = useState(null);
  const fimChatRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('golpezero_chat_assistente', JSON.stringify(mensagens));
  }, [mensagens]);

  const enviarPergunta = (textoOpcional) => {
    const pergunta = (textoOpcional || inputTexto).trim();
    if (!pergunta) return;

    const msgUsuario = {
      id: Date.now(),
      remetente: 'user',
      texto: pergunta
    };

    const respostaEstruturada = responderAssistenteCompleto(pergunta);
    const msgBot = {
      id: Date.now() + 1,
      remetente: 'bot',
      titulo: respostaEstruturada.titulo,
      texto: respostaEstruturada.resposta,
      dicaExtra: respostaEstruturada.dicaExtra
    };

    setMensagens((prev) => [...prev, msgUsuario, msgBot]);
    if (!textoOpcional) setInputTexto('');

    setTimeout(() => {
      fimChatRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const lerEmVozAlta = (msg) => {
    if (!('speechSynthesis' in window)) return;

    if (falandoId === msg.id) {
      window.speechSynthesis.cancel();
      setFalandoId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const textoCompleto = `${msg.titulo || ''}. ${msg.texto}. ${msg.dicaExtra ? 'Dica de ouro: ' + msg.dicaExtra : ''}`;
    const fala = new SpeechSynthesisUtterance(textoCompleto);
    fala.lang = 'pt-BR';
    fala.rate = 0.95; // Velocidade levemente mais calma para melhor compreensão
    fala.onend = () => setFalandoId(null);

    setFalandoId(msg.id);
    window.speechSynthesis.speak(fala);
  };

  const limparConversa = () => {
    window.speechSynthesis?.cancel();
    setFalandoId(null);
    setMensagens([mensagemInicial]);
    localStorage.removeItem('golpezero_chat_assistente');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* COLUNA ESQUERDA: ÁREA DE CONVERSA */}
      <div className={`lg:col-span-7 border rounded-3xl p-5 sm:p-6 flex flex-col justify-between ${bgCard}`}>
        <div>
          {/* Cabeçalho do Assistente */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-700/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold">Guardião Digital 24h</h2>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Assistente de Orientação e Prevenção
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={limparConversa}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition cursor-pointer ${bgSubCard} ${textMuted} hover:text-blue-500`}
              title="Reiniciar conversa"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nova Conversa</span>
            </button>
          </div>

          {/* Lista de Mensagens */}
          <div className={`h-[420px] overflow-y-auto p-4 rounded-2xl border space-y-4 mb-4 ${bgSubCard}`}>
            {mensagens.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.remetente === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.remetente === 'user' ? (
                  <div className="max-w-[82%] bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-2xl rounded-br-none font-medium shadow">
                    {msg.texto}
                  </div>
                ) : (
                  <div
                    className={`max-w-[92%] p-4 sm:p-5 rounded-2xl rounded-bl-none border shadow-sm space-y-2.5 ${
                      modoClaro
                        ? 'bg-white border-slate-200 text-slate-800'
                        : 'bg-slate-800/95 border-slate-700 text-slate-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-blue-500 text-sm sm:text-base">
                        {msg.titulo}
                      </h3>
                      <button
                        type="button"
                        onClick={() => lerEmVozAlta(msg)}
                        className={`shrink-0 flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                          falandoId === msg.id
                            ? 'bg-amber-500 text-white border-amber-400'
                            : 'bg-blue-500/10 text-blue-500 border-blue-500/30 hover:bg-blue-500/20'
                        }`}
                        title="Ouvir resposta em voz alta"
                      >
                        {falandoId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Parar</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Ouvir</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="leading-relaxed whitespace-pre-line">{msg.texto}</p>

                    {msg.dicaExtra && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs sm:text-sm text-emerald-500 font-medium flex items-start gap-2">
                        <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Dica de Ouro:</strong> {msg.dicaExtra}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={fimChatRef} />
          </div>
        </div>

        {/* Caixa de Pergunta */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            enviarPergunta();
          }}
          className="flex gap-2.5"
        >
          <input
            type="text"
            value={inputTexto}
            onChange={(e) => setInputTexto(e.target.value)}
            placeholder="Descreva o que aconteceu... Ex: 'Pediram um código por SMS'"
            className={`flex-1 border focus:border-blue-500 rounded-2xl px-4 py-3.5 outline-none ${bgInput}`}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </form>
      </div>

      {/* COLUNA DIREITA: DÚVIDAS RÁPIDAS E EMERGÊNCIA */}
      <div className={`lg:col-span-5 border rounded-3xl p-5 sm:p-6 flex flex-col ${bgCard}`}>
        {/* Seletor Superior */}
        <div className={`grid grid-cols-2 gap-2 p-1.5 rounded-2xl border mb-5 ${bgSubCard}`}>
          <button
            type="button"
            onClick={() => setModoLateral('duvidas')}
            className={`py-2.5 px-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
              modoLateral === 'duvidas'
                ? 'bg-blue-600 text-white shadow'
                : textMuted
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Dúvidas Prontas</span>
          </button>

          <button
            type="button"
            onClick={() => setModoLateral('emergencia')}
            className={`py-2.5 px-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
              modoLateral === 'emergencia'
                ? 'bg-red-600 text-white shadow'
                : textMuted
            }`}
          >
            <Siren className="w-4 h-4" />
            <span>Emergência</span>
          </button>
        </div>

        {modoLateral === 'duvidas' ? (
          <div className="space-y-3 overflow-y-auto">
            <p className={`text-xs ${textMuted} mb-2`}>
              Toque em qualquer situação abaixo para receber orientação imediata sem precisar digitar:
            </p>
            {PERGUNTAS_RAPIDAS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => enviarPergunta(item.pergunta)}
                className={`w-full text-left p-3.5 rounded-2xl border transition hover:border-blue-500 cursor-pointer ${bgSubCard}`}
              >
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-blue-500 mb-1">
                  {item.categoria}
                </span>
                <div className="font-bold text-sm leading-snug">{item.pergunta}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>Agiu sem querer? Escolha a situação abaixo e siga o passo a passo com calma:</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {GUIAS_EMERGENCIA.map((guia) => (
                <button
                  key={guia.id}
                  type="button"
                  onClick={() => setGuiaSelecionado(guia)}
                  className={`text-left p-3 rounded-2xl border text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                    guiaSelecionado.id === guia.id
                      ? 'bg-red-600 border-red-500 text-white shadow'
                      : bgSubCard
                  }`}
                >
                  {guia.titulo}
                </button>
              ))}
            </div>

            <div className={`p-4 rounded-2xl border space-y-2.5 ${bgSubCard}`}>
              <h4 className="font-extrabold text-sm text-red-500">
                O que fazer agora:
              </h4>
              {guiaSelecionado.passos.map((passo, i) => (
                <div key={i} className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                  <span>{passo}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}