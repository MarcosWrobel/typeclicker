import React from 'react';
import { AlertTriangle, Lock } from 'lucide-react';
import { useCapsLock } from '../../utils/keyboardCase';

interface CapsLockWarningProps {
  /** Se não informado, o componente escuta automaticamente o estado do teclado */
  isCapsLock?: boolean;
  className?: string;
  variant?: 'inline' | 'floating' | 'badge';
  showTip?: boolean;
}

export const CapsLockWarning: React.FC<CapsLockWarningProps> = ({
  isCapsLock: propIsCapsLock,
  className = '',
  variant = 'inline',
  showTip = true,
}) => {
  const detectedCapsLock = useCapsLock();
  const isActive = propIsCapsLock !== undefined ? propIsCapsLock : detectedCapsLock;

  if (!isActive) return null;

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold shadow-md shadow-amber-950/40 animate-pulse ${className}`}
        role="alert"
        aria-live="polite"
      >
        <Lock className="w-3.5 h-3.5 text-amber-400" />
        <span>CAPS LOCK LIGADO</span>
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <div
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-950/90 via-zinc-900/95 to-amber-950/90 border-2 border-amber-500 text-amber-200 font-mono text-xs sm:text-sm font-bold shadow-2xl shadow-amber-950/80 backdrop-blur-md animate-bounce select-none ${className}`}
        role="alert"
        aria-live="assertive"
      >
        <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
        <div className="flex items-center gap-1.5">
          <span className="text-amber-300 tracking-wide">⇪ CAPS LOCK ATIVADO:</span>
          <span className="text-amber-100/90 font-normal">Pressione a tecla Caps Lock para desligar</span>
        </div>
      </div>
    );
  }

  // Variant 'inline' (default)
  return (
    <div
      className={`w-full max-w-xl mx-auto my-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/60 text-amber-300 font-mono text-xs font-semibold shadow-md shadow-amber-950/30 transition-all select-none ${className}`}
      role="alert"
      aria-live="polite"
    >
      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-pulse" />
      <span className="font-bold tracking-wider">⇪ CAPS LOCK ATIVADO</span>
      {showTip && (
        <span className="text-amber-200/80 font-normal text-[11px] hidden sm:inline">
          — Pressione Caps Lock para desligar e evitar erros
        </span>
      )}
    </div>
  );
};
