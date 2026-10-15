import { useState, useEffect } from 'react';
import api from '../../services/api';

import NavBar from "../../components/navBar";
import Bg from "../../components/bg";

// Ícone de Lupa para a barra de pesquisa
const SearchIcon = () => (
  <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
);

function BackingTrack() {

    const [tracks, setTracks] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

  // Busca as tracks na API ao carregar a página
  useEffect(() => {
    async function fetchTracks() {
      try {
        // Supondo que a sua rota no backend seja /backing-tracks
        const response = await api.get('/backingTrack'); 
        
        // Se ainda não tiver o backend pronto, você pode testar com dados falsos:
        // setTracks([{ id: '1', title: 'Backing Track - Thunderstruck', description: 'Thunderstruck - AC DC - Backingtrack', youtubeUrl: 'https://www.youtube.com/watch?v=o6TeYK7Pl0s' }]);
        
        setTracks(response.data);
      } catch (err) {
        console.error("Erro ao buscar backing tracks:", err);
        setError("Não foi possível carregar as backing tracks.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchTracks();
  }, []);

  // Lógica da Barra de Pesquisa: Filtra as tracks baseadas no que o usuário digitou
  const filteredTracks = tracks.filter((track) => 
    track.title.toLowerCase().includes(search.toLowerCase()) || 
    track.description.toLowerCase().includes(search.toLowerCase())
  );

  // Função auxiliar para extrair o ID do vídeo da URL do YouTube
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const urlParts = url.split('v=');
    return urlParts.length > 1 ? urlParts[1].split('&')[0] : null;
  };


    return (
        <div>
            <Bg>
                <NavBar/>
                <div className='justify-center w-full'>
                    <div className="max-w-7xl mx-auto px-6 py-12 w-full">
        
        {/* Cabeçalho */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              Backing Tracks 🎧
            </h1>
            <p className="text-zinc-400 mt-2 text-lg">
              Pratique improvisação e repertório tocando junto com as bases.
            </p>
          </div>

          {/* Barra de Pesquisa */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Buscar por música, banda ou tom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Mensagens de Feedback */}
        {loading && <p className="text-zinc-400 animate-pulse">Carregando bases...</p>}
        {error && <p className="text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-500/50">{error}</p>}
        {!loading && !error && filteredTracks.length === 0 && (
          <p className="text-zinc-500">Nenhuma backing track encontrada para "{search}".</p>
        )}

        {/* Grid de 3 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredTracks.map((track) => {
            const videoId = getYoutubeVideoId(track.youtubeUrl);

            return (
              <div 
                key={track.id} 
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col hover:border-zinc-700 transition-colors shadow-lg"
              >
                {/* Player do YouTube embutido (aspect-video garante a proporção 16:9 correta) */}
                {videoId ? (
                  <div className="w-full aspect-video bg-black">
                    <iframe 
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${videoId}`} 
                      title={track.title}
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-zinc-800 flex items-center justify-center text-zinc-500">
                    Link de vídeo inválido
                  </div>
                )}

                {/* Informações da Track */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 leading-tight">{track.title}</h3>
                    <p className="text-sm text-zinc-400 line-clamp-2">
                      {track.description}
                    </p>
                  </div>
                  
                  {/* Botão opcional para abrir no YouTube em outra aba */}
                  <a 
                    href={track.youtubeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                  >
                    Abrir no YouTube ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
                </div>
            </Bg>
        </div>
    )
}
export default BackingTrack;