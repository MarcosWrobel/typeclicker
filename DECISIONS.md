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
- **Rankings Trimestrais e Hall da Fama**: Suporte ao ciclo pedagógico oficial da escola estadual por **Trimestres** (`season_bytes` no perfil e histórico arquivado em `public.season_history`). A visualização padrão do Leaderboard passa a ser o Trimestre Atual, com alternador para "Todos os Tempos" e consulta ao Hall da Fama com pódio Top 3 + ranking por turma. O fechamento é protegido no AdminPanel com confirmação digitada ("CONFIRMAR"). O saldo vitalício de moedas (`bytes`) e prestígio geral (`total_bytes_earned`) são permanentes e nunca zeram.
- **Escopo Universal**: O Hub deixou de ser exclusivamente um "treinador de digitação" para se tornar uma plataforma educacional genérica. O TypeClicker clássico permanece como o gerador primário da "economia" (Bytes), mas a vitrine do Hub aceita jogos de Matemática, História, Lógica, etc.
- **Separação de Pastas (Core vs Plugins)**: Jogos criados pelo professor (Oficiais/Core) residem em `src/components/games/`. Jogos submetidos por alunos residem em `src/plugins/`. Isso impede que o repositório principal se torne uma bagunça estrutural.
- **Catálogo Client-Side Dinâmico**: Vitrine alimentada por `src/data/gameCatalog.ts` e hook `useGameCatalog()`, suportando abas de categorias (*Oficiais*, *Alunos*, *Novidades*), busca por texto e sub-filtros de Matéria e Gênero.
- **Zero Bypasses e Mediação Estrita via `dbService`**: Toda persistência de progresso de jogos (`saveLegacyGameState`), consultas de placares e operações de painel administrativo (`adminUpdateStudentProfile`, `adminAutoBalanceRpgClasses`, `wipeDatabase`, `sanitizeStaffLeaderboard`, `getAdminDashboardData`) devem ser realizadas unicamente através da interface [`IDatabaseService`](src/services/dbInterface.ts). Chamadas diretas da UI para métodos de SDK (`firebase/firestore`, `saveProgressToCloud`, `@supabase/supabase-js`) são expressamente proibidas para garantir alternância funcional imediata via `VITE_DB_PROVIDER`.
- **Desacoplamento de Utilitários de Domínio (`leaderboardUtils.ts`)**: Funções de domínio puras (`isStaffMember`, `extractLevel100Pioneers`, `ADMIN_EMAILS`) foram isoladas em [`src/utils/leaderboardUtils.ts`](src/utils/leaderboardUtils.ts). Componentes visuais (`LeaderboardModal`, `StatsSidebar`, `StudentProfileCard*`, etc.) e hooks não importam mais arquivos de infraestrutura de banco (`firebaseService.ts`) para avaliações lógicas puras.
- **Bibliotecas whitelisted e Lazy Loading obrigatório**: pacotes permitidos (`@monaco-editor/react`, `recharts`, `react-markdown`) importados dinamicamente via `React.lazy()` e `<Suspense>` no roteador do Hub para proteger a performance inicial.

## Decisões do Código Legado e Status de Migração

- **[OBSOLETO / SUBSTITUÍDO] Firestore em vez de Realtime Database**: O Firestore foi o banco inicial (`FIRESTORE_NATIVE`), mas tornou-se obsoleto e foi substituído pelo **Supabase (PostgreSQL 15+)** como banco primário oficial. O `FirebaseAdapter` foi preservado exclusivamente para rollback/contingência em caso de emergência.
- **Cloud Run como runtime de produção**: `server.ts` detecta `process.env.K_SERVICE`; serve `dist/` via `express.static`. (Ativo e mantido).
- **Toda a lógica de jogo é client-side**: `server.ts` atua apenas como servidor de arquivos estáticos e métricas; a lógica de gameplay permanece no browser e a liquidação segura de progresso é delegada a Stored Procedures do Supabase.
- **[OBSOLETO / SUBSTITUÍDO] Plano Blaze e Cotas Firestore**: Os limites de cotas do Firestore (50k leituras / 20k gravações diárias no Spark/Blaze) foram superados. As novas restrições de arquitetura no Supabase Free Tier concentram-se em:
  - Armazenamento em disco: 500 MB (suficiente para milhares de alunos usando estrutura híbrida).
  - WebSockets Realtime: Cota de 2M mensagens/mês e 200 conexões simultâneas (mitigado usando PostgREST com cache leve para placares e ativando Realtime apenas sob demanda em Corridas e Raids).
- **[OBSOLETO / SUBSTITUÍDO] Sem Cloud Functions**: Decisão de evitar Cloud Functions mantida, mas agora complementada com **Stored Procedures (RPCs PL/pgSQL)** nativas do PostgreSQL no Supabase (`record_game_session`, `close_current_season`), garantindo atomicidade e anti-cheat sem custo de computação externa.
- **Hub normaliza bytes dos plug-ins**: jogos de alunos entregam métricas brutas; o Hub aplica `min(bytesEarned, timeSpentSeconds × CAP × accuracyFactor)` antes de creditar. Evita inflação. (Ativo).
- **Contrato adotado: `BaseGameProps` + `GameExitPayload`**: contrato pedagógico do guia dos alunos foi adotado como contrato real do código (`src/types/gamePlugin.ts`). (Ativo).
- **Fluxo de contribuição de alunos**: alunos desenvolvem usando `GUIA_CRIACAO_DE_JOGOS.md` → entregam o arquivo `index.tsx` → professor avalia → integra manualmente em `src/plugins/<nome>/`, define o `GameId` e roteamento lazy → habilita via painel admin. (Ativo).
- **Opt-in por jogo via `HubConfig.disabledGames`**: professor habilita/desabilita jogos via painel sem deploy. (Ativo).

## Bugs / Débitos Técnicos
- O Baú Criptográfico escrevia num campo fantasma `hackTokens`. Substituído por `cosmetics.levelTokens`.
- `TypeRadarGame` ainda usa o contrato antigo e precisa ser migrado para `GameExitPayload`.
