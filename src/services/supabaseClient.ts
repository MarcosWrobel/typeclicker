import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface AppRuntimeEnv {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  VITE_DB_PROVIDER?: string;
}

declare global {
  interface Window {
    __APP_ENV__?: AppRuntimeEnv;
  }
}

function resolveEnvVar(key: keyof AppRuntimeEnv): string {
  // 1. Injeção de runtime no HTML pelo server.ts (servidor Express em produção / Cloud Run / AI Studio)
  if (typeof window !== 'undefined' && window.__APP_ENV__ && window.__APP_ENV__[key]) {
    const val = window.__APP_ENV__[key];
    if (typeof val === 'string' && val.trim() !== '') return val.trim();
  }
  // 2. Variável de compilação estática do Vite (definida via vite.config.ts ou .env)
  const viteVal = (import.meta.env as Record<string, string | undefined>)[key];
  if (viteVal && typeof viteVal === 'string' && viteVal.trim() !== '') {
    return viteVal.trim();
  }
  return '';
}

const supabaseUrl = resolveEnvVar('VITE_SUPABASE_URL');
const supabaseKey = resolveEnvVar('VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseUrl.trim() !== '' &&
  supabaseKey &&
  supabaseKey.trim() !== '' &&
  !supabaseUrl.includes('placeholder')
);

// Fallback seguro para evitar exceção síncrona no carregamento do módulo caso as variáveis não estejam definidas
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseKey : 'placeholder-anon-key'
);
