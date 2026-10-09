-- ==============================================================================
-- CORREÇÃO DE TIPAGEM: BIGINT -> NUMERIC PARA EVITAR ERRO 22P02
-- O jogo no frontend gera números decimais com multiplicadores e combos
-- (ex: 5440042.400000634), o que estourava o tipo BIGINT no Postgres.
-- ==============================================================================

-- 1. Converte colunas em public.profiles
ALTER TABLE public.profiles 
  ALTER COLUMN bytes TYPE NUMERIC USING ROUND(bytes::numeric),
  ALTER COLUMN total_bytes_earned TYPE NUMERIC USING ROUND(total_bytes_earned::numeric),
  ALTER COLUMN season_bytes TYPE NUMERIC USING ROUND(season_bytes::numeric);

-- 2. Converte high_score em public.game_progress
ALTER TABLE public.game_progress 
  ALTER COLUMN high_score TYPE NUMERIC USING ROUND(high_score::numeric);

-- 3. Converte season_bytes em public.season_history (se existir)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'season_history' AND column_name = 'season_bytes') THEN
    ALTER TABLE public.season_history 
      ALTER COLUMN season_bytes TYPE NUMERIC USING ROUND(season_bytes::numeric);
  END IF;
END $$;

-- 4. Atualiza a RPC record_game_session para aceitar NUMERIC
CREATE OR REPLACE FUNCTION public.record_game_session(
  p_user_id TEXT,
  p_game_id TEXT,
  p_bytes_earned NUMERIC,
  p_high_score NUMERIC,
  p_metrics JSONB
) RETURNS void AS $$
DECLARE
  v_bytes_earned NUMERIC := ROUND(COALESCE(p_bytes_earned, 0));
  v_high_score NUMERIC := ROUND(COALESCE(p_high_score, 0));
BEGIN
  INSERT INTO public.game_progress (user_id, game_id, high_score, metrics)
  VALUES (p_user_id, p_game_id, v_high_score, p_metrics)
  ON CONFLICT (user_id, game_id) DO UPDATE SET
    high_score = GREATEST(public.game_progress.high_score, EXCLUDED.high_score),
    metrics = public.game_progress.metrics || EXCLUDED.metrics,
    updated_at = now();

  UPDATE public.profiles
  SET bytes = bytes + v_bytes_earned,
      total_bytes_earned = total_bytes_earned + v_bytes_earned,
      season_bytes = season_bytes + v_bytes_earned,
      updated_at = now()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.record_game_session(TEXT, TEXT, NUMERIC, NUMERIC, JSONB) TO anon, authenticated;
