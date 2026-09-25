# TypeClicker — Arquitetura da Plataforma

## Stack detectada
- **Framework**: React 19.0.1 (SPA, sem SSR)
- **Linguagem**: TypeScript ~5.8.2
- **Build**: Vite 6.2.3 + esbuild (bundle do server)
- **CSS**: Tailwind CSS 4.1.14 (via `@tailwindcss/vite`)
- **Animações**: `motion` 12.23.24, `canvas-confetti` 1.9.4
- **Ícones**: `lucide-react` 0.546.0
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

## Arquitetura de jogos — Hub + Plug-ins

O hub (`GameSelectionScreen`) exibe cards de jogos e controla visibilidade via `HubConfig.disabledGames`. Cada jogo é um componente React standalone renderizado condicionalmente em `App.tsx` conforme `selectedGame`.

### Jogos existentes (gerenciados pelo professor)
| `selectedGame` | Componente | Tipo de saída |
|---|---|---|
| `'typeclicker'` | `TypingArena` | estado direto no `GameState` |
| `'type_radar'` | `TypeRadarGame` | `onExitToHub(bytes, endStats)` — legado, migração pendente |
| `'byte_logic'` | a implementar pelo professor | `BaseGameProps.onExitToHub(payload)` |
| `'math_storm'` | a implementar pelo professor | `BaseGameProps.onExitToHub(payload)` |
| `'syntax_maze'` | a implementar pelo professor | `BaseGameProps.onExitToHub(payload)` |
| `'<id_aluno>'` | componente entregue pelo aluno, ID definido pelo professor | `BaseGameProps.onExitToHub(payload)` |

### Contrato de plug-in (`src/types/gamePlugin.ts`)
Todos os novos jogos — tanto os criados pelo professor quanto os criados por alunos — devem seguir `BaseGameProps`:
- **Entrada**: `studentClass?`, `difficultyMultiplier?` (0.8/1.0/1.25), `onExitToHub(payload)`
- **Saída** (`GameExitPayload`): `bytesEarned` (sugestão), `levelTokensEarned?`, `duelTokensEarned?`, `sessionStats: GameSessionStats`
- **Normalização de bytes**: o Hub aplica `min(bytesEarned, timeSpentSeconds × CAP × accuracyFactor)` — o jogo entrega métricas brutas, o Hub decide o crédito final
- **Histórico**: cada saída gera um `ArcadeMatchRecord` salvo em `GameState.arcadeHistory` (array circular, máx 10)

## Jogos existentes (detalhes)

### Jogo 1 — TypeClicker (jogo principal)
- **Arquivos**: `src/App.tsx` (2988 linhas), `src/components/TypingArena.tsx` (1336 linhas)
- **Mecânica**: clicker incremental — digita palavras no terminal, cada tecla gera Bytes
- **Modos**: `words` | `sentences` | `code`; categorias `iniciante` → `expert` (`bonusMultiplier` 1.0× a 2.5×)
- **Progressão**: 100 níveis por `totalBytesEarned`; tiers temáticos de 10 em 10 (`levels.ts`)
- **Pontuação**: `max(1, round(bytesPerChar × multiplier × prestigeMult × diffBonus))`; combo +0.2× a cada 5 acertos (cap 5.0×, 6.0× Arqueiro)
- **Classes RPG**: `warrior` (+25% acima 55 PPM) · `archer` (+0.2× a cada 20 acertos) · `mage` (+25% passivo)
- **Upgrades**: 5 ativos + 5 passivos; custo = `baseCost × multiplier^count`

### Jogo 2 — Type: Radar
- **Arquivos**: `src/components/games/radar/TypeRadarGame.tsx` (1785 linhas), `src/services/radarEngine.ts`
- **Mecânica**: tower-defense; naves orbitam radar circular; jogador digita palavras para destruí-las
- **Inimigos**: `scout` · `drone` · `tank` · `glitch` · `boss` (multi-fases)
- **Ondas**: `normal` · `swarm` · `boss` (múltiplos de 5)
- **DDA**: acurácia <60% → ×0.82; >95% → ×1.15
- **Bytes**: `score × 0.12 × max(0.3, accuracy/100) + wave × 60`

