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

export class TyperDashNetManager {
  private channel: ReturnType<typeof supabase.channel> | null = null;
  private roomCode: string = '';
  private currentUserId: string = '';
  private remotePlayers: Map<string, TyperDashNetPlayer> = new Map();
  private onPlayersChange?: (players: Map<string, TyperDashNetPlayer>) => void;
  private onRemoteCrash?: (userId: string, distance: number) => void;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  public connect(
    roomCode: string,
    student: { userId: string; nickname: string; skin: string },
    onPlayersChange: (players: Map<string, TyperDashNetPlayer>) => void,
    onRemoteCrash?: (userId: string, distance: number) => void
  ): void {
    this.disconnect();

    this.roomCode = roomCode.trim().toUpperCase();
    this.currentUserId = student.userId;
    this.onPlayersChange = onPlayersChange;
    this.onRemoteCrash = onRemoteCrash;
    this.remotePlayers.clear();

    if (!isSupabaseConfigured) {
      console.warn('[TyperDashNet] Supabase não está configurado. Modo offline ativo.');
      return;
    }

    const channelName = `typerdash_room_${this.roomCode}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    try {
      this.channel = supabase.channel(channelName)
        .on('broadcast', { event: 'player_tick' }, ({ payload }) => {
          if (!payload || payload.userId === this.currentUserId) return;
          const packet = payload as TyperDashNetPacket;
          this.remotePlayers.set(packet.userId, {
            ...packet,
            lastSeenMs: Date.now()
          });
          this.onPlayersChange?.(new Map(this.remotePlayers));
        })
        .on('broadcast', { event: 'player_crash' }, ({ payload }) => {
          if (!payload || payload.userId === this.currentUserId) return;
          const p = this.remotePlayers.get(payload.userId);
          if (p) {
            p.isAlive = false;
            this.remotePlayers.set(payload.userId, p);
            this.onPlayersChange?.(new Map(this.remotePlayers));
          }
          this.onRemoteCrash?.(payload.userId, payload.distance);
        })
        .subscribe();
    } catch (err) {
      console.warn('[TyperDashNet] Erro ao subscrever canal:', err);
    }

    // Limpeza de jogadores inativos / desconectados (timeout de 6 segundos)
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      let changed = false;
      for (const [id, p] of this.remotePlayers.entries()) {
        if (now - p.lastSeenMs > 6000) {
          this.remotePlayers.delete(id);
          changed = true;
        }
      }
      if (changed) {
        this.onPlayersChange?.(new Map(this.remotePlayers));
      }
    }, 2000);
  }

  public broadcastTick(packet: Omit<TyperDashNetPacket, 'userId' | 'nickname' | 'skin'> & { nickname: string; skin: string }): void {
    if (!this.channel || !this.currentUserId) return;

    const fullPacket: TyperDashNetPacket = {
      userId: this.currentUserId,
      nickname: packet.nickname,
      skin: packet.skin,
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
    } catch (err) {
      // Ignora falhas pontuais de envio para manter 60 FPS
    }
  }

  public broadcastCrash(distance: number): void {
    if (!this.channel || !this.currentUserId) return;
    try {
      this.channel.send({
        type: 'broadcast',
        event: 'player_crash',
        payload: { userId: this.currentUserId, distance }
      });
    } catch {}
  }

  public disconnect(): void {
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
