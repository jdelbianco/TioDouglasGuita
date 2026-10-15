import { useState, useEffect } from 'react';
import { User, Mail, Lock, Camera, Save, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import Navbar from "../../components/Navbar";

function Settings() {
  // Estado para armazenar o ID do utilizador logado
  const [userId, setUserId] = useState(null);

  // Estados dos Dados Pessoais
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('https://github.com/shadcn.png');
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Estados da Palavra-passe
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Carrega os dados do localStorage ao entrar na página
  useEffect(() => {
    const userData = localStorage.getItem('douglasguita_user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserId(parsedData.id);
      setNome(parsedData.name || '');
      setEmail(parsedData.email || '');
      if (parsedData.profilePicture) {
        setAvatarPreview(parsedData.profilePicture);
      }
    }
  }, []);

  // Função 1: Atualizar Informações Básicas (Nome e E-mail)
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setIsSavingInfo(true);
      
      const response = await api.put(`/user/${userId}`, { name: nome, email: email });
      
      // Atualiza o localStorage com os novos dados
      const currentUserData = JSON.parse(localStorage.getItem('douglasguita_user'));
      const updatedData = { ...currentUserData, name: nome, email: email };
      localStorage.setItem('douglasguita_user', JSON.stringify(updatedData));
      
      alert("Informações atualizadas com sucesso!");
      // Dispara um evento global (opcional) caso a Navbar precise de forçar um re-render
      window.dispatchEvent(new Event('storage')); 
    } catch (error) {
      console.error("Erro ao atualizar informações:", error);
      alert(error.response?.data?.error || "Erro ao atualizar perfil.");
    } finally {
      setIsSavingInfo(false);
    }
  };

  // Função 2: Atualizar Foto de Perfil
  const handleAvatarChange = async (e) => {
    const input = e.target;
    const file = input.files[0];
    if (!file || !userId) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Selecione uma imagem JPG, PNG ou WEBP.');
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5 MB.');
      input.value = '';
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const formData = new FormData();
      formData.append('profilePicture', file);

      const novaUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Não foi possível ler a imagem selecionada.'));
          }
        };
        reader.onerror = () => reject(reader.error || new Error('Erro ao ler a imagem.'));
        reader.readAsDataURL(file);
      });

      await api.put(`/user/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setAvatarPreview(novaUrl);

      // Atualiza o localStorage
      const currentUserData = JSON.parse(localStorage.getItem('douglasguita_user'));
      const updatedData = { ...currentUserData, profilePicture: novaUrl };
      localStorage.setItem('douglasguita_user', JSON.stringify(updatedData));
      window.dispatchEvent(new Event('storage'));

    } catch (error) {
      console.error("Erro no upload de foto:", error);
      alert(error.response?.data?.error || "Erro ao alterar a foto de perfil.");
    } finally {
      setIsUploadingAvatar(false);
      input.value = '';
    }
  };

  // Função 3: Alterar Palavra-passe
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      return alert("A nova palavra-passe e a confirmação não coincidem!");
    }

    try {
      setIsSavingPassword(true);
      
      // Envia a senha atual para validação e a nova senha para troca
      await api.put(`/user/${userId}/password`, { 
        senhaAtual, 
        novaSenha 
      });

      alert("Palavra-passe alterada com segurança!");
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      alert(error.response?.data?.error || "Erro ao alterar palavra-passe. Verifique a sua senha atual.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#09090b]">
      <Navbar />
      
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* Cabeçalho */}
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              Configurações da Conta
            </h1>
            <p className="text-zinc-400 mt-1">Faça a gestão dos seus dados pessoais e preferências de segurança.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Coluna 1: Foto de Perfil */}
            <div className="lg:col-span-1">
              <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center">
                <div className="relative group mb-4">
                  <div className="w-32 h-32 rounded-full border-4 border-[#09090b] overflow-hidden bg-zinc-800">
                    <img 
                      src={avatarPreview} 
                      alt="Avatar" 
                      className={`w-full h-full object-cover ${isUploadingAvatar ? 'opacity-50 blur-sm' : ''}`}
                    />
                  </div>
                  
                  {/* Botão de Upload invisível que cobre a foto */}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                    <Camera className="w-8 h-8 text-white" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/png, image/jpeg, image/webp" 
                      onChange={handleAvatarChange}
                      disabled={isUploadingAvatar}
                    />
                  </label>
                </div>
                
                <h3 className="text-lg font-bold text-white">{nome || 'Professor'}</h3>
                <p className="text-sm text-zinc-500 mb-4">Administrador do Sistema</p>
                <p className="text-xs text-zinc-600 bg-[#09090b] px-3 py-1.5 rounded-lg border border-zinc-800">
                  Formatos aceites: JPG, PNG, WEBP.
                </p>
              </div>
            </div>

            {/* Coluna 2: Formulários de Dados e Segurança */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Formulário de Informações Básicas */}
              <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-400" />
                  Informações Pessoais
                </h2>
                
                <form onSubmit={handleUpdateInfo} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Nome Completo</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <User className="w-4 h-4 text-zinc-500" />
                      </div>
                      <input
                        type="text"
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-[#09090b] border border-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Endereço de E-mail</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Mail className="w-4 h-4 text-zinc-500" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-[#09090b] border border-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingInfo}
                      className="flex items-center gap-2 py-3 px-6 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl transition shadow-md disabled:bg-zinc-700 disabled:text-zinc-400"
                    >
                      <Save className="w-4 h-4" />
                      {isSavingInfo ? 'A Guardar...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Formulário de Segurança (Alterar Palavra-passe) */}
              <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  Segurança da Conta
                </h2>
                
                <form onSubmit={handleUpdatePassword} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Palavra-passe Atual</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Lock className="w-4 h-4 text-zinc-500" />
                      </div>
                      <input
                        type="password"
                        required
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-[#09090b] border border-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 transition"
                        placeholder="Digite a sua senha atual"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Nova Palavra-passe</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <Lock className="w-4 h-4 text-zinc-500" />
                        </div>
                        <input
                          type="password"
                          required
                          minLength={8}
                          value={novaSenha}
                          onChange={(e) => setNovaSenha(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-[#09090b] border border-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 transition"
                          placeholder="Mínimo 8 caracteres"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Confirmar Nova Palavra-passe</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <Lock className="w-4 h-4 text-zinc-500" />
                        </div>
                        <input
                          type="password"
                          required
                          value={confirmarSenha}
                          onChange={(e) => setConfirmarSenha(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-[#09090b] border border-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 transition"
                          placeholder="Repita a nova senha"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingPassword}
                      className="flex items-center gap-2 py-3 px-6 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-emerald-500 text-white font-bold rounded-xl transition shadow-md disabled:bg-zinc-800 disabled:text-zinc-500"
                    >
                      <Lock className="w-4 h-4" />
                      {isSavingPassword ? 'A Atualizar...' : 'Atualizar Palavra-passe'}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;