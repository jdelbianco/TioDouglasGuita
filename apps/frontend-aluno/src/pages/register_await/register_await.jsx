import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

function RegisterAwait() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#111111] font-sans antialiased">
      
      {/* Container do Card */}
      <div className="flex flex-col items-center p-10 md:p-14 bg-white shadow-2xl rounded-3xl max-w-md w-full text-center transform transition-all">
        
        {/* Ícone de Sucesso Animado */}
        <div className="flex items-center justify-center w-24 h-24 mb-6 bg-emerald-100 rounded-full animate-bounce-short">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" strokeWidth={2.5} />
        </div>

        {/* Textos */}
        <h1 className="text-3xl font-extrabold text-gray-950 mb-4">
          Tudo certo! 🎸
        </h1>
        
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Seu registro foi efetuado com sucesso! Agora é só aguardar o <strong>Tio Douglas</strong> revisar e liberar o seu acesso à plataforma.
        </p>

        {/* Botão de Retorno */}
        <button
          onClick={() => navigate('/login')}
          className="w-full flex items-center justify-center py-4 px-6 text-base font-bold text-white bg-[#222222] rounded-xl hover:bg-black transition duration-200 shadow-md hover:shadow-lg"
        > 
          Voltar para o Login
        </button>

      </div>
    </div>
  );
}

export default RegisterAwait;