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
  - **Provedor Oficial Primário (Supabase)**: PostgreSQL hospedado com RLS (Row Level Security), índices B-Tree otimizados e Stored Procedures atômicas. Todos os 161 perfis e saves foram migrados com sucesso para esta base.
  - **Provedor Legado de Contingência (Firestore - Obsoleto)**: `FirebaseAdapter` preservado estritamente para rollback emergencial via `VITE_DB_PROVIDER="firestore"`. Não recebe novas implementações nem regras de negócio.
- **Identidade e Auth Híbrida**: Firebase Auth (Google Sign-In via `signInWithPopup` + `GoogleAuthProvider`) para e-mails institucionais (`@escola.pr.gov.br`). O UID do Google é a chave primária `TEXT` no Supabase (`profiles.id`).
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
- **Temporadas Trimestrais (Ciclo Oficial SEED-PR)**:
  - `season_bytes`: Acumulado do trimestre letivo no perfil do aluno (`public.profiles`).
  - `public.seasons_history`: Tabela de arquivo do Hall da Fama ao encerramento do trimestre pelo professor via RPC `close_current_season`. Saldo vitalício de moedas e prestígio geral nunca são zerados.
  - Pódio memorial Top 3 e histórico integral com busca e filtros por turma.

## Escopo Universal e Organização de Pastas

A plataforma evoluiu de "apenas digitação" para um **Hub Educacional Universal**. A economia do jogo (Bytes, Níveis, Fichas) é compartilhada, mas os jogos podem abordar Matemática, História, Lógica, etc.

Para suportar essa escala, o código é estritamente separado:
- `src/components/games/`: Jogos Oficiais do Professor (Core da plataforma).
- `src/plugins/`: Jogos criados por Alunos e pela Comunidade.

O catálogo de jogos e seus metadados (para alimentar filtros do Hub) fica armazenado localmente em `src/data/gameCatalog.ts`, envelopado por um hook `useGameCatalog()`. Isso prepara o terreno para uma futura migração remota (tabela `catalog_games` no Supabase) sem quebrar a interface visual. O Firestore e o Firebase Remote Config são considerados obsoletos para novos desenvolvimentos e mantidos apenas na camada de contingência.

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

## Contrato Unificado de Persistência & Diretriz de Zero Bypasses

Para garantir que a plataforma opere sem acoplamento a um provedor específico de banco de dados e permita alternância transparente via `VITE_DB_PROVIDER`, toda a camada visual segue a diretriz estrita de **Zero Bypasses**:

1. **Acesso Mediado por `dbService`**:
   - Nenhum componente React, hook ou utilitário da interface de usuário pode chamar métodos diretos de SDKs de banco de dados (`firebase/firestore`, `setDoc`, `getDoc`, `@supabase/supabase-js`, ou métodos do `firebaseService.ts` que manipulem dados).
   - Qualquer operação de leitura, escrita ou administrativa deve constar na interface [`IDatabaseService`](src/services/dbInterface.ts) e ser executada através da instância injetada [`dbService`](src/services/dbFactory.ts).

2. **Isolamento de Utilitários Puros**:
   - Regras de filtragem de contas de equipe pedagógica (`isStaffMember`), identificação de pioneiros do Nível 100 (`extractLevel100Pioneers`) e listas de superadministradores (`ADMIN_EMAILS`) residem no módulo desacoplado [`src/utils/leaderboardUtils.ts`](src/utils/leaderboardUtils.ts), sem dependências de infraestrutura de banco.

3. **Operações Administrativas no Contrato**:
   - Consultas de dashboard docente (`getAdminDashboardData`), atualizações de turma e classe RPG (`adminUpdateStudentProfile`), auto-balanceamento de classes (`adminAutoBalanceRpgClasses`), higienização de placares (`sanitizeStaffLeaderboard`) e reset de banco (`wipeDatabase`) possuem implementações completas e equivalentes tanto no `SupabaseAdapter` quanto no `FirebaseAdapter`.

## Arquitetura de Entrada de Teclado, Ergonomia & Acessibilidade

Para atender aos diferentes dispositivos escolares (Chromebooks, teclados ABNT2 de desktop e notebooks), o ecossistema TypeClicker adota componentes e utilitários centralizados para tratamento de entrada:

