import { IDatabaseService } from './dbInterface';
import { FirebaseAdapter } from './adapters/firebaseAdapter';
import { SupabaseAdapter } from './adapters/supabaseAdapter';
import { isSupabaseConfigured } from './supabaseClient';

function resolveDbProvider(): string {
  const runtimeProvider = typeof window !== 'undefined' ? window.__APP_ENV__?.VITE_DB_PROVIDER : undefined;
  const buildProvider = (import.meta.env as Record<string, string | undefined>)?.VITE_DB_PROVIDER;
  const configured = (runtimeProvider || buildProvider || '').trim().toLowerCase();

  if (configured === 'supabase') return 'supabase';
  if (configured === 'firestore') return 'firestore';

  // Se o Supabase estiver configurado com credenciais válidas e não houver override forçando firestore, ativa supabase
  if (isSupabaseConfigured) {
    return 'supabase';
  }

  return 'firestore';
}

const provider = resolveDbProvider();

let dbServiceInstance: IDatabaseService | null = null;

export function getDbService(): IDatabaseService {
  if (!dbServiceInstance) {
    if (provider === 'supabase' && isSupabaseConfigured) {
      console.log('🔌 DB Factory: Inicializando adaptador Supabase (PostgreSQL)');
      dbServiceInstance = new SupabaseAdapter();
    } else if (provider === 'supabase' && !isSupabaseConfigured) {
      console.warn('⚠️ DB Factory: Provedor configurado como "supabase", mas VITE_SUPABASE_URL ou ANON_KEY não estão configurados. Recorrendo ao adaptador Firebase (Firestore).');
      dbServiceInstance = new FirebaseAdapter();
    } else {
      console.log('🔥 DB Factory: Inicializando adaptador nativo do Firebase (Firestore)');
      dbServiceInstance = new FirebaseAdapter();
    }
  }
  return dbServiceInstance;
}

export const dbService = getDbService();
