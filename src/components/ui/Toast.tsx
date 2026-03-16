'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-4 left-1/2 z-50 animate-fade-in-down print-hidden">
      <div
        className={`flex items-center gap-2 px-5 py-3 rounded-lg shadow-xl text-sm font-medium text-white
          ${type === 'success' ? 'bg-gray-900' : 'bg-red-700'}`}
      >
        {type === 'success' ? (
          <CheckCircle size={16} className="text-green-400 shrink-0" />
        ) : (
          <XCircle size={16} className="text-red-300 shrink-0" />
        )}
        {message}
      </div>
    </div>
  );
}
