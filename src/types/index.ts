// ==========================================
// INTERFACES DE DOMÍNIO — ReembolsarApp
// ==========================================

export type RequestStatus = 'Rascunho' | 'Pendente' | 'Devolvido' | 'Rejeitado' | 'Aprovado';
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Receipt {
  id: string;
  reqId: string;
  description: string;
  value: number | string;
  receiptUrl?: string;
}

export interface HistoryEvent {
  id: number;
  action: string;
  date: string;
  user: string;
  note?: string;
}

export interface ReimbursementRequest {
  id: string;
  user: string;
  title: string;
  type: string;
  project: string;
  paymentMethod: string;
  location: string;
  date: string;
  status: RequestStatus;
  totalValue: number;
  isMultiple: boolean;
  receipts: Receipt[];
  history: HistoryEvent[];
}
