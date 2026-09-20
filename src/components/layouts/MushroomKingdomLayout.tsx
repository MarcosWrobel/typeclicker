import React from 'react';
import { BaseLayoutProps } from './TerminalLayout';
import { Coins, Star, Timer, Crown, Gamepad2 } from 'lucide-react';

export const MushroomKingdomLayout: React.FC<BaseLayoutProps> = ({
  header,
  sidebar,
  arena,
  shop,
  overlays,
  appBgClass = 'bg-[#100d1c]'
}) => {
  return (
    <div className={`min-h-screen ${appBgClass} text-yellow-100 flex flex-col font-mono select-none overflow-x-hidden p-1 sm:p-2 md:p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2a1334] via-[#150a21] to-[#090310]`}>
      {overlays}

      {/* Frame Principal estilo Reino dos Cogumelos / Warp Pipe */}
      <div className="w-full max-w-7xl mx-auto flex-1 min-h-0 flex flex-col border-2 border-emerald-500/50 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.2)] relative overflow-hidden bg-slate-950/80 backdrop-blur-md min-w-0">
        {/* Cantoneiras Estilizadas */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-yellow-400 z-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-yellow-400 z-30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-400 z-30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-400 z-30 pointer-events-none" />

        {/* Top HUD Clássico 8-bit */}
        <div className="bg-[#1b152b] border-b border-emerald-500/40 px-3 sm:px-6 py-2 flex items-center justify-between text-[11px] sm:text-xs flex-shrink-0 min-w-0">
          <div className="flex items-center gap-2 text-yellow-400 font-black min-w-0 truncate tracking-wider">
            <Gamepad2 className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-bounce" />
            <span className="uppercase truncate">
              SUPER BYTE BROS // WORLD 8-4 CASTLE
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] font-mono flex-shrink-0">
            <div className="flex items-center gap-1 text-yellow-300 font-bold bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/40">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span>x 999</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/40">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>SUPER STAR</span>
            </div>
            <div className="flex items-center gap-1 text-rose-300 font-bold bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/40">
              <Timer className="w-3.5 h-3.5 text-rose-400" />
              <span>TIME: 399</span>
            </div>
          </div>
        </div>

        {/* Header do Jogo */}
        <div className="flex-shrink-0">
          {header}
        </div>

        {/* Grid 3 Colunas: Status, Warp Stage e Toad Shop */}
        <main className="flex-1 min-h-0 flex flex-col lg:flex-row w-full items-stretch divide-y lg:divide-y-0 lg:divide-x divide-emerald-500/25 min-w-0">
          {/* Esquerda: Status do Reino */}
          <div className="w-full lg:w-64 xl:w-72 flex-shrink-0 flex flex-col min-w-0 bg-[#161224]/90">
            <div className="bg-purple-950/50 px-3 py-1.5 border-b border-emerald-500/30 text-[10px] font-bold text-yellow-300 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>[ PAINEL PRINCIPAL DO MUNDO ]</span>
              <span className="text-emerald-400 font-bold">1-UP READY</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{sidebar}</div>
          </div>

          {/* Centro: Warp Zone & Digitação */}
          <div className="flex-1 min-w-0 flex flex-col bg-[#0d0917] overflow-y-auto">
            <div className="bg-purple-950/50 px-4 py-1.5 border-b border-emerald-500/30 text-[10px] font-bold text-yellow-300 tracking-wider flex items-center justify-between flex-shrink-0">
              <span className="flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>WARP PIPE TERMINAL // DESAFIO DE VELOCIDADE</span>
              </span>
              <span className="text-emerald-400 font-bold">ZONE 08</span>
            </div>
            <div className="flex-1 min-h-0 flex flex-col justify-center">{arena}</div>
          </div>

          {/* Direita: Loja do Toad */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col min-w-0 bg-[#161224]/90">
            <div className="bg-purple-950/50 px-3 py-1.5 border-b border-emerald-500/30 text-[10px] font-bold text-yellow-300 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>[ BAZAAR DO TOAD & POWER-UPS ]</span>
              <span className="text-yellow-400 font-bold">ITENS DISPONÍVEIS</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{shop}</div>
          </div>
        </main>

        {/* Rodapé Retro */}
        <footer className="bg-[#120e1e] border-t border-emerald-500/30 px-3 sm:px-6 py-1.5 flex items-center justify-between text-[10px] sm:text-[11px] text-yellow-200/70 font-mono flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-rose-400 font-bold">VIDAS: x 99</span>
            <span className="hidden sm:inline text-yellow-300">PONTOS: 084200</span>
          </div>
          <div className="text-emerald-400 font-bold truncate">
            THANK YOU MARIO! BUT OUR PRINCESS IS IN ANOTHER CASTLE!
          </div>
        </footer>
      </div>
    </div>
  );
};
