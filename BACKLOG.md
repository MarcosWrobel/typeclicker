# Backlog de Features — TypeClicker

## Concluídas Recentemente

| Feature | Dados DB (Supabase / Legado Firestore) | Telas / Arquivos | Complexidade | Status |
|---|---|---|---|---|
| **[PAINEL/CONSOLIDAÇÃO]** Central Consolidada de Métricas & Gestão do Hub (`ConsolidatedMetricsHub` unificando `AdminPanel` e `PedagogicalPanel`), Painel Dedicado do SheetQuest (nível atual 1 a 48, status de autonomia pedagógica, timestamp da última entrada na plataforma e último progresso nas planilhas, com exportação CSV) e Gestor do Catálogo de Jogos do Hub (todos os 13 jogos do catálogo com reordenação dinâmica `↑ Subir`, `↓ Descer` e `🔝 Topo`, toggles de visibilidade para alunos e jogo em destaque persistidos no Supabase) | `public.profiles(updated_at)`, `public.game_progress(sheetquest)`, `public.system_settings(hubConfig)` | `ConsolidatedMetricsHub.tsx`, `AdminPanel.tsx`, `PedagogicalPanel.tsx`, `GameSelectionScreen.tsx`, `systemSettingsService.ts`, `supabaseAdapter.ts`, `types/leaderboard.ts` | G | **Concluído** |
| **[ADMIN/MÉTRICAS & SANDBOX]** Painel de ADM Completo com Acesso a Métricas de Alunos (KPIs de Turma, Tabela Multi-Jogos, Boletim CSV, Raio-X individual) + Sandbox de Fases com Bypass Irrestrito de Progressão (seletor direto das 48 demandas e 12 auditorias do SheetQuest, simulação de níveis 1 a 100 e disparo de Boss Fights do TypeClicker, e seletor rápido `⚡ Pular Fase` in-game para contas ADM) | `public.profiles`, `public.game_progress` | `AdminPanel.tsx`, `SheetQuestGame.tsx`, `App.tsx` | G | **Concluído** |
| **[JOGO/PLANILHAS]** Despoluição Visual Total do Layout do SheetQuest (remoção de menus falsos de desktop, remoção de modal de bloqueio inicial e sidebar duplicada; introdução de Topo Ultra-Enxuto com navegador de demandas `[←] N/Total [→]`, Faixa Integrada de Metas com pílulas clicáveis e Planilha em Widescreen 100% sem compressão lateral) | nenhum (aprimoramento de UX/UI) | `SheetQuestGame.tsx`, `SheetGridCanvas.tsx` | M | **Concluído** |
| **[JOGO/PLANILHAS]** Expansão Massiva do SheetQuest (+30 Níveis, Total 48 Demandas nos Mundos 7 a 14) + Transição para Autonomia Pedagógica Total (remoção de fórmulas prontas, sem revelação de coordenadas a partir do Nível 16) + Correção de Fórmulas Encadeadas no `getCellValue` | `public.game_progress` (Supabase) | `sheetLevelsData.ts`, `formulaEngine.ts`, `SheetQuestGame.tsx` | G | **Concluído** |
| **[JOGO/RITMO]** TyperDash: Sistema Anti-Mashing contra burla por pressão simultânea de teclas (<65ms chord lock) e penalidade de erro (reset de combo + som `MISS!` + lockout de re-tentativa na Jump Zone) | nenhum (lógica pura client-side) | `TyperDashGame.tsx`, `TyperDashCanvas.tsx`, `typerDashAudio.ts` | M | **Concluído** |
| **[JOGO/RADAR]** TypeRadar: Correção da física de aproximação das naves em direção ao centro (eliminação de reset de distância a 360px gerado por re-renders do React) | nenhum (física de loop 60 FPS) | `TypeRadarGame.tsx`, `RadarCanvas.tsx` | M | **Concluído** |
| **[JOGO/PLANILHAS]** SheetQuest: Correção do motor de avaliação da condicional `=SE` e lógica booleana PT-BR (eliminação de falsos-positivos com string `'FALSO'` truthy em JS, destravando o Nível 10) | nenhum (lógica do motor de fórmulas) | `formulaEngine.ts`, `sheetLevelsData.ts` | P | **Concluído** |
| **[POPUP/CELEBRAÇÃO]** Pop-up Triunfal Comemorativo do 1º Nível 100 com cascata de confetes (`canvas-confetti`), coroa dourada, avatar pioneiro e botão interativo de confetes | `public.game_progress(reachedLevel100At)`, `public.profiles` | `Level100CelebrationModal.tsx`, `Level100PioneersWidget.tsx`, `StatsSidebar.tsx`, `LeaderboardModal.tsx`, `App.tsx` | M | **Concluído** |
| **[LEADERBOARD/MÉTRICAS]** Revisão e Integração Completa dos Rankings Escolares de Todos os Jogos e Métricas via `enrichProfilesWithProgress` (PPM real, Precisão, Combo, Duelos PvP, Corridas, Radar, Dash, ByteQuest, SheetQuest) | `public.game_progress` (RPCs e snapshots JSONB), `public.profiles` | `supabaseAdapter.ts`, `LeaderboardModal.tsx`, `useLeaderboardPodium.ts`, `TopPodiumWidget.tsx`, `types/leaderboard.ts` | G | **Concluído** |
| **[JOGO/PLANILHAS]** Construção e Integração do `SheetQuest: Mestre das Planilhas` (Google Planilhas gamificado em Modo Light, redimensionamento de colunas/linhas, storytelling do Gerente Marco Silva, briefing animado e motor de fórmulas PT-BR) | `public.game_progress` (Supabase) | `SheetQuestGame.tsx`, `formulaEngine.ts`, `sheetLevelsData.ts`, `sheetQuest.ts`, `GameSelectionScreen.tsx`, `gameCatalog.ts`, `App.tsx` | G | **Concluído** |
| **[DESIGN/HUB]** Arte SVG Original, Temática e Responsiva para todos os 7 jogos do Hub (TypeClicker, TyperDash, Radar, ByteQuest, SheetQuest, ScratchBot, ProgPlay) | nenhum (vetorial client-side) | `GameCoverArt.tsx`, `SheetQuestArt.tsx`, `index.ts`, `GameSelectionScreen.tsx` | M | **Concluído** |
| **[PERFORMANCE]** Eliminação de Stutter/Jitter, Efeito Elástico no Radar e Reflows de Digitação/Loja | nenhum (otimização client-side) | `RadarCanvas.tsx`, `TypeRadarGame.tsx`, `TypingArena.tsx`, `ShopPanel.tsx`, `fxEngine.ts`, `App.tsx` | G | **Concluído** |
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
| **[ALUNOS/JOGO]** Integrar 1º jogo de aluno: `ProgPlay` (André Luís Borato Ferreira - 8º 2) | `public.game_progress` (Supabase) | `ProgPlayGame.tsx`, `gameCatalog.ts`, `gamePlugin.ts`, `App.tsx` | G | **Concluído (`e289ff9`)** |
| **[HUB/CATÁLOGO]** Ordenação prioritária (3 principais + recém-adicionados na 4ª posição) | nenhum (lógica client-side) | `gameCatalog.ts` | P | **Concluído (`c373682`)** |
| **[PROGPLAY/UX]** Painel de entrada com apresentação pedagógica, créditos e seleção inicial de linguagem | nenhum (lógica client-side) | `LanguageSelectModal.tsx`, `ProgPlayGame.tsx` | P | **Concluído (`c373682`)** |
| **[JOGO/LÓGICA]** Implementar `ScratchBot: Logic Quest` (substituindo `byte_logic`) | `public.game_progress` (Supabase) | `ScratchBotGame.tsx`, `gameCatalog.ts`, `gamePlugin.ts`, `App.tsx` | G | **Concluído** |
| **[SCRATCHBOT/OBSTÁCULOS]** Obstáculos Interativos: EMP Hazards, Warp Pads, Portões Laser com Chaves e Esteiras | nenhum (lógica pura client-side) | `ScratchBoardCanvas.tsx`, `levelsData.ts`, `proceduralGenerator.ts`, `scratchAudio.ts` | M | **Concluído** |
| **[SCRATCHBOT/UX]** Layout de 3 colunas otimizado, suporte a aninhamento em loops e skin oficial do Bytezinho | `user_cosmetics` / `equippedSkin` | `ScratchBotGame.tsx`, `ScratchBlockItem.tsx`, `ScratchBoardCanvas.tsx` | M | **Concluído** |
| **[DESIGN/VETORIAL]** Padronização de Diretriz Vetorial (Zero Emojis + SVGs Icônicos/Originais) | Sem alterações de banco | Global (`ARCHITECTURE.md`, `DECISIONS.md`, `EducationalMascotVector.tsx`) | M | **Concluído** |
| **[VETORIAL]** Migração Integral para Arquitetura Vetorial & Iconografia Canônica | nenhum (preservação estrita de chaves e dados legados) | Toda a UI, Hub, Modais, Arenas, Jogos (`Radar`, `TyperDash`, `ScratchBot`), HUDs e Layouts | G | **Concluído (`a60eaf9`)** |
| **[ARQUITETURA]** Fase A: Eliminação do `FirebaseAdapter`, remoção de ~1.300 linhas de código legado do Firestore (`saves`, `leaderboard`, backups legados) e unificação do `dbFactory` 100% no Supabase | `public.profiles`, `public.game_progress` | `dbFactory.ts`, `firebaseService.ts`, `raceService.ts`, `supabaseTestService.ts` | G | **Concluído** |
| **[ARQUITETURA]** Fase B: Migração total de Multiplayer (Duelo 1v1, Raid, Corrida) e `system_settings` para Supabase + Realtime WebSockets; remoção de `firebase-admin` e Cloud Monitoring | `public.system_settings`, `public.arena_rooms` | `systemSettingsService.ts`, `arenaService.ts`, `raidService.ts`, `raceService.ts`, `server.ts`, `package.json` | G | **Concluído** |
| **[SEGURANÇA]** Auditoria 06/10/2026: remoção do "Modo ADM local", `isSuperAdminEmail` unificado, rules de `arena_rooms` restritas, headers de segurança, RLS/RPCs seguros escritos (pendentes de ativação) | `firestore.rules`, `supabase/*` | `firebaseService.ts`, `StudentModal.tsx`, `server.ts`, `supabaseClient.ts` | M | **Concluído (ativação do RLS pendente)** |
| **[LIMPEZA]** Remoção de 184 imports/símbolos não usados, de `Cube3D`, `LanguageQuickPick`, `adminMetricsService` e `scripts/debug` | nenhum | vários | P | **Concluído** |
| **[UX/DIGITAÇÃO]** Bloqueio momentâneo de digitação após erro (`isTypingLocked`, 400–650 ms) | nenhum | `App.tsx`, `TypingArena.tsx` | P | **Concluído** |
| **[ADMIN/TESTES]** Concessões de teste por `userId` ou e-mail, com `claimedGrantIds` anti-duplicação | `saves/{uid}`, `system/settings` | `AdminPanel.tsx`, `firebaseService.ts`, `supabaseTestService.ts` | M | **Concluído** |
| **[VETORIAL]** Renderizadores Canônicos com Retrocompatibilidade (`TrackIconRenderer`, `RpgClassIcon`, `StudentAvatarRenderer`, `LevelBadgeRenderer`, `AchievementIconRenderer`, `CardFrameIcon`) | nenhum (preservação de chave id) | `src/components/vectors/*`, `StudentModal.tsx`, `StudentProfileCard.tsx`, `CosmeticsShopModal.tsx`, `AchievementsModal.tsx`, `LevelsModal.tsx` | M | **Concluído (`235865c` / `a60eaf9`)** |
| **[JOGO/RPG]** Implementação Completa do `ByteQuest` (Roguelite Combat Runner com hordas, ataques automáticos, digitação de acertos críticos, feitiços de comando, forja com Bytes e Canvas 60 FPS) | `public.game_progress` (Supabase) | `ByteQuestGame.tsx`, `ByteQuestArenaCanvas.tsx`, `ByteQuestHUD.tsx`, `ByteQuestLobby.tsx`, `byteQuestEngine.ts`, `byteQuestAudio.ts`, `gameCatalog.ts`, `App.tsx` | G | **Concluído** |

