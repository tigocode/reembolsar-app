'use client';

import { 
  Home, 
  Plus, 
  Users, 
  Settings, 
  BarChart2, 
  X,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentView: 'dashboard' | 'new_request' | 'details' | 'master_data' | 'users' | 'manager_approvals';
  setCurrentView: (view: 'dashboard' | 'new_request' | 'details' | 'master_data' | 'users' | 'manager_approvals') => void;
}

export default function Sidebar({ 
  isOpen, 
  setIsOpen, 
  currentView, 
  setCurrentView 
}: SidebarProps) {
  const { role, user, logout } = useAuth();

  const handleNavigate = (view: 'dashboard' | 'new_request' | 'details' | 'master_data' | 'users' | 'manager_approvals') => {
    setCurrentView(view);
    setIsOpen(false);
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${isOpen ? 'translate-x-0 shadow-2xl shadow-slate-950/50' : '-translate-x-full shadow-none'} md:relative md:translate-x-0 print-hidden border-r border-slate-800/50`}
      >
        <div className="p-6 flex justify-between items-center border-b border-slate-800">
          <h1 className="text-2xl font-bold tracking-wider">
            Reembolso<span className="text-blue-500">App</span>
          </h1>
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden text-white hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="mt-6 flex flex-col gap-1 px-2">
          <button 
            onClick={() => handleNavigate('dashboard')} 
            className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors
              ${currentView === 'dashboard' ? 'bg-blue-600 border-l-4 border-blue-400' : 'hover:bg-slate-800'}`}
          >
            {role === 'user' ? <Home className="mr-3" size={20} /> : <BarChart2 className="mr-3" size={20} />}
            {role === 'user' ? 'Minhas Solicitações' : 'Visão Gerencial'}
          </button>
          
          {role === 'user' && (
            <>
              <button 
                onClick={() => handleNavigate('new_request')} 
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors
                  ${currentView === 'new_request' ? 'bg-blue-600 border-l-4 border-blue-400' : 'hover:bg-slate-800'}`}
              >
                <Plus className="mr-3" size={20} /> Nova Solicitação
              </button>

              {user?.level === 'Diretor' && (
                <button 
                  onClick={() => handleNavigate('manager_approvals')} 
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors mt-1
                    ${currentView === 'manager_approvals' ? 'bg-emerald-600 border-l-4 border-emerald-400' : 'hover:bg-slate-800'}`}
                >
                  <ShieldCheck className="mr-3" size={20} /> Minhas Aprovações
                </button>
              )}
            </>
          )}

          {role === 'admin' && (
            <>
              <div className="px-4 py-3 mt-4 text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Administração
              </div>
              <button 
                onClick={() => handleNavigate('master_data')} 
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors
                  ${currentView === 'master_data' ? 'bg-blue-600 border-l-4 border-blue-400' : 'hover:bg-slate-800'}`}
              >
                <Settings className="mr-3" size={20} /> Tabelas Mestras
              </button>
              
              <button 
                onClick={() => handleNavigate('users')} 
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors mt-1
                  ${currentView === 'users' ? 'bg-blue-600 border-l-4 border-blue-400' : 'hover:bg-slate-800'}`}
              >
                <Users className="mr-3" size={20} /> Gestão de Usuários
              </button>
            </>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <div className="px-4 py-2 mb-2">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Logado como:</p>
            <p className="text-sm text-blue-400 font-bold truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-500 font-medium">{user?.level || user?.role}</p>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="mr-3" size={16} /> Sair
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden print-hidden" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
