import React from 'react';
import { Keyboard, Puzzle, Globe, Briefcase, Languages, BookOpen } from 'lucide-react';

interface TrackIconRendererProps {
  trackId?: string | null;
  icon?: string;
  className?: string;
}

export const TrackIconRenderer: React.FC<TrackIconRendererProps> = ({
  trackId,
  icon,
  className = 'w-4 h-4'
}) => {
  const normalizedId = trackId?.toLowerCase().trim();

  if (normalizedId === 'geral' || icon === '⌨️') {
    return <Keyboard className={className} />;
  }
  if (normalizedId === 'scratch' || icon === '🧩') {
    return <Puzzle className={className} />;
  }
  if (normalizedId === 'web' || icon === '🌐') {
    return <Globe className={className} />;
  }
  if (normalizedId === 'empresarial' || icon === '💼') {
    return <Briefcase className={className} />;
  }
  if (normalizedId === 'ingles' || icon === '🇬🇧') {
    return <Languages className={className} />;
  }

  return <BookOpen className={className} />;
};
