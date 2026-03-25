'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Search, 
  UserPlus, 
  Shield, 
  UserCheck, 
  Mail, 
  Hash,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { UserAccount, UserLevel } from '@/types';
import { userService } from '@/services/userService';

export default function UserManagementView() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLevel, setNewLevel] = useState<UserLevel>('Colaborador');
  const [newEmail, setNewEmail] = useState('');
  const [newApproverId, setNewApproverId] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.listUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    try {
      const approver = users.find(u => u.id === newApproverId);
      await userService.createUser({
        name: newName,
        level: newLevel,
        email: newEmail,
        approverId: newApproverId || undefined,
        approverName: approver?.name || undefined,
      });
      
      setNewName('');
      setNewEmail('');
      setNewApproverId('');
      setIsAdding(false);
      loadUsers();
    } catch (error) {
      console.error(error);
      alert('Erro ao criar usuário');
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${name}?`)) return;
    try {
      await userService.deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir usuário');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.loginId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Users className="text-blue-600" size={32} />
            Gestão de Usuários
          </h1>
          <p className="text-gray-500 font-medium mt-1">Cadastre e gerencie os acessos do sistema</p>
        </div>

        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 w-fit"
        >
          {isAdding ? 'Cancelar' : (
            <>
              <UserPlus size={18} /> Novo Usuário
            </>
          )}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Plus className="text-green-500" size={20} />
            Cadastrar Novo Usuário
          </h3>
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Nome Completo</label>
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                placeholder="Ex: João Silva" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Nível / Cargo</label>
              <select 
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value as UserLevel)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat text-sm font-medium"
              >
                <option value="Colaborador">Colaborador</option>
                <option value="Diretor">Diretor</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">E-mail {newLevel === 'Colaborador' && '(Opcional)'}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="email" 
                  value={newEmail}
                  required={newLevel === 'Diretor'}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="joao@empresa.com" 
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Aprovador Responsável (Subordinado a)</label>
              <select 
                value={newApproverId}
                onChange={(e) => setNewApproverId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat text-sm font-medium"
              >
                <option value="">Selecione um aprovador...</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.level})</option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2 flex items-end">
              <button 
                type="submit"
                className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg"
              >
                Finalizar Cadastro
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            />
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {filteredUsers.length} Usuários Encontrados
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="text-blue-600 animate-spin" size={32} />
            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Carregando usuários...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 bg-gray-50/50">
            <Users className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-500 font-bold">Nenhum usuário encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th className="px-8 py-4">Usuário</th>
                  <th className="px-8 py-4">Nível</th>
                  <th className="px-8 py-4">Login ID</th>
                  <th className="px-8 py-4">Aprovador</th>
                  <th className="px-8 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email || 'Sem e-mail'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        user.level === 'Diretor' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {user.level === 'Diretor' ? <Shield size={12} /> : <UserCheck size={12} />}
                        {user.level}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-500">
                        <Hash size={14} className="text-gray-300" />
                        {user.loginId}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {user.approverName ? (
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                          <ChevronRight size={14} className="text-gray-300" />
                          {user.approverName}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300 font-medium">Nenhum</span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Excluir Usuário"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
