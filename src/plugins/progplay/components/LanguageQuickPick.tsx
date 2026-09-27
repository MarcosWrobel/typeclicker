import React, { useState, useEffect, useRef } from 'react';
import { Search, Check, FileCode } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, LanguageInfo } from '../constants/languages';

interface LanguageQuickPickProps {
  isOpen: boolean;
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onClose: () => void;
}

export const LanguageQuickPick: React.FC<LanguageQuickPickProps> = ({
  isOpen,
  currentLanguage,
  onSelectLanguage,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.extension.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredLanguages.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredLanguages.length) % filteredLanguages.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredLanguages[selectedIndex]) {
        onSelectLanguage(filteredLanguages[selectedIndex].id);
        onClose();
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="vscode-quickpick"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#252526] border border-[#454545] rounded-md shadow-2xl overflow-hidden text-neutral-200 text-xs font-sans animate-in fade-in zoom-in-95 duration-100"
      >
        {/* Search bar */}
        <div className="p-2 border-b border-[#3c3c3c] flex items-center gap-2 bg-[#1e1e1e]">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Selecione o modo de linguagem (ex: JavaScript, Python, HTML...)"
            className="w-full bg-transparent text-sm text-white placeholder-neutral-500 outline-none border-none"
          />
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-1">
          {filteredLanguages.length === 0 ? (
            <div className="p-4 text-center text-neutral-500">
              Nenhuma linguagem encontrada com &quot;{searchTerm}&quot;
            </div>
          ) : (
            filteredLanguages.map((lang, index) => {
              const isSelected = index === selectedIndex;
              const isCurrent = lang.id === currentLanguage;

              return (
                <div
                  key={lang.id}
                  onClick={() => {
                    onSelectLanguage(lang.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#04395e] text-white' : 'hover:bg-[#2a2d2e] text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="font-mono text-[10px] font-bold px-1 py-0.5 rounded"
                      style={{ color: lang.iconColor, backgroundColor: `${lang.iconColor}20` }}
                    >
                      {lang.badge}
                    </span>
                    <span className="font-medium text-[13px]">{lang.name}</span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      ({lang.extension})
                    </span>
                  </div>

                  {isCurrent && (
                    <div className="flex items-center gap-1 text-blue-400 text-[11px]">
                      <Check className="w-3.5 h-3.5" />
                      <span>Atual</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Hint footer */}
        <div className="px-3 py-1.5 bg-[#1f1f1f] border-t border-[#333333] text-[10px] text-neutral-500 flex justify-between">
          <span>Navegue com ↑ ↓ e pressione Enter</span>
          <span>Esc para fechar</span>
        </div>
      </div>
    </div>
  );
};
