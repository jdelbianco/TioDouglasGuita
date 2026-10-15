import { useState, useRef, useEffect } from 'react';

import Bg from "../../components/bg";
import NavBar from "../../components/navBar";

// 1. Importação direta dos arquivos de áudio
// Isso evita erros de caminho quebrado (404) quando o projeto for para produção
import padC from './sounds/pad in C.mp3';
import padD from './sounds/pad in D.mp3';
import padE from './sounds/pad in E.mp3';
import padF from './sounds/pad in F.mp3';
import padG from './sounds/pad in G.mp3';
import padA from './sounds/pad in A.mp3';
import padB from './sounds/pad in B.mp3';

// 2. Array estruturado com as 7 notas e seus respectivos áudios
const padsConfig = [
  { note: 'C', audioFile: padC },
  { note: 'D', audioFile: padD },
  { note: 'E', audioFile: padE },
  { note: 'F', audioFile: padF },
  { note: 'G', audioFile: padG },
  { note: 'A', audioFile: padA },
  { note: 'B', audioFile: padB },
];

// Ícones SVG
const PlayIcon = () => (
  <svg className="w-8 h-8 ml-1 text-zinc-900" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
);
const PauseIcon = () => (
  <svg className="w-8 h-8 text-zinc-900" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
);
const WaveIcon = () => (
  <svg className="w-6 h-6 text-purple-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
);

function Pad() {

const [playingNote, setPlayingNote] = useState(null);
  
  // useRef guarda a referência do áudio tocando atualmente sem causar novos renders
  const audioRef = useRef(null);

  // Limpeza: Se o aluno mudar de página, o som para automaticamente
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePad = (note, audioFile) => {
    // 1. Se o aluno clicou na nota que já está tocando, apenas pausa
    if (playingNote === note) {
      audioRef.current.pause();
      setPlayingNote(null);
      return;
    }

    // 2. Se já tiver outro Pad tocando, pausa ele primeiro
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // 3. Cria um novo objeto de áudio com a nova nota
    const newAudio = new Audio(audioFile);
    newAudio.loop = true; // Pad de guitarra deve ficar em loop infinito
    newAudio.volume = 0.8; // Volume levemente reduzido
    
    // 4. Dá o play e salva no estado/ref
    newAudio.play();
    audioRef.current = newAudio;
    setPlayingNote(note);
  };
    return (
        <div>
            <Bg>
                <NavBar/>
                <div className='justify-center w-full'>
                    <div className="max-w-7xl mx-auto px-6 py-12 w-full">
        
                        {/* Cabeçalho */}
                        <div className="mb-10">
                        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                            Pads de Estudo 🎹
                        </h1>
                        <p className="text-zinc-400 mt-2 text-lg">
                            Bases contínuas para praticar improvisação, escalas e modos gregos.
                        </p>
                        </div>

                        {/* Grid de Pads */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {padsConfig.map(({ note, audioFile }) => {
                            const isPlaying = playingNote === note;

                            return (
                            <div 
                                key={note}
                                className={`relative flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all duration-300 shadow-lg ${
                                isPlaying 
                                    ? 'bg-purple-900/20 border-purple-500 shadow-purple-500/20 scale-[1.02]' 
                                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                                }`}
                            >
                                {/* Indicador visual de som rolando */}
                                <div className="absolute top-4 right-4 h-6 w-6">
                                {isPlaying && <WaveIcon />}
                                </div>

                                <h3 className={`text-2xl font-bold mb-6 ${isPlaying ? 'text-purple-400' : 'text-white'}`}>
                                Pad in {note}
                                </h3>

                                {/* Botão Play/Pause circular */}
                                <button
                                onClick={() => togglePad(note, audioFile)}
                                className={`w-20 h-20 flex items-center justify-center rounded-full transition-all duration-200 ${
                                    isPlaying 
                                    ? 'bg-purple-500 hover:bg-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)]' 
                                    : 'bg-[#F0B34C] hover:bg-white'
                                }`}
                                aria-label={isPlaying ? `Pausar Pad em ${note}` : `Tocar Pad em ${note}`}
                                >
                                {isPlaying ? <PauseIcon /> : <PlayIcon />}
                                </button>
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

export default Pad;
