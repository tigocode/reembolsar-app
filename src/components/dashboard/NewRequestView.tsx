'use client';

import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Send, 
  ChevronLeft, 
  FileText, 
  Layers,
  Image as ImageIcon,
  Upload,
  Check
} from 'lucide-react';
import { ReimbursementRequest, Receipt, RequestStatus } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

interface NewRequestViewProps {
  onBack: () => void;
  onSubmit: (request: Partial<ReimbursementRequest>) => void;
  editingRequest?: ReimbursementRequest | null;
}

export default function NewRequestView({ onBack, onSubmit, editingRequest }: NewRequestViewProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [isMultiple, setIsMultiple] = useState(false);

  // Estados do Formulário
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Viagem e Alojamento');
  const [project, setProject] = useState('Operações Internas');
  const [paymentMethod, setPaymentMethod] = useState('Cartão Corporativo');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Lista de recibos
  const [receipts, setReceipts] = useState<Partial<Receipt>[]>([
    { description: '', value: '', receiptUrl: '' }
  ]);

  // Efeito para carregar dados em modo edição
  useEffect(() => {
    if (editingRequest) {
      setTitle(editingRequest.title);
      setType(editingRequest.type);
      setProject(editingRequest.project);
      setPaymentMethod(editingRequest.paymentMethod);
      setLocation(editingRequest.location);
      setDate(editingRequest.date);
      setIsMultiple(editingRequest.isMultiple);
      setReceipts(editingRequest.receipts.map(r => ({ ...r })));
      setStep(2); // Vai direto para o formulário
    }
  }, [editingRequest]);

  const handleAddReceipt = () => {
    setReceipts([...receipts, { description: '', value: '' }]);
  };

  const handleRemoveReceipt = (index: number) => {
    if (receipts.length > 1) {
      setReceipts(receipts.filter((_, i) => i !== index));
    }
  };

  const updateReceipt = (index: number, field: keyof Receipt, val: any) => {
    const newReceipts = [...receipts];
    newReceipts[index] = { ...newReceipts[index], [field]: val };
    setReceipts(newReceipts);
  };

  const handleFileUpload = (index: number, file: File) => {
    if (!file) return;

    // Simulação de upload lendo como Base64 para persistência no localStorage
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateReceipt(index, 'receiptUrl', base64String);
    };
    reader.readAsDataURL(file);
  };

  const calculateTotal = () => {
    return receipts.reduce((acc, curr) => acc + (parseFloat(curr.value as string) || 0), 0);
  };

  const handleSubmitAction = (status: RequestStatus) => {
    if (!title || !location) {
      alert('Por favor, preencha o título e o local.');
      return;
    }

    const newRequest: Partial<ReimbursementRequest> = {
      title,
      type,
      project,
      paymentMethod,
      location,
      date,
      status,
      totalValue: calculateTotal(),
      isMultiple,
      user: user?.name || 'Usuário',
      receipts: receipts.map((r, i) => ({
        ...r,
        id: `REC-NEW-${Date.now()}-${i}`,
        value: parseFloat(r.value as string) || 0
      })) as Receipt[],
      history: [
        { 
          id: Date.now(), 
          action: status === 'Rascunho' ? 'Rascunho criado' : 'Enviado para aprovação', 
          date: new Date().toLocaleString('pt-BR'), 
          user: user?.name || 'Usuário' 
        }
      ]
    };

    onSubmit(newRequest);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 px-2 sm:px-0">
      <button 
        onClick={onBack} 
        className="text-blue-600 text-sm mb-4 sm:mb-6 hover:underline flex items-center gap-1 font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors"
      >
        <ChevronLeft size={16} /> Voltar para Dashboard
      </button>

      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          {editingRequest ? 'Editar Solicitação' : 'Nova Solicitação'}
        </h2>
        <div className="flex gap-1.5 sm:gap-2">
           <span className={`w-2.5 h-2.5 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></span>
           <span className={`w-2.5 h-2.5 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></span>
        </div>
      </div>

      {step === 1 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-fade-in-up">
          <button 
            onClick={() => { setIsMultiple(false); setStep(2); }}
            className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-gray-100/50 hover:border-blue-500 hover:shadow-xl transition-all text-left group"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 sm:mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FileText size={28} />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-gray-800 mb-2">Recibo Único</h3>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              Ideal para despesas isoladas, como um táxi ou um jantar específico com cliente.
            </p>
          </button>

          <button 
            onClick={() => { setIsMultiple(true); setStep(2); }}
            className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-gray-100/50 hover:border-blue-500 hover:shadow-xl transition-all text-left group"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 sm:mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Layers size={28} />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-gray-800 mb-2">Múltiplos Recibos</h3>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              Use para agrupar várias despesas de uma mesma viagem ou evento num único dossiê.
            </p>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
          <div className="p-5 sm:p-8 border-b border-gray-50 bg-gray-50/20">
            <h3 className="text-base sm:text-lg font-black text-gray-800 flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold">01</span>
              Informações Gerais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="md:col-span-2">
                <label className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Título da Solicitação</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Viagem de Negociações Q1 - Lisboa" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 text-sm sm:text-base font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Tipo de Despesa</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat text-sm sm:text-base font-medium"
                >
                  <option>Viagem e Alojamento</option>
                  <option>Alimentação e Representação</option>
                  <option>Transporte</option>
                  <option>Material e Equipamento</option>
                  <option>Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Projeto</label>
                <select 
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat text-sm sm:text-base font-medium"
                >
                  <option>Operações Internas</option>
                  <option>Conferência WebSummit</option>
                  <option>Vendas Q1</option>
                  <option>Parcerias Estratégicas</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Localidade</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Lisboa, Portugal" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 text-sm sm:text-base font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Data</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm sm:text-base font-medium"
                />
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">02</span>
                Itens de Despesa
              </h3>
              {isMultiple && (
                <button 
                  onClick={handleAddReceipt}
                  className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus size={16} /> Adicionar Recibo
                </button>
              )}
            </div>

            <div className="space-y-3 sm:space-y-4">
              {receipts.map((receipt, index) => (
                <div key={index} className="flex flex-col lg:flex-row gap-4 p-5 sm:p-6 rounded-2xl border border-gray-100 bg-gray-50/30 relative group transition-all hover:border-blue-100 hover:bg-blue-50/10">
                  <div className="flex-1 min-w-0">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest leading-none">Descrição da Despesa</label>
                    <input 
                      type="text" 
                      value={receipt.description}
                      onChange={(e) => updateReceipt(index, 'description', e.target.value)}
                      placeholder="Ex: Almoço com cliente" 
                      className="w-full px-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-xs sm:text-sm font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 lg:flex gap-4">
                    <div className="lg:w-32">
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest leading-none">Valor (R$)</label>
                      <input 
                        type="number" 
                        value={receipt.value}
                        onChange={(e) => updateReceipt(index, 'value', e.target.value)}
                        placeholder="0,00" 
                        className="w-full px-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-xs sm:text-sm font-black text-blue-600"
                      />
                    </div>
                    <div className="lg:w-48">
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest leading-none">Comprovante</label>
                      <div className="relative group/upload">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => e.target.files && handleFileUpload(index, e.target.files[0])}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`border-2 border-dashed rounded-xl py-2 px-3 text-center transition-all ${
                          receipt.receiptUrl 
                            ? 'border-green-200 bg-green-50/30' 
                            : 'border-gray-200 bg-white group-hover/upload:border-blue-300'
                        }`}>
                          <div className="flex items-center justify-center gap-2">
                            {receipt.receiptUrl ? (
                              <>
                                <Check size={14} className="text-green-600" />
                                <span className="text-[10px] font-bold text-green-700 uppercase">Alterar Foto</span>
                              </>
                            ) : (
                              <>
                                <Upload size={14} className="text-gray-400 group-hover/upload:text-blue-500" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase group-hover/upload:text-blue-600">Upload</span>
                              </>
                            )}
                          </div>
                        </div>
                        {receipt.receiptUrl && (
                          <div className="mt-2 flex items-center gap-2">
                             <div className="w-8 h-8 rounded bg-gray-100 border border-gray-200 overflow-hidden">
                                <img src={receipt.receiptUrl} alt="Preview" className="w-full h-full object-cover" />
                             </div>
                             <span className="text-[9px] text-gray-400 truncate max-w-[80px]">imagem_carregada.jpg</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {isMultiple && receipts.length > 1 && (
                    <button 
                      onClick={() => handleRemoveReceipt(index)}
                      className="absolute -right-2 -top-2 lg:relative lg:top-auto lg:right-auto lg:mt-5 p-2 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-xl transition-all shadow-sm border border-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-slate-900 rounded-3xl flex flex-col md:flex-row items-center justify-between text-white shadow-2xl shadow-slate-900/40 border border-slate-800 relative z-10 overflow-hidden">
              {/* Brilho decorativo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl -mr-16 -mt-16 rounded-full pointer-events-none"></div>

              <div className="text-center md:text-left mb-6 md:mb-0">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Valor Total Estimado</p>
                <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 leading-tight">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateTotal())}
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <button 
                  onClick={() => handleSubmitAction('Rascunho')}
                  className="whitespace-nowrap flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 font-bold transition-all text-sm border border-slate-700/50 group"
                >
                  <Save size={18} className="text-slate-400 group-hover:text-white transition-colors" /> Salvar Rascunho
                </button>
                <button 
                  onClick={() => handleSubmitAction('Pendente')}
                  className="whitespace-nowrap flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 font-black transition-all text-sm shadow-xl shadow-blue-600/20 border border-blue-500/50"
                >
                  <Send size={18} /> {editingRequest ? 'Salvar e Enviar' : 'Enviar p/ Aprovação'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
