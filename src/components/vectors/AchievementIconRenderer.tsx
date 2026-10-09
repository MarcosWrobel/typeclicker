import React from 'react';
import {
Zap,
Flame,
Sparkles,
Wind,
Crown,
Timer,
Target,
Rocket,
Diamond,
FileText,
BookOpen,Landmark,
Keyboard,
Star,
Medal,
ScrollText,
Settings,
Factory,
Coins,
Gem,
Orbit,
Wrench,
Shield,
Globe,
Palette,
Swords,
Trophy,
Bot,
HelpCircle
} from 'lucide-react';

export interface AchievementIconRendererProps {
  icon?: string;
  achievementId?: string;
  className?: string;
  size?: number;
}

export const AchievementIconRenderer: React.FC<AchievementIconRendererProps> = ({
  icon,
  achievementId,
  className = "w-full h-full",
  size
}) => {
  if (!icon) return <Trophy className={className} size={size} />;

  const props = { className, size };

  switch (icon) {
    case '⚡':
    case 'zap':
      return <Zap {...props} className={`${className} text-amber-400`} />;
    case '🔥':
    case 'flame':
      return <Flame {...props} className={`${className} text-rose-500`} />;
    case '✨':
    case 'sparkles':
      return <Sparkles {...props} className={`${className} text-yellow-300`} />;
    case '🌪️':
    case 'wind':
      return <Wind {...props} className={`${className} text-cyan-400`} />;
    case '👑':
    case 'crown':
      return <Crown {...props} className={`${className} text-amber-400`} />;
    case '🏎️':
    case 'speed':
      return <Timer {...props} className={`${className} text-sky-400`} />;
    case '🎯':
    case 'target':
      return <Target {...props} className={`${className} text-emerald-400`} />;
    case '🚀':
    case 'rocket':
      return <Rocket {...props} className={`${className} text-indigo-400`} />;
    case '💠':
    case 'diamond':
      return <Diamond {...props} className={`${className} text-teal-300`} />;
    case '📝':
    case 'note':
      return <FileText {...props} className={`${className} text-blue-300`} />;
    case '📚':
    case 'books':
      return <BookOpen {...props} className={`${className} text-emerald-400`} />;
    case '📖':
    case 'book':
      return <BookOpen {...props} className={`${className} text-cyan-400`} />;
    case '🏛️':
    case 'hall':
      return <Landmark {...props} className={`${className} text-amber-300`} />;
    case '⌨️':
    case 'keyboard':
      return <Keyboard {...props} className={`${className} text-zinc-300`} />;
    case '🌟':
    case 'star':
      return <Star {...props} className={`${className} text-amber-300 fill-amber-300`} />;
    case '🥉':
    case 'bronze':
      return <Medal {...props} className={`${className} text-orange-500`} />;
    case '🥈':
    case 'silver':
      return <Medal {...props} className={`${className} text-slate-300`} />;
    case '🥇':
    case 'gold':
      return <Medal {...props} className={`${className} text-yellow-400`} />;
    case '📜':
    case 'scroll':
      return <ScrollText {...props} className={`${className} text-yellow-200`} />;
    case '⚙️':
    case 'gear':
      return <Settings {...props} className={`${className} text-zinc-400`} />;
    case '🏭':
    case 'factory':
      return <Factory {...props} className={`${className} text-slate-400`} />;
    case '💰':
    case 'money':
      return <Coins {...props} className={`${className} text-emerald-400`} />;
    case '💎':
    case 'gem':
      return <Gem {...props} className={`${className} text-cyan-400`} />;
    case '🌌':
    case 'cosmic':
      return <Orbit {...props} className={`${className} text-purple-400`} />;
    case '🔧':
    case 'wrench':
      return <Wrench {...props} className={`${className} text-orange-400`} />;
    case '🛡️':
    case 'shield':
      return <Shield {...props} className={`${className} text-sky-400`} />;
    case '🌐':
    case 'globe':
      return <Globe {...props} className={`${className} text-blue-400`} />;
    case '🎨':
    case 'palette':
      return <Palette {...props} className={`${className} text-pink-400`} />;
    case '⚔️':
    case '🗡️':
    case 'swords':
      return <Swords {...props} className={`${className} text-rose-400`} />;
    case '🏟️':
    case 'arena':
      return <Trophy {...props} className={`${className} text-amber-500`} />;
    case '🤖':
    case 'robot':
      return <Bot {...props} className={`${className} text-cyan-400`} />;
    case '🔮':
    case 'secret':
      return <HelpCircle {...props} className={`${className} text-purple-400`} />;
    default:
      return <Trophy {...props} className={`${className} text-amber-400`} />;
  }
};
