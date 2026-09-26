import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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

