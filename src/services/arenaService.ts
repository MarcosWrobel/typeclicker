import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  onSnapshot,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from './firebaseService';
import {
  ArenaRoom,
  ArenaPlayer,
  ArenaRoomStatus,
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

  // Embaralha e retira palavras distintas com 5 a 14 caracteres
  const filtered = pool.filter(w => w.length >= 5 && w.length <= 14);
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  if (selected.length < count) {
    // Fallback garantido
    const fallback = [
      'cibernética', 'algoritmo', 'overclock', 'teclado', 'precisão',
      'velocidade', 'leopoldina', 'processador', 'desenvolvedor', 'engenharia',
      'criptografia', 'microchip', 'segurança', 'arquitetura', 'conectividade'
    ];
    return fallback.slice(0, count);
  }

  return selected;
}

/**
 * Cria uma nova sala na nuvem (Firestore) e aguarda desafiante
 */
export async function createArenaRoom(player: ArenaPlayer): Promise<{ roomId: string; roomCode: string }> {
  const roomCode = generateRoomCode();
  const roomsRef = collection(db, 'arena_rooms');
  const newRoomRef = doc(roomsRef);
  const words = generateArenaWords(ARENA_WORDS_PER_MATCH);

  const initialRoom: ArenaRoom = {
    id: newRoomRef.id,
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

  await setDoc(newRoomRef, initialRoom);
  return { roomId: newRoomRef.id, roomCode };
}

/**
 * Busca por uma sala pública aberta criada nos últimos 3 minutos
 */
export async function findOpenArenaRoom(currentUid: string): Promise<ArenaRoom | null> {
  try {
    const threeMinutesAgo = Date.now() - 3 * 60 * 1000;
    const q = query(
      collection(db, 'arena_rooms'),
      where('status', '==', 'waiting'),
      limit(10)
    );

    const snapshot = await getDocs(q);
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data() as ArenaRoom;
      if (
        data.createdAt >= threeMinutesAgo &&
        data.player1.uid !== currentUid &&
        !data.player2
      ) {
        return { ...data, id: docSnap.id };
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
  const cleanCode = roomCode.trim().toUpperCase();
  const q = query(
    collection(db, 'arena_rooms'),
    where('roomCode', '==', cleanCode),
    where('status', '==', 'waiting'),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }

  const roomDoc = snapshot.docs[0];
  const roomData = roomDoc.data() as ArenaRoom;

  if (roomData.player1.uid === player.uid) {
    // É o próprio criador tentando se juntar novamente
    return { ...roomData, id: roomDoc.id };
  }

  if (roomData.player2 && roomData.player2.uid !== player.uid) {
    // Sala já está cheia
    return null;
  }

  const updatedPlayer2: ArenaPlayer = {
    ...player,
    ready: false,
    progress: 0,
    wpm: 0,
    accuracy: 100,
    wordsCompleted: 0
  };

  await updateDoc(roomDoc.ref, {
    player2: updatedPlayer2
  });

  return {
    ...roomData,
    id: roomDoc.id,
    player2: updatedPlayer2
  };
}

/**
 * Alterna estado de "Pronto" do jogador e dispara contagem quando ambos estiverem prontos
 */
export async function setPlayerReady(
  roomId: string,
  playerNum: 1 | 2,
  ready: boolean
): Promise<void> {
  const roomRef = doc(db, 'arena_rooms', roomId);

  await runTransaction(db, async (transaction) => {
    const roomSnap = await transaction.get(roomRef);
    if (!roomSnap.exists()) return;

    const data = roomSnap.data() as ArenaRoom;
    const isP1 = playerNum === 1;

    const p1Ready = isP1 ? ready : data.player1.ready;
    const p2Ready = !isP1 ? ready : (data.player2?.ready ?? false);

    const updatePayload: Record<string, any> = {};

    if (isP1) {
      updatePayload['player1.ready'] = ready;
    } else {
      updatePayload['player2.ready'] = ready;
    }

    // Se ambos estão prontos e há dois jogadores, inicia a contagem regressiva
    if (p1Ready && p2Ready && data.player2 && data.status === 'waiting') {
      updatePayload['status'] = 'countdown';
      updatePayload['countdownStartedAt'] = Date.now();
    }

    transaction.update(roomRef, updatePayload);
  });
}

/**
 * Transição de contagem regressiva para início oficial da partida
 */
export async function startArenaGame(roomId: string): Promise<void> {
  const roomRef = doc(db, 'arena_rooms', roomId);
  await updateDoc(roomRef, {
    status: 'in_progress',
    gameStartedAt: Date.now()
  });
}

/**
 * Atualiza o progresso do jogador durante a corrida (otimizado por palavra concluída)
 */
export async function updatePlayerArenaProgress(
  roomId: string,
  playerNum: 1 | 2,
  progress: number,
  wpm: number,
  accuracy: number,
  wordsCompleted: number,
  isFinished: boolean
): Promise<void> {
  const roomRef = doc(db, 'arena_rooms', roomId);

  try {
    if (isFinished) {
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(roomRef);
        if (!snap.exists()) return;
        const data = snap.data() as ArenaRoom;

        const updatePayload: Record<string, any> = {};
        const fieldPrefix = playerNum === 1 ? 'player1' : 'player2';

        updatePayload[`${fieldPrefix}.progress`] = 100;
        updatePayload[`${fieldPrefix}.wpm`] = Math.round(wpm);
        updatePayload[`${fieldPrefix}.accuracy`] = Math.round(accuracy);
        updatePayload[`${fieldPrefix}.wordsCompleted`] = wordsCompleted;
        updatePayload[`${fieldPrefix}.finishedAt`] = Date.now();

        // Se a sala ainda estava em progresso, este jogador é o vencedor!
        if (data.status === 'in_progress' || !data.winnerUid) {
          const winnerUid = playerNum === 1 ? data.player1.uid : data.player2?.uid;
          updatePayload['status'] = 'finished';
          updatePayload['winnerUid'] = winnerUid || 'draw';
        }

        transaction.update(roomRef, updatePayload);
      });
    } else {
      const fieldPrefix = playerNum === 1 ? 'player1' : 'player2';
      await updateDoc(roomRef, {
        [`${fieldPrefix}.progress`]: Math.min(100, Math.round(progress)),
        [`${fieldPrefix}.wpm`]: Math.round(wpm),
        [`${fieldPrefix}.accuracy`]: Math.round(accuracy),
        [`${fieldPrefix}.wordsCompleted`]: wordsCompleted
      });
    }
  } catch (err) {
    console.error('Erro ao atualizar progresso na arena:', err);
  }
}

/**
 * Abandona ou fecha a sala
 */
export async function abandonArenaRoom(roomId: string, playerNum: 1 | 2): Promise<void> {
  try {
    const roomRef = doc(db, 'arena_rooms', roomId);
    const snap = await getDoc(roomRef);
    if (!snap.exists()) return;
    const data = snap.data() as ArenaRoom;

    if (data.status === 'in_progress') {
      // Oponente vence por desistência
      const winnerUid = playerNum === 1 ? data.player2?.uid : data.player1.uid;
      await updateDoc(roomRef, {
        status: 'finished',
        winnerUid: winnerUid || 'draw'
      });
    } else if (data.status === 'waiting') {
      if (playerNum === 1) {
        // Criador saiu: cancela a sala
        await updateDoc(roomRef, { status: 'abandoned' });
      } else {
        // Desafiante saiu: libera a vaga para outro
        await updateDoc(roomRef, { player2: null });
      }
    }
  } catch (err) {
    console.error('Erro ao abandonar sala da arena:', err);
  }
}

/**
 * Escuta atualizações em tempo real da sala do Firestore via onSnapshot
 */
export function listenToArenaRoom(
  roomId: string,
  callback: (room: ArenaRoom | null) => void
): () => void {
  const roomRef = doc(db, 'arena_rooms', roomId);
  return onSnapshot(
    roomRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }
      callback({ ...(snapshot.data() as ArenaRoom), id: snapshot.id });
    },
    (err) => {
      console.error('Erro no listener da sala de arena:', err);
      callback(null);
    }
  );
}

