import { GameState } from '../types';
import { DEFAULT_COSMETICS, PlayerCosmetics } from '../types/cosmetics';
import { ArenaStats } from '../types/arena';

const DEFAULT_STORAGE_KEY = 'typeclicker_save_v1';

export const DEFAULT_ARENA_STATS: ArenaStats = {
  matchesPlayed: 0,
  wins: 0,
  losses: 0,
  highestWpm: 0,
  duelPoints: 0,
  currentRankId: 'recruta'
};

export function getUserSaveKey(userId?: string | null): string {
  if (userId && userId.trim()) {
    return `typeclicker_save_${userId.trim()}`;
  }
  return DEFAULT_STORAGE_KEY;
}

export function getOfflineBufferKey(userId?: string | null): string {
  if (userId && userId.trim()) {
    return `typeclicker_offline_sync_buffer_${userId.trim()}`;
  }
  return 'typeclicker_offline_sync_buffer';
}

export const INITIAL_STATE: GameState = {
  bytes: 0,
  totalBytesEarned: 0,
  bytesPerChar: 1,
  autoBytesPerSec: 0,
  comboStreak: 0,
  maxCombo: 0,
  multiplier: 1.0,
  correctKeys: 0,
  wrongKeys: 0,
  wordsCompleted: 0,
  totalActiveSeconds: 0,
  prestigeCores: 0,
  prestigeCount: 0,
  upgrades: {},
  selectedCategory: 'iniciante',
  soundEnabled: true,
  studentName: '',
  studentNickname: '',
  studentClass: '',
  studentAvatar: '🐧',
  completedChallenges: [],
  cosmetics: { ...DEFAULT_COSMETICS },
  arenaStats: { ...DEFAULT_ARENA_STATS }
};

const VALID_CATEGORIES = ['iniciante', 'facil', 'medio', 'avancado', 'expert'];

