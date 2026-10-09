import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';

export interface TyperDashNetPlayer {
  userId: string;
  nickname: string;
  skin: string;
  distance: number;
  y: number;
  rotation: number;
  isJumping: boolean;
  isAlive: boolean;
  progressRatio: number;
  score: number;
  lastSeenMs: number;
  status: 'lobby' | 'racing' | 'crashed' | 'finished';
}

export interface TyperDashNetPacket {
  userId: string;
  nickname: string;
  skin: string;
  distance: number;
  y: number;
  rotation: number;
  isJumping: boolean;
  isAlive: boolean;
  progressRatio: number;
  score: number;
}

export interface TyperDashLobbyPingPacket {
  userId: string;
  nickname: string;
  skin: string;
  status: 'lobby' | 'racing' | 'crashed' | 'finished';
}

export interface TyperDashRoomStartPacket {
  starterUserId: string;
  starterNickname: string;
  seed: number;
}

export class TyperDashNetManager {
  private channel: ReturnType<typeof supabase.channel> | null = null;
  private roomCode: string = '';
  private currentUserId: string = '';
  private currentNickname: string = '';
  private currentSkin: string = 'classic';
  private currentStatus: 'lobby' | 'racing' | 'crashed' | 'finished' = 'lobby';
  private remotePlayers: Map<string, TyperDashNetPlayer> = new Map();
  private onPlayersChange?: (players: Map<string, TyperDashNetPlayer>) => void;
  private onRemoteCrash?: (userId: string, distance: number) => void;
  private onRoomStart?: (seed: number, starterNickname: string) => void;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  public connect(
    roomCode: string,
    student: { userId: string; nickname: string; skin: string },
    onPlayersChange: (players: Map<string, TyperDashNetPlayer>) => void,
    onRemoteCrash?: (userId: string, distance: number) => void,
    onRoomStart?: (seed: number, starterNickname: string) => void
  ): void {
    this.disconnect();

    this.roomCode = roomCode.trim().toUpperCase();
    this.currentUserId = student.userId;
    this.currentNickname = student.nickname;
    this.currentSkin = student.skin;
    this.currentStatus = 'lobby';
    this.onPlayersChange = onPlayersChange;
    this.onRemoteCrash = onRemoteCrash;
    this.onRoomStart = onRoomStart;
    this.remotePlayers.clear();

    if (!isSupabaseConfigured) {
      console.warn('[TyperDashNet] Supabase não está configurado. Modo offline ativo.');
      return;
    }

    // O nome do canal DEVE ser idêntico para todos na mesma sala para o Broadcast funcionar!
    const channelTopic = `typerdash_room_${this.roomCode}`;

    try {
      // Remove qualquer inscrição anterior com este mesmo tópico para evitar vazamento
      const existing = supabase.getChannels().find(
        (c) => c.topic === `realtime:${channelTopic}` || c.topic === channelTopic
      );
      if (existing) {
        try {
          supabase.removeChannel(existing);
        } catch {}
      }

      this.channel = supabase.channel(channelTopic, {
        config: {
          broadcast: { self: false }
        }
      })
        // 1. Presença no Lobby (Heartbeat & Quem está conectado)
        .on('broadcast', { event: 'lobby_ping' }, ({ payload }) => {
          if (!payload || payload.userId === this.currentUserId) return;
          const ping = payload as TyperDashLobbyPingPacket;
          const prev = this.remotePlayers.get(ping.userId);

          this.remotePlayers.set(ping.userId, {
            userId: ping.userId,
            nickname: ping.nickname || 'Corredor',
            skin: ping.skin || 'classic',
            distance: prev?.distance || 0,
            y: prev?.y || 388,
            rotation: prev?.rotation || 0,
            isJumping: prev?.isJumping || false,
            isAlive: prev ? prev.isAlive : true,
            progressRatio: prev?.progressRatio || 0,
            score: prev?.score || 0,
            lastSeenMs: Date.now(),
            status: ping.status || 'lobby'
          });

          this.onPlayersChange?.(new Map(this.remotePlayers));
        })
        // 2. Largada Coletiva Sincronizada
        .on('broadcast', { event: 'room_start' }, ({ payload }) => {
          if (!payload) return;
          const startPacket = payload as TyperDashRoomStartPacket;
          this.currentStatus = 'racing';
          this.onRoomStart?.(startPacket.seed, startPacket.starterNickname);
        })
        // 3. Telemetria P2P durante a corrida
        .on('broadcast', { event: 'player_tick' }, ({ payload }) => {
          if (!payload || payload.userId === this.currentUserId) return;
          const packet = payload as TyperDashNetPacket;
          this.remotePlayers.set(packet.userId, {
            ...packet,
            lastSeenMs: Date.now(),
            status: 'racing'
          });
          this.onPlayersChange?.(new Map(this.remotePlayers));
        })
        // 4. Notificação de Queda / Batida
        .on('broadcast', { event: 'player_crash' }, ({ payload }) => {
          if (!payload || payload.userId === this.currentUserId) return;
          const p = this.remotePlayers.get(payload.userId);
          if (p) {
            p.isAlive = false;
            p.status = 'crashed';
            this.remotePlayers.set(payload.userId, p);
            this.onPlayersChange?.(new Map(this.remotePlayers));
          }
          this.onRemoteCrash?.(payload.userId, payload.distance);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            // Anuncia presença imediatamente para todos na sala
            this.broadcastLobbyPing('lobby');
          }
        });
    } catch (err) {
      console.warn('[TyperDashNet] Erro ao subscrever canal:', err);
    }

