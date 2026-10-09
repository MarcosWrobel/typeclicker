import { IDatabaseService } from './dbInterface';
import { SupabaseAdapter } from './adapters/supabaseAdapter';

let dbServiceInstance: IDatabaseService | null = null;

export function getDbService(): IDatabaseService {
  if (!dbServiceInstance) {
    dbServiceInstance = new SupabaseAdapter();
  }
  return dbServiceInstance;
}

export const dbService: IDatabaseService = getDbService();

