'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, UserRole } from '@/types';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  role: UserRole;
  login: (loginId: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('reembolsar_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (loginId: string) => {
    try {
      const userData = await authService.login(loginId);
      setUser(userData);
      localStorage.setItem('reembolsar_user', JSON.stringify(userData));
      router.push('/');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('reembolsar_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        role: user?.role ?? 'user',
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
