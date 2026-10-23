-- ─────────────────────────────────────────────────────────────
-- Migração: Correção de Sobrecarga Duplicada da RPC record_game_session (PGRST203)
-- Remove as versões conflitantes de BIGINT e NUMERIC e recria uma única função canônica
-- ─────────────────────────────────────────────────────────────

-- 1. Remove explicitamente ambas as assinaturas sobrecarregadas que causam o erro PGRST203
DROP FUNCTION IF EXISTS public.record_game_session(TEXT, TEXT, BIGINT, BIGINT, JSONB);
DROP FUNCTION IF EXISTS public.record_game_session(TEXT, TEXT, NUMERIC, NUMERIC, JSONB);

-- 2. Recria a função canônica única com NUMERIC (arredondamento seguro para inteiros)
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
  c_max_bytes_per_session CONSTANT NUMERIC := 100000;
BEGIN
  -- Validação de limite máximo de bytes por partida (prevenção de anomalias)
  IF v_bytes_earned < 0 OR v_bytes_earned > c_max_bytes_per_session THEN
    RAISE EXCEPTION 'Quantidade de bytes fora do limite permitido' USING ERRCODE = '22023';
  END IF;

  -- Upsert do progresso do jogo na tabela game_progress
  INSERT INTO public.game_progress (user_id, game_id, high_score, metrics)
  VALUES (p_user_id, p_game_id, v_high_score, p_metrics)
  ON CONFLICT (user_id, game_id) DO UPDATE SET
    high_score = GREATEST(public.game_progress.high_score, EXCLUDED.high_score),
    metrics = public.game_progress.metrics || EXCLUDED.metrics,
    updated_at = now();

  -- Atualização atômica do saldo do perfil do aluno
  UPDATE public.profiles
  SET bytes = bytes + v_bytes_earned,
      total_bytes_earned = total_bytes_earned + v_bytes_earned,
      season_bytes = season_bytes + v_bytes_earned,
      updated_at = now()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Concede permissão de execução
GRANT EXECUTE ON FUNCTION public.record_game_session(TEXT, TEXT, NUMERIC, NUMERIC, JSONB) TO anon, authenticated;
