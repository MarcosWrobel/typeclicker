// ─────────────────────────────────────────────────────────────
// Serviço de Rede Realtime — ByteQuest 1v1 Battle Royale (PvP)
// Sincronização de Salas (PostgreSQL) e Broadcast em Tempo Real (20Hz)
// ─────────────────────────────────────────────────────────────

import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  ByteQuestPvPRoom,
  ByteQuestPvPPlayer,
  PvPPlayerSyncPayload,
  PvPSyncAttackPayload,
  PvPHitPayload
} from '../types/byteQuestPvP';
import { RpgClassType } from '../types/rpgClass';

/**
 * Gera um código curto e amigável de 5 caracteres para a sala PvP
 */
export function generatePvPRoomCode(): string {
  const prefixes = ['BQT', 'RUN', 'DUO', 'COL', 'ARC', 'MAG', 'WAR', 'SLY'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${prefix}${num}`;
}

/**
 * Sorteia uma classe de forma justa e idêntica para ambos os jogadores (Espelho)
 */
export function rollSharedClass(): RpgClassType {
  const classes: RpgClassType[] = ['warrior', 'archer', 'mage'];
  return classes[Math.floor(Math.random() * classes.length)];
}

/**
 * Cria uma nova sala de Duelo 1v1 do ByteQuest no Supabase
 */
export async function createByteQuestPvPRoom(
  player: ByteQuestPvPPlayer
): Promise<{ roomId: string; roomCode: string; room: ByteQuestPvPRoom } | null> {
  if (!isSupabaseConfigured) return null;

  const roomId = `bqp_room_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const roomCode = generatePvPRoomCode();
  const sharedClass = rollSharedClass();
  const seed = Math.floor(Math.random() * 1000000);

  const initialRoom: ByteQuestPvPRoom = {
    id: roomId,
    roomCode,
    createdBy: player.uid,
    createdAt: Date.now(),
    status: 'waiting',
    sharedClass,
    seed,
    player1: {
      ...player,
      ready: false,
      level: 1,
      hp: sharedClass === 'warrior' ? 140 : sharedClass === 'archer' ? 95 : 80,
      maxHp: sharedClass === 'warrior' ? 140 : sharedClass === 'archer' ? 95 : 80,
      shieldHp: 0,
      isDead: false
    }
  };

  try {
    const { error } = await supabase.from('arena_rooms').insert({
      id: roomId,
      room_type: 'bytequest_pvp',
      created_by: player.uid,
      status: 'waiting',
      data: initialRoom,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    if (error) {
      console.error('Erro ao criar sala PvP do ByteQuest:', error);
      return null;
    }

    return { roomId, roomCode, room: initialRoom };
  } catch (err) {
    console.error('Falha na criação de sala PvP:', err);
    return null;
  }
}

/**
 * Procura uma sala pública de ByteQuest aberta nos últimos 3 minutos
 */
export async function findOpenByteQuestPvPRoom(currentUid: string): Promise<ByteQuestPvPRoom | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('arena_rooms')
      .select('id, data')
      .eq('room_type', 'bytequest_pvp')
      .eq('status', 'waiting')
      .gte('created_at', threeMinutesAgo)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error || !data) return null;

    for (const row of data) {
      const room = row.data as ByteQuestPvPRoom;
      if (room && room.player1?.uid !== currentUid && !room.player2) {
        return { ...room, id: row.id };
      }
    }
    return null;
  } catch (err) {
    console.error('Erro ao procurar sala PvP aberta:', err);
    return null;
  }
}

/**
 * Ingressa em uma sala de ByteQuest PvP através do código de 5 dígitos
 */
