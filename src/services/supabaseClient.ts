import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface AppRuntimeEnv {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  VITE_DB_PROVIDER?: string;
  VITE_SUPABASE_FIREBASE_AUTH?: string;
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

/**
 * Quando true, envia o ID token do Firebase ao PostgREST (Supabase Third-Party Auth: Firebase),
 * dando identidade ao Postgres para as policies RLS (`auth.jwt()->>'sub'`).
 * Só habilitar depois de configurar o provedor no painel do Supabase e aplicar
 * `supabase/migrations/secure_rls_firebase_jwt.sql`; caso contrário o token é rejeitado.
 */
export const useFirebaseJwtForSupabase: boolean =
  resolveEnvVar('VITE_SUPABASE_FIREBASE_AUTH').toLowerCase() === 'true';

// Fallback seguro para evitar exceção síncrona no carregamento do módulo caso as variáveis não estejam definidas
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseKey : 'placeholder-anon-key',
  useFirebaseJwtForSupabase
    ? {
        // import dinâmico evita dependência circular com firebaseService
        accessToken: async () => {
          const { auth } = await import('./firebaseService');
          return (await auth.currentUser?.getIdToken()) ?? null;
        }
      }
    : undefined
);
