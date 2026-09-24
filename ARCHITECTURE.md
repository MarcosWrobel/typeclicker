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
- **Sem RTDB**: não detectado Realtime Database — só Firestore Nativo
- **Sem Cloud Functions**: não existe pasta `functions/` nem dependência `firebase-functions` (plano Blaze permite, mas não utilizado)
- **server.ts**: Express + Firebase Admin SDK + `@google-cloud/monitoring` — serve rotas de métricas admin e o SPA compilado em produção
- **Cotas de referência (hardcoded em `server.ts`)**: 50 000 leituras/dia · 20 000 escritas/dia (limites do tier gratuito Blaze)
- **Sync throttle**: 60 segundos mínimo entre escritas (comentário em `App.tsx`: `Cota Spark: 60s`)

## Jogos existentes

### Jogo 1 — TypeClicker (jogo principal)
- **Arquivos principais**: `src/App.tsx` (2960 linhas), `src/components/TypingArena.tsx` (1336 linhas)
- **Mecânica**: clicker incremental de digitação — jogador digita palavras exibidas no terminal; cada tecla correta gera Bytes (moeda principal)
- **Modos de texto**: `words` | `sentences` | `code`
- **Categorias de dificuldade**: `iniciante` | `facil` | `medio` | `avancado` | `expert` (com `bonusMultiplier` 1.0× a 2.5×)
- **Progressão**: 100 níveis baseados em `totalBytesEarned` (thresholds em `src/data/levels.ts`); tiers de 10 em 10 níveis com títulos pedagógicos (ex.: "1–10: Fundamentos", "91–100: Lendas Leopoldina")
- **Pontuação por tecla**: `Math.max(1, round(bytesPerChar × multiplier × prestigeMult × diffBonus))`; multiplicador sobe 0.2× a cada 5 acertos (cap 5.0×, 6.0× para Arqueiro)
- **Bônus de palavra**: `round(word.length × (bytesPerChar×1.5+4) × multiplier × prestigeMult × diffBonus)`
- **Classes RPG**: `warrior` (+25% bytes ao digitar acima de 55 PPM) · `archer` (+0.2× a cada 20 acertos seguidos) · `mage` (+25% bytes passivos por segundo)
- **Upgrades**: 5 ativos (+bytes/tecla) + 5 passivos (+bytes/segundo) com custo = `baseCost × multiplier^count`
- **Prestige**: `prestigeCores` multiplicam ganhos por `1 + cores×0.2`
- **Modos de aula**: Corrida Escolar (`ClassroomRaceArena`) · Raid Coletiva contra Chefe (`ClassroomRaidArena`)

### Jogo 2 — Type: Radar ("Defesa Cibernética")
- **Arquivos principais**: `src/components/games/radar/TypeRadarGame.tsx` (1785 linhas), `src/services/radarEngine.ts` (402 linhas)
- **Mecânica**: tower-defense/bullet-hell; inimigos (naves) orbitam num radar circular; jogador digita a palavra da nave para destruí-la antes de atingir o núcleo
- **Tipos de inimigo**: `scout` · `drone` · `tank` · `glitch` · `boss` (multi-fases, estágio por estágio)
- **Tipos de onda**: `normal` · `swarm` (ondas 3, 7, e >10 com módulo 5 = 2) · `boss` (múltiplos de 5)
- **DDA**: acurácia <60% → velocidade ×0.82; acurácia >95% → velocidade ×1.15
- **Comandos especiais**: `/freeze` (5s, 8s com upgrade) · `/nuke` (elimina tudo, custa 100 energia) · `/shockwave` (empurra naves)
- **Fórmula de bytes ao encerrar**: `score × 0.12 × max(0.3, accuracy/100) + wave × 60`
- **Upgrades in-run**: pool de 10 cards (common/rare/epic), 3 oferecidos ao limpar cada onda
- **Integração com hub**: bytes ganhos retornam ao TypeClicker via callback `onExitToHub(bytesEarned, endStats)`

## Modelo de dados

