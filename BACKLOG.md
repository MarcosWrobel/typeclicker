# Backlog de Features — TypeClicker

## Concluídas Recentemente

| Feature | Dados DB (Supabase / Legado Firestore) | Telas / Arquivos | Complexidade | Status |
|---|---|---|---|---|
| **[BUG]** Corrigir `hackTokens` → `cosmetics.levelTokens` no Baú Criptográfico | `game_progress.state_payload` / `saves/{uid}` | `App.tsx`, `storage.ts` | P | **Concluído** |
| **[DÉBITO]** Migrar `TypeRadarGame.onExitToHub` para novo `GameExitPayload` | `game_progress.state_payload.arcadeHistory` | `App.tsx`, `TypeRadarGame.tsx` | P | **Concluído** |
| **[DÉBITO]** Implementar normalização de bytes no Hub para jogos plug-in | nenhum (lógica pura) | `App.tsx`, `gameNormalizer.ts` | P | **Concluído** |
| **[CURRÍCULO]** Finalizar trilhas curriculares (Scratch, Web, Empresarial, Inglês) em Palavras, Frases e Código | `system/settings.activeTrack` | `words.ts`, `codeSnippets.ts`, `App.tsx` | M | **Concluído** |
| **[ANTI-CHEAT]** Chamada atômica de ganho de bytes via RPC `record_game_session` | RPC `record_game_session` (PostgreSQL) / Firestore fallback | `dbInterface.ts`, `supabaseAdapter.ts`, `firebaseAdapter.ts`, `App.tsx` | P | **Concluído** |
| **[A11Y/TECLADO]** Detecção global de Caps Lock e aviso pedagógico de Maiúscula/Minúscula em todas as 9 arenas | nenhum (lógica pura client-side) | `keyboardCase.ts`, `CapsLockWarning.tsx`, todas as arenas | M | **Concluído (`39aef74`)** |
| **[UX/DIGITAÇÃO]** Terminal adaptativo com auto-scroll em frases/códigos e Dead Keys no Modo Foco | nenhum (lógica pura client-side) | `TypingArena.tsx`, `FocusDrillModal.tsx`, `App.tsx` | M | **Concluído (`4ec9cad`)** |
| **[ARQUITETURA]** Auditoria e Sanitização da Arquitetura Híbrida & Zero Bypasses | `IDatabaseService`, `SupabaseAdapter`, `FirebaseAdapter` | `App.tsx`, `AdminPanel.tsx`, `dbInterface.ts`, `leaderboardUtils.ts` | G | **Concluído (`5f1213c`)** |
| **[TEMPORADAS]** Suporte a Temporadas Trimestrais no Supabase | `public.profiles(season_bytes)`, `public.seasons_history` | `schema.sql`, `supabaseAdapter.ts`, `dbInterface.ts` | M | **Concluído (`2924470`)** |
| **[ADMIN]** Painel Docente: Fechamento Seguro de Trimestre com Confirmação | RPC `close_current_season` | `AdminPanel.tsx` | M | **Concluído (`2924470`)** |
| **[LEADERBOARD]** Seletor de "3º Trimestre (Atual) | Todos os Tempos | Hall da Fama" | `public.profiles.season_bytes`, `public.seasons_history` | `LeaderboardModal.tsx` | M | **Concluído (`2924470`)** |
| **[JOGO/RITMO]** Construção e Integração do `TyperDash` (Single-Beat Rhythm Runner) | `public.profiles`, `gamePlugin.ts` | `TyperDashGame.tsx`, `TyperDashCanvas.tsx`, `typerDashAudio.ts`, `gameCatalog.ts`, `App.tsx` | G | **Concluído** |
| **[ADMIN/BACKUPS]** Snapshot Relacional JSON & Restauração com Upsert Idempotente no Supabase | Tabelas `profiles`, `game_progress`, `user_cosmetics`, `user_achievements`, `season_history` | `supabaseBackupService.ts`, `AdminPanel.tsx` | M | **Concluído** |
| **[ADMIN/BACKUPS]** Tolerância a Tabelas Ausentes no Schema Cache & Migração SQL de Temporadas | `public.profiles(season_bytes)`, `public.season_history` | `supabaseBackupService.ts`, `create_season_history.sql`, `initialize-current-trimester.sql` | P | **Concluído (`0a9521d`)** |
| **[ADMIN/MÉTRICAS]** Diagnóstico de Conexão, Latência e Contadores Head Queries Zero-Egress | Contagens PostgreSQL via PostgREST | `supabaseMetricsService.ts`, `AdminPanel.tsx` | M | **Concluído** |
| **[ADMIN/WIPE]** Wipe em Cascata no PostgreSQL com Higienização Sincronizada no Firestore | Banco Supabase + Coleções legadas Firestore | `supabaseAdapter.ts`, `AdminPanel.tsx` | M | **Concluído** |
| **[ALUNOS/JOGO]** Integrar 1º jogo de aluno: `ProgPlay` (André Luís Borato Ferreira - 8º 2) | `public.game_progress` (Supabase) | `ProgPlayGame.tsx`, `gameCatalog.ts`, `gamePlugin.ts`, `App.tsx` | G | **Concluído** |

