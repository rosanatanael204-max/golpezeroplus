import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Sparkles, HelpCircle, BookOpen, MessageSquare,
  Bot, Users, HeartHandshake
} from 'lucide-react';

import Auth from './components/Auth';
import Header from './components/Header';
import Verificador from './components/Verificador';
import Quiz from './components/Quiz';
import Dicas from './components/Dicas';
import Historico from './components/Historico';
import ChatRelato from './components/ChatRelato';
import AssistenteVirtual from './components/AssistenteVirtual';
import Comunidade from './components/Comunidade';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [historico, setHistorico] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('verificador');
  const [fonteGrande, setFonteGrande] = useState(false);
  const [modoClaro, setModoClaro] = useState(true);

  useEffect(() => {
    const salvo = localStorage.getItem('golpezero_usuario');
    if (salvo) {
      setUsuario(JSON.parse(salvo));
    }
  }, []);

  const handleLoginSuccess = (dadosUsuario) => {
    setUsuario(dadosUsuario);
    localStorage.setItem('golpezero_usuario', JSON.stringify(dadosUsuario));
  };

  const handleLogout = () => {
    setUsuario(null);
    setResultado(null);
    setMensagem('');
    localStorage.removeItem('golpezero_usuario');
  };

  const handleVerificarGolpe = async (e) => {
    if (e) e.preventDefault();
    if (!mensagem || !mensagem.trim()) {
      setErro('Por favor, cole ou digite uma mensagem para realizar a análise.');
      return;
    }

    setCarregando(true);
    setErro('');
    setResultado(null);

    try {
      const response = await axios.post('http://127.0.0.1:8080/api/v1/analise/verificar', {
        mensagem: mensagem
      });

      const dados = response.data;
      setResultado(dados);

      setHistorico(prev => [{
        id: Date.now(),
        texto: mensagem,
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        resultado: dados
      }, ...prev]);

    } catch (err) {
      if (err.response) {
        setErro(`Erro ${err.response.status} do Servidor: ${JSON.stringify(err.response.data)}`);
      } else {
        setErro('Não foi possível conectar ao servidor backend (porta 8080).');
      }
    } finally {
      setCarregando(false);
    }
  };

  // Exibe a tela completa de Login e Cadastro se não houver usuário logado
  if (!usuario) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  const menuCards = [
    {
      id: 'verificador',
      titulo: 'Analisar Mensagem',
      subtitulo: 'Checar SMS, Pix ou link',
      icon: Sparkles,
      corAtiva: 'from-emerald-600 to-teal-600 shadow-emerald-600/25'
    },
    {
      id: 'assistente',
      titulo: 'Assistente 24h',
      subtitulo: 'Tirar dúvidas com calma',
      icon: Bot,
      corAtiva: 'from-blue-600 to-indigo-600 shadow-blue-600/25'
    },
    {
      id: 'comunidade',
      titulo: 'Comunidade',
      subtitulo: 'Alertas reais de membros',
      icon: Users,
      corAtiva: 'from-cyan-600 to-blue-600 shadow-cyan-600/25'
    },
    {
      id: 'chat',
      titulo: 'Relatar Golpe',
      subtitulo: 'Registrar ocorrência',
      icon: MessageSquare,
      corAtiva: 'from-amber-500 to-orange-600 shadow-amber-600/25'
    },
    {
      id: 'quiz',
      titulo: 'Quiz Educativo',
      subtitulo: 'Treinar sua atenção',
      icon: HelpCircle,
      corAtiva: 'from-violet-600 to-purple-600 shadow-violet-600/25'
    },
    {
      id: 'dicas',
      titulo: 'Guia de Dicas',
      subtitulo: 'Regras de ouro diárias',
      icon: BookOpen,
      corAtiva: 'from-teal-600 to-emerald-700 shadow-teal-600/25'
    }
  ];

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        modoClaro
          ? 'bg-slate-100/90 text-slate-900 selection:bg-emerald-600 selection:text-white'
          : 'bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white'
      } ${fonteGrande ? 'text-lg' : 'text-base'}`}
    >
      <Header
        usuario={usuario}
        fonteGrande={fonteGrande}
        setFonteGrande={setFonteGrande}
        modoClaro={modoClaro}
        setModoClaro={setModoClaro}
        handleLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Banner Superior de Boas-Vindas */}
        <div className="rounded-[2rem] bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4 text-amber-300" />
              <span>Cuidado Digital em Primeiro Lugar</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Recebeu uma mensagem suspeita? Verifique antes de clicar.
            </h1>
            <p className="text-emerald-50/90 text-sm sm:text-base max-w-2xl">
              Escolha uma das ferramentas abaixo ou converse agora mesmo com o Guardião Digital.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAbaAtiva('assistente')}
            className="bg-white text-emerald-800 hover:bg-emerald-50 font-extrabold px-5 py-3.5 rounded-2xl shadow-lg flex items-center gap-2.5 shrink-0 cursor-pointer transition-transform hover:scale-105 text-sm"
          >
            <Bot className="w-5 h-5 text-emerald-600" />
            <span>Falar com Assistente</span>
          </button>
        </div>

        {/* Grade Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-6">
            
            {/* Menu em Cartões Grandes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {menuCards.map((item) => {
                const Icone = item.icon;
                const ativo = abaAtiva === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAbaAtiva(item.id)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all duration-200 cursor-pointer ${
                      ativo
                        ? `bg-gradient-to-br ${item.corAtiva} border-transparent text-white shadow-lg -translate-y-0.5`
                        : modoClaro
                          ? 'bg-white border-slate-200/90 text-slate-800 hover:border-emerald-400 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        ativo
                          ? 'bg-white/20 text-white'
                          : modoClaro
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-slate-800 text-emerald-400'
                      }`}
                    >
                      <Icone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm leading-tight">{item.titulo}</div>
                      <div
                        className={`text-xs mt-0.5 ${
                          ativo ? 'text-white/90' : modoClaro ? 'text-slate-500' : 'text-slate-400'
                        }`}
                      >
                        {item.subtitulo}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Área de Conteúdo dos Módulos */}
            <div className="rounded-3xl">
              {abaAtiva === 'verificador' && (
                <Verificador
                  mensagem={mensagem}
                  setMensagem={setMensagem}
                  handleVerificarGolpe={handleVerificarGolpe}
                  carregando={carregando}
                  erro={erro}
                  resultado={resultado}
                />
              )}

              {abaAtiva === 'assistente' && <AssistenteVirtual usuario={usuario} />}

              {abaAtiva === 'comunidade' && <Comunidade usuario={usuario} />}

              {abaAtiva === 'chat' && <ChatRelato />}

              {abaAtiva === 'quiz' && <Quiz />}

              {abaAtiva === 'dicas' && <Dicas />}
            </div>
          </section>

          {/* Barra Lateral */}
          <aside className="space-y-6">
            <Historico historico={historico} />
          </aside>
        </div>
      </main>

      {/* Botão Flutuante de Socorro / Assistente */}
      {abaAtiva !== 'assistente' && (
        <button
          type="button"
          onClick={() => setAbaAtiva('assistente')}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-extrabold px-5 py-4 rounded-full shadow-2xl shadow-emerald-700/40 flex items-center gap-2.5 z-30 transition-transform hover:scale-105 cursor-pointer text-sm"
        >
          <Bot className="w-5 h-5" />
          <span>Precisa de Ajuda?</span>
        </button>
      )}
    </div>
  );
}