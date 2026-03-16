'use client';

import { X, CheckCircle2, AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  variant?: 'success' | 'danger';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  variant = 'success'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="p-8 pb-10">
          <div className="flex items-center justify-between mb-8">
            <div className={`p-4 rounded-full ${isDanger ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {isDanger ? <AlertCircle size={32} /> : <CheckCircle2 size={32} />}
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <h3 className="text-2xl font-black text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-500 leading-relaxed">
            {description}
          </p>

          <div className="flex gap-3 mt-10">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all text-sm"
            >
              Não, voltar
            </button>
            <button 
              onClick={onConfirm}
              className={`flex-1 px-6 py-4 rounded-2xl text-white font-bold transition-all text-sm shadow-lg ${
                isDanger 
                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' 
                : 'bg-green-600 hover:bg-green-700 shadow-green-500/20'
              }`}
            >
              Sim, confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
