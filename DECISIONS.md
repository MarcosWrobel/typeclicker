# Decisões de Arquitetura — TypeClicker

## Decisões confirmadas do código

- **Firestore em vez de Realtime Database** — `firebase.json` define `dataAccessMode: FIRESTORE_NATIVE`; nenhum import de `firebase/database` existe. Regras de segurança declarativas e queries mais ricas. (commit: `69a8019`)

- **Cloud Run como runtime de produção** — `server.ts` detecta `process.env.K_SERVICE`; serve `dist/` via `express.static` em produção e Vite middleware em dev. Domínio: `typeclicker-leopoldina.ai.studio`.

- **Toda a lógica de jogo é client-side** — `server.ts` serve apenas rotas de métricas admin e o SPA; nenhum cálculo de pontuação no servidor. (commit: `a4ece21`)

- **Plano Blaze com orçamento controlado** — limites do tier gratuito Blaze tratados como cotas hard (50k leituras / 20k escritas/dia). Throttle de 60 s em `useGameSync`.

- **Sem Cloud Functions por decisão deliberada** — plano Blaze permite, mas não há intenção imediata. Toda lógica que precisaria de server-side fica no client com validação por regras Firestore.

- **Hub normaliza bytes dos plug-ins** — jogos de alunos entregam métricas brutas; o Hub aplica `min(bytesEarned, timeSpentSeconds × CAP × accuracyFactor)` antes de creditar. Evita que um jogo mal balanceado infle a economia.

- **Contrato adotado: `BaseGameProps` + `GameExitPayload`** (substituiu `GamePluginProps` legado) — contrato pedagógico do guia dos alunos foi adotado como contrato real do código (`src/types/gamePlugin.ts`). Mais rico: inclui `GameSessionStats`, `levelTokensEarned`, `duelTokensEarned` e `difficultyMultiplier`.

- **Fluxo de contribuição de jogos de alunos**: alunos escolhem tema e gênero livremente → desenvolvem no AI Studio usando `GUIA_CRIACAO_DE_JOGOS.md` como prompt-base → entregam apenas o arquivo `index.tsx` → professor avalia (checklist técnico + pertinência pedagógica) → professor integra manualmente em `src/components/games/<nome>/`, define o `GameId`, e registra o bloco de roteamento em `App.tsx` → habilitado via `HubConfig` no painel admin. **Os IDs `byte_logic`, `math_storm` e `syntax_maze` são reservados para jogos do professor.**

- **Opt-in por jogo via `HubConfig.disabledGames`** — professor habilita/desabilita jogos individualmente sem deploy; persiste em `system/settings.hubConfig` (lido via `onSnapshot` existente, zero leituras extras).

- **`totalBytesEarned` como métrica imutável de progressão** — nível nunca decresce; `bytes` pode ser gasto, `totalBytesEarned` só cresce.

- **localStorage como cache offline com fallback para Firestore** — `loadSavedState(uid)` com chave isolada por UID; Firestore tem prioridade ao logar.

- **E-mails de admin hardcoded + extensível por Firestore** — `ADMIN_EMAILS` hardcoded para super-admins; professores extras via `system/settings.allowedTeachers`.

- **DDA no Type: Radar** — `spawnRadarEnemy()` ajusta velocidade com base na acurácia em tempo real (<60% → ×0.82; >95% → ×1.15).

- **3 moedas distintas para cosméticos** — `levelTokens` (farming), `duelTokens` (PvP), `quantumFragments` (endgame Lvl 100). Segmentação por nível.

- **Trava escolar por código de sessão** — `onSnapshot` em `system/settings`; validação client-side; turma vinculada automaticamente.

- **`removeUndefinedFields()` antes de todo `setDoc`** — Firestore rejeita `undefined` (`firebaseService.ts:244`).

- **Backups manuais** — `backups/{backupId}` disparado pelo admin; sem scheduler por enquanto.

- **Telemetria por tecla para treino adaptativo** — `keyTelemetry: Record<char, {hits, misses, totalTimeMs}>`; `adaptiveDrillEngine.ts` calcula IDT para treinos corretivos.

- **`arcadeHistory: ArcadeMatchRecord[]`** — array circular (máx 10) no `GameState` para histórico de partidas de todos os minijogos plug-in.

## Bug confirmado — campo `hackTokens`

`App.tsx:905` em `handleChestReward` escreve `hackTokens: (prev.hackTokens || 0) + reward.tokens`. Campo não existe em `GameState`. TypeScript não acusa erro por causa do spread. Tokens do Baú **não estão sendo creditados em `cosmetics.levelTokens`**.

**Correção**: substituir por `cosmetics: { ...prev.cosmetics, levelTokens: (prev.cosmetics?.levelTokens || 0) + reward.tokens }`.

## Bug confirmado — `TypeRadarGame` usa contrato legado

`TypeRadarGame` ainda usa a assinatura antiga `onExitToHub(bytesEarned, endStats)` em vez do novo `GameExitPayload`. Migração pendente para alinhar com o contrato `BaseGameProps`.

## Pendências restantes

- Trilhas curriculares em construção (Scratch, Web, Empresarial, Inglês, Geral)
- Migrar `TypeRadarGame.onExitToHub` para `GameExitPayload`
- Implementar normalização de bytes no Hub para jogos plug-in
- Corrigir `hackTokens` → `cosmetics.levelTokens`
