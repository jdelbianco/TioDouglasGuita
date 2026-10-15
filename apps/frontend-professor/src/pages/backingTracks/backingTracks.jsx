import { useState, useEffect } from 'react';
import { Search, Music, Trash2, AlertTriangle, Plus, PlayCircle, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import Navbar from "../../components/navBar";

function BackingTracks() {
  const [tracks, setTracks] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  // Estados do formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Estados do Modal de Exclusão
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackParaExcluir, setTrackParaExcluir] = useState(null);

  useEffect(() => {
    carregarTracks();
  }, []);

  async function carregarTracks() {
    try {
      setLoading(true);
      const response = await api.get('/backingTrack');
      setTracks(response.data);
    } catch (error) {
      console.error("Erro ao buscar backing tracks:", error);
    } finally {
      setLoading(false);
    }
  }

  // Cria uma backing track
  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      setIsUploading(true);
      await api.post('/backingTrack', {
        title: titulo,
        description: descricao,
        youtubeUrl,
      });

      setTitulo('');
      setDescricao('');
      setYoutubeUrl('');
      await carregarTracks();
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      alert("Erro ao cadastrar a backing track.");
    } finally {
      setIsUploading(false);
    }
  };

  // Funções de Exclusão
  const abrirModalExclusao = (track) => {
    setTrackParaExcluir(track);
    setIsModalOpen(true);
  };

  const confirmarExclusao = async () => {
    if (!trackParaExcluir) return;
    try {
      await api.delete(`/backingTrack/${trackParaExcluir.id}`);
      setTracks(tracks.filter(t => t.id !== trackParaExcluir.id));
      setIsModalOpen(false);
      setTrackParaExcluir(null);
    } catch (error) {
      console.error("Erro ao excluir track:", error);
    }
  };

  const tracksFiltradas = tracks.filter(track => {
    const termo = busca.toLowerCase();
    const tituloBusca = track.title ? track.title.toLowerCase() : '';
    const descricaoBusca = track.description ? track.description.toLowerCase() : '';
    return tituloBusca.includes(termo) || descricaoBusca.includes(termo);
  });

  return (
    <div className="flex min-h-screen w-full bg-[#09090b]">
      <Navbar />
      
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Cabeçalho */}
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              Backing Tracks
            </h1>
              <p className="text-zinc-400 mt-1">Gerencie as bases para os alunos improvisarem</p>
          </div>

          {/* Formulário de Upload */}
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-500" />
              Nova Backing Track
            </h2>
            
            <form onSubmit={handleUpload} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Título / Estilo</label>
                  <input
                    type="text"
                    required
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full px-4 py-3 bg-[#09090b] border border-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    placeholder="Ex: Blues Rock Slow"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Descrição</label>
                  <textarea
                    required
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="w-full px-4 py-3 bg-[#09090b] border border-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    placeholder="Descreva o estilo ou a tonalidade"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <label className="block text-sm font-medium text-zinc-400 mb-1" htmlFor="youtube-url">Link do YouTube</label>
                <input
                  id="youtube-url"
                  type="url"
                  required
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-[#09090b] border border-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition shadow-md disabled:bg-zinc-700 disabled:text-zinc-400"
                >
                  {isUploading ? 'Salvando...' : 'Publicar Backing Track'}
                </button>
              </div>
            </form>
          </div>

          <hr className="border-zinc-800" />

          {/* Barra de Pesquisa */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-white">Acervo de Áudios</h2>
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-zinc-500" />
              </div>
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#18181b] border border-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 transition shadow-sm placeholder-zinc-500"
                placeholder="Buscar por nome ou descrição..."
              />
            </div>
          </div>

          {/* Área de Exibição das Tracks */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-zinc-500 text-lg animate-pulse">Carregando estúdio...</div>
            </div>
          ) : tracksFiltradas.length === 0 ? (
            <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-16 text-center">
              <PlayCircle className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhuma track encontrada</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tracksFiltradas.map((track) => (
                <div 
                  key={track.id} 
                  className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 hover:bg-[#27272a] hover:border-zinc-700 transition duration-300 group flex flex-col justify-between h-full shadow-lg"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Music className="w-6 h-6 text-purple-400" />
                      </div>
                      <button
                        onClick={() => abrirModalExclusao(track)}
                        className="p-2 bg-[#09090b] hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-lg transition"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-3 line-clamp-1">
                      {track.title}
                    </h3>
                    
                    <p className="text-sm text-zinc-400 mb-6">{track.description}</p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/50">
                    <a
                      href={track.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-purple-300 hover:text-purple-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Abrir no YouTube
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Exclusão */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Excluir Backing Track?</h3>
              <p className="text-zinc-400 mb-6">
                Tem certeza que deseja apagar <strong className="text-white">{trackParaExcluir?.title}</strong>?
              </p>
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-[#27272a] hover:bg-zinc-700 text-white font-semibold rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarExclusao}
                  className="flex-1 py-3 px-4 bg-red-600/90 hover:bg-red-600 text-white font-semibold rounded-xl transition"
                >
                  Sim, excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BackingTracks;