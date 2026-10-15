import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api'; 

import guitarImg from './assets/guita-color.jpg'; 

const EmailIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
);
const LockIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/login/TEACHER', { email, password });
      const { token, user } = response.data;

      // =================================================================
      // VALIDAÇÃO DE ACESSO (TRAVA DO MONOREPO)
      // Ajuste 'user.role' para o nome exato do campo no seu banco de dados
      // que define se a pessoa é ALUNO ou PROFESSOR (ex: user.tipo, user.isTeacher)
      // =================================================================
      if (user.role !== 'TEACHER') {
        setError('Acesso negado: Este painel é exclusivo para o tio Douglas.');
        setLoading(false);
        return; // Interrompe a função aqui, impedindo que o token seja salvo
      }

      // Se passou pela trava, salva os dados e permite a entrada
      localStorage.setItem('douglasguita_token', token);
      localStorage.setItem('douglasguita_user', JSON.stringify(user));

      navigate('/home');

    } catch (err) {
      console.error("Erro no login:", err);
      const msg = err.response?.data?.error || 'E-mail ou senha incorretos. Tente novamente.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#111111] font-sans antialiased">
      <div className="grid w-full max-w-7xl overflow-hidden bg-white shadow-2xl rounded-3xl md:grid-cols-2">
        
        <div className="flex flex-col p-10 md:p-16 xl:p-20 justify-between">
          <div>
            <div className="mb-10 text-left">
              <h1 className="text-3xl font-extrabold text-gray-950 flex items-center gap-2">
                Bem vindo Douglas! <span role="img" aria-label="hand-waving">👋</span>
              </h1>
              <p className="mt-3 text-lg text-gray-700 max-w-sm">
                Seus alunos estão a apenas um login de distância. Entre com sua conta para continuar.
              </p>
            </div>

            {error && (
              <div className="p-4 mb-6 text-sm font-semibold text-red-800 bg-red-100 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
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

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <LockIcon />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={8} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:border-gray-500 transition"
                    placeholder="digite sua senha"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <Link to="/forgotpassword" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition">
                  Esqueceu a senha?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-6 text-base font-bold text-white bg-[#222222] rounded-xl hover:bg-black disabled:bg-gray-400 transition duration-150 shadow-md"
              > 
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            
          </div>

          <p className="text-center text-xs text-gray-500 mt-16 md:mt-24">
            © 2026 Todos os direitos Reservados. Desenvolvido por João Pedro Del Bianco
          </p>
        </div>

        <div className="relative hidden md:block group">
          <img 
            src={guitarImg} 
            alt="Dramatic Black and White Guitar" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black opacity-10"></div>
        </div>

      </div>
    </div>
  );
}

export default Login;