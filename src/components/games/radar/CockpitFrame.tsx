import React, { useState, useEffect } from 'react';

interface CockpitFrameProps {
  children: React.ReactNode;
  wave: number;
  enemiesCount: number;
}

export const CockpitFrame: React.FC<CockpitFrameProps> = ({
  children,
  wave,
  enemiesCount
}) => {
  // Simulação de dados dinâmicos de terminal nos visores secundários
  const [telemetryTick, setTelemetryTick] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryTick((t) => (t + 1) % 100);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden p-2 sm:p-3 xl:p-4">
      {/* 1. Fiação Industrial e Cabos Curvados de Fundo (Esquerda e Direita) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30 xl:opacity-45"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cabos esquerdos */}
        <path
          d="M-20,80 C140,140 100,420 -20,500"
          fill="none"
          stroke="#1e293b"
          strokeWidth="12"
        />
        <path
          d="M-20,110 C110,160 80,380 -20,450"
          fill="none"
          stroke="#0f172a"
          strokeWidth="7"
        />
        <path
          d="M-10,220 C160,260 130,530 -10,640"
          fill="none"
          stroke="#334155"
          strokeWidth="4"
        />
        {/* Cabos direitos */}
        <path
          d="M100%,70 Ccalc(100% - 150px),130 calc(100% - 100px),400 100%,520"
          fill="none"
          stroke="#1e293b"
          strokeWidth="12"
        />
        <path
          d="M100%,120 Ccalc(100% - 120px),170 calc(100% - 80px),370 100%,460"
          fill="none"
          stroke="#0f172a"
          strokeWidth="7"
        />
        <path
          d="M100%,210 Ccalc(100% - 170px),270 calc(100% - 130px),550 100%,650"
          fill="none"
          stroke="#334155"
          strokeWidth="4"
        />
      </svg>

      {/* 2. Monitor Auxiliar Esquerdo Superior (Diagnóstico & Kernel) - Visível em monitores Full HD (xl:) */}
      <div className="hidden xl:flex flex-col absolute left-3 2xl:left-6 top-6 2xl:top-10 w-48 2xl:w-56 p-2.5 2xl:p-3 rounded-2xl bg-[#080b10]/95 border-2 border-zinc-800 shadow-[0_0_25px_rgba(0,0,0,0.85)] font-mono text-[10px] text-zinc-400 select-none pointer-events-none z-10">
        <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-zinc-800/80 text-emerald-400 text-[11px] font-bold">
          <span>SYS_DIAG // KERNEL</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>
        <div className="space-y-1 text-[9px] leading-tight text-zinc-400">
          <p className="text-emerald-300">LINK: SECURE [ENCRYPTED]</p>
          <p>RADAR_SWEEP: 360° CW</p>
          <p>AZIMUTH_SYNC: ACTIVE</p>
          <p>BUFFER_HEALTH: 99.8%</p>
          <p>FREQ: 9.42 GHz (BAND-X)</p>
          <p className="text-zinc-500">CYCLE: {1000 + telemetryTick * 7}ms</p>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1.5">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 shadow-[0_0_6px_#10b981]"
              style={{ width: `${65 + (telemetryTick % 30)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Monitor Auxiliar Esquerdo Inferior (Registro de Telemetria de Segurança) */}
      <div className="hidden xl:flex flex-col absolute left-3 2xl:left-6 bottom-16 2xl:bottom-24 w-48 2xl:w-56 p-2.5 2xl:p-3 rounded-2xl bg-[#080b10]/95 border-2 border-zinc-800 shadow-[0_0_25px_rgba(0,0,0,0.85)] font-mono text-[9px] text-zinc-500 select-none pointer-events-none z-10">
        <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-zinc-800/80 text-sky-400 text-[10px] font-bold">
          <span>SUB_SYS // LOG</span>
          <span className="text-[8px] text-zinc-500 font-bold">V4.2</span>
        </div>
        <div className="space-y-0.5 leading-tight">
          <p className="text-zinc-400">0x004F: MEM_LOCK OK</p>
          <p>0x008A: POLAR_COORDS VALID</p>
          <p className="text-sky-300">0x011C: DDA_SPEED SCALED</p>
          <p>0x015E: BEAM_FIBER STABLE</p>
          <p className="text-amber-400 font-bold">THREATS_IN_ZONE: {enemiesCount}</p>
        </div>
      </div>

      {/* 4. Monitor Auxiliar Direito Superior (Rede Tática & Ameaças) */}
      <div className="hidden xl:flex flex-col absolute right-3 2xl:right-6 top-6 2xl:top-10 w-48 2xl:w-56 p-2.5 2xl:p-3 rounded-2xl bg-[#080b10]/95 border-2 border-zinc-800 shadow-[0_0_25px_rgba(0,0,0,0.85)] font-mono text-[10px] text-zinc-400 select-none pointer-events-none z-10">
        <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-zinc-800/80 text-amber-400 text-[11px] font-bold">
          <span>TACTICAL // FEED</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        </div>
        <div className="space-y-1 text-[9px] leading-tight text-zinc-400">
          <p className="text-amber-300 font-bold">STATUS: ONDA {wave} ATIVA</p>
          <p>INTERCEPTS_REMAIN: {enemiesCount}</p>
          <p>LASER_BEARING: 0.0° LOCK</p>
          <p>IFF_BEACON: HOSTILE</p>
          <p className="text-zinc-500">ENCRYPTION: AES-256</p>
          <div className="grid grid-cols-4 gap-1 mt-1.5">
            <span className="p-0.5 text-center bg-zinc-900 border border-zinc-800 text-[8px] text-emerald-400 font-bold">R1</span>
            <span className="p-0.5 text-center bg-zinc-900 border border-zinc-800 text-[8px] text-emerald-400 font-bold">R2</span>
            <span className="p-0.5 text-center bg-zinc-900 border border-zinc-800 text-[8px] text-sky-400 font-bold">R3</span>
            <span className="p-0.5 text-center bg-zinc-900 border border-zinc-800 text-[8px] text-red-400 font-bold">WARN</span>
          </div>
        </div>
      </div>

      {/* 5. Monitor Auxiliar Direito Inferior (Telemetria do Terminal) */}
      <div className="hidden xl:flex flex-col absolute right-3 2xl:right-6 bottom-16 2xl:bottom-24 w-48 2xl:w-56 p-2.5 2xl:p-3 rounded-2xl bg-[#080b10]/95 border-2 border-zinc-800 shadow-[0_0_25px_rgba(0,0,0,0.85)] font-mono text-[9px] text-zinc-500 select-none pointer-events-none z-10">
        <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-zinc-800/80 text-emerald-400 text-[10px] font-bold">
          <span>COMMS // MATRIX</span>
          <span className="text-[8px] text-emerald-400 font-bold">LIVE</span>
        </div>
        <div className="space-y-0.5 leading-tight">
          <p className="text-zinc-400">GRID_SECTOR: DELTA-09</p>
          <p>RANGE_MAX: 400 METROS</p>
          <p className="text-emerald-300">SHOCKWAVE_CAP: READY</p>
          <p>FREQ_CHG: 144.200 MHz</p>
          <p className="text-zinc-400">LATENCY: 1.1ms [DIRECT]</p>
        </div>
      </div>

      {/* 6. Moldura do Console Central do Monitor do Radar */}
      <div className="relative flex flex-col items-center justify-center p-2 sm:p-3 lg:p-4 rounded-3xl bg-[#090c13] border-4 border-zinc-800/95 shadow-[0_0_60px_rgba(0,0,0,0.95),inset_0_0_30px_rgba(0,0,0,0.85)] z-10 max-w-full">
        {/* Parafusos industriais nos cantos da moldura */}
        <div className="absolute top-2 left-2.5 w-2.5 h-2.5 rounded-full bg-zinc-700 border border-zinc-900 shadow-inner flex items-center justify-center text-[7px] text-zinc-900">+</div>
        <div className="absolute top-2 right-2.5 w-2.5 h-2.5 rounded-full bg-zinc-700 border border-zinc-900 shadow-inner flex items-center justify-center text-[7px] text-zinc-900">+</div>
        <div className="absolute bottom-2 left-2.5 w-2.5 h-2.5 rounded-full bg-zinc-700 border border-zinc-900 shadow-inner flex items-center justify-center text-[7px] text-zinc-900">+</div>
        <div className="absolute bottom-2 right-2.5 w-2.5 h-2.5 rounded-full bg-zinc-700 border border-zinc-900 shadow-inner flex items-center justify-center text-[7px] text-zinc-900">+</div>

        {/* Crianças: O Canvas de Radar */}
        {children}
      </div>
    </div>
  );
};
