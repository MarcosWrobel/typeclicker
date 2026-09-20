export function formatBytes(bytes: number): string {
  if (bytes < 0) bytes = 0;
  if (bytes < 1024) {
    return `${Math.floor(bytes)} B`;
  }
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(2)} KB`;
  }
  const mb = kb / 1024;
  if (mb < 1024) {
    return `${mb.toFixed(2)} MB`;
  }
  const gb = mb / 1024;
  if (gb < 1024) {
    return `${gb.toFixed(2)} GB`;
  }
  const tb = gb / 1024;
  return `${tb.toFixed(2)} TB`;
}

export function formatRate(ratePerSec: number): string {
  if (ratePerSec === 0) return '0 B/s';
  return `${formatBytes(ratePerSec)}/s`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('pt-BR').format(Math.floor(num));
}

export function calculatePPM(correctChars: number, activeSeconds: number): number {
  if (activeSeconds < 5 || correctChars === 0) return 0;
  const minutes = activeSeconds / 60;
  const words = correctChars / 5;
  const ppm = Math.round(words / minutes);
  return Math.min(Math.max(ppm, 0), 250); // sanity cap
}

export function calculateAccuracy(correct: number, wrong: number): number {
  const total = correct + wrong;
  if (total === 0) return 100;
  return Number(((correct / total) * 100).toFixed(1));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

import { PlayerRank, calculatePlayerRankFromLevels } from '../data/levels';

export type { PlayerRank };

export function calculatePlayerRank(totalBytesEarned: number): PlayerRank {
  return calculatePlayerRankFromLevels(totalBytesEarned);
}

