import React from 'react';
import { motion } from 'framer-motion';
import { Star, Lock, Sparkles, Scale, PieChart, GitCommit, Boxes, Zap } from 'lucide-react';
import { CupheadFilter } from './CupheadFilter';

export type StormDistrictId = 'balance' | 'fractions' | 'numberline' | 'baseten' | 'boss';

export interface StormIslandNode {
  id: string;
  district: StormDistrictId;
  levelIndex: number;
  mode: StormDistrictId;
  title: string;
  subtitle: string;
  actName: string;
  x: number; // Percentual no mapa (0 a 100)
  y: number; // Percentual no mapa (0 a 100)
  stars: number; // 0 a 3
  isUnlocked: boolean;
  boss?: boolean;
}

interface CupheadStormIslandMapProps {
  nodes: StormIslandNode[];
  activeDistrict: StormDistrictId;
  onSelectDistrict: (district: StormDistrictId) => void;
  onSelectNode: (node: StormIslandNode) => void;
  onExit: () => void;
  totalStars: number;
  maxStars: number;
}

const DISTRICTS: {
  id: StormDistrictId;
  label: string;
  bnccTag: string;
  bgColor: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    id: 'balance',
    label: '1. Balança de Latão',
    bnccTag: 'Álgebra',
    bgColor: 'bg-[#ffd95a]',
    icon: Scale
  },
  {
    id: 'fractions',
    label: '2. Padaria de Frações',
    bnccTag: 'Frações',
    bgColor: 'bg-[#f39c12]',
    icon: PieChart
  },
  {
    id: 'numberline',
    label: '3. Ferrovia Numérica',
    bnccTag: 'Reta e Saltos',
    bgColor: 'bg-[#5dade2]',
    icon: GitCommit
  },
  {
    id: 'baseten',
    label: '4. Fábrica Base 10',
    bnccTag: 'Decomposição',
    bgColor: 'bg-[#2ecc71]',
    icon: Boxes
  },
  {
    id: 'boss',
    label: '5. Vórtice Chefão',
    bnccTag: 'Desafio Final',
    bgColor: 'bg-[#e74c3c]',
    icon: Zap
  }
];

