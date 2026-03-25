'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Settings, Building2, Users, Tag, Loader2, AlertCircle } from 'lucide-react';
import { requestService } from '@/services/requestService';

export default function MasterDataManagementView() {
  const [subsidiaries, setSubsidiaries] = useState<{id: string, name: string}[]>([]);
  const [departments, setDepartments] = useState<{id: string, name: string}[]>([]);
  const [chargeClasses, setChargeClasses] = useState<{id: string, name: string}[]>([]);

  const [newName, setNewName] = useState('');
  const [selectedSubsidiaryId, setSelectedSubsidiaryId] = useState('');
  const [activeTab, setActiveTab] = useState<'subsidiary' | 'department' | 'class'>('subsidiary');
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subs, depts, classes] = await Promise.all([
        requestService.getSubsidiaries(),
        requestService.getDepartments(),
        requestService.getChargeClasses()
      ]);
      setSubsidiaries(subs || []);
      setDepartments(depts || []);
      setChargeClasses(classes || []);
    } catch (error) {
      console.error('Erro ao carregar dados mestres', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setIsLoading(true);
    try {
      if (activeTab === 'subsidiary') await requestService.createSubsidiary(newName);
      else if (activeTab === 'department') await requestService.createDepartment(newName);
      else if (activeTab === 'class') await requestService.createChargeClass(newName, selectedSubsidiaryId);
      
      setNewName('');
      setSelectedSubsidiaryId('');
      await fetchData();
    } catch (error) {
      console.error('Erro ao adicionar item', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;
    setIsLoading(true);
    try {
      if (activeTab === 'subsidiary') await requestService.deleteSubsidiary(id);
      else if (activeTab === 'department') await requestService.deleteDepartment(id);
      else if (activeTab === 'class') await requestService.deleteChargeClass(id);
      await fetchData();
    } catch (error) {
      console.error('Erro ao excluir item', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActiveList = () => {
    if (activeTab === 'subsidiary') return subsidiaries;
    if (activeTab === 'department') return departments;
    return chargeClasses;
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Settings size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Gestão de Tabelas Mestras</h2>
          <p className="text-gray-500 text-sm">Configure as opções que os colaboradores poderão selecionar.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm mb-8">
        <button 
          onClick={() => setActiveTab('subsidiary')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'subsidiary' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Building2 size={18} /> Subsidiárias
        </button>
        <button 
          onClick={() => setActiveTab('department')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'department' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Users size={18} /> Departamentos
        </button>
        <button 
          onClick={() => setActiveTab('class')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'class' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Tag size={18} /> Classes de Custo
        </button>
      </div>

      {/* Cadastro Rápido */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-end w-full">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">
              Novo(a) {activeTab === 'subsidiary' ? 'Subsidiária' : activeTab === 'department' ? 'Departamento' : 'Classe'}
            </label>
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={`Digite o nome do(a) ${activeTab === 'subsidiary' ? 'unidade' : activeTab === 'department' ? 'setor' : 'conta'}...`}
              className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-sm"
            />
          </div>

          {activeTab === 'class' && (
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">
                Vincular a Subsidiária (Opcional)
              </label>
              <select 
                value={selectedSubsidiaryId}
                onChange={(e) => setSelectedSubsidiaryId(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-sm bg-white"
              >
                <option value="">Nenhuma / Geral</option>
                {subsidiaries.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}

          <button 
            onClick={handleAdd}
            disabled={isLoading || !newName.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 whitespace-nowrap"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Adicionar Item
          </button>
        </div>
        
        {activeTab === 'class' && subsidiaries.length === 0 && (
          <p className="text-[10px] text-orange-500 font-bold flex items-center gap-1 mt-1">
             <AlertCircle size={12} /> Nenhuma subsidiária cadastrada. Você poderá vincular classes a subsidiárias posteriormente.
          </p>
        )}
      </div>

      {/* Lista */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identificador</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome do Registro</th>
                {activeTab === 'class' && <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vínculo</th>}
                <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading && getActiveList().length === 0 ? (
                <tr>
                  <td colSpan={activeTab === 'class' ? 4 : 3} className="px-8 py-20 text-center">
                    <Loader2 size={32} className="text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 text-sm font-medium">Carregando dados mestres...</p>
                  </td>
                </tr>
              ) : getActiveList().length === 0 ? (
                <tr>
                  <td colSpan={activeTab === 'class' ? 4 : 3} className="px-8 py-20 text-center text-gray-400 italic text-sm">
                    Nenhum registro encontrado para esta categoria.
                  </td>
                </tr>
              ) : (
                getActiveList().map((item: any) => (
                  <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5 font-mono text-xs text-gray-400">ID-{item.id.substring(0, 8).toUpperCase()}</td>
                    <td className="px-8 py-5 text-sm font-bold text-gray-700">{item.name}</td>
                    {activeTab === 'class' && (
                      <td className="px-8 py-5 text-xs text-gray-500 font-medium">
                        {item.subsidiaryId ? subsidiaries.find(s => s.id === item.subsidiaryId)?.name || 'Subsidiária Removida' : 'Geral'}
                      </td>
                    )}
                    <td className="px-8 py-5 text-center">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
