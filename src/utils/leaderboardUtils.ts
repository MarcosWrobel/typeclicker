import { LeaderboardEntry, Level100PioneerSlot } from '../types/leaderboard';
import { calculatePlayerRank } from './formatting';

export const ADMIN_EMAILS: string[] = [
  'wrobel.marcos@gmail.com',
  'marcoswrobel@gmail.com',
  'marcos.wrobel@escola.pr.gov.br'
];

/**
 * Fonte única da verificação de administrador master (cliente).
 * A autoridade real continua nas firestore.rules / server.ts; aqui é só decisão de UI.
 * Quando `emailVerified` é informado, exige que seja true (espelha `email_verified` das rules).
 */
export function isSuperAdminEmail(email?: string | null, emailVerified?: boolean): boolean {
  if (!email) return false;
  if (emailVerified === false) return false;
  const clean = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((adm) => adm.toLowerCase() === clean);
}

/**
 * Determina se um registro de ranking pertence a um professor, diretor ou administrador.
 * Garante que contas administrativas nunca apareçam no ranking competitivo dos alunos.
 */
export function isStaffMember(
  entry: { email?: string; isStaff?: boolean; turma?: string; userId?: string; nome?: string },
  staffEmailsSet?: Set<string>,
  staffUserIdsSet?: Set<string>
): boolean {
  if (entry.isStaff) return true;

  if (entry.email) {
    const cleanEmail = entry.email.trim().toLowerCase();
    if (staffEmailsSet && staffEmailsSet.has(cleanEmail)) return true;
    if (ADMIN_EMAILS.some((adm) => adm.toLowerCase() === cleanEmail)) return true;
  }

  if (entry.userId && staffUserIdsSet && staffUserIdsSet.has(entry.userId)) {
    return true;
  }

  // Verifica se a turma registrada indica professor/coordenação/admin
  if (entry.turma) {
    const t = entry.turma.trim().toLowerCase();
    if (/^(prof|professor|professora|admin|superadmin|docente|direcao|coordenacao)/i.test(t)) {
      return true;
    }
  }

  return false;
}

/**
 * Filtra e extrai os 3 primeiros alunos a alcançarem o Nível 100 na história do colégio.
 * Ordenação estritamente cronológica por reachedLevel100At ou updatedAt.
 * Exclui rigorosamente contas de professores e equipe staff.
 */
export function extractLevel100Pioneers(players: LeaderboardEntry[]): Level100PioneerSlot[] {
  // Apenas estudantes com level >= 100
  const eligible = players.filter((p) => {
    if (isStaffMember(p)) return false;
    const effectiveLevel = Math.max(p.level || 1, calculatePlayerRank(p.points || 0).level);
    return effectiveLevel >= 100 || (p as any).isMaxLevel;
  });

  // Ordenação cronológica por data de conquista do nível 100
  eligible.sort((a, b) => {
    const timeA = a.reachedLevel100At
      ? new Date(a.reachedLevel100At).getTime()
      : a.updatedAt
      ? new Date(a.updatedAt).getTime()
      : 0;
    const timeB = b.reachedLevel100At
      ? new Date(b.reachedLevel100At).getTime()
      : b.updatedAt
      ? new Date(b.updatedAt).getTime()
      : 0;
    if (timeA !== timeB) return timeA - timeB;
    return (b.points || 0) - (a.points || 0);
  });

  const top3 = eligible.slice(0, 3);

  return [1, 2, 3].map((rank) => {
    const player = top3[rank - 1];
    return {
      rank: rank as 1 | 2 | 3,
      player,
      reachedAt: player?.reachedLevel100At || player?.updatedAt,
      isFilled: Boolean(player)
    };
  });
}
