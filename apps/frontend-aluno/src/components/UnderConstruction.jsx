import { useNavigate } from 'react-router-dom';

// Ícone simples de ferramentas/engrenagem para ilustrar a construção
const ConstructionIcon = () => (
  <svg className="w-20 h-20 text-gray-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
  </svg>
);

function UnderConstruction() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#111111] font-sans text-center">
      
      {/* Card com efeito "Glassmorphism" sutil para dar um tom moderno */}
      <div className="max-w-md p-10 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10 flex flex-col items-center shadow-2xl">
        
        <ConstructionIcon />
        
        <h1 className="text-3xl font-extrabold text-white mb-4">
          Recurso em Construção
        </h1>
        
        <p className="text-gray-400 mb-10 text-lg leading-relaxed">
          Estamos afinando as cordas e ajustando os pedais 🎸. Esta área do <strong>DouglasGuita</strong> estará disponível em breve!
        </p>
        
        <button
          onClick={() => navigate(-1)} // O -1 faz o usuário voltar exatamente para a página de onde veio
          className="w-full px-6 py-3 text-base font-bold text-[#111111] bg-white rounded-xl hover:bg-gray-200 transition duration-150 shadow-md"
        >
          Voltar
        </button>
      </div>
      
    </div>
  );
}

export default UnderConstruction;