import React from 'react';
import { GameCoverArtProps, TyperDashArt } from './TyperDashArt';
import { TypeClickerArt } from './TypeClickerArt';
import { TypeRadarArt } from './TypeRadarArt';
import { ProgPlayArt } from './ProgPlayArt';
import { TimeAttackArt } from './TimeAttackArt';
import { CyberDungeonArt } from './CyberDungeonArt';
import { ClassroomRaceArt } from './ClassroomRaceArt';
import { ClassroomRaidArt } from './ClassroomRaidArt';
import { ScratchBotArt } from './ScratchBotArt';
import { ByteQuestArt } from './ByteQuestArt';
import { MathStormArt } from './MathStormArt';
import { SyntaxMazeArt } from './SyntaxMazeArt';

export interface GameCoverProps extends GameCoverArtProps {
  gameId: string;
}

/**
 * Fallback genérico elegante para jogos customizados de alunos
 */
const GenericGameArt: React.FC<GameCoverArtProps> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="gen-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#gen-bg)" />
      <g stroke="#6366f1" strokeOpacity="0.2" strokeWidth="1">
        <line x1="0" y1="50" x2="400" y2="50" />
        <line x1="0" y1="100" x2="400" y2="100" />
        <line x1="0" y1="150" x2="400" y2="150" />
      </g>
      <circle cx="200" cy="100" r="45" fill="#4338ca" fillOpacity="0.2" stroke="#818cf8" strokeWidth="2" />
      <text x="200" y="106" textAnchor="middle" fill="#c7d2fe" fontFamily="monospace" fontSize="16" fontWeight="900">
        GAME STUDIO
      </text>
    </svg>
  );
};

/**
 * Renderizador mestre de arte de capa vetorial para os jogos da plataforma TypeClicker.
 */
export const GameCoverArt: React.FC<GameCoverProps> = ({ gameId, className, glow }) => {
  switch (gameId) {
    case 'typerdash':
      return <TyperDashArt className={className} glow={glow} />;
    case 'typeclicker':
      return <TypeClickerArt className={className} glow={glow} />;
    case 'type_radar':
      return <TypeRadarArt className={className} glow={glow} />;
    case 'progplay':
      return <ProgPlayArt className={className} glow={glow} />;
    case 'time_attack':
      return <TimeAttackArt className={className} glow={glow} />;
    case 'dungeon':
      return <CyberDungeonArt className={className} glow={glow} />;
    case 'race':
      return <ClassroomRaceArt className={className} glow={glow} />;
    case 'raid':
      return <ClassroomRaidArt className={className} glow={glow} />;
    case 'scratchbot':
      return <ScratchBotArt className={className} glow={glow} />;
    case 'bytequest':
      return <ByteQuestArt className={className} glow={glow} />;
    case 'math_storm':
      return <MathStormArt className={className} glow={glow} />;
    case 'syntax_maze':
      return <SyntaxMazeArt className={className} glow={glow} />;
    default:
      return <GenericGameArt className={className} glow={glow} />;
  }
};