export function sanitizeCosmetics(rawCosmetics?: Partial<PlayerCosmetics> | null): PlayerCosmetics {
  if (!rawCosmetics || typeof rawCosmetics !== 'object') {
    return { ...DEFAULT_COSMETICS };
  }

  const validThemes = [
    'matrix',
    'dracula',
    'amber',
    'cyberpunk',
    'monokai',
    'synthwave',
    'solarized_dark',
    'nordic_ice',
    'lava_terminal',
    'golden_luxury',
    'stealth_mono',
    'sith_darkside',
    'super_saiyan',
    'nether_magma',
    'spider_verse'
  ];
  const validSkins = [
    'classic',
    'cyber',
    'retro_8bit',
    'hoodie_hacker',
    'wizard',
    'astronaut',
    'ninja',
    'steampunk',
    'golden_king',
    'diver',
    'robot_mecha',
    'jedi_master',
    'miner_diamond',
    'saiyan_warrior',
    'arachnid_hero'
  ];
  const validSounds = [
    'mechanical',
    'retro_beep',
    'typewriter',
    'soft_click',
    'lightsaber_clash',
    'pixel_block_jump',
    'ki_blast'
  ];

  const validAnimations = [
    'confetti_classic',
    'golden_coins',
    'matrix_stream',
    'supernova_burst',
    'tesla_lightning',
    'volcano_flame',
    'cyber_neon',
    'pixel_retro',
    'fireworks_show',
    'bubble_magic',
    'hyperspace_warp',
    'kamehameha_energy',
    'diamond_rain'
  ];

  const validLayouts = [
    'default_terminal',
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
    'mushroom_kingdom'
  ];

  const unlockedLayouts = Array.isArray(rawCosmetics.unlockedLayouts) && rawCosmetics.unlockedLayouts.length > 0
    ? Array.from(new Set(['default_terminal', ...rawCosmetics.unlockedLayouts.filter(l => validLayouts.includes(l as any))])) as any
    : ['default_terminal'];

  const equippedLayout = (rawCosmetics.equippedLayout && unlockedLayouts.includes(rawCosmetics.equippedLayout))
    ? rawCosmetics.equippedLayout
    : 'default_terminal';

  const unlockedThemes = Array.isArray(rawCosmetics.unlockedThemes) && rawCosmetics.unlockedThemes.length > 0
    ? Array.from(new Set(['matrix', ...rawCosmetics.unlockedThemes.filter(t => validThemes.includes(t))])) as any
    : ['matrix'];

  const unlockedSkins = Array.isArray(rawCosmetics.unlockedSkins) && rawCosmetics.unlockedSkins.length > 0
    ? Array.from(new Set(['classic', ...rawCosmetics.unlockedSkins.filter(s => validSkins.includes(s))])) as any
    : ['classic'];

  const unlockedSounds = Array.isArray(rawCosmetics.unlockedSounds) && rawCosmetics.unlockedSounds.length > 0
    ? Array.from(new Set(['mechanical', ...rawCosmetics.unlockedSounds.filter(s => validSounds.includes(s))])) as any
    : ['mechanical'];

  // Migração suave de eventuais chaves legadas de efeitos
  const legacyAnimationMap: Record<string, string> = {
    'confetti': 'confetti_classic',
    'matrix_rain': 'matrix_stream',
    'glitch': 'cyber_neon'
  };

  const rawAnimationList = Array.isArray(rawCosmetics.unlockedAnimations)
    ? rawCosmetics.unlockedAnimations
    : Array.isArray(rawCosmetics.unlockedEffects)
    ? rawCosmetics.unlockedEffects.map(e => legacyAnimationMap[e] || e)
    : ['confetti_classic'];

  const unlockedAnimations = Array.from(
    new Set(['confetti_classic', ...rawAnimationList.map(a => legacyAnimationMap[a] || a).filter(a => validAnimations.includes(a))])
  ) as any;

  let rawEquippedAnimation = rawCosmetics.equippedAnimation;
  if (!rawEquippedAnimation && rawCosmetics.equippedEffect) {
    rawEquippedAnimation = legacyAnimationMap[rawCosmetics.equippedEffect] as any;
  }
  const equippedAnimation = (rawEquippedAnimation && unlockedAnimations.includes(rawEquippedAnimation))
    ? rawEquippedAnimation
    : 'confetti_classic';

  const equippedTheme = (rawCosmetics.equippedTheme && unlockedThemes.includes(rawCosmetics.equippedTheme))
    ? rawCosmetics.equippedTheme
    : 'matrix';

  const equippedSkin = (rawCosmetics.equippedSkin && unlockedSkins.includes(rawCosmetics.equippedSkin))
    ? rawCosmetics.equippedSkin
    : 'classic';

  const equippedSound = (rawCosmetics.equippedSound && unlockedSounds.includes(rawCosmetics.equippedSound))
    ? rawCosmetics.equippedSound
    : 'mechanical';

  const levelTokens = Number.isFinite(rawCosmetics.levelTokens) && (rawCosmetics.levelTokens as number) >= 0
    ? Math.floor(rawCosmetics.levelTokens as number)
    : 0;

  const duelTokens = Number.isFinite(rawCosmetics.duelTokens) && (rawCosmetics.duelTokens as number) >= 0
    ? Math.floor(rawCosmetics.duelTokens as number)
    : 0;

  return {
    levelTokens,
    duelTokens,
    unlockedLayouts,
    unlockedThemes,
    unlockedSkins,
    unlockedSounds,
    unlockedAnimations,
    equippedLayout,
    equippedTheme,
    equippedSkin,
    equippedSound,
    equippedAnimation
  };
}

export function loadSavedState(userId?: string | null): GameState {
  try {
    const key = getUserSaveKey(userId);
    let raw = localStorage.getItem(key);
    
    // Se não encontrou a chave do usuário mas for o primeiro acesso pós-migração,
    // verifica se existe save na chave genérica DEFAULT_STORAGE_KEY
    if (!raw && userId && key !== DEFAULT_STORAGE_KEY) {
      raw = localStorage.getItem(DEFAULT_STORAGE_KEY);
    }

    if (!raw) return { ...INITIAL_STATE };
    const parsed = JSON.parse(raw);

    // Mapeamento de retrocompatibilidade caso houvesse chave legada
    let category = parsed.selectedCategory;
    if (category === 'home-row' || category === 'easy') category = 'iniciante';
    else if (category === 'tech') category = 'medio';
    else if (category === 'accents') category = 'avancado';
    else if (category === 'mixed') category = 'facil';
    if (!VALID_CATEGORIES.includes(category)) {
      category = 'iniciante';
    }

    return {
      ...INITIAL_STATE,
      ...parsed,
      selectedCategory: category,
      // Garante sanitização de números
      bytes: Number.isFinite(parsed.bytes) ? parsed.bytes : 0,
      totalBytesEarned: Number.isFinite(parsed.totalBytesEarned) ? parsed.totalBytesEarned : 0,
      bytesPerChar: Number.isFinite(parsed.bytesPerChar) && parsed.bytesPerChar >= 1 ? parsed.bytesPerChar : 1,
      autoBytesPerSec: Number.isFinite(parsed.autoBytesPerSec) ? parsed.autoBytesPerSec : 0,
      comboStreak: 0, // Reinicia combo na reabertura
      multiplier: 1.0,
      upgrades: parsed.upgrades || {},
      completedChallenges: Array.isArray(parsed.completedChallenges) ? parsed.completedChallenges : [],
      cosmetics: sanitizeCosmetics(parsed.cosmetics),
      arenaStats: parsed.arenaStats && typeof parsed.arenaStats === 'object' ? {
        matchesPlayed: Number.isFinite(parsed.arenaStats.matchesPlayed) ? parsed.arenaStats.matchesPlayed : 0,
        wins: Number.isFinite(parsed.arenaStats.wins) ? parsed.arenaStats.wins : 0,
        losses: Number.isFinite(parsed.arenaStats.losses) ? parsed.arenaStats.losses : 0,
        highestWpm: Number.isFinite(parsed.arenaStats.highestWpm) ? parsed.arenaStats.highestWpm : 0,
        duelPoints: Number.isFinite(parsed.arenaStats.duelPoints) ? parsed.arenaStats.duelPoints : 0,
        currentRankId: typeof parsed.arenaStats.currentRankId === 'string' ? parsed.arenaStats.currentRankId : 'recruta'
      } : { ...DEFAULT_ARENA_STATS }
    };
  } catch (e) {
    console.warn('Falha ao carregar estado salvo:', e);
    return { ...INITIAL_STATE };
  }
}