---

## Prioridades do Backlog

### P1 — Integridade & Segurança
| Feature | Dados DB (Supabase / Legado Firestore) | Telas afetadas | Complexidade | Status |
|---|---|---|---|---|
| **[SEGURANÇA]** Ativar RLS por identidade Firebase: configurar Third-Party Auth, aplicar `secure_rls_firebase_jwt.sql`, popular `staff_users`, ligar `VITE_SUPABASE_FIREBASE_AUTH` | `profiles`, `game_progress`, `user_cosmetics`, `user_achievements`, `season_history`, `staff_users` | `schema.sql`, `supabaseClient.ts` | M | **Pendente (ação manual no painel)** |
| **[SEGURANÇA]** Promoção a professor via RPC `set_user_role` + tabela `staff_users` (escrita; ativa junto com o RLS seguro) | `profiles.role`, `staff_users` | `AdminPanel.tsx`, `supabaseAdapter.ts`, `schema.sql` | P | **Concluído (código); ativação pendente** |
| **[SEGURANÇA]** Executar código do aluno do ProgPlay em Web Worker/iframe `sandbox` | nenhum | `PlaygroundView.tsx`, `pythonRunner.ts` | M | Pendente |
| **[SEGURANÇA]** Mover `pendingTestGrants`/`testerEmails`/`testGrantsHistory` para documento só de staff e resgatar concessões via RPC | `system/settings` | `firebaseService.ts`, `supabaseTestService.ts`, `firestore.rules` | M | Pendente |
| **[SEGURANÇA]** CSP e rate-limit no `server.ts` | nenhum | `server.ts` | P | Pendente |

### P2 — Débitos Técnicos e Trilhas Curriculares
| Feature | Dados DB (Supabase / Legado Firestore) | Telas afetadas | Complexidade | Status |
|---|---|---|---|---|
| **[DÉBITO]** Unificar a lógica de concessão de teste (Firebase/Supabase duplicadas) em `testGrantEngine.ts` | `game_progress.state_payload.claimedGrantIds` | `firebaseService.ts`, `supabaseTestService.ts` | M | Pendente |
| **[DÉBITO]** Remover os 23 símbolos locais não usados restantes (`tsc --noUnusedLocals`) e reduzir `console.log` | nenhum | vários | P | Pendente |
| **[DÉBITO]** Dividir `AdminPanel.tsx` (>2.500 linhas) | nenhum | `AdminPanel.tsx` | G | Pendente |

### P3 — Novos Jogos e Expansão do Hub
| Feature | Dados DB (Supabase / Legado Firestore) | Telas afetadas | Complexidade | Status |
|---|---|---|---|---|
| **[PROFESSOR]** `math_storm` e `syntax_maze` — ideias futuras; ainda não existem no catálogo (`GameId` os reserva) | `public.game_progress` | `GameSelectionScreen`, `App.tsx` | M | Ideia |
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
