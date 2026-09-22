import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  X,
  Type,
  Maximize,
  Sun,
  MousePointer,
  RotateCcw,
  Sparkles,
  Check,
  Activity
} from 'lucide-react';
import {
  AccessibilitySettings,
  TextScale,
  UiScale,
  ContrastTheme
} from '../types';
import { DEFAULT_ACCESSIBILITY } from '../utils/storage';
import { sound } from '../utils/audio';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: AccessibilitySettings) => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleUpdate = (partial: Partial<AccessibilitySettings>) => {
    sound.playType();
    onUpdateSettings({
      ...settings,
      ...partial
    });
  };

  const handleReset = () => {
    sound.playWordComplete();
    onUpdateSettings({ ...DEFAULT_ACCESSIBILITY });
  };

  const textScaleOptions: { id: TextScale; label: string; desc: string; previewClass: string }[] = [
    { id: 'normal', label: 'Padrão', desc: '100% - Escala original', previewClass: 'text-2xl sm:text-3xl' },
    { id: 'large', label: 'Grande', desc: '130% - Baixa visão leve', previewClass: 'text-3xl sm:text-4xl' },
    { id: 'huge', label: 'Gigante', desc: '160% - Alta visibilidade', previewClass: 'text-4xl sm:text-5xl' },
    { id: 'mega', label: 'Mega', desc: '200% - Baixa visão severa', previewClass: 'text-5xl sm:text-6xl' }
  ];

  const uiScaleOptions: { id: UiScale; label: string; desc: string }[] = [
    { id: 'normal', label: 'Padrão (100%)', desc: 'Layout padrão da plataforma' },
    { id: 'large', label: 'Ampliada (115%)', desc: 'Elementos e botões maiores' },
    { id: 'extra', label: 'Máxima (125%)', desc: 'Escala total para telas menores' }
  ];

  const contrastThemes: { id: ContrastTheme; label: string; previewBg: string; previewText: string }[] = [
    { id: 'standard', label: 'Padrão Escuro', previewBg: 'bg-zinc-900', previewText: 'text-emerald-400' },
    { id: 'high_contrast_yellow', label: 'Amarelo Ouro / Preto', previewBg: 'bg-black', previewText: 'text-amber-300' },
    { id: 'high_contrast_cyan', label: 'Ciano Neon / Preto', previewBg: 'bg-black', previewText: 'text-cyan-300' },
    { id: 'high_contrast_white', label: 'Branco Puro / Preto', previewBg: 'bg-black', previewText: 'text-white' }
  ];

  // Determina o estilo da prévia ao vivo
  const getPreviewClasses = () => {
    const scale = textScaleOptions.find((o) => o.id === settings.textScale)?.previewClass || 'text-2xl';
    if (settings.highContrast) {
      if (settings.contrastTheme === 'high_contrast_yellow') {
        return `${scale} font-black text-amber-300 bg-black border-4 border-amber-400`;
      }
      if (settings.contrastTheme === 'high_contrast_cyan') {
        return `${scale} font-black text-cyan-300 bg-black border-4 border-cyan-400`;
      }
      return `${scale} font-black text-white bg-black border-4 border-white`;
    }
    return `${scale} font-bold text-emerald-400 bg-zinc-950 border border-emerald-500/40`;
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] ${
            settings.highContrast
              ? 'bg-black border-4 border-amber-400 text-white'
              : 'bg-zinc-950 border border-emerald-500/40 text-zinc-100 shadow-[0_0_50px_rgba(16,185,129,0.15)]'
          }`}
        >
          {/* Header */}
          <div
            className={`px-6 py-4.5 border-b flex items-center justify-between gap-4 ${
              settings.highContrast
                ? 'bg-zinc-950 border-amber-400/80'
                : 'bg-emerald-950/25 border-emerald-500/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0 ${
                  settings.highContrast
                    ? 'bg-amber-400 text-black font-black'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                    Acessibilidade & Baixa Visão
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    A+ / A-
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Ajustes ergonômicos e visuais para alunos com baixa visão ou dificuldades de foco.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900/80 hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer flex-shrink-0"
              title="Fechar (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo com Scroll */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 custom-scrollbar">
            {/* 1. Prévia Interativa em Tempo Real */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  Prévia em Tempo Real das Teclas:
                </span>
                <span>{settings.textScale.toUpperCase()} • {settings.highContrast ? 'ALTO CONTRASTE ATIVO' : 'MODO REGULAR'}</span>
              </div>

              <div className={`w-full rounded-2xl p-5 flex flex-col items-center justify-center transition-all min-h-[110px] ${getPreviewClasses()}`}>
                <div className="flex items-center gap-1.5 font-mono select-none tracking-wider">
                  <span className="text-emerald-400 opacity-90">B</span>
                  <span className="text-emerald-400 opacity-90">r</span>
                  <span className="text-emerald-400 opacity-90">a</span>
                  <span className="relative px-1 py-0.5 rounded bg-zinc-900/80 ring-2 ring-current">
                    <span>s</span>
                    <span
                      className={`absolute -bottom-1.5 left-0 right-0 rounded-full animate-pulse ${
                        settings.thickCursor ? 'h-2 bg-amber-400 ring-2 ring-white' : 'h-1 bg-emerald-400'
                      }`}
                    />
                  </span>
                  <span className="opacity-40">i</span>
                  <span className="opacity-40">l</span>
                </div>
                <span className="text-[11px] font-mono opacity-70 mt-2 font-medium">
                  * As palavras no terminal principal seguirão este padrão visual imediato.
                </span>
              </div>
            </div>

            {/* 2. Tamanho das Letras de Digitação */}
            <div className="space-y-2.5">
              <label className="text-sm font-bold flex items-center gap-2 text-zinc-200">
                <Type className="w-4 h-4 text-emerald-400" />
                <span>Tamanho dos Caracteres de Digitação:</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {textScaleOptions.map((opt) => {
                  const isSelected = settings.textScale === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleUpdate({ textScale: opt.id })}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? settings.highContrast
                            ? 'bg-amber-400 text-black border-amber-300 font-black shadow-lg shadow-amber-400/30'
                            : 'bg-emerald-600/30 border-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                          : 'bg-zinc-900/80 hover:bg-zinc-800/80 border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-bold text-sm">{opt.label}</span>
                        {isSelected && <Check className="w-4 h-4" />}
                      </div>
                      <span className="text-[11px] opacity-75 font-mono leading-tight">
                        {opt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Escala Geral da Interface */}
            <div className="space-y-2.5">
              <label className="text-sm font-bold flex items-center gap-2 text-zinc-200">
                <Maximize className="w-4 h-4 text-sky-400" />
                <span>Escala Geral da Interface (Botões, Menus e Painéis):</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {uiScaleOptions.map((opt) => {
                  const isSelected = settings.uiScale === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleUpdate({ uiScale: opt.id })}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? settings.highContrast
                            ? 'bg-amber-400 text-black border-amber-300 font-black shadow-md'
                            : 'bg-sky-600/30 border-sky-400 text-white shadow-md shadow-sky-500/20'
                          : 'bg-zinc-900/80 hover:bg-zinc-800/80 border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-bold text-sm">{opt.label}</span>
                        {isSelected && <Check className="w-4 h-4" />}
                      </div>
                      <span className="text-[11px] opacity-75 font-mono leading-tight">
                        {opt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Modo Alto Contraste (WCAG AAA) */}
            <div className="p-4.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3.5">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Modo Alto Contraste (Baixa Visão)</h4>
                    <p className="text-xs text-zinc-400">
                      Remove transparências e brilhos difusos, usando fundo preto puro e cores sólidas de alto contraste.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleUpdate({ highContrast: !settings.highContrast })}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                    settings.highContrast
                      ? 'bg-amber-400 text-black border-amber-300 shadow-md shadow-amber-400/40'
                      : 'bg-zinc-950 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  {settings.highContrast ? '✓ Ativado' : 'Desativado'}
                </button>
              </div>

              {settings.highContrast && (
                <div className="pt-3 border-t border-zinc-800 space-y-2">
                  <span className="text-xs font-mono text-zinc-400 block">
                    Esquema de Cores de Alto Contraste:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {contrastThemes.slice(1).map((theme) => {
                      const isSelected = settings.contrastTheme === theme.id;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => handleUpdate({ contrastTheme: theme.id })}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-zinc-800 border-amber-400 text-amber-300 ring-2 ring-amber-400/50'
                              : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <span className={theme.previewText}>{theme.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 5. Toggles Adicionais de Conforto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cursor Grosso e Realçado */}
              <button
                type="button"
                onClick={() => handleUpdate({ thickCursor: !settings.thickCursor })}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                  settings.thickCursor
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                    : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MousePointer className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">Cursor Espesso & Foco</span>
                    <span className="text-[10px] text-zinc-400 leading-tight block">
                      Sublinhado ampliado e caixa de foco marcante
                    </span>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
                    settings.thickCursor ? 'bg-amber-400 border-amber-300 text-black' : 'border-zinc-700'
                  }`}
                >
                  {settings.thickCursor && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>

              {/* Redução de Movimento */}
              <button
                type="button"
                onClick={() => handleUpdate({ reduceMotion: !settings.reduceMotion })}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                  settings.reduceMotion
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-200'
                    : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">Reduzir Movimento</span>
                    <span className="text-[10px] text-zinc-400 leading-tight block">
                      Desativa vibrações e tremores bruscos
                    </span>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
                    settings.reduceMotion ? 'bg-purple-500 border-purple-400 text-black' : 'border-zinc-700'
                  }`}
                >
                  {settings.reduceMotion && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            </div>
          </div>

          {/* Footer com Ações */}
          <div
            className={`p-4 border-t flex items-center justify-between gap-3 ${
              settings.highContrast
                ? 'bg-zinc-950 border-amber-400/80'
                : 'bg-zinc-900/60 border-zinc-800'
            }`}
          >
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-semibold transition cursor-pointer"
              title="Restaurar padrões de fábrica"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrões</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg cursor-pointer ${
                settings.highContrast
                  ? 'bg-amber-400 text-black hover:bg-amber-300 shadow-amber-400/30'
                  : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/30'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Salvar e Aplicar</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
