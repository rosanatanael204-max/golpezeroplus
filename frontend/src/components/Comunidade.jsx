import React, { useState, useEffect } from 'react';
import {
  Users, Send, ThumbsUp, MessageCircle, Search,
  MapPin, ShieldAlert, CheckCircle2, Filter, PlusCircle
} from 'lucide-react';
import { POSTS_INICIAIS_COMUNIDADE } from '../data/baseConhecimento';

export default function Comunidade({ usuario, tema = {} }) {
  const modoClaro = tema.modoClaro || false;
  const bgCard = tema.bgCard || (modoClaro ? 'bg-white border-slate-200 shadow-lg' : 'bg-slate-900/90 border-slate-800 shadow-xl');
  const bgSubCard = tema.bgSubCard || (modoClaro ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800');
  const bgInput = tema.bgInput || (modoClaro ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white');
  const textMuted = tema.textMuted || (modoClaro ? 'text-slate-600' : 'text-slate-400');

  const [posts, setPosts] = useState(() => {
    const salvo = localStorage.getItem('golpezero_comunidade_posts');
    return salvo ? JSON.parse(salvo) : POSTS_INICIAIS_COMUNIDADE;
  });

  // Formulário de novo relato
  const [tituloPost, setTituloPost] = useState('');
  const [categoriaPost, setCategoriaPost] = useState('Golpe do WhatsApp');
  const [cidadePost, setCidadePost] = useState('Aracaju - SE');
  const [textoPost, setTextoPost] = useState('');
  const [avisoSucesso, setAvisoSucesso] = useState('');

  // Filtros e busca
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [busca, setBusca] = useState('');

  // Comentários por post
  const [comentariosAbertos, setComentariosAbertos] = useState({ 101: true });
  const [novoComentario, setNovoComentario] = useState({});

  useEffect(() => {
    localStorage.setItem('golpezero_comunidade_posts', JSON.stringify(posts));
  }, [posts]);

  const publicarRelato = (e) => {
    e.preventDefault();
    if (!tituloPost.trim() || !textoPost.trim()) return;

    const novo = {
      id: Date.now(),
      autor: usuario?.nome || 'Membro Protegido',
      cidade: cidadePost.trim() || 'Brasil',
      categoria: categoriaPost,
      nivelRisco: 'ALTO',
      tempo: 'Agora mesmo',
      titulo: tituloPost.trim(),
      texto: textoPost.trim(),
      curtidas: 1,
      curtidoPorMim: true,
      comentarios: []
    };

    setPosts([novo, ...posts]);
    setTituloPost('');
    setTextoPost('');
    setAvisoSucesso('Seu relato foi publicado na Comunidade e já está ajudando outras pessoas!');
    setTimeout(() => setAvisoSucesso(''), 4000);
  };

  const alternarCurtida = (id) => {
    setPosts(
      posts.map((p) => {
        if (p.id !== id) return p;
        const jaCurtiu = p.curtidoPorMim;
        return {
          ...p,
          curtidoPorMim: !jaCurtiu,
          curtidas: jaCurtiu ? p.curtidas - 1 : p.curtidas + 1
        };
      })
    );
  };

  const adicionarComentario = (e, postId) => {
    e.preventDefault();
    const texto = (novoComentario[postId] || '').trim();
    if (!texto) return;

    setPosts(
      posts.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comentarios: [
            ...(p.comentarios || []),
            {
              id: Date.now(),
              autor: usuario?.nome || 'Membro da Comunidade',
              texto
            }
          ]
        };
      })
    );

    setNovoComentario({ ...novoComentario, [postId]: '' });
    setComentariosAbertos({ ...comentariosAbertos, [postId]: true });
  };

  const categorias = [
    'Todos',
    'Golpe do WhatsApp',
    'Falso INSS',
    'Falso Banco / 0800',
    'Pix / Compras',
    'Dica de Proteção'
  ];

  const postsFiltrados = posts.filter((post) => {
    const bateCategoria = filtroCategoria === 'Todos' || post.categoria === filtroCategoria;
    const termo = busca.toLowerCase();
    const bateBusca =
      post.titulo.toLowerCase().includes(termo) ||
      post.texto.toLowerCase().includes(termo) ||
      post.autor.toLowerCase().includes(termo) ||
      post.cidade.toLowerCase().includes(termo);
    return bateCategoria && bateBusca;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* COLUNA ESQUERDA: FORMULÁRIO DE NOVO RELATO */}
      <div className={`lg:col-span-5 border rounded-3xl p-6 h-fit ${bgCard}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold">Compartilhar Alerta</h2>
            <p className={`text-xs ${textMuted}`}>Ajude outros membros contando sua experiência</p>
          </div>
        </div>

        {avisoSucesso && (
          <div className="my-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs sm:text-sm font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{avisoSucesso}</span>
          </div>
        )}

        <form onSubmit={publicarRelato} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5 opacity-80">
              Título do Alerta ou Dica
            </label>
            <input
              type="text"
              required
              value={tituloPost}
              onChange={(e) => setTituloPost(e.target.value)}
              placeholder="Ex: Ligação falsa dizendo ser gerente do banco"
              className={`w-full border rounded-2xl p-3.5 outline-none focus:border-cyan-500 ${bgInput}`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5 opacity-80">
                Categoria
              </label>
              <select
                value={categoriaPost}
                onChange={(e) => setCategoriaPost(e.target.value)}
                className={`w-full border rounded-2xl p-3.5 font-semibold outline-none ${bgInput}`}
              >
                <option value="Golpe do WhatsApp">Golpe do WhatsApp</option>
                <option value="Falso INSS">Falso INSS</option>
                <option value="Falso Banco / 0800">Falso Banco / 0800</option>
                <option value="Pix / Compras">Pix / Compras</option>
                <option value="Dica de Proteção">Dica de Proteção</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5 opacity-80">
                Cidade / Estado
              </label>
              <input
                type="text"
                value={cidadePost}
                onChange={(e) => setCidadePost(e.target.value)}
                placeholder="Ex: Aracaju - SE"
                className={`w-full border rounded-2xl p-3.5 outline-none ${bgInput}`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5 opacity-80">
              Conte o que aconteceu (com detalhes)
            </label>
            <textarea
              rows={4}
              required
              value={textoPost}
              onChange={(e) => setTextoPost(e.target.value)}
              placeholder="Descreva como tentaram aplicar o golpe e como você descobriu..."
              className={`w-full border rounded-2xl p-3.5 outline-none focus:border-cyan-500 ${bgInput}`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white font-extrabold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Publicar na Comunidade</span>
          </button>
        </form>

        <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs leading-relaxed">
          <strong className="text-amber-500">Segurança na Comunidade:</strong> Nunca publique seu CPF, número de conta bancária, senhas ou endereço completo nos relatos.
        </div>
      </div>

      {/* COLUNA DIREITA: FEED DA COMUNIDADE */}
      <div className="lg:col-span-7 space-y-5">
        {/* Barra de Pesquisa e Filtros */}
        <div className={`border rounded-3xl p-5 space-y-4 ${bgCard}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-500" />
              <h2 className="font-extrabold text-lg">Mural da Comunidade ({postsFiltrados.length})</h2>
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
              Rede Solidária 50+
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar relatos por palavra (Ex: INSS, Pix, filho, banco)..."
              className={`w-full border rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:border-cyan-500 ${bgInput}`}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            {categorias.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFiltroCategoria(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap border transition cursor-pointer ${
                  filtroCategoria === cat
                    ? 'bg-cyan-600 border-cyan-500 text-white'
                    : `${bgSubCard} ${textMuted} hover:border-cyan-500`
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Relatos */}
        {postsFiltrados.length === 0 ? (
          <div className={`border rounded-3xl p-8 text-center ${bgCard}`}>
            <p className="font-bold mb-1">Nenhum relato encontrado com esse filtro.</p>
            <p className={`text-sm ${textMuted}`}>Tente limpar a busca ou selecionar "Todos".</p>
          </div>
        ) : (
          postsFiltrados.map((post) => {
            const totalComentarios = post.comentarios?.length || 0;
            const aberto = !!comentariosAbertos[post.id];

            return (
              <article key={post.id} className={`border rounded-3xl p-6 space-y-4 ${bgCard}`}>
                {/* Cabeçalho do Post */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-extrabold text-lg flex items-center justify-center shadow">
                      {post.autor.charAt(0)}
                    </div>
                    <div>
                      <div className="font-extrabold">{post.autor}</div>
                      <div className={`flex flex-wrap items-center gap-2 text-xs ${textMuted}`}>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                          {post.cidade}
                        </span>
                        <span>•</span>
                        <span>{post.tempo}</span>
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-extrabold bg-cyan-500/15 text-cyan-500 border border-cyan-500/30 px-3 py-1 rounded-full">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {post.categoria}
                  </span>
                </div>

                {/* Título e Corpo */}
                <div>
                  <h3 className="text-lg font-extrabold mb-1.5">{post.titulo}</h3>
                  <p className="leading-relaxed opacity-95">{post.texto}</p>
                </div>

                {/* Ações (Curtir e Comentários) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-700/20">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => alternarCurtida(post.id)}
                      className={`flex items-center gap-1.5 text-sm font-extrabold px-3.5 py-2 rounded-xl border transition cursor-pointer ${
                        post.curtidoPorMim
                          ? 'bg-blue-600 text-white border-blue-500'
                          : `${bgSubCard} text-blue-500 hover:border-blue-500`
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Alerta Útil ({post.curtidas})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setComentariosAbertos({ ...comentariosAbertos, [post.id]: !aberto })
                      }
                      className={`flex items-center gap-1.5 text-sm font-bold px-3.5 py-2 rounded-xl border transition cursor-pointer ${bgSubCard} ${textMuted} hover:text-cyan-500`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Comentários ({totalComentarios})</span>
                    </button>
                  </div>
                </div>

                {/* Seção de Comentários */}
                {aberto && (
                  <div className={`p-4 rounded-2xl border space-y-3 ${bgSubCard}`}>
                    {totalComentarios > 0 && (
                      <div className="space-y-2.5">
                        {post.comentarios.map((c) => (
                          <div
                            key={c.id}
                            className={`p-3 rounded-xl border text-sm ${
                              modoClaro ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                            }`}
                          >
                            <div className="font-extrabold text-xs text-cyan-500 mb-0.5">
                              {c.autor}
                            </div>
                            <p className="leading-snug">{c.texto}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <form
                      onSubmit={(e) => adicionarComentario(e, post.id)}
                      className="flex gap-2 pt-1"
                    >
                      <input
                        type="text"
                        value={novoComentario[post.id] || ''}
                        onChange={(e) =>
                          setNovoComentario({ ...novoComentario, [post.id]: e.target.value })
                        }
                        placeholder="Escreva uma mensagem de apoio ou dúvida..."
                        className={`flex-1 border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500 ${bgInput}`}
                      />
                      <button
                        type="submit"
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm cursor-pointer"
                      >
                        Comentar
                      </button>
                    </form>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}