### Coleções Firestore
| Coleção | Chave | Campos obrigatórios (regras) |
|---|---|---|
| `saves/{userId}` | UID Firebase | `userId`, `saveState` (map) |
| `leaderboard/{userId}` | UID Firebase | `userId`, `nome`, `level`, `points` |
| `system/settings` | documento único | `activeCode`, `expiresAt`, `activeTurma`, `activeTrack`, `allowedTeachers` |
| `arena_rooms/{roomId}` | `active_classroom_raid` / `active_classroom_race` / ID de sala 1×1 | varia por tipo |
| `backups/{backupId}` | ID do backup (manual, disparado pelo admin) | `saves: Record<uid, payload>`, `leaderboard: Record<uid, entry>` |

### Campos-chave de `GameState` (salvo em `saves/{uid}.saveState`)
- `bytes`, `totalBytesEarned`, `bytesPerChar`, `autoBytesPerSec`
- `comboStreak`, `maxCombo`, `multiplier`, `prestigeCount`, `prestigeCores`
- `correctKeys`, `wrongKeys`, `wordsCompleted`, `totalActiveSeconds`
- `cosmetics: PlayerCosmetics` → `{levelTokens, duelTokens, quantumFragments, equippedTheme, equippedSkin, ...}`
- `arenaStats: ArenaStats` → `{matchesPlayed, wins, losses, duelPoints, currentRankId}`
- `radarStats` → `{bestWave, highScore, maxWpm, totalGames, totalEnemiesDefeated}`
- `keyTelemetry: Record<char, {hits, misses, totalTimeMs}>` (telemetria por tecla para treino adaptativo)
- `achievements: Record<achievementId, timestamp>`, `quests: QuestsState`, `rpgClass`
- `isClassLocked`, `flaggedForReview`, `schemaVersion`

## Fluxo de autenticação
- **Login**: `signInWithPopup(GoogleAuthProvider)` → listener `onAuthStateChanged`
- **Logado com save em nuvem**: carrega `saves/{uid}` → aplica conquistas retroativas → se aluno sem apelido/classe RPG → abre `StudentModal`
- **Fallback offline**: `loadSavedState(uid)` do `localStorage`
- **Admin**: e-mail em `ADMIN_EMAILS` (hardcoded em `firebaseService.ts`); professores adicionais via `system/settings.allowedTeachers[]`; dev bypass via `localStorage.typeclicker_dev_admin`
- **Trava escolar**: Firestore realtime subscription em `system/settings` → se `activeCode` ativo → `SessionLockOverlay`; aluno digita código → valida e vincula turma automaticamente
- **Deslogado**: `setState(INITIAL_STATE)` + `clearSavedState()`

## Regras de negócio implementadas
- **Nível** = lookup de `totalBytesEarned` contra tabela de 100 thresholds em `levels.ts` — nunca decresce
- **Multiplicador de combo**: +0.2× a cada 5 acertos, cap 5.0× (6.0× para classe Arqueiro)
- **Moedas**: `levelTokens` (compras na loja) · `duelTokens` (Arena 1×1) · `quantumFragments` (itens endgame, desbloqueados no Nível 100)
- **Anti-cheat**: `validateStateSanity()` antes de salvar; `flaggedForReview` marcado pelo admin
- **Trilhas curriculares**: em construção (Scratch · Web · Empresarial · Inglês · Geral); professor define `activeTrack` → palavras filtradas em tempo real
- **Sync**: throttle de 60 s; buffer offline em `useGameSync`; `removeUndefinedFields()` antes de todo `setDoc`
- **Pioneiros Nível 100**: primeiros 3 alunos registrados com `reachedLevel100At` no leaderboard

## Restrições hard (para modelos externos não violarem)
- **Sem Cloud Functions**: arquitetura atual não usa — toda lógica de jogo é client-side; plano Blaze permite, mas não há intenção imediata de adotar
- **Sem backends próprios / APIs pagas em produção**: não sugerir servidores externos, webhooks, orquestradores fora do Cloud Run já provisionado
- **Stack fixa**: React + Vite + TypeScript + Firestore + Firebase Auth — não sugerir trocas de framework ou banco
- **Sem Realtime Database**: o projeto usa apenas Firestore Nativo
- **Cota diária do tier gratuito Blaze**: máx 50k leituras + 20k escritas/dia — features novas devem declarar impacto nas cotas
- **100% client-side para lógica de jogo**: `server.ts` serve apenas SPA + métricas de admin; nenhum cálculo de pontuação ou save ocorre no servidor
