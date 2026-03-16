'use client';

import { DollarSign, Clock, CheckCircle } from 'lucide-react';
import { ReimbursementRequest } from '@/types';

interface KpiCardsProps {
  requests: ReimbursementRequest[];
}

export default function KpiCards({ requests }: KpiCardsProps) {
  // Cálculos das métricas
  const pendingRequests = requests.filter(r => r.status === 'Pendente');
  const totalPendingValue = pendingRequests.reduce((acc, curr) => acc + curr.totalValue, 0);
  
  const approvedRequests = requests.filter(r => r.status === 'Aprovado');
  const totalApprovedValue = approvedRequests.reduce((acc, curr) => acc + curr.totalValue, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const cards = [
    {
      label: 'Solicitações Pendentes',
      value: pendingRequests.length.toString(),
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Total Pendente',
      value: formatCurrency(totalPendingValue),
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Aprovado',
      value: formatCurrency(totalApprovedValue),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`p-3 rounded-lg ${card.bgColor} ${card.color}`}>
            <card.icon size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.label}</p>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
