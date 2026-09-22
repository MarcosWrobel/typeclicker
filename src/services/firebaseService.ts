import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, orderBy, limit, getDocs, deleteDoc, writeBatch, onSnapshot } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { GameState, CustomCurricularText, CurricularTrackId } from '../types';
import { RpgClassType } from '../types/rpgClass';
import { calculatePlayerRank, calculatePPM, calculateAccuracy } from '../utils/formatting';
import { validateStateSanity } from '../utils/antiCheat';
import { calculateMinBytesForLevel } from '../data/levels';
import { getAllUnlockedCosmetics } from '../constants/cosmeticsCatalog';
import { DEFAULT_COSMETICS } from '../types/cosmetics';
import { UPGRADES } from '../data/upgrades';
import { INITIAL_STATE } from '../utils/storage';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const ADMIN_EMAILS = [
  'wrobel.marcos@gmail.com',
  'marcos.wrobel@escola.pr.gov.br',
  'wrobel.marcos3@gmail.com'
];

export function isDevAdminModeActive(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('typeclicker_dev_admin') === 'true';
}

export function toggleDevAdminMode(enable?: boolean): boolean {
  if (typeof window === 'undefined') return false;
  const next = enable !== undefined ? enable : !isDevAdminModeActive();
  if (next) {
    localStorage.setItem('typeclicker_dev_admin', 'true');
  } else {
    localStorage.removeItem('typeclicker_dev_admin');
  }
  return next;
}

export function checkIsSuperAdmin(user: User | null): boolean {
  if (isDevAdminModeActive()) return true;
  return !!user?.email && ADMIN_EMAILS.includes(user.email);
}

export async function checkIsAdminAsync(user: User | null): Promise<boolean> {
  if (isDevAdminModeActive()) return true;
  if (!user?.email) return false;
  if (checkIsSuperAdmin(user)) return true;
  try {
    const settings = await getSystemSettings();
    return !!settings?.allowedTeachers?.includes(user.email);
  } catch (e) {
    return false;
  }
}

export interface TestGrantConfig {
  id: string;
  email: string;
  addLevelTokens?: number;
  addDuelTokens?: number;
  addQuantumFragments?: number;
  levelAction?: 'add_levels' | 'set_level';
  levelAmount?: number;
  unlockAllCosmetics?: boolean;
  maxUpgrades?: boolean;
  resetToLevel1?: boolean;
  notes?: string;
  grantedAt: string;
  grantedBy: string;
  appliedDirectlyToSave?: boolean;
  resultingLevel?: number;
  resultingLevelTokens?: number;
  resultingDuelTokens?: number;
  resultingQuantumFragments?: number;
}

export interface TestGrantPayload {
  email: string;
  addLevelTokens?: number;
  addDuelTokens?: number;
  addQuantumFragments?: number;
  levelAction?: 'add_levels' | 'set_level';
  levelAmount?: number;
  unlockAllCosmetics?: boolean;
  maxUpgrades?: boolean;
  resetToLevel1?: boolean;
  notes?: string;
}

export interface SystemSettings {
  activeCode?: string;
  expiresAt?: string;
  expiresAtMs?: number;
  activeTurma?: string | null;
  activeTrack?: CurricularTrackId | null;
  allowedTeachers?: string[];
  focusTimeoutSetting?: number; // 5 (padrão), 10, 15 ou 0 (desativado para inclusão)
  reducedAlerts?: boolean; // desativar efeitos visuais estroboscópicos/piscantes nos vírus de rede
  testerEmails?: string[];
  testGrantsHistory?: TestGrantConfig[];
  pendingTestGrants?: Record<string, TestGrantConfig>;
  customTexts?: CustomCurricularText[];
}

export interface FirebaseSavePayload {
  nome: string;
  apelido?: string;
  turma: string;
  level: number;
  points: number;
  wpm: number;
  accuracy?: number;
  saveState: GameState;
  updatedAt: string;
  userId: string;
  email?: string;
  rpgClass?: RpgClassType;
  isClassLocked?: boolean;
  isRpgClassLocked?: boolean;
  // Campos retrocompatíveis para anti-cheat e controle de versão
  schemaVersion?: number;
  flaggedForReview?: boolean;
  flagReason?: string;
  focusTimeoutSetting?: number;
  raceWins?: number;
  racesParticipated?: number;
  bestRaceWpm?: number;
  isStaff?: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  nome: string;
  apelido?: string;
  turma: string;
  level: number;
  points: number;
  wpm: number;
  accuracy?: number;
  avatar?: string;
  updatedAt: string;
  rpgClass?: RpgClassType;
  isClassLocked?: boolean;
  isRpgClassLocked?: boolean;
  flaggedForReview?: boolean;
  flagReason?: string;
  email?: string;
  isStaff?: boolean;
  raceWins?: number;
  racesParticipated?: number;
  bestRaceWpm?: number;
  maxCombo?: number;
  pvpWins?: number;
  pvpMatches?: number;
  pvpPoints?: number;
  bestWpm?: number;
  reachedLevel100At?: string;
  cardFrame?: string;
  achievementsCount?: number;
}

export interface Level100PioneerSlot {
  rank: 1 | 2 | 3;
  player?: LeaderboardEntry;
  reachedAt?: string;
  isFilled: boolean;
}

export interface CloudResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface CloudLoadResponse {
  success: boolean;
  message: string;
  saveState?: Partial<GameState>;
  savedAt?: string;
  level?: number;
  points?: number;
}

export interface DatabaseBackupSummary {
  id: string;
  createdAt: string;
  createdBy: string;
  totalSaves: number;
  totalLeaderboard: number;
  label?: string;
}

export interface FullDatabaseBackup {
  createdAt: string;
  createdBy: string;
  totalSaves: number;
  totalLeaderboard: number;
  label?: string;
  saves: Record<string, FirebaseSavePayload>;
  leaderboard: Record<string, LeaderboardEntry>;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Recursivamente remove todas as chaves com valor `undefined` de um objeto ou array.
 * O Firestore rejeita categoricamente qualquer gravação contendo o valor `undefined`.
 */
export function removeUndefinedFields<T>(obj: T): T {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => removeUndefinedFields(item)) as unknown as T;
  }

  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = typeof value === 'object' && value !== null
        ? removeUndefinedFields(value)
        : value;
    }
  }
  return cleaned as T;
}

