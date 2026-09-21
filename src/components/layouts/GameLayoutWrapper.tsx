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
import { QuantumMythicLayout } from './QuantumMythicLayout';
import { SocialAppLayout } from './SocialAppLayout';

export interface GameLayoutWrapperProps extends BaseLayoutProps {
  layoutId?: LayoutSkinId;
}

export const GameLayoutWrapper: React.FC<GameLayoutWrapperProps> = ({
  layoutId = 'default_terminal',
  footer,
  ...props
}) => {
  const isCustomThemedLayout = [
    'arcade_cabinet',
    'zen_focus',
    'bios_dos',
    'cyber_deck',
    'ide_developer',
    'space_station',
    'steampunk_lab',
    'retro_mac_classic',
    'speedrun_arena',
    'school_chalkboard',
    'star_wars_cockpit',
    'minecraft_block',
    'shonen_combat',
    'mushroom_kingdom',
    'infinite_void_realm',
    'pirate_deck',
    'judgment_hall',
    'edgerunner_rig',
    'slayer_dojo',
    'pocket_console',
    'manga_action',
    'hollow_ruins',
    'green_hills_zone',
    'bat_cave_tactical',
    'whatsapp_chat_layout',
    'instagram_feed_layout',
    'youtube_theater_layout',
    'tiktok_stream_layout',
    'roblox_studio_layout',
  ].includes(layoutId);

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
      case 'infinite_void_realm':
      case 'pirate_deck':
      case 'judgment_hall':
      case 'edgerunner_rig':
      case 'slayer_dojo':
      case 'pocket_console':
      case 'manga_action':
      case 'hollow_ruins':
      case 'green_hills_zone':
      case 'bat_cave_tactical':
        return <QuantumMythicLayout layoutId={layoutId} {...props} />;
      case 'whatsapp_chat_layout':
      case 'instagram_feed_layout':
      case 'youtube_theater_layout':
      case 'tiktok_stream_layout':
      case 'roblox_studio_layout':
        return <SocialAppLayout layoutId={layoutId} footer={footer} {...props} />;
      case 'default_terminal':
      default:
        return <TerminalLayout footer={footer} {...props} />;
    }
  };

  if (!isCustomThemedLayout) {
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
