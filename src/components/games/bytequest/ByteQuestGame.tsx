// ─────────────────────────────────────────────────────────────
// Componente Principal — ByteQuest: Masmorra de Sobrevivência
// Roguelite Combat Runner com Ação em Tempo Real e Digitação
// Contrato Oficial BaseGameProps integrado ao Hub de Produção
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BaseGameProps, GameExitPayload } from '../../../types/gamePlugin';
import { HeroLoadout, RpgItem, EquipmentSlot, RunUpgradeCard } from '../../../types/byteQuest';
import { RpgClassType } from '../../../types/rpgClass';
import { getStarterLoadout, BYTE_QUEST_ITEMS } from '../../../data/byteQuestItems';
import { ByteQuestSimulation, EngineStats } from './byteQuestEngine';
import { ByteQuestArenaCanvas } from './ByteQuestArenaCanvas';
import { ByteQuestHUD } from './ByteQuestHUD';
import { ByteQuestUpgradeModal } from './ByteQuestUpgradeModal';
import { ByteQuestRewardModal } from './ByteQuestRewardModal';
import { ByteQuestLobby } from './ByteQuestLobby';
import { byteQuestAudio } from './byteQuestAudio';

const SAVE_KEY = 'bytequest_progress_v1';

export interface ByteQuestSavedData {
  equipped: HeroLoadout;
  inventory: RpgItem[];
  highScore: number;
  maxTimeSurvived: number;
  totalBossesDefeated: number;
}

