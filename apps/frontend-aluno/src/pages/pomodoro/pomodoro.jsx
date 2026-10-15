import { useState, useEffect } from 'react';
import playIcon from './assets/button-play.svg';
import pauseIcon from './assets/button-pause.svg';
import buttonSave from './assets/button-save.svg';
import iconComplete from './assets/icon-complete.svg';
import { Trash2 } from 'lucide-react';
import metronome from './assets/metronome.mp3';
import NavBar from '../../components/navBar';

function Pomodoro() {
  const [listaTarefas, setListaTarefas] = useState([]);
  const [tempo, setTempo] = useState(0);
  const [tarefaSelecionada, setTarefaSelecionada] = useState('Nenhuma tarefa selecionada');

  // =========================================================================
  // TIMER & TAREFAS
  // =========================================================================
  function formatarTempo(totalSegundos) {
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  }

  const [tarefaTempo, setTarefaTempo] = useState(300);
  const [tarefaInput, setTarefaInput] = useState("");

  function salvarNoLocalStorage() {
    if (tarefaInput.trim() === "") return;
    const novaTarefa = {
      id: new Date().getTime(),
      nome: tarefaInput,
      tempo: tarefaTempo,
      concluido: false
    };

    const dadosAntigos = localStorage.getItem('@pomodoro:listaTarefas');
    const listaSalva = dadosAntigos ? JSON.parse(dadosAntigos) : [];
    const listaAtualizada = [...listaSalva, novaTarefa];

    localStorage.setItem('@pomodoro:listaTarefas', JSON.stringify(listaAtualizada));
    setTarefaInput("");
    setTarefaTempo(300);
    setListaTarefas(listaAtualizada);
  }

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('@pomodoro:listaTarefas');
    if (dadosSalvos) {
      setListaTarefas(JSON.parse(dadosSalvos));
    }
  }, []);

  function alternarStatusTarefa(idClicado) {
    const listaAtualizada = listaTarefas.map((tarefa) => {
      if (tarefa.id === idClicado) {
        return { ...tarefa, concluido: !tarefa.concluido };
      }
      return tarefa;
    });

    setListaTarefas(listaAtualizada);
    localStorage.setItem('@pomodoro:listaTarefas', JSON.stringify(listaAtualizada));
  }

  function deletarTarefa(idClicado) {
    const listaAtualizada = listaTarefas.filter((tarefa) => tarefa.id !== idClicado);
    setListaTarefas(listaAtualizada);
    localStorage.setItem('@pomodoro:listaTarefas', JSON.stringify(listaAtualizada));
  }

  const [iniciado, setIniciado] = useState(false);

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
  const [metronomoLigado, setMetronomoLigado] = useState(false);
  const [bpm, setBpm] = useState(50);

  function tocarBipe() {
    const audio = new Audio(metronome);
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
  // RENDERIZAÇÃO E RESPONSIVIDADE
  // =========================================================================
  return (
    <div className="min-h-screen bg-zinc-950 flex font-sans text-gray-300 w-full overflow-hidden">
      
      <NavBar />
      
      {/* Container Principal: flex-1 garante que ocupe o espaço livre ao lado da NavBar */}
      <div className="flex-1 flex flex-col items-center pt-16 lg:pt-12 px-4 pb-12 overflow-y-auto h-screen">
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl  text-white mb-2 mt-7 lg:mt-0">Praticar</h1>
          <h4 className="text-sm font-semibold tracking-widest text-zinc-500 uppercase">Lista de Exercícios</h4>
        </div>

        {/* 
          Main Grid Wrapper
          Mobile: Empilhado (flex-col)
          Desktop (lg): Lado a lado (lg:flex-row)
        */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full max-w-5xl justify-center items-center lg:items-start">
          
          {/* Coluna Esquerda: Timer e Metrônomo */}
          {/* Tablet (md): Lado a lado entre si (md:flex-row) | Desktop (lg): Empilhados (lg:flex-col) */}
          <div className="flex flex-col md:flex-row lg:flex-col gap-6 w-full max-w-2xl lg:max-w-[400px]">
            
            {/* TIMER */}
            <div className="flex-1 text-center p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col items-center justify-center">
              <div className="mt-4 mb-2">
                <h2 className="font-relogio text-7xl mb-3 text-white">{formatarTempo(tempo)}</h2>
                <p className="text-xs text-zinc-400 mb-5">Selecione um exercício para começar</p>
                <p className="text-xl font-medium mb-5 min-h-[28px]">{tarefaSelecionada}</p>
                <button onClick={() => setIniciado(!iniciado)} className="hover:scale-105 transition-transform">
                  <img src={iniciado ? pauseIcon : playIcon} alt="Iniciar Pomodoro" className="w-16 h-16 mx-auto" />
                </button>
              </div>

              <div className="flex w-full justify-between items-center mt-5 text-sm px-2 text-zinc-400">
                <p className="text-xs">{listaTarefas.filter((tarefa) => tarefa.concluido).length} concluídos</p>
                <p className="text-xs">{listaTarefas.length} no total</p>
              </div>
            </div>

            {/* METRÔNOMO */}
            <div className="flex-1 text-center p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-white mb-3">Metrônomo</h2>
              <h3 className="font-relogio text-6xl text-[#F0B34C]">{bpm}</h3>
              <p className="mb-5 text-zinc-400">BPM</p>
              <input 
                type="range" 
                min="0" 
                max="200" 
                value={bpm} 
                onChange={(evento) => setBpm(evento.target.value)} 
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#F0B34C] mb-8"
              />
              <button onClick={() => setMetronomoLigado(!metronomoLigado)} className="hover:scale-105 transition-transform">
                <img src={metronomoLigado ? pauseIcon : playIcon} alt="Iniciar Metrônomo" className="w-16 h-16 mx-auto" />
              </button>
            </div>

          </div>

          {/* Coluna Direita: Lista de Tarefas */}
          <div className="flex-1 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg w-full max-w-2xl lg:max-w-[500px]">
            <h2 className="mb-4 pt-1 font-bold text-white text-center">ADICIONAR UM EXERCÍCIO/PAUSA</h2>
            
            <div className="flex gap-3 justify-between mb-4">
              <input 
                type="text" 
                placeholder="Nome do exercício..." 
                value={tarefaInput}
                onChange={(evento) => setTarefaInput(evento.target.value)} 
                className="rounded-xl px-4 py-2 w-full text-zinc-100 bg-zinc-950 border border-zinc-700 focus:outline-none focus:border-[#F0B34C]" 
              />
              <button onClick={salvarNoLocalStorage} className="hover:scale-105 transition-transform shrink-0">
                <img src={buttonSave} alt="Salvar Task" className="w-10 h-10" />
              </button>
            </div>
            
            <div className="flex gap-2 justify-between mb-6">
              <button onClick={() => setTarefaTempo(300)} className={`flex-1 rounded-xl font-medium py-2 transition-colors ${tarefaTempo === 300 ? 'bg-[#F0B34C] text-zinc-900' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>5 min</button>
              <button onClick={() => setTarefaTempo(600)} className={`flex-1 rounded-xl font-medium py-2 transition-colors ${tarefaTempo === 600 ? 'bg-[#F0B34C] text-zinc-900' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>10 min</button>
              <button onClick={() => setTarefaTempo(900)} className={`flex-1 rounded-xl font-medium py-2 transition-colors ${tarefaTempo === 900 ? 'bg-[#F0B34C] text-zinc-900' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>15 min</button>
            </div>
            
            <ul className="space-y-3">
              {listaTarefas.map((tarefa) => (
                <li 
                  key={tarefa.id} 
                  onClick={() => { setTempo(tarefa.tempo); setTarefaSelecionada(tarefa.nome); }} 
                  className={`flex justify-between items-center px-4 py-3 rounded-xl border cursor-pointer transition-colors ${tarefa.concluido ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-zinc-950 border-zinc-700 hover:border-zinc-500 text-white'}`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={iconComplete} 
                      className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" 
                      onClick={(e) => { e.stopPropagation(); alternarStatusTarefa(tarefa.id); }} 
                      alt="Marcar como concluído"
                    />
                    <p className="font-medium line-clamp-1">{tarefa.nome}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm shrink-0">
                    <span className="text-zinc-400">{Math.floor(tarefa.tempo / 60)} min</span>
                    <button onClick={(e) => { e.stopPropagation(); deletarTarefa(tarefa.id); }} className="text-zinc-500 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
              {listaTarefas.length === 0 && (
                <p className="text-center text-zinc-500 text-sm py-4">Nenhum exercício adicionado ainda.</p>
              )}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Pomodoro;