import { ReimbursementRequest } from '@/types';

// ==========================================
// DADOS MOCK — Fase 1 (sem API)
// Fase 2: substituir por chamadas ao requestService
// ==========================================

export const MOCK_REQUESTS: ReimbursementRequest[] = [
  {
    id: 'SOL-1029',
    user: 'João Silva',
    title: 'Viagem a Lisboa - Conferência',
    type: 'Viagem e Alojamento',
    project: 'Conferência WebSummit',
    paymentMethod: 'Cartão Corporativo',
    location: 'Lisboa, Portugal',
    date: '2026-03-10',
    status: 'Pendente',
    totalValue: 150.50,
    isMultiple: true,
    receipts: [
      {
        id: 'REC-551',
        reqId: 'SOL-1029',
        description: 'Táxi Aeroporto',
        value: 25.00,
        receiptUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600&h=800',
      },
      {
        id: 'REC-552',
        reqId: 'SOL-1029',
        description: 'Jantar Cliente',
        value: 125.50,
        receiptUrl: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?auto=format&fit=crop&q=80&w=600&h=800',
      },
    ],
    history: [
      { id: 1, action: 'Solicitação Criada', date: '10/03/2026 09:30', user: 'João Silva' },
    ],
  },
  {
    id: 'SOL-1030',
    user: 'Maria Santos',
    title: 'Material de Escritório',
    type: 'Material e Equipamento',
    project: 'Operações Internas',
    paymentMethod: 'Reembolso em Conta',
    location: 'Sede - Porto',
    date: '2026-03-12',
    status: 'Aprovado',
    totalValue: 45.00,
    isMultiple: false,
    receipts: [
      {
        id: 'REC-553',
        reqId: 'SOL-1030',
        description: 'Tinteiros e Papel',
        value: 45.00,
        receiptUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=600&h=800',
      },
    ],
    history: [
      { id: 1, action: 'Solicitação Criada', date: '12/03/2026 14:15', user: 'Maria Santos' },
      { id: 2, action: 'Aprovado pelo Financeiro', date: '13/03/2026 10:00', user: 'Admin Financeiro' },
    ],
  },
  {
    id: 'SOL-1031',
    user: 'João Silva',
    title: 'Combustível - Visita a Clientes',
    type: 'Transporte',
    project: 'Vendas Q1',
    paymentMethod: 'Reembolso em Conta',
    location: 'Braga, Portugal',
    date: '2026-03-13',
    status: 'Devolvido',
    totalValue: 35.00,
    isMultiple: false,
    receipts: [
      {
        id: 'REC-554',
        reqId: 'SOL-1031',
        description: 'Gasolina 95',
        value: 35.00,
        receiptUrl: 'https://images.unsplash.com/photo-1611282238037-1d3fd3e6ab9c?auto=format&fit=crop&q=80&w=600&h=800',
      },
    ],
    history: [
      { id: 1, action: 'Solicitação Criada', date: '13/03/2026 11:00', user: 'João Silva' },
      {
        id: 2,
        action: 'Devolvido para Correção',
        date: '13/03/2026 15:30',
        user: 'Admin Financeiro',
        note: 'O comprovativo está ilegível. Por favor, submeta uma imagem mais clara do recibo.',
      },
    ],
  },
  {
    id: 'SOL-1032',
    user: 'João Silva',
    title: 'Almoço com Parceiros',
    type: 'Alimentação e Representação',
    project: 'Parcerias Estratégicas',
    paymentMethod: 'Cartão Corporativo',
    location: 'Porto, Portugal',
    date: '2026-03-14',
    status: 'Rascunho',
    totalValue: 78.00,
    isMultiple: true,
    receipts: [
      {
        id: 'REC-555',
        reqId: 'SOL-1032',
        description: 'Almoço restaurante',
        value: 55.00,
      },
      {
        id: 'REC-556',
        reqId: 'SOL-1032',
        description: 'Estacionamento',
        value: 23.00,
      },
    ],
    history: [
      { id: 1, action: 'Rascunho inicial criado com recibo(s)', date: '14/03/2026 09:00', user: 'João Silva' },
    ],
  },
];
