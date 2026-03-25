import { UserAccount } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const userService = {
  async listUsers(): Promise<UserAccount[]> {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Erro ao listar usuários');
    return response.json();
  },

  async createUser(userData: Partial<UserAccount>): Promise<UserAccount> {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Erro ao criar usuário');
    return response.json();
  },

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir usuário');
  }
};
