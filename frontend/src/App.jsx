import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, HelpCircle, BookOpen, MessageSquare } from 'lucide-react';

import Header from './components/Header';
import Verificador from './components/Verificador';
import Quiz from './components/Quiz';
import Dicas from './components/Dicas';
import Historico from './components/Historico';
import ChatRelato from './components/ChatRelato';

export default function App() {
  const [usuario, setUsuario] = useState({ nome: 'Nataniel', email: 'rosanatanael204@gmail.com' });
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [historico, setHistorico] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('verificador');
  const [fonteGrande, setFonteGrande] = useState(false);

  const handleLogout = () => {
    setUsuario(null);
    setResultado(null);
    setMensagem('');
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

  if (!usuario) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center space-y-4 max-w-sm w-full shadow-2xl">
          <h1 className="text-2xl font-black text-white">GolpeZero 50+</h1>
          <p className="text-xs text-slate-400">Proteção Inteligente contra Fraudes</p>
          <button 
            onClick={() => setUsuario({ nome: 'Nataniel', email: 'rosanatanael204@gmail.com' })} 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 rounded-xl cursor-pointer transition-all shadow-lg shadow-blue-600/20 text-sm"
          >
            Acessar Painel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white ${fonteGrande ? 'text-lg' : 'text-base'}`}>
      
      <Header 
        usuario={usuario} 
        fonteGrande={fonteGrande} 
        setFonteGrande={setFonteGrande} 
        handleLogout={handleLogout} 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <section className="lg:col-span-2 space-y-6">
          
          {/* Navegação Pro Tab Bar */}
          <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner overflow-x-auto">
            <button
              onClick={() => setAbaAtiva('verificador')}
              className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider ${
                abaAtiva === 'verificador' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Verificador
            </button>

            <button
              onClick={() => setAbaAtiva('chat')}
              className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider ${
                abaAtiva === 'chat' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Relatar Golpe
            </button>

            <button
              onClick={() => setAbaAtiva('quiz')}
              className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider ${
                abaAtiva === 'quiz' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              Quiz Educativo
            </button>

            <button
              onClick={() => setAbaAtiva('dicas')}
              className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider ${
                abaAtiva === 'dicas' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Guia Dicas
            </button>
          </div>

          {/* Renderização dos Módulos */}
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

          {abaAtiva === 'chat' && <ChatRelato />}

          {abaAtiva === 'quiz' && <Quiz />}

          {abaAtiva === 'dicas' && <Dicas />}

        </section>

        {/* Sidebar Lateral */}
        <aside className="space-y-6">
          <Historico historico={historico} />
        </aside>

      </main>
    </div>
  );
}