---

## Prioridades do Backlog

### P1 — Integridade & Segurança
| Feature | Dados DB (Supabase / Legado Firestore) | Telas afetadas | Complexidade | Status |
|---|---|---|---|---|
| *(Nenhuma pendência crítica imediata em P1)* | - | - | - | Em dia |

### P2 — Débitos Técnicos e Trilhas Curriculares
| Feature | Dados DB (Supabase / Legado Firestore) | Telas afetadas | Complexidade | Status |
|---|---|---|---|---|
| *(Nenhuma pendência imediata em P2)* | - | - | - | Em dia |

### P3 — Novos Jogos e Expansão do Hub
| Feature | Dados DB (Supabase / Legado Firestore) | Telas afetadas | Complexidade | Status |
|---|---|---|---|---|
| **[PROFESSOR]** Implementar `byte_logic` | `public.game_progress` (Supabase) | `GameSelectionScreen`, `App.tsx` | M | Pendente |
| **[PROFESSOR]** Implementar `math_storm` | `public.game_progress` (Supabase) | `GameSelectionScreen`, `App.tsx` | M | Pendente |
| **[PROFESSOR]** Implementar `syntax_maze` | `public.game_progress` (Supabase) | `GameSelectionScreen`, `App.tsx` | M | Pendente |
| Scheduler automático de backups | `backups/{backupId}` | Admin panel | G | Ideia |

---

## Checklist de integração — jogo de aluno (responsabilidade do professor)

Antes de integrar um componente de aluno ao hub de produção:

- [ ] Compila sem erros TypeScript: `bun run build` ou `npm run build`
- [ ] Implementa `BaseGameProps` (`src/types/gamePlugin.ts`) — não `GamePluginProps` legado
- [ ] `onExitToHub(payload: GameExitPayload)` é o único ponto de saída
- [ ] Sem imports de banco de dados (`firebaseService`, `supabaseAdapter`, `supabase`, `db`, `setDoc`, `getDoc`)
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

- **[OBSOLETO / SUBSTITUÍDO] Realtime Database (RTDB) & Firestore Nativo** — Firestore substituído oficialmente pelo Supabase (PostgreSQL 15+). RTDB descartado e Firestore mantido estritamente como contingência offline/emergencial (`FirebaseAdapter`).
- **SSR / Next.js** — SPA puro com Cloud Run; decisão mantém tudo client-side.
- **Bot simulado para Arena 1×1** — `ArenaPlayer.isBot?` tipado em `arena.ts:15`, mas sem implementação.
- **`measurementId` e `recaptchaSiteKey`** — vazios em `firebase-applet-config.json`; Firebase Analytics e reCAPTCHA não inicializados.
- **`GamePluginProps` (contrato legado)** — substituído por `BaseGameProps` + `GameExitPayload` do guia pedagógico dos alunos.
