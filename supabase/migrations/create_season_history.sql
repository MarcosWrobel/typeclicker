-- ==============================================================================
-- Migração Completa: Suporte a Temporadas, Histórico e RPCs
-- ==============================================================================

-- 1. Adiciona a coluna season_bytes na tabela profiles (se não existir)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS season_bytes BIGINT DEFAULT 0;

-- 2. Inicializa season_bytes com os pontos acumulados até hoje
UPDATE public.profiles
SET season_bytes = COALESCE(total_bytes_earned, bytes, 0)
WHERE season_bytes = 0 OR season_bytes IS NULL;

-- 3. Índice para o ranking trimestral
CREATE INDEX IF NOT EXISTS idx_profiles_season_bytes ON public.profiles(season_bytes DESC);

-- 4. Cria a tabela season_history (Hall da Fama)
CREATE TABLE IF NOT EXISTS public.season_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  season_id TEXT NOT NULL,
  season_name TEXT NOT NULL,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  turma TEXT,
  season_bytes BIGINT NOT NULL DEFAULT 0,
  rank_position INTEGER,
  closed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Índice e políticas de RLS para season_history
CREATE INDEX IF NOT EXISTS idx_season_history_season ON public.season_history(season_id, season_bytes DESC);

ALTER TABLE public.season_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Season history viewable by everyone" ON public.season_history;
CREATE POLICY "Season history viewable by everyone" ON public.season_history FOR SELECT USING (true);

-- 6. RPC para encerramento de temporada / Hall da Fama
CREATE OR REPLACE FUNCTION public.close_current_season(
  p_season_id TEXT,
  p_season_name TEXT
) RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  INSERT INTO public.season_history (season_id, season_name, user_id, display_name, turma, season_bytes, rank_position)
  SELECT 
    p_season_id,
    p_season_name,
    p.id,
    p.display_name,
    p.turma,
    p.season_bytes,
    ROW_NUMBER() OVER (ORDER BY p.season_bytes DESC) as rank_position
  FROM public.profiles p
  WHERE p.season_bytes > 0;

  GET DIAGNOSTICS v_count = ROW_COUNT;

  UPDATE public.profiles
  SET season_bytes = 0,
      updated_at = now();

  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Notifica o PostgREST para recarregar o schema cache imediatamente
NOTIFY pgrst, 'reload schema';
