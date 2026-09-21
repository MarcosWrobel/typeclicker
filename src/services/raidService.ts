import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  runTransaction
} from 'firebase/firestore';
import { db } from './firebaseService';
import { ClassroomRaid, ClassroomRaidConfig, RaidParticipant } from '../types/raid';
import { RpgClassType } from '../types/rpgClass';

export const ACTIVE_RAID_DOC_ID = 'active_classroom_raid';

/**
 * Lança uma nova Raid Coletiva de Sala de Aula em tempo real
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

  const raidRef = doc(db, 'arena_rooms', ACTIVE_RAID_DOC_ID);
  await setDoc(raidRef, newRaid);
  return newRaid;
}

/**
 * Cancela ou encerra a Raid ativa
 */
export async function cancelClassroomRaid(): Promise<void> {
  const raidRef = doc(db, 'arena_rooms', ACTIVE_RAID_DOC_ID);
  await updateDoc(raidRef, {
    status: 'cancelled'
  });
}

/**
 * Escuta em tempo real o estado da Raid ativa
 */
export function subscribeToActiveRaid(
  callback: (raid: ClassroomRaid | null) => void
): () => void {
  const raidRef = doc(db, 'arena_rooms', ACTIVE_RAID_DOC_ID);
  return onSnapshot(
    raidRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as ClassroomRaid;
        callback(data);
      } else {
        callback(null);
      }
    },
    (err) => {
      console.warn('Erro ao escutar raid ativa:', err);
      callback(null);
    }
  );
}

/**
 * Submete a contribuição de dano do aluno através de transação atômica.
 * Acumula o dano no HP compartilhado do Boss e registra estatísticas do participante.
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

  const raidRef = doc(db, 'arena_rooms', ACTIVE_RAID_DOC_ID);

  return await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(raidRef);
    if (!snap.exists()) {
      return { success: false, currentHp: 0, status: 'not_found' };
    }

    const data = snap.data() as ClassroomRaid;
    if (data.id !== raidId || data.status !== 'in_progress') {
      return { success: false, currentHp: data.currentHp || 0, status: data.status };
    }

    // Checa expiração de tempo
    if (Date.now() > data.expiresAtMs) {
      transaction.update(raidRef, { status: 'defeat' });
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

    const updatePayload: Record<string, any> = {
      currentHp: newHp,
      totalDamageDealt: totalDamage,
      participants: updatedParticipants
    };

    if (isDefeated) {
      updatePayload.status = 'victory';
      if (mvp) {
        updatePayload.mvp = mvp;
      }
    }

    transaction.update(raidRef, updatePayload);

    return {
      success: true,
      currentHp: newHp,
      status: isDefeated ? 'victory' : 'in_progress'
    };
  });
}
