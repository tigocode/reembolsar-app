'use client';

import { 
  ChevronLeft, 
  Printer, 
  Clock, 
  FileText, 
  History, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ExternalLink,
  ArrowRight,
  Edit,
  ArrowLeftRight,
  MousePointerClick,
  Info,
  Image as ImageIcon
} from 'lucide-react';
import { ReimbursementRequest, UserRole } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import DisplayField from '@/components/ui/DisplayField';

interface RequestDetailViewProps {
  request: ReimbursementRequest;
  role: UserRole;
  userLevel?: string;
  userId?: string;
  onBack: () => void;
  onUpdateStatus: (id: string, newStatus: ReimbursementRequest['status'], note?: string) => void;
  onEdit?: (request: ReimbursementRequest) => void;
}

export default function RequestDetailView({ 
  request, 
  role, 
  userLevel,
  userId,
  onBack, 
  onUpdateStatus,
  onEdit
}: RequestDetailViewProps) {

  // Logic to determine if current user can approve
  const isAwaitingDirector = request.status === 'Aguardando Diretor' || (request.status as string) === 'Pendente';
  const canApproveDirector = userLevel === 'Diretor' && isAwaitingDirector && request.approverId === userId;
  const canApproveFinance = role === 'admin' && request.status === 'Aguardando Financeiro';
  const canApprove = canApproveDirector || canApproveFinance;
  
  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 print:pb-0 animate-fade-in-up">
      {/* Cabeçalho de Ações (Escondido no Print) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 print:hidden">
        <button 
          onClick={onBack} 
          className="text-blue-600 text-sm hover:underline flex items-center gap-1 font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors w-fit"
        >
          <ChevronLeft size={16} /> Voltar para Dashboard
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all shadow-sm"
          >
            <Printer size={18} /> Exportar PDF / Imprimir
          </button>
          
          
          {/* Botões de Ação Dinâmicos */}
          <div className="flex items-center gap-2">
            {role === 'user' && (request.status === 'Rascunho' || request.status === 'Devolvido') && request.userId === userId && (
              <button 
                onClick={() => onEdit?.(request)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 border border-orange-200 rounded-xl font-bold text-sm hover:bg-orange-100 transition-all"
              >
                <Edit size={18} /> Editar Solicitação
              </button>
            )}

            {canApprove && (
              <>
                <button 
                  onClick={() => onUpdateStatus(request.id, 'Rejeitado')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-100 transition-all"
                >
                  <XCircle size={18} /> Recusar
                </button>
                <button 
                  onClick={() => onUpdateStatus(request.id, 'Devolvido')}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-xl font-bold text-sm hover:bg-yellow-100 transition-all"
                >
                  <AlertCircle size={18} /> Devolver
                </button>
                <button 
                  onClick={() => onUpdateStatus(request.id, 'Aprovado')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all shadow-lg shadow-green-500/20"
                >
                  <CheckCircle2 size={18} /> {canApproveDirector ? 'Aprovar (Enviar Financeiro)' : 'Aprovar Reembolso'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Título e ID (Visível no Print) */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 print:mb-4 border-b border-gray-100 pb-6 print:pb-3 print:border-b-2 print:border-black gap-4 print:gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-3 print:gap-2 mb-2 print:mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight print:text-xl leading-tight">{request.title}</h1>
            <StatusBadge status={request.status} />
          </div>
          <p className="text-gray-400 font-mono text-xs sm:text-sm">ID: {request.displayId || request.id}</p>
        </div>
        <div className="text-left sm:text-right bg-blue-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl">
          <p className="text-[10px] font-black text-blue-400 sm:text-gray-400 uppercase tracking-widest mb-1">Total da Solicitação</p>
          <p className="text-3xl sm:text-4xl font-black text-blue-600 print:text-xl print:text-black leading-none">{formatCurrency(request.totalValue)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:gap-3 print:block">
        {/* Coluna Principal: Detalhes e Despesas */}
        <div className="lg:col-span-2 space-y-8 print:space-y-3">
          
          {/* Informações Gerais */}
          <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8 print:p-3 shadow-sm print:shadow-none print:border-none">
            <h3 className="text-lg font-bold text-gray-800 mb-6 print:mb-2 print:text-sm flex items-center gap-2">
              <FileText size={20} className="text-blue-500 print:hidden" />
              Informações Gerais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 print:gap-1">
              <DisplayField label="Colaborador" value={request.user} />
              <DisplayField label="Data da Solicitação" value={request.date} />
              {request.observation && (
                <div className="md:col-span-2">
                  <DisplayField label="Observação" value={request.observation} />
                </div>
              )}
            </div>
          </section>

          {/* Informações Financeiras */}
          <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8 print:p-3 shadow-sm print:shadow-none print:border-none print:break-inside-avoid">
            <h3 className="text-lg font-bold text-gray-800 mb-6 print:mb-2 print:text-sm flex items-center gap-2">
              <Info size={20} className="text-purple-500 print:hidden" />
              Informações Financeiras
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 gap-4 print:gap-1">
              <DisplayField label="Filial" value={request.subsidiary || 'N/A'} />
              <DisplayField label="Departamento" value={request.department || 'N/A'} />
              <DisplayField label="Classe de Custo" value={request.chargeClass || 'N/A'} />
              <DisplayField label="Mês Competência" value={request.competence || 'N/A'} />
              <DisplayField label="Nº NF / Fatura" value={request.nfNumber || 'N/A'} />
              <DisplayField label="Prev. Pagamento" value={request.paymentDate || 'N/A'} />
            </div>
          </section>

          {/* Tabela de Despesas (Resumo conforme protótipo) */}
          <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden print:overflow-visible shadow-sm print:shadow-none print:border-none">
            <div className="p-6 sm:p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FileText size={20} className="text-blue-500" />
                Resumo de Despesas
              </h3>
            </div>
            <div className="overflow-x-auto print:overflow-visible">
              <table className="w-full text-left">
                <thead className="bg-white text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <tr>
                    <th className="px-8 py-5">ID / Ref</th>
                    <th className="px-8 py-5">Estabelecimento</th>
                    <th className="px-8 py-5">Data Recibo</th>
                    <th className="px-8 py-5 text-right">Valor</th>
                    <th className="px-8 py-5 text-center print:hidden">Anexo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {request.receipts.map((receipt, index) => (
                    <tr key={receipt.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 text-[10px] font-mono text-gray-400 uppercase">REC-{index + 1}</td>
                      <td className="px-8 py-5 text-sm font-bold text-gray-700">{receipt.merchantName || '-'}</td>
                      <td className="px-8 py-5 text-xs text-gray-500">
                        {receipt.receiptDate ? new Date(receipt.receiptDate).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-gray-900 text-right">{formatCurrency(parseFloat(receipt.value as string))}</td>
                      <td className="px-8 py-5 text-center print:hidden">
                        <a 
                          href={`#anexo-${index + 1}`}
                          className="inline-flex items-center gap-1.5 text-[10px] font-black text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 transition-all uppercase tracking-tighter"
                        >
                          <MousePointerClick size={12} /> Ir para img
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50/40 border-t-2 border-gray-100">
                  <tr className="font-black">
                    <td colSpan={2} className="px-8 py-6 text-right text-[10px] text-gray-400 uppercase tracking-[0.2em]">Total Solicitado:</td>
                    <td className="px-8 py-6 text-right text-xl text-blue-600 font-black">{formatCurrency(request.totalValue)}</td>
                    <td className="print:hidden"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* Dossiê de Comprovativos (Novo Layout conforme protótipo) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 py-2 border-b border-gray-100 print:break-after-avoid">
               <ImageIcon size={20} className="text-blue-500" />
               <h3 className="text-lg font-black text-gray-800 tracking-tight uppercase tracking-wider text-xs">Comprovantes</h3>
            </div>
            
            <div className="space-y-8">
               {request.receipts.map((receipt, index) => (
                 <div 
                   key={receipt.id} 
                   id={`anexo-${index + 1}`}
                   className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow print:break-inside-avoid print:shadow-none print:border-gray-300"
                 >
                    {/* Header do Card de Anexo */}
                    <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
                       <div className="flex items-center gap-3">
                          <span className="px-2 py-1 bg-blue-600 text-white text-[9px] font-black rounded uppercase tracking-widest">Anexo {index + 1}</span>
                          <h4 className="font-bold text-gray-800 text-sm">{receipt.merchantName || 'Recibo'}</h4>
                       </div>
                       <div className="hidden sm:block">
                          <span className="text-[9px] font-mono text-gray-400 bg-white border border-gray-100 px-2 py-1 rounded">REF: {receipt.id}</span>
                       </div>
                    </div>

                    {/* Preview da Imagem (Centralizado em Frame) */}
                    <div className="p-4 sm:p-8 bg-gray-50 flex justify-center items-center min-h-[300px] sm:min-h-[500px]">
                       <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-200 w-full max-w-lg aspect-[4/5] flex items-center justify-center overflow-hidden group">
                          {receipt.receiptUrl ? (
                            <img 
                              src={receipt.receiptUrl} 
                              alt={receipt.description}
                              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-3 text-gray-300">
                               <ImageIcon size={48} strokeWidth={1} />
                               <span className="text-xs font-bold uppercase tracking-widest">Nenhuma imagem anexada</span>
                            </div>
                          )}
                       </div>
                    </div>

                     {/* Rodapé do Card */}
                    <div className="px-6 py-4 bg-white border-t border-gray-50">
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div>
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Estabelecimento</p>
                             <p className="text-xs font-bold text-gray-700">{receipt.merchantName || 'Não informado'}</p>
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Data do Recibo</p>
                             <p className="text-xs font-bold text-gray-700">{receipt.receiptDate ? new Date(receipt.receiptDate).toLocaleDateString('pt-BR') : 'Não informada'}</p>
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Valor Unitário</p>
                             <p className="text-xs font-black text-blue-600">{formatCurrency(parseFloat(receipt.value as string))}</p>
                          </div>
                       </div>
                       <p className="text-[10px] text-gray-400 flex items-center gap-1.5 font-medium leading-relaxed border-t border-gray-50 pt-4">
                          <Info size={12} className="text-blue-400" />
                          Documento de suporte para despesa vinculada à Identificação <span className="font-mono font-bold text-gray-700">{receipt.id}</span>
                       </p>
                    </div>
                 </div>
               ))}
            </div>
          </section>
        </div>

        {/* Coluna Lateral: Histórico */}
        <div className="space-y-8 print:hidden">
          <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2">
              <History size={20} className="text-blue-500" />
              Histórico
            </h3>
            <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              {request.history.map((event, index) => (
                <div key={event.id} className="relative pl-10">
                  <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                    index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <Clock size={10} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 leading-tight">{event.action}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{event.date} • {event.user}</p>
                    {event.note && (
                      <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                        <p className="text-xs text-yellow-800 leading-relaxed italic">"{event.note}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dica de Print */}
          <div className="p-6 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-500/20">
             <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Printer size={20} />
             </div>
             <p className="font-bold mb-2">Precisa de um PDF?</p>
             <p className="text-blue-100 text-sm leading-relaxed">
               Utilize o botão de exportar no topo para gerar um dossiê completo pronto para impressão ou envio por e-mail.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-componente local para ícone de camadas que esqueci de importar
function Layers({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.85a.49.49 0 0 0 0 .89l8.57 4.67a2 2 0 0 0 1.66 0l8.57-4.67a.49.49 0 0 0 0-.89Z"/>
      <path d="m6.3 12.3 3.89 2.12a2 2 0 0 0 1.62 0l3.89-2.12"/>
      <path d="m6.3 17.3 3.89 2.12a2 2 0 0 0 1.62 0l3.89-2.12"/>
    </svg>
  );
}
