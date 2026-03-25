// ==========================================
// INTERFACES DE DOMÍNIO — ReembolsarApp
// ==========================================

export type RequestStatus = 'Rascunho' | 'Pendente' | 'Aguardando Diretor' | 'Aguardando Financeiro' | 'Rejeitado' | 'Devolvido' | 'Aprovado';
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  level?: string;
  loginId?: string;
  approverId?: string;
}

export type UserLevel = 'Colaborador' | 'Diretor';

export interface UserAccount {
  id: string;
  name: string;
  email?: string;
  level: UserLevel;
  approverId?: string;
  approverName?: string;
  loginId: string;
  active: boolean;
}

export interface Receipt {
  id: string;
  solicitacaoId: string; // Alinhado com o backend
  description: string;
  value: number | string;
  receiptUrl?: string;
  merchantName?: string;
  receiptDate?: string;
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
  displayId?: string;
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
  
  // Novos campos financeiros (Fase 2)
  paymentDate?: string;
  subsidiary?: string;
  department?: string;
  chargeClass?: string;
  competence?: string;
  nfNumber?: string;
  userId?: string;
  userLevel?: string;
  approverId?: string;
}
