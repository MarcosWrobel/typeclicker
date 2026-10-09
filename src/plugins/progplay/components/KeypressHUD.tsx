import React,{ useState, useEffect } from 'react';

interface KeyRecord {
  id: number;
  label: string;
  code: string;
  isSpecial: boolean;
}

export const KeypressHUD: React.FC = () => {
  const [keys, setKeys] = useState<KeyRecord[]>([]);

  useEffect(() => {
    let nextId = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore alone meta keys if desired, but nice to show
      let label = e.key;
      let isSpecial = false;

      if (e.key === ' ') {
        label = 'Espaço';
        isSpecial = true;
      } else if (e.key === 'Enter') {
        label = '↵ Enter';
        isSpecial = true;
      } else if (e.key === 'Backspace') {
        label = '⌫ Backspace';
        isSpecial = true;
      } else if (e.key === 'Tab') {
        label = '⇥ Tab';
        isSpecial = true;
      } else if (e.key === 'Escape') {
        label = 'Esc';
        isSpecial = true;
      } else if (e.key === 'Control') {
        label = 'Ctrl';
        isSpecial = true;
      } else if (e.key === 'Shift') {
        label = '⇧ Shift';
        isSpecial = true;
      } else if (e.key === 'Alt') {
        label = 'Alt';
        isSpecial = true;
      } else if (e.key.length === 1) {
        label = e.key.toUpperCase();
      }

      const id = ++nextId;
      const newKey: KeyRecord = {
        id,
        label,
        code: e.code,
        isSpecial,
      };

      setKeys((prev) => [...prev.slice(-4), newKey]);

      // Remove this key after 1.2s
      setTimeout(() => {
        setKeys((prev) => prev.filter((k) => k.id !== id));
      }, 1100);
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  if (keys.length === 0) return null;

  return (
    <div 
      id="vscode-keystroke-hud"
      className="fixed bottom-10 right-6 z-50 pointer-events-none flex items-center gap-2 select-none"
    >
      {keys.map((k, index) => {
        const isLatest = index === keys.length - 1;
        return (
          <div
            key={k.id}
            className={`transition-all duration-500 ease-out transform ${
              isLatest 
                ? 'scale-110 opacity-100 translate-y-0' 
                : 'scale-95 opacity-60 -translate-y-1'
            }`}
          >
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900/90 text-neutral-100 border border-neutral-700/80 shadow-2xl backdrop-blur-md font-mono text-xs font-bold ring-1 ring-white/10 animate-in fade-in zoom-in-75 duration-150">
              <span className={k.isSpecial ? 'text-blue-400' : 'text-emerald-400'}>
                {k.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