## Modelo de dados

### Coleções Firestore
| Coleção | Chave | Campos obrigatórios |
|---|---|---|
| `saves/{userId}` | UID Firebase | `userId`, `saveState` (map) |
| `leaderboard/{userId}` | UID Firebase | `userId`, `nome`, `level`, `points` |
| `system/settings` | doc único | `activeCode`, `expiresAt`, `activeTurma`, `activeTrack`, `hubConfig` |
| `arena_rooms/{roomId}` | `active_classroom_raid` / `active_classroom_race` / sala 1×1 | varia |
| `backups/{backupId}` | ID manual | `saves`, `leaderboard` |

### Campos-chave de `GameState`
- `bytes`, `totalBytesEarned`, `bytesPerChar`, `autoBytesPerSec`
- `comboStreak`, `maxCombo`, `multiplier`, `prestigeCount`, `prestigeCores`
- `correctKeys`, `wrongKeys`, `wordsCompleted`, `totalActiveSeconds`
- `cosmetics: PlayerCosmetics` → `{levelTokens, duelTokens, quantumFragments, ...}`
- `arenaStats`, `radarStats`, `keyTelemetry`, `achievements`, `quests`, `rpgClass`
- `arcadeHistory: ArcadeMatchRecord[]` (histórico dos minijogos, máx 10)
- `isClassLocked`, `flaggedForReview`, `schemaVersion`

## Fluxo de autenticação
- **Login**: `signInWithPopup(GoogleAuthProvider)` → `onAuthStateChanged`
- **Logado**: carrega `saves/{uid}` → conquistas retroativas → se sem apelido/RPG → `StudentModal`
- **Fallback offline**: `loadSavedState(uid)` do `localStorage`
- **Admin**: e-mail em `ADMIN_EMAILS` hardcoded; professores extras via `system/settings.allowedTeachers`
- **Trava escolar**: `onSnapshot` em `system/settings` → `SessionLockOverlay` se `activeCode` ativo
- **Deslogado**: `setState(INITIAL_STATE)` + `clearSavedState()`

## Regras de negócio implementadas
- **Nível** = lookup em tabela de 100 thresholds (`levels.ts`) por `totalBytesEarned`
- **Multiplicador de combo**: +0.2× a cada 5 acertos, cap 5.0× (6.0× Arqueiro)
- **Moedas**: `levelTokens` · `duelTokens` · `quantumFragments` (endgame Nível 100)
- **Normalização de bytes dos plug-ins**: `min(sugestão, tempo × CAP × acurácia)` — aplicado pelo Hub
- **Anti-cheat**: `validateStateSanity()` antes de salvar; `flaggedForReview` pelo admin
- **Trilhas curriculares**: em construção; professor define `activeTrack` → palavras filtradas em tempo real
- **Sync**: throttle 60 s; buffer offline; `removeUndefinedFields()` antes de `setDoc`
- **Pioneiros Nível 100**: primeiros 3 alunos registrados com `reachedLevel100At`
- **HubConfig**: `disabledGames[]` e `featuredGame` gerenciados pelo admin — opt-in por jogo

## Restrições hard
- **Jogos de alunos**: `BaseGameProps` obrigatório; zero chamadas Firestore; zero assets externos
- **Sem Cloud Functions**: não utilizado; toda lógica de jogo é client-side
- **Stack fixa**: React + Vite + TypeScript + Firestore + Firebase Auth
- **Sem RTDB**: apenas Firestore Nativo
- **Cota diária Blaze**: máx 50k leituras + 20k escritas/dia — features novas devem declarar impacto
- **server.ts**: serve SPA + métricas admin apenas; nenhum cálculo de jogo no servidor
