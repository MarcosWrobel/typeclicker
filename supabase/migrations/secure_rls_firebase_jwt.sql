-- MIGRAÇÃO: RLS seguro com identidade Firebase (substitui fix_rls_for_hybrid_auth.sql)
-- ==============================================================================
-- SEGURANÇA (RLS + RPCs) — Identidade via Firebase JWT (Supabase Third-Party Auth)
-- PRÉ-REQUISITO: Supabase Dashboard > Authentication > Sign In / Providers >
--   Third-Party Auth > Add provider > Firebase (informar o Project ID do Firebase).
-- Sem esse passo o PostgREST não reconhece o ID token e as escritas serão negadas.
-- O front-end só envia o token quando VITE_SUPABASE_FIREBASE_AUTH=true.
-- ==============================================================================

-- UID do usuário autenticado (claim `sub` do ID token do Firebase). NULL para anon.
CREATE OR REPLACE FUNCTION public.fb_uid() RETURNS TEXT
LANGUAGE sql STABLE AS $$ SELECT NULLIF(auth.jwt() ->> 'sub', '') $$;

-- Lista de staff (professores/admins), identificada por UID do Firebase e/ou e-mail verificado.
-- Sem policies e sem GRANT: inacessível via API; gerenciada pela RPC set_user_role (staff) ou SQL Editor.
CREATE TABLE IF NOT EXISTS public.staff_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT UNIQUE,
  email TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'teacher' CHECK (role IN ('teacher','admin')),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CHECK (user_id IS NOT NULL OR email IS NOT NULL)
);
ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.staff_users FROM anon, authenticated;

-- Staff = UID listado OU e-mail listado com email_verified=true no ID token
CREATE OR REPLACE FUNCTION public.is_staff() RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff_users s
    WHERE (public.fb_uid() IS NOT NULL AND s.user_id = public.fb_uid())
       OR (s.email IS NOT NULL
           AND COALESCE((auth.jwt() ->> 'email_verified')::boolean, false)
           AND lower(s.email) = lower(auth.jwt() ->> 'email'))
  )
$$;

