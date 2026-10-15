import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Importando nosso arquivo de conexão

// Importação das imagens (Se você estiver usando Vite/Webpack)
import guitarImg from './assets/guita-bw.jpg'; // Substitua pelo caminho real da imagem da guitarra P&B

// Ícones simples usando SVG puro (Você pode usar bibliotecas como 'react-icons' se preferir)
const EmailIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
);
const LockIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
);


function Login() {
  // Estados para capturar os dados do formulário e gerenciar o feedback visual
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Função principal de envio do login
  const handleLogin = async (e) => {
    e.preventDefault(); // Evita o recarregamento padrão da página
    setError('');
    setLoading(true);

    try {
      // Fazendo a requisição para a nossa rota do backend
      // Nosso 'api.js' já cuida da BaseURL (http://IP_DA_SUA_VPS:3000)
      const response = await api.post('/login/STUDENT', { email, password });

      // O backend retorna: { token: "...", user: {...} }
      const { token, user } = response.data;

      // Salvando os dados no navegador de forma persistente
      localStorage.setItem('douglasguita_token', token);
      localStorage.setItem('douglasguita_user', JSON.stringify(user));

      // Redireciona o usuário para o painel principal (Dashboard)
      navigate('/home');

    } catch (err) {
      // Tratamento de erro detalhado
      console.error("Erro no login:", err);
      // Pega a mensagem de erro que vem do backend, ou usa uma genérica
      const msg = err.response?.data?.error || 'E-mail ou senha incorretos. Tente novamente.';
      setError(msg);
    } finally {
      // Finaliza o estado de carregamento
      setLoading(false);
    }
  };

  return (
    // Wrapper principal - Dark Background
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#111111] font-sans antialiased">
      
      {/* Contêiner do Painel - Branco com cantos arredondados grandes */}
      <div className="grid w-full max-w-7xl overflow-hidden bg-white shadow-2xl rounded-3xl md:grid-cols-2">
        
        {/* COLUNA ESQUERDA - Formulário de Login */}
        <div className="flex flex-col p-10 md:p-16 xl:p-20 justify-between">
          
          {/* Cabeçalho da Coluna - Logo e Welcome */}
          <div>

            <div className="mb-10 text-left">
              <h1 className="text-3xl font-extrabold text-gray-950 flex items-center gap-2">
                Bem vindo <span role="img" aria-label="hand-waving">👋</span>
              </h1>
              <p className="mt-3 text-lg text-gray-700 max-w-sm">
                Sua plataforma de música favorita está a apenas um login de distância. Entre com sua conta para continuar.
              </p>
            </div>

            {/* Exibe mensagem de erro se houver */}
            {error && (
              <div className="p-4 mb-6 text-sm font-semibold text-red-800 bg-red-100 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* Formulário de Login */}
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Campo Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <EmailIcon />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:border-gray-500 transition"
                    placeholder="Example@email.com"
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <LockIcon />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={8} // Garante o mínimo definido no backend
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:border-gray-500 transition"
                    placeholder="digite sua senha"
                  />
                </div>
              </div>

              {/* Botão Esqueci a Senha */}
              <div className="flex justify-end mt-2">
                <a href="/login/forgotpassword" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition">
                  Esqueceu a senha?
                </a>
              </div>

              {/* Botão Entrar Principal (Dark) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-6 text-base font-bold text-white bg-[#222222] rounded-xl hover:bg-black disabled:bg-gray-400 transition duration-150 shadow-md"
              > 
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            {/* Divisor "Or" */}
            <div className="relative flex items-center my-10">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-sm font-medium text-gray-500">Ou</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Link de Cadastro */}
            <p className="mt-12 text-center text-sm text-gray-600">
              Não tem uma conta?{' '}
              <a href="/login/register" className="font-bold text-blue-600 hover:text-blue-800 transition">
                Criar Conta
              </a>
            </p>
          </div>

          {/* Footer da Coluna */}
          <p className="text-center text-xs text-gray-500 mt-16 md:mt-24">
            © 2026 Todos os direitos Reservados. Desenvolvido por João Pedro Del Bianco
          </p>
        </div>

        {/* COLUNA DIREITA - Imagem de Fundo (Guitarra P&B) */}
        <div className="relative hidden md:block group">
          <img 
            src={guitarImg} 
            alt="Dramatic Black and White Guitar" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Overlay suave para melhorar o contraste se necessário */}
          <div className="absolute inset-0 bg-black opacity-10"></div>
        </div>

      </div>
    </div>
  );
}

export default Login;