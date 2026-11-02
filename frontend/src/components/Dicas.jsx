import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Smartphone, 
  CreditCard, 
  QrCode, 
  ShoppingBag, 
  AlertOctagon, 
  UserX, 
  FileText, 
  PhoneOff,
  ChevronDown,
  Info,
  ExternalLink
} from 'lucide-react';

const listaDicas = [
  {
    id: 1,
    icone: UserX,
    cor: "amber",
    titulo: "1. Desconfie do Golpe do Falso Parente",
    descricao: "Se um familiar pedir dinheiro por um número novo no WhatsApp alegando ter trocado de aparelho, nunca faça o Pix. Ligue imediatamente para o número antigo do parente para confirmar."
  },
  {
    id: 2,
    icone: Lock,
    cor: "blue",
    titulo: "2. Bancos nunca pedem senhas por telefone",
    descricao: "Instituições financeiras, gerentes e centrais de atendimento jamais solicitam senhas, códigos de validação por SMS ou digitação do PIN no teclado da chamada."
  },
  {
    id: 3,
    icone: Smartphone,
    cor: "emerald",
    titulo: "3. Ative a Verificação em Duas Etapas",
    descricao: "No WhatsApp, acesse Configurações > Conta > Confirmação em duas etapas e crie um PIN de 6 dígitos. Isso impede que invadam ou clonem o seu aplicativo."
  },
  {
    id: 4,
    icone: QrCode,
    cor: "purple",
    titulo: "4. Confira o nome do destinatário no Pix",
    descricao: "Antes de digitar a senha e confirmar qualquer transferência Pix ou leitura de QR Code, verifique na tela do banco o nome completo do recebedor e a instituição."
  },
  {
    id: 5,
    icone: PhoneOff,
    cor: "red",
    titulo: "5. Cuidado com a 'Falsa Central de Atendimento'",
    descricao: "Recebeu uma ligação robótica dizendo que uma compra de alto valor foi feita no seu cartão? Desligue. Ligue você mesmo para o número impresso no verso do seu cartão físico."
  },
  {
    id: 6,
    icone: CreditCard,
    cor: "indigo",
    titulo: "6. Jamais entregue cartões a motoboys/entregadores",
    descricao: "Nenhum banco envia funcionários ou estafetas para recolher cartões bancários em casa, mesmo que aleguem que o cartão foi clonado ou cortado ao meio."
  },
  {
    id: 7,
    icone: FileText,
    cor: "cyan",
    titulo: "7. Verifique o código de barras antes de pagar boletos",
    descricao: "Boletos falsos enviados por e-mail ou WhatsApp alteram o nome do beneficiário. Ao escanear o boleto no app do banco, confirme se o recebedor é a empresa correta."
  },
  {
    id: 8,
    icone: ShoppingBag,
    cor: "rose",
    titulo: "8. Cuidado com ofertas com preços excessivamente baixos",
    descricao: "Anúncios em redes sociais oferecendo celulares ou eletrodomésticos com 90% de desconto e exigindo pagamento exclusivo via Pix costumam ser sites falsos."
  },
  {
    id: 9,
    icone: AlertOctagon,
    cor: "orange",
    titulo: "9. Use o recurso 'Devolver Pix' em transferências suspeitas",
    descricao: "Se alguém alegar que enviou um Pix por engano e pedir devolução para outra conta, não faça uma nova transferência. Use a opção 'Devolver' dentro do extrato do seu app bancário."
  },
  {
    id: 10,
    icone: ShieldAlert,
    cor: "emerald",
    titulo: "10. Não clique em links de prêmios ou recadastramento",
    descricao: "Mensagens via SMS ou e-mail prometendo prêmios do Governo, atualização cadastral urgente ou liberação de valores esquecidos costumam conter vírus rouba-senhas."
  }
];