export async function joinByteQuestPvPRoomByCode(
  roomCode: string,
  player: ByteQuestPvPPlayer
): Promise<ByteQuestPvPRoom | null> {
  if (!isSupabaseConfigured) return null;

  const cleanCode = roomCode.trim().toUpperCase();
  const { data, error } = await supabase
    .from('arena_rooms')
    .select('id, data')
    .eq('room_type', 'bytequest_pvp')
    .eq('status', 'waiting')
    .filter('data->>roomCode', 'eq', cleanCode)
    .limit(1);

  if (error || !data || data.length === 0) {
    return null;
  }

  const row = data[0];
  const roomData = row.data as ByteQuestPvPRoom;

  if (roomData.player2 && roomData.player2.uid !== player.uid) {
    return null; // Sala cheia
  }

  const updatedPlayer2: ByteQuestPvPPlayer = {
    ...player,
    ready: false,
    level: 1,
    hp: roomData.sharedClass === 'warrior' ? 140 : roomData.sharedClass === 'archer' ? 95 : 80,
    maxHp: roomData.sharedClass === 'warrior' ? 140 : roomData.sharedClass === 'archer' ? 95 : 80,
    shieldHp: 0,
    isDead: false
  };

  const updatedRoom: ByteQuestPvPRoom = {
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
 * Alterna estado de "Pronto" e dispara contagem quando ambos estiverem prontos
 */
export async function setByteQuestPvPPlayerReady(
  roomId: string,
  playerNum: 1 | 2,
  ready: boolean
): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { data } = await supabase.from('arena_rooms').select('data').eq('id', roomId).single();
  if (!data?.data) return;

  const room = data.data as ByteQuestPvPRoom;
  const isP1 = playerNum === 1;
  const p1Ready = isP1 ? ready : room.player1.ready;
  const p2Ready = !isP1 ? ready : (room.player2?.ready ?? false);

  const updatedRoom: ByteQuestPvPRoom = {
    ...room,
    player1: isP1 ? { ...room.player1, ready } : room.player1,
    player2: room.player2 ? (!isP1 ? { ...room.player2, ready } : room.player2) : undefined
  };

  if (p1Ready && p2Ready && updatedRoom.player2 && updatedRoom.status === 'waiting') {
    updatedRoom.status = 'countdown';
    updatedRoom.countdownStartedAt = Date.now();
  }

  await supabase
    .from('arena_rooms')
    .update({
      data: updatedRoom,
      status: updatedRoom.status,
      updated_at: new Date().toISOString()
    })
    .eq('id', roomId);
}

/**
 * Inicia oficialmente a partida após a contagem regressiva
 */
export async function startByteQuestPvPGame(roomId: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { data } = await supabase.from('arena_rooms').select('data').eq('id', roomId).single();
  if (!data?.data) return;

  const room = data.data as ByteQuestPvPRoom;
  const updatedRoom: ByteQuestPvPRoom = {
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
 * Registra o término da partida e o vencedor
 */
export async function finishByteQuestPvPMatch(roomId: string, winnerUid: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    const { data } = await supabase.from('arena_rooms').select('data').eq('id', roomId).single();
    if (!data?.data) return;

    const room = data.data as ByteQuestPvPRoom;
    const updatedRoom: ByteQuestPvPRoom = {
      ...room,
      status: 'finished',
      winnerUid,
      finishedAt: Date.now()
    };

    await supabase
      .from('arena_rooms')
      .update({
        status: 'finished',
        data: updatedRoom,
        updated_at: new Date().toISOString()
      })
      .eq('id', roomId);
  } catch (err) {
    console.error('Erro ao finalizar partida PvP:', err);
  }
}

/**
 * Cancela ou sai da sala
 */
export async function leaveByteQuestPvPRoom(roomId: string, playerNum: 1 | 2): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    const { data } = await supabase.from('arena_rooms').select('data').eq('id', roomId).single();
    if (!data?.data) return;

    const room = data.data as ByteQuestPvPRoom;

    if (room.status === 'in_progress') {
      const winnerUid = playerNum === 1 ? room.player2?.uid : room.player1.uid;
      const updatedRoom: ByteQuestPvPRoom = {
        ...room,
        status: 'finished',
        winnerUid: winnerUid || 'draw',
        finishedAt: Date.now()
      };
      await supabase
        .from('arena_rooms')
        .update({ status: 'finished', data: updatedRoom, updated_at: new Date().toISOString() })
        .eq('id', roomId);
    } else if (room.status === 'waiting' || room.status === 'countdown') {
      if (playerNum === 1) {
        await supabase
          .from('arena_rooms')
          .update({ status: 'abandoned', data: { ...room, status: 'abandoned' }, updated_at: new Date().toISOString() })
          .eq('id', roomId);
      } else {
        await supabase
          .from('arena_rooms')
          .update({ data: { ...room, player2: undefined, status: 'waiting' }, status: 'waiting', updated_at: new Date().toISOString() })
          .eq('id', roomId);
      }
    }
  } catch (err) {
    console.error('Erro ao sair da sala PvP:', err);
  }
}

/**
 * Subscreve às atualizações da sala via Supabase Realtime
 */
export function subscribeToByteQuestPvPRoom(
  roomId: string,
  callback: (room: ByteQuestPvPRoom | null) => void
): () => void {
  if (!isSupabaseConfigured) {
    callback(null);
    return () => {};
  }

  // Snapshot inicial
  supabase
    .from('arena_rooms')
    .select('data')
    .eq('id', roomId)
    .maybeSingle()
    .then(({ data }) => {
      if (data?.data) {
        callback(data.data as ByteQuestPvPRoom);
      }
    });

  const channelName = `bqp_state_${roomId}_${Date.now()}`;
  const channel = supabase.channel(channelName)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'arena_rooms',
      filter: `id=eq.${roomId}`
    }, (payload) => {
      const roomData = (payload.new as any)?.data as ByteQuestPvPRoom | undefined;
      if (roomData) {
        callback(roomData);
      }
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Conecta ao canal de Broadcast de alta frequência (20Hz) para sincronização da partida em tempo real
 */
export function connectByteQuestPvPBroadcast(
  roomId: string,
  onMessage: (event: string, payload: any) => void
): {
  send: (event: string, payload: any) => void;
  disconnect: () => void;
} {
  if (!isSupabaseConfigured) {
    return {
      send: () => {},
      disconnect: () => {}
    };
  }

  const channelName = `bqp_broadcast_${roomId}`;
  const channel = supabase.channel(channelName, {
    config: {
      broadcast: { self: false }
    }
  });

  const supportedEvents = [
    'sync_pos',
    'hero_attack',
    'pvp_hit',
    'gem_collected',
    'enemy_killed',
    'shrine_activated',
    'player_word_hack'
  ];

  for (const ev of supportedEvents) {
    channel.on('broadcast', { event: ev }, ({ payload }) => {
      onMessage(ev, payload);
    });
  }

  channel.subscribe();

  return {
    send: (event: string, payload: any) => {
      channel.send({
        type: 'broadcast',
        event,
        payload
      });
    },
    disconnect: () => {
      supabase.removeChannel(channel);
    }
  };
}