// Auth Functions
export async function loginWithGoogle(): Promise<User | null> {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
}

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function saveProgressToCloud(
  state: GameState,
  previousState?: GameState | null,
  elapsedSeconds?: number
): Promise<CloudResponse> {
  const user = auth.currentUser;
  
  if (!user) {
    return { success: false, message: 'Você precisa fazer login com o Google para salvar na nuvem.' };
  }

  const isStaff = await checkIsAdminAsync(user);
  const nome = (state.studentName || user.displayName || (isStaff ? 'Prof. Marcos Wrobel' : 'Aluno')).trim() || 'Aluno Anônimo';
  const apelido = (state.studentNickname || '').trim();
  const rawTurma = (state.studentClass || '').trim();
  const turma = isStaff ? 'Professor' : rawTurma;
  const avatar = state.studentAvatar || (isStaff ? '👨‍🏫' : '👩‍💻');

  const saveId = user.uid;
  const rank = calculatePlayerRank(state.totalBytesEarned);
  const ppm = calculatePPM(state.correctKeys, state.totalActiveSeconds);
  const accuracy = calculateAccuracy(state.correctKeys, state.wrongKeys);

  // Verificação de Sanidade Anti-Cheat
  const validation = validateStateSanity(state, previousState, elapsedSeconds);
  const isFlagged = validation.flagged || !!state.flaggedForReview;
  const flagReason = validation.reason || state.flagReason;

  const sanitizedSaveState: GameState = {
    ...state,
    ...(isStaff ? { studentClass: 'Professor', isClassLocked: true } : {}),
    schemaVersion: 2,
    flaggedForReview: isFlagged,
    lastSyncTimestamp: Date.now()
  };

  if (flagReason) {
    sanitizedSaveState.flagReason = flagReason;
  } else {
    delete sanitizedSaveState.flagReason;
  }

  const savePayload: FirebaseSavePayload = {
    nome,
    turma,
    level: rank.level,
    points: Math.floor(state.totalBytesEarned),
    wpm: ppm,
    accuracy,
    saveState: removeUndefinedFields(sanitizedSaveState),
    updatedAt: new Date().toISOString(),
    userId: user.uid,
    schemaVersion: 2,
    flaggedForReview: isFlagged
  };

  if (apelido) savePayload.apelido = apelido;
  if (user.email) savePayload.email = user.email;
  if (flagReason) savePayload.flagReason = flagReason;
  if (state.rpgClass) savePayload.rpgClass = state.rpgClass;
  if (state.isClassLocked !== undefined) savePayload.isClassLocked = state.isClassLocked;
  if (state.isRpgClassLocked !== undefined) savePayload.isRpgClassLocked = state.isRpgClassLocked;
  if (state.raceWins !== undefined) savePayload.raceWins = state.raceWins;
  if (state.racesParticipated !== undefined) savePayload.racesParticipated = state.racesParticipated;
  if (state.bestRaceWpm !== undefined) savePayload.bestRaceWpm = state.bestRaceWpm;

  const highestWpmTracked = Math.max(
    ppm,
    state.arenaStats?.highestWpm || 0,
    state.bestRaceWpm || 0
  );

  const leaderboardPayload: LeaderboardEntry = {
    userId: user.uid,
    nome,
    turma,
    level: rank.level,
    points: Math.floor(state.totalBytesEarned),
    wpm: ppm,
    accuracy: accuracy || 0,
    avatar,
    updatedAt: new Date().toISOString(),
    flaggedForReview: isFlagged,
    email: user.email || undefined,
    isStaff: isStaff || undefined,
    raceWins: state.raceWins || 0,
    racesParticipated: state.racesParticipated || 0,
    bestRaceWpm: state.bestRaceWpm || 0,
    maxCombo: state.maxCombo || 0,
    pvpWins: state.arenaStats?.wins || 0,
    pvpMatches: state.arenaStats?.matchesPlayed || 0,
    pvpPoints: state.arenaStats?.duelPoints || 0,
    bestWpm: highestWpmTracked
  };

  if (apelido) leaderboardPayload.apelido = apelido;
  if (flagReason) leaderboardPayload.flagReason = flagReason;
  if (state.rpgClass) leaderboardPayload.rpgClass = state.rpgClass;
  if (state.isClassLocked !== undefined) leaderboardPayload.isClassLocked = state.isClassLocked;
  if (state.isRpgClassLocked !== undefined) leaderboardPayload.isRpgClassLocked = state.isRpgClassLocked;
  if (state.reachedLevel100At) leaderboardPayload.reachedLevel100At = state.reachedLevel100At;
  if (state.cosmetics?.equippedCardFrame) leaderboardPayload.cardFrame = state.cosmetics.equippedCardFrame;
  const unlockedAchCount = state.achievements ? Object.keys(state.achievements).length : 0;
  if (unlockedAchCount > 0) leaderboardPayload.achievementsCount = unlockedAchCount;

  try {
    const cleanSavePayload = removeUndefinedFields(savePayload);
    const cleanLeaderboardPayload = removeUndefinedFields(leaderboardPayload);

    const saveRef = doc(db, 'saves', saveId);
    await setDoc(saveRef, cleanSavePayload);
    
    // Alvo para o rank público: Professores e Administradores NUNCA aparecem nos ranks
    const leaderboardRef = doc(db, 'leaderboard', saveId);
    if (isStaff) {
      try {
        await deleteDoc(leaderboardRef);
      } catch (e) {
        // Ignora caso o documento não exista
      }
    } else {
      await setDoc(leaderboardRef, cleanLeaderboardPayload);
    }
    
    return {
      success: true,
      message: 'Progresso salvo na nuvem com sucesso!'
    };
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, `saves/${saveId}`);
    return {
      success: false,
      message: `Erro ao salvar: ${error.message}`
    };
  }
}

export async function loadProgressFromCloud(): Promise<CloudLoadResponse> {
  const user = auth.currentUser;
  
  if (!user) {
    return { success: false, message: 'Você precisa fazer login com o Google para carregar o save.' };
  }

  const saveId = user.uid;

  try {
    const saveRef = doc(db, 'saves', saveId);
    const saveSnap = await getDoc(saveRef);

    if (saveSnap.exists()) {
      const data = saveSnap.data() as FirebaseSavePayload;

      // Normalização e Fallback de dados para garantir retrocompatibilidade com versões legadas
      const isStaff = await checkIsAdminAsync(user);
      const rawSave = data.saveState || ({} as GameState);
      const effectiveTurma = isStaff ? 'Professor' : (rawSave.studentClass || data.turma || '');
      const normalizedState: Partial<GameState> = {
        ...rawSave,
        studentClass: effectiveTurma,
        rpgClass: rawSave.rpgClass || data.rpgClass || undefined,
        isClassLocked: isStaff ? true : (rawSave.isClassLocked ?? data.isClassLocked ?? false),
        isRpgClassLocked: rawSave.isRpgClassLocked ?? data.isRpgClassLocked ?? false,
        schemaVersion: rawSave.schemaVersion ?? data.schemaVersion ?? 1,
        flaggedForReview: rawSave.flaggedForReview ?? data.flaggedForReview ?? false,
        lastSyncTimestamp: rawSave.lastSyncTimestamp ?? Date.now()
      };

      // Auto-cura do documento na nuvem caso o professor tenha uma turma antiga corrompida (ex: 'Professorcíeccír')
      if (isStaff && (data.turma !== 'Professor' || rawSave.studentClass !== 'Professor')) {
        try {
          await setDoc(saveRef, {
            turma: 'Professor',
            saveState: { studentClass: 'Professor', isClassLocked: true }
          }, { merge: true });
        } catch (e) {
          console.error('Error auto-healing teacher turma in Firestore:', e);
        }
      }

      const reason = rawSave.flagReason || data.flagReason;
      if (reason) {
        normalizedState.flagReason = reason;
      } else {
        delete normalizedState.flagReason;
      }

      return {
        success: true,
        message: `Save carregado com sucesso!`,
        saveState: removeUndefinedFields(normalizedState),
        savedAt: new Date(data.updatedAt).toLocaleString('pt-BR'),
        level: data.level,
        points: data.points
      };
    } else {
      return {
        success: false,
        message: `Nenhum save encontrado na sua conta Google.`
      };
    }
  } catch (error: any) {
    handleFirestoreError(error, OperationType.GET, `saves/${saveId}`);
    return {
      success: false,
      message: `Erro ao carregar: ${error.message}`
    };
  }
}

