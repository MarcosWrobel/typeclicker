import { supabase } from './supabaseClient';

export interface SupabaseMetricsData {
  status: 'online' | 'degraded' | 'offline';
  latencyMs: number;
  timestamp: string;
  tables: {
    profiles: number;
    game_progress: number;
    user_cosmetics: number;
    user_achievements: number;
    season_history: number;
  };
  totalRows: number;
  studentsCount: number;
  teachersCount: number;
  storage: {
    databaseLimitMb: number; // 500 MB (Plano Gratuito do Supabase)
    estimatedUsedMb: number;
    percentUsed: number;
  };
  mau: {
    limitUsers: number; // 50.000 MAU (Plano Gratuito)
    activeUsers: number;
    percentUsed: number;
  };
  environment: string;
  cacheTtlSeconds: number;
  isFromCache?: boolean;
}

let cachedMetrics: SupabaseMetricsData | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 30000; // 30 segundos de cache para evitar sobrecarga de consultas

/**
 * Consulta a contagem exata de linhas por tabela (via head: true, consumo zero de tráfego)
 * e avalia a saúde da conexão com o PostgreSQL no Supabase.
 */
export async function fetchSupabaseMetrics(forceRefresh: boolean = false): Promise<SupabaseMetricsData> {
  const now = Date.now();
  if (!forceRefresh && cachedMetrics && (now - lastFetchTime < CACHE_TTL_MS)) {
    return {
      ...cachedMetrics,
      isFromCache: true
    };
  }

  const startTime = performance.now();

  try {
    const [
      { count: profilesCount, error: errProf },
      { count: progressCount },
      { count: cosmeticsCount },
      { count: achievementsCount },
      { count: seasonsCount },
      { count: teachersCount }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('game_progress').select('*', { count: 'exact', head: true }),
      supabase.from('user_cosmetics').select('*', { count: 'exact', head: true }),
      supabase.from('user_achievements').select('*', { count: 'exact', head: true }),
      supabase.from('season_history').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).or('role.eq.teacher,role.eq.admin')
    ]);

    const latencyMs = Math.round(performance.now() - startTime);

    if (errProf) {
      throw new Error(`Falha ao conectar no Supabase: ${errProf.message}`);
    }

    const pCount = profilesCount || 0;
    const progCount = progressCount || 0;
    const cosCount = cosmeticsCount || 0;
    const achCount = achievementsCount || 0;
    const sCount = seasonsCount || 0;
    const tCount = teachersCount || 0;
    const studentsCount = Math.max(0, pCount - tCount);
    const totalRows = pCount + progCount + cosCount + achCount + sCount;

    // Estimativa conservadora de armazenamento: ~2.5 KB por conjunto de dados de usuário + índices
    const estimatedUsedMb = Math.max(0.2, Number(((totalRows * 1.8) / 1024).toFixed(2)));
    const databaseLimitMb = 500; // Cota do plano Free do Supabase
    const storagePercent = Number(((estimatedUsedMb / databaseLimitMb) * 100).toFixed(2));

    const mauLimit = 50000;
    const mauPercent = Number(((pCount / mauLimit) * 100).toFixed(2));

    const result: SupabaseMetricsData = {
      status: latencyMs > 1200 ? 'degraded' : 'online',
      latencyMs,
      timestamp: new Date().toISOString(),
      tables: {
        profiles: pCount,
        game_progress: progCount,
        user_cosmetics: cosCount,
        user_achievements: achCount,
        season_history: sCount
      },
      totalRows,
      studentsCount,
      teachersCount: tCount,
      storage: {
        databaseLimitMb,
        estimatedUsedMb,
        percentUsed: storagePercent
      },
      mau: {
        limitUsers: mauLimit,
        activeUsers: pCount,
        percentUsed: mauPercent
      },
      environment: import.meta.env.MODE || 'production',
      cacheTtlSeconds: 30,
      isFromCache: false
    };

    cachedMetrics = result;
    lastFetchTime = now;

    return result;
  } catch (error: any) {
    const latencyMs = Math.round(performance.now() - startTime);
    return {
      status: 'offline',
      latencyMs,
      timestamp: new Date().toISOString(),
      tables: {
        profiles: 0,
        game_progress: 0,
        user_cosmetics: 0,
        user_achievements: 0,
        season_history: 0
      },
      totalRows: 0,
      studentsCount: 0,
      teachersCount: 0,
      storage: {
        databaseLimitMb: 500,
        estimatedUsedMb: 0,
        percentUsed: 0
      },
      mau: {
        limitUsers: 50000,
        activeUsers: 0,
        percentUsed: 0
      },
      environment: import.meta.env.MODE || 'production',
      cacheTtlSeconds: 30,
      isFromCache: false
    };
  }
}
