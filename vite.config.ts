import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  let supabaseConfigFile: any = {};
  try {
    const configPath = path.resolve(__dirname, 'supabase-applet-config.json');
    if (fs.existsSync(configPath)) {
      supabaseConfigFile = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
  } catch (e) {
    // silencioso se arquivo não existir
  }

  const supabaseUrl = env.VITE_SUPABASE_URL
    || env.SUPABASE_URL
    || env.VITA_SUPABASE_URL
    || supabaseConfigFile.supabaseUrl
    || supabaseConfigFile.VITE_SUPABASE_URL
    || '';

  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY
    || env.SUPABASE_ANON_KEY
    || env.SUPABASE_KEY
    || env.VITA_SUPABASE_ANON_KEY
    || supabaseConfigFile.supabaseAnonKey
    || supabaseConfigFile.VITE_SUPABASE_ANON_KEY
    || '';

  const dbProvider = env.VITE_DB_PROVIDER
    || env.DB_PROVIDER
    || (supabaseUrl ? 'supabase' : 'firestore');

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
      'import.meta.env.VITE_DB_PROVIDER': JSON.stringify(dbProvider),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
