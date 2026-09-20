import React from 'react';
import { LayoutSkinId } from '../../types/cosmetics';
import { TerminalLayout, BaseLayoutProps } from './TerminalLayout';
import { ArcadeLayout } from './ArcadeLayout';
import { ZenLayout } from './ZenLayout';
import { BiosLayout } from './BiosLayout';
import { CyberdeckLayout } from './CyberdeckLayout';
import { IdeLayout } from './IdeLayout';
import { SpaceStationLayout } from './SpaceStationLayout';
import { SteampunkLayout } from './SteampunkLayout';
import { MacClassicLayout } from './MacClassicLayout';
import { SpeedrunLayout } from './SpeedrunLayout';
import { ChalkboardLayout } from './ChalkboardLayout';
import { StarWarsCockpitLayout } from './StarWarsCockpitLayout';
import { MinecraftBlockLayout } from './MinecraftBlockLayout';
import { ShonenCombatLayout } from './ShonenCombatLayout';
import { MushroomKingdomLayout } from './MushroomKingdomLayout';

export interface GameLayoutWrapperProps extends BaseLayoutProps {
  layoutId?: LayoutSkinId;
}

export const GameLayoutWrapper: React.FC<GameLayoutWrapperProps> = ({
  layoutId = 'default_terminal',
  footer,
  ...props
}) => {
  const renderLayout = () => {
    switch (layoutId) {
      case 'arcade_cabinet':
        return <ArcadeLayout {...props} />;
      case 'zen_focus':
        return <ZenLayout {...props} />;
      case 'bios_dos':
        return <BiosLayout {...props} />;
      case 'cyber_deck':
        return <CyberdeckLayout {...props} />;
      case 'ide_developer':
        return <IdeLayout {...props} />;
      case 'space_station':
        return <SpaceStationLayout {...props} />;
      case 'steampunk_lab':
        return <SteampunkLayout {...props} />;
      case 'retro_mac_classic':
        return <MacClassicLayout {...props} />;
      case 'speedrun_arena':
        return <SpeedrunLayout {...props} />;
      case 'school_chalkboard':
        return <ChalkboardLayout {...props} />;
      case 'star_wars_cockpit':
        return <StarWarsCockpitLayout {...props} />;
      case 'minecraft_block':
        return <MinecraftBlockLayout {...props} />;
      case 'shonen_combat':
        return <ShonenCombatLayout {...props} />;
      case 'mushroom_kingdom':
        return <MushroomKingdomLayout {...props} />;
      case 'default_terminal':
      default:
        return <TerminalLayout footer={footer} {...props} />;
    }
  };

  if (layoutId === 'default_terminal') {
    return renderLayout();
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex-1 flex flex-col">
        {renderLayout()}
      </div>
      {footer}
    </div>
  );
};
