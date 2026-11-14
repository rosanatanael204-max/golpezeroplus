import React, { useState } from 'react';
import axios from 'axios';
import {
  ShieldCheck, Mail, Lock, User, Eye, EyeOff,
  ArrowRight, CheckCircle2, AlertCircle, HeartHandshake, Sparkles
} from 'lucide-react';

const API_URL = 'http://127.0.0.1:8080/api/v1/auth';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [tipoUsoLocal, setTipoUsoLocal] = useState('USUARIO_50_MAIS');

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    const nomeLimpo = formData.nome.trim();
    const emailLimpo = formData.email.trim().toLowerCase();
    const senhaDigitada = formData.senha;

    if (!emailLimpo || !emailLimpo.includes('@')) {
      setErro('Informe um e-mail válido.');
      return;
    }

    if (senhaDigitada.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (!isLogin && nomeLimpo.length < 3) {
      setErro('Informe seu nome completo (mínimo 3 letras).');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const response = await axios.post(`${API_URL}/login`, {
          email: emailLimpo,
          senha: senhaDigitada
        });

        onLoginSuccess({
          ...response.data,
          nome: response.data?.nome || emailLimpo.split('@')[0],
          email: response.data?.email || emailLimpo
        });
      } else {
        const response = await axios.post(`${API_URL}/cadastrar`, {
          nome: nomeLimpo,
          email: emailLimpo,
          senha: senhaDigitada,
          perfil: 'USUARIO'
        });

        setSucesso('Conta criada com sucesso! Entrando no painel...');
        setTimeout(() => {
          onLoginSuccess({
            ...response.data,
            nome: response.data?.nome || nomeLimpo,
            email: response.data?.email || emailLimpo,
            tipoUso: tipoUsoLocal
          });
        }, 700);
      }
    } catch (err) {
      if (!err.response) {
        setErro('Servidor backend offline (porta 8080). Inicie o Spring Boot e tente novamente.');
      } else {
        const status = err.response.status;
        const data = err.response.data;
        const msg =
          (typeof data === 'string' && data) ||
          data?.mensagem ||
          data?.message ||
          data?.error;

        if (status === 401 || status === 403) {
          setErro(msg || 'E-mail ou senha incorretos.');
        } else if (status === 400 || status === 409) {
          setErro(msg || 'Dados inválidos ou e-mail já cadastrado.');
        } else {
          setErro(`Erro ${status} no servidor: ${msg || 'Verifique o console do backend Java.'}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl w-full bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-[2rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.75)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Lado Esquerdo */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-8 lg:p-11 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl mb-8 shadow-sm">
              <ShieldCheck className="w-7 h-7 text-emerald-200" />
              <span className="font-extrabold tracking-wide text-lg">GolpeZero 50+</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4 tracking-tight">
              Sua tranquilidade digital em primeiro lugar.
            </h1>
            <p className="text-emerald-50/90 text-base leading-relaxed mb-8">
              Um assistente pessoal de segurança feito com letras grandes, linguagem simples e proteção em tempo real para você e sua família.
            </p>
          </div>

          <div className="space-y-3.5 text-sm text-emerald-50 border-t border-white/15 pt-6 relative z-10">
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
              <span>Verificador inteligente de SMS, Pix e links</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
              <span>Assistente Virtual 24h com leitura em voz alta</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
              <span>Comunidade ativa com alertas reais</span>
            </div>
          </div>
        </div>

        {/* Lado Direito */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-white">
              {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta gratuita'}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {isLogin
                ? 'Entre com seu e-mail e senha cadastrados no banco de dados.'
                : 'Preencha os dados abaixo para registrar sua conta.'}
            </p>
          </div>

          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-7">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setErro(''); setSucesso(''); }}
              className={`flex-1 py-3 text-base font-bold rounded-xl transition-all cursor-pointer ${
                isLogin
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Entrar na Conta
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setErro(''); setSucesso(''); }}
              className={`flex-1 py-3 text-base font-bold rounded-xl transition-all cursor-pointer ${
                !isLogin
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Criar Nova Conta
            </button>
          </div>

          {erro && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/40 text-red-200 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{erro}</span>
            </div>
          )}

          {sucesso && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 flex items-start gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{sucesso}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Seu Nome Completo
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="nome"
                      required
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Ex: Maria Helena da Silva"
                      className="w-full bg-slate-950 border border-slate-700/80 focus:border-emerald-500 rounded-2xl py-3.5 pl-12 pr-4 text-base text-white placeholder-slate-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Perfil de Uso
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTipoUsoLocal('USUARIO_50_MAIS')}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 cursor-pointer ${
                        tipoUsoLocal === 'USUARIO_50_MAIS'
                          ? 'bg-emerald-600/15 border-emerald-500 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-bold text-sm">Para Mim (50+)</div>
                        <div className="text-xs opacity-75">Quero me proteger</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTipoUsoLocal('FAMILIAR')}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 cursor-pointer ${
                        tipoUsoLocal === 'FAMILIAR'
                          ? 'bg-blue-600/15 border-blue-500 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <HeartHandshake className="w-6 h-6 text-blue-400 shrink-0" />
                      <div>
                        <div className="font-bold text-sm">Familiar / Filho</div>
                        <div className="text-xs opacity-75">Ajudar alguém</div>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Seu E-mail
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seuemail@exemplo.com"
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-emerald-500 rounded-2xl py-3.5 pl-12 pr-4 text-base text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Sua Senha
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="senha"
                  required
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder={isLogin ? 'Digite sua senha' : 'Mínimo 6 caracteres'}
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-emerald-500 rounded-2xl py-3.5 pl-12 pr-12 text-base text-white placeholder-slate-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:brightness-110 disabled:opacity-50 text-white font-extrabold text-lg py-4 rounded-2xl shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
            >
              {loading ? (
                <span>Autenticando no servidor...</span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{isLogin ? 'Acessar Minha Proteção' : 'Concluir Cadastro'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-7">
            Protegido com criptografia BCrypt, Spring Security & PostgreSQL
          </p>
        </div>
      </div>
    </div>
  );
}