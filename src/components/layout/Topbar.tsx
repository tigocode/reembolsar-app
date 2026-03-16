'use client';

import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user, role } = useAuth();

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 print-hidden shrink-0 border-b border-gray-100">
      <button 
        onClick={onMenuClick} 
        className="md:hidden text-gray-500 hover:text-gray-700 p-2"
        aria-label="Abrir menu"
      >
        <Menu size={24} />
      </button>
      
      <div className="flex-1"></div>
      
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="text-right hidden xs:block">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter opacity-70">Sessão Ativa</p>
          <p className="text-xs sm:text-sm font-black text-gray-800 uppercase tracking-tight flex items-center justify-end">
            <span className="truncate max-w-[100px] sm:max-w-none">{user?.name}</span>
            <span className={`ml-2 text-[9px] px-1.5 py-0.5 rounded-full font-black border ${
              role === 'admin' 
                ? 'text-purple-600 border-purple-200 bg-purple-100/50' 
                : 'text-blue-600 border-blue-200 bg-blue-100/50'
            }`}>
              {role === 'admin' ? 'FINANÇAS' : 'COLAB'}
            </span>
          </p>
        </div>
        
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ring-2 ring-offset-1 ${
          role === 'admin' ? 'bg-purple-600 ring-purple-100' : 'bg-blue-600 ring-blue-100'
        }`}>
          {user?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  );
}
