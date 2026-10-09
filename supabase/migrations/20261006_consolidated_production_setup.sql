-- ==============================================================================
-- TYPECLICKER EDUCA — SCHEMA CONSOLIDADO E MIGRATION TOTAL (SUPABASE)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELAS CORE
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  nickname TEXT,
  avatar TEXT,
  turma TEXT,
  role TEXT DEFAULT 'student',
  bytes NUMERIC DEFAULT 0,
  total_bytes_earned NUMERIC DEFAULT 0,
  season_bytes NUMERIC DEFAULT 0,
  level INTEGER DEFAULT 1,
  level_tokens INTEGER DEFAULT 0,
  duel_tokens INTEGER DEFAULT 0,
  quantum_fragments INTEGER DEFAULT 0,
  prestige_count INTEGER DEFAULT 0,
  rpg_class TEXT,
  equipped_skin TEXT DEFAULT 'classic',
  equipped_frame TEXT,
  equipped_theme TEXT,
  email TEXT,
  schema_version TEXT DEFAULT '2.0.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.game_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  high_score NUMERIC DEFAULT 0,
  current_floor INTEGER DEFAULT 1,
  highest_floor INTEGER DEFAULT 1,
  metrics JSONB DEFAULT '{}'::jsonb,
  state_payload JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, game_id)
);

CREATE TABLE IF NOT EXISTS public.user_cosmetics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  item_category TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, item_id, item_category)
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS public.season_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  season_id TEXT NOT NULL,
  season_name TEXT NOT NULL,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  turma TEXT,
  season_bytes NUMERIC NOT NULL DEFAULT 0,
  rank_position INTEGER,
  closed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. TABELAS DA FASE B (CONFIGURAÇÕES E MULTIPLAYER)
CREATE TABLE IF NOT EXISTS public.system_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

INSERT INTO public.system_settings (id, payload)
VALUES ('default', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.arena_rooms (
  id TEXT PRIMARY KEY,
  room_type TEXT NOT NULL DEFAULT 'duel',
  created_by TEXT,
  status TEXT NOT NULL DEFAULT 'waiting',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. TABELA DE PROFESSORES / ADMINS
CREATE TABLE IF NOT EXISTS public.staff_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT UNIQUE,
  email TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'teacher' CHECK (role IN ('teacher','admin')),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CHECK (user_id IS NOT NULL OR email IS NOT NULL)
);

INSERT INTO public.staff_users (email, role, note)
VALUES 
  ('wrobel.marcos@gmail.com', 'admin', 'Prof. Marcos Wrobel'),
  ('marcos.wrobel@prof.educacao.sp.gov.br', 'admin', 'Prof. Marcos Wrobel (SP)'),
  ('marcos.wrobel@escola.pr.gov.br', 'admin', 'Prof. Marcos Wrobel (SEED-PR)')
ON CONFLICT (email) DO NOTHING;

-- 4. ÍNDICES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_turma ON public.profiles(turma);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON public.profiles(level DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_points ON public.profiles(total_bytes_earned DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_season_bytes ON public.profiles(season_bytes DESC);
CREATE INDEX IF NOT EXISTS idx_game_progress_high_score ON public.game_progress(game_id, high_score DESC);
CREATE INDEX IF NOT EXISTS idx_season_history_season ON public.season_history(season_id, season_bytes DESC);
CREATE INDEX IF NOT EXISTS idx_arena_rooms_type_status ON public.arena_rooms(room_type, status);
CREATE INDEX IF NOT EXISTS idx_arena_rooms_created_at ON public.arena_rooms(created_at DESC);

-- 5. POLICIES E PERMISSÕES (Resolve o erro 42501 e 401 de RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cosmetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.season_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT schemaname, tablename, policyname FROM pg_policies
           WHERE schemaname = 'public'
             AND tablename IN ('profiles','game_progress','user_cosmetics','user_achievements','season_history','system_settings','arena_rooms')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

CREATE POLICY "profiles_allow_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_allow_write" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "game_progress_allow_read" ON public.game_progress FOR SELECT USING (true);
CREATE POLICY "game_progress_allow_write" ON public.game_progress FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "cosmetics_allow_read" ON public.user_cosmetics FOR SELECT USING (true);
CREATE POLICY "cosmetics_allow_write" ON public.user_cosmetics FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "achievements_allow_read" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "achievements_allow_write" ON public.user_achievements FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "season_history_allow_read" ON public.season_history FOR SELECT USING (true);
CREATE POLICY "season_history_allow_write" ON public.season_history FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "system_settings_allow_read" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "system_settings_allow_write" ON public.system_settings FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "arena_rooms_allow_read" ON public.arena_rooms FOR SELECT USING (true);
CREATE POLICY "arena_rooms_allow_write" ON public.arena_rooms FOR ALL USING (true) WITH CHECK (true);

GRANT ALL ON public.profiles, public.game_progress, public.user_cosmetics,
             public.user_achievements, public.season_history,
             public.system_settings, public.arena_rooms TO anon, authenticated;

REVOKE ALL ON public.staff_users FROM anon, authenticated;

-- 6. RPCs ATÔMICAS
CREATE OR REPLACE FUNCTION public.record_game_session(
  p_user_id TEXT,
  p_game_id TEXT,
  p_bytes_earned NUMERIC,
  p_high_score NUMERIC,
  p_metrics JSONB
) RETURNS void AS $$
BEGIN
  INSERT INTO public.game_progress (user_id, game_id, high_score, metrics)
  VALUES (p_user_id, p_game_id, p_high_score, p_metrics)
  ON CONFLICT (user_id, game_id) DO UPDATE SET
    high_score = GREATEST(public.game_progress.high_score, EXCLUDED.high_score),
    metrics = public.game_progress.metrics || EXCLUDED.metrics,
    updated_at = now();

  UPDATE public.profiles
  SET bytes = bytes + p_bytes_earned,
      total_bytes_earned = total_bytes_earned + p_bytes_earned,
      season_bytes = season_bytes + p_bytes_earned,
      updated_at = now()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.close_current_season(
  p_season_id TEXT,
  p_season_name TEXT
) RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  INSERT INTO public.season_history (season_id, season_name, user_id, display_name, turma, season_bytes, rank_position)
  SELECT p_season_id, p_season_name, p.id, p.display_name, p.turma, p.season_bytes,
         ROW_NUMBER() OVER (ORDER BY p.season_bytes DESC)
  FROM public.profiles p
  WHERE p.season_bytes > 0;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  UPDATE public.profiles SET season_bytes = 0, updated_at = now();
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.record_game_session(TEXT, TEXT, NUMERIC, NUMERIC, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.close_current_season(TEXT, TEXT) TO anon, authenticated;

-- 7. ATIVAÇÃO DE WEBSOCKETS (REALTIME)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.system_settings;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.arena_rooms;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
