# Backlog de Features — TypeClicker

## Sugeridas

> Adicione novas features nesta tabela antes de levar para brainstorm com IA.

| Feature | Dados Firebase usados | Telas afetadas | Complexidade P/M/G | Status |
|---|---|---|---|---|
| **[BUG]** Corrigir `hackTokens` → `cosmetics.levelTokens` no Baú Criptográfico | `saves/{uid}.saveState.cosmetics.levelTokens` | `App.tsx:905` | P | Bug confirmado |
| **[DÉBITO]** Migrar `TypeRadarGame.onExitToHub` para novo `GameExitPayload` | `saves/{uid}.saveState.arcadeHistory` | `App.tsx`, `TypeRadarGame.tsx` | P | Débito técnico |
| **[DÉBITO]** Implementar normalização de bytes no Hub para jogos plug-in | nenhum (lógica pura) | `App.tsx` (handler de saída de plug-ins) | P | Débito técnico |
| Finalizar trilhas curriculares (Scratch, Web, Empresarial, Inglês) | `system/settings.activeTrack` | `words.ts`, `App.tsx` | M | Em andamento |
| **[PROFESSOR]** Implementar `byte_logic` | `saves/{uid}.saveState.arcadeHistory` | `GameSelectionScreen`, `App.tsx` | M | Pendente |
| **[PROFESSOR]** Implementar `math_storm` | `saves/{uid}.saveState.arcadeHistory` | `GameSelectionScreen`, `App.tsx` | M | Pendente |
| **[PROFESSOR]** Implementar `syntax_maze` | `saves/{uid}.saveState.arcadeHistory` | `GameSelectionScreen`, `App.tsx` | M | Pendente |
| **[ALUNOS]** Integrar 1º jogo de aluno (ID definido pelo professor) | `saves/{uid}.saveState.arcadeHistory` | `GameSelectionScreen`, `App.tsx` | M | Aguardando entrega |
| Scheduler automático de backups | `backups/{backupId}` | Admin panel | G | Ideia |
| **[TEMPORADAS]** Suporte a Temporadas Bimestrais no Supabase | `public.profiles(season_bytes)`, `public.season_history` | `schema.sql`, `supabaseAdapter.ts` | M | Pronto no Schema / Pendente UI |
| **[ADMIN]** Painel Docente: Fechamento de Bimestre / Nova Temporada | RPC `close_current_season` | `AdminPanel.tsx` | M | Pendente |
| **[LEADERBOARD]** Seletor de "Bimestre Atual vs Todos os Tempos" | `public.profiles.season_bytes`, `public.season_history` | `LeaderboardModal.tsx` | M | Pendente |
| **[ANTI-CHEAT]** Chamada atômica de ganho de bytes via RPC `record_game_session` | RPC `record_game_session` | `supabaseAdapter.ts`, `App.tsx` | P | Pendente |

---

## Checklist de integração — jogo de aluno (responsabilidade do professor)

Antes de integrar um componente de aluno ao hub de produção:

- [ ] Compila sem erros TypeScript: `bun run build` ou `npm run build`
- [ ] Implementa `BaseGameProps` (`src/types/gamePlugin.ts`) — não `GamePluginProps` legado
- [ ] `onExitToHub(payload: GameExitPayload)` é o único ponto de saída
- [ ] Sem imports de `firebaseService`, `db`, `setDoc`, `getDoc`
- [ ] Sem assets externos: sem `.mp3`, `.ogg`, fontes de CDN, imagens remotas
- [ ] Todos os `requestAnimationFrame`, `setInterval`, `setTimeout` cancelados no cleanup do `useEffect`
- [ ] `OscillatorNode.stop()` e `AudioContext.close()` chamados no unmount
- [ ] `window.removeEventListener` para todos os listeners globais no unmount
- [ ] `bytesEarned` calculado como `score × 0.15` (o Hub aplica o cap de normalização)
- [ ] `levelTokensEarned` concedido apenas se `accuracyPercentage >= 80`
- [ ] `GameId` do jogo adicionado ao tipo `GameId` em `gamePlugin.ts`
- [ ] Card do jogo adicionado em `GameSelectionScreen.tsx`
- [ ] Handler de saída adicionado em `App.tsx` (equivalente ao bloco `type_radar`)
- [ ] Jogo inicialmente desabilitado via `HubConfig.disabledGames` — professor habilita no painel

---

## Descartadas / Alternativas não usadas

- **Realtime Database (RTDB)** — Firestore escolhido exclusivamente (`FIRESTORE_NATIVE`).
- **SSR / Next.js** — SPA puro com Cloud Run; decisão mantém tudo client-side.
- **Bot simulado para Arena 1×1** — `ArenaPlayer.isBot?` tipado em `arena.ts:15`, mas sem implementação.
- **`measurementId` e `recaptchaSiteKey`** — vazios em `firebase-applet-config.json`; Firebase Analytics e reCAPTCHA não inicializados.
- **`GamePluginProps` (contrato legado)** — substituído por `BaseGameProps` + `GameExitPayload` do guia pedagógico dos alunos.