/**
 * Cria uma sala local de treino contra a Inteligência Artificial (Bytezinho Cibernético)
 * Sem consumo de Firestore, 100% responsiva e offline-friendly
 */
export function createLocalAiRoom(
  humanPlayer: ArenaPlayer,
  difficulty: ArenaAiDifficulty
): { room: ArenaRoom; botProfile: ArenaAiProfile } {
  const botProfile = AI_BOT_PROFILES[difficulty];
  const words = generateArenaWords(ARENA_WORDS_PER_MATCH);

  const room: ArenaRoom = {
    id: `local_ai_${Date.now()}`,
    roomCode: 'TREINO',
    createdBy: humanPlayer.uid,
    createdAt: Date.now(),
    status: 'countdown',
    countdownStartedAt: Date.now(),
    words,
    player1: {
      ...humanPlayer,
      ready: true,
      progress: 0,
      wpm: 0,
      accuracy: 100,
      wordsCompleted: 0
    },
    player2: {
      uid: `bot_${botProfile.id}`,
      name: botProfile.name,
      nickname: botProfile.name,
      turma: botProfile.title,
      avatar: botProfile.avatar,
      ready: true,
      progress: 0,
      wpm: botProfile.targetWpm,
      accuracy: botProfile.accuracy,
      wordsCompleted: 0,
      isBot: true
    }
  };

  return { room, botProfile };
}
