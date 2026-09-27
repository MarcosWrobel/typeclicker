import { supabase } from '../../../services/supabaseClient';
import { QuizQuestion, QUIZ_QUESTIONS_BY_LANGUAGE } from '../constants/quizQuestions';

export interface PlayerBattleState {
  userId: string;
  name: string;
  photo?: string;
  currentQuestionIndex: number;
  score: number;
  streak: number;
  finished: boolean;
  answers: Record<number, number>;
}

export interface PlayerPowersState {
  freezeUntil?: number;
  fogUntil?: number;
  hasShield?: boolean;
  eliminatedOptions?: Record<number, number[]>;
  inventory: {
    freeze: number;
    fog: number;
    shield: number;
    fiftyFifty: number;
  };
}

export interface CombatLogItem {
  id: string;
  timestamp: number;
  text: string;
  type: 'freeze' | 'fog' | 'shield' | 'fiftyFifty' | 'streak' | 'info';
}

export interface CompetitionRoom {
  roomCode: string;
  language: string;
  creatorId: string;
  creatorName: string;
  creatorPhoto?: string;
  participantId?: string;
  participantName?: string;
  participantPhoto?: string;
  status: 'waiting' | 'active' | 'finished';
  questions: QuizQuestion[];
  currentQuestion: number;
  scores: Record<string, number>;
  answers: Record<string, Record<number, number>>;
  playerStates: Record<string, PlayerBattleState>;
  playerPowers: Record<string, PlayerPowersState>;
  combatLogs?: CombatLogItem[];
  winnerId?: string | 'tie';
  isBotMatch?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DuelUser {
  uid: string;
  displayName: string;
  photoURL?: string;
  email?: string;
}

const activeRooms = new Map<string, CompetitionRoom>();
const roomListeners = new Map<string, Set<(room: CompetitionRoom | null) => void>>();
const realtimeChannels = new Map<string, any>();
const botTimers = new Map<string, any[]>();

export function generateRoomCode(language: string = 'CODE'): string {
  const prefix = language.slice(0, 3).toUpperCase();
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${digits}`;
}

function notifyRoomSubscribers(roomCode: string) {
  const normalized = roomCode.trim().toUpperCase();
  const room = activeRooms.get(normalized) || null;
  const listeners = roomListeners.get(normalized);
  if (listeners) {
    listeners.forEach((cb) => cb(room ? { ...room } : null));
  }
}

// ─────────────────────────────────────────────────────────────
// 1. Criar Sala (Multiplayer Local / Supabase Realtime)
// ─────────────────────────────────────────────────────────────
export async function createCompetitionRoom(
  user: DuelUser,
  language: string
): Promise<CompetitionRoom> {
  const roomCode = generateRoomCode(language);
  const langKey = language.toLowerCase();
  const availableQuestions = QUIZ_QUESTIONS_BY_LANGUAGE[langKey] || QUIZ_QUESTIONS_BY_LANGUAGE.html;
  const selectedQuestions = [...availableQuestions].sort(() => 0.5 - Math.random()).slice(0, 5);

  const now = new Date().toISOString();
  const creatorName = user.displayName || 'Jogador 1';

  const initialPlayerState: PlayerBattleState = {
    userId: user.uid,
    name: creatorName,
    photo: user.photoURL,
    currentQuestionIndex: 0,
    score: 0,
    streak: 0,
    finished: false,
    answers: {},
  };

  const initialPowers: PlayerPowersState = {
    inventory: { freeze: 1, fog: 1, shield: 1, fiftyFifty: 1 },
    eliminatedOptions: {},
  };

  const room: CompetitionRoom = {
    roomCode,
    language,
    creatorId: user.uid,
    creatorName,
    creatorPhoto: user.photoURL,
    status: 'waiting',
    questions: selectedQuestions,
    currentQuestion: 0,
    scores: { [user.uid]: 0 },
    answers: { [user.uid]: {} },
    playerStates: { [user.uid]: initialPlayerState },
    playerPowers: { [user.uid]: { ...initialPowers } },
    combatLogs: [
      {
        id: `wait-${Date.now()}`,
        timestamp: Date.now(),
        text: `⏳ Sala ${roomCode} criada por ${creatorName}. Aguardando desafiante...`,
        type: 'info',
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  activeRooms.set(roomCode, room);
  setupSupabaseChannel(roomCode, user.uid);
  return room;
}

// ─────────────────────────────────────────────────────────────
// 2. Duelo Solo contra Bytezinho (Sem IA / Simulação Reativa)
// ─────────────────────────────────────────────────────────────
export async function createBotCompetitionRoom(
  user: DuelUser,
  language: string
): Promise<CompetitionRoom> {
  const roomCode = `BOT${Math.floor(1000 + Math.random() * 9000)}`;
  const langKey = language.toLowerCase();
  const availableQuestions = QUIZ_QUESTIONS_BY_LANGUAGE[langKey] || QUIZ_QUESTIONS_BY_LANGUAGE.html;
  const selectedQuestions = [...availableQuestions].sort(() => 0.5 - Math.random()).slice(0, 5);

  const now = new Date().toISOString();
  const creatorName = user.displayName || 'Aluno';
  const botId = 'bytezinho-bot';
  const botName = 'Bytezinho 🐸 (Mascote)';

  const initialPlayerState: PlayerBattleState = {
    userId: user.uid,
    name: creatorName,
    photo: user.photoURL,
    currentQuestionIndex: 0,
    score: 0,
    streak: 0,
    finished: false,
    answers: {},
  };

  const initialBotState: PlayerBattleState = {
    userId: botId,
    name: botName,
    photo: '',
    currentQuestionIndex: 0,
    score: 0,
    streak: 0,
    finished: false,
    answers: {},
  };

  const initialPowers: PlayerPowersState = {
    inventory: { freeze: 1, fog: 1, shield: 1, fiftyFifty: 1 },
    eliminatedOptions: {},
  };

  const room: CompetitionRoom = {
    roomCode,
    language,
    creatorId: user.uid,
    creatorName,
    creatorPhoto: user.photoURL,
    participantId: botId,
    participantName: botName,
    participantPhoto: initialBotState.photo,
    status: 'active',
    questions: selectedQuestions,
    currentQuestion: 0,
    scores: { [user.uid]: 0, [botId]: 0 },
    answers: { [user.uid]: {}, [botId]: {} },
    playerStates: { [user.uid]: initialPlayerState, [botId]: initialBotState },
    playerPowers: { [user.uid]: { ...initialPowers }, [botId]: { ...initialPowers } },
    combatLogs: [
      {
        id: `start-${Date.now()}`,
        timestamp: Date.now(),
        text: `⚔️ Desafio 1x1 iniciado! ${creatorName} vs Bytezinho 🐸!`,
        type: 'info',
      },
    ],
    isBotMatch: true,
    createdAt: now,
    updatedAt: now,
  };

  activeRooms.set(roomCode, room);

  // Inicia comportamento autônomo do Bytezinho
  startBotSimulation(roomCode, botId, user.uid);

  return room;
}

function startBotSimulation(roomCode: string, botId: string, opponentId: string) {
  stopBotSimulation(roomCode);
  const timers: any[] = [];

  let currentQ = 0;
  function scheduleNextAnswer() {
    const delay = 4500 + Math.random() * 3500;
    const timer = setTimeout(() => {
      const room = activeRooms.get(roomCode);
      if (!room || room.status !== 'active') return;

      const q = room.questions[currentQ];
      if (!q) return;

      const botPowers = room.playerPowers[botId];
      if (botPowers?.freezeUntil && botPowers.freezeUntil > Date.now()) {
        // Bytezinho está congelado!
        scheduleNextAnswer();
        return;
      }

      const isCorrect = Math.random() < 0.75;
      const chosenAnswer = isCorrect
        ? q.correctAnswer
        : (q.correctAnswer + 1) % q.options.length;

      // Chance de usar poder
      if (Math.random() < 0.4) {
        if (botPowers && botPowers.inventory.freeze > 0) {
          useCompetitionPower({ uid: botId, displayName: 'Bytezinho 🐸' }, roomCode, 'freeze', opponentId);
        } else if (botPowers && botPowers.inventory.fog > 0) {
          useCompetitionPower({ uid: botId, displayName: 'Bytezinho 🐸' }, roomCode, 'fog', opponentId);
        }
      }

      submitCompetitionAnswer({ uid: botId, displayName: 'Bytezinho 🐸' }, roomCode, currentQ, chosenAnswer, isCorrect);
      currentQ++;

      if (currentQ < room.questions.length) {
        advancePlayerQuestion({ uid: botId, displayName: 'Bytezinho 🐸' }, roomCode, currentQ, false);
        scheduleNextAnswer();
      } else {
        advancePlayerQuestion({ uid: botId, displayName: 'Bytezinho 🐸' }, roomCode, currentQ, true);
      }
    }, delay);

    timers.push(timer);
  }

  scheduleNextAnswer();
  botTimers.set(roomCode, timers);
}

function stopBotSimulation(roomCode: string) {
  const existing = botTimers.get(roomCode);
  if (existing) {
    existing.forEach((t) => clearTimeout(t));
    botTimers.delete(roomCode);
  }
}

// ─────────────────────────────────────────────────────────────
// 3. Entrar na Sala
// ─────────────────────────────────────────────────────────────
export async function joinCompetitionRoom(
  user: DuelUser,
  roomCode: string
): Promise<CompetitionRoom> {
  const normalized = roomCode.trim().toUpperCase();
  let room = activeRooms.get(normalized);

  const channel = setupSupabaseChannel(normalized, user.uid);

  if (!room) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    room = activeRooms.get(normalized);
  }

  if (!room) {
    throw new Error(`A sala com o código "${normalized}" não foi encontrada.`);
  }

  if (room.creatorId === user.uid) {
    return room;
  }

  if (room.status !== 'waiting' && room.participantId !== user.uid) {
    throw new Error('Esta sala já está em andamento ou cheia.');
  }

  const participantName = user.displayName || 'Desafiante';
  const participantPlayerState: PlayerBattleState = room.playerStates[user.uid] || {
    userId: user.uid,
    name: participantName,
    photo: user.photoURL,
    currentQuestionIndex: 0,
    score: 0,
    streak: 0,
    finished: false,
    answers: {},
  };

  const participantPowersState: PlayerPowersState = room.playerPowers[user.uid] || {
    inventory: { freeze: 1, fog: 1, shield: 1, fiftyFifty: 1 },
    eliminatedOptions: {},
  };

  const joinLog: CombatLogItem = {
    id: `join-${Date.now()}`,
    timestamp: Date.now(),
    text: `🔥 ${participantName} entrou na arena! A disputa começou!`,
    type: 'info',
  };

  room.participantId = user.uid;
  room.participantName = participantName;
  room.participantPhoto = user.photoURL;
  room.status = 'active';
  room.scores[user.uid] = room.scores[user.uid] || 0;
  room.answers[user.uid] = room.answers[user.uid] || {};
  room.playerStates[user.uid] = participantPlayerState;
  room.playerPowers[user.uid] = participantPowersState;
  room.combatLogs = [joinLog, ...(room.combatLogs || [])].slice(0, 15);
  room.updatedAt = new Date().toISOString();

  activeRooms.set(normalized, room);
  notifyRoomSubscribers(normalized);

  channel.send({
    type: 'broadcast',
    event: 'sync_state',
    payload: room,
  });

  return room;
}

function setupSupabaseChannel(roomCode: string, currentUserId: string) {
  const normalized = roomCode.trim().toUpperCase();
  if (realtimeChannels.has(normalized)) {
    return realtimeChannels.get(normalized);
  }

  const channel = supabase.channel(`progplay_duel_${normalized}`);

  channel
    .on('broadcast', { event: 'sync_state' }, ({ payload }) => {
      if (payload && payload.roomCode === normalized) {
        activeRooms.set(normalized, payload);
        notifyRoomSubscribers(normalized);
      }
    })
    .on('broadcast', { event: 'request_state' }, () => {
      const room = activeRooms.get(normalized);
      if (room && room.creatorId === currentUserId) {
        channel.send({
          type: 'broadcast',
          event: 'sync_state',
          payload: room,
        });
      }
    })
    .subscribe();

  realtimeChannels.set(normalized, channel);
  return channel;
}

// ─────────────────────────────────────────────────────────────
// 4. Submissão de Respostas
// ─────────────────────────────────────────────────────────────
export async function submitCompetitionAnswer(
  user: DuelUser,
  roomCode: string,
  questionIndex: number,
  answerIndex: number,
  isCorrect: boolean
): Promise<void> {
  const normalized = roomCode.trim().toUpperCase();
  const room = activeRooms.get(normalized);
  if (!room) return;

  const playerState = room.playerStates[user.uid];
  if (!playerState) return;

  const points = isCorrect ? 100 + playerState.streak * 25 : 0;
  playerState.answers[questionIndex] = answerIndex;

  const logs = [...(room.combatLogs || [])];

  if (isCorrect) {
    playerState.score += points;
    playerState.streak += 1;
    room.scores[user.uid] = playerState.score;

    if (playerState.streak === 2) {
      const myPowers = room.playerPowers[user.uid];
      if (myPowers) myPowers.inventory.freeze += 1;
      logs.unshift({
        id: `streak-${Date.now()}`,
        timestamp: Date.now(),
        text: `⚡ Sequência Imbatível! ${playerState.name} acertou 2 seguidas e ganhou +1 Raio Congelante!`,
        type: 'streak',
      });
    }
  } else {
    playerState.streak = 0;
  }

  room.combatLogs = logs.slice(0, 15);
  room.updatedAt = new Date().toISOString();
  activeRooms.set(normalized, room);
  notifyRoomSubscribers(normalized);

  const channel = realtimeChannels.get(normalized);
  if (channel && !room.isBotMatch) {
    channel.send({ type: 'broadcast', event: 'sync_state', payload: room });
  }
}

// ─────────────────────────────────────────────────────────────
// 5. Avançar Pergunta
// ─────────────────────────────────────────────────────────────
export async function advancePlayerQuestion(
  user: DuelUser,
  roomCode: string,
  nextQuestionIndex: number,
  isFinished: boolean = false
): Promise<void> {
  const normalized = roomCode.trim().toUpperCase();
  const room = activeRooms.get(normalized);
  if (!room) return;

  const playerState = room.playerStates[user.uid];
  if (!playerState) return;

  playerState.currentQuestionIndex = nextQuestionIndex;
  playerState.finished = isFinished;

  const allFinished = Object.values(room.playerStates).every((p) => p.finished);
  const logs = [...(room.combatLogs || [])];

  if (isFinished) {
    logs.unshift({
      id: `done-${Date.now()}-${user.uid}`,
      timestamp: Date.now(),
      text: `🏁 ${playerState.name} terminou todas as perguntas! ${allFinished ? 'Partida Encerrada!' : 'Aguardando oponente...'}`,
      type: 'info',
    });
  }

  if (allFinished) {
    room.status = 'finished';
    const players = Object.values(room.playerStates);
    if (players.length >= 2) {
      if (players[0].score > players[1].score) {
        room.winnerId = players[0].userId;
      } else if (players[1].score > players[0].score) {
        room.winnerId = players[1].userId;
      } else {
        room.winnerId = 'tie';
      }
    } else if (players.length === 1) {
      room.winnerId = players[0].userId;
    }
  }

  room.combatLogs = logs.slice(0, 15);
  room.updatedAt = new Date().toISOString();
  activeRooms.set(normalized, room);
  notifyRoomSubscribers(normalized);

  const channel = realtimeChannels.get(normalized);
  if (channel && !room.isBotMatch) {
    channel.send({ type: 'broadcast', event: 'sync_state', payload: room });
  }
}

// ─────────────────────────────────────────────────────────────
// 6. Usar Poder
// ─────────────────────────────────────────────────────────────
export async function useCompetitionPower(
  user: DuelUser,
  roomCode: string,
  powerType: 'freeze' | 'fog' | 'shield' | 'fiftyFifty',
  targetId?: string,
  currentQIndex?: number
): Promise<void> {
  const normalized = roomCode.trim().toUpperCase();
  const room = activeRooms.get(normalized);
  if (!room || room.status !== 'active') return;

  const playerPowers = room.playerPowers[user.uid];
  if (!playerPowers || playerPowers.inventory[powerType] <= 0) return;

  playerPowers.inventory[powerType] -= 1;
  const userName = room.playerStates[user.uid]?.name || 'Jogador';
  const opponentId = targetId || Object.keys(room.playerStates).find((id) => id !== user.uid) || '';
  const opponentPowers = opponentId ? room.playerPowers[opponentId] : undefined;
  const opponentName = opponentId ? (room.playerStates[opponentId]?.name || 'Oponente') : 'Oponente';

  let logText = '';

  if (powerType === 'freeze' && opponentPowers) {
    if (opponentPowers.hasShield) {
      opponentPowers.hasShield = false;
      logText = `🛡️ ${opponentName} defendeu o Congelamento com o Escudo!`;
    } else {
      opponentPowers.freezeUntil = Date.now() + 4000;
      logText = `❄️ ${userName} CONGELOU ${opponentName} por 4 segundos!`;
    }
  } else if (powerType === 'fog' && opponentPowers) {
    if (opponentPowers.hasShield) {
      opponentPowers.hasShield = false;
      logText = `🛡️ ${opponentName} dissipou o Nevoeiro com o Escudo!`;
    } else {
      opponentPowers.fogUntil = Date.now() + 6000;
      logText = `🌫️ ${userName} lançou um NEVOEIRO CEGO sobre ${opponentName}!`;
    }
  } else if (powerType === 'shield') {
    playerPowers.hasShield = true;
    logText = `🛡️ ${userName} ativou um ESCUDO de proteção contra o próximo ataque!`;
  } else if (powerType === 'fiftyFifty') {
    const qIndex = room.playerStates[user.uid]?.currentQuestionIndex || 0;
    const currentQ = room.questions[qIndex];
    if (currentQ) {
      const wrong = currentQ.options
        .map((_, i) => i)
        .filter((i) => i !== currentQ.correctAnswer);
      const eliminated = wrong.slice(0, 2);
      playerPowers.eliminatedOptions = {
        ...(playerPowers.eliminatedOptions || {}),
        [qIndex]: eliminated,
      };
      logText = `✂️ ${userName} ativou o 50/50 e eliminou duas opções incorretas!`;
    }
  }

  const newLog: CombatLogItem = {
    id: `power-${Date.now()}-${Math.random()}`,
    timestamp: Date.now(),
    text: logText,
    type: powerType,
  };

  room.combatLogs = [newLog, ...(room.combatLogs || [])].slice(0, 15);
  room.updatedAt = new Date().toISOString();

  activeRooms.set(normalized, room);
  notifyRoomSubscribers(normalized);

  const channel = realtimeChannels.get(normalized);
  if (channel && !room.isBotMatch) {
    channel.send({ type: 'broadcast', event: 'sync_state', payload: room });
  }
}

export function subscribeToCompetitionRoom(
  roomCode: string,
  onUpdate: (room: CompetitionRoom | null) => void
): () => void {
  const normalized = roomCode.trim().toUpperCase();
  if (!roomListeners.has(normalized)) {
    roomListeners.set(normalized, new Set());
  }

  const listeners = roomListeners.get(normalized)!;
  listeners.add(onUpdate);

  const current = activeRooms.get(normalized) || null;
  onUpdate(current);

  return () => {
    listeners.delete(onUpdate);
    if (listeners.size === 0) {
      roomListeners.delete(normalized);
      stopBotSimulation(normalized);
      const channel = realtimeChannels.get(normalized);
      if (channel) {
        channel.unsubscribe();
        realtimeChannels.delete(normalized);
      }
    }
  };
}

export async function fetchOpenCompetitionRooms(): Promise<CompetitionRoom[]> {
  const waiting: CompetitionRoom[] = [];
  activeRooms.forEach((room) => {
    if (room.status === 'waiting') {
      waiting.push({ ...room });
    }
  });
  return waiting;
}