// Cache em memória para o ranking escolar (evita leituras redundantes na cota Spark)
let cachedLeaderboard: { timestamp: number; data: LeaderboardEntry[] } | null = null;
const LEADERBOARD_CACHE_TTL_MS = 40000; // 40 segundos de cache

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

export async function getGlobalLeaderboard(forceRefresh: boolean = false): Promise<LeaderboardEntry[]> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Você precisa estar logado para ver o ranking.');
  }

  const now = Date.now();
  if (!forceRefresh && cachedLeaderboard && now - cachedLeaderboard.timestamp < LEADERBOARD_CACHE_TTL_MS) {
    return cachedLeaderboard.data;
  }

  try {
    const q = query(collection(db, 'leaderboard'), orderBy('points', 'desc'), limit(250));
    const querySnapshot = await getDocs(q);
    
    // Lista unificada de e-mails de staff (Super Admins + Professores autorizados)
    const staffEmails = new Set<string>(ADMIN_EMAILS.map((e) => e.trim().toLowerCase()));
    try {
      const settings = await getSystemSettings();
      if (settings?.allowedTeachers) {
        settings.allowedTeachers.forEach((e) => staffEmails.add(e.trim().toLowerCase()));
      }
    } catch (e) {
      // Ignora falha de settings offline
    }

    const currentUserId = user.uid;
    const isCurrentUserStaff = await checkIsAdminAsync(user);

    const rankings: LeaderboardEntry[] = [];
    querySnapshot.forEach((docSnap) => {
      const entry = docSnap.data() as LeaderboardEntry;
      
      // Se o usuário logado for staff, garante que ele nunca apareça no próprio ranking
      if (isCurrentUserStaff && (entry.userId === currentUserId || docSnap.id === currentUserId)) {
        return;
      }

      // Regra estrita: Professores e Administradores não aparecem nos ranks
      if (isStaffMember(entry, staffEmails)) {
        return;
      }

      rankings.push(entry);
    });
    
    cachedLeaderboard = {
      timestamp: now,
      data: rankings
    };

    return rankings;
  } catch (error: any) {
    handleFirestoreError(error, OperationType.LIST, `leaderboard`);
    return cachedLeaderboard ? cachedLeaderboard.data : [];
  }
}

/**
 * Filtra e extrai os 3 primeiros alunos a alcançarem o Nível 100 na história do colégio.
 * Ordenação estritamente cronológica por reachedLevel100At ou updatedAt.
 * Exclui rigorosamente contas de professores e equipe staff.
 */
export function extractLevel100Pioneers(players: LeaderboardEntry[]): Level100PioneerSlot[] {
  // Apenas estudantes com level >= 100
  const eligible = players.filter(
    (p) => !isStaffMember(p) && (p.level >= 100 || (p as any).isMaxLevel)
  );

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
      player: player || undefined,
      reachedAt: player?.reachedLevel100At || player?.updatedAt,
      isFilled: Boolean(player)
    };
  });
}

export async function getAdminDashboardData(turmaFilter?: string): Promise<LeaderboardEntry[]> {
  const user = auth.currentUser;
  const isAdmin = await checkIsAdminAsync(user);
  if (!isAdmin) {
    throw new Error('Não autorizado');
  }

  try {
    const baseCol = collection(db, 'leaderboard');
    let q;
    const cleanTurma = (turmaFilter || '').trim();
    if (cleanTurma && cleanTurma.toLowerCase() !== 'todas' && cleanTurma.toLowerCase() !== 'all') {
      // Filtra estritamente pela turma selecionada, economizando leituras da cota diária
      q = query(baseCol, where('turma', '==', cleanTurma), limit(150));
    } else {
      q = query(baseCol, orderBy('points', 'desc'), limit(300));
    }

    const querySnapshot = await getDocs(q);
    
    const settings = await getSystemSettings();
    const staffEmails = new Set<string>(ADMIN_EMAILS.map((e) => e.trim().toLowerCase()));
    if (settings?.allowedTeachers) {
      settings.allowedTeachers.forEach((e) => staffEmails.add(e.trim().toLowerCase()));
    }

    const rankings: LeaderboardEntry[] = [];
    querySnapshot.forEach((docSnap) => {
      const entry = docSnap.data() as LeaderboardEntry;
      // Painel do Professor monitora estritamente alunos, ocultando contas de teste de professores/admins
      if (!isStaffMember(entry, staffEmails)) {
        rankings.push(entry);
      }
    });
    
    // Garante ordenação decrescente por pontuação
    rankings.sort((a, b) => (b.points || 0) - (a.points || 0));
    
    return rankings;
  } catch (error: any) {
    handleFirestoreError(error, OperationType.LIST, `leaderboard (admin)`);
    return [];
  }
}

/**
 * Higieniza o ranking público expurgando quaisquer registros remanescentes de professores ou administradores.
 */
export async function sanitizeStaffFromLeaderboard(): Promise<{ removedCount: number; checkedCount: number }> {
  const user = auth.currentUser;
  const isAdmin = await checkIsAdminAsync(user);
  if (!isAdmin) {
    throw new Error('Não autorizado: Somente professores e administradores podem higienizar os rankings.');
  }

  try {
    const settings = await getSystemSettings();
    const staffEmails = new Set<string>(
      [...ADMIN_EMAILS, ...(settings?.allowedTeachers || [])].map((e) => e.trim().toLowerCase())
    );

    const boardSnap = await getDocs(collection(db, 'leaderboard'));
    let removedCount = 0;
    const batch = writeBatch(db);
    let batchCount = 0;

    // Também cruza com UIDs em 'saves' para detectar professores que não tenham o e-mail no doc do leaderboard
    const savesSnap = await getDocs(collection(db, 'saves'));
    const staffUserIds = new Set<string>();
    savesSnap.forEach((sDoc) => {
      const sData = sDoc.data() as FirebaseSavePayload;
      if (sData.email && staffEmails.has(sData.email.trim().toLowerCase())) {
        staffUserIds.add(sDoc.id);
      }
    });

    boardSnap.forEach((docSnap) => {
      const data = docSnap.data() as LeaderboardEntry;
      const isStaffDoc =
        data.isStaff ||
        (data.email && staffEmails.has(data.email.trim().toLowerCase())) ||
        staffUserIds.has(docSnap.id) ||
        (data.turma && /^(prof|professor|professora|admin|superadmin|docente|direcao|coordenacao)/i.test(data.turma.trim().toLowerCase()));

      if (isStaffDoc) {
        batch.delete(docSnap.ref);
        removedCount++;
        batchCount++;
      }
    });

    if (batchCount > 0) {
      await batch.commit();
      cachedLeaderboard = null;
    }

    return { removedCount, checkedCount: boardSnap.size };
  } catch (err: any) {
    handleFirestoreError(err, OperationType.WRITE, 'leaderboard/sanitize');
    return { removedCount: 0, checkedCount: 0 };
  }
}

