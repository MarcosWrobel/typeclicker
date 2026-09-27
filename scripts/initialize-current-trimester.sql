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
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS season_bytes BIGINT DEFAULT 0;

UPDATE public.profiles
SET season_bytes = COALESCE(total_bytes_earned, bytes, 0)
WHERE season_bytes = 0 OR season_bytes IS NULL;

-- 2. Garante a criação da tabela de histórico de temporadas (Hall da Fama)
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

ALTER TABLE public.season_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Season history viewable by everyone" ON public.season_history;
CREATE POLICY "Season history viewable by everyone" ON public.season_history FOR SELECT USING (true);

-- 3. Cria índices de performance caso ainda não tenham sido criados
CREATE INDEX IF NOT EXISTS idx_profiles_season_bytes ON public.profiles(season_bytes DESC);
CREATE INDEX IF NOT EXISTS idx_season_history_season ON public.season_history(season_id, season_bytes DESC);

-- Recarrega o schema cache do PostgREST
NOTIFY pgrst, 'reload schema';

-- 3. Verificação de sanidade
SELECT 
  COUNT(*) as total_perfis_atualizados,
  MAX(season_bytes) as maior_pontuacao_trimestre,
  AVG(season_bytes)::BIGINT as media_pontuacao_trimestre
FROM public.profiles;
