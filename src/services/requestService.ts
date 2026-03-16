import { ReimbursementRequest, RequestStatus } from '@/types';
import { MOCK_REQUESTS } from '@/mocks/requests';

const STORAGE_KEY = 'reembolsar_requests_v1';

/**
 * Serviço para gestão de solicitações de reembolso.
 * Nesta fase 1, opera sobre o localStorage para simular persistência.
 * Na fase 2, será substituído por chamadas via Axios/Fetch para a API Node.js.
 */
class RequestService {
  private isInitialized = false;

  private init() {
    if (typeof window === 'undefined') return;
    if (this.isInitialized) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_REQUESTS));
    }
    this.isInitialized = true;
  }

  private getStoredRequests(): ReimbursementRequest[] {
    this.init();
    if (typeof window === 'undefined') return MOCK_REQUESTS;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : MOCK_REQUESTS;
  }

  private saveRequests(requests: ReimbursementRequest[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }

  /**
   * Retorna todas as solicitações.
   */
  async getRequests(): Promise<ReimbursementRequest[]> {
    return this.getStoredRequests();
  }

  /**
   * Busca uma solicitação pelo ID.
   */
  async getRequestById(id: string): Promise<ReimbursementRequest | undefined> {
    const requests = this.getStoredRequests();
    return requests.find(r => r.id === id);
  }

  /**
   * Cria uma nova solicitação.
   */
  async createRequest(requestData: Partial<ReimbursementRequest>): Promise<ReimbursementRequest> {
    const requests = this.getStoredRequests();
    
    const newRequest: ReimbursementRequest = {
      ...requestData,
      id: `SOL-${Math.floor(1000 + Math.random() * 9000)}`,
      status: requestData.status || 'Pendente',
      date: requestData.date || new Date().toISOString().split('T')[0],
      receipts: requestData.receipts || [],
      history: requestData.history || [],
      totalValue: requestData.totalValue || 0,
      user: requestData.user || 'Usuário Desconhecido',
      title: requestData.title || 'Nova Solicitação',
      type: requestData.type || 'Outros',
      project: requestData.project || 'Geral',
      paymentMethod: requestData.paymentMethod || 'Outros',
      location: requestData.location || 'N/A',
      isMultiple: !!requestData.isMultiple,
    } as ReimbursementRequest;

    const updated = [newRequest, ...requests];
    this.saveRequests(updated);
    return newRequest;
  }

  /**
   * Atualiza o status de uma solicitação e adiciona evento ao histórico.
   */
  async updateStatus(
    id: string, 
    newStatus: RequestStatus, 
    user: string, 
    note?: string
  ): Promise<ReimbursementRequest | undefined> {
    const requests = this.getStoredRequests();
    const index = requests.findIndex(r => r.id === id);

    if (index === -1) return undefined;

    const request = requests[index];
    const updatedRequest: ReimbursementRequest = {
      ...request,
      status: newStatus,
      history: [
        {
          id: Date.now(),
          action: this.getActionMessage(newStatus),
          date: new Date().toLocaleString('pt-BR'),
          user,
          note
        },
        ...request.history
      ]
    };

    requests[index] = updatedRequest;
    this.saveRequests(requests);
    return updatedRequest;
  }

  /**
   * Atualiza uma solicitação existente.
   */
  async updateRequest(id: string, updatedData: Partial<ReimbursementRequest>): Promise<ReimbursementRequest | undefined> {
    const requests = this.getStoredRequests();
    const index = requests.findIndex(r => r.id === id);

    if (index === -1) return undefined;

    const request = requests[index];
    
    // Se o status mudou de Devolvido/Rascunho para Pendente, adicionamos ao histórico
    const statusChanged = updatedData.status && updatedData.status !== request.status;
    
    const updatedRequest: ReimbursementRequest = {
      ...request,
      ...updatedData,
      history: statusChanged ? [
        {
          id: Date.now(),
          action: this.getActionMessage(updatedData.status as RequestStatus),
          date: new Date().toLocaleString('pt-BR'),
          user: request.user,
          note: 'Solicitação editada e reenviada.'
        },
        ...request.history
      ] : request.history
    };

    requests[index] = updatedRequest;
    this.saveRequests(requests);
    return updatedRequest;
  }

  /**
   * Remove uma solicitação (ex: remover rascunho).
   */
  async deleteRequest(id: string): Promise<boolean> {
    const requests = this.getStoredRequests();
    const filtered = requests.filter(r => r.id !== id);
    
    if (filtered.length === requests.length) return false;
    
    this.saveRequests(filtered);
    return true;
  }

  private getActionMessage(status: RequestStatus): string {
    switch (status) {
      case 'Aprovado': return 'Solicitação Aprovada';
      case 'Rejeitado': return 'Solicitação Rejeitada';
      case 'Devolvido': return 'Devolvido para Correção';
      case 'Pendente': return 'Enviado para Aprovação';
      default: return 'Status Atualizado';
    }
  }
}

export const requestService = new RequestService();
