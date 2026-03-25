'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ReimbursementRequest } from '@/types';
import { requestService } from '@/services/requestService';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { useEffect } from 'react';

import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import KpiCards from '@/components/dashboard/KpiCards';
import RequestList from '@/components/dashboard/RequestList';
import { ShieldCheck } from 'lucide-react';
import NewRequestView from '@/components/dashboard/NewRequestView';
import RequestDetailView from '@/components/dashboard/RequestDetailView';
import ActionModal from '@/components/dashboard/ActionModal';
import ConfirmModal from '@/components/dashboard/ConfirmModal';
import Toast from '@/components/ui/Toast';

import MasterDataManagementView from '@/components/dashboard/MasterDataManagementView';
import UserManagementView from '@/components/dashboard/UserManagementView';

// Tipos de view disponíveis
type ViewType = 'dashboard' | 'new_request' | 'details' | 'master_data' | 'users' | 'manager_approvals';

export default function Home() {
  const { isLoading, role, user } = useAuth();

  // Estado global de navegação e dados
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [requests, setRequests] = useState<ReimbursementRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ReimbursementRequest | null>(null);
  const [editingRequest, setEditingRequest] = useState<ReimbursementRequest | null>(null);

  const { push } = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      push('/login');
    }
  }, [isLoading, user, push]);



  // Carregamento inicial de dados
  useEffect(() => {
    if (isLoading || !user) return;

    const fetchRequests = async () => {
      const data = await requestService.getRequests(role, user.id, user.level);
      setRequests(data);
    };
    fetchRequests();
  }, [isLoading, user, role, currentView]); // Refetch when view changes to ensure we catch updates
  
  // Estado de feedback (Toast)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Estados de Modais
  const [modalType, setModalType] = useState<'aprovar' | 'devolver' | 'rejeitar' | null>(null);
  const [requestToUpdate, setRequestToUpdate] = useState<string | null>(null);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  const goToDashboard = () => {
    setSelectedRequest(null);
    setCurrentView('dashboard');
  };

  const handleOpenDetails = async (req: ReimbursementRequest) => {
    // Busca detalhes completos (com recibos e histórico) do backend
    const fullRequest = await requestService.getRequestById(req.id);
    if (fullRequest) {
      setSelectedRequest(fullRequest);
      setEditingRequest(null);
      setCurrentView('details');
    } else {
      setToast({ message: 'Erro ao carregar detalhes da solicitação', type: 'error' });
    }
  };

  const handleEditRequest = (req: ReimbursementRequest) => {
    setEditingRequest(req);
    setCurrentView('new_request');
  };

  const handleOpenNewRequest = () => {
    setEditingRequest(null);
    setCurrentView('new_request');
  };

  const handleOpenStatusModal = (id: string, newStatus: ReimbursementRequest['status']) => {
    setRequestToUpdate(id);
    if (newStatus === 'Aprovado') setModalType('aprovar');
    else if (newStatus === 'Devolvido') setModalType('devolver');
    else if (newStatus === 'Rejeitado') setModalType('rejeitar');
  };

  const closeModals = () => {
    setModalType(null);
    setRequestToUpdate(null);
  };

  const processStatusUpdate = async (id: string, newStatus: ReimbursementRequest['status'], note?: string) => {
    const userName = user?.name || 'Sistema';
    const updated = await requestService.updateStatus(id, newStatus, userName, note, user?.level);

    if (updated) {
      // Atualiza a lista local
      const newRequests = await requestService.getRequests(role, user?.id);
      setRequests(newRequests);
      
      if (selectedRequest?.id === id) {
        setSelectedRequest(updated);
      }
      
      closeModals();
      setToast({ 
        message: `Solicitação ${
          newStatus === 'Aprovado' ? 'aprovada' : 
          newStatus === 'Rejeitado' ? 'rejeitada' : 'devolvida'
        } com sucesso!`, 
        type: 'success' 
      });
    }
  };

  const handleCreateOrUpdate = async (data: Partial<ReimbursementRequest>) => {
    if (editingRequest) {
      // Modo Edição
      const updated = await requestService.updateRequest(editingRequest.id, {
        ...data,
        userId: user?.id,
        userLevel: user?.level,
        approverId: user?.approverId,
        status: data.status // Preserva o novo status (Pendente ou Rascunho)
      });
      
      if (updated) {
        setToast({ message: 'Solicitação atualizada com sucesso!', type: 'success' });
      }
    } else {
      // Modo Criação
      const newRequest = await requestService.createRequest({
        ...data,
        userId: user?.id,
        user: user?.name || 'Usuário',
        userLevel: user?.level,
        approverId: user?.approverId
      });
      
      setToast({ 
        message: newRequest.status === 'Rascunho' 
          ? 'Rascunho salvo com sucesso!' 
          : 'Solicitação enviada para aprovação!',
        type: 'success' 
      });
    }

    const updatedRequests = await requestService.getRequests(role, user?.id);
    setRequests(updatedRequests);
    setEditingRequest(null);
    goToDashboard();
  };



  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-3 text-sm text-gray-500 font-medium">A carregar sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen print:h-auto print:overflow-visible bg-gray-50 text-gray-800 relative overflow-hidden">
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <div className="flex flex-col flex-1 overflow-hidden print:overflow-visible print:m-0">
        
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto print:overflow-visible p-4 sm:p-6 lg:p-8 print:p-0 print:m-0">
          {currentView === 'dashboard' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {role === 'user' ? 'Minhas Solicitações' : 'Gestão de Reembolsos'}
              </h2>

              {/* KPIs visíveis apenas para Financeiro (conforme Solar Manager) */}
              {role === 'admin' && <KpiCards requests={requests} />}

              {/* Tabela de Solicitações */}
              <RequestList 
                requests={requests} 
                role={role} 
                onOpenDetails={handleOpenDetails} 
              />
            </div>
          )}

          {currentView === 'manager_approvals' && (
             <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <ShieldCheck className="text-emerald-600" />
                Aprovações Pendentes (Gestor)
              </h2>
              <p className="text-gray-500 mb-8 -mt-4 font-medium">Solicitações aguardando sua validação como Diretor</p>
              
              <RequestList 
                requests={requests.filter(r => r.status === 'Aguardando Diretor' || (r.status as string) === 'Pendente')} 
                role="admin" // Treat as admin to show approval buttons? No, RequestList uses role to show/hide.
                onOpenDetails={handleOpenDetails} 
              />
            </div>
          )}

          {currentView === 'new_request' && (
            <NewRequestView 
              onBack={goToDashboard} 
              onSubmit={handleCreateOrUpdate}
              editingRequest={editingRequest}
            />
          )}

          {currentView === 'details' && selectedRequest && (
            <RequestDetailView 
              request={selectedRequest}
              role={role}
              userLevel={user?.level}
              userId={user?.id}
              onBack={goToDashboard}
              onUpdateStatus={handleOpenStatusModal}
              onEdit={handleEditRequest}
            />
          )}

          {currentView === 'master_data' && (
            <MasterDataManagementView />
          )}

          {currentView === 'users' && (
            <UserManagementView />
          )}
        </main>
      </div>

      {/* MODAIS GLOBAIS */}
      {requestToUpdate && (
        <>
          <ConfirmModal 
            isOpen={modalType === 'aprovar'}
            onClose={closeModals}
            onConfirm={() => processStatusUpdate(requestToUpdate, 'Aprovado')}
            title="Confirmar Aprovação"
            description="Tem certeza que deseja aprovar este reembolso? Esta ação autoriza o pagamento imediato conforme o fluxo financeiro."
          />

          <ActionModal 
            isOpen={modalType === 'devolver'}
            onClose={closeModals}
            onConfirm={(note) => processStatusUpdate(requestToUpdate, 'Devolvido', note)}
            title="Devolver Solicitação"
            type="devolver"
            description="A solicitação voltará para o colaborador para correções. Explique abaixo o que precisa ser ajustado."
            placeholder="Ex: O comprovante do táxi está ilegível..."
          />

          <ActionModal 
            isOpen={modalType === 'rejeitar'}
            onClose={closeModals}
            onConfirm={(note) => processStatusUpdate(requestToUpdate, 'Rejeitado', note)}
            title="Rejeitar Reembolso"
            type="rejeitar"
            description="Esta ação é definitiva. A despesa não será reembolsada. Justifique o motivo detalhadamente."
            placeholder="Ex: Despesa não condizente com as políticas da empresa..."
          />
        </>
      )}
    </div>
  );
}






