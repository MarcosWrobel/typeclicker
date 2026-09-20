export type CosmeticCurrency = 'tokens' | 'duel_coins';

export type TerminalThemeId =
  | 'matrix'
  | 'dracula'
  | 'amber'
  | 'cyberpunk'
  | 'monokai'
  | 'synthwave'
  | 'solarized_dark'
  | 'nordic_ice'
  | 'lava_terminal'
  | 'golden_luxury'
  | 'stealth_mono'
  // Temas da Cultura Pop (Arena 1x1)
  | 'sith_darkside'
  | 'super_saiyan'
  | 'nether_magma'
  | 'spider_verse';

export type BytezinhoSkinId =
  | 'classic'
  | 'cyber'
  | 'retro_8bit'
  | 'hoodie_hacker'
  | 'wizard'
  | 'astronaut'
  | 'ninja'
  | 'steampunk'
  | 'golden_king'
  | 'diver'
  | 'robot_mecha'
  // Skins da Cultura Pop (Arena 1x1)
  | 'jedi_master'
  | 'miner_diamond'
  | 'saiyan_warrior'
  | 'arachnid_hero';

export type LayoutSkinId =
  | 'default_terminal'
  | 'arcade_cabinet'
  | 'zen_focus'
  | 'bios_dos'
  | 'cyber_deck'
  | 'ide_developer'
  | 'space_station'
  | 'steampunk_lab'
  | 'retro_mac_classic'
  | 'speedrun_arena'
  | 'school_chalkboard'
  // Layouts da Cultura Pop (Arena 1x1)
  | 'star_wars_cockpit'
  | 'minecraft_block'
  | 'shonen_combat'
  | 'mushroom_kingdom';

export type AnimationEffectId =
  | 'confetti_classic'
  | 'golden_coins'
  | 'matrix_stream'
  | 'supernova_burst'
  | 'tesla_lightning'
  | 'volcano_flame'
  | 'cyber_neon'
  | 'pixel_retro'
  | 'fireworks_show'
  | 'bubble_magic'
  // Efeitos VFX da Cultura Pop (Arena 1x1)
  | 'hyperspace_warp'
  | 'kamehameha_energy'
  | 'diamond_rain';

export type LevelUpEffectId = 'confetti' | 'matrix_rain' | 'glitch';

export type KeySoundThemeId =
  | 'mechanical'
  | 'retro_beep'
  | 'typewriter'
  | 'soft_click'
  // Sons de Teclado da Cultura Pop (Arena 1x1)
  | 'lightsaber_clash'
  | 'pixel_block_jump'
  | 'ki_blast';

export interface PlayerCosmetics {
  levelTokens: number;
  duelTokens: number; // Moedas de Duelo (Arena Coins ⚔️)
  unlockedLayouts: LayoutSkinId[];
  unlockedThemes: TerminalThemeId[];
  unlockedSkins: BytezinhoSkinId[];
  unlockedSounds: KeySoundThemeId[];
  equippedLayout: LayoutSkinId;
  equippedTheme: TerminalThemeId;
  equippedSkin: BytezinhoSkinId;
  equippedSound: KeySoundThemeId;
  unlockedAnimations?: AnimationEffectId[];
  equippedAnimation?: AnimationEffectId;
  unlockedEffects?: LevelUpEffectId[];
  equippedEffect?: LevelUpEffectId;
}

export const DEFAULT_COSMETICS: PlayerCosmetics = {
  levelTokens: 0,
  duelTokens: 0,
  unlockedLayouts: ['default_terminal'],
  unlockedThemes: ['matrix'],
  unlockedSkins: ['classic'],
  unlockedSounds: ['mechanical'],
  unlockedAnimations: ['confetti_classic'],
  equippedLayout: 'default_terminal',
  equippedTheme: 'matrix',
  equippedSkin: 'classic',
  equippedSound: 'mechanical',
  equippedAnimation: 'confetti_classic',
  unlockedEffects: ['confetti'],
  equippedEffect: 'confetti',
};

