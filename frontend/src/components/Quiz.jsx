import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award, ShieldCheck } from 'lucide-react';

const perguntas = [
  {
    id: 1,
    pergunta: "Você recebe uma mensagem no WhatsApp de um número desconhecido usando a foto do seu filho, dizendo que trocou de celular e precisa de um Pix urgente. O que fazer?",
    opcoes: [
      { texto: "Fazer o Pix imediatamente para ajudá-lo.", correta: false },
      { texto: "Ligar para o número antigo do seu filho para confirmar antes de enviar qualquer valor.", correta: true },
      { texto: "Enviar metade do valor solicitado para garantir.", correta: false }
    ],
    explicacao: "Golpistas usam fotos de familiares baixadas de redes sociais. Sempre confirme por chamada de voz ou de vídeo no número antigo do parente."
  },
  {
    id: 2,
    pergunta: "Uma ligação afirma ser do seu banco e avisa que sua conta foi invadida. O atendente pede para você digitar sua senha no teclado do telefone. Como proceder?",
    opcoes: [
      { texto: "Desligar imediatamente. Bancos nunca pedem senhas ou códigos por telefone.", correta: true },
      { texto: "Digitar a senha, pois o atendimento parece oficial.", correta: false },
      { texto: "Passar apenas a senha do cartão de débito.", correta: false }
    ],
    explicacao: "Instituições financeiras e gerentes jamais solicitam senhas ou códigos de validação por chamada telefônica."
  },
  {
    id: 3,
    pergunta: "Recebeu um SMS informando que ganhou R$ 5.000 em uma promoção e precisa clicar em um link para resgatar. Qual é a atitude correta?",
    opcoes: [
      { texto: "Clicar no link imediatamente para não perder o prêmio.", correta: false },
      { texto: "Ignorar e apagar a mensagem, pois trata-se de um link malicioso.", correta: true },
      { texto: "Encaminhar para os amigos para testar se funciona.", correta: false }
    ],
    explicacao: "Links de prêmios inesperados costumam instalar vírus ou direcionar para páginas falsas que roubam senhas."
  },
  {
    id: 4,
    pergunta: "Você recebe um e-mail informando que seu nome foi negativado no Serasa/SPC por uma dívida pendente, com um boleto em anexo. Como agir?",
    opcoes: [
      { texto: "Pagar o boleto rápido para limpar o nome.", correta: false },
      { texto: "Entrar diretamente no site ou aplicativo oficial do Serasa/Banco para verificar se há débitos reais.", correta: true },
      { texto: "Responder ao e-mail pedindo desconto.", correta: false }
    ],
    explicacao: "E-mails de cobrança genéricos costumam conter boletos adulterados. Verifique pendências diretamente nos canais oficiais."
  },
  {
    id: 5,
    pergunta: "Alguém liga dizendo que fez um Pix por engano para a sua conta e pede para você devolver o dinheiro fazendo um novo Pix para outra conta. O que fazer?",
    opcoes: [
      { texto: "Fazer o Pix para a conta que a pessoa indicou no telefone.", correta: false },
      { texto: "Usar a opção 'Devolver Pix' dentro do próprio aplicativo do seu banco no extrato da transação recebida.", correta: true },
      { texto: "Transferir o dinheiro via DOC/TED para o telefone de quem ligou.", correta: false }
    ],
    explicacao: "O recurso 'Devolver Pix' no app do banco devolve a quantia diretamente ao pagador original de forma segura, evitando cair no golpe da devolução duplicada."
  },
  {
    id: 6,
    pergunta: "Para aumentar a segurança do seu WhatsApp contra invasões e clonagens, qual funcionalidade é indispensável ativar?",
    opcoes: [
      { texto: "Confirmação/Verificação em duas etapas (PIN com senha de 6 dígitos).", correta: true },
      { texto: "Trocar a foto de perfil semanalmente.", correta: false },
      { texto: "Deixar o celular carregando o tempo todo.", correta: false }
    ],
    explicacao: "A verificação em duas etapas cria uma senha secreta que impede que invasores cadastrem seu WhatsApp em outro aparelho."
  },
  {
    id: 7,
    pergunta: "Você vai pagar uma compra via Pix lendo um QR Code ou chave fornecida pelo vendedor. Qual detalhe você DEVE conferir na tela antes de digitar a senha?",
    opcoes: [
      { texto: "Apenas o valor total.", correta: false },
      { texto: "O nome do destinatário (recebedor), o banco e o valor para garantir que é a loja/pessoa certa.", correta: true },
      { texto: "A hora em que a mensagem foi enviada.", correta: false }
    ],
    explicacao: "Muitos golpistas alteram chaves Pix ou boletos para direcionar o valor a contas de laranjas. Sempre confirme o nome do recebedor na tela de confirmação do banco."
  },
  {
    id: 8,
    pergunta: "Um anúncio nas redes sociais oferece um produto de alto valor por 10% do preço de mercado, exigindo pagamento exclusivo via Pix antecipado. É seguro?",
    opcoes: [
      { texto: "Sim, é uma promoção relâmpago imperdível.", correta: false },
      { texto: "Não. Preços excessivamente baixos com pagamento exclusivo via Pix costumam indicar lojas falsas.", correta: true },
      { texto: "Sim, desde que a foto do produto seja bonita.", correta: false }
    ],
    explicacao: "Descontos absurdos combinados com exigência de Pix direto costumam ser armadilhas de sites clonados que não entregam o produto."
  },
  {
    id: 9,
    pergunta: "Você recebe uma ligação robótica dizendo ser da central do cartão de crédito perguntando se você reconhece uma compra de R$ 2.500. A gravação diz: 'Digite 1 para SIM ou 2 para NÃO'. Como agir?",
    opcoes: [
      { texto: "Digitar 2 para cancelar a compra.", correta: false },
      { texto: "Desligar a ligação e ligar você mesmo para o número oficial impresso no verso do seu cartão físico.", correta: true },
      { texto: "Digitar 1 para ver quem atende.", correta: false }
    ],
    explicacao: "A ligação robótica serve para assustar a vítima e transferi-la para um falso atendente que pedirá dados bancários e senhas. Desligue e use o número do verso do cartão."
  },
  {
    id: 10,
    pergunta: "Um motoboy ou entregador chega à sua casa dizendo ser do banco para 'recolher o seu cartão que foi cancelado/clonado'. Você deve:",
    opcoes: [
      { texto: "Entregar o cartão cortado ao meio sem o chip.", correta: false },
      { texto: "Não entregar nada e fechar a porta. Bancos jamais mandam funcionários recolher cartões nas residências.", correta: true },
      { texto: "Entregar o cartão e a senha anotada no papel.", correta: false }
    ],
    explicacao: "Nenhuma instituição financeira envia entregadores ou motoboys para recolher cartões bancários em casa, mesmo que cortados."
  }
];