    // Heartbeat de Presença (a cada 1.5s)
    this.heartbeatInterval = setInterval(() => {
      this.broadcastLobbyPing(this.currentStatus);
    }, 1500);

    // Limpeza de jogadores desconectados (timeout de 5 segundos)
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      let changed = false;
      for (const [id, p] of this.remotePlayers.entries()) {
        if (now - p.lastSeenMs > 5000) {
          this.remotePlayers.delete(id);
          changed = true;
        }
      }
      if (changed) {
        this.onPlayersChange?.(new Map(this.remotePlayers));
      }
    }, 1500);
  }

  public setStatus(status: 'lobby' | 'racing' | 'crashed' | 'finished'): void {
    this.currentStatus = status;
    this.broadcastLobbyPing(status);
  }

  public broadcastLobbyPing(status: 'lobby' | 'racing' | 'crashed' | 'finished' = this.currentStatus): void {
    if (!this.channel || !this.currentUserId) return;
    try {
      const payload: TyperDashLobbyPingPacket = {
        userId: this.currentUserId,
        nickname: this.currentNickname,
        skin: this.currentSkin,
        status
      };
      this.channel.send({
        type: 'broadcast',
        event: 'lobby_ping',
        payload
      });
    } catch {}
  }

  public broadcastStartRace(seed: number): void {
    if (!this.channel || !this.currentUserId) return;
    this.currentStatus = 'racing';
    try {
      const payload: TyperDashRoomStartPacket = {
        starterUserId: this.currentUserId,
        starterNickname: this.currentNickname,
        seed
      };
      this.channel.send({
        type: 'broadcast',
        event: 'room_start',
        payload
      });
    } catch {}
  }

  public broadcastTick(packet: Omit<TyperDashNetPacket, 'userId' | 'nickname' | 'skin'>): void {
    if (!this.channel || !this.currentUserId) return;

    const fullPacket: TyperDashNetPacket = {
      userId: this.currentUserId,
      nickname: this.currentNickname,
      skin: this.currentSkin,
      distance: packet.distance,
      y: packet.y,
      rotation: packet.rotation,
      isJumping: packet.isJumping,
      isAlive: packet.isAlive,
      progressRatio: packet.progressRatio,
      score: packet.score
    };

    try {
      this.channel.send({
        type: 'broadcast',
        event: 'player_tick',
        payload: fullPacket
      });
    } catch {}
  }

  public broadcastCrash(distance: number): void {
    if (!this.channel || !this.currentUserId) return;
    this.currentStatus = 'crashed';
    try {
      this.channel.send({
        type: 'broadcast',
        event: 'player_crash',
        payload: { userId: this.currentUserId, distance }
      });
    } catch {}
  }

  public disconnect(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    if (this.channel) {
      try {
        supabase.removeChannel(this.channel);
      } catch {}
      this.channel = null;
    }

    this.remotePlayers.clear();
  }
}

export const typerDashNet = new TyperDashNetManager();

