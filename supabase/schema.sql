-- SCHEMA SQL DO EDUCA GAMEHUB (SUPABASE)
-- Habilita extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela: public.profiles (Unificação de perfil e economia)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT NOT NULL,
  nickname TEXT,
  avatar TEXT,
  turma TEXT,
  role TEXT DEFAULT 'student',
  bytes BIGINT DEFAULT 0,
  total_bytes_earned BIGINT DEFAULT 0,
  level INTEGER DEFAULT 1,
  level_tokens INTEGER DEFAULT 0,
  duel_tokens INTEGER DEFAULT 0,
  quantum_fragments INTEGER DEFAULT 0,
  prestige_count INTEGER DEFAULT 0,
  rpg_class TEXT,
  equipped_skin TEXT DEFAULT 'classic',
  equipped_frame TEXT,
  equipped_theme TEXT,
  schema_version TEXT DEFAULT '2.0.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Tabela: public.game_progress (Suporte a múltiplos jogos)
CREATE TABLE public.game_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  high_score BIGINT DEFAULT 0,
  current_floor INTEGER DEFAULT 1,
  highest_floor INTEGER DEFAULT 1,
  metrics JSONB DEFAULT '{}'::jsonb,
  state_payload JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, game_id)
);

-- Tabela: public.user_cosmetics
CREATE TABLE public.user_cosmetics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  item_category TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, item_id, item_category)
);

-- Tabela: public.user_achievements
CREATE TABLE public.user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, achievement_id)
);

-- Índices para otimização de consultas e leaderboards
CREATE INDEX idx_profiles_turma ON public.profiles(turma);
CREATE INDEX idx_profiles_level ON public.profiles(level DESC);
CREATE INDEX idx_game_progress_high_score ON public.game_progress(game_id, high_score DESC);

-- POLÍTICAS RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cosmetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles: Leitura pública, escrita apenas pelo dono
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Game Progress: Leitura pública (leaderboard), escrita apenas pelo dono
CREATE POLICY "Game progress viewable by everyone" ON public.game_progress FOR SELECT USING (true);
CREATE POLICY "Users can manage own game progress" ON public.game_progress FOR ALL USING (auth.uid() = user_id);

-- Cosmetics & Achievements: Leitura pública, escrita apenas pelo dono
CREATE POLICY "Cosmetics viewable by everyone" ON public.user_cosmetics FOR SELECT USING (true);
CREATE POLICY "Users can manage own cosmetics" ON public.user_cosmetics FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Achievements viewable by everyone" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "Users can manage own achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);

-- RPC (Stored Procedure) atômica para registro seguro de sessão de jogo e recompensa
CREATE OR REPLACE FUNCTION public.record_game_session(
  p_user_id UUID,
  p_game_id TEXT,
  p_bytes_earned BIGINT,
  p_high_score BIGINT,
  p_metrics JSONB
) RETURNS void AS $$
BEGIN
  -- 1. Atualiza ou insere o progresso no jogo específico
  INSERT INTO public.game_progress (user_id, game_id, high_score, metrics)
  VALUES (p_user_id, p_game_id, p_high_score, p_metrics)
  ON CONFLICT (user_id, game_id) DO UPDATE SET
    high_score = GREATEST(public.game_progress.high_score, EXCLUDED.high_score),
    metrics = public.game_progress.metrics || EXCLUDED.metrics,
    updated_at = now();

  -- 2. Credita a economia global do usuário
  UPDATE public.profiles
  SET 
    bytes = bytes + p_bytes_earned,
    total_bytes_earned = total_bytes_earned + p_bytes_earned,
    updated_at = now()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
