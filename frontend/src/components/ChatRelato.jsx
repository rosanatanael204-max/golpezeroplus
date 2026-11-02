import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertTriangle, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';

export default function ChatRelato() {
  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      remetente: 'bot',
      texto: 'Olá! Sou o assistente virtual do GolpeZero 50+. Estou aqui para ajudar você a registrar um relato de golpe ou tirar dúvidas sobre o que fazer agora.',
      data: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 2,
      remetente: 'bot',
      texto: 'Por favor, descreva brevemente o que aconteceu (ex: "Fiz um Pix para um falso parente" ou "Recebi uma ligação do falso banco").',
      data: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputTexto, setInputTexto] = useState('');
  const [carregando, setCarregando] = useState(false);
  const fimChatRef = useRef(null);

  // Rola automaticamente para o fim da conversa
  useEffect(() => {
    fimChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, carregando]);

  const handleEnviarMensagem = (e) => {
    e.preventDefault();
    if (!inputTexto.trim()) return;

    const textoUsuario = inputTexto;
    const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // Adiciona a mensagem do usuário no chat
    const novaMensagemUsuario = {
      id: Date.now(),
      remetente: 'usuario',
      texto: textoUsuario,
      data: horaAtual
    };

    setMensagens((prev) => [...prev, novaMensagemUsuario]);
    setInputTexto('');
    setCarregando(true);

    // Simulação do processamento da resposta orientativa do assistente
    setTimeout(() => {
      let respostaBot = "Agradecemos o seu relato. Lembre-se de nunca transferir mais valores e de guardar todos os comprovantes e prints da conversa.";
      
      const textoLower = textoUsuario.toLowerCase();

      if (textoLower.includes('pix') || textoLower.includes('transferencia') || textoLower.includes('dinheiro')) {
        respostaBot = "Se você realizou um Pix para um golpista:\n1. Ligue imediatamente para o seu banco e solicite o acionamento do MED (Mecanismo Especial de Devolução).\n2. Registre um Boletim de Ocorrência (BO) online informando a chave Pix e a conta de destino.";
      } else if (textoLower.includes('cartao') || textoLower.includes('senha') || textoLower.includes('banco')) {
        respostaBot = "Se você informou senhas ou dados de cartão:\n1. Entre no app do banco e bloqueie o cartão afetado imediatamente.\n2. Altere suas senhas de acesso bancário em um aparelho seguro.";
      } else if (textoLower.includes('whatsapp') || textoLower.includes('codigo') || textoLower.includes('sms')) {
        respostaBot = "Se seu WhatsApp foi invadido ou usaram seu nome:\n1. Avise seus contatos por ligação ou outras redes sociais para não enviarem dinheiro.\n2. Tente refazer o login no WhatsApp para desconectar o invasor e ative a confirmação em duas etapas.";
      }

      setMensagens((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          remetente: 'bot',
          texto: respostaBot,
          data: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setCarregando(false);
    }, 1200);
  };

  const reiniciarChat = () => {
    setMensagens([
      {
        id: 1,
        remetente: 'bot',
        texto: 'Conversa reiniciada. Como posso orientar você no registro do relato?',
        data: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="bg-slate-950/50 rounded-3xl border border-slate-800 flex flex-col h-[600px] overflow-hidden backdrop-blur-sm shadow-xl">
      
      {/* Topo do Chat */}
      <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              Assistente de Ocorrências
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-xs text-slate-400">Canal direto de orientação e apoio pós-golpe</p>
          </div>
        </div>

        <button
          onClick={reiniciarChat}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          title="Reiniciar Conversa"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/30">
        {mensagens.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.remetente === 'usuario' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.remetente === 'usuario'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-blue-400 border border-slate-700'
              }`}
            >
              {msg.remetente === 'usuario' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.remetente === 'usuario'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'
              }`}
            >
              <p>{msg.texto}</p>
              <span
                className={`text-[10px] block mt-1.5 font-bold ${
                  msg.remetente === 'usuario' ? 'text-blue-200 text-right' : 'text-slate-500'
                }`}
              >
                {msg.data}
              </span>
            </div>
          </div>
        ))}

        {carregando && (
          <div className="flex gap-3 max-w-[85%] mr-auto items-center text-slate-400 text-xs bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <Bot className="w-4 h-4 animate-spin text-blue-400" />
            <span>Assistente escrevendo orientações...</span>
          </div>
        )}

        <div ref={fimChatRef} />
      </div>

      {/* Formulário de Envio */}
      <form onSubmit={handleEnviarMensagem} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3">
        <input
          type="text"
          value={inputTexto}
          onChange={(e) => setInputTexto(e.target.value)}
          placeholder="Digite seu relato ou dúvida aqui..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
        />

        <button
          type="submit"
          disabled={!inputTexto.trim() || carregando}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </form>
    </div>
  );
}