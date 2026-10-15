import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, CheckSquare, Music, ArrowRight, Activity } from 'lucide-react';
import api from '../../services/api';
import Navbar from "../../components/navBar";

function Home() {
  const [stats, setStats] = useState({
    alunos: 0,
    tarefas: 0,
    materiais: 0,
    tracks: 0
  });
  const [loading, setLoading] = useState(true);

  // Busca os dados para montar os números do Dashboard
  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      setLoading(true);
      
      // Fazemos todas as chamadas em paralelo para ser mais rápido
      const [alunosRes, tarefasRes, materiaisRes, tracksRes] = await Promise.all([
        api.get('/user', { params: { role: 'STUDENT' } }),
        api.get('/task'),
        api.get('/materialPDF'),
        api.get('/backingTracks')
      ]);

      // Guardamos apenas as quantidades (.length)
      setStats({
        alunos: alunosRes.data.length || 0,
        tarefas: tarefasRes.data.length || 0,
        materiais: materiaisRes.data.length || 0,
        tracks: tracksRes.data.length || 0
      });

    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Saudação de acordo com o horário (Bom dia, Boa tarde, Boa noite)
  const horaAtual = new Date().getHours();
  let saudacao = 'Boa noite';
  if (horaAtual >= 5 && horaAtual < 12) saudacao = 'Bom dia';
  else if (horaAtual >= 12 && horaAtual < 18) saudacao = 'Boa tarde';

  return (
    <div className="flex min-h-screen w-full bg-[#09090b]">
      <Navbar />
      
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Cabeçalho de Boas-Vindas */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#18181b] border border-zinc-800 p-8 rounded-3xl shadow-lg relative overflow-hidden">
            {/* Efeito visual de luz no fundo do card */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3 mb-2">
                {saudacao}, Douglas! <span role="img" aria-label="rock">🎸</span>
              </h1>
              <p className="text-zinc-400 text-lg">Pronto para evoluir a técnica dos seus alunos hoje?</p>
            </div>
          </div>

          {/* Seção de Estatísticas (Cards pequenos) */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Visão Geral do Estúdio
            </h2>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 bg-[#18181b] border border-zinc-800 rounded-2xl"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Card Alunos */}
                <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 shadow-lg flex items-center gap-4 group hover:border-emerald-500/50 transition">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm font-medium">Alunos Ativos</p>
                    <h3 className="text-2xl font-bold text-white">{stats.alunos}</h3>
                  </div>
                </div>

                {/* Card Tarefas */}
                <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 shadow-lg flex items-center gap-4 group hover:border-cyan-500/50 transition">
                  <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckSquare className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm font-medium">Tarefas Criadas</p>
                    <h3 className="text-2xl font-bold text-white">{stats.tarefas}</h3>
                  </div>
                </div>

                {/* Card Materiais */}
                <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 shadow-lg flex items-center gap-4 group hover:border-indigo-500/50 transition">
                  <div className="w-14 h-14 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm font-medium">PDFs Cadastrados</p>
                    <h3 className="text-2xl font-bold text-white">{stats.materiais}</h3>
                  </div>
                </div>

                {/* Card Tracks */}
                <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 shadow-lg flex items-center gap-4 group hover:border-purple-500/50 transition">
                  <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Music className="w-7 h-7 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm font-medium">Backing Tracks</p>
                    <h3 className="text-2xl font-bold text-white">{stats.tracks}</h3>
                  </div>
                </div>

              </div>
            )}
          </div>

          <hr className="border-zinc-800/50" />

          {/* Seção de Acesso Rápido (Cards Grandes com Link) */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Acesso Rápido</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Atalho Alunos */}
              <Link to="/alunos" className="block bg-[#18181b] border border-zinc-800 rounded-2xl p-8 hover:bg-[#27272a] hover:border-zinc-700 transition duration-300 group shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition">
                  Meus Alunos
                </h3>
                <p className="text-sm text-zinc-400 mb-6">
                  Gerencie cadastros, ative ou desative o acesso dos seus alunos à plataforma.
                </p>
                <div className="flex items-center text-sm font-bold text-zinc-300 group-hover:text-white transition">
                  Acessar Painel <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Atalho Tarefas */}
              <Link to="/tasks" className="block bg-[#18181b] border border-zinc-800 rounded-2xl p-8 hover:bg-[#27272a] hover:border-zinc-700 transition duration-300 group shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6">
                  <CheckSquare className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition">
                  Atribuir Tarefas
                </h3>
                <p className="text-sm text-zinc-400 mb-6">
                  Crie rotinas de estudo, exercícios técnicos e acompanhe o progresso de cada aluno.
                </p>
                <div className="flex items-center text-sm font-bold text-zinc-300 group-hover:text-white transition">
                  Criar Tarefa <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Atalho Materiais */}
              <Link to="/files" className="block bg-[#18181b] border border-zinc-800 rounded-2xl p-8 hover:bg-[#27272a] hover:border-zinc-700 transition duration-300 group shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition">
                  Acervo de PDFs
                </h3>
                <p className="text-sm text-zinc-400 mb-6">
                  Faça o upload de novas apostilas, partituras e tablaturas para a biblioteca.
                </p>
                <div className="flex items-center text-sm font-bold text-zinc-300 group-hover:text-white transition">
                  Ver Acervo <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;