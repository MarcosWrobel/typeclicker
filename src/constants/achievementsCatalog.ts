import { AchievementDef } from '../types/achievements';
import { calculatePlayerRank } from '../utils/formatting';

export const ACHIEVEMENTS_CATALOG: AchievementDef[] = [
  // --- A. VELOCIDADE & PRECISÃO ---
  {
    id: 'first_keystroke',
    title: 'Primeiro Toque',
    description: 'Digite sua primeira tecla correta no terminal.',
    category: 'speed',
    icon: '⚡',
    reward: { bytes: 10 },
    maxProgress: 1,
    evaluate: (s) => ({
      unlocked: s.correctKeys >= 1,
      currentProgress: Math.min(s.correctKeys, 1)
    })
  },
  {
    id: 'combo_25',
    title: 'Ritmo Inicial',
    description: 'Atinja um combo de 25 caracteres sem errar.',
    category: 'speed',
    icon: '🔥',
    reward: { bytes: 50 },
    maxProgress: 25,
    evaluate: (s) => ({
      unlocked: s.maxCombo >= 25 || s.comboStreak >= 25,
      currentProgress: Math.min(Math.max(s.maxCombo, s.comboStreak), 25)
    })
  },
  {
    id: 'combo_50',
    title: 'Em Estado de Fluxo',
    description: 'Atinja um combo de 50 caracteres sem errar.',
    category: 'speed',
    icon: '✨',
    reward: { bytes: 150 },
    maxProgress: 50,
    evaluate: (s) => ({
      unlocked: s.maxCombo >= 50 || s.comboStreak >= 50,
      currentProgress: Math.min(Math.max(s.maxCombo, s.comboStreak), 50)
    })
  },
  {
    id: 'combo_100',
    title: 'Velocidade Supersônica',
    description: 'Atinja a marca de 100 de combo sem errar nenhuma tecla.',
    category: 'speed',
    icon: '🌪️',
    reward: { bytes: 500 },
    maxProgress: 100,
    evaluate: (s) => ({
      unlocked: s.maxCombo >= 100 || s.comboStreak >= 100,
      currentProgress: Math.min(Math.max(s.maxCombo, s.comboStreak), 100)
    })
  },
  {
    id: 'combo_250',
    title: 'Mãos Divinas',
    description: 'Atinja um combo lendário de 250 caracteres sem falhas.',
    category: 'speed',
    icon: '👑',
    reward: { bytes: 2000, levelTokens: 1 },
    maxProgress: 250,
    evaluate: (s) => ({
      unlocked: s.maxCombo >= 250 || s.comboStreak >= 250,
      currentProgress: Math.min(Math.max(s.maxCombo, s.comboStreak), 250)
    })
  },
  {
    id: 'speed_50_ppm',
    title: 'Datilógrafo Veloz',
    description: 'Atinja 50 Palavras Por Minuto (PPM) de ritmo de digitação.',
    category: 'speed',
    icon: '🏎️',
    reward: { bytes: 250 },
    maxProgress: 50,
    evaluate: (s, ctx) => {
      const wpm = ctx?.wpm ?? (s.totalActiveSeconds > 5 ? Math.round((s.correctKeys / 5) / (s.totalActiveSeconds / 60)) : 0);
      return {
        unlocked: wpm >= 50,
        currentProgress: Math.min(wpm, 50)
      };
    }
  },
  {
    id: 'speed_100_ppm',
    title: 'Relâmpago Leopoldina',
    description: 'Ultrapasse a barreira de 100 Palavras Por Minuto (PPM).',
    category: 'speed',
    icon: '⚡',
    reward: { bytes: 1000, levelTokens: 1 },
    maxProgress: 100,
    evaluate: (s, ctx) => {
      const wpm = ctx?.wpm ?? (s.totalActiveSeconds > 5 ? Math.round((s.correctKeys / 5) / (s.totalActiveSeconds / 60)) : 0);
      return {
        unlocked: wpm >= 100,
        currentProgress: Math.min(wpm, 100)
      };
    }
  },
  {
    id: 'accuracy_sharpshooter',
    title: 'Precisão Cirúrgica',
    description: 'Mantenha precisão acima de 98% com mais de 500 teclas corretas digitadas.',
    category: 'speed',
    icon: '🎯',
    reward: { bytes: 300 },
    maxProgress: 500,
    evaluate: (s) => {
      const total = s.correctKeys + s.wrongKeys;
      const acc = total > 0 ? (s.correctKeys / total) * 100 : 0;
      return {
        unlocked: s.correctKeys >= 500 && acc >= 98,
        currentProgress: Math.min(s.correctKeys, 500)
      };
    }
  },

  // --- B. VOLUME & DEDICAÇÃO ---
  {
    id: 'words_10',
    title: 'Primeiras Palavras',
    description: 'Digite 10 palavras completas com sucesso.',
    category: 'volume',
    icon: '📝',
    reward: { bytes: 25 },
    maxProgress: 10,
    evaluate: (s) => ({
      unlocked: s.wordsCompleted >= 10,
      currentProgress: Math.min(s.wordsCompleted, 10)
    })
  },
  {
    id: 'words_100',
    title: 'Centenário',
    description: 'Complete 100 palavras no terminal.',
    category: 'volume',
    icon: '📚',
    reward: { bytes: 250 },
    maxProgress: 100,
    evaluate: (s) => ({
      unlocked: s.wordsCompleted >= 100,
      currentProgress: Math.min(s.wordsCompleted, 100)
    })
  },
  {
    id: 'words_500',
    title: 'Romancista Digital',
    description: 'Complete 500 palavras no total.',
    category: 'volume',
    icon: '📖',
    reward: { bytes: 1000 },
    maxProgress: 500,
    evaluate: (s) => ({
      unlocked: s.wordsCompleted >= 500,
      currentProgress: Math.min(s.wordsCompleted, 500)
    })
  },
  {
    id: 'words_2000',
    title: 'Biblioteca Viva',
    description: 'Complete 2.000 palavras no total.',
    category: 'volume',
    icon: '🏛️',
    reward: { bytes: 5000, levelTokens: 2 },
    maxProgress: 2000,
    evaluate: (s) => ({
      unlocked: s.wordsCompleted >= 2000,
      currentProgress: Math.min(s.wordsCompleted, 2000)
    })
  },
  {
    id: 'keystrokes_1000',
    title: 'Mil Toques',
    description: 'Acumule 1.000 teclas corretas digitadas.',
    category: 'volume',
    icon: '⌨️',
    reward: { bytes: 100 },
    maxProgress: 1000,
    evaluate: (s) => ({
      unlocked: s.correctKeys >= 1000,
      currentProgress: Math.min(s.correctKeys, 1000)
    })
  },
  {
    id: 'keystrokes_10000',
    title: 'Dez Mil Toques',
    description: 'Acumule 10.000 teclas corretas digitadas.',
    category: 'volume',
    icon: '🌟',
    reward: { bytes: 1500 },
    maxProgress: 10000,
    evaluate: (s) => ({
      unlocked: s.correctKeys >= 10000,
      currentProgress: Math.min(s.correctKeys, 10000)
    })
  },
  {
    id: 'level_10',
    title: 'Graduando Inicial',
    description: 'Alcance o Nível 10 no TypeClicker.',
    category: 'volume',
    icon: '🥉',
    reward: { bytes: 500 },
    maxProgress: 10,
    evaluate: (s) => {
      const lvl = calculatePlayerRank(s.totalBytesEarned).level;
      return {
        unlocked: lvl >= 10,
        currentProgress: Math.min(lvl, 10)
      };
    }
  },
  {
    id: 'level_25',
    title: 'Veterano da Turma',
    description: 'Alcance o Nível 25.',
    category: 'volume',
    icon: '🥈',
    reward: { bytes: 2000 },
    maxProgress: 25,
    evaluate: (s) => {
      const lvl = calculatePlayerRank(s.totalBytesEarned).level;
      return {
        unlocked: lvl >= 25,
        currentProgress: Math.min(lvl, 25)
      };
    }
  },
  {
    id: 'level_50',
    title: 'Mestre do Terminal',
    description: 'Alcance o Nível 50.',
    category: 'volume',
    icon: '🥇',
    reward: { bytes: 5000, levelTokens: 2 },
    maxProgress: 50,
    evaluate: (s) => {
      const lvl = calculatePlayerRank(s.totalBytesEarned).level;
      return {
        unlocked: lvl >= 50,
        currentProgress: Math.min(lvl, 50)
      };
    }
  },
  {
    id: 'level_100',
    title: 'Lenda Leopoldina',
    description: 'Alcance o lendário Nível Máximo 100!',
    category: 'volume',
    icon: '👑',
    reward: { bytes: 25000, quantumFragments: 10 },
    maxProgress: 100,
    evaluate: (s) => {
      const lvl = calculatePlayerRank(s.totalBytesEarned).level;
      return {
        unlocked: lvl >= 100,
        currentProgress: Math.min(lvl, 100)
      };
    }
  },

  // --- C. ECONOMIA & UPGRADES ---
  {
    id: 'first_upgrade',
    title: 'Automatização',
    description: 'Compre seu primeiro upgrade no painel de melhorias.',
    category: 'economy',
    icon: '⚙️',
    reward: { bytes: 50 },
    maxProgress: 1,
    evaluate: (s) => {
      const total = Object.values(s.upgrades || {}).reduce((a, b) => a + b, 0);
      return {
        unlocked: total >= 1,
        currentProgress: Math.min(total, 1)
      };
    }
  },
  {
    id: 'upgrades_10',
    title: 'Linha de Montagem',
    description: 'Adquira um total de 10 upgrades de qualquer tipo.',
    category: 'economy',
    icon: '🏭',
    reward: { bytes: 500 },
    maxProgress: 10,
    evaluate: (s) => {
      const total = Object.values(s.upgrades || {}).reduce((a, b) => a + b, 0);
      return {
        unlocked: total >= 10,
        currentProgress: Math.min(total, 10)
      };
    }
  },
  {
    id: 'millionaire',
    title: 'Milionário dos Bytes',
    description: 'Acumule um total de 1.000.000 Bytes ganhos no histórico.',
    category: 'economy',
    icon: '💰',
    reward: { bytes: 5000 },
    maxProgress: 1000000,
    evaluate: (s) => ({
      unlocked: s.totalBytesEarned >= 1000000,
      currentProgress: Math.min(s.totalBytesEarned, 1000000)
    })
  },
  {
    id: 'billionaire',
    title: 'Bilionário de Dados',
    description: 'Acumule um total de 1.000.000.000 Bytes ganhos no histórico.',
    category: 'economy',
    icon: '💎',
    reward: { bytes: 50000, levelTokens: 5 },
    maxProgress: 1000000000,
    evaluate: (s) => ({
      unlocked: s.totalBytesEarned >= 1000000000,
      currentProgress: Math.min(s.totalBytesEarned, 1000000000)
    })
  },
  {
    id: 'first_prestige',
    title: 'Salto Quântico',
    description: 'Realize o primeiro Prestígio Quântico e forje Núcleos Quânticos.',
    category: 'economy',
    icon: '🌌',
    reward: { bytes: 2500 },
    maxProgress: 1,
    evaluate: (s) => {
      const hasPrestige = (s.prestigeCount || 0) >= 1 || (s.prestigeCores || 0) >= 1;
      return {
        unlocked: hasPrestige,
        currentProgress: hasPrestige ? 1 : 0
      };
    }
  },

  // --- D. PEDAGOGIA & REABILITAÇÃO ---
  {
    id: 'first_focus_drill',
    title: 'Calibração Concluída',
    description: 'Conclua uma sessão de emergência no Modo Foco para destravar o terminal.',
    category: 'pedagogy',
    icon: '🔧',
    reward: { bytes: 200 },
    maxProgress: 1,
    evaluate: (s) => {
      const count = s.focusDrillsCompleted || 0;
      return {
        unlocked: count >= 1,
        currentProgress: Math.min(count, 1)
      };
    }
  },
  {
    id: 'focus_master',
    title: 'Anti-Gargalo',
    description: 'Conclua 5 sessões de calibração do Modo Foco com sucesso.',
    category: 'pedagogy',
    icon: '🛡️',
    reward: { bytes: 1000 },
    maxProgress: 5,
    evaluate: (s) => {
      const count = s.focusDrillsCompleted || 0;
      return {
        unlocked: count >= 5,
        currentProgress: Math.min(count, 5)
      };
    }
  },
  {
    id: 'drill_session_complete',
    title: 'Reabilitação Focada',
    description: 'Conclua uma sessão completa do Treino Corretivo Adaptativo.',
    category: 'pedagogy',
    icon: '🎯',
    reward: { bytes: 300 },
    maxProgress: 1,
    evaluate: (s) => {
      const count = s.completedDrillSessions || 0;
      return {
        unlocked: count >= 1,
        currentProgress: Math.min(count, 1)
      };
    }
  },
  {
    id: 'all_categories_tried',
    title: 'Poliglota de Teclas',
    description: 'Pratique em todas as 5 categorias de palavras (Iniciante até Expert).',
    category: 'pedagogy',
    icon: '🌐',
    reward: { bytes: 500 },
    maxProgress: 5,
    evaluate: (s) => {
      const count = s.categoriesExplored?.length || 1;
      return {
        unlocked: count >= 5,
        currentProgress: Math.min(count, 5)
      };
    }
  },

  // --- E. COLEÇÃO, DESAFIOS & DUELOS ---
  {
    id: 'first_cosmetic',
    title: 'Estilo Próprio',
    description: 'Desbloqueie seu primeiro item cosmético na Loja do Laboratório.',
    category: 'collection',
    icon: '🎨',
    reward: { bytes: 150 },
    maxProgress: 1,
    evaluate: (s) => {
      const c = s.cosmetics;
      if (!c) return { unlocked: false, currentProgress: 0 };
      const totalUnlocked =
        (c.unlockedThemes?.length || 1) +
        (c.unlockedSkins?.length || 1) +
        (c.unlockedLayouts?.length || 1) +
        (c.unlockedSounds?.length || 1) +
        (c.unlockedAnimations?.length || 1);
      const customCount = Math.max(0, totalUnlocked - 5);
      return {
        unlocked: customCount >= 1,
        currentProgress: Math.min(customCount, 1)
      };
    }
  },
  {
    id: 'boss_hunter',
    title: 'Caçador de Chefes',
    description: 'Vença 3 desafios de Boss de Nível contra o relógio.',
    category: 'collection',
    icon: '⚔️',
    reward: { bytes: 2500, levelTokens: 2 },
    maxProgress: 3,
    evaluate: (s) => {
      const completed = s.completedChallenges?.length || 0;
      return {
        unlocked: completed >= 3,
        currentProgress: Math.min(completed, 3)
      };
    }
  },
  {
    id: 'duel_victor',
    title: 'Gladiador Leopoldina',
    description: 'Vença seu primeiro duelo na Arena 1v1 Multiplayer.',
    category: 'collection',
    icon: '🏟️',
    reward: { bytes: 1000 },
    maxProgress: 1,
    evaluate: (s) => {
      const wins = s.arenaStats?.wins || 0;
      return {
        unlocked: wins >= 1,
        currentProgress: Math.min(wins, 1)
      };
    }
  },

  // --- F. SECRETAS / EASTER EGGS ---
  {
    id: 'mascot_friend',
    title: 'Amigo do Bytezinho',
    description: 'Interaja clicando no mascote Bytezinho 10 vezes.',
    category: 'secret',
    isSecret: true,
    hint: 'O mascote parece gostar de companhia... Tente conversar com ele repetidas vezes.',
    icon: '🤖',
    reward: { bytes: 300 },
    maxProgress: 10,
    evaluate: (s) => {
      const clicks = s.mascotClicks || 0;
      return {
        unlocked: clicks >= 10,
        currentProgress: Math.min(clicks, 10)
      };
    }
  },
  {
    id: 'perfectionist',
    title: 'Perfeccionista Nato',
    description: 'Complete 20 palavras seguidas sem errar nenhum caractere.',
    category: 'secret',
    isSecret: true,
    hint: 'A maestria reside na calma absoluta: sequência perfeita sem tropeços no teclado.',
    icon: '💎',
    reward: { bytes: 1000 },
    maxProgress: 20,
    evaluate: (s) => {
      const streak = s.perfectWordsStreak || 0;
      return {
        unlocked: streak >= 20,
        currentProgress: Math.min(streak, 20)
      };
    }
  }
];
