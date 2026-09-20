import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, LogOut, Key, ArrowLeft } from 'lucide-react';
import { getSystemSettings, logoutUser } from '../services/firebaseService';

interface SessionLockOverlayProps {
  isLocked: boolean;
  onUnlock: (code: string) => Promise<boolean>;
  isLoading: boolean;
}

export const SessionLockOverlay: React.FC<SessionLockOverlayProps> = ({ isLocked, onUnlock, isLoading }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  // Fetch settings dynamically to see if there is an active class
  const [hasActiveClass, setHasActiveClass] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);

  useEffect(() => {
    if (isLocked) {
      setCode('');
      setError('');
      setShowManualInput(false);
      getSystemSettings().then(settings => {
        const active = settings?.activeCode && settings?.expiresAt && new Date(settings.expiresAt) > new Date();
        setHasActiveClass(!!active);
      });
    }
  }, [isLocked]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) return;
    
    setError('');
    const success = await onUnlock(code.toUpperCase());
    if (!success) {
      setError('Código inválido ou aula encerrada.');
      setCode('');
    }
  };

  const isFormVisible = hasActiveClass || showManualInput;

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-[#0e1013] backdrop-blur-xl"
        >
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md relative z-10 bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6 border border-zinc-700 shadow-inner text-zinc-400">
              <Lock className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-black text-white mb-2 text-center">Laboratório Trancado</h1>
            
            {isFormVisible ? (
              <>
                <p className="text-zinc-400 text-center text-sm mb-6">
                  {hasActiveClass 
                    ? "Uma aula está em andamento. Insira o código exibido no quadro pelo professor para sincronizar sua sessão."
                    : "Insira o código de 4 dígitos informado pelo professor para liberar seu computador."}
                </p>
                
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                  <div>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      maxLength={4}
                      placeholder="CÓDIGO (EX: A5F9)"
                      className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl px-4 py-4 text-center text-2xl font-black text-white tracking-[0.5em] placeholder:tracking-normal placeholder:font-medium placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors uppercase"
                      disabled={isLoading}
                      autoFocus
                    />
                    {error && <div className="text-red-400 text-xs font-bold mt-2 text-center">{error}</div>}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={code.length < 4 || isLoading}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {isLoading ? 'VERIFICANDO...' : 'DESBLOQUEAR SESSÃO'}
                  </button>

                  {!hasActiveClass && (
                    <button
                      type="button"
                      onClick={() => setShowManualInput(false)}
                      className="mt-1 flex items-center justify-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Voltar para o aviso de espera</span>
                    </button>
                  )}
                </form>
              </>
            ) : (
              <div className="text-center w-full">
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl mb-6 flex flex-col items-center gap-2.5">
                  <p className="text-amber-400/90 text-sm font-semibold">
                    Nenhuma aula ou sessão está ativa no momento. O acesso fora do ambiente escolar é restrito.
                  </p>
                  <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-sm tracking-wide font-mono">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>Aguarde o professor liberar</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setShowManualInput(true);
                    getSystemSettings().then(settings => {
                      const active = settings?.activeCode && settings?.expiresAt && new Date(settings.expiresAt) > new Date();
                      if (active) setHasActiveClass(true);
                    });
                  }}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 mb-3 cursor-pointer active:scale-98"
                >
                  <Key className="w-4 h-4" />
                  <span>Clique para Inserir o Código</span>
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-2 text-xs text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
                >
                  Atualizar página
                </button>
              </div>
            )}

            <button
              onClick={() => logoutUser().then(() => window.location.reload())}
              className="mt-6 flex items-center justify-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm font-semibold transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair da Conta</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
