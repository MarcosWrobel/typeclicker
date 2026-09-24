# Decisões de Arquitetura — TypeClicker

## Decisões confirmadas do código

- **Firestore em vez de Realtime Database** — `firebase.json` define `dataAccessMode: FIRESTORE_NATIVE`; nenhum import de `firebase/database` existe. Escolha ligada às regras de segurança declarativas e queries mais ricas. (commit: `69a8019`)

- **Cloud Run como runtime de produção** — `server.ts` detecta `process.env.K_SERVICE` para distinguir produção de dev local; serve o bundle `dist/` via `express.static` em produção e Vite middleware em dev. Hospedado no AI Studio em `typeclicker-leopoldina.ai.studio`.

- **Toda a lógica de jogo é client-side** — `server.ts` serve apenas rotas de métricas admin (`/api/metrics`) e o SPA; nenhum cálculo de pontuação ou save ocorre no servidor. (commit: `a4ece21`)

- **Plano Blaze com orçamento controlado** — limites do tier gratuito Blaze tratados como cotas hard no código (50k leituras / 20k escritas por dia). Throttle de 60 s entre escritas implementado em `useGameSync`.

- **Sem Cloud Functions por decisão deliberada** — plano Blaze permite; mas nenhuma função foi criada. Toda a lógica que precisaria ser server-side (anti-cheat, saves) fica no client com validação por regras Firestore.

- **`totalBytesEarned` como métrica imutável de progressão** — nível nunca decresce; `bytes` (moeda corrente) pode ser gasto, mas `totalBytesEarned` só cresce. Separação intencional em `GameState`.

- **localStorage como cache offline com fallback para Firestore** — `loadSavedState(uid)` lê do localStorage com chave isolada por UID; ao logar, Firestore tem prioridade; se falhar (offline), usa cache local.

- **Google Auth obrigatório para salvar na nuvem** — `saves/{uid}` e `leaderboard/{uid}` exigem `isOwner(userId)` nas regras Firestore; sem login o estado persiste apenas no localStorage.

- **E-mails de admin hardcoded + extensível por Firestore** — `ADMIN_EMAILS` hardcoded em `firebaseService.ts` para os super-admins; professores adicionais via `system/settings.allowedTeachers`.

- **DDA no Type: Radar** — `spawnRadarEnemy()` ajusta velocidade com base na acurácia em tempo real (<60% → ×0.82; >95% → ×1.15). Objetivo pedagógico: manter o desafio calibrado ao nível real do aluno.

- **3 moedas distintas para cosméticos** — `levelTokens` (farming passivo), `duelTokens` (Arena PvP), `quantumFragments` (endgame Nível 100). Segmentação previne que alunos de níveis baixos acessem itens de endgame.

- **Trava escolar por código de sessão** — professor publica `activeCode` + `expiresAt` no Firestore; alunos leem via `onSnapshot`; validação é client-side contra valor do Firestore; turma vinculada automaticamente.

- **`removeUndefinedFields()` antes de todo `setDoc`** — Firestore rejeita campos `undefined`; função recursiva aplicada antes de cada escrita (`firebaseService.ts:244`).

- **`schemaVersion` em `GameState` para retrocompatibilidade** — campo opcional para futuras migrações sem quebrar saves antigos.

- **Hub de seleção de jogos** — `selectedGame: 'typeclicker' | 'type_radar' | null` em `App.tsx`; null → `GameSelectionScreen`. Arquitetura preparada para adicionar 3º jogo sem refatoração profunda.

- **Backups manuais** — `backups/{backupId}` disparado pelo admin via painel; sem scheduler automático por enquanto.

- **Telemetria por tecla para treino adaptativo** — `keyTelemetry: Record<char, {hits, misses, totalTimeMs}>` armazenada no save; `adaptiveDrillEngine.ts` calcula IDT (Índice de Dificuldade da Tecla) para gerar treinos corretivos.

## Bug confirmado — campo `hackTokens`

**Contexto**: `App.tsx:905` em `handleChestReward` (recompensa do Baú Criptográfico da Masmorra):
```ts
hackTokens: (prev.hackTokens || 0) + reward.tokens,
```
**Diagnóstico**: campo `hackTokens` não existe em `GameState` (`types.ts`). TypeScript não acusa erro porque o spread `...prev` passa a verificação. O campo existe no objeto em runtime mas é invisível ao sistema de tipos — os tokens do Baú **não estão sendo creditados em `cosmetics.levelTokens`**. É um campo fantasma que cresce no save mas nunca é lido por nenhuma UI.

**Ação recomendada**: substituir por `cosmetics: { ...prev.cosmetics, levelTokens: (prev.cosmetics?.levelTokens || 0) + reward.tokens }`.

## Pendências restantes

- **Trilhas curriculares em construção** — Scratch, Web, Empresarial, Inglês e Geral têm tipo definido em `types/curricularTracks.ts`, mas o conteúdo das palavras/frases ainda está sendo elaborado
