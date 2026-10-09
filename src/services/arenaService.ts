import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  ArenaRoom,
  ArenaPlayer,
  ArenaAiDifficulty,
  ArenaAiProfile
} from '../types/arena';
import { WORD_CATEGORIES } from '../data/words';

export const ARENA_WORDS_PER_MATCH = 15;

export const AI_BOT_PROFILES: Record<ArenaAiDifficulty, ArenaAiProfile> = {
  mestre: {
    id: 'mestre',
    name: 'Bytezinho Mestre',
    avatar: '🤖',
    targetWpm: 60,
    accuracy: 96,
    title: 'Hacker Classe A'
  },
  grao_mestre: {
    id: 'grao_mestre',
    name: 'Bytezinho Cyber',
    avatar: '🦾',
    targetWpm: 80,
    accuracy: 98,
    title: 'Cibernético Overclock'
  },
  lendario: {
    id: 'lendario',
    name: 'Bytezinho Glitch 100',
    avatar: '⚡',
    targetWpm: 100,
    accuracy: 99,
    title: 'Quântico Lendário'
  }
};

/**
 * Gera um código curto de 5 caracteres amigável (ex: LEO42, CYB77, MNT99)
 */
export function generateRoomCode(): string {
  const prefixes = ['LEO', 'CYB', 'BIT', 'MNT', 'NEX', 'CPU', 'BOT', 'DEV'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${prefix}${num}`;
}

/**
 * Seleciona 15 palavras desafiadoras balanceadas para o duelo de Nível 100
 */
export function generateArenaWords(count: number = ARENA_WORDS_PER_MATCH): string[] {
  const pool: string[] = [];

  const techCat = WORD_CATEGORIES.find(c => c.id === 'medio');
  const advCat = WORD_CATEGORIES.find(c => c.id === 'avancado');
  const expertCat = WORD_CATEGORIES.find(c => c.id === 'expert');

  if (techCat) pool.push(...techCat.words);
  if (advCat) pool.push(...advCat.words);
  if (expertCat) pool.push(...expertCat.words);

  const filtered = pool.filter(w => w.length >= 5 && w.length <= 14);
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());

  if (shuffled.length >= count) {
    return shuffled.slice(0, count);
  }

  const fallback = [
    'algoritmo', 'blockchain', 'criptografia', 'desenvolvimento',
    'framework', 'hipertexto', 'inteligencia', 'javascript',
    'kernel', 'linguagem', 'microsservicos', 'navegador',
    'otimizacao', 'programacao', 'protocolo', 'recursividade'
  ];
  return fallback.slice(0, count);
}

/**
 * Cria uma nova sala de arena de duelo (PvP) no Supabase
 */
export async function createArenaRoom(
  player: ArenaPlayer,
  words: string[] = generateArenaWords()
): Promise<{ roomId: string; roomCode: string }> {
  const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const roomCode = generateRoomCode();

  const initialRoom: ArenaRoom = {
    id: roomId,
    roomCode,
    createdBy: player.uid,
    createdAt: Date.now(),
    status: 'waiting',
    words,
    player1: {
      ...player,
      ready: false,
      progress: 0,
      wpm: 0,
      accuracy: 100,
      wordsCompleted: 0
    }
  };

  if (isSupabaseConfigured) {
    const { error } = await supabase.from('arena_rooms').insert({
      id: roomId,
      room_type: 'duel',
      created_by: player.uid,
      status: 'waiting',
      data: initialRoom,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    if (error) {
      console.error('Erro ao criar sala de arena no Supabase:', error);
    }
  }

  return { roomId, roomCode };
}

/**
 * Busca por uma sala pública aberta criada nos últimos 3 minutos
 */
export async function findOpenArenaRoom(currentUid: string): Promise<ArenaRoom | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('arena_rooms')
      .select('id, data')
      .eq('room_type', 'duel')
      .eq('status', 'waiting')
      .gte('created_at', threeMinutesAgo)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error || !data) return null;

    for (const row of data) {
      const room = row.data as ArenaRoom;
      if (room && room.player1?.uid !== currentUid && !room.player2) {
        return { ...room, id: row.id };
      }
    }
    return null;
  } catch (err) {
    console.error('Erro ao procurar sala aberta na arena:', err);
    return null;
  }
}

/**
 * Entra em uma sala existente através do código digitado
 */
export async function joinArenaRoomByCode(roomCode: string, player: ArenaPlayer): Promise<ArenaRoom | null> {
  if (!isSupabaseConfigured) return null;

  const cleanCode = roomCode.trim().toUpperCase();
  const { data, error } = await supabase
    .from('arena_rooms')
    .select('id, data')
    .eq('room_type', 'duel')
    .eq('status', 'waiting')
    .filter('data->>roomCode', 'eq', cleanCode)
    .limit(1);

  if (error || !data || data.length === 0) {
    return null;
  }

  const row = data[0];
  const roomData = row.data as ArenaRoom;

  if (roomData.player1.uid === player.uid) {
    return { ...roomData, id: row.id };
  }

  if (roomData.player2 && roomData.player2.uid !== player.uid) {
    return null; // Sala cheia
  }

  const updatedPlayer2: ArenaPlayer = {
    ...player,
    ready: false,
    progress: 0,
    wpm: 0,
    accuracy: 100,
    wordsCompleted: 0
  };

  const updatedRoom: ArenaRoom = {
    ...roomData,
    id: row.id,
    player2: updatedPlayer2
  };

  await supabase
    .from('arena_rooms')
    .update({
      data: updatedRoom,
      updated_at: new Date().toISOString()
    })
    .eq('id', row.id);

  return updatedRoom;
}

/**
 * Alterna estado de "Pronto" do jogador e dispara contagem quando ambos estiverem prontos
 */
export async function setPlayerReady(
  roomId: string,
  playerNum: 1 | 2,
  ready: boolean
): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { data } = await supabase.from('arena_rooms').select('data').eq('id', roomId).single();
  if (!data?.data) return;

  const room = data.data as ArenaRoom;
  const isP1 = playerNum === 1;
  const p1Ready = isP1 ? ready : room.player1.ready;
  const p2Ready = !isP1 ? ready : (room.player2?.ready ?? false);

  const updatedRoom: ArenaRoom = {
    ...room,
    player1: isP1 ? { ...room.player1, ready } : room.player1,
    player2: room.player2 ? (!isP1 ? { ...room.player2, ready } : room.player2) : null
  };

  if (p1Ready && p2Ready && updatedRoom.player2 && updatedRoom.status === 'waiting') {
    updatedRoom.status = 'countdown';
    updatedRoom.countdownStartedAt = Date.now();
  }

  await supabase
    .from('arena_rooms')
    .update({
      status: updatedRoom.status,
      data: updatedRoom,
      updated_at: new Date().toISOString()
    })
    .eq('id', roomId);
}

/**
 * Transição de contagem regressiva para início oficial da partida
 */
export async function startArenaGame(roomId: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { data } = await supabase.from('arena_rooms').select('data').eq('id', roomId).single();
  if (!data?.data) return;

  const room = data.data as ArenaRoom;
  const updatedRoom: ArenaRoom = {
    ...room,
    status: 'in_progress',
    gameStartedAt: Date.now()
  };

  await supabase
    .from('arena_rooms')
    .update({
      status: 'in_progress',
      data: updatedRoom,
      updated_at: new Date().toISOString()
    })
    .eq('id', roomId);
}

/**
 * Atualiza o progresso de digitação de um jogador na sala em tempo real
 */
export async function updateArenaProgress(
  roomId: string,
  playerNum: 1 | 2,
  progress: number,
  wpm: number,
  accuracy: number,
  wordsCompleted: number
): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    const { data } = await supabase.from('arena_rooms').select('data').eq('id', roomId).single();
    if (!data?.data) return;

    const room = data.data as ArenaRoom;
    const isP1 = playerNum === 1;
    const targetPlayer = isP1 ? room.player1 : room.player2;
    if (!targetPlayer) return;

    const isCompleted = progress >= 100;
    const updatedPlayer: ArenaPlayer = {
      ...targetPlayer,
      progress: Math.min(100, Math.round(progress)),
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy),
      wordsCompleted
    };

    const updatedRoom: ArenaRoom = {
      ...room,
      player1: isP1 ? updatedPlayer : room.player1,
      player2: !isP1 && room.player2 ? updatedPlayer : room.player2
    };

    let newStatus = room.status;
    if (isCompleted && room.status === 'in_progress') {
      newStatus = 'finished';
      updatedRoom.status = 'finished';
      updatedRoom.winnerUid = targetPlayer.uid;
      updatedRoom.finishedAt = Date.now();
    }

    await supabase
      .from('arena_rooms')
      .update({
        status: newStatus,
        data: updatedRoom,
        updated_at: new Date().toISOString()
      })
      .eq('id', roomId);
  } catch (err) {
    console.error('Erro ao atualizar progresso na arena:', err);
  }
}

/**
 * Abandona ou fecha a sala
 */
export async function abandonArenaRoom(roomId: string, playerNum: 1 | 2): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    const { data } = await supabase.from('arena_rooms').select('data').eq('id', roomId).single();
    if (!data?.data) return;

    const room = data.data as ArenaRoom;

    if (room.status === 'in_progress') {
      const winnerUid = playerNum === 1 ? room.player2?.uid : room.player1.uid;
      const updatedRoom: ArenaRoom = {
        ...room,
        status: 'finished',
        winnerUid: winnerUid || 'draw'
      };
      await supabase
        .from('arena_rooms')
        .update({ status: 'finished', data: updatedRoom, updated_at: new Date().toISOString() })
        .eq('id', roomId);
    } else if (room.status === 'waiting') {
      if (playerNum === 1) {
        await supabase
          .from('arena_rooms')
          .update({ status: 'abandoned', data: { ...room, status: 'abandoned' }, updated_at: new Date().toISOString() })
          .eq('id', roomId);
      } else {
        await supabase
          .from('arena_rooms')
          .update({ data: { ...room, player2: null }, updated_at: new Date().toISOString() })
          .eq('id', roomId);
      }
    }
  } catch (err) {
    console.error('Erro ao abandonar sala:', err);
  }
}

/**
 * Subscreve em tempo real às atualizações da sala via Supabase Realtime
 */
export function subscribeToArenaRoom(
  roomId: string,
  callback: (room: ArenaRoom | null) => void
): () => void {
  // Snapshot inicial
  if (isSupabaseConfigured) {
    supabase
      .from('arena_rooms')
      .select('data')
      .eq('id', roomId)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.data) {
          callback(data.data as ArenaRoom);
        }
      });

    const channel = supabase.channel(`arena_duel_${roomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'arena_rooms',
        filter: `id=eq.${roomId}`
      }, (payload) => {
        const roomData = (payload.new as any)?.data as ArenaRoom | undefined;
        if (roomData) {
          callback(roomData);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  return () => {};
}

/**
 * Cria uma sala de treino contra IA local (Bytezinho Bot) sem tráfego de rede
 */
export function createAiPracticeRoom(
  humanPlayer: ArenaPlayer,
  difficulty: ArenaAiDifficulty = 'mestre',
  words: string[] = generateArenaWords()
): {
  room: ArenaRoom;
  subscribe: (cb: (room: ArenaRoom) => void) => () => void;
  updateHumanProgress: (prog: number, wpm: number, acc: number, wordsComp: number) => void;
  abandon: () => void;
} {
  const profile = AI_BOT_PROFILES[difficulty];
  const roomId = `ai_${Date.now()}`;

  const botPlayer: ArenaPlayer = {
    uid: `bot_${profile.id}`,
    name: profile.name,
    avatar: profile.avatar,
    isBot: true,
    botDifficulty: difficulty,
    ready: true,
    progress: 0,
    wpm: profile.targetWpm,
    accuracy: profile.accuracy,
    wordsCompleted: 0
  };

  const currentRoom: ArenaRoom = {
    id: roomId,
    roomCode: 'TREINO',
    createdBy: humanPlayer.uid,
    createdAt: Date.now(),
    status: 'in_progress',
    gameStartedAt: Date.now(),
    words,
    player1: {
      ...humanPlayer,
      ready: true,
      progress: 0,
      wpm: 0,
      accuracy: 100,
      wordsCompleted: 0
    },
    player2: botPlayer
  };

  const listeners = new Set<(r: ArenaRoom) => void>();
  const emit = () => listeners.forEach(cb => cb({ ...currentRoom }));

  const totalChars = words.reduce((acc, w) => acc + w.length + 1, 0);
  const charsPerSecond = (profile.targetWpm * 5) / 60;
  const timeStepSeconds = 0.5;

  let currentTypedChars = 0;
  const botInterval = setInterval(() => {
    if (currentRoom.status !== 'in_progress') {
      clearInterval(botInterval);
      return;
    }

    const fluctuation = 0.9 + Math.random() * 0.2;
    currentTypedChars += charsPerSecond * timeStepSeconds * fluctuation;
    const botProgress = Math.min(100, (currentTypedChars / totalChars) * 100);

    const wordsCompleted = Math.floor((botProgress / 100) * words.length);

    if (currentRoom.player2) {
      currentRoom.player2.progress = Math.round(botProgress);
      currentRoom.player2.wordsCompleted = wordsCompleted;
    }

    if (botProgress >= 100 && currentRoom.status === 'in_progress') {
      currentRoom.status = 'finished';
      currentRoom.winnerUid = botPlayer.uid;
      currentRoom.finishedAt = Date.now();
      clearInterval(botInterval);
    }

    emit();
  }, timeStepSeconds * 1000);

  return {
    room: currentRoom,
    subscribe: (cb) => {
      listeners.add(cb);
      cb({ ...currentRoom });
      return () => {
        listeners.delete(cb);
        clearInterval(botInterval);
      };
    },
    updateHumanProgress: (prog, wpm, acc, wordsComp) => {
      if (currentRoom.status !== 'in_progress') return;

      currentRoom.player1.progress = Math.min(100, Math.round(prog));
      currentRoom.player1.wpm = Math.round(wpm);
      currentRoom.player1.accuracy = Math.round(acc);
      currentRoom.player1.wordsCompleted = wordsComp;

      if (prog >= 100 && currentRoom.status === 'in_progress') {
        currentRoom.status = 'finished';
        currentRoom.winnerUid = humanPlayer.uid;
        currentRoom.finishedAt = Date.now();
        clearInterval(botInterval);
      }

      emit();
    },
    abandon: () => {
      clearInterval(botInterval);
      currentRoom.status = 'abandoned';
      emit();
    }
  };
}

/**
 * Cria uma sala local de treino contra IA (compatibilidade com ArenaModal)
 */
export function createLocalAiRoom(
  humanPlayer: ArenaPlayer,
  difficulty: ArenaAiDifficulty = 'mestre'
): { room: ArenaRoom } {
  const profile = AI_BOT_PROFILES[difficulty];
  const roomId = `ai_${Date.now()}`;
  const botPlayer: ArenaPlayer = {
    uid: `bot_${profile.id}`,
    name: profile.name,
    avatar: profile.avatar,
    isBot: true,
    botDifficulty: difficulty,
    ready: true,
    progress: 0,
    wpm: profile.targetWpm,
    accuracy: profile.accuracy,
    wordsCompleted: 0
  };

  const room: ArenaRoom = {
    id: roomId,
    roomCode: 'TREINO',
    createdBy: humanPlayer.uid,
    createdAt: Date.now(),
    status: 'waiting',
    words: generateArenaWords(),
    player1: {
      ...humanPlayer,
      ready: false,
      progress: 0,
      wpm: 0,
      accuracy: 100,
      wordsCompleted: 0
    },
    player2: botPlayer
  };

  return { room };
}

/**
 * Atualiza o progresso na arena (alias de compatibilidade para ArenaModal)
 */
export async function updatePlayerArenaProgress(
  roomId: string,
  playerNum: 1 | 2,
  progress: number,
  wpm: number,
  accuracy: number,
  wordsCompleted: number,
  _isFinished?: boolean
): Promise<void> {
  return updateArenaProgress(roomId, playerNum, progress, wpm, accuracy, wordsCompleted);
}

/**
 * Listener em tempo real da arena (alias de compatibilidade para ArenaModal)
 */
export const listenToArenaRoom = subscribeToArenaRoom;

