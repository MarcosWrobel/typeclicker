import React from 'react';
import {
  Keyboard,
  Target,
  Hand,
  FileEdit,
  FileText,
  Timer,
  ThumbsUp,
  Eye,
  Monitor,
  School,
  Terminal,
  Laptop,
  Compass,
  Folder,
  Wand2,
  Zap,
  Activity,
  PenTool,
  Type,
  Briefcase,
  Music,
  Flame,
  Sliders,
  Gauge,
  Brain,
  BookOpen,
  Crosshair,
  Microscope,
  Star,
  Lightbulb,
  Binary,
  Settings,
  Repeat,
  GitFork,
  Puzzle,
  Bug,
  Wrench,
  Rocket,
  GraduationCap,
  Palette,
  Server,
  BarChart3,
  Sparkles,
  Globe,
  Award,
  Radio,
  Shield,
  KeyRound,
  Swords,
  Box,
  Layers,
  Ruler,
  Bot,
  Landmark,
  Cloud,
  Cpu,
  Wind,
  Hammer,
  Atom,
  Gem,
  Network,
  Dna,
  Scroll,
  Medal,
  Trophy,
  Crown,
  type LucideIcon,
} from 'lucide-react';

export interface LevelBadgeRendererProps {
  level?: number;
  badge?: string;
  size?: number;
  className?: string;
}

const EMOJI_TO_ICON_MAP: Record<string, { icon: LucideIcon; defaultColor: string }> = {
  '⌨️': { icon: Keyboard, defaultColor: 'text-emerald-400' },
  '🎯': { icon: Target, defaultColor: 'text-emerald-400' },
  '✋': { icon: Hand, defaultColor: 'text-emerald-400' },
  '📝': { icon: FileEdit, defaultColor: 'text-emerald-400' },
  '📄': { icon: FileText, defaultColor: 'text-emerald-400' },
  '⏱️': { icon: Timer, defaultColor: 'text-emerald-400' },
  '👍': { icon: ThumbsUp, defaultColor: 'text-emerald-400' },
  '👀': { icon: Eye, defaultColor: 'text-emerald-400' },
  '🖥️': { icon: Monitor, defaultColor: 'text-emerald-400' },
  '🏫': { icon: School, defaultColor: 'text-emerald-300' },
  '🐧': { icon: Terminal, defaultColor: 'text-teal-400' },
  '💻': { icon: Laptop, defaultColor: 'text-teal-400' },
  '🍃': { icon: Compass, defaultColor: 'text-teal-400' },
  '📁': { icon: Folder, defaultColor: 'text-teal-400' },
  '🪄': { icon: Wand2, defaultColor: 'text-teal-300' },
  '⚡': { icon: Zap, defaultColor: 'text-cyan-400' },
  '🧘': { icon: Activity, defaultColor: 'text-teal-400' },
  '✍️': { icon: PenTool, defaultColor: 'text-teal-400' },
  '🔤': { icon: Type, defaultColor: 'text-teal-400' },
  '🎒': { icon: Briefcase, defaultColor: 'text-teal-300' },
  '🎵': { icon: Music, defaultColor: 'text-cyan-400' },
  '🔥': { icon: Flame, defaultColor: 'text-amber-400' },
  '🎹': { icon: Sliders, defaultColor: 'text-cyan-400' },
  '🏎️': { icon: Gauge, defaultColor: 'text-cyan-300' },
  '🧠': { icon: Brain, defaultColor: 'text-cyan-400' },
  '📖': { icon: BookOpen, defaultColor: 'text-cyan-400' },
  '🏹': { icon: Crosshair, defaultColor: 'text-cyan-400' },
  '🔬': { icon: Microscope, defaultColor: 'text-cyan-400' },
  '🌟': { icon: Star, defaultColor: 'text-amber-300' },
  '💡': { icon: Lightbulb, defaultColor: 'text-sky-400' },
  '🧮': { icon: Binary, defaultColor: 'text-sky-400' },
  '⚙️': { icon: Settings, defaultColor: 'text-sky-400' },
  '🔄': { icon: Repeat, defaultColor: 'text-sky-400' },
  '🔀': { icon: GitFork, defaultColor: 'text-sky-400' },
  '🧩': { icon: Puzzle, defaultColor: 'text-sky-400' },
  '🐛': { icon: Bug, defaultColor: 'text-sky-400' },
  '🛠️': { icon: Wrench, defaultColor: 'text-sky-400' },
  '🚀': { icon: Rocket, defaultColor: 'text-sky-300' },
  '🎓': { icon: GraduationCap, defaultColor: 'text-sky-300' },
  '🎨': { icon: Palette, defaultColor: 'text-blue-400' },
  '🗄️': { icon: Server, defaultColor: 'text-blue-400' },
  '📊': { icon: BarChart3, defaultColor: 'text-blue-400' },
  '🧼': { icon: Sparkles, defaultColor: 'text-blue-400' },
  '🌠': { icon: Sparkles, defaultColor: 'text-blue-300' },
  '🔧': { icon: Wrench, defaultColor: 'text-blue-400' },
  '🌐': { icon: Globe, defaultColor: 'text-blue-400' },
  '👨‍🏫': { icon: Award, defaultColor: 'text-amber-400' },
  '📡': { icon: Radio, defaultColor: 'text-indigo-400' },
  '🛡️': { icon: Shield, defaultColor: 'text-indigo-400' },
  '🔐': { icon: KeyRound, defaultColor: 'text-indigo-400' },
  '⚔️': { icon: Swords, defaultColor: 'text-indigo-400' },
  '📦': { icon: Box, defaultColor: 'text-indigo-300' },
  '🏗️': { icon: Layers, defaultColor: 'text-purple-400' },
  '🌿': { icon: Compass, defaultColor: 'text-purple-400' },
  '📐': { icon: Ruler, defaultColor: 'text-purple-400' },
  '🤖': { icon: Bot, defaultColor: 'text-purple-400' },
  '👁️': { icon: Eye, defaultColor: 'text-purple-400' },
  '🔮': { icon: Sparkles, defaultColor: 'text-purple-300' },
  '🏛️': { icon: Landmark, defaultColor: 'text-fuchsia-400' },
  '☁️': { icon: Cloud, defaultColor: 'text-fuchsia-400' },
  '🖲️': { icon: Cpu, defaultColor: 'text-fuchsia-400' },
  '🌪️': { icon: Wind, defaultColor: 'text-fuchsia-300' },
  '🦾': { icon: Hammer, defaultColor: 'text-fuchsia-400' },
  '⚛️': { icon: Atom, defaultColor: 'text-fuchsia-300' },
  '🧙': { icon: Sparkles, defaultColor: 'text-fuchsia-400' },
  '💎': { icon: Gem, defaultColor: 'text-fuchsia-300' },
  '🕸️': { icon: Network, defaultColor: 'text-rose-400' },
  '🧬': { icon: Dna, defaultColor: 'text-rose-400' },
  '📜': { icon: Scroll, defaultColor: 'text-rose-300' },
  '🛸': { icon: Rocket, defaultColor: 'text-rose-400' },
  '🎻': { icon: Music, defaultColor: 'text-rose-400' },
  '🏅': { icon: Medal, defaultColor: 'text-rose-300' },
  '🥋': { icon: Swords, defaultColor: 'text-amber-400' },
  '🥇': { icon: Trophy, defaultColor: 'text-amber-300' },
  '🗿': { icon: Shield, defaultColor: 'text-amber-400' },
  '🎖️': { icon: Award, defaultColor: 'text-amber-300' },
  '🌌': { icon: Atom, defaultColor: 'text-cyan-300' },
  '👑': { icon: Crown, defaultColor: 'text-amber-400' },
  '🏆': { icon: Trophy, defaultColor: 'text-amber-400' },
};

