import NavBar from "../../components/navBar";
import { useState, useEffect } from 'react';
import api from '../../services/api';
import Bg from "../../components/bg";

// Ícones para o visual da tela
const PdfIcon = () => (
  <svg className="w-10 h-10 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
);
const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
);

function Files() {

  const [materiais, setMateriais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Busca os dados assim que a tela carrega
  useEffect(() => {
    async function fetchMateriais() {
      try {
        const response = await api.get('/materialPDF');
        // Espera-se que o backend retorne um array de objetos
        setMateriais(response.data);
      } catch (err) {
        console.error("Erro ao buscar materiais:", err);
        setError("Não foi possível carregar os materiais. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchMateriais();
  }, []);


  const handleDownload = async (materialId, fileName) => {
  try {
    // 1. Aponta para a rota exata que você criou no Node: /materiais/ID/download
    // 2. Mantém o responseType: 'blob' para que o Axios entenda o buffer binário do Prisma
    const response = await api.get(`/materialPDF/${materialId}/download`, { 
      responseType: 'blob' 
    });
    
    // Converte o binário recebido para um arquivo no navegador e força o download
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}.pdf`); 
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
  } catch (err) {
    console.error("Erro ao baixar o arquivo:", err);
    alert("Não foi possível baixar o arquivo. Verifique sua conexão ou acesso.");
  }
};

    return (
        <div>
            <Bg>
                <NavBar/>
                <div className='justify-center w-full'>
                    <div className="max-w-7xl mx-auto px-6 py-12 w-full">
        
                        {/* Cabeçalho da Página */}
                        <div className="mb-10">
                        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mt-10 lg:mt-0">
                            Materiais e PDFs 🎸
                        </h1>
                        <p className="text-zinc-400 mt-2 text-lg">
                            Acesse suas apostilas, tablaturas e partituras de estudo.
                        </p>
                        </div>

                        {/* Mensagens de Feedback */}
                        {loading && <p className="text-zinc-400 animate-pulse">Carregando acervo...</p>}
                        {error && <p className="text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-500/50">{error}</p>}
                        {!loading && !error && materiais.length === 0 && (
                        <p className="text-zinc-500">Nenhum material disponível no momento.</p>
                        )}

                        {/* Grid exibindo de 3 em 3 (lg:grid-cols-3) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {materiais.map((item) => (
                            <div 
                            key={item.id} 
                            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors shadow-lg"
                            >
                            <div>
                                <PdfIcon />
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-zinc-400 line-clamp-2">
                                {item.description || 'Sem descrição.'}
                                </p>
                            </div>

                            {/* Botão de Download */}
                            <button
                              onClick={() => handleDownload(item.id, item.title)}
                              className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors border border-zinc-700 cursor-pointer"
                            >
                              <DownloadIcon />
                              Baixar PDF
                            </button>
                            </div>
                        ))}
                        </div>

                    </div>
                </div>
                
            </Bg>
        </div>
    )
}

export default Files;

