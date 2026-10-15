import { Navigate, Outlet } from 'react-router-dom';

function RotaProtegida() {
  // Verifique o nome exato da chave que você usou no seu login para salvar o token
  const token = localStorage.getItem('douglasguita_token'); 
  const user = localStorage.getItem('douglasguita_user'); 

  // Se o token existir, libera a rota filha (<Outlet />)
  // Se não existir, redireciona para o "/login" substituindo o histórico de navegação
  return token && user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default RotaProtegida;