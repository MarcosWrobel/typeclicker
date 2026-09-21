import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  runTransaction,
  collection,
  query,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, getGlobalLeaderboard, LeaderboardEntry, isStaffMember, ADMIN_EMAILS, getSystemSettings } from './firebaseService';
import {
  ClassroomRace,
  ClassroomRaceConfig,
  ClassroomRaceFinisher,
  PresetRaceText
} from '../types/race';

export const ACTIVE_RACE_DOC_ID = 'active_classroom_race';

/**
 * Textos pedagógicos e literários pré-definidos para corridas escolares
 */
export const PRESET_RACE_TEXTS: PresetRaceText[] = [
  {
    id: 'ada_lovelace',
    title: 'A Primeira Programadora: Ada Lovelace',
    category: 'computacao',
    source: 'História da Computação',
    text: 'Ada Lovelace compreendeu que a Máquina Analítica podia manipular símbolos além de números. Ela vislumbrou a criação de algoritmos para compor músicas e produzir arte gráfica, tornando-se a primeira programadora da história da humanidade.'
  },
  {
    id: 'alan_turing',
    title: 'O Enigma de Alan Turing',
    category: 'computacao',
    source: 'Fundamentos da Computação',
    text: 'Durante a Segunda Guerra Mundial, Alan Turing projetou máquinas eletromecânicas capazes de decifrar o código Enigma. Seu trabalho pioneiro estabeleceu as bases matemáticas da ciência da computação e da inteligência artificial moderna.'
  },
  {
    id: 'machado_de_assis',
    title: 'Dom Casmurro: Olhos de Ressaca',
    category: 'literatura',
    source: 'Machado de Assis',
    text: 'Capitu era Capitu, isto é, uma criatura muito particular, mais mulher do que eu era homem. Trazia os olhos de ressaca, daqueles que trazem o mar para dentro da gente e nos arrastam na correnteza dos seus pensamentos misteriosos.'
  },
  {
    id: 'guimaraes_rosa',
    title: 'O Rio e a Coragem',
    category: 'literatura',
    source: 'Guimarães Rosa (Grande Sertão: Veredas)',
    text: 'O correr da vida embrulha tudo. A vida é assim: esquenta e esfria, aperta e daí afrouxa, sossega e depois desinquieta. O que ela quer da gente é coragem. Ser capaz de atravessar o rio mesmo quando a correnteza parece invencível.'
  },
  {
    id: 'metodo_cientifico',
    title: 'O Método Científico & Investigação',
    category: 'ciencia',
    source: 'Ciência & Filosofia Natural',
    text: 'A ciência não é um catálogo de certezas absolutas, mas uma jornada rigorosa de observação, formulação de hipóteses e experimentação constante. Cada erro corrigido abre caminho para uma compreensão mais profunda do universo.'
  },
  {
    id: 'ciberseguranca',
    title: 'Criptografia e Cidadania Digital',
    category: 'inovacao',
    source: 'Segurança da Informação',
    text: 'Em um mundo hiperconectado, a privacidade e a segurança digital tornaram-se pilares da cidadania. Proteger senhas, entender chaves criptográficas e navegar com discernimento é fundamental para salvaguardar a liberdade na era dos dados.'
  }
];

/**
 * Lança uma nova corrida em tempo real através do painel do professor
 */
export async function launchClassroomRace(
  config: ClassroomRaceConfig,
  teacherUser: { uid: string; email?: string | null }
): Promise<ClassroomRace> {
  const raceId = `race_${Date.now()}`;
  const countdownSeconds = config.countdownSeconds && config.countdownSeconds > 0 ? config.countdownSeconds : 5;
  const createdAtMs = Date.now();
  const startsAtMs = createdAtMs + countdownSeconds * 1000;

  const newRace: ClassroomRace = {
    id: raceId,
    title: config.title.trim() || 'Corrida da Turma',
    text: config.text.trim(),
    source: config.source?.trim() || 'Professor',
    targetTurma: config.targetTurma || 'todas',
    countdownSeconds,
    createdAtMs,
    startsAtMs,
    status: 'countdown',
    prizeBytes: config.prizeBytes && config.prizeBytes > 0 ? config.prizeBytes : 25000,
    createdBy: teacherUser.uid,
    teacherEmail: teacherUser.email || '',
    winner: null,
    finishers: []
  };

  const raceRef = doc(db, 'arena_rooms', ACTIVE_RACE_DOC_ID);
  await setDoc(raceRef, newRace);
  return newRace;
}

