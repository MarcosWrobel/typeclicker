# Backlog de Features — TypeClicker

## Sugeridas

> Adicione novas features nesta tabela antes de levar para brainstorm com IA.

| Feature | Dados Firebase usados | Telas afetadas | Complexidade P/M/G | Status |
|---|---|---|---|---|
| _(exemplo)_ Histórico de partidas do Radar | `saves/{uid}.saveState.radarStats` | LeaderboardModal, StatsSidebar | P | Ideia |
| Corrigir bug do hackTokens no Baú Criptográfico | `saves/{uid}.saveState.cosmetics.levelTokens` | App.tsx | P | Bug |
| Finalizar Trilhas Curriculares (Scratch, Web, etc) | `system/settings.activeTrack` | words.ts, App.tsx | M | Em andamento |

---

## Descartadas / Alternativas não usadas

- **Realtime Database (RTDB)** — `firebase.json` usa `FIRESTORE_NATIVE`; RTDB nunca foi importado no código; Firestore foi escolhido exclusivamente para regras mais ricas.

- **SSR / Next.js** — `vite.config.ts` e `server.ts` indicam SPA com Express no Cloud Run; decisão mantém tudo client-side.

- **Bot simulado para Arena 1×1** — `ArenaPlayer` em `src/types/arena.ts:15` tem campo `isBot?: boolean` mas nunca há lógica implementada nos serviços.

- **`measurementId` e `recaptchaSiteKey`** — presentes em `firebase-applet-config.json` com valores vazios (`""`); Firebase Analytics e reCAPTCHA configurados como placeholder mas não inicializados.

- **`testerEmails` e `testGrantsHistory`** — presentes em `SystemSettings` e painel admin; infraestrutura para testes manuais de itens e níveis (uso interno do professor).
