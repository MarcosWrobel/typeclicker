export type CosmeticCurrency = 'tokens' | 'duel_coins' | 'quantum_fragments';
export type CosmeticRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'quantum';

export interface QuantumPrerequisite {
  minLevel: number;             // Ex: 100
  totalWordsTyped: number;      // Ex: 25.000+
  minAccuracyAvg: number;       // Ex: 95
  totalBytesEarned?: number;
}

export interface QuantumCosmeticItem {
  id: string;
  name: string;
  subtitle: string;
  archetype: string;
  description: string;
  category: 'layouts' | 'themes' | 'skins' | 'sounds' | 'animations';
  rarity: 'mythic' | 'quantum';
  price: number; // Em Fragmentos Quânticos (🌌)
  currency: CosmeticCurrency;
  currencyType?: 'quantum_fragment' | 'tokens' | 'duel_coins';
  badge: string;
  icon: string;
  prerequisites: QuantumPrerequisite;
  loreQuote: string;
}

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
  | 'spider_verse'
  // Novos Temas Míticos / Quânticos de Endgame (3ª Moeda 🌌)
  | 'infinite_void'
  | 'gear_second'
  | 'bad_time_retro'
  | 'sandevistan_overdrive'
  | 'sun_breathing'
  | 'electric_thunder'
  | 'serious_punch'
  | 'abyssal_vessel'
  | 'supersonic_speed'
  | 'dark_detective'
  // Temas Inspirados em Apps do Cotidiano dos Adolescentes
  | 'whatsapp_chat'
  | 'instagram_gradient'
  | 'youtube_creator'
  | 'tiktok_neon'
  | 'roblox_blocks';

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
  | 'arachnid_hero'
  // Novas Skins Míticas / Quânticas de Endgame (3ª Moeda 🌌)
  | 'blindfolded_sorcerer'
  | 'rubber_pirate'
  | 'hoodie_skeleton'
  | 'urban_cyborg'
  | 'demon_slayer'
  | 'electric_rodent'
  | 'bored_hero'
  | 'needle_knight'
  | 'supersonic_hedgehog'
  | 'shadow_crusader';

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
  | 'mushroom_kingdom'
  // Novos Layouts Míticos / Quânticos de Endgame (3ª Moeda 🌌)
  | 'infinite_void_realm'
  | 'pirate_deck'
  | 'judgment_hall'
  | 'edgerunner_rig'
  | 'slayer_dojo'
  | 'pocket_console'
  | 'manga_action'
  | 'hollow_ruins'
  | 'green_hills_zone'
  | 'bat_cave_tactical';

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
  | 'diamond_rain'
  // Novos Efeitos VFX Míticos / Quânticos de Endgame (3ª Moeda 🌌)
  | 'infinite_void_burst'
  | 'gear_second_steam'
  | 'gaster_bone_barrage'
  | 'sandevistan_afterimage'
  | 'water_flame_dragon'
  | 'thunder_storm_vfx'
  | 'serious_shockwave'
  | 'soul_vessel_burst'
  | 'golden_ring_burst'
  | 'bat_swarm_vfx';

export type LevelUpEffectId = 'confetti' | 'matrix_rain' | 'glitch';

export type KeySoundThemeId =
  | 'mechanical'
  | 'retro_beep'
  | 'typewriter'
  | 'soft_click'
  // Sons de Teclado da Cultura Pop (Arena 1x1)
  | 'lightsaber_clash'
  | 'pixel_block_jump'
  | 'ki_blast'
  // Novos Sons de Teclado Míticos / Quânticos de Endgame (3ª Moeda 🌌)
  | 'void_pulse'
  | 'rubber_gatling'
  | 'gaster_blaster'
  | 'sandevistan_click'
  | 'water_slash'
  | 'thunder_spark'
  | 'serious_strike'
  | 'soul_nail'
  | 'spin_dash'
  | 'sonar_batarang';

export interface PlayerCosmetics {
  levelTokens: number;
  duelTokens: number; // Moedas de Duelo (Arena Coins ⚔️)
  quantumFragments: number; // Fragmentos Quânticos / Matéria Escura (Endgame Lvl 100 🌌)
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
  quantumFragments: 0,
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

