import { useState, useEffect } from 'react';
import { Search, FileText, ArrowDownToLine, Trash2, UploadCloud, AlertTriangle, Plus } from 'lucide-react';
import api from '../../services/api';
import Navbar from "../../components/navBar";

function Files() {
  const [materiais, setMateriais] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  // Estados do formulário de Upload
  const [titulo, setTitulo] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Estados do Modal de Exclusão
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materialParaExcluir, setMaterialParaExcluir] = useState(null);

  useEffect(() => {
    carregarMateriais();
  }, []);

  const carregarMateriais = async () => {
    try {
      setLoading(true);
      const response = await api.get('/materialPDF');
      setMateriais(response.data);
    } catch (error) {
      console.error("Erro ao buscar materiais:", error);
    } finally {
      setLoading(false);
    }
  };

  const visualizarMaterial = async (material) => {
    try {
      const response = await api.get(`/materialPDF/${material.id}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(response.data);
      window.open(url, '_blank', 'noopener,noreferrer');
      window.setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
    } catch (error) {
      console.error("Erro ao visualizar material:", error);
    }
  };

  // Função de Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!arquivo) return alert("Selecione um arquivo PDF!");

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('title', titulo);
      formData.append('file', arquivo);

      await api.post('/materialPDF', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setTitulo('');
      setArquivo(null);
      carregarMateriais();
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      alert("Erro ao enviar o material.");
    } finally {
      setIsUploading(false);
    }
  };

  // Funções de Exclusão
  const abrirModalExclusao = (material) => {
    setMaterialParaExcluir(material);
    setIsModalOpen(true);
  };

  const confirmarExclusao = async () => {
    if (!materialParaExcluir) return;
    try {
      await api.delete(`/materialPDF/${materialParaExcluir.id}`);
      setMateriais(materiais.filter(m => m.id !== materialParaExcluir.id));
      setIsModalOpen(false);
      setMaterialParaExcluir(null);
    } catch (error) {
      console.error("Erro ao excluir material:", error);
    }
  };

  const materiaisFiltrados = materiais.filter(material => {
    const termo = busca.toLowerCase();
    const tituloBusca = material.title ? material.title.toLowerCase() : '';
    return tituloBusca.includes(termo);
  });

  return (
    <div className="flex min-h-screen w-full bg-[#09090b]">
      <Navbar />
      
      {/* Container principal flex-1 para ocupar o resto da tela ao lado da Navbar */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Cabeçalho */}
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              Materiais e PDFs
            </h1>
            <p className="text-zinc-400 mt-1">Gerencie, faça upload ou exclua apostilas da plataforma</p>
          </div>

          {/* Formulário de Upload */}
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              Nova Apostila
            </h2>
            
            <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Título</label>
                  <input
                    type="text"
                    required
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full px-4 py-3 bg-[#09090b] border border-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Ex: Escala Pentatônica"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <label className="block text-sm font-medium text-zinc-400 mb-1">Arquivo PDF</label>
                <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 hover:border-indigo-500 hover:bg-[#27272a] rounded-xl cursor-pointer transition group p-6 text-center">
                  <UploadCloud className="w-10 h-10 text-zinc-500 group-hover:text-indigo-400 mb-3 transition" />
                  <span className="text-sm font-medium text-zinc-300">
                    {arquivo ? arquivo.name : "Clique para selecionar um PDF"}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => setArquivo(e.target.files[0])}
                    required
                  />
                </label>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md disabled:bg-zinc-700 disabled:text-zinc-400"
                >
                  {isUploading ? 'Enviando arquivo...' : 'Publicar Material'}
                </button>
              </div>
            </form>
          </div>

          <hr className="border-zinc-800" />

          {/* Barra de Pesquisa */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-white">Acervo Publicado</h2>
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-zinc-500" />
              </div>
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#18181b] border border-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 transition shadow-sm placeholder-zinc-500"
                placeholder="Buscar apostila..."
              />
            </div>
          </div>

          {/* Área de Exibição dos Materiais */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-zinc-500 text-lg animate-pulse">Carregando acervo...</div>
            </div>
          ) : materiaisFiltrados.length === 0 ? (
            <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-16 text-center">
              <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhum material encontrado</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materiaisFiltrados.map((material) => (
                <div 
                  key={material.id} 
                  className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 hover:bg-[#27272a] hover:border-zinc-700 transition duration-300 group flex flex-col justify-between h-full shadow-lg"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                      {material.title}
                    </h3>
                    <p className="text-sm text-zinc-400 mb-6 line-clamp-3">
                      Arquivo PDF disponível para visualização.
                    </p>
                  </div>

                  {/* Botões de Ação (Baixar e Excluir) */}
                  <div className="flex gap-2 pt-4 border-t border-zinc-800/50">
                    <button
                      onClick={() => visualizarMaterial(material)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#27272a] hover:bg-zinc-700 text-white text-sm font-semibold rounded-lg transition"
                    >
                      <ArrowDownToLine className="w-4 h-4" />
                      Visualizar
                    </button>
                    <button
                      onClick={() => abrirModalExclusao(material)}
                      className="flex items-center justify-center px-3 py-2.5 bg-[#27272a] hover:bg-red-500/10 text-zinc-400 hover:text-red-400 rounded-lg transition"
                      title="Excluir"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
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
              <h3 className="text-xl font-bold text-white mb-2">Excluir Material?</h3>
              <p className="text-zinc-400 mb-6">
                Tem certeza que deseja apagar <strong className="text-white">{materialParaExcluir?.title}</strong>?
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

export default Files;