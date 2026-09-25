import { useEffect, useRef, useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import { GameState } from '../types';
import { saveState, getOfflineBufferKey, clearOfflineBuffer } from '../utils/storage';
import { dbService } from '../services/dbFactory';

export type SyncReason = 'levelup' | 'overclock' | 'manual' | 'session_end' | 'timer' | 'game_exit';

interface UseGameSyncOptions {
  user: User | null;
  state: GameState;
  onSyncSuccess?: () => void;
  onSyncError?: (errorMsg: string) => void;
  throttleIntervalMs?: number;
}

export function useGameSync({
  user,
  state,
  onSyncSuccess,
  onSyncError,
  throttleIntervalMs = 60000
}: UseGameSyncOptions) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const stateRef = useRef<GameState>(state);
  const userRef = useRef<User | null>(user);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const lastSyncedStateRef = useRef<GameState | null>(null);
  const lastSyncTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isSyncInProgressRef = useRef<boolean>(false);
  const pendingSyncSnapshotRef = useRef<GameState | null>(null);

  const pushToOfflineBuffer = useCallback((snapshot: GameState) => {
    const currentUser = userRef.current;
    if (!currentUser?.uid) return;

    try {
      const bufferKey = getOfflineBufferKey(currentUser.uid);
      localStorage.setItem(bufferKey, JSON.stringify({
        userId: currentUser.uid,
        state: snapshot,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Falha ao gravar buffer offline:', e);
    }
  }, []);

  const clearCurrentOfflineBuffer = useCallback(() => {
    const currentUser = userRef.current;
    if (currentUser?.uid) {
      clearOfflineBuffer(currentUser.uid);
    }
  }, []);

  const processOfflineQueue = useCallback(async () => {
    const currentUser = userRef.current;
    if (!currentUser?.uid || !navigator.onLine) return;

    try {
      const bufferKey = getOfflineBufferKey(currentUser.uid);
      const raw = localStorage.getItem(bufferKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.userId === currentUser.uid && parsed?.state) {
          try {
            await dbService.saveLegacyGameState(currentUser.uid, parsed.state);
            localStorage.removeItem(bufferKey);
          } catch (e) {
            console.warn('Erro ao sincronizar buffer offline no DB:', e);
          }
        }
      }
      localStorage.removeItem('typeclicker_offline_sync_buffer');
    } catch (e) {
      console.warn('Erro ao ler fila offline:', e);
    }
  }, []);

  const executeSync = useCallback(async (forced: boolean = false, reason: SyncReason = 'timer') => {
    const currentUser = userRef.current;
    if (!currentUser) return;

    if (isSyncInProgressRef.current) {
      pendingSyncSnapshotRef.current = { ...stateRef.current };
      return;
    }

    isSyncInProgressRef.current = true;
    setIsSyncing(true);

    try {
      let keepRunning = true;
      while (keepRunning) {
        const currentSnapshot = pendingSyncSnapshotRef.current || stateRef.current;
        pendingSyncSnapshotRef.current = null;

        const now = Date.now();

        if (!navigator.onLine) {
          pushToOfflineBuffer(currentSnapshot);
          saveState(currentSnapshot, currentUser.uid);
          break;
        }

        try {
          await dbService.saveLegacyGameState(currentUser.uid, currentSnapshot);
          
          lastSyncedStateRef.current = { ...currentSnapshot };
          lastSyncTimeRef.current = now;
          setHasPendingChanges(false);
          clearCurrentOfflineBuffer();
          saveState(currentSnapshot, currentUser.uid);
          onSyncSuccess?.();
        } catch (err: any) {
          pushToOfflineBuffer(currentSnapshot);
          saveState(currentSnapshot, currentUser.uid);
          onSyncError?.(err.message || 'Erro de conexão ou timeout do DB.');
        }

        if (!pendingSyncSnapshotRef.current) {
          keepRunning = false;
        }
      }
    } finally {
      isSyncInProgressRef.current = false;
      setIsSyncing(false);
    }
  }, [onSyncSuccess, onSyncError, pushToOfflineBuffer, clearCurrentOfflineBuffer]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      processOfflineQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [processOfflineQueue]);

  useEffect(() => {
    lastSyncedStateRef.current = null;
    lastSyncTimeRef.current = Date.now();
    isSyncInProgressRef.current = false;
    pendingSyncSnapshotRef.current = null;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setHasPendingChanges(false);

    if (user?.uid) {
      processOfflineQueue();
    }
  }, [user?.uid, processOfflineQueue]);

  const syncNow = useCallback((reason: SyncReason = 'manual') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    return executeSync(true, reason);
  }, [executeSync]);

  const triggerImmediateSync = useCallback((reason?: SyncReason) => syncNow(reason || 'manual'), [syncNow]);

  useEffect(() => {
    if (!user) return;
    setHasPendingChanges(true);

    if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        executeSync(false, 'timer');
      }, throttleIntervalMs);
    }

    return () => {}; // Deixa fluir para flush
  }, [user, state.bytes, state.wordsCompleted, state.correctKeys, state.upgrades, executeSync, throttleIntervalMs]);

  useEffect(() => {
    const handleFlushOnExit = () => {
      const currentUser = userRef.current;
      if (!currentUser?.uid) return;
      saveState(stateRef.current, currentUser.uid);
      pushToOfflineBuffer(stateRef.current);
      if (navigator.onLine) executeSync(true, 'session_end');
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') handleFlushOnExit();
    };

    window.addEventListener('beforeunload', handleFlushOnExit);
    window.addEventListener('pagehide', handleFlushOnExit);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleFlushOnExit);
      window.removeEventListener('pagehide', handleFlushOnExit);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [pushToOfflineBuffer, executeSync]);

  return { isSyncing, hasPendingChanges, isOnline, syncNow, triggerImmediateSync };
}