/**
 * Cancela ou encerra a corrida ativa
 */
export async function cancelClassroomRace(): Promise<void> {
  const raceRef = doc(db, 'arena_rooms', ACTIVE_RACE_DOC_ID);
  await updateDoc(raceRef, {
    status: 'cancelled'
  });
}

/**
 * Escuta em tempo real o estado da corrida ativa na sessão escolar
 */
export function subscribeToActiveRace(
  callback: (race: ClassroomRace | null) => void
): () => void {
  const raceRef = doc(db, 'arena_rooms', ACTIVE_RACE_DOC_ID);
  return onSnapshot(raceRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data() as ClassroomRace;
      callback(data);
    } else {
      callback(null);
    }
  }, (err) => {
    console.warn('Erro ao escutar corrida ativa:', err);
    callback(null);
  });
}

/**
 * Registra a conclusão da corrida pelo aluno via transação atômica no Firestore.
 * O primeiro a concluir é declarado vencedor absoluto da prova.
 */
export async function claimRaceFinish(
  raceId: string,
  student: {
    uid: string;
    nome: string;
    apelido?: string;
    avatar?: string;
    turma: string;
  },
  stats: {
    wpm: number;
    accuracy: number;
    timeMs: number;
  }
): Promise<{ isWinner: boolean; position: number }> {
  const raceRef = doc(db, 'arena_rooms', ACTIVE_RACE_DOC_ID);

  return await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(raceRef);
    if (!snap.exists()) {
      return { isWinner: false, position: 99 };
    }

    const data = snap.data() as ClassroomRace;
    if (data.id !== raceId) {
      return { isWinner: false, position: 99 };
    }

    const currentFinishers = data.finishers || [];
    const existingIndex = currentFinishers.findIndex((f) => f.userId === student.uid);
    if (existingIndex >= 0) {
      // Já registrado anteriormente
      const existing = currentFinishers[existingIndex];
      return {
        isWinner: data.winner?.userId === student.uid,
        position: existing.position
      };
    }

    const position = currentFinishers.length + 1;
    const isWinner = !data.winner;

    const newFinisher: ClassroomRaceFinisher = {
      userId: student.uid,
      nome: student.nome,
      apelido: student.apelido || student.nome,
      avatar: student.avatar || '⚡',
      turma: student.turma || '',
      wpm: Math.round(stats.wpm),
      accuracy: Math.round(stats.accuracy),
      timeMs: stats.timeMs,
      finishedAt: Date.now(),
      position
    };

    const updatedFinishers = [...currentFinishers, newFinisher];
    const updatePayload: Record<string, any> = {
      finishers: updatedFinishers
    };

    if (isWinner) {
      updatePayload.winner = newFinisher;
      updatePayload.status = 'finished';
    }

    transaction.update(raceRef, updatePayload);

    return {
      isWinner,
      position
    };
  });
}

/**
 * Consulta o Ranking Geral de Corridas entre todos os alunos,
 * ordenado estritamente pelo número de vitórias (raceWins) e excluindo professores/admins.
 */
export async function getRaceLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const all = await getGlobalLeaderboard(false);
    
    // Filtro garantido: somente alunos reais (professores/admins expurgados)
    const studentsOnly = all.filter((entry) => !isStaffMember(entry));

    // Ordena primariamente por vitórias de corrida (raceWins), depois por melhor PPM em corrida
    return studentsOnly.sort((a, b) => {
      const winsA = a.raceWins || 0;
      const winsB = b.raceWins || 0;
      if (winsB !== winsA) return winsB - winsA;
      const wpmA = a.bestRaceWpm || a.wpm || 0;
      const wpmB = b.bestRaceWpm || b.wpm || 0;
      return wpmB - wpmA;
    });
  } catch (e) {
    console.error('Erro ao buscar ranking de corridas:', e);
    return [];
  }
}
