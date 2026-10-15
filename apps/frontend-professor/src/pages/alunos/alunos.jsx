import { useState, useEffect } from 'react';
import { Search, Trash2, UserX, AlertTriangle, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import NavBar from '../../components/navBar';

function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  // Estados para o Modal de Exclusão
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alunoParaExcluir, setAlunoParaExcluir] = useState(null);

  // 1. Buscar alunos ao carregar a página
  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user', { params: { role: 'STUDENT' } });
      setAlunos(response.data);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Função para alternar o status (ACTIVE / INACTIVE)
  const alternarStatus = async (id, statusAtual) => {
    const novoStatus = statusAtual === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    
    setAlunos(alunos.map(aluno => 
      aluno.id === id ? { ...aluno, status: novoStatus } : aluno
    ));

    try {
      await api.put(`/user/${id}`, { status: novoStatus });
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      carregarAlunos();
    }
  };

  // 3. Funções de Exclusão
  const abrirModalExclusao = (aluno) => {
    setAlunoParaExcluir(aluno);
    setIsModalOpen(true);
  };

  const confirmarExclusao = async () => {
    if (!alunoParaExcluir) return;

    try {
      await api.delete(`/user/${alunoParaExcluir.id}`);
      setAlunos(alunos.filter(aluno => aluno.id !== alunoParaExcluir.id));
      setIsModalOpen(false);
      setAlunoParaExcluir(null);
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
    }
  };

  // 4. Filtro de pesquisa
  const alunosFiltrados = alunos.filter(aluno =>
    aluno.name.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    // Se você já tem a imagem da guitarra no fundo (no App.js ou index.html), 
    // troque 'bg-[#09090b]' por 'bg-transparent'.
    <div className="flex min-h-screen w-full bg-[#09090b]">
        <NavBar />
      <div className="flex-1 min-w-0 min-h-screen bg-[#09090b] p-6 md:p-10 font-sans text-gray-200">
      <div className="max-w-5xl mx-auto">
          
        {/* Cabeçalho e Barra de Pesquisa */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              Meus Alunos
            </h1>
            <p className="text-zinc-400 mt-1">Gerencie os acessos e cadastros da plataforma</p>
          </div>

          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-zinc-500" />
            </div>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#18181b] border border-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 transition shadow-sm placeholder-zinc-500"
              placeholder="Buscar aluno por nome..."
            />
          </div>
        </div>

        {/* Lista de Alunos */}
        <div className="bg-[#18181b] rounded-2xl shadow-lg border border-zinc-800 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-zinc-500">Carregando alunos...</div>
          ) : alunosFiltrados.length === 0 ? (
            <div className="p-10 text-center text-zinc-500">Nenhum aluno encontrado.</div>
          ) : (
            <ul className="divide-y divide-zinc-800/50">
              {alunosFiltrados.map((aluno) => (
                <li key={aluno.id} className="p-4 sm:p-6 hover:bg-[#27272a] transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  
                  {/* Info do Aluno */}
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-white">{aluno.name}</span>
                    <span className="text-sm text-zinc-400">{aluno.email}</span>
                  </div>

                  {/* Ações e Status */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      
                    {/* Badge de Status (Cores adaptadas para Dark Mode) */}
                    <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${aluno.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                      {aluno.status === 'ACTIVE' ? <ShieldCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                      {aluno.status === 'ACTIVE' ? 'ATIVO' : 'INATIVO'}
                    </span>

                    {/* Botão Ativar/Desativar */}
                    <button
                      onClick={() => alternarStatus(aluno.id, aluno.status)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition bg-[#27272a] border border-zinc-700 text-white hover:bg-zinc-700"
                    >
                      {aluno.status === 'ACTIVE' ? 'Desativar' : 'Ativar'}
                    </button>

                    {/* Botão Excluir */}
                    <button
                      onClick={() => abrirModalExclusao(aluno)}
                      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      title="Excluir Aluno"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão - Versão Dark */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
                
              <h3 className="text-xl font-bold text-white mb-2">
                Excluir Aluno?
              </h3>
                
              <p className="text-zinc-400 mb-6">
                Tem certeza que deseja excluir permanentemente o acesso de <strong className="text-white">{alunoParaExcluir?.name}</strong>? Esta ação não pode ser desfeita.
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
                  className="flex-1 py-3 px-4 bg-red-600/90 text-white font-semibold rounded-xl hover:bg-red-600 transition shadow-sm"
                >
                  Sim, excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
    </div>
    
  );
}

export default Alunos;