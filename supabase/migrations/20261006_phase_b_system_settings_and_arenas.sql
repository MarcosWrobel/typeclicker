-- ==============================================================================
-- FASE B: CONFIGURAÇÕES DOCENTES E ARENAS/RAIDS EM TEMPO REAL NO SUPABASE
-- ==============================================================================

-- Tabela: public.system_settings
CREATE TABLE IF NOT EXISTS public.system_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

INSERT INTO public.system_settings (id, payload)
VALUES ('default', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Tabela: public.arena_rooms
CREATE TABLE IF NOT EXISTS public.arena_rooms (
  id TEXT PRIMARY KEY,
  room_type TEXT NOT NULL DEFAULT 'duel', -- 'duel', 'race', 'raid'
  created_by TEXT,
  status TEXT NOT NULL DEFAULT 'waiting',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_arena_rooms_type_status ON public.arena_rooms(room_type, status);
CREATE INDEX IF NOT EXISTS idx_arena_rooms_created_at ON public.arena_rooms(created_at DESC);

-- Habilita RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_rooms ENABLE ROW LEVEL SECURITY;

-- Limpa policies existentes
DROP POLICY IF EXISTS "system_settings_select" ON public.system_settings;
DROP POLICY IF EXISTS "system_settings_write" ON public.system_settings;
DROP POLICY IF EXISTS "arena_rooms_select" ON public.arena_rooms;
DROP POLICY IF EXISTS "arena_rooms_insert" ON public.arena_rooms;
DROP POLICY IF EXISTS "arena_rooms_update" ON public.arena_rooms;
DROP POLICY IF EXISTS "arena_rooms_delete" ON public.arena_rooms;

-- Policies: system_settings (leitura pública, escrita permitida para anon e authenticated)
CREATE POLICY "system_settings_select" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "system_settings_write" ON public.system_settings FOR ALL USING (true) WITH CHECK (true);

-- Policies: arena_rooms (leitura e escrita permitidas para anon e authenticated)
CREATE POLICY "arena_rooms_select" ON public.arena_rooms FOR SELECT USING (true);
CREATE POLICY "arena_rooms_insert" ON public.arena_rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "arena_rooms_update" ON public.arena_rooms FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "arena_rooms_delete" ON public.arena_rooms FOR DELETE USING (true);

-- Concessões
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_settings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.arena_rooms TO anon, authenticated;

-- Publicação para Supabase Realtime
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.system_settings;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.arena_rooms;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
