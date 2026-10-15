import { useNavigate } from 'react-router-dom';
import NavBar from "../../components/navBar";
import Bg from "../../components/bg";

import guitarImg from './assets/guitaImg.jpg';

const TaskIcon = () => (
  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
);
const PdfIcon = () => (
  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
);
const LogoutIcon = () => (
  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
);

function Home () {
    const navigate = useNavigate();
  
  // Resgata os dados do usuário do localStorage
  const user = JSON.parse(localStorage.getItem('douglasguita_user') || '{}');

    return (
        <div>
            
            <Bg bgImg={guitarImg}>
                <NavBar/>
                <div className=' w-full flex flex-col items-center px-4 md:px-8 lg:px-16 py-8 gap-30'>
                    {/* Saudação */}
                  <div className="mb-0 w-full">
                    <h2 className="text-3xl font-extrabold text-white mt-15 lg:mt-0">
                      Olá, {user.name?.split(' ')[0]}! 👋
                    </h2>
                    <p className="text-zinc-400 mt-2 text-lg">
                      Pronto para evoluir na guitarra hoje? 
                    </p>
                  </div>

                  {/* GRID DE CARDS (Menu de navegação rápida) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Card: Tarefas */}
                    <div 
                      onClick={() => navigate('/task')}
                      className="group cursor-pointer bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-zinc-800/80 transition-all duration-200 shadow-sm"
                    >
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <TaskIcon />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Minhas Tarefas</h3>
                      <p className="text-sm text-zinc-400">
                        Acesse sua rotina de estudos, palhetada e exercícios técnicos pendentes.
                      </p>
                    </div>

                    {/* Card: Materiais */}
                    <div 
                      onClick={() => navigate('/files')}
                      className="group cursor-pointer bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-zinc-800/80 transition-all duration-200 shadow-sm"
                    >
                      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <PdfIcon />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Materiais e PDFs</h3>
                      <p className="text-sm text-zinc-400">
                        Baixe partituras, tablaturas e apostilas disponibilizadas pelo professor.
                      </p>
                    </div>

                    {/* Card vazio para expansão futura (ex: Aulas Agendadas, Metrônomo) */}
                    <div 
                      onClick={() => navigate('/aulas')}
                      className="group cursor-pointer bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/50 hover:bg-zinc-800/80 transition-all duration-200 shadow-sm"
                    >
                      <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-2xl"></span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Pad</h3>
                      <p className="text-sm text-zinc-400">
                        Não perca o tom enquando digita sua escala
                      </p>
                    </div>

                  </div>
                </div>
            </Bg>

         
        </div>

        
    )
}

export default Home