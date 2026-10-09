import { supabase, isSupabaseConfigured } from './supabaseClient';
import { CustomCurricularText, CurricularTrackId } from '../types';
import { auth, checkIsAdminAsync, checkIsSuperAdmin } from './firebaseService';

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

export interface HubConfig {
  disabledGames?: string[];
  featuredGame?: string;
}

export interface SystemSettings {
  activeCode?: string;
  expiresAt?: string;
  expiresAtMs?: number;
  activeTurma?: string | null;
  activeTrack?: CurricularTrackId | null;
  allowedTeachers?: string[];
  focusTimeoutSetting?: number;
  reducedAlerts?: boolean;
  testerEmails?: string[];
  testGrantsHistory?: TestGrantConfig[];
  pendingTestGrants?: Record<string, TestGrantConfig>;
  customTexts?: CustomCurricularText[];
  hubConfig?: HubConfig;
}

let cachedSettings: SystemSettings | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 10_000; // 10s cache de fallback

/**
 * Consulta as configurações do sistema no Supabase
 */
export async function getSystemSettings(): Promise<SystemSettings | null> {
  const now = Date.now();
  if (cachedSettings && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedSettings;
  }

  if (!isSupabaseConfigured) {
    return cachedSettings || {};
  }

  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('payload')
      .eq('id', 'default')
      .maybeSingle();

    if (error) {
      console.warn('Erro ao carregar system_settings do Supabase:', error.message);
      return cachedSettings || {};
    }

    if (data && data.payload) {
      cachedSettings = data.payload as SystemSettings;
      lastFetchTime = now;
      return cachedSettings;
    }

    return cachedSettings || {};
  } catch (err) {
    console.warn('Falha na consulta de system_settings:', err);
    return cachedSettings || {};
  }
}

/**
 * Escuta atualizações de configurações do sistema via Supabase Realtime
 */
export function subscribeToSystemSettings(callback: (settings: SystemSettings | null) => void): () => void {
  // Carga inicial
  getSystemSettings().then((settings) => {
    callback(settings);
  });

  if (!isSupabaseConfigured) {
    return () => {};
  }

  const channelName = `system_settings_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  let channel: ReturnType<typeof supabase.channel> | null = null;
  try {
    channel = supabase.channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'system_settings',
        filter: 'id=eq.default'
      }, (payload) => {
        const newSettings = (payload.new as any)?.payload as SystemSettings | undefined;
        if (newSettings) {
          cachedSettings = newSettings;
          lastFetchTime = Date.now();
          callback(newSettings);
        }
      })
      .subscribe();
  } catch (err) {
    console.warn('Erro ao criar canal realtime de system_settings:', err);
  }

  return () => {
    if (channel) {
      try {
        supabase.removeChannel(channel);
      } catch (err) {
        console.warn('Erro ao remover canal realtime de system_settings:', err);
      }
    }
  };
}

/**
 * Salva ou mescla alterações nas configurações do sistema
 */
export async function saveSystemSettings(updates: Partial<SystemSettings>): Promise<void> {
  const current = (await getSystemSettings()) || {};
  const merged: SystemSettings = { ...current, ...updates };

  cachedSettings = merged;
  lastFetchTime = Date.now();

  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('system_settings')
    .upsert({
      id: 'default',
      payload: merged,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

  if (error) {
    console.error('Erro ao salvar system_settings no Supabase:', error);
    throw error;
  }
}

export const updateSystemSettings = saveSystemSettings;


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
    id: `txt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    createdAt: Date.now(),
    authorName: (user?.displayName || user?.email || 'Professor').trim()
  };

  await saveSystemSettings({ customTexts: [newText, ...currentTexts] });
  return newText;
}

export async function deleteCustomCurricularText(textId: string): Promise<void> {
  const user = auth.currentUser;
  const isStaff = await checkIsAdminAsync(user);
  if (!isStaff) throw new Error('Apenas professores ou administradores podem excluir textos curriculares.');

  const settings = (await getSystemSettings()) || {};
  const currentTexts = settings.customTexts || [];
  const updatedTexts = currentTexts.filter((t) => t.id !== textId);

  await saveSystemSettings({ customTexts: updatedTexts });
}

export async function updateHubConfig(hubConfig: HubConfig): Promise<void> {
  const user = auth.currentUser;
  const isStaff = await checkIsAdminAsync(user);
  if (!isStaff) throw new Error('Apenas professores ou administradores podem configurar o hub.');

  await saveSystemSettings({ hubConfig });
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

  await saveSystemSettings({
    activeCode: code,
    expiresAt: expiresAt.toISOString(),
    expiresAtMs: expiresAt.getTime(),
    activeTurma: targetTurma && targetTurma.trim() !== '' ? targetTurma.trim() : null,
    activeTrack: trackId || 'geral'
  });

  return code;
}

export async function updateActiveSessionTrack(trackId: CurricularTrackId): Promise<void> {
  const user = auth.currentUser;
  const isAdmin = await checkIsAdminAsync(user);
  if (!isAdmin) throw new Error('Não autorizado');

  await saveSystemSettings({ activeTrack: trackId });
}

export async function clearSessionCode(): Promise<void> {
  const user = auth.currentUser;
  const isAdmin = await checkIsAdminAsync(user);
  if (!isAdmin) throw new Error('Não autorizado');

  await saveSystemSettings({
    activeCode: undefined,
    expiresAt: undefined,
    expiresAtMs: undefined,
    activeTurma: null,
    activeTrack: null
  });
}

export async function updateAllowedTeachers(emails: string[]): Promise<void> {
  const user = auth.currentUser;
  if (!checkIsSuperAdmin(user)) throw new Error('Somente Super Admins podem gerenciar professores.');

  await saveSystemSettings({ allowedTeachers: emails });
}

export async function updateAccessibilitySettings(settings: { focusTimeoutSetting?: number; reducedAlerts?: boolean }): Promise<void> {
  const user = auth.currentUser;
  const isAdmin = await checkIsAdminAsync(user);
  if (!isAdmin) throw new Error('Não autorizado: Somente professores podem alterar configurações pedagógicas.');

  await saveSystemSettings(settings);
}

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
  await saveSystemSettings({ testerEmails: updatedList });
  return updatedList;
}

export async function removeTesterEmail(email: string): Promise<string[]> {
  const user = auth.currentUser;
  const isAdmin = await checkIsAdminAsync(user);
  if (!isAdmin) throw new Error('Não autorizado: Somente administradores podem gerenciar e-mails de teste.');

  const cleanEmail = email.trim().toLowerCase();
  const settings = await getSystemSettings();
  const currentList = settings?.testerEmails || [];
  const updatedList = currentList.filter(e => e.toLowerCase() !== cleanEmail);

  await saveSystemSettings({ testerEmails: updatedList });
  return updatedList;
}
