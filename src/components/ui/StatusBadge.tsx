import { RequestStatus } from '@/types';

interface StatusBadgeProps {
  status: RequestStatus;
}

const BADGE_STYLES: Record<string, string> = {
  Rascunho:  'bg-gray-200 text-gray-700 border-gray-300',
  Pendente:  'bg-yellow-100 text-yellow-800 border-yellow-200', // Legacy fallback
  'Aguardando Diretor': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Aguardando Financeiro': 'bg-blue-100 text-blue-800 border-blue-200',
  Devolvido: 'bg-orange-100 text-orange-800 border-orange-200',
  Rejeitado: 'bg-red-100 text-red-800 border-red-200',
  Aprovado:  'bg-green-100 text-green-800 border-green-200',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${BADGE_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
