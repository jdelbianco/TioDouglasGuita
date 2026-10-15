import { useState } from 'react';
import {
  LayoutDashboard,
  ChevronUp,
  FileText,
  Wallet,
  Bell,
  Menu,
  X,
  Settings
} from 'lucide-react';

function NavBar() {
    const [mostrarSubMenu, setMostrarSubMenu] = useState(true);
    const [menuAberto, setMenuAberto] = useState(false); // Estado para controlar a gaveta no mobile

    const userData = localStorage.getItem('douglasguita_user');
    const data = userData ? JSON.parse(userData) : null;

    // avatar
    const avatarUrl = data?.profilePicture || `https://github.com/shadcn.png`;

    return (
        <>
            {/* 1. HEADER MOBILE (Visível apenas em telas pequenas) */}
            <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 z-40">
                <span className="text-white font-bold text-lg">DouglasGuita</span>
                <button 
                    onClick={() => setMenuAberto(true)}
                    className="text-zinc-300 hover:text-white transition-colors"
                >
                    <Menu size={28} />
                </button>
            </div>

            {/* 2. OVERLAY / Fundo Escurecido (Aparece apenas quando o menu mobile está aberto) */}
            {menuAberto && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-sm transition-opacity" 
                    onClick={() => setMenuAberto(false)}
                />
            )}

            {/* 3. BARRA DE NAVEGAÇÃO (Sidebar) */}
            <nav className={`fixed md:sticky left-0 top-0 h-screen w-64 bg-zinc-900 border-r border-zinc-800 p-4 z-50 flex flex-col transform transition-transform duration-300 ease-in-out overflow-y-auto custom-scrollbar
                ${menuAberto ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0`}
            >
                {/* Botão de Fechar (Visível apenas no mobile, dentro da barra) */}
                <div className="md:hidden flex justify-end mb-2">
                    <button 
                        onClick={() => setMenuAberto(false)}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* 1. SEÇÃO DE PERFIL */}
                <div className="flex items-center gap-3 mb-8 md:mt-2">
                    <img 
                        src={avatarUrl}
                        alt="Perfil" 
                        className="w-11 h-11 rounded-full border border-zinc-800 object-cover" 
                    />
                    <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">
                            Usuário
                        </span>
                        <span className="text-sm text-zinc-100 font-bold tracking-wide line-clamp-1">
                            {data?.name || 'Usuário'}
                        </span>
                    </div>
                </div>

                {/* 2. TÍTULO DA SEÇÃO */}
                <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mb-3 px-2">
                    Guitar core
                </p>

                {/* 3. ITEM PRINCIPAL (ATIVO) */}
                <div onClick={() => setMostrarSubMenu(!mostrarSubMenu)} className="flex items-center justify-between bg-zinc-800/60 p-3 rounded-2xl cursor-pointer mb-1 transition-colors hover:bg-zinc-800">
                    <div className="flex items-center gap-3 text-zinc-100">
                        <LayoutDashboard size={20} className="text-zinc-300" />
                        <span className="text-sm font-medium">Dashboard</span>
                    </div>
                    <ChevronUp size={16} className={`text-zinc-400 transition-transform duration-300 ${mostrarSubMenu ? '' : 'rotate-180'}`} />
                </div>

                {/* 4. SUB-MENUS COM A LINHA GUIA (Efeito de Árvore) */}
                {mostrarSubMenu && (
                    <div className="ml-6 border-l border-zinc-700/50 flex flex-col pb-4 mb-2">
                        
                        {/* Sub-item: Inicio */}
                        <div className="relative flex items-center pl-6 text-sm font-medium text-zinc-400 hover:text-zinc-200 cursor-pointer py-2 group">
                            <div className="absolute left-0 top-0 w-3 h-1/2 border-l border-b border-zinc-700/50 rounded-bl-xl group-hover:border-zinc-500 transition-colors"></div>
                            <a href="/home" className="text-sm font-medium text-zinc-400 hover:text-zinc-200 cursor-pointer w-full">
                                Inicio
                            </a>
                        </div>

                        {/* Sub-item: Pomodoro */}
                        <div className="relative flex items-center pl-6 text-sm font-medium text-zinc-400 hover:text-zinc-200 cursor-pointer py-2 group">
                            <div className="absolute left-0 top-0 w-3 h-1/2 border-l border-b border-zinc-700/50 rounded-bl-xl group-hover:border-zinc-500 transition-colors"></div>
                            <a href="/pomodoro" className="text-sm font-medium text-zinc-400 hover:text-zinc-200 cursor-pointer w-full">
                                Pomodoro
                            </a>
                        </div>

                        {/* Sub-item: Task */}
                        <div className="relative flex items-center pl-6 text-sm font-medium text-zinc-400 hover:text-zinc-200 cursor-pointer py-2 group">
                            <div className="absolute left-0 top-0 w-3 h-1/2 border-l border-b border-zinc-700/50 rounded-bl-xl group-hover:border-zinc-500 transition-colors"></div>
                            <a href="/task" className="text-sm font-medium text-zinc-400 hover:text-zinc-200 cursor-pointer w-full">
                                Tarefas
                            </a>
                        </div>
                        
                    </div>
                )}

                <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mb-2 px-2 mt-2">
                    Materiais & Recursos
                </p>

                {/* 5. OUTROS ITENS DO MENU */}
                <a href="/files" className="flex items-center gap-3 p-3 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 rounded-2xl cursor-pointer mb-1 transition-all duration-200">
                    <FileText size={20} />
                    Apostilas
                </a>

                {/* 6. Backing-track */}
                <a href="/backing-track" className="flex items-center gap-3 p-3 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 rounded-2xl cursor-pointer mb-1 transition-all duration-200">
                    <FileText size={20} />
                    Backing Track's
                </a>

                {/* 7. Pad */}
                <a href="/pad" className="flex items-center gap-3 p-3 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 rounded-2xl cursor-pointer mb-1 transition-all duration-200">
                    <FileText size={20} />
                    Pad
                </a>
                <div className="mt-auto pt-4 border-t border-zinc-800">
                    <a
                        href="/settings"
                        className="flex items-center gap-3 p-3 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-2xl cursor-pointer transition-all duration-200 group"
                    >
                        <Settings
                        size={20}
                        className="group-hover:rotate-90 transition-transform duration-500"
                        />
                        <span className="text-sm font-medium">
                        Configurações
                        </span>
                    </a>
                </div>
            </nav>
            
        </>
    );
}

export default NavBar;