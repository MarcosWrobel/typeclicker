# Backlog de Features — TypeClicker

> **Regra de Ouro:** Nenhuma operação pode ultrapassar o teto diário do Firestore
> (máx 50.000 leituras / 20.000 gravações/dia). Toda agregação de métricas pedagógicas
> ou de turmas é executada em memória no cliente (`turmasAggregator.ts`).

---

## 🔜 Prontas para Implementar

> Sem ambiguidade técnica — podem ser codificadas diretamente.

| Feature | Dados Firebase usados | Telas afetadas | Complexidade | Impacto de Cotas | Status |
|---|---|---|---|---|---|
| **Contrato de Plug-in Multi-Jogo (`GamePluginProps`)** | `saves/{uid}.saveState` | `App.tsx`, `GameSelectionScreen.tsx`, `types/gamePlugin.ts` [NEW] | M | Neutro: reutiliza o canal e o ciclo de throttle de 60s do `useGameSync` | 📐 Especificado |
| **Painel Docente: Controlo de Jogos (`hubConfig`)** | `system/settings.hubConfig` | `AdminPanel.tsx`, `GameSelectionScreen.tsx`, `firebaseService.ts` | P | Baixo: 0 leituras extras — usa o `onSnapshot` de `system/settings` já existente | 📐 Especificado |
| **Telemetria Pedagógica Multi-Gênero (Exportação CSV)** | Cache local dos saves já carregados | `AdminPanel.tsx`, `turmasAggregator.ts` [NEW] | P | Zero Leituras: agregação calculada em memória pelo `turmasAggregator.ts` | 📐 Especificado |
| **Histórico Local de Partidas Arcade** | `saves/{uid}.saveState.arcadeHistory` | `LeaderboardModal.tsx`, `StatsSidebar.tsx`, `types.ts` | P | Neutro: array circular (máx 10 registros) persistido no save principal | 📐 Especificado |

---

## 💡 Em Planejamento / Especificação Visual Pendente

> Integração com GamePlugin clara; mecânica interna visual ainda precisa de detalhamento.

| Feature / Minijogo | Dados Firebase usados | Telas afetadas | Complexidade | Impacto de Cotas | Status |
|---|---|---|---|---|---|
| **MathStorm** — Rogue-lite de Aritmética Rápida | `saves/{uid}.saveState.mathStats` | `GameSelectionScreen.tsx`, `MathStormArena.tsx` [NEW], `AdminPanel.tsx` | M | Zero Leituras extras: geração procedural matemática no navegador; despacho via `onExitToHub` | 💡 Ideia Aprovada |
| **ByteLogic** — Circuitos & Portas Lógicas | `saves/{uid}.saveState.logicStats` | `GameSelectionScreen.tsx`, `ByteLogicArena.tsx` [NEW], `AdminPanel.tsx` | G | Zero Leituras extras: motor 100% client-side com synthesis procedural de som; persistência em lote no save principal | 💡 Em Planejamento |
| **SyntaxMaze** — Labirinto de Sintaxe & Algoritmos | `saves/{uid}.saveState.syntaxStats` | `GameSelectionScreen.tsx`, `SyntaxMazeArena.tsx` [NEW] | G | Neutro: Snippets compilados no bundle cliente; persistência agregada | 💡 Ideia Aprovada |

---

## ⚙️ Em Andamento

| Feature | Dados Firebase usados | Telas afetadas | Complexidade | Status |
|---|---|---|---|---|
| **Finalizar Trilhas Curriculares** (Scratch, Web, Python, Empresarial, Inglês) | `system/settings.activeTrack` | `words.ts`, `App.tsx`, `TypingArena.tsx`, `src/data/tracks/` | M | ⚙️ Em Andamento — tipos definidos, conteúdo de palavras/frases pendente |

---

## 🐛 Bugs Conhecidos

| Bug | Dados Firebase usados | Telas afetadas | Complexidade | Status |
|---|---|---|---|---|
| Sincronização de stats Radar quando jogo é encerrado abruptamente (fechar aba mid-game) | `saves/{uid}.saveState.radarStats` | `App.tsx`, `TypeRadarGame.tsx` | P | 🐛 Mapeado |

---

## ✅ Concluídas

| Feature | Dados Firebase usados | Telas afetadas | Complexidade | Data |
|---|---|---|---|---|
| Corrigir bug do `hackTokens` no Baú Criptográfico | `saves/{uid}.saveState.cosmetics.levelTokens` | `App.tsx`, `storage.ts` | P | 2026-09-24 |

---

## ❌ Descartadas / Alternativas não Usadas

- **Realtime Database (RTDB)** — `firebase.json` usa `FIRESTORE_NATIVE`; RTDB nunca foi importado; Firestore escolhido pelas regras de segurança mais ricas.
- **SSR / Next.js** — `vite.config.ts` e `server.ts` indicam SPA com Express no Cloud Run; decisão mantém tudo client-side.
- **Bot simulado para Arena 1×1** — `ArenaPlayer` em `src/types/arena.ts:15` tem campo `isBot?: boolean` mas nunca há lógica implementada.
- **`measurementId` e `recaptchaSiteKey`** — presentes em `firebase-applet-config.json` com valores vazios; Firebase Analytics e reCAPTCHA configurados como placeholder.
- **`testerEmails` e `testGrantsHistory`** — infraestrutura para testes manuais de itens e níveis (uso interno do professor).
- **Cloud Functions** — Plano Blaze permite, mas decisão ativa é não usar; toda lógica de jogo é client-side.

---

## 📋 Diretrizes Técnicas de Desenvolvimento (Invioláveis)

### Interface Canônica de Plug-in (todos os novos jogos devem implementar)

```typescript
// src/types/gamePlugin.ts
export type GameId = 'typeclicker' | 'type_radar' | 'byte_logic' | 'math_storm' | 'syntax_maze';

export interface GamePluginProps {
  user: { uid: string; displayName: string };
  playerClass: 'warrior' | 'mage' | 'archer';
  onExitToHub: (bytesEarned: number, sessionStats: Record<string, unknown>) => void;
  onLevelTokenEarned?: (tokens: number) => void;
}
```

### Ciclo de Vida de Recursos
- Qualquer minijogo deve implementar limpeza de buffers de áudio (`audioContext.close()` ou desconexão de `OscillatorNode`) e cancelamento de `requestAnimationFrame` no hook de desmontagem (`useEffect` return).

### Persistência Sem Fugas de Cota
- **Proibido** invocar `setDoc` ou `updateDoc` a cada fase ou puzzle concluído.
- Progresso deve ser acumulado no estado em memória e sincronizado apenas pelo `useGameSync` global com throttle mínimo de 60 segundos.