1. **Detecção Global de Modificadores (`src/utils/keyboardCase.ts`)**:
   - Hook `useCapsLock()`: escuta eventos de teclado globais em fase de captura e monitora `e.getModifierState('CapsLock')`, notificando o estado da tecla ativa.
   - Utilitário `checkCaseMismatch(typedChar, expectedChar)`: identifica erros de digitação causados exclusivamente por divergência de caixa alta vs caixa baixa, gerando instruções assertivas para uso do Shift ou desativação do Caps Lock.
   - Componente visual reutilizável [`src/components/common/CapsLockWarning.tsx`](src/components/common/CapsLockWarning.tsx) padronizado em todas as 9 interfaces de digitação.

2. **Resolução de Dead Keys & Composição ABNT2 (`src/utils/keyboardAccents.ts`)**:
   - Interceptação de eventos `e.key === 'Dead'` e teclas de acento sequencial (`´`, `` ` ``, `~`, `^`, `¨`).
   - Composição estrita sem bypass de normalização, garantindo que letras acentuadas exijam a combinação real no teclado.

3. **Responsividade e Auto-Scroll Dinâmico da Arena (`src/components/TypingArena.tsx`)**:
   - O container de texto alterna comportamento conforme o `TypingMode`:
     - Modo `words`: dimensões estáticas (`h-[105px] ... overflow-hidden flex items-center justify-center`) para preservar o alinhamento de palavras individuais.
     - Modos `sentences` e `code`: container expandido e dinâmico (`min-h-[130px] max-h-[240px...320px] overflow-y-auto`) com auto-scroll suave (`scrollIntoView`) focalizando o caractere ativo `.char-current`.

---

## Histórico de Sanitização da Arquitetura Híbrida & Evolução do Core

| Ciclo | Commit | Escopo | Descrição das Intervenções |
|---|---|---|---|
| **Caps Lock Global & Case Mismatch** | `39aef74` | `keyboardCase.ts`, `CapsLockWarning.tsx`, 9 Arenas | • Criação do hook `useCapsLock()` e utilitário `checkCaseMismatch`;<br>• Componente visual `CapsLockWarning` integrado em todas as 9 instâncias do TypeClicker;<br>• Alerta pedagógico flutuante/contextual de tecla Maiúscula (`Shift + [X]`) ou Minúscula. |
| **Correção de Frases no Terminal & Dead Keys** | `4ec9cad` | `TypingArena.tsx`, `FocusDrillModal.tsx`, `App.tsx` | • Container adaptativo com auto-scroll em frases/códigos sem corte de texto;<br>• Interceptação e composição de `Dead` keys no Modo Foco com remoção de bypass de acento;<br>• Elevação do limiar de ativação para 5 erros repetidos e cooldown de 30s. |
| **Auditoria & Sanitização de Bypasses** | `5f1213c` | `App.tsx`, `AdminPanel.tsx`, `adapters/*`, `dbInterface.ts`, `leaderboardUtils.ts` | • Eliminados 14 pontos de bypass onde `saveProgressToCloud` burlava o provedor ativo;<br>• Todas as gravações de estado redirecionadas para `dbService.saveLegacyGameState`;<br>• Extensão de `IDatabaseService` com 5 operações administrativas implementadas no `SupabaseAdapter` e `FirebaseAdapter`;<br>• Extração de utilitários puros para `leaderboardUtils.ts` e desacoplamento de 8 componentes visuais/hooks de `firebaseService`. |
| **Temporadas Trimestrais & Hall da Fama** | `2924470` | `LeaderboardModal.tsx`, `AdminPanel.tsx`, `schema.sql`, `supabaseAdapter.ts` | • Ciclo trimestral alinhado ao calendário SEED-PR;<br>• Seletor "3º Trimestre (Atual) \| Todos os Tempos \| Hall da Fama";<br>• Pódio comemorativo e memorial histórico Top 3;<br>• Fechamento seguro de temporada no painel docente com confirmação digitada (`"CONFIRMAR"`). |
| **Migração Baseline v1.0.0** | `5b4aaa5` | Core Platform | • Baseline de referência estável da plataforma com arquitetura original Cloud Firestore. |
