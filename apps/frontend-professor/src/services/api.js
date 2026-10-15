import axios from 'axios';

// Configuração base da conexão com o backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador de REQUISIÇÃO: Injeta o token ao enviar dados
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('douglasguita_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptador de RESPOSTA: Verifica se o token expirou ao receber dados
api.interceptors.response.use(
  (response) => {
    // Se a requisição deu certo, apenas repassa a resposta para o frontend
    return response;
  },
  (error) => {
    // Verifica se o erro retornado pelo backend é o 401 (Não Autorizado)
    if (error.response && error.response.status === 401) {
      
      // 1. Apaga o token vencido da gaveta
      localStorage.removeItem('douglasguita_token');
      
      // 2. Redireciona o usuário para a tela de login
      // Usamos window.location.href pois o interceptador não tem acesso direto ao hook do React Router
      window.location.href = '/login'; 
    }
    
    return Promise.reject(error);
  }
);

export default api;