export default function Quiz() {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [pontuacao, setPontuacao] = useState(0);
  const [concluido, setConcluido] = useState(false);

  const questaoAtual = perguntas[indiceAtual];

  const handleResponder = (opcao) => {
    if (respostaSelecionada !== null) return;
    setRespostaSelecionada(opcao);
    if (opcao.correta) {
      setPontuacao(prev => prev + 1);
    }
  };

  const proximaPergunta = () => {
    setRespostaSelecionada(null);
    if (indiceAtual + 1 < perguntas.length) {
      setIndiceAtual(prev => prev + 1);
    } else {
      setConcluido(true);
    }
  };

  const reiniciarQuiz = () => {
    setIndiceAtual(0);
    setRespostaSelecionada(null);
    setPontuacao(0);
    setConcluido(false);
  };

  // Cálculo da porcentagem de acertos
  const percentual = Math.round((pontuacao / perguntas.length) * 100);

  if (concluido) {
    return (
      <div className="bg-slate-950/50 p-8 rounded-3xl border border-slate-800 text-center space-y-6">
        <div className="p-4 bg-blue-500/10 text-blue-400 rounded-full w-20 h-20 mx-auto flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-500/10">
          <Award className="w-10 h-10" />
        </div>
        
        <div>
          <h2 className="text-2xl font-black text-white">Quiz Concluído!</h2>
          <p className="text-slate-400 mt-2">
            Você acertou <strong className="text-blue-400 text-xl">{pontuacao}</strong> de <strong className="text-white text-xl">{perguntas.length}</strong> perguntas ({percentual}% de aproveitamento).
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl max-w-md mx-auto text-sm text-slate-300">
          {percentual >= 80 ? (
            <span className="text-emerald-400 font-bold flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Parabéns! Seu nível de conscientização contra golpes digitais é Excelente!
            </span>
          ) : (
            <span className="text-amber-400 font-bold">
              Atenção! Revise o Guia de Prevenção para reforçar seus conhecimentos e evitar ciladas virtuais.
            </span>
          )}
        </div>

        <button
          onClick={reiniciarQuiz}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold px-8 py-4 rounded-2xl transition-all cursor-pointer shadow-lg shadow-blue-600/20"
        >
          <RotateCcw className="w-5 h-5" />
          Refazer Quiz de Prevenção
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-950/50 p-8 rounded-3xl border border-slate-800 space-y-6 backdrop-blur-sm">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Quiz de Segurança GolpeZero</h2>
            <p className="text-xs text-slate-400">Teste seus conhecimentos contra fraudes</p>
          </div>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 bg-slate-900 text-blue-400 rounded-full border border-slate-800">
          Pergunta {indiceAtual + 1} de {perguntas.length}
        </span>
      </div>

      <p className="text-lg font-bold text-slate-100 leading-relaxed">{questaoAtual.pergunta}</p>

      <div className="space-y-3">
        {questaoAtual.opcoes.map((opcao, index) => {
          let estiloBtn = "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800";
          
          if (respostaSelecionada) {
            if (opcao.correta) {
              estiloBtn = "bg-emerald-500/20 border-emerald-500/80 text-emerald-300 font-bold";
            } else if (respostaSelecionada === opcao) {
              estiloBtn = "bg-red-500/20 border-red-500/80 text-red-300 font-bold";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleResponder(opcao)}
              disabled={respostaSelecionada !== null}
              className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${estiloBtn}`}
            >
              <span className="font-extrabold text-xs bg-slate-800 px-2.5 py-1 rounded-lg text-slate-400 mt-0.5">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1 text-sm md:text-base">{opcao.texto}</span>
            </button>
          );
        })}
      </div>

      {respostaSelecionada && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 animate-fade-in">
          <div className="flex items-center gap-2">
            {respostaSelecionada.correta ? (
              <span className="text-emerald-400 font-black flex items-center gap-1.5 text-base">
                <CheckCircle2 className="w-5 h-5"/> Resposta Correta!
              </span>
            ) : (
              <span className="text-red-400 font-black flex items-center gap-1.5 text-base">
                <XCircle className="w-5 h-5"/> Resposta Incorreta
              </span>
            )}
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{questaoAtual.explicacao}</p>
          
          <button
            onClick={proximaPergunta}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer mt-2 shadow-md shadow-blue-600/20"
          >
            {indiceAtual + 1 === perguntas.length ? 'Finalizar e Ver Desempenho' : 'Próxima Pergunta →'}
          </button>
        </div>
      )}
    </div>
  );
}