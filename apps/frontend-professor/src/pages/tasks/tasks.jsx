import { useState, useEffect } from 'react';
import { Search, CheckSquare, Trash2, AlertTriangle, Plus, User, Timer, ArrowDown } from 'lucide-react';
import api from '../../services/api';
import Navbar from "../../components/navBar";

function Tasks() {
  const [tarefasGlobais, setTarefasGlobais] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado principal: Qual aluno está selecionado no momento?
  const [alunoSelecionado, setAlunoSelecionado] = useState('');
  const [busca, setBusca] = useState('');

  // Estados do formulário de Criação
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [duracao, setDuracao] = useState('25');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados do Modal de Exclusão
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tarefaParaExcluir, setTarefaParaExcluir] = useState(null);

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  async function carregarDadosIniciais() {
    try {
      setLoading(true);
      // Busca todas as tarefas e alunos de uma vez
      // CORREÇÃO: Alterado de /tarefas para /task
      const [tarefasResponse, alunosResponse] = await Promise.all([
        api.get('/task'),
        api.get('/user', { params: { role: 'STUDENT' } })
      ]);

      setTarefasGlobais(tarefasResponse.data);
      setAlunos(alunosResponse.data);
    } catch (error) {
      console.error("Erro ao carregar os dados:", error);
    } finally {
      setLoading(false);
    }
  }

  // Função para Criar Tarefa
  const handleCriarTarefa = async (e) => {
    e.preventDefault();
    if (!alunoSelecionado) return alert("Selecione um aluno primeiro!");

    try {
      setIsSubmitting(true);
      
      const novaTarefa = {
        title: titulo,
        description: descricao,
        studentId: alunoSelecionado,
        time: Number(duracao) * 60
      };

      await api.post('/task', novaTarefa);

      // Limpa apenas os campos do formulário (mantém o aluno selecionado)
      setTitulo('');
      setDescricao('');
      setDuracao('25');
      
      await carregarDadosIniciais();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      alert("Erro ao atribuir a tarefa ao aluno.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const abrirModalExclusao = (tarefa) => {
    setTarefaParaExcluir(tarefa);
    setIsModalOpen(true);
  };

  const confirmarExclusao = async () => {
    if (!tarefaParaExcluir) return;
    try {
      // CORREÇÃO: Alterado de /tarefas para /task
      await api.delete(`/task/${tarefaParaExcluir.id}`);
      setTarefasGlobais(tarefas => tarefas.filter(t => t.id !== tarefaParaExcluir.id));
      setIsModalOpen(false);
      setTarefaParaExcluir(null);
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  // 1. Primeiro filtramos as tarefas para mostrar APENAS as do aluno selecionado
  const tarefasDoAluno = tarefasGlobais.filter(
    tarefa => tarefa.studentId === alunoSelecionado
  );

  // 2. Depois aplicamos a busca por texto em cima das tarefas desse aluno
  const tarefasFiltradas = tarefasDoAluno.filter(tarefa => {
    const termo = busca.toLowerCase();
    return (tarefa.title || '').toLowerCase().includes(termo)
      || (tarefa.description || '').toLowerCase().includes(termo);
  });

  // Pegar o nome do aluno selecionado para exibir no título
  const dadosDoAlunoSelecionado = alunos.find(a => a.id === alunoSelecionado);

  return (
    <div className="flex min-h-screen w-full bg-[#09090b]">
      <Navbar />
      
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Cabeçalho e Seleção Global de Aluno */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#18181b] border border-zinc-800 p-6 rounded-2xl shadow-lg">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                Tarefas e Rotinas
              </h1>
              <p className="text-zinc-400 mt-1">Selecione um aluno para gerenciar suas atividades</p>
            </div>

            <div className="w-full md:w-96 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <User className="w-5 h-5 text-cyan-500" />
              </div>
              <select
                value={alunoSelecionado}
                onChange={(e) => setAlunoSelecionado(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-[#09090b] border border-zinc-700 hover:border-cyan-500 text-white font-semibold rounded-xl focus:ring-2 focus:ring-cyan-500 transition appearance-none cursor-pointer shadow-inner"
              >
                <option value="" disabled>Escolha um aluno...</option>
                {alunos.map(aluno => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <ArrowDown className="w-4 h-4 text-zinc-500" />
              </div>
            </div>
          </div>

          {/* O conteúdo principal só aparece se um aluno estiver selecionado */}
          {!alunoSelecionado ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-zinc-800 rounded-2xl bg-[#09090b]">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                <CheckSquare className="w-8 h-8 text-zinc-600" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Nenhum aluno selecionado</h2>
              <p className="text-zinc-500 max-w-md">
                Utilize o menu acima para escolher um aluno. Após a seleção, você poderá cadastrar novas tarefas e visualizar o histórico de exercícios dele.
              </p>
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Formulário de Criação (Focado no Aluno Selecionado) */}
              <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-cyan-500" />
                  Nova tarefa para {dadosDoAlunoSelecionado?.name.split(' ')[0]}
                </h2>
                
                <form onSubmit={handleCriarTarefa} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Título</label>
                      <input
                        type="text"
                        required
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        className="w-full px-4 py-3 bg-[#09090b] border border-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                        placeholder="Ex: Escala Diatônica"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Duração (minutos)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Timer className="w-4 h-4 text-zinc-500" />
                        </div>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          required
                          value={duracao}
                          onChange={(e) => setDuracao(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-[#09090b] border border-zinc-800 text-zinc-300 rounded-xl focus:ring-2 focus:ring-cyan-500 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Instruções</label>
                      <textarea
                        required
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="w-full h-full min-h-[80px] px-4 py-3 bg-[#09090b] border border-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-cyan-500 transition resize-none"
                        placeholder="Descreva os detalhes do exercício..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition shadow-md disabled:bg-zinc-700 disabled:text-zinc-400"
                    >
                      {isSubmitting ? 'Salvando...' : 'Cadastrar Tarefa'}
                    </button>
                  </div>
                </form>
              </div>

              <hr className="border-zinc-800" />

              {/* Lista de Tarefas do Aluno Selecionado */}
              <div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    Histórico de Tarefas 
                    <span className="bg-zinc-800 text-zinc-300 text-xs py-1 px-3 rounded-full">
                      {tarefasDoAluno.length} cadastradas
                    </span>
                  </h2>
                  <div className="relative w-full md:w-80">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-4 h-4 text-zinc-500" />
                    </div>
                    <input
                      type="text"
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#18181b] border border-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-zinc-600 transition text-sm placeholder-zinc-500"
                      placeholder="Buscar nesta lista..."
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-10 text-zinc-500 animate-pulse">Buscando histórico...</div>
                ) : tarefasFiltradas.length === 0 ? (
                  <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-10 text-center text-zinc-500">
                    Nenhuma tarefa encontrada para este aluno.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {tarefasFiltradas.map((tarefa) => (
                      <div 
                        key={tarefa.id} 
                        className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 hover:bg-[#27272a] hover:border-zinc-700 transition duration-300 flex flex-col justify-between h-full shadow-lg"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                              <CheckSquare className="w-5 h-5 text-cyan-400" />
                            </div>
                            <button
                              onClick={() => abrirModalExclusao(tarefa)}
                              className="p-2 bg-[#09090b] hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-lg transition"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <h3 className="text-lg font-bold text-white mb-2">{tarefa.title}</h3>
                          <p className="text-sm text-zinc-400 mb-6 line-clamp-3">{tarefa.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${tarefa.isCompleted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {tarefa.isCompleted ? 'Concluída' : 'Pendente'}
                          </span>
                          <span className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                            <Timer className="w-3.5 h-3.5" />
                            {Math.floor(tarefa.time / 60)} min
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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
              <h3 className="text-xl font-bold text-white mb-2">Excluir Tarefa?</h3>
              <p className="text-zinc-400 mb-6">
                Tem certeza que deseja apagar <strong className="text-white">{tarefaParaExcluir?.title}</strong>?
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

export default Tasks;