export async function getSystemSettings(): Promise<SystemSettings | null> {
  try {
    const docRef = doc(db, 'system', 'settings');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as SystemSettings;
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching system settings:', error);
    return null;
  }
}

export function subscribeToSystemSettings(callback: (settings: SystemSettings | null) => void) {
  return onSnapshot(doc(db, 'system', 'settings'), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as SystemSettings);
    } else {
      callback(null);
    }
  });
}

export async function getCustomCurricularTexts(): Promise<CustomCurricularText[]> {
  const settings = await getSystemSettings();
  return settings?.customTexts || [];
}

export async function saveCustomCurricularText(text: Omit<CustomCurricularText, 'id' | 'createdAt'>): Promise<CustomCurricularText> {
  const user = auth.currentUser;
  const isStaff = await checkIsAdminAsync(user);
  if (!isStaff) throw new Error('Apenas professores ou administradores podem cadastrar textos curriculares.');

  const settings = (await getSystemSettings()) || {};
  const currentTexts = settings.customTexts || [];

  const newText: CustomCurricularText = {
    ...text,
    id: `txt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: Date.now(),
    authorName: (user?.displayName || user?.email || 'Professor').trim()
  };

  const updatedTexts = [newText, ...currentTexts];
  const docRef = doc(db, 'system', 'settings');
  await setDoc(docRef, { ...settings, customTexts: updatedTexts }, { merge: true });
  return newText;
}

export async function deleteCustomCurricularText(textId: string): Promise<void> {
  const user = auth.currentUser;
  const isStaff = await checkIsAdminAsync(user);
  if (!isStaff) throw new Error('Apenas professores ou administradores podem excluir textos curriculares.');

  const settings = (await getSystemSettings()) || {};
  const currentTexts = settings.customTexts || [];
  const updatedTexts = currentTexts.filter((t) => t.id !== textId);

  const docRef = doc(db, 'system', 'settings');
  await setDoc(docRef, { ...settings, customTexts: updatedTexts }, { merge: true });
}

export async function generateSessionCode(
  durationHours: number,
  targetTurma?: string | null,
  trackId?: CurricularTrackId | null
): Promise<string> {
  const user = auth.currentUser;
  const isAdmin = await checkIsAdminAsync(user);
  if (!isAdmin) throw new Error('Não autorizado');
  
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + durationHours);
  
  const payload: Partial<SystemSettings> = {
    activeCode: code,
    expiresAt: expiresAt.toISOString(),
    expiresAtMs: expiresAt.getTime(),
    activeTurma: targetTurma && targetTurma.trim() !== '' ? targetTurma.trim() : null,
    activeTrack: trackId || 'geral'
  };
  
  try {
    await setDoc(doc(db, 'system', 'settings'), payload, { merge: true });
    return code;
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, `system/settings`);
    throw error;
  }
}

export async function updateActiveSessionTrack(trackId: CurricularTrackId): Promise<void> {
  const user = auth.currentUser;
  const isAdmin = await checkIsAdminAsync(user);
  if (!isAdmin) throw new Error('Não autorizado');
  try {
    await setDoc(doc(db, 'system', 'settings'), { activeTrack: trackId }, { merge: true });
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, `system/settings`);
    throw error;
  }
}

export async function clearSessionCode(): Promise<void> {
  const user = auth.currentUser;
  const isAdmin = await checkIsAdminAsync(user);
  if (!isAdmin) throw new Error('Não autorizado');
  try {
    await setDoc(doc(db, 'system', 'settings'), {
      activeCode: null,
      expiresAt: null,
      expiresAtMs: null,
      activeTurma: null,
      activeTrack: null
    }, { merge: true });
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, `system/settings`);
    throw error;
  }
}

/**
 * Atualiza o perfil escolar do aluno (turma, classe RPG, travas) diretamente pelo painel do professor.
 */
export async function adminUpdateStudentProfile(
  studentUserId: string,
  updates: {
    turma?: string;
    rpgClass?: RpgClassType;
    isClassLocked?: boolean;
    isRpgClassLocked?: boolean;
  }
): Promise<void> {
  const user = auth.currentUser;
  const isAdmin = await checkIsAdminAsync(user);
  if (!isAdmin) throw new Error('Não autorizado');

  try {
    const cleanUpdates = removeUndefinedFields(updates);
    if (Object.keys(cleanUpdates).length === 0) return;

    // 1. Atualiza documento no leaderboard se existir
    const lbRef = doc(db, 'leaderboard', studentUserId);
    const lbSnap = await getDoc(lbRef);
    if (lbSnap.exists()) {
      await setDoc(lbRef, cleanUpdates, { merge: true });
    }

    // 2. Atualiza documento em saves/{studentUserId}
    const saveRef = doc(db, 'saves', studentUserId);
    const saveSnap = await getDoc(saveRef);
    if (saveSnap.exists()) {
      const saveData = saveSnap.data() as FirebaseSavePayload;
      const rawSaveState = saveData.saveState || ({} as GameState);
      const updatedSaveState: GameState = {
        ...rawSaveState,
        ...(updates.turma !== undefined ? { studentClass: updates.turma } : {}),
        ...(updates.rpgClass !== undefined ? { rpgClass: updates.rpgClass } : {}),
        ...(updates.isClassLocked !== undefined ? { isClassLocked: updates.isClassLocked } : {}),
        ...(updates.isRpgClassLocked !== undefined ? { isRpgClassLocked: updates.isRpgClassLocked } : {})
      };

      await setDoc(
        saveRef,
        {
          ...(updates.turma !== undefined ? { turma: updates.turma } : {}),
          ...(updates.rpgClass !== undefined ? { rpgClass: updates.rpgClass } : {}),
          ...(updates.isClassLocked !== undefined ? { isClassLocked: updates.isClassLocked } : {}),
          ...(updates.isRpgClassLocked !== undefined ? { isRpgClassLocked: updates.isRpgClassLocked } : {}),
          saveState: removeUndefinedFields(updatedSaveState),
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    }
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, `saves/${studentUserId}`);
    throw error;
  }
}

/**
 * Distribui automaticamente as classes RPG (1/3 Guerreiro, 1/3 Arqueiro, 1/3 Mago)
 * de forma balanceada para todos os alunos de uma turma específica.
 */
export async function adminAutoBalanceRpgClasses(
  turma: string
): Promise<{ updatedCount: number; distribution: Record<RpgClassType, number> }> {
  const user = auth.currentUser;
  const isAdmin = await checkIsAdminAsync(user);
  if (!isAdmin) throw new Error('Não autorizado');

  const cleanTurma = (turma || '').trim();
  if (!cleanTurma || cleanTurma.toLowerCase() === 'todas') {
    throw new Error('Selecione uma turma específica para balancear as classes.');
  }

  try {
    const q = query(collection(db, 'leaderboard'), where('turma', '==', cleanTurma));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { updatedCount: 0, distribution: { warrior: 0, archer: 0, mage: 0 } };
    }

    const classesPool: RpgClassType[] = ['warrior', 'archer', 'mage'];
    const distribution: Record<RpgClassType, number> = { warrior: 0, archer: 0, mage: 0 };
    const batch = writeBatch(db);
    let count = 0;

    const docsList = snapshot.docs.map((d) => ({ id: d.id, data: d.data() as LeaderboardEntry }));
    // Ordena alfabeticamente para distribuição estável e justa
    docsList.sort((a, b) => (a.data.nome || '').localeCompare(b.data.nome || ''));

    for (let i = 0; i < docsList.length; i++) {
      const student = docsList[i];
      const assignedClass = classesPool[i % classesPool.length];
      distribution[assignedClass]++;

      // Atualiza leaderboard
      const lbRef = doc(db, 'leaderboard', student.id);
      batch.update(lbRef, {
        rpgClass: assignedClass,
        isRpgClassLocked: true
      });

      // Atualiza saves
      const saveRef = doc(db, 'saves', student.id);
      batch.update(saveRef, {
        rpgClass: assignedClass,
        isRpgClassLocked: true,
        'saveState.rpgClass': assignedClass,
        'saveState.isRpgClassLocked': true
      });

      count++;
    }

    await batch.commit();
    return { updatedCount: count, distribution };
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, `leaderboard/autobalance`);
    throw error;
  }
}

export async function updateAllowedTeachers(emails: string[]): Promise<void> {
  const user = auth.currentUser;
  if (!checkIsSuperAdmin(user)) throw new Error('Somente Super Admins podem gerenciar professores.');
  try {
    await setDoc(doc(db, 'system', 'settings'), { allowedTeachers: emails }, { merge: true });
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, `system/settings`);
    throw error;
  }
}

export async function updateAccessibilitySettings(settings: { focusTimeoutSetting?: number; reducedAlerts?: boolean }): Promise<void> {
  const user = auth.currentUser;
  const isAdmin = await checkIsAdminAsync(user);
  if (!isAdmin) throw new Error('Não autorizado: Somente professores podem alterar configurações pedagógicas.');
  try {
    await setDoc(doc(db, 'system', 'settings'), removeUndefinedFields(settings), { merge: true });
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, `system/settings`);
    throw error;
  }
}

export async function wipeDatabase(): Promise<void> {
  const user = auth.currentUser;
  if (!checkIsSuperAdmin(user)) throw new Error('Somente Super Admins podem executar wipe total.');
  
  try {
    // Apaga saves e leaderboard em batches para escalar melhor
    const savesSnap = await getDocs(collection(db, 'saves'));
    const boardSnap = await getDocs(collection(db, 'leaderboard'));
    
    let batch = writeBatch(db);
    let count = 0;
    const commitPromises: Promise<void>[] = [];

    const processDoc = (d: any) => {
      batch.delete(d.ref);
      count++;
      if (count === 490) { // Firebase max is 500
        commitPromises.push(batch.commit());
        batch = writeBatch(db);
        count = 0;
      }
    };

    savesSnap.forEach(processDoc);
    boardSnap.forEach(processDoc);

    if (count > 0) {
      commitPromises.push(batch.commit());
    }
    
    await Promise.all(commitPromises);
  } catch (error: any) {
    handleFirestoreError(error, OperationType.DELETE, `(wipe all)`);
    throw error;
  }
}

/**
 * Cria um snapshot completo de todos os saves de alunos e rankings.
 * Salva tanto na coleção /backups do Firestore quanto retorna o payload completo para download em arquivo .json.
 */
export async function createDatabaseBackup(label?: string): Promise<FullDatabaseBackup> {
  const user = auth.currentUser;
  const isAdmin = await checkIsAdminAsync(user);
  if (!isAdmin) throw new Error('Não autorizado: Somente professores e administradores podem gerar backups.');

  try {
    const savesSnap = await getDocs(collection(db, 'saves'));
    const boardSnap = await getDocs(collection(db, 'leaderboard'));

    const savesMap: Record<string, FirebaseSavePayload> = {};
    savesSnap.forEach((docSnap) => {
      savesMap[docSnap.id] = docSnap.data() as FirebaseSavePayload;
    });

    const leaderboardMap: Record<string, LeaderboardEntry> = {};
    boardSnap.forEach((docSnap) => {
      leaderboardMap[docSnap.id] = docSnap.data() as LeaderboardEntry;
    });

    const backupDate = new Date().toISOString();
    const backupData: FullDatabaseBackup = {
      createdAt: backupDate,
      createdBy: user?.email || 'admin',
      totalSaves: Object.keys(savesMap).length,
      totalLeaderboard: Object.keys(leaderboardMap).length,
      label: label || `Backup automático de segurança`,
      saves: savesMap,
      leaderboard: leaderboardMap
    };

    // Gera ID com timestamp legível (ex: 2026-09-18_15-30-00)
    const backupId = `bkp_${new Date().toISOString().replace(/[:.]/g, '-')}`;
    const backupDocRef = doc(db, 'backups', backupId);

    await setDoc(backupDocRef, removeUndefinedFields(backupData));

    return backupData;
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, 'backups');
    throw error;
  }
}

/**
 * Lista o histórico de snapshots gerados na nuvem.
 */
export async function listDatabaseBackups(): Promise<DatabaseBackupSummary[]> {
  const user = auth.currentUser;
  const isAdmin = await checkIsAdminAsync(user);
  if (!isAdmin) throw new Error('Não autorizado');

  try {
    const q = query(collection(db, 'backups'), orderBy('createdAt', 'desc'), limit(20));
    const snap = await getDocs(q);
    const list: DatabaseBackupSummary[] = [];

    snap.forEach((docSnap) => {
      const d = docSnap.data() as FullDatabaseBackup;
      list.push({
        id: docSnap.id,
        createdAt: d.createdAt,
        createdBy: d.createdBy,
        totalSaves: d.totalSaves || (d.saves ? Object.keys(d.saves).length : 0),
        totalLeaderboard: d.totalLeaderboard || (d.leaderboard ? Object.keys(d.leaderboard).length : 0),
        label: d.label
      });
    });

    return list;
  } catch (error: any) {
    handleFirestoreError(error, OperationType.LIST, 'backups');
    throw error;
  }
}

/**
 * Carrega os dados de um snapshot específico da nuvem.
 */
export async function getDatabaseBackup(backupId: string): Promise<FullDatabaseBackup | null> {
  const user = auth.currentUser;
  const isAdmin = await checkIsAdminAsync(user);
  if (!isAdmin) throw new Error('Não autorizado');

  try {
    const docSnap = await getDoc(doc(db, 'backups', backupId));
    if (docSnap.exists()) {
      return docSnap.data() as FullDatabaseBackup;
    }
    return null;
  } catch (error: any) {
    handleFirestoreError(error, OperationType.GET, `backups/${backupId}`);
    throw error;
  }
}

/**
 * Restaura um backup a partir de um objeto FullDatabaseBackup (seja carregado da nuvem ou de upload de arquivo .json).
 */
export async function restoreDatabaseBackup(backupData: FullDatabaseBackup): Promise<{ restoredSaves: number; restoredBoard: number }> {
  const user = auth.currentUser;
  const isSuper = checkIsSuperAdmin(user);
  const isAdmin = await checkIsAdminAsync(user);
  if (!isSuper && !isAdmin) throw new Error('Somente administradores ou professores autorizados podem restaurar o banco.');

  if (!backupData || !backupData.saves) {
    throw new Error('Formato de arquivo ou backup inválido.');
  }

  try {
    let batch = writeBatch(db);
    let count = 0;
    const commitPromises: Promise<void>[] = [];

    let restoredSaves = 0;
    let restoredBoard = 0;

    // 1. Restaura cada save
    for (const [userId, savePayload] of Object.entries(backupData.saves)) {
      const saveRef = doc(db, 'saves', userId);
      batch.set(saveRef, removeUndefinedFields(savePayload));
      count++;
      restoredSaves++;

      if (count >= 450) {
        commitPromises.push(batch.commit());
        batch = writeBatch(db);
        count = 0;
      }
    }

    // 2. Restaura o leaderboard correspondente
    if (backupData.leaderboard) {
      for (const [userId, boardPayload] of Object.entries(backupData.leaderboard)) {
        const boardRef = doc(db, 'leaderboard', userId);
        batch.set(boardRef, removeUndefinedFields(boardPayload));
        count++;
        restoredBoard++;

        if (count >= 450) {
          commitPromises.push(batch.commit());
          batch = writeBatch(db);
          count = 0;
        }
      }
    }

    if (count > 0) {
      commitPromises.push(batch.commit());
    }

    await Promise.all(commitPromises);
    return { restoredSaves, restoredBoard };
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, 'saves/restore');
    throw error;
  }
}

/**
 * Remove um snapshot antigo do histórico.
 */
export async function deleteDatabaseBackup(backupId: string): Promise<void> {
  const user = auth.currentUser;
  if (!checkIsSuperAdmin(user)) throw new Error('Somente Super Admins podem remover snapshots históricos.');
  try {
    await deleteDoc(doc(db, 'backups', backupId));
  } catch (error: any) {
    handleFirestoreError(error, OperationType.DELETE, `backups/${backupId}`);
    throw error;
  }
}

export interface MigrationSummary {
  totalScanned: number;
  totalMigrated: number;
  alreadyUpToDate: number;
  errors: string[];
}

/**
 * Normaliza e migra documentos de save antigos no Firestore para schemaVersion: 2,
 * garantindo total retrocompatibilidade e sem corrupção de saves de alunos do Colégio Leopoldina.
 */
export async function migrateSchemasInFirestore(dryRun = false): Promise<MigrationSummary> {
  const user = auth.currentUser;
  const isSuper = checkIsSuperAdmin(user);
  const isAdmin = await checkIsAdminAsync(user);
  if (!isSuper && !isAdmin) {
    throw new Error('Somente administradores autorizados podem rodar a migração de schema.');
  }

  const summary: MigrationSummary = {
    totalScanned: 0,
    totalMigrated: 0,
    alreadyUpToDate: 0,
    errors: []
  };

  try {
    const savesSnap = await getDocs(collection(db, 'saves'));
    summary.totalScanned = savesSnap.size;

    let batch = writeBatch(db);
    let batchCount = 0;
    const commitPromises: Promise<void>[] = [];

    savesSnap.forEach((docSnap) => {
      const data = docSnap.data() as FirebaseSavePayload;
      const currentVersion = data.schemaVersion ?? data.saveState?.schemaVersion ?? 1;

      if (currentVersion >= 2 && data.saveState?.schemaVersion === 2) {
        summary.alreadyUpToDate++;
        return;
      }

      // Normalização preservando todos os campos existentes sem perda
      const currentSaveState = data.saveState || ({} as GameState);
      const reason = currentSaveState.flagReason || data.flagReason;

      const normalizedSaveState: GameState = {
        ...currentSaveState,
        schemaVersion: 2,
        flaggedForReview: currentSaveState.flaggedForReview ?? data.flaggedForReview ?? false,
        lastSyncTimestamp: currentSaveState.lastSyncTimestamp ?? Date.now(),
        // Garante integridade de arrays e campos numéricos pedagógicos essenciais
        completedChallenges: currentSaveState.completedChallenges || [],
        upgrades: currentSaveState.upgrades || {},
        correctKeys: currentSaveState.correctKeys || 0,
        wrongKeys: currentSaveState.wrongKeys || 0,
        totalActiveSeconds: currentSaveState.totalActiveSeconds || 0,
        prestigeCores: currentSaveState.prestigeCores || 0,
        prestigeCount: currentSaveState.prestigeCount || 0
      };

      if (reason) {
        normalizedSaveState.flagReason = reason;
      } else {
        delete normalizedSaveState.flagReason;
      }

      const updatedDoc: Partial<FirebaseSavePayload> = {
        schemaVersion: 2,
        flaggedForReview: normalizedSaveState.flaggedForReview,
        saveState: removeUndefinedFields(normalizedSaveState)
      };

      if (reason) {
        updatedDoc.flagReason = reason;
      }

      if (!dryRun) {
        batch.set(docSnap.ref, removeUndefinedFields(updatedDoc), { merge: true });
        batchCount++;

        if (batchCount >= 450) {
          commitPromises.push(batch.commit());
          batch = writeBatch(db);
          batchCount = 0;
        }
      }

      summary.totalMigrated++;
    });

    if (!dryRun && batchCount > 0) {
      commitPromises.push(batch.commit());
    }

    if (!dryRun) {
      await Promise.all(commitPromises);
    }

    return summary;
  } catch (err: any) {
    summary.errors.push(err.message || String(err));
    return summary;
  }
}

/**
 * Adiciona um novo e-mail à lista de testadores autorizados a receber recursos pedagógicos de teste.
 */
export async function addTesterEmail(email: string): Promise<string[]> {
  const user = auth.currentUser;
  const isAdmin = await checkIsAdminAsync(user);
  if (!isAdmin) throw new Error('Não autorizado: Somente administradores podem gerenciar e-mails de teste.');

  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('E-mail inválido.');
  }

  const settings = await getSystemSettings();
  const currentList = settings?.testerEmails || [];
  if (currentList.map(e => e.toLowerCase()).includes(cleanEmail)) {
    return currentList;
  }

  const updatedList = [...currentList, cleanEmail];
  await setDoc(doc(db, 'system', 'settings'), { testerEmails: updatedList }, { merge: true });
  return updatedList;
}

/**
 * Remove um e-mail da lista de testadores autorizados.
 */
export async function removeTesterEmail(email: string): Promise<string[]> {
  const user = auth.currentUser;
  const isAdmin = await checkIsAdminAsync(user);
  if (!isAdmin) throw new Error('Não autorizado: Somente administradores podem gerenciar e-mails de teste.');

  const cleanEmail = email.trim().toLowerCase();
  const settings = await getSystemSettings();
  const currentList = settings?.testerEmails || [];
  const updatedList = currentList.filter(e => e.toLowerCase() !== cleanEmail);

  await setDoc(doc(db, 'system', 'settings'), { testerEmails: updatedList }, { merge: true });
  return updatedList;
}

/**
 * Busca save de aluno existente no Firestore a partir do e-mail.
 */
export async function findUserSaveByEmail(email: string): Promise<{ docId: string; data: FirebaseSavePayload } | null> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return null;
  const isTeacher = ADMIN_EMAILS.some((adm) => adm.toLowerCase() === cleanEmail);

  try {
    const q = query(collection(db, 'saves'), where('email', '==', email.trim()), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docId = snap.docs[0].id;
      const data = snap.docs[0].data() as FirebaseSavePayload;
      if (isTeacher && (data.turma !== 'Professor' || data.saveState?.studentClass !== 'Professor')) {
        data.turma = 'Professor';
        if (data.saveState) {
          data.saveState.studentClass = 'Professor';
          data.saveState.isClassLocked = true;
        }
        await setDoc(doc(db, 'saves', docId), {
          turma: 'Professor',
          saveState: { studentClass: 'Professor', isClassLocked: true }
        }, { merge: true });
      }
      return { docId, data };
    }
  } catch (e) {
    // Fallback caso a query direta por campo email precise de índice
  }

  try {
    const allSaves = await getDocs(collection(db, 'saves'));
    for (const d of allSaves.docs) {
      const data = d.data() as FirebaseSavePayload;
      if (data.email?.toLowerCase() === cleanEmail || d.id.toLowerCase() === cleanEmail) {
        if (isTeacher && (data.turma !== 'Professor' || data.saveState?.studentClass !== 'Professor')) {
          data.turma = 'Professor';
          if (data.saveState) {
            data.saveState.studentClass = 'Professor';
            data.saveState.isClassLocked = true;
          }
          await setDoc(doc(db, 'saves', d.id), {
            turma: 'Professor',
            saveState: { studentClass: 'Professor', isClassLocked: true }
          }, { merge: true });
        }
        return { docId: d.id, data };
      }
    }
  } catch (e) {
    console.error('Error scanning saves by email:', e);
  }

  return null;
}

/**
 * Aplica recursos de teste para um e-mail indicado:
 * - Adiciona tokens de nível e moedas de duelo
 * - Sobe de nível de forma gradativa (+1, +5, +10, etc.) calculando bytes e pontos proporcionalmente
 * - Opcionalmente desbloqueia todos os cosméticos ou maximiza upgrades
 * - Atualiza o Firestore imediatamente (se o save já existir) e registra a concessão pendente + histórico em system/settings.
 */
export async function applyTestResourcesToEmail(
  grant: TestGrantPayload
): Promise<{ success: boolean; message: string; record: TestGrantConfig; updatedSaveState?: GameState }> {
  const user = auth.currentUser;
  const isAdmin = await checkIsAdminAsync(user);
  if (!isAdmin) {
    throw new Error('Não autorizado: Somente administradores podem conceder recursos de teste.');
  }

  const cleanEmail = grant.email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Informe um e-mail válido para conceder os recursos.');
  }

  // 1. Garante que o e-mail está na lista de testadores
  const settings = await getSystemSettings();
  const currentTesters = [...(settings?.testerEmails || [])];
  if (!currentTesters.map(e => e.toLowerCase()).includes(cleanEmail)) {
    currentTesters.push(cleanEmail);
  }

  // 2. Busca save existente no Firestore
  const existingSave = await findUserSaveByEmail(cleanEmail);

  let targetSaveState: GameState;
  let resultingLevel = 1;
  let resultingTokens = 0;
  let resultingDuelTokens = 0;
  let resultingQuantumFragments = 0;
  let appliedDirectly = false;

  if (existingSave) {
    targetSaveState = {
      ...INITIAL_STATE,
      ...(existingSave.data.saveState || {})
    };
    appliedDirectly = true;
  } else {
    targetSaveState = {
      ...INITIAL_STATE,
      studentName: cleanEmail.split('@')[0],
      cosmetics: { ...DEFAULT_COSMETICS }
    };
  }

  // Inicializa cosméticos se ausente
  const cosmetics = targetSaveState.cosmetics ? { ...targetSaveState.cosmetics } : { ...DEFAULT_COSMETICS };

  // Adiciona Moedas de Nível (Tokens)
  if (grant.addLevelTokens && grant.addLevelTokens > 0) {
    cosmetics.levelTokens = (cosmetics.levelTokens || 0) + grant.addLevelTokens;
  }

  // Adiciona Moedas de Duelo (Arena Coins)
  if (grant.addDuelTokens && grant.addDuelTokens > 0) {
    cosmetics.duelTokens = (cosmetics.duelTokens || 0) + grant.addDuelTokens;
  }

  // Adiciona Fragmentos Quânticos (Moeda Endgame Nível 100)
  if (grant.addQuantumFragments && grant.addQuantumFragments > 0) {
    cosmetics.quantumFragments = (cosmetics.quantumFragments || 0) + grant.addQuantumFragments;
  }

  // Desbloqueio completo de cosméticos se solicitado
  if (grant.unlockAllCosmetics) {
    targetSaveState.cosmetics = getAllUnlockedCosmetics(cosmetics);
  } else {
    targetSaveState.cosmetics = cosmetics;
  }

  // Subir de nível de forma gradativa (ou definir nível)
  const currentRank = calculatePlayerRank(targetSaveState.totalBytesEarned || 0);
  let targetLevel = currentRank.level;

  if (grant.levelAction === 'add_levels') {
    const increment = Math.max(1, grant.levelAmount || 1);
    targetLevel = Math.min(100, currentRank.level + increment);
  } else if (grant.levelAction === 'set_level') {
    targetLevel = Math.min(100, Math.max(1, grant.levelAmount || 1));
  }

  if (grant.resetToLevel1) {
    targetLevel = 1;
    targetSaveState.totalBytesEarned = 0;
    targetSaveState.bytes = 0;
    targetSaveState.cosmetics = { ...DEFAULT_COSMETICS };
  } else if (targetLevel !== currentRank.level || targetSaveState.totalBytesEarned === 0) {
    const minBytesForTarget = calculateMinBytesForLevel(targetLevel);
    targetSaveState.totalBytesEarned = Math.max(targetSaveState.totalBytesEarned || 0, minBytesForTarget);
    targetSaveState.bytes = Math.max(targetSaveState.bytes || 0, minBytesForTarget);
  }

  // Upgrades se solicitado
  if (grant.maxUpgrades) {
    const maxUpgrades: Record<string, number> = {};
    for (const u of UPGRADES) {
      maxUpgrades[u.id] = 50;
    }
    targetSaveState.upgrades = maxUpgrades;
  }

  const finalRank = calculatePlayerRank(targetSaveState.totalBytesEarned || 0);
  resultingLevel = finalRank.level;
  resultingTokens = targetSaveState.cosmetics?.levelTokens || 0;
  resultingDuelTokens = targetSaveState.cosmetics?.duelTokens || 0;
  const isTeacherTarget = ADMIN_EMAILS.some((adm) => adm.toLowerCase() === cleanEmail);
  if (isTeacherTarget) {
    targetSaveState.studentClass = 'Professor';
    targetSaveState.isClassLocked = true;
  }

  // Se o save do aluno já existe no Firestore, atualiza imediatamente na nuvem
  if (existingSave) {
    const updatedSavePayload: FirebaseSavePayload = {
      ...existingSave.data,
      turma: isTeacherTarget ? 'Professor' : existingSave.data.turma,
      level: finalRank.level,
      points: Math.floor(targetSaveState.totalBytesEarned),
      saveState: removeUndefinedFields(targetSaveState),
      updatedAt: new Date().toISOString(),
      email: existingSave.data.email || cleanEmail
    };

    await setDoc(doc(db, 'saves', existingSave.docId), removeUndefinedFields(updatedSavePayload));

    // Atualiza também o leaderboard do aluno correspondente
    const boardRef = doc(db, 'leaderboard', existingSave.docId);
    const boardSnap = await getDoc(boardRef);
    if (boardSnap.exists()) {
      const bData = boardSnap.data() as LeaderboardEntry;
      await setDoc(boardRef, removeUndefinedFields({
        ...bData,
        level: finalRank.level,
        points: Math.floor(targetSaveState.totalBytesEarned),
        updatedAt: new Date().toISOString()
      }), { merge: true });
    }
  }

  // Monta registro da concessão
  const grantRecord: TestGrantConfig = {
    id: `grant_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    addLevelTokens: grant.addLevelTokens,
    addDuelTokens: grant.addDuelTokens,
    addQuantumFragments: grant.addQuantumFragments,
    levelAction: grant.levelAction,
    levelAmount: grant.levelAmount,
    unlockAllCosmetics: grant.unlockAllCosmetics,
    maxUpgrades: grant.maxUpgrades,
    resetToLevel1: grant.resetToLevel1,
    notes: grant.notes,
    grantedAt: new Date().toISOString(),
    grantedBy: user?.email || 'admin',
    appliedDirectlyToSave: appliedDirectly,
    resultingLevel,
    resultingLevelTokens: resultingTokens,
    resultingDuelTokens: resultingDuelTokens,
    resultingQuantumFragments: resultingQuantumFragments
  };

  // Atualiza system/settings com a concessão pendente e histórico (audit trail)
  const currentHistory = settings?.testGrantsHistory || [];
  const updatedHistory = [grantRecord, ...currentHistory].slice(0, 50); // Últimas 50 ações
  const pendingGrants = { ...(settings?.pendingTestGrants || {}) };
  pendingGrants[cleanEmail] = grantRecord;

  await setDoc(
    doc(db, 'system', 'settings'),
    removeUndefinedFields({
      testerEmails: currentTesters,
      pendingTestGrants: pendingGrants,
      testGrantsHistory: updatedHistory
    }),
    { merge: true }
  );

  let message = `Recursos de teste concedidos com sucesso para ${cleanEmail}!`;
  if (appliedDirectly) {
    message += ` Save atualizado no Firestore (Nível: ${resultingLevel}, Tokens: ${resultingTokens}, Duelos: ${resultingDuelTokens}).`;
  } else {
    message += ` Concessão agendada na nuvem. Os recursos serão sincronizados assim que ${cleanEmail} fizer login.`;
  }

  return {
    success: true,
    message,
    record: grantRecord,
    updatedSaveState: targetSaveState
  };
}

