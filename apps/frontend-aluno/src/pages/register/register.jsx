import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

// Reutilize as mesmas imagens da tela de Login
import guitarImg from './assets/guita-color.jpg'; 
//import logoImg from '../assets/images/logo.png'; 

// Ícones (Adicionado o ícone de Usuário para o campo Nome)
const UserIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
);
const EmailIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
);
const LockIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
);

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Dispara o POST para a rota de criação de usuário do backend
      await api.post('/user', { name, email, password });

      // Se a criação for bem-sucedida, joga o usuário para a tela de login
      navigate('/register_await');
    } catch (err) {
      console.error("Erro no cadastro:", err);
      const msg = err.response?.data?.error || 'Erro ao criar conta. Tente novamente.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#111111] font-sans antialiased">
      <div className="grid w-full max-w-7xl overflow-hidden bg-white shadow-2xl rounded-3xl md:grid-cols-2">
        
        {/* COLUNA ESQUERDA - Formulário de Registro */}
        <div className="flex flex-col p-10 md:p-16 xl:p-20 justify-center">
          
          

          <div className="mb-8 text-left">
            <h1 className="text-3xl font-extrabold text-gray-950 flex items-center gap-2">
              Join DouglasGuita 🎸
            </h1>
            <p className="mt-3 text-lg text-gray-700 max-w-sm">
              Crie sua conta para acessar seu portfólio e materiais de estudo.
            </p>
          </div>

          {error && (
            <div className="p-4 mb-6 text-sm font-semibold text-red-800 bg-red-100 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            
            {/* Campo Nome */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-800">Nome</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <UserIcon />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:border-gray-500 transition"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

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
                  placeholder="exemplo@email.com"
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
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:border-gray-500 transition"
                  placeholder="Mínimo de 8 caracteres"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-6 text-base font-bold text-white bg-[#222222] rounded-xl hover:bg-black disabled:bg-gray-400 transition duration-150 shadow-md mt-4"
            >
              {loading ? 'Criando conta...' : 'Cadastrar'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <a href="/login" className="font-bold text-blue-600 hover:text-blue-800 transition">
              Entrar
            </a>
          </p>
        </div>

        {/* COLUNA DIREITA - Imagem de Fundo (Guitarra P&B) */}
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

export default Register;