function getTierFallback(level: number): { icon: LucideIcon; defaultColor: string } {
  if (level <= 10) return { icon: Keyboard, defaultColor: 'text-emerald-400' };
  if (level <= 20) return { icon: Terminal, defaultColor: 'text-teal-400' };
  if (level <= 30) return { icon: Gauge, defaultColor: 'text-cyan-400' };
  if (level <= 40) return { icon: Lightbulb, defaultColor: 'text-sky-400' };
  if (level <= 50) return { icon: Server, defaultColor: 'text-blue-400' };
  if (level <= 60) return { icon: Shield, defaultColor: 'text-indigo-400' };
  if (level <= 70) return { icon: Layers, defaultColor: 'text-purple-400' };
  if (level <= 80) return { icon: Landmark, defaultColor: 'text-fuchsia-400' };
  if (level <= 90) return { icon: Atom, defaultColor: 'text-rose-400' };
  return { icon: Crown, defaultColor: 'text-amber-400' };
}

export const LevelBadgeRenderer: React.FC<LevelBadgeRendererProps> = ({
  level = 1,
  badge = '',
  size = 20,
  className = '',
}) => {
  const mapping = (badge && EMOJI_TO_ICON_MAP[badge]) || getTierFallback(level);
  const IconComponent = mapping.icon;

  return (
    <IconComponent
      size={size}
      className={`shrink-0 ${mapping.defaultColor} ${className}`}
      aria-hidden="true"
    />
  );
};
