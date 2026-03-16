'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  role: UserRole;
  login: (userData: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Utilizadores simulados para Fase 1 (sem API)
export const MOCK_USERS: Record<UserRole, User> = {
  user: {
    id: 'usr-001',
    name: 'João Silva',
    email: 'joao.silva@empresa.pt',
    role: 'user',
  },
  admin: {
    id: 'adm-001',
    name: 'Admin Financeiro',
    email: 'financeiro@empresa.pt',
    role: 'admin',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Recupera utilizador salvo ao recarregar a página
    const storedUser = localStorage.getItem('reembolsar_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Por defeito, inicia como Colaborador na Fase 1
      const defaultUser = MOCK_USERS['user'];
      setUser(defaultUser);
      localStorage.setItem('reembolsar_user', JSON.stringify(defaultUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('reembolsar_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('reembolsar_user');
  };

  const switchRole = (role: UserRole) => {
    const newUser = MOCK_USERS[role];
    login(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        role: user?.role ?? 'user',
        login,
        logout,
        switchRole,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
