import { supabase } from './supabaseClient';

export interface FullSupabaseBackup {
  version: '2.0.0';
  createdAt: string;
  createdBy: string;
  label?: string;
  counts: {
    profiles: number;
    game_progress: number;
    user_cosmetics: number;
    user_achievements: number;
    season_history: number;
  };
  tables: {
    profiles: any[];
    game_progress: any[];
    user_cosmetics: any[];
    user_achievements: any[];
    season_history: any[];
  };
}

export interface RestoreSummary {
  success: boolean;
  restoredCounts: {
    profiles: number;
    game_progress: number;
    user_cosmetics: number;
    user_achievements: number;
    season_history: number;
  };
  errors?: string[];
}

/**
 * Extrai todos os dados essenciais das tabelas do Supabase (PostgreSQL)
 * para um snapshot estruturado em memória.
 */
export async function createSupabaseBackup(
  label: string = 'Snapshot de Segurança do Supabase',
  createdBy: string = 'admin'
): Promise<FullSupabaseBackup> {
  const [
    { data: profiles, error: errProfiles },
    { data: gameProgress, error: errProgress },
    { data: userCosmetics, error: errCosmetics },
    { data: userAchievements, error: errAchievements },
    { data: seasonHistory, error: errSeasons }
  ] = await Promise.all([
    supabase.from('profiles').select('*'),
    supabase.from('game_progress').select('*'),
    supabase.from('user_cosmetics').select('*'),
    supabase.from('user_achievements').select('*'),
    supabase.from('season_history').select('*')
  ]);

  if (errProfiles) throw new Error(`Falha ao exportar tabela 'profiles': ${errProfiles.message}`);
  if (errProgress) throw new Error(`Falha ao exportar tabela 'game_progress': ${errProgress.message}`);
  if (errCosmetics) throw new Error(`Falha ao exportar tabela 'user_cosmetics': ${errCosmetics.message}`);
  if (errAchievements) throw new Error(`Falha ao exportar tabela 'user_achievements': ${errAchievements.message}`);
  if (errSeasons) throw new Error(`Falha ao exportar tabela 'season_history': ${errSeasons.message}`);

  const backupData: FullSupabaseBackup = {
    version: '2.0.0',
    createdAt: new Date().toISOString(),
    createdBy,
    label,
    counts: {
      profiles: profiles?.length || 0,
      game_progress: gameProgress?.length || 0,
      user_cosmetics: userCosmetics?.length || 0,
      user_achievements: userAchievements?.length || 0,
      season_history: seasonHistory?.length || 0
    },
    tables: {
      profiles: profiles || [],
      game_progress: gameProgress || [],
      user_cosmetics: userCosmetics || [],
      user_achievements: userAchievements || [],
      season_history: seasonHistory || []
    }
  };

  return backupData;
}

/**
 * Dispara o download no navegador do snapshot do Supabase em formato .json
 */
export function downloadSupabaseBackupFile(backup: FullSupabaseBackup): void {
  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `typeclicker_supabase_backup_${timestamp}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Restaura tabelas do Supabase a partir de um objeto de backup JSON validado.
 * Aplica upsert idempotente nas tabelas principais.
 */
export async function restoreSupabaseBackup(backup: FullSupabaseBackup): Promise<RestoreSummary> {
  if (!backup || !backup.tables || typeof backup.tables !== 'object') {
    throw new Error('Arquivo de backup inválido: estrutura de tabelas não encontrada.');
  }

  const errors: string[] = [];
  const summary: RestoreSummary = {
    success: true,
    restoredCounts: {
      profiles: 0,
      game_progress: 0,
      user_cosmetics: 0,
      user_achievements: 0,
      season_history: 0
    }
  };

  // 1. Restaurar Profiles (Tabela pai)
  if (Array.isArray(backup.tables.profiles) && backup.tables.profiles.length > 0) {
    const { error } = await supabase.from('profiles').upsert(backup.tables.profiles, { onConflict: 'id' });
    if (error) {
      errors.push(`Erro ao restaurar 'profiles': ${error.message}`);
    } else {
      summary.restoredCounts.profiles = backup.tables.profiles.length;
    }
  }

  // 2. Restaurar Game Progress
  if (Array.isArray(backup.tables.game_progress) && backup.tables.game_progress.length > 0) {
    const { error } = await supabase.from('game_progress').upsert(backup.tables.game_progress, { onConflict: 'user_id,game_id' });
    if (error) {
      errors.push(`Erro ao restaurar 'game_progress': ${error.message}`);
    } else {
      summary.restoredCounts.game_progress = backup.tables.game_progress.length;
    }
  }

  // 3. Restaurar User Cosmetics
  if (Array.isArray(backup.tables.user_cosmetics) && backup.tables.user_cosmetics.length > 0) {
    const { error } = await supabase.from('user_cosmetics').upsert(backup.tables.user_cosmetics, { onConflict: 'user_id,item_id,item_category' });
    if (error) {
      errors.push(`Erro ao restaurar 'user_cosmetics': ${error.message}`);
    } else {
      summary.restoredCounts.user_cosmetics = backup.tables.user_cosmetics.length;
    }
  }

  // 4. Restaurar User Achievements
  if (Array.isArray(backup.tables.user_achievements) && backup.tables.user_achievements.length > 0) {
    const { error } = await supabase.from('user_achievements').upsert(backup.tables.user_achievements, { onConflict: 'user_id,achievement_id' });
    if (error) {
      errors.push(`Erro ao restaurar 'user_achievements': ${error.message}`);
    } else {
      summary.restoredCounts.user_achievements = backup.tables.user_achievements.length;
    }
  }

  // 5. Restaurar Season History
  if (Array.isArray(backup.tables.season_history) && backup.tables.season_history.length > 0) {
    const { error } = await supabase.from('season_history').upsert(backup.tables.season_history, { onConflict: 'id' });
    if (error) {
      errors.push(`Erro ao restaurar 'season_history': ${error.message}`);
    } else {
      summary.restoredCounts.season_history = backup.tables.season_history.length;
    }
  }

  if (errors.length > 0) {
    summary.success = false;
    summary.errors = errors;
  }

  return summary;
}
