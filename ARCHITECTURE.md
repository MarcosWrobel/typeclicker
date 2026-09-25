# TypeClicker — Arquitetura da Plataforma

## Stack detectada
- **Framework**: React 19.0.1 (SPA, sem SSR)
- **Linguagem**: TypeScript ~5.8.2
- **Build**: Vite 6.2.3 + esbuild (bundle do server)
- **CSS**: Tailwind CSS 4.1.14 (via `@tailwindcss/vite`)
- **Bibliotecas Visuais**: `motion` 12.23.24, `canvas-confetti` 1.9.4, `lucide-react` 0.546.0
- **Bibliotecas de Jogos Permitidas**: `@monaco-editor/react` (editor de código), `recharts` (gráficos), `react-markdown` (texto rico)
- **Package manager**: bun (bun.lock presente) + npm (package-lock.json presente)

## Infraestrutura
- **Hospedagem**: Google Cloud Run (containerizado via AI Studio) — `server.ts` detecta `process.env.K_SERVICE` e serve `dist/` em modo produção; em dev local serve via Vite middleware
- **Domínio de produção**: `typeclicker-leopoldina.ai.studio`
- **Firebase plano**: Blaze — com orçamento controlado para não ultrapassar a cota gratuita incluída
- **Firebase produto**: Firestore (`firebase.json` → `edition: ENTERPRISE`, `dataAccessMode: FIRESTORE_NATIVE`)
  - `databaseId`: `ai-studio-typeclickereduca-b411f269-51c7-4c3d-ac8c-f1dd59f2f7ca`
  - `projectId`: `gen-lang-client-0277873219`
- **Auth**: Firebase Auth (Google Sign-In via `signInWithPopup` + `GoogleAuthProvider`)
- **Sem RTDB**: apenas Firestore Nativo
- **Sem Cloud Functions**: plano Blaze permite, mas não utilizado — toda lógica é client-side
- **server.ts**: Express + Firebase Admin SDK + `@google-cloud/monitoring` — serve rotas de métricas admin e o SPA compilado em produção
- **Cotas de referência (hardcoded em `server.ts`)**: 50 000 leituras/dia · 20 000 escritas/dia
- **Sync throttle**: 60 segundos mínimo entre escritas (`useGameSync`)

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
