import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { getGlobalLeaderboard, LeaderboardEntry, isStaffMember } from '../services/firebaseService';
import { LeaderboardMetric } from '../components/LeaderboardModal';

const METRIC_ORDER: LeaderboardMetric[] = ['level', 'wpm', 'combo', 'bytes', 'pvp', 'races'];
const ROTATION_INTERVAL_SEC = 12; // 12 segundos por ranking (custo zero de banco)
const CLOUD_SYNC_INTERVAL_SEC = 180; // 3 minutos para nova consulta ao Firestore (Spark-Safe)

export interface UseLeaderboardPodiumReturn {
  currentMetric: LeaderboardMetric;
  top3: LeaderboardEntry[];
  rotationRemaining: number;
  rotationProgress: number; // 0 a 100%
  syncRemaining: number;
  isLoading: boolean;
  isPaused: boolean;
  togglePause: () => void;
  nextMetric: () => void;
  prevMetric: () => void;
  setMetric: (metric: LeaderboardMetric) => void;
  refreshNow: () => Promise<void>;
}

export function useLeaderboardPodium(): UseLeaderboardPodiumReturn {
  const [metricIndex, setMetricIndex] = useState<number>(0);
  const [allPlayers, setAllPlayers] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [rotationRemaining, setRotationRemaining] = useState<number>(ROTATION_INTERVAL_SEC);
  const [syncRemaining, setSyncRemaining] = useState<number>(CLOUD_SYNC_INTERVAL_SEC);

  const isPausedRef = useRef<boolean>(isPaused);
  isPausedRef.current = isPaused;

  const currentMetric = METRIC_ORDER[metricIndex] || 'level';

  // Carregamento de dados com tratamento estrito de staff
  const loadData = useCallback(async (force: boolean = false) => {
    try {
      setIsLoading(true);
      const data = await getGlobalLeaderboard(force);
      const cleanStudents = data.filter((p) => !isStaffMember(p));
      setAllPlayers(cleanStudents);
      setSyncRemaining(CLOUD_SYNC_INTERVAL_SEC);
    } catch (err) {
      console.warn('Falha ao carregar dados do pódio:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // Navegação manual de métrica
  const nextMetric = useCallback(() => {
    setMetricIndex((prev) => (prev + 1) % METRIC_ORDER.length);
    setRotationRemaining(ROTATION_INTERVAL_SEC);
  }, []);

  const prevMetric = useCallback(() => {
    setMetricIndex((prev) => (prev - 1 + METRIC_ORDER.length) % METRIC_ORDER.length);
    setRotationRemaining(ROTATION_INTERVAL_SEC);
  }, []);

  const setMetric = useCallback((metric: LeaderboardMetric) => {
    const idx = METRIC_ORDER.indexOf(metric);
    if (idx >= 0) {
      setMetricIndex(idx);
      setRotationRemaining(ROTATION_INTERVAL_SEC);
    }
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const refreshNow = useCallback(async () => {
    await loadData(true);
  }, [loadData]);

  // Timer de Rotação Visual (1s tick) + Timer de Sincronização Cloud
  useEffect(() => {
    const interval = setInterval(() => {
      // Congela timers se a aba estiver oculta para economizar CPU e requisições
      if (typeof document !== 'undefined' && document.hidden) {
        return;
      }

      // 1. Contador de Sincronização Cloud (3 minutos)
      setSyncRemaining((prev) => {
        if (prev <= 1) {
          // Dispara busca silenciosa em segundo plano
          loadData(false);
          return CLOUD_SYNC_INTERVAL_SEC;
        }
        return prev - 1;
      });

      // 2. Contador de Rotação Visual (12 segundos)
      if (!isPausedRef.current) {
        setRotationRemaining((prev) => {
          if (prev <= 1) {
            setMetricIndex((curr) => (curr + 1) % METRIC_ORDER.length);
            return ROTATION_INTERVAL_SEC;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [loadData]);

  // Pré-computa o Top 3 para cada métrica em memória
  const top3ByMetric = useMemo(() => {
    const map: Record<LeaderboardMetric, LeaderboardEntry[]> = {
      level: [],
      wpm: [],
      combo: [],
      bytes: [],
      pvp: [],
      races: []
    };

    if (allPlayers.length === 0) return map;

    // 1. Nível & XP
    map.level = [...allPlayers]
      .sort((a, b) => (b.level || 0) - (a.level || 0) || (b.points || 0) - (a.points || 0))
      .slice(0, 3);

    // 2. Velocidade PPM
    map.wpm = [...allPlayers]
      .sort((a, b) => {
        const wpmA = a.bestWpm || a.wpm || 0;
        const wpmB = b.bestWpm || b.wpm || 0;
        if (wpmB !== wpmA) return wpmB - wpmA;
        return (b.accuracy || 0) - (a.accuracy || 0);
      })
      .slice(0, 3);

    // 3. Maior Combo
    map.combo = [...allPlayers]
      .sort((a, b) => {
        const comboA = a.maxCombo || 0;
        const comboB = b.maxCombo || 0;
        if (comboB !== comboA) return comboB - comboA;
        return (b.accuracy || 0) - (a.accuracy || 0);
      })
      .slice(0, 3);

    // 4. Total de Bytes
    map.bytes = [...allPlayers]
      .sort((a, b) => (b.points || 0) - (a.points || 0) || (b.level || 0) - (a.level || 0))
      .slice(0, 3);

    // 5. Duelos PvP
    map.pvp = [...allPlayers]
      .sort((a, b) => {
        const winsA = a.pvpWins || 0;
        const winsB = b.pvpWins || 0;
        if (winsB !== winsA) return winsB - winsA;
        const ptsA = a.pvpPoints || 0;
        const ptsB = b.pvpPoints || 0;
        return ptsB - ptsA;
      })
      .slice(0, 3);

    // 6. Corridas da Turma
    map.races = [...allPlayers]
      .sort((a, b) => {
        const winsA = a.raceWins || 0;
        const winsB = b.raceWins || 0;
        if (winsB !== winsA) return winsB - winsA;
        return (b.bestRaceWpm || 0) - (a.bestRaceWpm || 0);
      })
      .slice(0, 3);

    return map;
  }, [allPlayers]);

  const top3 = top3ByMetric[currentMetric] || [];
  const rotationProgress = Math.max(0, Math.min(100, ((ROTATION_INTERVAL_SEC - rotationRemaining) / ROTATION_INTERVAL_SEC) * 100));

  return {
    currentMetric,
    top3,
    rotationRemaining,
    rotationProgress,
    syncRemaining,
    isLoading,
    isPaused,
    togglePause,
    nextMetric,
    prevMetric,
    setMetric,
    refreshNow
  };
}
