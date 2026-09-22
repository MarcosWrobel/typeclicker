import { useEffect, useRef, useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import { GameState } from '../types';
import { saveProgressToCloud } from '../services/firebaseService';
import { saveState, getOfflineBufferKey, clearOfflineBuffer } from '../utils/storage';

export type SyncReason = 'levelup' | 'overclock' | 'manual' | 'session_end' | 'timer';

interface UseGameSyncOptions {
  user: User | null;
  state: GameState;
  onSyncSuccess?: () => void;
  onSyncError?: (errorMsg: string) => void;
  throttleIntervalMs?: number; // padrão 60000ms (60s) para conformidade com cota Spark
}

/**
 * Hook central de sincronização resiliente com Firestore (Otimizado para o Plano Spark):
 * 
 * 1. EQUILÍBRIO DE COTAS FIRESTORE SPARK (20.000 writes/dia):
 *    - Intervalo Periódico de 60 segundos (padrão):
 *      Em uma aula de 45 minutos (2.700s), cada aluno ativo gera ~45 escritas.
 *      Com 300 alunos simultâneos/dia: 300 * 45 = ~13.500 writes/dia, operando
 *      com margem segura de ~32% abaixo do teto de 20.000 gravações gratuitas.
 *    - Event-Driven Sincronizações Imediatas (syncNow):
 *      Disparos imediatos são restritos a eventos críticos:
 *      - Subida de Nível ('levelup')
 *      - Overclock / Prestige ('overclock')
 *      - Encerramento de Sessão / Logout ('session_end')
 *      - Gatilho explícito do usuário ('manual')
 *      Digitações normais de palavras NÃO disparam escritas imediatas, apenas
 *      atualizam o estado local e aguardam o ciclo periódico de 60s.
 * 
 * 2. ISOLAMENTO POR ALUNO (Máquinas Compartilhadas no Laboratório):
 *    - O buffer offline é indexado pelo UID do aluno autenticado (`typeclicker_offline_sync_buffer_${user.uid}`).
 *    - Se outro aluno fizer login no mesmo computador, os buffers não se misturam.
 * 
 * 3. FECHAMENTO DE ABA E TAMPA DE LAPTOP (beforeunload / pagehide / visibilitychange):
 *    - Por que não navigator.sendBeacon?
 *      O SDK cliente do Firebase Firestore se comunica via canal WebChannel / WebSocket proprietário
 *      com autenticação e serialização protobuf interna, não suportando um payload direto via sendBeacon.
 *    - Estratégia de Tolerância Zero a Perdas:
 *      Nos eventos `beforeunload`, `pagehide` e `visibilitychange` (ao fechar a tampa do laptop ou trocar de aba),
 *      o sistema executa a escrita SÍNCRONA do snapshot no `localStorage` isolado pelo UID do aluno (`typeclicker_save_${user.uid}`).
 *      Como o `localStorage` é síncrono, completa em <1ms antes da suspensão do processo.
 *    - Disparo Assíncrono Concomitante:
 *      Dispara `executeSync(true, 'session_end')`. Se a rede terminar o envio antes do encerramento,
 *      a nuvem é atualizada; se não, o buffer local é restaurado e enviado na próxima sessão.
 * 
 * 4. VISIBILIDADE DAS FLAGS ANTI-CHEAT:
 *    - O aluno NUNCA recebe alerta ou aviso de suspeita/bloqueio na tela. As flags são salvas silenciosamente
 *      no documento de save e visíveis exclusivamente no Painel Administrativo.
 */
export function useGameSync({
  user,
  state,
  onSyncSuccess,
  onSyncError,
  throttleIntervalMs = 60000
}: UseGameSyncOptions) {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [hasPendingChanges, setHasPendingChanges] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const stateRef = useRef<GameState>(state);
  stateRef.current = state;

  const userRef = useRef<User | null>(user);
  userRef.current = user;

  const lastSyncedStateRef = useRef<GameState | null>(null);
  const lastSyncTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isSyncInProgressRef = useRef<boolean>(false);
  const pendingSyncSnapshotRef = useRef<GameState | null>(null);

  // Buffer offline isolado para o aluno atual
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
      console.warn('Falha ao gravar buffer offline do aluno:', e);
    }
  }, []);

  // Limpa o buffer offline do aluno atual
  const clearCurrentOfflineBuffer = useCallback(() => {
    const currentUser = userRef.current;
    if (currentUser?.uid) {
      clearOfflineBuffer(currentUser.uid);
    }
  }, []);

  // Processa pendências do buffer offline quando a conexão retornar para o aluno atual
  const processOfflineQueue = useCallback(async () => {
    const currentUser = userRef.current;
    if (!currentUser?.uid || !navigator.onLine) return;

    try {
      const bufferKey = getOfflineBufferKey(currentUser.uid);
      const raw = localStorage.getItem(bufferKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Só sincroniza se o buffer pertencer exatamente ao aluno ativo
        if (parsed?.userId === currentUser.uid && parsed?.state) {
          const res = await saveProgressToCloud(parsed.state);
          if (res.success) {
            localStorage.removeItem(bufferKey);
          }
        }
      }

      // Remove resquício de chave genérica antiga se existir
      localStorage.removeItem('typeclicker_offline_sync_buffer');
    } catch (e) {
      console.warn('Erro ao processar fila offline do aluno:', e);
    }
  }, []);

  // Executa o envio em nuvem com cálculo de delta anti-cheat e proteção por mutex/fila
  const executeSync = useCallback(async (forced: boolean = false, reason: SyncReason = 'timer') => {
    const currentUser = userRef.current;
    if (!currentUser) return;

    // Mutex de concorrência: se já houver envio em trânsito, enfileira o snapshot mais recente
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
        const elapsedSeconds = Math.max(1, (now - lastSyncTimeRef.current) / 1000);

        // Se a máquina estiver offline, armazena no buffer local do aluno
        if (!navigator.onLine) {
          pushToOfflineBuffer(currentSnapshot);
          saveState(currentSnapshot, currentUser.uid);
          break;
        }

        try {
          const res = await saveProgressToCloud(currentSnapshot, lastSyncedStateRef.current, elapsedSeconds);
          if (res.success) {
            lastSyncedStateRef.current = { ...currentSnapshot };
            lastSyncTimeRef.current = now;
            setHasPendingChanges(false);
            clearCurrentOfflineBuffer();
            // Também atualiza o save local isolado do aluno
            saveState(currentSnapshot, currentUser.uid);
            onSyncSuccess?.();
          } else {
            pushToOfflineBuffer(currentSnapshot);
            saveState(currentSnapshot, currentUser.uid);
            onSyncError?.(res.message);
          }
        } catch (err: any) {
          pushToOfflineBuffer(currentSnapshot);
          saveState(currentSnapshot, currentUser.uid);
          onSyncError?.(err.message || 'Erro de conexão.');
        }

        // Se durante a transmissão acima chegou um novo snapshot, realiza nova iteração imediatamente
        if (!pendingSyncSnapshotRef.current) {
          keepRunning = false;
        }
      }
    } finally {
      isSyncInProgressRef.current = false;
      setIsSyncing(false);
    }
  }, [onSyncSuccess, onSyncError, pushToOfflineBuffer, clearCurrentOfflineBuffer]);

  // Monitora conectividade de rede
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      processOfflineQueue();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [processOfflineQueue]);

  // Quando o aluno autenticado mudar (ex: login/logout no computador do laboratório)
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

  // Sincronização imediata (Event-Driven: Level Up, Overclock, Logout, Botão Nuvem)
  const syncNow = useCallback((reason: SyncReason = 'manual') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    return executeSync(true, reason);
  }, [executeSync]);

  // Alias retrocompatível
  const triggerImmediateSync = useCallback((reason?: SyncReason) => {
    return syncNow(reason || 'manual');
  }, [syncNow]);

  // Agendador com Throttling / Debounce contínuo durante a atividade de digitação (ciclo de 60s)
  useEffect(() => {
    if (!user) return;

    setHasPendingChanges(true);

    if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        executeSync(false, 'timer');
      }, throttleIntervalMs);
    }

    return () => {
      // Deixa o timer fluir sem cancelar para garantir flush no ciclo configurado
    };
  }, [user, state.bytes, state.wordsCompleted, state.correctKeys, state.upgrades, executeSync, throttleIntervalMs]);

  // Eventos beforeunload, pagehide e visibilitychange:
  // Garante persistência síncrona local caso o aluno feche a aba ou a tampa do laptop
  useEffect(() => {
    const handleFlushOnExit = () => {
      const currentUser = userRef.current;
      if (!currentUser?.uid) return;

      // 1. Escrita síncrona no localStorage imediata (garantida mesmo em encerramento súbito)
      saveState(stateRef.current, currentUser.uid);
      pushToOfflineBuffer(stateRef.current);

      // 2. Disparo imediato se a rede estiver ativa
      if (navigator.onLine) {
        executeSync(true, 'session_end');
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Aluno fechou a tampa do laptop ou minimizou/trocou de aba
        handleFlushOnExit();
      }
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

  return {
    isSyncing,
    hasPendingChanges,
    isOnline,
    syncNow,
    triggerImmediateSync
  };
}
