import React from 'react';
import {
Code2,
Sparkles,
CheckCircle2,
ArrowRight,
X,
Layers,
FileCode,
Terminal,
Palette,
Database,DoorOpen
} from 'lucide-react';
import { GAME_LANGUAGES, GameLanguageCard, GameLanguageId } from '../constants/levels';

interface LanguageSelectModalProps {
  isOpen: boolean;
  selectedLanguage: GameLanguageId;
  onSelectLanguage: (langId: GameLanguageId) => void;
  onClose: () => void;
  progressByLanguage?: Record<GameLanguageId, number>;
}

export const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({
  isOpen,
  selectedLanguage,
  onSelectLanguage,
  onClose,
  progressByLanguage = {
    javascript: 1,
    python: 1,
    css: 1,
    html: 1,
    sql: 1,
  },
}) => {
  if (!isOpen) return null;

  const getLanguageIcon = (id: GameLanguageId) => {
    switch (id) {
      case 'javascript':
        return <FileCode className="w-6 h-6 text-amber-300" />;
      case 'python':
        return <Terminal className="w-6 h-6 text-sky-400" />;
      case 'css':
        return <Palette className="w-6 h-6 text-blue-400" />;
      case 'html':
        return <Code2 className="w-6 h-6 text-orange-400" />;
      case 'sql':
        return <Database className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <div 
      id="language-select-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#14161d] border border-[#2b2f3d] rounded-2xl shadow-2xl p-4 sm:p-7 flex flex-col gap-5 text-neutral-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header de Entrada e Apresentação do Jogo */}
        <div className="flex items-start justify-between border-b border-[#252834] pb-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Jogo de Programação • Categoria Alunos</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                <span>Criado por André Luís Borato Ferreira - 8º 2</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Bem-vindo ao ProgPlay! 🎮</span>
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
              O <strong>ProgPlay</strong> é uma plataforma interativa de programação criada para exercitar seu raciocínio lógico e habilidades reais de desenvolvimento! Resolva o <strong>Enigma das Portas</strong> escrevendo código real com o editor profissional, teste seus scripts no terminal e dispute batalhas de quiz na <strong>Arena 1v1</strong> contra o mascote Bytezinho ou seus colegas de turma!
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors cursor-pointer shrink-0"
            title="Fechar e ir para o editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pilares do Jogo / O que você vai encontrar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-neutral-900/80 border border-neutral-800 rounded-xl text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
              <DoorOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">1. Enigma das Portas</div>
              <div className="text-[11px] text-neutral-400">Acerte o código e veja a fechadura destrancar em tempo real.</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 shrink-0">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">2. Editor VS Code & Python</div>
              <div className="text-[11px] text-neutral-400">Monaco Editor com autocompletar e terminal de execução.</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">3. Duelos 1v1 Sem IA</div>
              <div className="text-[11px] text-neutral-400">Dispute solo contra o bot Bytezinho 🐸 ou com amigos em sala.</div>
            </div>
          </div>
        </div>

        {/* Instrução para Escolha da Linguagem */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <div>
            <h2 className="text-base font-bold text-white">Selecione uma Linguagem para Iniciar</h2>
            <p className="text-xs text-neutral-400">Escolha onde deseja começar seus desafios práticos:</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            5 Tecnologias Disponíveis
          </span>
        </div>

        {/* 5 CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {GAME_LANGUAGES.map((lang: GameLanguageCard) => {
            const isCurrent = selectedLanguage === lang.id;
            const currentUnlocked = progressByLanguage[lang.id] || 1;
            const progressPercent = Math.min(100, Math.round((currentUnlocked / 20) * 100));

            return (
              <div
                key={lang.id}
                id={`card-lang-${lang.id}`}
                onClick={() => {
                  onSelectLanguage(lang.id);
                  onClose();
                }}
                className={`group relative rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer border text-left ${
                  isCurrent
                    ? 'bg-[#1b202e] border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/30'
                    : 'bg-[#181a22] border-[#262936] hover:bg-[#1e212c] hover:border-neutral-600 hover:shadow-md'
                }`}
              >
                {/* Top Badge & Indicator */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-transform group-hover:scale-105"
                      style={{ backgroundColor: lang.bgColor, color: lang.color }}
                    >
                      {getLanguageIcon(lang.id)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                        {lang.name}
                      </h3>
                      <span className="text-[11px] font-mono text-neutral-400">
                        {lang.extension} • {lang.tag}
                      </span>
                    </div>
                  </div>

                  {isCurrent && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ativo</span>
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-300 leading-relaxed mb-3 flex-1">
                  {lang.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
                    <span>Fase {currentUnlocked} / 20</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Bottom Meta & Action */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[11px]">
                    <Layers className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{currentUnlocked >= 11 ? 'Capítulo 2: Sites' : 'Capítulo 1: Portas'}</span>
                  </div>

                  <span className="font-bold text-xs flex items-center gap-1 text-blue-400 group-hover:translate-x-0.5 transition-transform">
                    {isCurrent ? 'Continuar' : 'Jogar'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Você pode alternar de linguagem a qualquer momento. Seu progresso fica salvo na nuvem!</span>
          </div>
          <span className="font-mono text-[11px] text-neutral-500">
            100 desafios práticos disponíveis
          </span>
        </div>

      </div>
    </div>
  );
};