/**
 * Aplica concessões pendentes quando um usuário faz login ou sincroniza.
 */
export async function claimPendingTestGrants(
  userEmail: string,
  currentState: GameState
): Promise<{ claimed: boolean; updatedState: GameState; message?: string }> {
  if (!userEmail) return { claimed: false, updatedState: currentState };
  const cleanEmail = userEmail.trim().toLowerCase();

  try {
    const settings = await getSystemSettings();
    const grant = settings?.pendingTestGrants?.[cleanEmail];
    if (!grant) {
      return { claimed: false, updatedState: currentState };
    }

    const updatedState: GameState = {
      ...currentState,
      cosmetics: currentState.cosmetics ? { ...currentState.cosmetics } : { ...DEFAULT_COSMETICS }
    };

    let modified = false;

    // Tokens
    if (grant.addLevelTokens && grant.addLevelTokens > 0) {
      updatedState.cosmetics!.levelTokens = (updatedState.cosmetics!.levelTokens || 0) + grant.addLevelTokens;
      modified = true;
    }
    if (grant.addDuelTokens && grant.addDuelTokens > 0) {
      updatedState.cosmetics!.duelTokens = (updatedState.cosmetics!.duelTokens || 0) + grant.addDuelTokens;
      modified = true;
    }
    if (grant.addQuantumFragments && grant.addQuantumFragments > 0) {
      updatedState.cosmetics!.quantumFragments = (updatedState.cosmetics!.quantumFragments || 0) + grant.addQuantumFragments;
      modified = true;
    }

    // Nível
    if (grant.levelAction === 'add_levels') {
      const currentRank = calculatePlayerRank(updatedState.totalBytesEarned || 0);
      const targetLevel = Math.min(100, currentRank.level + (grant.levelAmount || 1));
      const requiredBytes = calculateMinBytesForLevel(targetLevel);
      updatedState.totalBytesEarned = Math.max(updatedState.totalBytesEarned || 0, requiredBytes);
      updatedState.bytes = Math.max(updatedState.bytes || 0, requiredBytes);
      modified = true;
    } else if (grant.levelAction === 'set_level') {
      const targetLevel = Math.min(100, Math.max(1, grant.levelAmount || 1));
      const requiredBytes = calculateMinBytesForLevel(targetLevel);
      updatedState.totalBytesEarned = Math.max(updatedState.totalBytesEarned || 0, requiredBytes);
      updatedState.bytes = Math.max(updatedState.bytes || 0, requiredBytes);
      modified = true;
    }

    // Cosméticos
    if (grant.unlockAllCosmetics) {
      updatedState.cosmetics = getAllUnlockedCosmetics(updatedState.cosmetics);
      modified = true;
    }

    // Upgrades
    if (grant.maxUpgrades) {
      const maxUpgrades: Record<string, number> = {};
      for (const u of UPGRADES) {
        maxUpgrades[u.id] = 50;
      }
      updatedState.upgrades = maxUpgrades;
      modified = true;
    }

    // Limpa a concessão pendente para não conceder infinitamente
    const pendingGrants = { ...(settings?.pendingTestGrants || {}) };
    delete pendingGrants[cleanEmail];

    await setDoc(
      doc(db, 'system', 'settings'),
      removeUndefinedFields({ pendingTestGrants: pendingGrants }),
      { merge: true }
    );

    return {
      claimed: modified,
      updatedState,
      message: `Você recebeu recursos de teste do professor!`
    };
  } catch (e) {
    console.error('Error claiming pending test grants:', e);
    return { claimed: false, updatedState: currentState };
  }
}


