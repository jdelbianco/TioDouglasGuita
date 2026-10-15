import { useState, useEffect } from 'react';
import playIcon from './assets/button-play.svg';
import pauseIcon from './assets/button-pause.svg';
import iconComplete from './assets/icon-complete.svg';
import { Trash2, Search } from 'lucide-react';
import metronomeSound from './assets/metronome.mp3';
import NavBar from '../../components/navBar';
import Bg from "../../components/bg";
import api from '../../services/api';



function Task() {

  // =========================================================================
  // Pegar dados do usuário do localStorage
  // =========================================================================

    const userData = localStorage.getItem('douglasguita_user');
    const data = userData ? JSON.parse(userData) : null;
  // =========================================================================
  // ESTADOS
  // =========================================================================
  const [listaTarefas, setListaTarefas] = useState([]);
  const [tempo, setTempo] = useState(0);
  const [iniciado, setIniciado] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState('Nenhuma tarefa selecionada');
  
  const [metronomoLigado, setMetronomoLigado] = useState(false);
  const [bpm, setBpm] = useState(90);

  const [backingTracks, setBackingTracks] = useState([]);
  const [searchTrack, setSearchTrack] = useState('');

  // =========================================================================
  // INTEGRAÇÃO COM API (TAREFAS E BACKING TRACKS)
  // =========================================================================
  useEffect(() => {
    async function carregarDados() {
      try {
        // Busca as tarefas diárias
        const resTarefas = await api.get(`/task?studentId=${data?.id}`);
        setListaTarefas(resTarefas.data); // <-- Faltava o .data aqui!

        // Busca as backing tracks
        const resTracks = await api.get('/backingTrack');
        setBackingTracks(resTracks.data);
      } catch (erro) {
        console.error("Erro ao buscar dados da API:", erro);
      }
    }
    carregarDados();
  }, []);

  async function alternarStatusTarefa(idClicado, statusAtual) {
    try {
      // Opcional: Atualiza no backend
      await api.put(`/task/${idClicado}`, { isCompleted: !statusAtual });
      
      const listaAtualizada = listaTarefas.map((tarefa) => {
        if (tarefa.id === idClicado) {
          return { ...tarefa, isCompleted: !statusAtual };
        }
        return tarefa;
      });
      setListaTarefas(listaAtualizada);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  }

  async function deletarTarefa(idClicado) {
    try {
      // Atualiza no backend
      await api.delete(`/task/${idClicado}`);
      const listaAtualizada = listaTarefas.filter((tarefa) => tarefa.id !== idClicado);
      setListaTarefas(listaAtualizada);
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  }

  // =========================================================================
  // TIMER (POMODORO/TAREFA)
  // =========================================================================
  function formatarTempo(totalSegundos) {
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  }

  useEffect(() => {
    let intervalo;
    if (iniciado && tempo > 0) {
      intervalo = setInterval(() => {
        setTempo((tempoAtual) => tempoAtual - 1);
      }, 1000);
    } else if (tempo === 0) {
      setIniciado(false);
    }
    return () => clearInterval(intervalo);
  }, [iniciado, tempo]);

  // =========================================================================
  // METRÔNOMO
  // =========================================================================
  function tocarBipe() {
    const audio = new Audio(metronomeSound);
    audio.play();
  }

  useEffect(() => {
    let intervalo;
    if (metronomoLigado) {
      const tempoEmMilissegundos = (60 / bpm) * 1000;
      tocarBipe(); 
      intervalo = setInterval(() => {
        tocarBipe();
      }, tempoEmMilissegundos);
    }
    return () => clearInterval(intervalo);
  }, [metronomoLigado, bpm]);

  // =========================================================================
  // LÓGICA DE BUSCA DAS BACKING TRACKS
  // =========================================================================
  const filteredTracks = backingTracks.filter((track) => 
    track.title.toLowerCase().includes(searchTrack.toLowerCase()) || 
    track.description.toLowerCase().includes(searchTrack.toLowerCase())
  );

  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const urlParts = url.split('v=');
    return urlParts.length > 1 ? urlParts[1].split('&')[0] : null;
  };

  // =========================================================================
  // RENDERIZAÇÃO
  // =========================================================================
  return (
    <div>
        <Bg>
        <NavBar />
        <div className='justify-center w-full'>
        
                
                {/* Container Principal Dividido em Duas Colunas (Tarefas vs Backing Tracks) */}
                <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* ==================== LADO ESQUERDO: TAREFAS E FERRAMENTAS ==================== */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                    
                    <div className="mb-4">
                        <h1 className="text-4xl  text-white mb-2 mt-13 lg:mt-0">Minhas Tarefas</h1>
                        <p className="text-zinc-400">Gerencie sua rotina de estudos diária.</p>
                    </div>

                    {/* Ferramentas: Timer e Metrônomo Compacto Lado a Lado */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        
                        {/* Timer da Tarefa Selecionada */}
                        <div className="timer text-center p-6 rounded-2xl bg-zinc-900 w-full sm:w-1/2 flex flex-col items-center justify-center border border-zinc-800">
                        <h2 className="font-relogio text-6xl mb-2 text-white">{formatarTempo(tempo)}</h2>
                        <p className="text-sm text-zinc-400 mb-4">{tarefaSelecionada}</p>
                        <button 
                            onClick={() => setIniciado(!iniciado)} 
                            className="hover:scale-105 transition-transform"
                        >
                            <img src={iniciado ? pauseIcon : playIcon} alt="Play/Pause" className="w-14 h-14" />
                        </button>
                        </div>

                        {/* Metrônomo Compacto */}
                        <div className="metronomo p-6 rounded-2xl bg-zinc-900 w-full sm:w-1/2 flex flex-col justify-center border border-zinc-800">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                            <h2 className="text-lg font-bold text-white">Metrônomo</h2>
                            <h3 className="font-relogio text-4xl text-emerald-400">{bpm} <span className="text-sm text-zinc-400 font-sans">BPM</span></h3>
                            </div>
                            <button 
                            onClick={() => setMetronomoLigado(!metronomoLigado)}
                            className="hover:scale-105 transition-transform"
                            >
                            <img src={metronomoLigado ? pauseIcon : playIcon} alt="Play/Pause Metrônomo" className="w-12 h-12" />
                            </button>
                        </div>
                        <input 
                            type="range" 
                            min="30" 
                            max="240" 
                            value={bpm} 
                            onChange={(e) => setBpm(e.target.value)} 
                            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        </div>
                    </div>

                    {/* Lista de Tarefas (Vindo da API) */}
                    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex-1">
                        <h2 className="text-xl font-bold text-white mb-4">Tarefas de Hoje</h2>
                        <div className="flex w-full justify-between items-center text-sm mb-4 text-zinc-400">
                        <p>{listaTarefas.filter((t) => t.concluido).length} concluídas</p>
                        <p>{listaTarefas.length} no total</p>
                        </div>

                        <ul className="space-y-3">
                        {listaTarefas.map((tarefa) => (
                            <li 
                            key={tarefa.id} 
                            onClick={() => { setTempo(tarefa.time); setTarefaSelecionada(tarefa.title); }} 
                            className={`flex justify-between items-center px-4 py-3 rounded-xl border transition-colors cursor-pointer ${
                                tarefa.isCompleted 
                                ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400'
                                : 'bg-zinc-950 border-zinc-700 hover:border-zinc-500 text-white'
                            }`}
                            >
                            <div className="flex items-center gap-3">
                                <img 
                                src={iconComplete} 
                                className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" 
                                onClick={(e) => {
                                    e.stopPropagation(); // Evita selecionar a tarefa ao clicar no check
                                    alternarStatusTarefa(tarefa.id, tarefa.isCompleted);
                                }} 
                                alt="Concluir"
                                />
                                <p className="font-medium">{tarefa.title}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-zinc-400">{Math.floor(tarefa.time / 60)} min</span>
                                <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deletarTarefa(tarefa.id);
                                }}
                                className="text-zinc-500 hover:text-red-500 transition-colors"
                                >
                                <Trash2 size={18} />
                                </button>
                            </div>
                            </li>
                        ))}
                        {listaTarefas.length === 0 && (
                            <p className="text-center text-zinc-500 py-6">Nenhuma tarefa cadastrada para hoje.</p>
                        )}
                        </ul>
                    </div>
                    </div>

                    {/* ==================== LADO DIREITO: BACKING TRACKS ==================== */}
                    <div className="lg:col-span-1 flex flex-col h-[85vh]">
                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col h-full overflow-hidden">
                        
                        {/* Header / Pesquisa */}
                        <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 z-10">
                        <h2 className="text-xl font-bold text-white mb-4">Backing Tracks 🎧</h2>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-zinc-500" />
                            </div>
                            <input
                            type="text"
                            placeholder="Buscar base..."
                            value={searchTrack}
                            onChange={(e) => setSearchTrack(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                            />
                        </div>
                        </div>

                        {/* Lista de Tracks (Rolagem interna) */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                        {filteredTracks.map((track) => {
                            const videoId = getYoutubeVideoId(track.youtubeUrl);
                            return (
                            <div key={track.id} className="bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-md">
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
                                <div className="w-full aspect-video bg-zinc-800 flex items-center justify-center text-xs text-zinc-500">
                                    Vídeo Indisponível
                                </div>
                                )}
                                <div className="p-3">
                                <h3 className="font-bold text-white text-sm leading-tight mb-1">{track.title}</h3>
                                <p className="text-xs text-zinc-500 line-clamp-2">{track.description}</p>
                                </div>
                            </div>
                            );
                        })}
                        {filteredTracks.length === 0 && (
                            <p className="text-center text-zinc-500 text-sm">Nenhuma track encontrada.</p>
                        )}
                        </div>

                    </div>
                    </div>

                </div>
            </div>
        </Bg>
    </div>
  );
}

export default Task;