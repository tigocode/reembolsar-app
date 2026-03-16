'use client';

import { X, MessageSquare, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
  title: string;
  description: string;
  type: 'devolver' | 'rejeitar';
  placeholder?: string;
}

export default function ActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type,
  placeholder = 'Escreva o motivo aqui...'
}: ActionModalProps) {
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!note.trim()) {
      alert('Por favor, indique um motivo.');
      return;
    }
    onConfirm(note);
    setNote('');
  };

  const isRejeitar = type === 'rejeitar';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className={`p-1 h-2 ${isRejeitar ? 'bg-red-500' : 'bg-yellow-500'}`} />
        
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className={`p-3 rounded-2xl ${isRejeitar ? 'bg-red-50' : 'bg-yellow-50'}`}>
              {isRejeitar ? (
                <AlertTriangle className="text-red-600" size={24} />
              ) : (
                <MessageSquare className="text-yellow-600" size={24} />
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <h3 className="text-2xl font-black text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            {description}
          </p>

          <div className="space-y-4">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
              Observações / Motivo (Obrigatório)
            </label>
            <textarea
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={placeholder}
              rows={4}
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all resize-none text-gray-700"
            />
          </div>

          <div className="flex gap-3 mt-10">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all text-sm"
            >
              Cancelar
            </button>
            <button 
              onClick={handleConfirm}
              className={`flex-1 px-6 py-4 rounded-2xl text-white font-bold transition-all text-sm shadow-lg ${
                isRejeitar 
                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' 
                : 'bg-yellow-600 hover:bg-yellow-700 shadow-yellow-500/20'
              }`}
            >
              Confirmar Ação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