export function saveState(state: GameState, userId?: string | null): boolean {
  try {
    const key = getUserSaveKey(userId);
    localStorage.setItem(key, JSON.stringify(state));
    return true;
  } catch (e) {
    console.warn('Falha ao salvar no localStorage:', e);
    return false;
  }
}

export function clearSavedState(userId?: string | null): void {
  try {
    const key = getUserSaveKey(userId);
    localStorage.removeItem(key);
    // Também limpa a chave genérica legada para evitar contaminação entre contas
    if (userId) {
      localStorage.removeItem(DEFAULT_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Falha ao limpar localStorage:', e);
  }
}

export function clearOfflineBuffer(userId?: string | null): void {
  try {
    const key = getOfflineBufferKey(userId);
    localStorage.removeItem(key);
    // Remove buffer genérico não-namespaced
    localStorage.removeItem('typeclicker_offline_sync_buffer');
  } catch (e) {
    console.warn('Falha ao limpar buffer offline:', e);
  }
}

export interface SaveResult {
  success: boolean;
  method: 'picker' | 'download' | 'cancelled';
  filename: string;
  folder: string;
  error?: string;
}

export async function saveProgressToMintFolder(state: GameState): Promise<SaveResult> {
  // 1. Sempre persiste no localStorage imediatamente
  saveState(state);

  const cleanName = ((state.studentNickname || state.studentName) || 'aluno').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanClass = (state.studentClass || 'geral').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `typeclicker_${cleanName}_${cleanClass}_${dateStr}.json`;
  const folder = 'Documentos/TypeClicker';
  const fileData = JSON.stringify(state, null, 2);

  // 2. Se o navegador suportar showSaveFilePicker (Chromium/Chrome no laboratório)
  // Permite sugerir 'documents' como diretório inicial de gravação
  if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
    try {
      const pickerOptions = {
        suggestedName: filename,
        startIn: 'documents',
        types: [
          {
            description: 'Arquivo de Progresso TypeClicker (.json)',
            accept: { 'application/json': ['.json'] }
          }
        ]
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handle = await (window as any).showSaveFilePicker(pickerOptions);
      const writable = await handle.createWritable();
      await writable.write(fileData);
      await writable.close();
      return { success: true, method: 'picker', filename, folder };
    } catch (err: any) {
      if (err && (err.name === 'AbortError' || err.message?.includes('abort'))) {
        return { success: false, method: 'cancelled', filename, folder };
      }
      console.warn('showSaveFilePicker não disponível ou recusado, acionando download:', err);
    }
  }

  // 3. Método padrão de Download seguro para qualquer navegador
  try {
    const blob = new Blob([fileData], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return { success: true, method: 'download', filename, folder };
  } catch (err: any) {
    console.error('Erro ao salvar arquivo de progresso:', err);
    return { success: false, method: 'download', filename, folder, error: String(err) };
  }
}

export function exportSaveToFile(state: GameState): void {
  saveProgressToMintFolder(state);
}

export const saveProgressToLabFolder = saveProgressToMintFolder;

export function parseSaveFile(content: string): Partial<GameState> | null {
  try {
    const parsed = JSON.parse(content);
    if (typeof parsed !== 'object' || parsed === null) return null;
    return parsed;
  } catch (e) {
    console.warn('Falha ao processar arquivo de save:', e);
    return null;
  }
}

