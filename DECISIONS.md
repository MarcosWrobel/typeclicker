# Decisões de Arquitetura — TypeClicker

## Decisões Estratégicas (Novas)

- **Escopo Universal**: O Hub deixou de ser exclusivamente um "treinador de digitação" para se tornar uma plataforma educacional genérica. O TypeClicker clássico permanece como o gerador primário da "economia" (Bytes), mas a vitrine do Hub aceita jogos de Matemática, História, Lógica, etc.
- **Separação de Pastas (Core vs Plugins)**: Jogos criados pelo professor (Oficiais/Core) residem em `src/components/games/`. Jogos submetidos por alunos residem em `src/plugins/`. Isso impede que o repositório principal se torne uma bagunça estrutural.
- **Catálogo Client-Side Preparado para Nuvem**: Para alimentar filtros complexos no Hub (por Disciplina, Gênero, Autor), adotou-se um arquivo local (`src/data/gameCatalog.ts`). Isso garante custo zero de leituras no Firebase. Um hook futuro (`useGameCatalog()`) abstrairá essa leitura, garantindo que uma migração para Firebase Remote Config (ilimitado) ou Firestore seja indolor.
- **Filtros no Hub**: Para escalar a UI conforme a quantidade de jogos cresce, a `GameSelectionScreen` passará a implementar filtros e abas baseados nos metadados do catálogo.
- **Bibliotecas whitelisted e Lazy Loading obrigatório**: para permitir jogos mais complexos (ex.: com editor de código), bibliotecas como `@monaco-editor/react`, `recharts` e `react-markdown` foram instaladas centralmente. Para impedir que essas bibliotecas engordem o bundle principal do Hub e deixem o carregamento lento, **é obrigatório** que o professor use `React.lazy()` ao adicionar o bloco de roteamento do jogo do aluno em `App.tsx`. O aluno NÃO instala pacotes por conta própria.

## Decisões confirmadas do código legado

- **Firestore em vez de Realtime Database** — `firebase.json` define `dataAccessMode: FIRESTORE_NATIVE`.
- **Cloud Run como runtime de produção** — `server.ts` detecta `process.env.K_SERVICE`; serve `dist/` via `express.static`.
- **Toda a lógica de jogo é client-side** — `server.ts` serve apenas rotas de métricas admin e o SPA; nenhum cálculo de pontuação no servidor.
- **Plano Blaze com orçamento controlado** — limites do tier gratuito Blaze tratados como cotas hard (50k leituras / 20k escritas/dia).
- **Sem Cloud Functions por decisão deliberada** — plano Blaze permite, mas não há intenção imediata.
- **Hub normaliza bytes dos plug-ins** — jogos de alunos entregam métricas brutas; o Hub aplica `min(bytesEarned, timeSpentSeconds × CAP × accuracyFactor)` antes de creditar. Evita inflação.
- **Contrato adotado: `BaseGameProps` + `GameExitPayload`** — contrato pedagógico do guia dos alunos foi adotado como contrato real do código (`src/types/gamePlugin.ts`).
- **Fluxo de contribuição de alunos**: alunos desenvolvem usando `GUIA_CRIACAO_DE_JOGOS.md` → entregam o arquivo `index.tsx` → professor avalia → integra manualmente em `src/plugins/<nome>/`, define o `GameId` e roteamento lazy → habilita via painel admin.
- **Opt-in por jogo via `HubConfig.disabledGames`** — professor habilita/desabilita jogos via painel sem deploy.

## Bugs / Débitos Técnicos
- O Baú Criptográfico escrevia num campo fantasma `hackTokens`. Substituído por `cosmetics.levelTokens`.
- `TypeRadarGame` ainda usa o contrato antigo e precisa ser migrado para `GameExitPayload`.
