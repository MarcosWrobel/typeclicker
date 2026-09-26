# TypeClicker — Arquitetura da Plataforma

## Stack detectada
- **Framework**: React 19.0.1 (SPA, sem SSR)
- **Linguagem**: TypeScript ~5.8.2
- **Build**: Vite 6.2.3 + esbuild (bundle do server)
- **CSS**: Tailwind CSS 4.1.14 (via `@tailwindcss/vite`)
- **Bibliotecas Visuais**: `motion` 12.23.24, `canvas-confetti` 1.9.4, `lucide-react` 0.546.0
- **Bibliotecas de Jogos Permitidas**: `@monaco-editor/react` (editor de código), `recharts` (gráficos), `react-markdown` (texto rico)
- **Package manager**: bun (bun.lock presente) + npm (package-lock.json presente)

## Infraestrutura & Banco de Dados
- **Hospedagem**: Google Cloud Run (containerizado via AI Studio) — `server.ts` detecta `process.env.K_SERVICE` e serve `dist/` em modo produção; em dev local serve via Vite middleware.
- **Domínio de produção**: `typeclicker-leopoldina.ai.studio`.
- **Camada de Banco de Dados Agnóstica**: Interface `IDatabaseService` com chaveamento dinâmico via `VITE_DB_PROVIDER` (`supabase` ou `firestore`).
  - **Provedor Primário (Supabase)**: PostgreSQL hospedado com RLS (Row Level Security), índices otimizados e Stored Procedures atômicas.
  - **Provedor de Contingência (Firestore)**: `FirebaseAdapter` preservado para rollback imediato sem necessidade de re-deploy.
- **Auth**: Firebase Auth (Google Sign-In via `signInWithPopup` + `GoogleAuthProvider`) para e-mails institucionais (`@escola.pr.gov.br`). O UID é a chave primária `TEXT` no Supabase (`profiles.id`).
- **Arquitetura de Dados no Supabase**:
  - `public.profiles`: Colunas relacionais indexadas (`id`, `display_name`, `turma`, `role`, `bytes`, `total_bytes_earned`, `level`, tokens).
  - `public.game_progress`: Tabela por jogo (`user_id`, `game_id`, `high_score`, `metrics`, `state_payload JSONB`).
  - `public.user_cosmetics`: Relação de itens e cosméticos desbloqueados (`user_id`, `item_id`, `item_category`).
  - `public.user_achievements`: Histórico relacional de conquistas (`user_id`, `achievement_id`).
- **Regras de Leitura e Tráfego (Capacidade: 35–90 máquinas de laboratório)**:
  - **HTTP REST (PostgREST)**: Placares, pódios e perfil utilizam consultas REST com cache local de 30s–60s e singleflight promise deduplication. Ilimitado no tier gratuito.
  - **Supabase Realtime (WebSockets)**: Reservado **exclusivamente sob demanda** para disputas síncronas (Corrida e Raid), preservando a cota mensal de 2M mensagens e as 200 conexões simultâneas do tier gratuito.
- **Política de Sincronização (Autosave)**:
  - Digitação contínua: Throttle de 60 segundos com contingência em `localStorage` para tolerância a falhas de rede.
  - Marcos críticos: Flush imediato em level-up, derrotar boss, saída de minijogo e eventos de janela (`beforeunload` / `pagehide`).
- **Anti-Cheat em Camadas**:
  - Client: Verificação de deltas máximos por segundo antes do envio.
  - Database: Stored Procedure `record_game_session` com validação de caps no PostgreSQL.
- **Temporadas Bimestrais**:
  - `season_bytes`: Acumulado do bimestre letivo.
  - `public.season_history`: Tabela de arquivo do Hall da Fama ao encerramento do bimestre pelo professor. Saldo vitalício de moedas e prestígio geral nunca são zerados.

## Escopo Universal e Organização de Pastas

A plataforma evoluiu de "apenas digitação" para um **Hub Educacional Universal**. A economia do jogo (Bytes, Níveis, Fichas) é compartilhada, mas os jogos podem abordar Matemática, História, Lógica, etc.

Para suportar essa escala, o código é estritamente separado:
- `src/components/games/`: Jogos Oficiais do Professor (Core da plataforma).
- `src/plugins/`: Jogos criados por Alunos e pela Comunidade.

O catálogo de jogos e seus metadados (para alimentar filtros do Hub) fica armazenado localmente em `src/data/gameCatalog.ts`, envelopado por um hook `useGameCatalog()`. Isso prepara o terreno para uma futura migração para Firestore ou Firebase Remote Config sem quebrar a interface visual.

## Arquitetura de jogos — Hub + Plug-ins

O hub (`GameSelectionScreen`) exibe cards de jogos consumindo os metadados do `gameCatalog.ts` e controla visibilidade via `HubConfig.disabledGames`. Cada jogo é um componente React standalone renderizado condicionalmente em `App.tsx` conforme `selectedGame`. Para não prejudicar o tempo de carregamento da plataforma (especialmente com bibliotecas pesadas como o Monaco Editor), **todos os jogos da pasta `src/plugins/` são importados dinamicamente via `React.lazy` e envoltos em `Suspense`**.

### Jogos existentes (gerenciados pelo professor)
| `selectedGame` | Componente | Tipo de saída |
|---|---|---|
| `'typeclicker'` | `TypingArena` | estado direto no `GameState` |
| `'type_radar'` | `TypeRadarGame` | `onExitToHub(bytes, endStats)` — legado, migração pendente |
| `'byte_logic'` | a implementar pelo professor | `BaseGameProps.onExitToHub(payload)` |
| `'math_storm'` | a implementar pelo professor | `BaseGameProps.onExitToHub(payload)` |
| `'syntax_maze'` | a implementar pelo professor | `BaseGameProps.onExitToHub(payload)` |
| `'<id_aluno>'` | `src/plugins/<nome>` (entregue pelo aluno) | `BaseGameProps.onExitToHub(payload)` |

### Contrato de plug-in (`src/types/gamePlugin.ts`)
Todos os novos jogos — tanto os criados pelo professor quanto os criados por alunos — devem seguir `BaseGameProps`:
- **Entrada**: `studentClass?`, `difficultyMultiplier?` (0.8/1.0/1.25), `onExitToHub(payload)`
- **Saída** (`GameExitPayload`): `bytesEarned` (sugestão), `levelTokensEarned?`, `duelTokensEarned?`, `sessionStats: GameSessionStats`
- **Normalização de bytes**: o Hub aplica `min(bytesEarned, timeSpentSeconds × CAP × accuracyFactor)` — o jogo entrega métricas brutas, o Hub decide o crédito final
- **Histórico**: cada saída gera um `ArcadeMatchRecord` salvo em `GameState.arcadeHistory` (array circular, máx 10)

## Fluxo de autenticação e Modelo de Dados
(Mantidos conforme padrão do TypeClicker original — ver detalhes no código).
