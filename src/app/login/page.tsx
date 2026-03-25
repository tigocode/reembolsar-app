'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  KeyRound, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

export default function LoginPage() {
  const [loginId, setLoginId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId) return;

    setLoading(true);
    setError(null);

    try {
      await login(loginId.toUpperCase());
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login. Verifique seu ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-500/30">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-6 shadow-xl shadow-blue-500/20 rotate-3">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Reembolso<span className="text-blue-500">App</span>
          </h1>
          <p className="text-slate-400 font-medium">Acesse sua área de solicitações</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest ml-1">
                Seu Login ID
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <KeyRound size={20} />
                </div>
                <input 
                  type="text" 
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="EX: USR-1234 ou ADM-001"
                  required
                  autoFocus
                  className="w-full bg-slate-950/50 border border-slate-700/50 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono tracking-wider font-bold"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium animate-shake">
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading || !loginId}
              className="w-full group bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Entrar no Sistema
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-xs font-medium">
              Esqueceu seu acesso? Contate o departamento Financeiro.
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-600 text-xs font-bold tracking-widest uppercase">
          Fluxo de Aprovação Hierárquico Ativo
        </p>
      </div>
    </div>
  );
}
