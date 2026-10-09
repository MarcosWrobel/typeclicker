-- ==============================================================================
-- TYPECLICKER EDUCA: SINCRONIZAÇÃO CANÔNICA DE NÍVEIS & PROGRESSÃO DE XP
-- ==============================================================================

-- 1. FUNÇÃO DE CÁLCULO DE NÍVEL (ESPELHO DA TABELA DE 100 NÍVEIS)
CREATE OR REPLACE FUNCTION public.calculate_player_level(p_bytes NUMERIC) 
RETURNS INTEGER AS $$
BEGIN
  IF p_bytes IS NULL OR p_bytes <= 0 THEN
    RETURN 1;
  END IF;

  RETURN CASE
    WHEN p_bytes >= 8000000000000 THEN 100
    WHEN p_bytes >= 6971676639115 THEN 99
    WHEN p_bytes >= 6041205791616 THEN 98
    WHEN p_bytes >= 5202928028207 THEN 97
    WHEN p_bytes >= 4451281536246 THEN 96
    WHEN p_bytes >= 3780804761132 THEN 95
    WHEN p_bytes >= 3186139247469 THEN 94
    WHEN p_bytes >= 2662032705767 THEN 93
    WHEN p_bytes >= 2203342335347 THEN 92
    WHEN p_bytes >= 1805038440183 THEN 91
    WHEN p_bytes >= 1462208382140 THEN 90
    WHEN p_bytes >= 1170060926019 THEN 89
    WHEN p_bytes >= 923931043789 THEN 88
    WHEN p_bytes >= 719285262590 THEN 87
    WHEN p_bytes >= 551727664368 THEN 86
    WHEN p_bytes >= 417006677148 THEN 85
    WHEN p_bytes >= 311022843494 THEN 84
    WHEN p_bytes >= 229837818134 THEN 83
    WHEN p_bytes >= 169684947036 THEN 82
    WHEN p_bytes >= 126981938233 THEN 81
    WHEN p_bytes >= 98346397005 THEN 80
    WHEN p_bytes >= 80615463233 THEN 79
    WHEN p_bytes >= 70871690663 THEN 78
    WHEN p_bytes >= 66479288520 THEN 77
    WHEN p_bytes >= 65140136382 THEN 76
    WHEN p_bytes >= 65000000000 THEN 75
    WHEN p_bytes >= 57332994195 THEN 74
    WHEN p_bytes >= 50308329849 THEN 73
    WHEN p_bytes >= 43896629297 THEN 72
    WHEN p_bytes >= 38068642398 THEN 71
    WHEN p_bytes >= 32795251748 THEN 70
    WHEN p_bytes >= 28047478368 THEN 69
    WHEN p_bytes >= 23796487921 THEN 68
    WHEN p_bytes >= 20013597559 THEN 67
    WHEN p_bytes >= 16670283496 THEN 66
    WHEN p_bytes >= 13738189416 THEN 65
    WHEN p_bytes >= 11189135893 THEN 64
    WHEN p_bytes >= 8995130992 THEN 63
    WHEN p_bytes >= 7128382324 THEN 62
    WHEN p_bytes >= 5561310857 THEN 61
    WHEN p_bytes >= 4266566919 THEN 60
    WHEN p_bytes >= 3217048977 THEN 59
    WHEN p_bytes >= 2385925998 THEN 58
    WHEN p_bytes >= 1746664555 THEN 57
    WHEN p_bytes >= 1273062424 THEN 56
    WHEN p_bytes >= 939291400 THEN 55
    WHEN p_bytes >= 719953897 THEN 54
    WHEN p_bytes >= 590161593 THEN 53
    WHEN p_bytes >= 525653030 THEN 52
    WHEN p_bytes >= 502991890 THEN 51
    WHEN p_bytes >= 500000000 THEN 50
    WHEN p_bytes >= 446264480 THEN 49
    WHEN p_bytes >= 396411810 THEN 48
    WHEN p_bytes >= 350312004 THEN 47
    WHEN p_bytes >= 307833943 THEN 46
    WHEN p_bytes >= 268845307 THEN 45
    WHEN p_bytes >= 233212510 THEN 44
    WHEN p_bytes >= 200800621 THEN 43
    WHEN p_bytes >= 171473282 THEN 42
    WHEN p_bytes >= 145092608 THEN 41
    WHEN p_bytes >= 121519079 THEN 40
    WHEN p_bytes >= 100611420 THEN 39
    WHEN p_bytes >= 82226454 THEN 38
    WHEN p_bytes >= 66218941 THEN 37
    WHEN p_bytes >= 52441385 THEN 36
    WHEN p_bytes >= 40743802 THEN 35
    WHEN p_bytes >= 30973450 THEN 34
    WHEN p_bytes >= 22974487 THEN 33
    WHEN p_bytes >= 16587553 THEN 32
    WHEN p_bytes >= 11649230 THEN 31
    WHEN p_bytes >= 7991324 THEN 30
    WHEN p_bytes >= 5439876 THEN 29
    WHEN p_bytes >= 3813713 THEN 28
    WHEN p_bytes >= 2922129 THEN 27
    WHEN p_bytes >= 2560612 THEN 26
    WHEN p_bytes >= 2500000 THEN 25
    WHEN p_bytes >= 2151455 THEN 24
    WHEN p_bytes >= 1831549 THEN 23
    WHEN p_bytes >= 1539862 THEN 22
    WHEN p_bytes >= 1275945 THEN 21
    WHEN p_bytes >= 1039319 THEN 20
    WHEN p_bytes >= 829466 THEN 19
    WHEN p_bytes >= 645830 THEN 18
    WHEN p_bytes >= 487797 THEN 17
    WHEN p_bytes >= 354691 THEN 16
    WHEN p_bytes >= 245754 THEN 15
    WHEN p_bytes >= 160116 THEN 14
    WHEN p_bytes >= 96753 THEN 13
    WHEN p_bytes >= 54406 THEN 12
    WHEN p_bytes >= 31400 THEN 11
    WHEN p_bytes >= 25226 THEN 10
    WHEN p_bytes >= 19698 THEN 9
    WHEN p_bytes >= 14881 THEN 8
    WHEN p_bytes >= 10766 THEN 7
    WHEN p_bytes >= 7341 THEN 6
    WHEN p_bytes >= 4595 THEN 5
    WHEN p_bytes >= 2511 THEN 4
    WHEN p_bytes >= 1072 THEN 3
    WHEN p_bytes >= 250 THEN 2
    ELSE 1
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

GRANT EXECUTE ON FUNCTION public.calculate_player_level(NUMERIC) TO anon, authenticated;

-- 2. TRIGGER PARA MANTER PROFILES.LEVEL SEMPRE ATUALIZADO
CREATE OR REPLACE FUNCTION public.sync_profile_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level := GREATEST(COALESCE(NEW.level, 1), public.calculate_player_level(NEW.total_bytes_earned));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_profiles_level ON public.profiles;
CREATE TRIGGER trg_sync_profiles_level
  BEFORE INSERT OR UPDATE OF total_bytes_earned ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_level();

-- 3. RPC RECORD_GAME_SESSION COM ATUALIZAÇÃO ATÔMICA DO NÍVEL
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
      level = GREATEST(level, public.calculate_player_level(total_bytes_earned + v_bytes_earned)),
      updated_at = now()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.record_game_session(TEXT, TEXT, NUMERIC, NUMERIC, JSONB) TO anon, authenticated;

-- 4. SINCRONIZAÇÃO RETROATIVA DE TODOS OS PERFIS EXISTENTES EM PRODUÇÃO
UPDATE public.profiles
SET level = GREATEST(COALESCE(level, 1), public.calculate_player_level(total_bytes_earned))
WHERE total_bytes_earned > 0;
