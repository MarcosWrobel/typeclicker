import { IDatabaseService } from './dbInterface';
import { FirebaseAdapter } from './adapters/firebaseAdapter';
import { SupabaseAdapter } from './adapters/supabaseAdapter';

const provider = import.meta.env.VITE_DB_PROVIDER || 'firestore';

let dbServiceInstance: IDatabaseService | null = null;

export function getDbService(): IDatabaseService {
  if (!dbServiceInstance) {
    if (provider === 'supabase') {
      console.log('🔌 DB Factory: Inicializando adaptador Supabase (PostgreSQL)');
      dbServiceInstance = new SupabaseAdapter();
    } else {
      console.log('🔥 DB Factory: Inicializando adaptador nativo do Firebase (Firestore)');
      dbServiceInstance = new FirebaseAdapter();
    }
  }
  return dbServiceInstance;
}

export const dbService = getDbService();
