'use client';

import { Eye, FileText, Calendar, User as UserIcon } from 'lucide-react';
import { ReimbursementRequest, UserRole } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';

interface RequestListProps {
  requests: ReimbursementRequest[];
  role: UserRole;
  onOpenDetails: (request: ReimbursementRequest) => void;
}

export default function RequestList({ requests, role, onOpenDetails }: RequestListProps) {
  // Filtro: Admin não vê rascunhos de utilizadores (conforme regra de negócio)
  const filteredRequests = role === 'admin' 
    ? requests.filter(r => r.status !== 'Rascunho')
    : requests;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (filteredRequests.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 shadow-sm animate-fade-in-up">
        <FileText size={48} className="mx-auto mb-4 opacity-20" />
        <p className="text-lg font-medium">Nenhuma solicitação encontrada</p>
        <p className="text-sm mt-1">As solicitações aparecerão aqui assim que forem criadas.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up">
      {/* Indicador de scroll mobile */}
      <div className="md:hidden px-6 py-2 bg-blue-50 text-[10px] font-bold text-blue-600 flex items-center gap-2 uppercase tracking-wide border-b border-blue-100">
        <div className="w-1 h-1 rounded-full bg-blue-600 animate-pulse"></div>
        Deslize para o lado para ver mais detalhes
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
              <th className="px-6 py-6 font-black">ID / Título</th>
              {role === 'admin' && <th className="px-6 py-6 font-black">Colaborador</th>}
              <th className="px-6 py-6 font-black">Data</th>
              <th className="px-6 py-6 font-black">Status</th>
              <th className="px-6 py-6 text-right font-black">Valor Total</th>
              <th className="px-6 py-6 text-center font-black">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredRequests.map((req) => (
              <tr key={req.id} className="hover:bg-blue-50/30 transition-all group cursor-default">
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md group-hover:bg-blue-100 group-hover:text-blue-700 transition-all uppercase tracking-tighter mb-0.5 w-fit">
                      {req.displayId || req.id.substring(0, 8)}
                    </span>
                    <span className="text-sm font-bold text-gray-800">{req.title}</span>
                  </div>
                </td>
                {role === 'admin' && (
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                         {(req.user || 'Usuário').charAt(0).toUpperCase()}
                       </div>
                       <span className="text-sm text-gray-600">{req.user || 'Usuário Não Identificado'}</span>
                    </div>
                  </td>
                )}
                <td className="px-6 py-5 whitespace-nowrap text-xs text-gray-500">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar size={14} className="text-blue-400" />
                    {req.date}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <StatusBadge status={req.status} />
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-gray-900 text-right">
                  {formatCurrency(req.totalValue)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-center">
                  <button
                    onClick={() => onOpenDetails(req)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Abrir Detalhes"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
