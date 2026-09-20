import React from 'react';
import { BaseLayoutProps } from './TerminalLayout';
import { Flame, Zap, Swords, Award, Activity } from 'lucide-react';

export const ShonenCombatLayout: React.FC<BaseLayoutProps> = ({
  header,
  sidebar,
  arena,
  shop,
  overlays,
  appBgClass = 'bg-[#0a0502]'
}) => {
  return (
    <div className={`min-h-screen ${appBgClass} text-amber-100 flex flex-col font-mono select-none overflow-x-hidden p-1 sm:p-2 md:p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#240c03] via-[#120501] to-[#040100]`}>
      {overlays}

      {/* Frame Principal com Aura Flamejante */}
      <div className="w-full max-w-7xl mx-auto flex-1 min-h-0 flex flex-col border-2 border-orange-500/60 rounded-2xl shadow-[0_0_50px_rgba(249,115,22,0.25)] relative overflow-hidden bg-stone-950/80 backdrop-blur-md min-w-0">
        {/* Cantoneiras Estilizadas Ki Aura */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-400 z-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-orange-400 z-30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-orange-400 z-30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-400 z-30 pointer-events-none" />

        {/* Barra Superior - Scouter & Poder de Luta */}
        <div className="bg-[#180a03] border-b border-orange-500/40 px-3 sm:px-6 py-2 flex items-center justify-between text-[11px] sm:text-xs flex-shrink-0 min-w-0">
          <div className="flex items-center gap-2.5 text-orange-400 min-w-0 truncate">
            <Flame className="w-4 h-4 text-amber-400 animate-bounce flex-shrink-0" />
            <span className="font-black tracking-widest uppercase truncate text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500">
              DOJO TORNEIO DO PODER // SCOUTER COMBAT V2
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] font-mono flex-shrink-0">
            <span className="hidden sm:flex items-center gap-1.5 text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40 font-black">
              <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
              KI: MAIS DE 9.000!
            </span>
            <span className="flex items-center gap-1 text-orange-300 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-500/40 font-bold">
              <Swords className="w-3.5 h-3.5 text-orange-400" />
              SUPER SAIYAN 2
            </span>
          </div>
        </div>

        {/* Header do Jogo */}
        <div className="flex-shrink-0">
          {header}
        </div>

        {/* Grid 3 Colunas: Scouter, Arena e Treinamento */}
        <main className="flex-1 min-h-0 flex flex-col lg:flex-row w-full items-stretch divide-y lg:divide-y-0 lg:divide-x divide-orange-500/30 min-w-0">
          {/* Esquerda: Scouter & Radar Ki */}
          <div className="w-full lg:w-64 xl:w-72 flex-shrink-0 flex flex-col min-w-0 bg-[#120703]/90">
            <div className="bg-orange-950/50 px-3 py-1.5 border-b border-orange-500/30 text-[10px] font-bold text-orange-300 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>[ RADAR KI DO JOGADOR ]</span>
              <span className="text-amber-400 animate-pulse">SENSING...</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{sidebar}</div>
          </div>

          {/* Centro: Ringue do Torneio / Sala do Tempo */}
          <div className="flex-1 min-w-0 flex flex-col bg-[#0b0402] overflow-y-auto">
            <div className="bg-orange-950/50 px-4 py-1.5 border-b border-orange-500/30 text-[10px] font-bold text-amber-300 tracking-wider flex items-center justify-between flex-shrink-0">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-orange-400" />
                <span>SALA DO TEMPO & BATALHA DE DÍGITOS</span>
              </span>
              <span className="text-orange-400 font-bold">100x GRAVIDADE</span>
            </div>
            <div className="flex-1 min-h-0 flex flex-col justify-center">{arena}</div>
          </div>

          {/* Direita: Sementes dos Deuses & Treino de Força */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col min-w-0 bg-[#120703]/90">
            <div className="bg-orange-950/50 px-3 py-1.5 border-b border-orange-500/30 text-[10px] font-bold text-orange-300 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>[ SENZU BEANS & DOJO ]</span>
              <span className="text-emerald-400 font-bold">ENERGIA 100%</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{shop}</div>
          </div>
        </main>

        {/* Rodapé - Pressão de Ki */}
        <footer className="bg-[#120602] border-t border-orange-500/30 px-3 sm:px-6 py-1.5 flex items-center justify-between text-[10px] sm:text-[11px] text-orange-300/70 font-mono flex-shrink-0">
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-amber-400">STATUS: ESPÍRITO GUERREIRO DESPERTO</span>
          </div>
          <div className="text-orange-400 font-bold truncate">
            CAMPEONATO MUNDIAL DE ARTES MARCIAIS
          </div>
        </footer>
      </div>
    </div>
  );
};