const tiposGolpes = [
  {
    titulo: "Golpe do Pix Errado / Falso Estorno",
    descricao: "O golpista faz uma transferência usando um comprovante agendado (ou falso) e liga dizendo que enviou por engano. Depois, cancela o agendamento e fica com o dinheiro que você 'devolveu'.",
    prevencao: "Confira se o dinheiro realmente caiu no saldo antes de tomar qualquer atitude e use somente a funcionalidade nativa 'Devolver Pix' no app bancário."
  },
  {
    titulo: "Golpe da Mão Fantasma (Acesso Remoto)",
    descricao: "O criminoso liga fingindo ser do suporte técnico do banco e pede para você instalar um aplicativo de 'segurança' (como AnyDesk ou TeamViewer). Esse app permite ao golpista controlar o seu telemóvel à distância.",
    prevencao: "Nunca instale aplicativos indicados por pessoas durante chamadas telefónicas."
  },
  {
    titulo: "Golpe do Falso Empréstimo",
    descricao: "Anúncios oferecem crédito pré-aprovado fácil sem consulta ao SPC/Serasa, mas exigem o pagamento antecipado de uma 'taxa de fiador' ou 'imposto de cartório'.",
    prevencao: "Nenhuma empresa de crédito séria exige pagamento prévio para liberar empréstimos."
  }
];

export default function Dicas() {
  const [secaoAtiva, setSecaoAtiva] = useState('dicas');

  return (
    <div className="bg-slate-950/50 p-8 rounded-3xl border border-slate-800 space-y-8 backdrop-blur-sm">
      
      {/* Seleção de Sub-Aba */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white">Guia de Proteção e Prevenção</h2>
          <p className="text-slate-400 text-sm mt-1">Orientações práticas para proteger o seu património digital</p>
        </div>
        
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setSecaoAtiva('dicas')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              secaoAtiva === 'dicas' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            10 Dicas Rápidas
          </button>
          <button
            onClick={() => setSecaoAtiva('detalhes')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              secaoAtiva === 'detalhes' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Entenda os Golpes
          </button>
        </div>
      </div>

      {secaoAtiva === 'dicas' ? (
        /* Lista das 10 Dicas */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listaDicas.map((item) => {
            const Icone = item.icone;
            return (
              <div 
                key={item.id} 
                className="p-5 bg-slate-900/80 border border-slate-800/80 rounded-2xl space-y-2 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl w-fit border border-blue-500/20">
                    <Icone className="w-5 h-5" />
                  </div>
                  <strong className="text-white font-extrabold block text-base leading-snug">
                    {item.titulo}
                  </strong>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                    {item.descricao}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Explicação Completa dos Golpes Frequentes */
        <div className="space-y-6">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-3 text-blue-300 text-sm">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" />
            <p>
              Conhecer a mecânica utilizada pelos criminosos é o passo mais eficaz para não ser vítima de enganos e fraudes financeiras.
            </p>
          </div>

          <div className="space-y-4">
            {tiposGolpes.map((golpe, idx) => (
              <div key={idx} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  {golpe.titulo}
                </h3>
                
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Como Funciona</span>
                  <p className="text-slate-300 text-sm leading-relaxed">{golpe.descricao}</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/60 text-xs">
                  <span className="font-bold text-emerald-400 block mb-0.5">Como se proteger:</span>
                  <span className="text-slate-300">{golpe.prevencao}</span>
                </div>
              </div>
            ))}
          </div>

          {/* O que fazer se caiu num golpe */}
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl space-y-3 text-red-200">
            <h3 className="text-base font-bold text-red-400 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Caiu num golpe? Tome estas medidas imediatas:
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-xs md:text-sm text-red-200/90 leading-relaxed">
              <li>Ligue imediatamente para o seu banco e solicite o bloqueio das senhas e da conta.</li>
              <li>Peça ao banco o acionamento do <strong>MED (Mecanismo Especial de Devolução)</strong> do Pix.</li>
              <li>Registe um Boletim de Ocorrência (BO) na Polícia Civil (pode ser feito pela internet).</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}