import React from 'react';
import { Terminal, Sparkles, Zap, Crown, Flame, Cpu, Settings } from 'lucide-react';
import { CardFrameId } from '../../types/cardFrames';

export interface CardFrameIconProps {
  frameId?: CardFrameId | string;
  className?: string;
  size?: number;
}

export const CardFrameIcon: React.FC<CardFrameIconProps> = ({
  frameId = 'basic',
  className = "w-4 h-4 inline-block",
  size
}) => {
  const iconProps = { className, size };

  switch (frameId) {
    case 'foil':
      return <Sparkles {...iconProps} className={`${className} text-pink-300`} />;
    case 'neon':
      return <Zap {...iconProps} className={`${className} text-cyan-300`} />;
    case 'gold':
      return <Crown {...iconProps} className={`${className} text-amber-300`} />;
    case 'magma':
      return <Flame {...iconProps} className={`${className} text-rose-400`} />;
    case 'cosmic':
      return <Sparkles {...iconProps} className={`${className} text-purple-300`} />;
    case 'matrix':
      return <Cpu {...iconProps} className={`${className} text-emerald-400`} />;
    case 'steampunk':
      return <Settings {...iconProps} className={`${className} text-amber-600`} />;
    case 'basic':
    default:
      return <Terminal {...iconProps} className={`${className} text-emerald-400`} />;
  }
};
