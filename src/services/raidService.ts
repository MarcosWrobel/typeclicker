import { supabase, isSupabaseConfigured } from './supabaseClient';
import { ClassroomRaid, ClassroomRaidConfig, RaidParticipant } from '../types/raid';
import { RpgClassType } from '../types/rpgClass';

export const ACTIVE_RAID_DOC_ID = 'active_classroom_raid';

/**
 * Lança uma nova Raid Coletiva de Sala de Aula em tempo real no Supabase
 */
export async function launchClassroomRaid(
  config: ClassroomRaidConfig,
  teacherUser: { uid: string; email?: string | null }
): Promise<ClassroomRaid> {
  const raidId = `raid_${Date.now()}`;
  const startsAtMs = Date.now();
  const timeLimitSeconds = config.timeLimitSeconds && config.timeLimitSeconds > 0 ? config.timeLimitSeconds : 180;
  const expiresAtMs = startsAtMs + timeLimitSeconds * 1000;

  const newRaid: ClassroomRaid = {
    id: raidId,
    bossId: config.bossId,
    bossName: config.bossName.trim() || 'Chefe Quântico',
    bossSubtitle: config.bossSubtitle?.trim() || 'Ameaça Digital Coletiva',
    bossIcon: config.bossIcon || '👹',
    maxHp: config.maxHp && config.maxHp > 0 ? config.maxHp : 30000,
    currentHp: config.maxHp && config.maxHp > 0 ? config.maxHp : 30000,
    timeLimitSeconds,
    startsAtMs,
    expiresAtMs,
    createdAtMs: startsAtMs,
    status: 'in_progress',
    prizeBytes: config.prizeBytes && config.prizeBytes > 0 ? config.prizeBytes : 50000,
    targetTurma: config.targetTurma || 'todas',
    createdBy: teacherUser.uid,
    teacherEmail: teacherUser.email || '',
    participants: {},
    totalDamageDealt: 0
  };

  if (isSupabaseConfigured) {
    const { error } = await supabase.from('arena_rooms').upsert({
      id: ACTIVE_RAID_DOC_ID,
      room_type: 'raid',
      created_by: teacherUser.uid,
      status: 'in_progress',
      data: newRaid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

    if (error) {
      console.error('Erro ao lançar raid no Supabase:', error);
    }
  }

  return newRaid;
}

/**
 * Cancela ou encerra a Raid ativa
 */
export async function cancelClassroomRaid(): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { data } = await supabase.from('arena_rooms').select('data').eq('id', ACTIVE_RAID_DOC_ID).maybeSingle();
  if (!data?.data) return;

  const raid = data.data as ClassroomRaid;
  const updatedRaid: ClassroomRaid = {
    ...raid,
    status: 'cancelled'
  };

  await supabase.from('arena_rooms').update({
    status: 'cancelled',
    data: updatedRaid,
    updated_at: new Date().toISOString()
  }).eq('id', ACTIVE_RAID_DOC_ID);
}

/**
 * Escuta em tempo real o estado da Raid ativa via Supabase Realtime
 */
export function subscribeToActiveRaid(
  callback: (raid: ClassroomRaid | null) => void
): () => void {
  if (!isSupabaseConfigured) {
    callback(null);
    return () => {};
  }

  // Snapshot inicial
  supabase
    .from('arena_rooms')
    .select('data')
    .eq('id', ACTIVE_RAID_DOC_ID)
    .maybeSingle()
    .then(({ data }) => {
      if (data?.data) {
        callback(data.data as ClassroomRaid);
      } else {
        callback(null);
      }
    });

  const channel = supabase.channel('realtime_classroom_raid')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'arena_rooms',
      filter: `id=eq.${ACTIVE_RAID_DOC_ID}`
    }, (payload) => {
      const raidData = (payload.new as any)?.data as ClassroomRaid | undefined;
      callback(raidData || null);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Submete a contribuição de dano do aluno no Boss compartilhado da Raid.
 */
export async function submitRaidContribution(
  raidId: string,
  student: {
    uid: string;
    nome: string;
    apelido?: string;
    avatar?: string;
    turma?: string;
    rpgClass?: RpgClassType;
  },
  damage: number,
  wordsDelta: number,
  wpm: number
): Promise<{ success: boolean; currentHp: number; status: string }> {
  if (damage <= 0) return { success: true, currentHp: 0, status: 'in_progress' };
  if (!isSupabaseConfigured) return { success: false, currentHp: 0, status: 'not_configured' };

  try {
    const { data: snap } = await supabase.from('arena_rooms').select('data').eq('id', ACTIVE_RAID_DOC_ID).maybeSingle();
    if (!snap?.data) {
      return { success: false, currentHp: 0, status: 'not_found' };
    }

    const data = snap.data as ClassroomRaid;
    if (data.id !== raidId || data.status !== 'in_progress') {
      return { success: false, currentHp: data.currentHp || 0, status: data.status };
    }

    // Checa expiração de tempo
    if (Date.now() > data.expiresAtMs) {
      const updatedDefeat: ClassroomRaid = { ...data, status: 'defeat' };
      await supabase.from('arena_rooms').update({
        status: 'defeat',
        data: updatedDefeat,
        updated_at: new Date().toISOString()
      }).eq('id', ACTIVE_RAID_DOC_ID);

      return { success: false, currentHp: data.currentHp, status: 'defeat' };
    }

    const existingP: RaidParticipant = data.participants?.[student.uid] || {
      userId: student.uid,
      nome: student.nome,
      apelido: student.apelido || student.nome,
      avatar: student.avatar || '⚡',
      turma: student.turma || '',
      rpgClass: student.rpgClass || 'warrior',
      damageDealt: 0,
      wordsTyped: 0,
      wpm: Math.round(wpm),
      lastUpdatedMs: Date.now()
    };

    const updatedP: RaidParticipant = {
      ...existingP,
      rpgClass: student.rpgClass || existingP.rpgClass || 'warrior',
      damageDealt: existingP.damageDealt + damage,
      wordsTyped: existingP.wordsTyped + wordsDelta,
      wpm: Math.round(wpm),
      lastUpdatedMs: Date.now()
    };

    const updatedParticipants: Record<string, RaidParticipant> = {
      ...(data.participants || {}),
      [student.uid]: updatedP
    };

    const totalDamage = (data.totalDamageDealt || 0) + damage;
    const newHp = Math.max(0, data.currentHp - damage);
    const isDefeated = newHp <= 0;
    let mvp = data.mvp;

    if (isDefeated) {
      const sorted = Object.values(updatedParticipants).sort((a, b) => b.damageDealt - a.damageDealt);
      if (sorted.length > 0) {
        mvp = sorted[0];
      }
    }

    const updatedRaid: ClassroomRaid = {
      ...data,
      currentHp: newHp,
      totalDamageDealt: totalDamage,
      participants: updatedParticipants,
      status: isDefeated ? 'victory' : 'in_progress',
      ...(isDefeated && mvp ? { mvp } : {})
    };

    await supabase.from('arena_rooms').update({
      status: updatedRaid.status,
      data: updatedRaid,
      updated_at: new Date().toISOString()
    }).eq('id', ACTIVE_RAID_DOC_ID);

    return {
      success: true,
      currentHp: newHp,
      status: isDefeated ? 'victory' : 'in_progress'
    };
  } catch (err) {
    console.error('Erro ao submeter contribuição de raid:', err);
    return { success: false, currentHp: 0, status: 'error' };
  }
}
