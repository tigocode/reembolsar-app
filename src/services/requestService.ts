import { ReimbursementRequest, RequestStatus, Receipt } from '@/types';

class RequestService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  async getRequests(role?: string, userId?: string, level?: string): Promise<ReimbursementRequest[]> {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (userId) params.append('userId', userId);
    if (level) params.append('level', level);
    
    try {
      const response = await fetch(`${this.baseUrl}/requests?${params.toString()}`);
      if (!response.ok) throw new Error('Erro ao listar solicitações');
      return await response.json();
    } catch (error) {
      console.error('API Error (list):', error);
      return [];
    }
  }

  async getRequestById(id: string): Promise<ReimbursementRequest | undefined> {
    try {
      const response = await fetch(`${this.baseUrl}/requests/${id}`);
      if (!response.ok) return undefined;
      return await response.json();
    } catch (error) {
      console.error('API Error (details):', error);
      return undefined;
    }
  }

  async createRequest(requestData: Partial<ReimbursementRequest>): Promise<ReimbursementRequest> {
    try {
      const response = await fetch(`${this.baseUrl}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error('Erro ao criar solicitação');
      const savedRequest = await response.json();

      if (requestData.receipts && requestData.receipts.length > 0) {
        for (const r of requestData.receipts) {
          await this.createReceipt({
            ...r,
            solicitacaoId: savedRequest.id,
            value: Number(r.value) || 0
          });
        }
      }

      return savedRequest;
    } catch (error) {
      console.error('API Error (create):', error);
      throw error;
    }
  }

  async createReceipt(receiptData: Partial<Receipt>): Promise<Receipt> {
    try {
      const response = await fetch(`${this.baseUrl}/receipts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(receiptData),
      });

      if (!response.ok) throw new Error('Erro ao salvar recibo');
      return await response.json();
    } catch (error) {
      console.error('API Error (createReceipt):', error);
      throw error;
    }
  }

  async updateStatus(
    id: string, 
    newStatus: RequestStatus, 
    userName: string, 
    note?: string,
    userLevel?: string
  ): Promise<ReimbursementRequest | undefined> {
    try {
      const response = await fetch(`${this.baseUrl}/requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, userName, note, userLevel }),
      });

      if (!response.ok) throw new Error('Erro ao atualizar status');
      return await response.json();
    } catch (error) {
      console.error('API Error (status):', error);
      return undefined;
    }
  }

  async updateRequest(id: string, updatedData: Partial<ReimbursementRequest>): Promise<ReimbursementRequest | undefined> {
    try {
      const response = await fetch(`${this.baseUrl}/requests/${id}/draft`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Erro ao atualizar rascunho');
      return await response.json();
    } catch (error) {
      console.error('API Error (update):', error);
      return undefined;
    }
  }

  async deleteRequest(id: string): Promise<boolean> {
     console.warn('DELETE não implementado no backend');
     return true;
  }

  async processReceipt(file: File): Promise<Partial<Receipt>> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${apiUrl}/receipts/process`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Erro ao processar recibo');
      return await response.json();
    } catch (error) {
      console.error('OCR Error:', error);
      throw error;
    }
  }

  async getSubsidiaries(): Promise<{ id: string, name: string }[]> {
    const res = await fetch(`${this.baseUrl}/master/subsidiaries`);
    return res.json();
  }

  async getDepartments(): Promise<{ id: string, name: string }[]> {
    const res = await fetch(`${this.baseUrl}/master/departments`);
    return res.json();
  }

  async getChargeClasses(): Promise<{ id: string, name: string }[]> {
    const res = await fetch(`${this.baseUrl}/master/classes`);
    return res.json();
  }

  async createSubsidiary(name: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/master/subsidiaries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    return res.json();
  }

  async createDepartment(name: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/master/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    return res.json();
  }

  async createChargeClass(name: string, subsidiaryId?: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/master/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, subsidiaryId })
    });
    return res.json();
  }

  async deleteSubsidiary(id: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/master/subsidiaries/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }

  async deleteDepartment(id: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/master/departments/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }

  async deleteChargeClass(id: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/master/classes/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }
}

export const requestService = new RequestService();