export const ByteQuestGame: React.FC<BaseGameProps> = ({
  studentClass = 'warrior',
  difficultyMultiplier = 1.0,
  onExitToHub
}) => {
  // ─── CLASSE SELECIONADA NO MENU PRÉ-JOGO ───
  // Permite selecionar livremente no lobby, independente da classe do Hub
  const [selectedClass, setSelectedClass] = useState<RpgClassType>(studentClass || 'warrior');

  // ─── ESTADOS DE TELA ───
  const [screen, setScreen] = useState<'lobby' | 'playing' | 'reward'>('lobby');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // ─── DADOS SALVOS DO JOGADOR ───
  const [playerData, setPlayerData] = useState<ByteQuestSavedData>(() => {
    try {
      const stored = localStorage.getItem(SAVE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}

    const starter = getStarterLoadout(studentClass || 'warrior');
    return {
      equipped: starter,
      inventory: [starter.weapon, starter.chest, starter.head, starter.accessory],
      highScore: 0,
      maxTimeSurvived: 0,
      totalBossesDefeated: 0
    };
  });

  // Saldo simulado para a forja no lobby
  const [sessionBytes, setSessionBytes] = useState<number>(1200);

  // ─── INSTÂNCIA DA SIMULAÇÃO ───
  const simRef = useRef<ByteQuestSimulation | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState<boolean>(false);
  const [currentLevelForUpgrade, setCurrentLevelForUpgrade] = useState<number>(1);
  const [rewardData, setRewardData] = useState<{
    isVictory: boolean;
    stats: EngineStats;
    bytesEarned: number;
  } | null>(null);

  // Troca de classe no menu pré-jogo com validação de equipamentos e inventário
  const handleSelectClass = (newClass: RpgClassType) => {
    setSelectedClass(newClass);
    const starter = getStarterLoadout(newClass);

    setPlayerData((prev) => {
      // Se a arma atual for restrita a outra classe, troca pela arma do novo arquétipo
      const currentWeapon = prev.equipped.weapon;
      const isWeaponValid = currentWeapon && (!currentWeapon.requiredClass || currentWeapon.requiredClass === newClass);

      const newEquipped = {
        ...prev.equipped,
        weapon: isWeaponValid ? currentWeapon : starter.weapon
      };

      // Garante que o inventário possua os itens básicos do novo arquétipo
      const newInventory = [...prev.inventory];
      [starter.weapon, starter.chest, starter.head, starter.accessory].forEach((item) => {
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

  // Salva no localStorage quando o inventário ou equipamento muda
  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(playerData));
    } catch {}
  }, [playerData]);

  // Cleanup de áudio ao desmontar
  useEffect(() => {
    return () => {
      byteQuestAudio.destroy();
    };
  }, []);

  /**
   * Inicia uma nova partida na arena com o arquétipo e loadout selecionados
   */
  const handleStartRun = useCallback(() => {
    const sim = new ByteQuestSimulation(selectedClass, playerData.equipped);

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
  }, [selectedClass, playerData.equipped]);

  /**
   * Conclusão da corrida (Vitória ou Derrota)
   */
  const finishRun = (isVictory: boolean, sim: ByteQuestSimulation) => {
    byteQuestAudio.stopBgm();
    setIsPaused(true);

    const stats = sim.stats;
    const baseBytes = stats.enemiesDefeated * 12 + stats.wordsTypedCount * 22;
    const victoryBonus = isVictory ? 600 : 80;
    const earned = Math.round((baseBytes + victoryBonus) * difficultyMultiplier);

    setSessionBytes((prev) => prev + earned);

    // Atualiza recordes
    setPlayerData((prev) => ({
      ...prev,
      highScore: Math.max(prev.highScore, stats.damageDealt),
      maxTimeSurvived: Math.max(prev.maxTimeSurvived, stats.timeSurvivedSeconds),
      totalBossesDefeated: prev.totalBossesDefeated + (isVictory ? 1 : 0)
    }));

    setRewardData({
      isVictory,
      stats,
      bytesEarned: earned
    });
    setScreen('reward');
  };

  /**
   * Captura global de teclado durante a batalha
   */
  useEffect(() => {
    if (screen !== 'playing' || isPaused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora atalhos de sistema com Control / Alt / Meta
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === 'Tab') return;

      const sim = simRef.current;
      if (!sim) return;

      // Previne a ativação do Quick Find (Pesquisa Rápida) no Zen Browser / Firefox
      if (e.key === '/') {
        e.preventDefault();
        e.stopPropagation();
        sim.handleKeyPress('/');
        return;
      }

      // Movimentação do Herói com as Setas do Teclado ou WASD
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        sim.handleDirectionKey(e.key, true);
        return;
      }

      // WASD para movimentação quando não estiver conjurando nem digitando em alvo travado
      if (['w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key) && !sim.spellBuffer && !sim.lockedEnemyId) {
        const hasEliteTargetMatch = sim.enemies.some(
          (en) => en.word && en.word.length > 0 && en.word[0].toLowerCase() === e.key.toLowerCase()
        );
        if (!hasEliteTargetMatch) {
          e.preventDefault();
          sim.handleDirectionKey(e.key, true);
          return;
        }
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        sim.handleKeyPress('Escape');
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        sim.handleKeyPress('Backspace');
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        sim.handleKeyPress(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const sim = simRef.current;
      if (!sim) return;

      if (e.key.startsWith('Arrow') || ['w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
        sim.handleDirectionKey(e.key, false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [screen, isPaused]);

  /**
   * Aplicação do upgrade escolhido
   */
  const handleSelectUpgrade = (upgrade: RunUpgradeCard) => {
    if (simRef.current) {
      simRef.current.applyUpgrade(upgrade.effectType, upgrade.value);
    }
    setUpgradeModalOpen(false);
    setIsPaused(false);
  };

  /**
   * Equipar / Desequipar itens no lobby
   */
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

  /**
   * Forja de itens no lobby com Bytes (estritamente restritos ao arquétipo selecionado)
   */
  const handleForgeItem = (cost: number): boolean => {
    if (sessionBytes < cost) return false;
    setSessionBytes((prev) => prev - cost);

    // Sorteia um item exclusivo para o arquétipo atual que o jogador ainda não possua
    const available = BYTE_QUEST_ITEMS.filter(
      (i) => (!i.requiredClass || i.requiredClass === selectedClass) && !playerData.inventory.some((inv) => inv.id === i.id)
    );
    const pool = available.length > 0
      ? available
      : BYTE_QUEST_ITEMS.filter((i) => !i.requiredClass || i.requiredClass === selectedClass);
    const forged = pool[Math.floor(Math.random() * pool.length)];

    setPlayerData((prev) => ({
      ...prev,
      inventory: [...prev.inventory, forged]
    }));

    byteQuestAudio.playChestOpen();
    return true;
  };

  /**
   * Saída normalizada para o Hub
   */
  const handleExitToHub = (lootItem?: RpgItem) => {
    byteQuestAudio.destroy();

    // Se ganhou um item no baú de recompensas, adiciona ao inventário permanente
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
          isVictory: rewardData?.isVictory ? 1 : 0
        }
      }
    };

    onExitToHub(payload);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#07080c] text-white flex flex-col justify-center items-center p-3 sm:p-6 overflow-hidden">
      {/* ─── TELA DO LOBBY ─── */}
      {screen === 'lobby' && (
        <ByteQuestLobby
          rpgClass={selectedClass}
          equipped={playerData.equipped}
          inventory={playerData.inventory}
          availableBytes={sessionBytes}
          onSelectClass={handleSelectClass}
          onEquipItem={handleEquipItem}
          onUnequipSlot={handleUnequipSlot}
          onForgeItem={handleForgeItem}
          onStartRun={handleStartRun}
          onExitToHub={() => handleExitToHub()}
        />
      )}

      {/* ─── TELA DE BATALHA (ARENA 60 FPS) ─── */}
      {screen === 'playing' && simRef.current && (
        <div className="relative w-full max-w-6xl xl:max-w-7xl h-[640px] max-h-[85vh] flex items-center justify-center">
          <ByteQuestArenaCanvas
            simulation={simRef.current}
            rpgClass={selectedClass}
            loadout={playerData.equipped}
            isPaused={isPaused}
          />
          <ByteQuestHUD
            simulation={simRef.current}
            isMuted={isMuted}
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
      )}

      {/* ─── MODAL DE LEVEL UP ─── */}
      {upgradeModalOpen && (
        <ByteQuestUpgradeModal
          currentLevel={currentLevelForUpgrade}
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
              simRef.current.isEndlessMode = true;
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
