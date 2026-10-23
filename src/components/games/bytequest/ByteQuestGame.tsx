// ─────────────────────────────────────────────────────────────
// Componente Principal — ByteQuest: Masmorra de Sobrevivência
// Roguelite Combat Runner com Ação em Tempo Real e Digitação
// Contrato Oficial BaseGameProps integrado ao Hub de Produção
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BaseGameProps, GameExitPayload } from '../../../types/gamePlugin';
import {
  HeroLoadout,
  RpgItem,
  EquipmentSlot,
  RunUpgradeCard,
  HeroSubclassId,
  TalentId,
  TALENT_DEFS,
  AiChipId,
  AI_CHIP_DEFS,
  CORRUPTION_TIERS,
  ACHIEVEMENT_DEFS,
  BiomeId
} from '../../../types/byteQuest';
import { RpgClassType } from '../../../types/rpgClass';
import { getStarterLoadout, forgeWeightedRandomItem, getItemDismantleValue } from '../../../data/byteQuestItems';
import { ByteQuestSimulation, EngineStats } from './byteQuestEngine';
import { ByteQuestPvPSimulation } from './byteQuestPvPEngine';
import { ByteQuestArenaCanvas } from './ByteQuestArenaCanvas';
import { ByteQuestHUD } from './ByteQuestHUD';
import { ByteQuestUpgradeModal } from './ByteQuestUpgradeModal';
import { ByteQuestRewardModal } from './ByteQuestRewardModal';
import { ByteQuestLobby } from './ByteQuestLobby';
import { ByteQuestPvPLobby } from './ByteQuestPvPLobby';
import { byteQuestAudio } from './byteQuestAudio';
import { isAccentKey, resolveDeadKey, combineAccent } from '../../../utils/keyboardAccents';
import { ByteQuestPvPRoom } from '../../../types/byteQuestPvP';
import { connectByteQuestPvPBroadcast, finishByteQuestPvPMatch } from '../../../services/byteQuestPvPService';
import { auth } from '../../../services/firebaseService';

const SAVE_KEY = 'bytequest_progress_v1';

export interface ByteQuestSavedData {
  equipped: HeroLoadout;
  inventory: RpgItem[];
  bytesBalance?: number;
  highScore: number;
  maxTimeSurvived: number;
  totalBossesDefeated: number;
  subclassByClass?: Record<RpgClassType, HeroSubclassId>;
  talents?: Partial<Record<TalentId, number>>;
  unlockedAiChips?: AiChipId[];
  activeAiChips?: AiChipId[];
  corruptionTier?: number;
  startingBiome?: BiomeId;
  unlockedAchievements?: string[];
}

const DEFAULT_SUBCLASSES: Record<RpgClassType, HeroSubclassId> = {
  warrior: 'warrior_berserker',
  archer: 'archer_sniper',
  mage: 'mage_archmage'
};

