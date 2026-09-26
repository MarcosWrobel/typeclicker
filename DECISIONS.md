# Decisões de Arquitetura — TypeClicker

## Decisões Estratégicas (Supabase & Multi-Jogos)

- **Supabase como Provedor Primário com Fallback de Contingência**: O ecossistema adota o Supabase (PostgreSQL) como banco de dados oficial padrão via `VITE_DB_PROVIDER="supabase"`. O `FirebaseAdapter` é mantido íntegro e testado como fallback emergencial via variável de ambiente.
- **Identidade Híbrida (Firebase Auth + Supabase Postgres)**: A autenticação continua utilizando o Firebase Auth com Google Sign-In institucional (`@escola.pr.gov.br`), aproveitando o domínio de produção já autorizado no Google Cloud. O UID do Google é utilizado como chave primária `TEXT` no Supabase (`profiles.id`).
- **Arquitetura de Dados Híbrida (Relacional + JSONB)**:
  - `public.profiles`: colunas relacionais indexadas para ordenações e filtros rápidos (Bytes, Turma, Nível, Nome, Apelido, Tokens, Classe RPG).
  - `public.game_progress`: uma linha por minijogo com métricas resumidas e um campo `state_payload JSONB` para persistência rica e granular sem necessidade de migrações DDL constantes.
  - `public.user_cosmetics` e `public.user_achievements`: tabelas relacionais dedicadas para controle de inventário e conquistas.
- **Política de Autosave Event-Driven**: Throttle de 60 segundos mantido para digitação contínua em sala (economiza banda da escola e conexão com o pooler do Postgres), combinado com flush/sincronização imediata em marcos críticos (subir de nível, derrotar boss da masmorra, encerrar partida e eventos `beforeunload`/`pagehide`).
- **Leitura Balanceada de Leaderboards (Capacidade: 35–90 máquinas)**:
  - Placares gerais, pódios e rankings consom a API HTTP PostgREST com cache leve em memória (30s a 60s) e índices B-Tree (`idx_profiles_turma`, `idx_profiles_points`).
  - WebSockets (Supabase Realtime) são reservados **exclusivamente sob demanda** para a Corrida Sincronizada (Race) e Raid do Chefão, impedindo o esgotamento do limite mensal de 2M mensagens do tier gratuito.
- **Anti-Cheat em Camadas (Client + Database)**: Guardrails no frontend para feedback instantâneo + Stored Procedures atômicas (`record_game_session`) com travas de incremento no PostgreSQL, impedindo adulteração de saldo via console do navegador.
- **Rankings Bimestrais e Hall da Fama**: Suporte a temporadas pedagógicas bimestrais (`season_bytes` no perfil e histórico arquivado em `season_history`), preservando permanentemente os Bytes vitais (carteira) e o total histórico do aluno.
- **Escopo Universal**: O Hub deixou de ser exclusivamente um "treinador de digitação" para se tornar uma plataforma educacional genérica. O TypeClicker clássico permanece como o gerador primário da "economia" (Bytes), mas a vitrine do Hub aceita jogos de Matemática, História, Lógica, etc.
- **Separação de Pastas (Core vs Plugins)**: Jogos criados pelo professor (Oficiais/Core) residem em `src/components/games/`. Jogos submetidos por alunos residem em `src/plugins/`. Isso impede que o repositório principal se torne uma bagunça estrutural.
- **Catálogo Client-Side Dinâmico**: Vitrine alimentada por `src/data/gameCatalog.ts` e hook `useGameCatalog()`, suportando abas de categorias (*Oficiais*, *Alunos*, *Novidades*), busca por texto e sub-filtros de Matéria e Gênero.
- **Bibliotecas whitelisted e Lazy Loading obrigatório**: pacotes permitidos (`@monaco-editor/react`, `recharts`, `react-markdown`) importados dinamicamente via `React.lazy()` e `<Suspense>` no roteador do Hub para proteger a performance inicial.

## Decisões confirmadas do código legado

- **Firestore em vez de Realtime Database** — `firebase.json` define `dataAccessMode: FIRESTORE_NATIVE`.
- **Cloud Run como runtime de produção** — `server.ts` detecta `process.env.K_SERVICE`; serve `dist/` via `express.static`.
- **Toda a lógica de jogo é client-side** — `server.ts` serve apenas rotas de métricas admin e o SPA; nenhum cálculo de pontuação no servidor.
- **Plano Blaze com orçamento controlado** — limites do tier gratuito Blaze tratados como cotas hard (50k leituras / 20k escritas/dia).
- **Sem Cloud Functions por decisão deliberada** — plano Blaze permite, mas não há intenção imediata.
- **Hub normaliza bytes dos plug-ins** — jogos de alunos entregam métricas brutas; o Hub aplica `min(bytesEarned, timeSpentSeconds × CAP × accuracyFactor)` antes de creditar. Evita inflação.
- **Contrato adotado: `BaseGameProps` + `GameExitPayload`** — contrato pedagógico do guia dos alunos foi adotado como contrato real do código (`src/types/gamePlugin.ts`).
- **Fluxo de contribuição de alunos**: alunos desenvolvem usando `GUIA_CRIACAO_DE_JOGOS.md` → entregam o arquivo `index.tsx` → professor avalia → integra manualmente em `src/plugins/<nome>/`, define o `GameId` e roteamento lazy → habilita via painel admin.
- **Opt-in por jogo via `HubConfig.disabledGames`** — professor habilita/desabilita jogos via painel sem deploy.

## Bugs / Débitos Técnicos
- O Baú Criptográfico escrevia num campo fantasma `hackTokens`. Substituído por `cosmetics.levelTokens`.
- `TypeRadarGame` ainda usa o contrato antigo e precisa ser migrado para `GameExitPayload`.
