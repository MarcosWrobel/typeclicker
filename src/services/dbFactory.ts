import { IDatabaseService } from './dbInterface';
import { FirebaseAdapter } from './adapters/firebaseAdapter';
import { SupabaseAdapter } from './adapters/supabaseAdapter';
import { isSupabaseConfigured } from './supabaseClient';

const provider = import.meta.env.VITE_DB_PROVIDER || 'firestore';

let dbServiceInstance: IDatabaseService | null = null;

export function getDbService(): IDatabaseService {
  if (!dbServiceInstance) {
    if (provider === 'supabase' && isSupabaseConfigured) {
      console.log('🔌 DB Factory: Inicializando adaptador Supabase (PostgreSQL)');
      dbServiceInstance = new SupabaseAdapter();
    } else if (provider === 'supabase' && !isSupabaseConfigured) {
      console.warn('⚠️ DB Factory: VITE_DB_PROVIDER está como "supabase", mas VITE_SUPABASE_URL ou ANON_KEY não estão configurados. Recorrendo ao adaptador Firebase (Firestore).');
      dbServiceInstance = new FirebaseAdapter();
    } else {
      console.log('🔥 DB Factory: Inicializando adaptador nativo do Firebase (Firestore)');
      dbServiceInstance = new FirebaseAdapter();
    }
  }
  return dbServiceInstance;
}

export const dbService = getDbService();