export const ByteQuestGame: React.FC<BaseGameProps> = ({
  studentClass = 'warrior',
  difficultyMultiplier = 1.0,
  onExitToHub
}) => {
  const [selectedClass, setSelectedClass] = useState<RpgClassType>(studentClass || 'warrior');
  const [screen, setScreen] = useState<'lobby' | 'pvp_lobby' | 'playing' | 'reward'>('lobby');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [pendingAccent, setPendingAccent] = useState<string | null>(null);
  const pendingAccentRef = useRef<string | null>(null);

  // Estados & Referências de Rede PvP
  const [pvpRoom, setPvpRoom] = useState<ByteQuestPvPRoom | null>(null);
  const [pvpPlayerNum, setPvpPlayerNum] = useState<1 | 2>(1);
  const pvpBroadcastRef = useRef<{ send: (ev: string, payload: any) => void; disconnect: () => void } | null>(null);
  const pvpSyncIntervalRef = useRef<number | null>(null);

  const [playerData, setPlayerData] = useState<ByteQuestSavedData>(() => {
    const starter = getStarterLoadout(studentClass || 'warrior');
    try {
      const stored = localStorage.getItem(SAVE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const equipped: HeroLoadout = {
          weapon: parsed.equipped?.weapon || starter.weapon,
          chest: parsed.equipped?.chest || starter.chest,
          head: parsed.equipped?.head || starter.head,
          boots: parsed.equipped?.boots || starter.boots,
          accessory: parsed.equipped?.accessory || starter.accessory,
          relic: parsed.equipped?.relic || starter.relic
        };
        const inv: RpgItem[] = Array.isArray(parsed.inventory) ? [...parsed.inventory] : [];
        [starter.weapon, starter.chest, starter.head, starter.boots, starter.accessory, starter.relic].forEach((st) => {
          if (!inv.some((i) => i.id === st.id)) inv.push(st);
        });
        return {
          ...parsed,
          equipped,
          inventory: inv,
          bytesBalance: typeof parsed.bytesBalance === 'number' ? parsed.bytesBalance : 1200,
          subclassByClass: parsed.subclassByClass || DEFAULT_SUBCLASSES,
          talents: parsed.talents || {},
          unlockedAiChips: parsed.unlockedAiChips || ['chip_auto_shield_low_hp', 'chip_auto_ult_full_energy'],
          activeAiChips: parsed.activeAiChips || ['chip_auto_shield_low_hp'],
          corruptionTier: parsed.corruptionTier ?? 0,
          startingBiome: parsed.startingBiome || 'crypt',
          unlockedAchievements: parsed.unlockedAchievements || []
        };
      }
    } catch {}

    return {
      equipped: starter,
      inventory: [starter.weapon, starter.chest, starter.head, starter.boots, starter.accessory, starter.relic],
      bytesBalance: 1200,
      highScore: 0,
      maxTimeSurvived: 0,
      totalBossesDefeated: 0,
      subclassByClass: DEFAULT_SUBCLASSES,
      talents: {},
      unlockedAiChips: ['chip_auto_shield_low_hp', 'chip_auto_ult_full_energy'],
      activeAiChips: ['chip_auto_shield_low_hp'],
      corruptionTier: 0,
      startingBiome: 'crypt',
      unlockedAchievements: []
    };
  });

  const sessionBytes = playerData.bytesBalance ?? 1200;
  const activeSubclass = (playerData.subclassByClass || DEFAULT_SUBCLASSES)[selectedClass] || DEFAULT_SUBCLASSES[selectedClass];

  const simRef = useRef<ByteQuestSimulation | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState<boolean>(false);
  const [currentLevelForUpgrade, setCurrentLevelForUpgrade] = useState<number>(1);
  const [rewardData, setRewardData] = useState<{
    isVictory: boolean;
    stats: EngineStats;
    bytesEarned: number;
  } | null>(null);

  const handleSelectClass = (newClass: RpgClassType) => {
    setSelectedClass(newClass);
    const starter = getStarterLoadout(newClass);

    setPlayerData((prev) => {
      const currentWeapon = prev.equipped.weapon;
      const isWeaponValid = currentWeapon && (!currentWeapon.requiredClass || currentWeapon.requiredClass === newClass);

      const newEquipped: HeroLoadout = {
        ...prev.equipped,
        weapon: isWeaponValid ? currentWeapon : starter.weapon,
        boots: prev.equipped.boots || starter.boots,
        relic: prev.equipped.relic || starter.relic
      };

      const newInventory = [...prev.inventory];
      [starter.weapon, starter.chest, starter.head, starter.boots, starter.accessory, starter.relic].forEach((item) => {
        if (!newInventory.some((inv) => inv.id === item.id)) {
          newInventory.push(item);
        }
      });

      return {
        ...prev,
        equipped: newEquipped,
        inventory: newInventory
      };
    });
  };

  const handleSelectSubclass = (subclass: HeroSubclassId) => {
    setPlayerData((prev) => ({
      ...prev,
      subclassByClass: {
        ...(prev.subclassByClass || DEFAULT_SUBCLASSES),
        [selectedClass]: subclass
      }
    }));
  };

  const handleUpgradeTalent = (talentId: TalentId) => {
    const def = TALENT_DEFS.find((t) => t.id === talentId);
    if (!def) return;
    const curLvl = playerData.talents?.[talentId] || 0;
    if (curLvl >= def.maxLevel) return;
    const cost = def.baseCost + curLvl * def.costStep;
    if (sessionBytes < cost) return;

    setPlayerData((prev) => ({
      ...prev,
      bytesBalance: (prev.bytesBalance ?? 1200) - cost,
      talents: {
        ...(prev.talents || {}),
        [talentId]: curLvl + 1
      }
    }));
    byteQuestAudio.playLevelUp();
  };

  const handleToggleAiChip = (chipId: AiChipId) => {
    const def = AI_CHIP_DEFS.find((c) => c.id === chipId);
    if (!def) return;
    const unlocked = playerData.unlockedAiChips || [];
    const active = playerData.activeAiChips || [];

    if (!unlocked.includes(chipId)) {
      if (sessionBytes < def.unlockCost) return;
      setPlayerData((prev) => ({
        ...prev,
        bytesBalance: (prev.bytesBalance ?? 1200) - def.unlockCost,
        unlockedAiChips: [...(prev.unlockedAiChips || []), chipId],
        activeAiChips: (prev.activeAiChips || []).length < 2 ? [...(prev.activeAiChips || []), chipId] : prev.activeAiChips
      }));
      byteQuestAudio.playLevelUp();
      return;
    }

    if (active.includes(chipId)) {
      setPlayerData((prev) => ({
        ...prev,
        activeAiChips: (prev.activeAiChips || []).filter((id) => id !== chipId)
      }));
    } else {
      setPlayerData((prev) => {
        const cur = prev.activeAiChips || [];
        const next = cur.length >= 2 ? [cur[1], chipId] : [...cur, chipId];
        return {
          ...prev,
          activeAiChips: next
        };
      });
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(playerData));
    } catch {}
  }, [playerData]);

  useEffect(() => {
    return () => {
      byteQuestAudio.destroy();
      if (pvpSyncIntervalRef.current) {
        clearInterval(pvpSyncIntervalRef.current);
      }
      if (pvpBroadcastRef.current) {
        pvpBroadcastRef.current.disconnect();
      }
    };
  }, []);

  const handleStartRun = useCallback(() => {
    const sim = new ByteQuestSimulation(selectedClass, playerData.equipped, {
      subclass: activeSubclass,
      talents: playerData.talents || {},
      activeAiChips: playerData.activeAiChips || [],
      corruptionTier: playerData.corruptionTier ?? 0,
      startingBiome: playerData.startingBiome || 'crypt'
    });

    const savedMousePref = typeof window !== 'undefined' ? localStorage.getItem('bytequest_mouse_control') : null;
    if (savedMousePref !== null) {
      sim.setMouseMoveEnabled(savedMousePref === 'true');
    }

    sim.onLevelUp = () => {
      setIsPaused(true);
      setCurrentLevelForUpgrade(sim.stats.level);
      setUpgradeModalOpen(true);
    };

    sim.onGameOver = () => {
      finishRun(false, sim);
    };

    sim.onVictory = () => {
      finishRun(true, sim);
    };

    simRef.current = sim;
    setScreen('playing');
    setIsPaused(false);
    setRewardData(null);
    byteQuestAudio.startBgm();
  }, [selectedClass, playerData.equipped, activeSubclass, playerData.talents, playerData.activeAiChips, playerData.corruptionTier, playerData.startingBiome]);

  const finishRun = (isVictory: boolean, sim: ByteQuestSimulation) => {
    byteQuestAudio.stopBgm();
    setIsPaused(true);

    const stats = sim.stats;
    const corruptionMult = CORRUPTION_TIERS[sim.corruptionTier || 0]?.bytesMultiplier || 1.0;
    const bountyTalentMult = 1 + ((playerData.talents?.bounty_hunter || 0) * 0.15);
    const baseBytes = stats.enemiesDefeated * 12 + stats.wordsTypedCount * 22 + (stats.bonusBytesEarned || 0);
    const victoryBonus = isVictory ? 600 : 80;
    const earned = Math.round((baseBytes + victoryBonus) * difficultyMultiplier * corruptionMult * bountyTalentMult);

    setPlayerData((prev) => {
      const currentAchievements = new Set(prev.unlockedAchievements || []);
      let achievementRewardBytes = 0;

      const checkUnlock = (id: string, condition: boolean) => {
        if (condition && !currentAchievements.has(id)) {
          currentAchievements.add(id);
          const def = ACHIEVEMENT_DEFS.find((a) => a.id === id);
          if (def) achievementRewardBytes += def.rewardBytes;
        }
      };

      const hasSupremeEvo =
        sim.upgrades.weaponBoomerangLevel >= 5 ||
        sim.upgrades.weaponTurretLevel >= 5 ||
        sim.upgrades.weaponFireAuraLevel >= 5 ||
        sim.upgrades.weaponHomingMissilesLevel >= 5;

      checkUnlock('ach_first_boss', isVictory || prev.totalBossesDefeated > 0);
      checkUnlock('ach_combo_30', sim.maxTypingCombo >= 30);
      checkUnlock('ach_supreme_weapon', hasSupremeEvo);
      checkUnlock('ach_goblin_hunter', (stats.goblinsDefeated || 0) >= 1);
      checkUnlock('ach_torment_1', isVictory && (sim.corruptionTier || 0) >= 1);
      checkUnlock('ach_torment_3', isVictory && (sim.corruptionTier || 0) >= 3);
      checkUnlock('ach_endless_10m', stats.timeSurvivedSeconds >= 600);

      // Se coletou baús na arena, converte cada baú em um item aleatório adicional no inventário
      const newInv = [...prev.inventory];
      const chestsCount = stats.chestsCollected || 0;
      for (let c = 0; c < chestsCount; c++) {
        const ownedIds = newInv.map((i) => i.id);
        const { item: chestLoot } = forgeWeightedRandomItem(selectedClass, ownedIds);
        if (!newInv.some((i) => i.id === chestLoot.id)) {
          newInv.push(chestLoot);
        }
      }

      return {
        ...prev,
        inventory: newInv,
        bytesBalance: (prev.bytesBalance ?? 1200) + earned + achievementRewardBytes,
        highScore: Math.max(prev.highScore, stats.damageDealt),
        maxTimeSurvived: Math.max(prev.maxTimeSurvived, stats.timeSurvivedSeconds),
        totalBossesDefeated: prev.totalBossesDefeated + (isVictory ? 1 : 0),
        unlockedAchievements: Array.from(currentAchievements)
      };
    });

    setRewardData({
      isVictory,
      stats,
      bytesEarned: earned
    });
    setScreen('reward');
  };

  const finishPvPRun = useCallback(
    (isVictory: boolean, winnerUid: string, sim: ByteQuestPvPSimulation, roomId?: string) => {
      byteQuestAudio.stopBgm();
      setIsPaused(true);

      if (pvpSyncIntervalRef.current) {
        clearInterval(pvpSyncIntervalRef.current);
        pvpSyncIntervalRef.current = null;
      }
      if (pvpBroadcastRef.current) {
        pvpBroadcastRef.current.disconnect();
        pvpBroadcastRef.current = null;
      }

      if (roomId) {
        finishByteQuestPvPMatch(roomId, winnerUid);
      }

      const earned = isVictory ? 750 : 200;
      setPlayerData((prev) => ({
        ...prev,
        bytesBalance: (prev.bytesBalance ?? 1200) + earned
      }));

      setRewardData({
        isVictory,
        stats: sim.stats,
        bytesEarned: earned
      });
      setScreen('reward');
    },
    []
  );

  const handleStartPvPMatch = useCallback(
    (room: ByteQuestPvPRoom, playerNum: 1 | 2) => {
      setPvpRoom(room);
      setPvpPlayerNum(playerNum);

      const userUid =
        auth.currentUser?.uid ||
        (playerNum === 1 ? room.player1.uid : room.player2?.uid || 'guest');
      const isHost = playerNum === 1;

      // Instanciação 100% Neutra com a classe espelho sorteada
      const pvpSim = new ByteQuestPvPSimulation(room.sharedClass, userUid, isHost);

      const savedMousePref =
        typeof window !== 'undefined' ? localStorage.getItem('bytequest_mouse_control') : null;
      if (savedMousePref !== null) {
        pvpSim.setMouseMoveEnabled(savedMousePref === 'true');
      }

      pvpSim.onLevelUp = () => {
        pvpSim.stats.level++;
        pvpSim.upgrades.damageBonus += 8;
        pvpSim.upgrades.speedBonus += 1.5;
        pvpSim.stats.maxHp += 15;
        pvpSim.stats.hp = Math.min(pvpSim.stats.maxHp, pvpSim.stats.hp + 20);
        pvpSim.addFloatingText(pvpSim.heroX, pvpSim.heroY - 50, '⚡ NÍVEL UP! (+DANO & +VIDA)', '#FACC15', true);
        byteQuestAudio.playLevelUp();
      };

      // Conexão Broadcast em tempo real
      const broadcast = connectByteQuestPvPBroadcast(room.id, (event, payload) => {
        const activeSim = simRef.current as ByteQuestPvPSimulation | null;
        if (!activeSim) return;

        if (event === 'sync_pos') {
          if (payload.uid !== activeSim.localUid) {
            activeSim.handleRemoteSync(payload);
          }
        } else if (event === 'pvp_hit') {
          if (payload.targetUid === activeSim.localUid) {
            activeSim.receivePvPHit(payload.damage, payload.isCrit, payload.isWordBreak);
          }
        } else if (event === 'gem_collected') {
          activeSim.gems = activeSim.gems.filter((g) => g.id !== payload.gemId);
        }
      });

      pvpBroadcastRef.current = broadcast;
      pvpSim.onBroadcastSend = (ev, payload) => {
        broadcast.send(ev, payload);
      };

      pvpSim.onPvPVictory = (winnerUid) => {
        finishPvPRun(true, winnerUid, pvpSim, room.id);
      };

      pvpSim.onPvPDefeat = () => {
        const winnerUid = isHost ? room.player2?.uid || 'rival' : room.player1.uid;
        finishPvPRun(false, winnerUid, pvpSim, room.id);
      };

      // Loop de sincronização periódica a 20Hz (50ms)
      if (pvpSyncIntervalRef.current) clearInterval(pvpSyncIntervalRef.current);
      pvpSyncIntervalRef.current = window.setInterval(() => {
        const s = simRef.current as ByteQuestPvPSimulation | null;
        if (!s || s.stats.hp <= 0) return;
        broadcast.send('sync_pos', {
          uid: s.localUid,
          x: s.heroX,
          y: s.heroY,
          vx: s.heroVx,
          vy: s.heroVy,
          facing: s.heroFacing,
          hp: s.stats.hp,
          maxHp: s.stats.maxHp,
          shieldHp: s.stats.shieldHp,
          level: s.stats.level,
          currentXp: s.stats.currentXp,
          nextLevelXp: s.stats.nextLevelXp,
          isAttacking: s.heroAttackTimer > 0,
          attackAngle: s.heroAttackAngle,
          isDashing: s.isDashing,
          wordToHack: s.opponentWord
        });
      }, 50);

      simRef.current = pvpSim;
      setSelectedClass(room.sharedClass);
      setScreen('playing');
      setIsPaused(false);
      setRewardData(null);
      byteQuestAudio.startBgm();
    },
    [finishPvPRun]
  );

  useEffect(() => {
    if (screen !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === 'Tab') return;

      const sim = simRef.current;
      if (!sim) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        if (sim.spellBuffer.length > 0 || sim.lockedEnemyId || sim.lockedShrineId) {
          sim.handleKeyPress('Escape');
        } else {
          setIsPaused((prev) => {
            const next = !prev;
            if (next) {
              byteQuestAudio.stopBgm();
            } else {
              byteQuestAudio.startBgm();
            }
            return next;
          });
        }
        return;
      }

      if (isPaused || upgradeModalOpen) return;

      // 1. Teclas mortas (Dead) e acentos isolados (~, ´, ^, `, etc.)
      if (e.key === 'Dead' || isAccentKey(e.key)) {
        e.preventDefault();
        let expectedChar: string | undefined;
        if (sim.lockedEnemyId) {
          const target = sim.enemies.find((en) => en.id === sim.lockedEnemyId);
          if (target) expectedChar = target.word[target.wordTyped.length];
        } else if (sim.lockedShrineId) {
          const targetS = sim.shrines.find((s) => s.id === sim.lockedShrineId);
          if (targetS) expectedChar = targetS.word[targetS.wordTyped.length];
        }
        const resolved = resolveDeadKey(e, expectedChar) || (e.key === '~' ? '~' : e.key === '^' ? '^' : '´');
        setPendingAccent(resolved);
        pendingAccentRef.current = resolved;
        return;
      }

      // Backspace ou Escape: se houver acento pendente, cancela o acento
      if (e.key === 'Escape' || e.key === 'Backspace') {
        if (pendingAccentRef.current) {
          e.preventDefault();
          setPendingAccent(null);
          pendingAccentRef.current = null;
          return;
        }
        if (e.key === 'Backspace') {
          e.preventDefault();
          sim.handleKeyPress('Backspace');
          return;
        }
      }

      if (e.key === '/') {
        e.preventDefault();
        e.stopPropagation();
        sim.handleKeyPress('/');
        return;
      }

      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        sim.executeMobility();
        return;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        sim.handleDirectionKey(e.key, true);
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        let charToProcess = e.key;
        if (pendingAccentRef.current) {
          charToProcess = combineAccent(pendingAccentRef.current, e.key);
          setPendingAccent(null);
          pendingAccentRef.current = null;
        }

        // Se for modo PvP e estiver na fase de Duelo, tenta hackear a palavra do oponente primeiro
        if ('handlePvPTypingKey' in sim && (sim as any).pvpPhase === 'pvp') {
          const handled = (sim as any).handlePvPTypingKey(charToProcess);
          if (handled) return;
        }

        sim.handleKeyPress(charToProcess);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const sim = simRef.current;
      if (!sim) return;

      if (e.key.startsWith('Arrow')) {
        sim.handleDirectionKey(e.key, false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [screen, isPaused, upgradeModalOpen]);

  const handleSelectUpgrade = (upgrade: RunUpgradeCard) => {
    if (simRef.current) {
      simRef.current.applyUpgrade(upgrade.effectType, upgrade.value);
      if (upgrade.level === 5 && upgrade.effectType.startsWith('weapon_')) {
        byteQuestAudio.playSupremeEvolution();
      } else {
        byteQuestAudio.playLevelUp();
      }
    }
    setUpgradeModalOpen(false);
    setIsPaused(false);
  };

  const handleEquipItem = (item: RpgItem) => {
    setPlayerData((prev) => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        [item.slot]: item
      }
    }));
  };

  const handleUnequipSlot = (slot: EquipmentSlot) => {
    setPlayerData((prev) => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        [slot]: undefined
      }
    }));
  };

  const handleUpgradeItem = (slot: EquipmentSlot) => {
    const item = playerData.equipped[slot];
    if (!item) return;
    const currentLvl = item.upgradeLevel || 0;
    if (currentLvl >= 5) return;
    const cost = 200 * (currentLvl + 1);
    if (sessionBytes < cost) return;

    const upgradedItem: RpgItem = {
      ...item,
      upgradeLevel: currentLvl + 1
    };

    setPlayerData((prev) => ({
      ...prev,
      bytesBalance: (prev.bytesBalance ?? 1200) - cost,
      equipped: {
        ...prev.equipped,
        [slot]: upgradedItem
      },
      inventory: prev.inventory.map((inv) => (inv.id === item.id ? upgradedItem : inv))
    }));

    byteQuestAudio.playLevelUp();
  };

  const handleForgeItem = (cost: number): { success: boolean; item?: RpgItem; rarity?: string } => {
    if (sessionBytes < cost) return { success: false };

    const ownedIds = playerData.inventory.map((inv) => inv.id);
    const { item: forged, rollRarity } = forgeWeightedRandomItem(selectedClass, ownedIds);

    setPlayerData((prev) => {
      const currentAchievements = new Set(prev.unlockedAchievements || []);
      let bonusAch = 0;
      if (forged.rarity === 'quantum' && !currentAchievements.has('ach_quantum_item')) {
        currentAchievements.add('ach_quantum_item');
        bonusAch = 500;
      }
      return {
        ...prev,
        bytesBalance: (prev.bytesBalance ?? 1200) - cost + bonusAch,
        inventory: prev.inventory.some((i) => i.id === forged.id) ? prev.inventory : [...prev.inventory, forged],
        unlockedAchievements: Array.from(currentAchievements)
      };
    });

    byteQuestAudio.playChestOpen();
    return { success: true, item: forged, rarity: rollRarity };
  };

  const handleDismantleItem = (item: RpgItem) => {
    const isEquipped = Object.values(playerData.equipped).some((e) => e?.id === item.id);
    if (isEquipped) {
      alert('Desequipe o item antes de desmantelá-lo!');
      return;
    }

    const refund = getItemDismantleValue(item.rarity);

    setPlayerData((prev) => ({
      ...prev,
      bytesBalance: (prev.bytesBalance ?? 1200) + refund,
      inventory: prev.inventory.filter((i) => i.id !== item.id)
    }));

    byteQuestAudio.playTypeHit();
  };

  const handleExitToHub = (lootItem?: RpgItem) => {
    byteQuestAudio.destroy();

    if (lootItem) {
      setPlayerData((prev) => {
        if (prev.inventory.some((i) => i.id === lootItem.id)) return prev;
        return {
          ...prev,
          inventory: [...prev.inventory, lootItem]
        };
      });
    }

    const stats = rewardData?.stats || simRef.current?.stats;
    const finalBytes = rewardData?.bytesEarned || 0;
    const accuracy = stats && stats.keysTyped > 0 ? Math.round((stats.keysCorrect / stats.keysTyped) * 100) : 100;
    const timeSpent = stats ? Math.round(stats.timeSurvivedSeconds) : 0;

    const payload: GameExitPayload = {
      bytesEarned: finalBytes,
      levelTokensEarned: rewardData?.isVictory || (accuracy >= 80 && timeSpent >= 90) ? 1 : 0,
      sessionStats: {
        score: stats ? stats.damageDealt : 0,
        accuracyPercentage: accuracy,
        timeSpentSeconds: timeSpent,
        correctAnswers: stats ? stats.wordsTypedCount : 0,
        wrongAnswers: stats ? Math.max(0, stats.keysTyped - stats.keysCorrect) : 0,
        levelReached: stats ? stats.level : 1,
        extraMetrics: {
          enemiesDefeated: stats ? stats.enemiesDefeated : 0,
          criticalHits: stats ? stats.criticalHits : 0,
          highestWave: simRef.current ? simRef.current.getCurrentPhase() : 1,
          timeSurvivedSeconds: stats ? Math.round(stats.timeSurvivedSeconds) : 0,
          isVictory: rewardData?.isVictory ? 1 : 0
        }
      }
    };

    onExitToHub(payload);
  };

  return (
    <div className={`relative w-full min-h-screen bg-[#07080c] text-white flex flex-col items-center overflow-hidden ${
      screen === 'playing' ? 'p-1.5 sm:p-2 justify-start' : 'p-3 sm:p-6 justify-center'
    }`}>
      {/* ─── TELA DO LOBBY ─── */}
      {screen === 'lobby' && (
        <ByteQuestLobby
          rpgClass={selectedClass}
          equipped={playerData.equipped}
          inventory={playerData.inventory}
          availableBytes={sessionBytes}
          selectedSubclass={activeSubclass}
          talents={playerData.talents || {}}
          unlockedAiChips={playerData.unlockedAiChips || []}
          activeAiChips={playerData.activeAiChips || []}
          corruptionTier={playerData.corruptionTier ?? 0}
          startingBiome={playerData.startingBiome || 'crypt'}
          unlockedAchievements={playerData.unlockedAchievements || []}
          onSelectClass={handleSelectClass}
          onSelectSubclass={handleSelectSubclass}
          onUpgradeTalent={handleUpgradeTalent}
          onToggleAiChip={handleToggleAiChip}
          onSelectCorruptionTier={(tier) => setPlayerData((p) => ({ ...p, corruptionTier: tier }))}
          onSelectStartingBiome={(biome) => setPlayerData((p) => ({ ...p, startingBiome: biome }))}
          onEquipItem={handleEquipItem}
          onUnequipSlot={handleUnequipSlot}
          onUpgradeItem={handleUpgradeItem}
          onForgeItem={handleForgeItem}
          onDismantleItem={handleDismantleItem}
          onStartRun={handleStartRun}
          onStartPvP={() => setScreen('pvp_lobby')}
          onExitToHub={() => handleExitToHub()}
        />
      )}

      {/* ─── LOBBY MULTIPLAYER 1V1 BATTLE ROYALE ─── */}
      {screen === 'pvp_lobby' && (
        <ByteQuestPvPLobby
          currentUser={{
            uid: auth.currentUser?.uid || 'player_guest',
            name: auth.currentUser?.displayName || 'Jogador Conectado',
            nickname: auth.currentUser?.displayName?.split(' ')[0] || 'Guerreiro',
            avatar: '🤖'
          }}
          onBackToMenu={() => setScreen('lobby')}
          onStartMatch={handleStartPvPMatch}
        />
      )}

      {/* ─── TELA DE BATALHA (ARENA 60 FPS EXPANDIDA EM TELA CHEIA) ─── */}
      {screen === 'playing' && simRef.current && (
        <>
          <div className="relative w-full max-w-[1720px] 2xl:max-w-[1920px] h-[calc(100vh-68px)] min-h-[640px] max-h-[92vh] flex items-center justify-center">
          <ByteQuestArenaCanvas
            simulation={simRef.current}
            rpgClass={selectedClass}
            loadout={playerData.equipped}
            isPaused={isPaused}
          />

          {/* Overlay de Pausa Visual quando pausado manualmente */}
          {isPaused && !upgradeModalOpen && (
            <div className="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-xl">
              <div className="px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold tracking-widest uppercase">
                Jogo Pausado
              </div>
              <h2 className="text-3xl font-black font-mono text-white tracking-wider">
                PARTIDA EM PAUSA
              </h2>
              <p className="text-xs font-mono text-zinc-400 max-w-sm text-center">
                A simulação e o relógio da masmorra estão paralisados. Pressione Continuar para retomar o combate.
              </p>
              <button
                onClick={() => {
                  setIsPaused(false);
                  byteQuestAudio.startBgm();
                }}
                className="mt-2 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-sm shadow-lg shadow-amber-950/60 hover:scale-105 transition-all cursor-pointer"
              >
                <span>CONTINUAR PARTIDA</span>
              </button>
            </div>
          )}

          <ByteQuestHUD
            simulation={simRef.current}
            isMuted={isMuted}
            isPaused={isPaused}
            pendingAccent={pendingAccent}
            onTogglePause={() => {
              setIsPaused((prev) => {
                const next = !prev;
                if (next) {
                  byteQuestAudio.stopBgm();
                } else {
                  byteQuestAudio.startBgm();
                }
                return next;
              });
            }}
            onToggleMute={() => {
              const muted = byteQuestAudio.toggleMute();
              setIsMuted(muted);
            }}
            onExit={() => {
              if (simRef.current) {
                finishRun(false, simRef.current);
              } else {
                setScreen('lobby');
              }
            }}
          />
        </div>

        {/* ─── INFORMAÇÕES DE COMO JOGAR FORA DO CANVAS DE JOGO ─── */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5 text-xs font-mono text-zinc-400 bg-zinc-950/80 px-4 py-1.5 rounded-xl border border-zinc-800/80 shadow">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Use <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-violet-300 border border-zinc-700">Setas</kbd> para andar • <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-cyan-300 border border-zinc-700">ESPAÇO</kbd> Mobilidade • Digite para golpear • <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-amber-300 border border-zinc-700">/</kbd> Magias</span>
        </div>
      </>
      )}

      {/* ─── MODAL DE LEVEL UP ─── */}
      {upgradeModalOpen && (
        <ByteQuestUpgradeModal
          currentLevel={currentLevelForUpgrade}
          rpgClass={selectedClass}
          upgradeLevels={simRef.current?.upgradeLevels}
          onSelectUpgrade={handleSelectUpgrade}
        />
      )}

      {/* ─── TELA DE RECOMPENSAS / VITÓRIA / DERROTA ─── */}
      {screen === 'reward' && rewardData && (
        <ByteQuestRewardModal
          isVictory={rewardData.isVictory}
          stats={rewardData.stats}
          bytesEarned={rewardData.bytesEarned}
          onContinueInfinite={() => {
            if (simRef.current) {
              simRef.current.continueEndlessMode();
              setScreen('playing');
              setIsPaused(false);
              byteQuestAudio.startBgm();
            }
          }}
          onGoToLobby={(lootItem) => {
            if (lootItem) {
              setPlayerData((prev) => ({
                ...prev,
                inventory: prev.inventory.some((i) => i.id === lootItem.id) ? prev.inventory : [...prev.inventory, lootItem]
              }));
            }
            setScreen('lobby');
          }}
          onExitToHub={(lootItem) => handleExitToHub(lootItem)}
        />
      )}
    </div>
  );
};

export default ByteQuestGame;