export const CupheadStormIslandMap: React.FC<CupheadStormIslandMapProps> = ({
  nodes,
  activeDistrict,
  onSelectDistrict,
  onSelectNode,
  onExit,
  totalStars,
  maxStars
}) => {
  const districtNodes = nodes.filter((n) => n.district === activeDistrict);

  return (
    <div className="relative w-full min-h-screen bg-[#f7eed4] text-[#2b1810] font-sans overflow-hidden select-none flex flex-col justify-between">
      <CupheadFilter id="cuphead-fx" />

      {/* TEXTURA DE PAPEL VINTAGE E RUÍDO DE PELÍCULA (FILM GRAIN 1930s) */}
      <div className="absolute inset-0 bg-[radial-gradient(#8c5828_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute inset-0 bg-[#d49742]/10 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_40%,rgba(69,26,3,0.35)_100%)] pointer-events-none z-30" />

      {/* FAIXA SUPERIOR AMPLA COM TEXTOS E BOTÕES GRANDES */}
      <header className="relative z-40 px-6 sm:px-10 py-4 flex flex-wrap items-center justify-between gap-4 border-b-5 border-[#24140b] bg-[#fdf5df] shadow-[0_6px_0_#24140b]">
        <div className="flex items-center gap-5">
          <button
            onClick={onExit}
            className="px-5 py-2.5 rounded-2xl bg-[#fdf5df] hover:bg-[#faeac4] text-[#24140b] font-serif font-black text-sm tracking-wider border-4 border-[#24140b] shadow-[0_4px_0_#24140b] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center gap-2"
          >
            <span className="text-base">◀</span> SAIR AO HUB
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#24140b] font-serif uppercase">
              INKWELL ISLE: MATH STORM
            </h1>
            <p className="text-xs sm:text-sm font-serif font-black text-[#7f5326]">
              ESCOLHA UM DISTRITO DA ILHA PARA EXPLORAR OS MANIPULATIVOS MATEMÁTICOS
            </p>
          </div>
        </div>

        {/* CONTADOR DE ESTRELAS DE OURO VINTAGE GRANDE */}
        <div className="flex items-center gap-4">
          <div className="px-5 py-2 rounded-2xl bg-[#ffd95a] border-4 border-[#24140b] shadow-[0_4px_0_#24140b] flex items-center gap-3">
            <Star className="w-6 h-6 fill-[#e67e22] text-[#24140b]" />
            <span className="font-serif font-black text-xl tracking-wider text-[#24140b]">
              {totalStars} / {maxStars}
            </span>
          </div>
        </div>
      </header>

      {/* BARRA DE DISTRITOS DA ILHA (SELETOR CARTUNIZADO DE REGIÕES) */}
      <div className="relative z-40 max-w-[1440px] w-full mx-auto px-4 sm:px-6 pt-4 flex flex-wrap items-center justify-center gap-3">
        {DISTRICTS.map((dist) => {
          const IconComp = dist.icon;
          const isSelected = activeDistrict === dist.id;
          return (
            <button
              key={dist.id}
              onClick={() => onSelectDistrict(dist.id)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border-4 border-[#24140b] font-serif font-black text-xs sm:text-sm uppercase transition-all cursor-pointer ${
                isSelected
                  ? `${dist.bgColor} text-[#24140b] shadow-[0_6px_0_#24140b] -translate-y-1 ring-2 ring-[#24140b]`
                  : 'bg-[#fdf5df] hover:bg-[#faeac4] text-[#24140b] shadow-[0_3px_0_#24140b]'
              }`}
            >
              <IconComp className="w-5 h-5 stroke-[2.5]" />
              <div className="text-left">
                <span className="block leading-none">{dist.label}</span>
                <span className="text-[10px] opacity-80 block mt-0.5">{dist.bnccTag}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* MAPA ILHA EXPANDIDO (OCUPA O MÁXIMO DA TELA) */}
      <main className="relative flex-1 w-full max-w-[1440px] mx-auto p-4 sm:p-5 flex items-center justify-center">
        <div className="relative w-full aspect-[16/9] max-h-[72vh] rounded-3xl border-8 border-[#24140b] bg-[#93c76a] shadow-[0_14px_0_#24140b] overflow-hidden">
          
          {/* MAR VINTAGE ONDULANTE EM VOLTA DA ILHA */}
          <div className="absolute inset-0 bg-[#5caec9] border-b-8 border-[#3b788c]">
            <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <pattern id="waves" width="70" height="28" patternUnits="userSpaceOnUse">
                <path d="M 0 14 Q 17.5 2 35 14 T 70 14" fill="none" stroke="#24140b" strokeWidth="3" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#waves)" />
            </svg>
          </div>

          {/* MASSA DE TERRA DA ILHA */}
          <svg
            viewBox="0 0 1000 560"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Sombra da Ilha */}
            <path
              d="M 100 440 C 230 520, 770 520, 900 430 C 970 360, 950 190, 840 130 C 700 60, 260 50, 140 130 C 50 200, 40 380, 100 440 Z"
              fill="#24140b"
            />
            {/* Terra Marrom */}
            <path
              d="M 100 425 C 230 505, 770 505, 900 415 C 970 345, 950 180, 840 120 C 700 50, 260 40, 140 120 C 50 190, 40 365, 100 425 Z"
              fill="#c68a4c"
              stroke="#24140b"
              strokeWidth="7"
            />
            {/* Gramado da Região Ativa */}
            <path
              d="M 110 405 C 240 485, 760 485, 890 395 C 955 330, 935 170, 830 110 C 690 45, 270 35, 150 110 C 65 180, 55 350, 110 405 Z"
              fill={
                activeDistrict === 'fractions'
                  ? '#f5cba7'
                  : activeDistrict === 'numberline'
                  ? '#aed6f1'
                  : activeDistrict === 'baseten'
                  ? '#a9dfbf'
                  : activeDistrict === 'boss'
                  ? '#d7bde2'
                  : '#98ce69'
              }
              stroke="#24140b"
              strokeWidth="6"
            />

            {/* TRILHA PONTILHADA CONECTANDO OS NÓS */}
            <path
              d="M 220 370 Q 320 280, 420 340 T 640 260 T 820 190"
              fill="none"
              stroke="#edd49e"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 220 370 Q 320 280, 420 340 T 640 260 T 820 190"
              fill="none"
              stroke="#24140b"
              strokeWidth="5"
              strokeDasharray="12 12"
              strokeLinecap="round"
            />

            {/* Montanha Cartum com Rosto */}
            <g transform="translate(480, 70)">
              <polygon points="0,105 70,-15 140,105" fill="#a4784a" stroke="#24140b" strokeWidth="6" />
              <polygon points="45,28 70,-15 95,28" fill="#fdf5df" stroke="#24140b" strokeWidth="4" />
              <circle cx="58" cy="50" r="5" fill="#24140b" />
              <circle cx="82" cy="50" r="5" fill="#24140b" />
            </g>

            {/* Árvores com copa fofa */}
            <g transform="translate(250, 170)">
              <path d="M 24 70 Q 30 35, 24 15" stroke="#78472a" strokeWidth="8" strokeLinecap="round" />
              <circle cx="24" cy="10" r="28" fill="#5b9b41" stroke="#24140b" strokeWidth="5" />
              <circle cx="12" cy="20" r="18" fill="#71b550" stroke="#24140b" strokeWidth="4" />
            </g>

            <g transform="translate(710, 300)">
              <path d="M 24 70 Q 18 35, 26 15" stroke="#78472a" strokeWidth="8" strokeLinecap="round" />
              <circle cx="24" cy="10" r="30" fill="#5b9b41" stroke="#24140b" strokeWidth="5" />
              <circle cx="36" cy="20" r="20" fill="#71b550" stroke="#24140b" strokeWidth="4" />
            </g>
          </svg>

          {/* NÓS DO DISTRITO SELECIONADO */}
          {districtNodes.map((node) => {
            const isClickable = node.isUnlocked;

            return (
              <motion.div
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                whileHover={isClickable ? { scale: 1.15, y: -8 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
                onClick={() => isClickable && onSelectNode(node)}
              >
                <div className="flex flex-col items-center group">
                  {/* Totem do Nó Expandido */}
                  <div
                    className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-3xl border-5 border-[#24140b] shadow-[0_8px_0_#24140b] flex items-center justify-center transition-all ${
                      node.boss
                        ? 'bg-[#e74c3c] text-white shadow-[#962d22]'
                        : isClickable
                        ? 'bg-[#ffd95a] text-[#24140b] hover:bg-[#ffe58f]'
                        : 'bg-[#95a5a6] text-[#2c3e50] opacity-80'
                    }`}
                  >
                    <motion.div
                      animate={isClickable ? { y: [0, -5, 0] } : {}}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex items-center justify-center"
                    >
                      {node.mode === 'balance' && <Scale className="w-10 h-10 sm:w-11 sm:h-11 stroke-[2.7]" />}
                      {node.mode === 'fractions' && <PieChart className="w-10 h-10 sm:w-11 sm:h-11 stroke-[2.7]" />}
                      {node.mode === 'numberline' && <GitCommit className="w-10 h-10 sm:w-11 sm:h-11 stroke-[2.7]" />}
                      {node.mode === 'baseten' && <Boxes className="w-10 h-10 sm:w-11 sm:h-11 stroke-[2.7]" />}
                      {node.mode === 'boss' && <Sparkles className="w-12 h-12 stroke-[2.7] text-amber-300 fill-amber-300 animate-spin" />}
                      {!node.isUnlocked && <Lock className="w-9 h-9 text-[#24140b] stroke-[2.7]" />}
                    </motion.div>

                    {/* Número da Fase no Canto Superior Direito */}
                    <span className="absolute -top-3.5 -right-3.5 w-8 h-8 rounded-full bg-[#fdf5df] border-3 border-[#24140b] text-[#24140b] font-serif font-black text-sm flex items-center justify-center shadow-md">
                      {node.levelIndex + 1}
                    </span>
                  </div>

                  {/* ESTRELAS ESTILO ANOS 30 SOB O NÓ */}
                  {isClickable && (
                    <div className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-[#fdf5df] border-3 border-[#24140b] shadow-[0_3px_0_#24140b]">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            starIdx <= node.stars
                              ? 'fill-[#f39c12] text-[#24140b]'
                              : 'fill-transparent text-[#24140b]/30'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* BANNER COM NOME DA FASE (FONTES GRANDES) */}
                  <div className="mt-1.5 px-4 py-1.5 rounded-2xl bg-[#fdf5df] border-3 border-[#24140b] shadow-[0_4px_0_#24140b] text-center max-w-[190px] pointer-events-none">
                    <span className="font-serif font-black text-xs sm:text-sm block uppercase text-[#24140b] leading-tight">
                      {node.title}
                    </span>
                    <span className="text-[11px] font-serif font-bold text-[#7f5326] block mt-0.5">
                      {node.actName}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* RODAPÉ DO MAPA */}
      <footer className="relative z-40 px-6 py-3 border-t-5 border-[#24140b] bg-[#fdf5df] text-center text-sm font-serif font-black text-[#7f5326]">
        Navegue pelos 5 Distritos da Inkwell Isle acima e domine Álgebra, Frações, Reta Numérica, Base 10 e o Vórtice!
      </footer>
    </div>
  );
};