-- Promoção/remoção de professor: única via de alteração de `role` (apenas staff).
-- Atualiza staff_users (valendo mesmo para quem ainda não fez login) e o perfil existente.
CREATE OR REPLACE FUNCTION public.set_user_role(
  p_email TEXT,
  p_role TEXT,
  p_turma TEXT DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
  v_email TEXT := lower(trim(p_email));
  v_count INTEGER := 0;
BEGIN
  IF NOT public.is_staff() THEN
    RAISE EXCEPTION 'Apenas professores podem alterar papéis' USING ERRCODE = '42501';
  END IF;
  IF v_email IS NULL OR v_email !~ '^[^@\s]+@[^@\s]+$' THEN
    RAISE EXCEPTION 'E-mail inválido' USING ERRCODE = '22023';
  END IF;
  IF p_role NOT IN ('student','teacher') THEN
    RAISE EXCEPTION 'Papel inválido (use student ou teacher)' USING ERRCODE = '22023';
  END IF;

  IF p_role = 'teacher' THEN
    INSERT INTO public.staff_users (email, role) VALUES (v_email, 'teacher')
    ON CONFLICT (email) DO NOTHING;
  ELSE
    DELETE FROM public.staff_users WHERE lower(email) = v_email AND role <> 'admin';
  END IF;

  UPDATE public.profiles
  SET role = p_role,
      turma = COALESCE(p_turma, turma),
      updated_at = now()
  WHERE lower(email) = v_email AND role <> 'admin';
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cosmetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.season_history ENABLE ROW LEVEL SECURITY;

-- Limpa policies de versões anteriores (idempotência)
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT schemaname, tablename, policyname FROM pg_policies
           WHERE schemaname = 'public'
             AND tablename IN ('profiles','game_progress','user_cosmetics','user_achievements','season_history')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- Profiles: leitura pública (ranking); escrita só do próprio dono ou staff
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT
  WITH CHECK (id = public.fb_uid() OR public.is_staff());
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE
  USING (id = public.fb_uid() OR public.is_staff())
  WITH CHECK (id = public.fb_uid() OR public.is_staff());
CREATE POLICY "profiles_delete" ON public.profiles FOR DELETE USING (public.is_staff());

-- Impede auto-promoção: somente staff altera `role`; novos perfis comuns nascem como 'student'
CREATE OR REPLACE FUNCTION public.protect_profile_role() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_staff() THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.role := 'student';
  ELSE
    NEW.role := OLD.role;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- Progresso, cosméticos e conquistas: leitura pública; escrita do dono ou staff
CREATE POLICY "game_progress_select" ON public.game_progress FOR SELECT USING (true);
CREATE POLICY "game_progress_write" ON public.game_progress FOR ALL
  USING (user_id = public.fb_uid() OR public.is_staff())
  WITH CHECK (user_id = public.fb_uid() OR public.is_staff());

CREATE POLICY "cosmetics_select" ON public.user_cosmetics FOR SELECT USING (true);
CREATE POLICY "cosmetics_write" ON public.user_cosmetics FOR ALL
  USING (user_id = public.fb_uid() OR public.is_staff())
  WITH CHECK (user_id = public.fb_uid() OR public.is_staff());

CREATE POLICY "achievements_select" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "achievements_write" ON public.user_achievements FOR ALL
  USING (user_id = public.fb_uid() OR public.is_staff())
  WITH CHECK (user_id = public.fb_uid() OR public.is_staff());

-- Hall da Fama: leitura pública; inserção direta só staff (a RPC de fechamento é SECURITY DEFINER)
CREATE POLICY "season_history_select" ON public.season_history FOR SELECT USING (true);
CREATE POLICY "season_history_insert" ON public.season_history FOR INSERT WITH CHECK (public.is_staff());

-- Privilégios: anon apenas leitura; authenticated lê/escreve sujeito às policies acima
REVOKE ALL ON public.profiles, public.game_progress, public.user_cosmetics,
              public.user_achievements, public.season_history FROM anon;
GRANT SELECT ON public.profiles, public.game_progress, public.user_cosmetics,
                public.user_achievements, public.season_history TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles, public.game_progress,
      public.user_cosmetics, public.user_achievements TO authenticated;
GRANT SELECT, INSERT ON public.season_history TO authenticated;

-- RPC atômica de sessão de jogo: só para o próprio usuário e com teto de bytes por chamada
CREATE OR REPLACE FUNCTION public.record_game_session(
  p_user_id TEXT,
  p_game_id TEXT,
  p_bytes_earned BIGINT,
  p_high_score BIGINT,
  p_metrics JSONB
) RETURNS void AS $$
DECLARE
  c_max_bytes_per_session CONSTANT BIGINT := 100000; -- ajustar conforme a economia dos jogos
BEGIN
  IF p_user_id IS DISTINCT FROM public.fb_uid() AND NOT public.is_staff() THEN
    RAISE EXCEPTION 'Não autorizado a registrar sessão para outro usuário' USING ERRCODE = '42501';
  END IF;
  IF p_bytes_earned < 0 OR p_bytes_earned > c_max_bytes_per_session THEN
    RAISE EXCEPTION 'Quantidade de bytes fora do limite permitido' USING ERRCODE = '22023';
  END IF;

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

-- Encerramento de temporada: apenas staff
CREATE OR REPLACE FUNCTION public.close_current_season(
  p_season_id TEXT,
  p_season_name TEXT
) RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  IF NOT public.is_staff() THEN
    RAISE EXCEPTION 'Apenas professores podem encerrar a temporada' USING ERRCODE = '42501';
  END IF;

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

REVOKE ALL ON FUNCTION public.record_game_session(TEXT, TEXT, BIGINT, BIGINT, JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.close_current_season(TEXT, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.set_user_role(TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_game_session(TEXT, TEXT, BIGINT, BIGINT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.close_current_season(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_user_role(TEXT, TEXT, TEXT) TO authenticated;

-- Cadastro inicial do administrador (executar uma vez no SQL Editor; depois os demais
-- professores são gerenciados pelo painel via set_user_role):
--   INSERT INTO public.staff_users (email, role, note)
--   VALUES ('wrobel.marcos@gmail.com', 'admin', 'Prof. Marcos Wrobel'),
--          ('marcos.wrobel@escola.pr.gov.br', 'admin', 'Prof. Marcos Wrobel (institucional)')
--   ON CONFLICT (email) DO NOTHING;
