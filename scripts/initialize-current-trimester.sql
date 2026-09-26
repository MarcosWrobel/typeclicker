-- ==============================================================================
-- SCRIPT DE INICIALIZAÇÃO: 3º TRIMESTRE DE 2026 (EDUCA GAMEHUB)
-- ==============================================================================
-- Este script inicializa a pontuação do Trimestre Atual (season_bytes) para todos os
-- 161 perfis de alunos migrados do Firestore, copiando o saldo histórico acumulado.
-- Isso garante que nenhum aluno perca a produção letiva realizada nas semanas anteriores.
--
-- Execute este script no SQL Editor do Supabase Dashboard.
-- ==============================================================================

-- 1. Garante que a coluna season_bytes existe e tem valor inicial
UPDATE public.profiles
SET season_bytes = COALESCE(total_bytes_earned, bytes, 0)
WHERE season_bytes = 0 OR season_bytes IS NULL;

-- 2. Cria índices de performance caso ainda não tenham sido criados
CREATE INDEX IF NOT EXISTS idx_profiles_season_bytes ON public.profiles(season_bytes DESC);
CREATE INDEX IF NOT EXISTS idx_season_history_season ON public.season_history(season_id, season_bytes DESC);

-- 3. Verificação de sanidade
SELECT 
  COUNT(*) as total_perfis_atualizados,
  MAX(season_bytes) as maior_pontuacao_trimestre,
  AVG(season_bytes)::BIGINT as media_pontuacao_trimestre
FROM public.profiles;
