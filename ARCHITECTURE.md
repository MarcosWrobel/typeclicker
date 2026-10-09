# TypeClicker — Arquitetura da Plataforma

## Stack detectada
- **Framework**: React 19.0.1 (SPA, sem SSR)
- **Linguagem**: TypeScript ~5.8.2
- **Build**: Vite 6.2.3 + esbuild (bundle do server)
- **CSS**: Tailwind CSS 4.1.14 (via `@tailwindcss/vite`)
- **Bibliotecas Visuais**: `motion` 12.23.24, `canvas-confetti` 1.9.4, `lucide-react` 0.546.0
- **Bibliotecas de Jogos Permitidas**: `@monaco-editor/react` (editor de código), `recharts` (gráficos), `react-markdown` (texto rico)
- **Package manager**: bun (bun.lock presente) + npm (package-lock.json presente)

## Infraestrutura & Banco de Dados
- **Hospedagem**: Google Cloud Run (containerizado via AI Studio) — `server.ts` detecta `process.env.K_SERVICE` e serve `dist/` em modo produção; em dev local serve via Vite middleware.
  - **Injeção Dinâmica de Variáveis de Runtime**: O Vite compila variáveis de build (`import.meta.env`), mas em contêineres de produção (Cloud Run / AI Studio Secrets), as variáveis existem apenas em `process.env` no Node. O `server.ts` injeta `window.__APP_ENV__` diretamente no `<head>` do `dist/index.html` a cada requisição, garantindo sincronia imediata entre as credenciais do contêiner e o frontend sem necessidade de rebuild.
  - **Camada de Resiliência Tripla (Supabase Env)**: O cliente Supabase (`supabaseClient.ts`) e o `dbFactory.ts` resolvem as credenciais na ordem: (1) `window.__APP_ENV__` (runtime Cloud Run), (2) `import.meta.env` (build Vite), (3) arquivo `supabase-applet-config.json` na raiz. Há suporte tolerante a nomes legados ou desvios de digitação comuns como `VITA_SUPABASE_URL` e `SUPABASE_URL`.
- **Domínio de produção**: `typeclicker-leopoldina.ai.studio`.
- **Camada de Banco de Dados Oficial**: Supabase (PostgreSQL 15+) gerenciado via `SupabaseAdapter`. O `FirebaseAdapter` e o banco Firestore foram 100% desativados e expurgados do fluxo de dados da aplicação.
  - **Provedor Exclusivo (Supabase)**: PostgreSQL hospedado com RLS (Row Level Security), índices B-Tree otimizados e Stored Procedures atômicas. Todos os perfis, saves, cosméticos, conquistas, temporadas, configurações pedagógicas e salas multiplayer residem nesta base.
- **Identidade e Auth Híbrida**: Firebase Auth (Google Sign-In via `signInWithPopup` + `GoogleAuthProvider`) para e-mails institucionais (`@escola.pr.gov.br`). O UID do Google é a chave primária `TEXT` no Supabase (`profiles.id`).
- **Arquitetura de Dados no Supabase**:
  - `public.profiles`: Colunas relacionais indexadas (`id`, `display_name`, `turma`, `role`, `bytes`, `total_bytes_earned`, `level`, tokens).
  - `public.game_progress`: Tabela por jogo (`user_id`, `game_id`, `high_score`, `metrics`, `state_payload JSONB`).
  - `public.user_cosmetics`: Relação de itens e cosméticos desbloqueados (`user_id`, `item_id`, `item_category`).
  - `public.user_achievements`: Histórico relacional de conquistas (`user_id`, `achievement_id`).
  - `public.system_settings`: Configurações globais de laboratório, travas de aula, textos curriculares e auditoria pedagógica.
  - `public.arena_rooms`: Salas multiplayer em tempo real (Duelo 1v1, Corrida da Turma e Raid Coletiva) integradas ao Supabase Realtime.
- **Regras de Leitura e Tráfego (Capacidade: 35–90 máquinas de laboratório)**:
  - **HTTP REST (PostgREST)**: Placares, pódios e perfil utilizam consultas REST com cache local de 30s–60s e singleflight promise deduplication. Ilimitado no tier gratuito.
  - **Supabase Realtime (WebSockets)**: Reservado **exclusivamente sob demanda** para disputas síncronas (Corrida e Raid), preservando a cota mensal de 2M mensagens e as 200 conexões simultâneas do tier gratuito.
- **Política de Sincronização (Autosave)**:
  - Digitação contínua: Throttle de 60 segundos com contingência em `localStorage` para tolerância a falhas de rede.
  - Marcos críticos: Flush imediato em level-up, derrotar boss, saída de minijogo e eventos de janela (`beforeunload` / `pagehide`).
- **Anti-Cheat em Camadas**:
  - Client: Verificação de deltas máximos por segundo antes do envio.
  - Database: Stored Procedure `record_game_session` com validação de caps no PostgreSQL.
- **Temporadas Trimestrais (Ciclo Oficial SEED-PR)**:
  - `season_bytes`: Acumulado do trimestre letivo no perfil do aluno (`public.profiles`).
  - `public.seasons_history`: Tabela de arquivo do Hall da Fama ao encerramento do trimestre pelo professor via RPC `close_current_season`. Saldo vitalício de moedas e prestígio geral nunca são zerados.
  - Pódio memorial Top 3 e histórico integral com busca e filtros por turma.

## Escopo Universal e Organização de Pastas

A plataforma evoluiu de "apenas digitação" para um **Hub Educacional Universal**. A economia do jogo (Bytes, Níveis, Fichas) é compartilhada, mas os jogos podem abordar Matemática, História, Lógica, etc.

Para suportar essa escala, o código é estritamente separado:
- `src/components/games/`: Jogos Oficiais do Professor (Core da plataforma).
- `src/plugins/`: Jogos criados por Alunos e pela Comunidade.

O catálogo de jogos e seus metadados (para alimentar filtros do Hub) fica armazenado localmente em `src/data/gameCatalog.ts`, envelopado por um hook `useGameCatalog()`. Isso prepara o terreno para uma futura migração remota (tabela `catalog_games` no Supabase) sem quebrar a interface visual. O Firestore e o Firebase Remote Config são considerados obsoletos para novos desenvolvimentos e mantidos apenas na camada de contingência.

## Arquitetura de jogos — Hub + Plug-ins

O hub (`GameSelectionScreen`) exibe cards de jogos consumindo os metadados do `gameCatalog.ts` e controla visibilidade via `HubConfig.disabledGames`. Cada jogo é um componente React standalone renderizado condicionalmente em `App.tsx` conforme `selectedGame`. Para não prejudicar o tempo de carregamento da plataforma (especialmente com bibliotecas pesadas como o Monaco Editor), **todos os jogos da pasta `src/plugins/` são importados dinamicamente via `React.lazy` e envoltos em `Suspense`**.

### Jogos existentes (gerenciados pelo professor)
| `selectedGame` | Componente | Tipo de saída |
|---|---|---|
| `'typeclicker'` | `TypingArena` | estado direto no `GameState` |
| `'type_radar'` | `TypeRadarGame` | `onExitToHub(bytes, endStats)` — legado, migração pendente |
| `'scratchbot'` | `ScratchBotGame` (substituiu `byte_logic`) | `BaseGameProps.onExitToHub(payload)` |
| `'typerdash'` | `TyperDashGame` | `BaseGameProps.onExitToHub(payload)` |
| `'progplay'` | `src/plugins/progplay` (aluno) | `BaseGameProps.onExitToHub(payload)` |
| `'math_storm'` | a implementar pelo professor | `BaseGameProps.onExitToHub(payload)` |
| `'syntax_maze'` | a implementar pelo professor | `BaseGameProps.onExitToHub(payload)` |
| `'<id_aluno>'` | `src/plugins/<nome>` (entregue pelo aluno) | `BaseGameProps.onExitToHub(payload)` |

### Contrato de plug-in (`src/types/gamePlugin.ts`)
Todos os novos jogos — tanto os criados pelo professor quanto os criados por alunos — devem seguir `BaseGameProps`:
- **Entrada**: `studentClass?`, `difficultyMultiplier?` (0.8/1.0/1.25), `onExitToHub(payload)`
- **Saída** (`GameExitPayload`): `bytesEarned` (sugestão), `levelTokensEarned?`, `duelTokensEarned?`, `sessionStats: GameSessionStats`
- **Normalização de bytes**: o Hub aplica `min(bytesEarned, timeSpentSeconds × CAP × accuracyFactor)` — o jogo entrega métricas brutas, o Hub decide o crédito final
- **Histórico**: cada saída gera um `ArcadeMatchRecord` salvo em `GameState.arcadeHistory` (array circular, máx 10)

## Contrato Unificado de Persistência & Diretriz de Zero Bypasses

Para garantir que a plataforma opere sem acoplamento a um provedor específico de banco de dados e permita alternância transparente via `VITE_DB_PROVIDER`, toda a camada visual segue a diretriz estrita de **Zero Bypasses**:

1. **Acesso Mediado por `dbService`**:
   - Nenhum componente React, hook ou utilitário da interface de usuário pode chamar métodos diretos de SDKs de banco de dados (`firebase/firestore`, `setDoc`, `getDoc`, `@supabase/supabase-js`, ou métodos do `firebaseService.ts` que manipulem dados).
   - Qualquer operação de leitura, escrita ou administrativa deve constar na interface [`IDatabaseService`](src/services/dbInterface.ts) e ser executada através da instância injetada [`dbService`](src/services/dbFactory.ts).

2. **Isolamento de Utilitários Puros**:
   - Regras de filtragem de contas de equipe pedagógica (`isStaffMember`), identificação de pioneiros do Nível 100 (`extractLevel100Pioneers`) e listas de superadministradores (`ADMIN_EMAILS`) residem no módulo desacoplado [`src/utils/leaderboardUtils.ts`](src/utils/leaderboardUtils.ts), sem dependências de infraestrutura de banco.

3. **Operações Administrativas no Contrato**:
   - Consultas de dashboard docente (`getAdminDashboardData`), atualizações de turma e classe RPG (`adminUpdateStudentProfile`), auto-balanceamento de classes (`adminAutoBalanceRpgClasses`), higienização de placares (`sanitizeStaffLeaderboard`) e reset de banco (`wipeDatabase`) possuem implementações completas e equivalentes tanto no `SupabaseAdapter` quanto no `FirebaseAdapter`.

## Arquitetura de Entrada de Teclado, Ergonomia & Acessibilidade

Para atender aos diferentes dispositivos escolares (Chromebooks, teclados ABNT2 de desktop e notebooks), o ecossistema TypeClicker adota componentes e utilitários centralizados para tratamento de entrada:

1. **Detecção Global de Modificadores (`src/utils/keyboardCase.ts`)**:
   - Hook `useCapsLock()`: escuta eventos de teclado globais em fase de captura e monitora `e.getModifierState('CapsLock')`, notificando o estado da tecla ativa.
   - Utilitário `checkCaseMismatch(typedChar, expectedChar)`: identifica erros de digitação causados exclusivamente por divergência de caixa alta vs caixa baixa, gerando instruções assertivas para uso do Shift ou desativação do Caps Lock.
   - Componente visual reutilizável [`src/components/common/CapsLockWarning.tsx`](src/components/common/CapsLockWarning.tsx) padronizado em todas as 9 interfaces de digitação.

2. **Resolução de Dead Keys & Composição ABNT2 (`src/utils/keyboardAccents.ts`)**:
   - Interceptação de eventos `e.key === 'Dead'` e teclas de acento sequencial (`´`, `` ` ``, `~`, `^`, `¨`).
   - Composição estrita sem bypass de normalização, garantindo que letras acentuadas exijam a combinação real no teclado.

3. **Responsividade e Auto-Scroll Dinâmico da Arena (`src/components/TypingArena.tsx`)**:
   - O container de texto alterna comportamento conforme o `TypingMode`:
     - Modo `words`: dimensões estáticas (`h-[105px] ... overflow-hidden flex items-center justify-center`) para preservar o alinhamento de palavras individuais.
     - Modos `sentences` e `code`: container expandido e dinâmico (`min-h-[130px] max-h-[240px...320px] overflow-y-auto`) com auto-scroll suave (`scrollIntoView`) focalizando o caractere ativo `.char-current`.

## Diretriz Unificada: Arquitetura Vetorial, Iconografia Canônica & Identidade Visual (Zero Emojis Genéricos)

### 1. Proibição Estrita de Emojis Unicode
- **Zero Emojis em UI e Gameplay**: É terminantemente proibido o uso de glifos de emoji Unicode nativos (`🏆`, `⚔️`, `🛡️`, `🐱`, `⚡`, `👾`, `💎`, etc.) como ícones, botões, insígnias, chefes, ilustrações de cartas ou elementos visuais de minijogos.
- **Motivo Técnico e Pedagógico**: Emojis sofrem discrepâncias graves de renderização entre sistemas operacionais (Windows, macOS, Linux, ChromeOS das escolas públicas), quebram o alinhamento de layout, destoam da estética retrô/cyberpunk/RPG da plataforma e transmitem aspecto de protótipo amador.

### 2. Hierarquia e Reutilização Canônica de Vetores
Antes de gerar qualquer novo elemento visual, deve-se seguir a seguinte ordem de precedência:
1. **Pacote de Ícones Utilitários**: Usar componentes de `lucide-react` (já integrado ao bundle Vite) para ações funcionais padrão (fechar, voltar, sons, configurações, troféus utilitários, filtros).
2. **Catálogo Canônico Centralizado (`src/constants/vectorShapes.ts`)**:
   - Reutilizar insígnias, molduras de cartas e padrões geométricos já existentes.
   - Reutilizar `BytezinhoAvatar.tsx` e `BytezinhoMascot.tsx` para mascote principal, estados emocionais e skins.
3. **Módulos de Vetores Específicos de Jogos**:
   - Reutilizar os vetores temáticos já consolidados, a exemplo de `src/components/games/radar/RadarIcons.tsx` para naves, torretas, ondas e defesas.

### 3. Criação de Vetores Originais e Vetores Icônicos (SVG Nativo React)
Quando a mecânica pedagógica ou o design exigir uma forma não coberta pelos passos anteriores:
1. **Vetores Icônicos Reais (Ex: Mascote do Scratch, Logotipos Educacionais, Conceitos Pedagógicos)**:
   - **Vetorização Direta em SVG**: Construídos como componentes funcionais React SVG nativos (`viewBox="0 0 100 100"` ou `0 0 48 48` / `0 0 24 24`), sem requisições HTTP adicionais, sem assets rasterizados (PNG/JPG) e sem dependência de CDNs externas.
   - **Componentização Modular**: Salvos no diretório compartilhado `src/components/vectors/` (ex: `src/components/vectors/EducationalMascotVector.tsx`) ou dentro da pasta do respectivo jogo em `src/components/games/<nome-jogo>/<NomeJogo>Icons.tsx`.
   - **Parametrização & Estados**: Suportar props dinâmicas (tamanho `size`, variações de humor `mood`, brilho `glow`, estados de erro/acerto ou classes de tema).
2. **Regras Técnicas de Estilização Vetorial**:
   - **Tailwind & `currentColor`**: Usar preferencialmente `stroke="currentColor"` e `fill="currentColor"` (ou camadas com a paleta Tailwind padrão do projeto como `#F59E0B`, `#6366F1`, `#38BDF8`, etc.) para permitir herança automática de cor em layouts de tema (Arcade, Terminal, Cyberdeck, Bios).
   - **Custo Zero & Acessibilidade**: Todo vetor SVG inline deve incluir tags semânticas de acessibilidade (`aria-label`, `role="img"` ou `aria-hidden="true"` quando estritamente decorativo) e não adiciona custos de storage ou egress no Supabase.

## Separação Arquitetural: Painel Pedagógico vs. Administração do Sistema

O antigo componente monolítico `AdminPanel.tsx` foi desacoplado em dois subsistemas independentes, com papéis, temas visuais e permissões estritas:

1. **Painel Pedagógico ([`src/components/PedagogicalPanel.tsx`](src/components/PedagogicalPanel.tsx))**:
   - **Público-Alvo**: Todos os professores e docentes autorizados (`isAdmin = true`).
   - **Identidade Visual**: Tema Esmeralda/Sky (`border-emerald-500/40`, ícone `GraduationCap`, badges verdes/azuis).
   - **Abas Inclusas**:
     - 🔒 **Sessões & Códigos**: Trava de laboratório, geração de código com turma e trilha curricular vinculada, controle de acessibilidade e controlo do hub de jogos ativos.
     - 📊 **Desempenho & Boletim**: Tabela de alunos da turma com edição rápida de turma e classe RPG, distribuição balanceada 1/3, exportação de boletim CSV in-browser, CSV pedagógico multi-jogo e resumo por turma.
     - 🏁 **Corrida da Turma**: Lançador e monitor de corrida síncrona multiplayer com presets literários ou textos criados pelo docente.
     - 🐉 **Raid Coletiva**: Lançador e monitor de raid cooperativa de chefe titânico em tempo real com HP compartilhado e sinergia de classes.
     - 📚 **Textos Curriculares**: Acervo e cadastro de textos escolares com filtros por disciplina e integração direta de envio para corrida.

2. **Administração do Sistema ([`src/components/AdminPanel.tsx`](src/components/AdminPanel.tsx))**:
   - **Público-Alvo**: Estritamente Super Administradores (`isSuperAdmin = true`).
   - **Identidade Visual**: Tema Roxo/Âmbar (`border-purple-500/50`, ícone `Shield`, badges roxo/âmbar).
   - **Abas Inclusas**:
     - 🏆 **Trimestres & Temporadas**: Ciclos letivos, pódio provisório, Hall da Fama e encerramento com modal e confirmação digitada (`"CONFIRMAR"`).
     - 💾 **Backups**: Extração de snapshots JSON das 5 tabelas relacionais do Supabase e restauração segura com validação e upsert idempotente. Possui tolerância a falhas para tabelas ausentes no schema cache (`isTableMissingError`), garantindo a integridade dos dados essenciais dos estudantes.
     - 📈 **Monitoramento Banco**: Censo exato de linhas via consultas HEAD zero-egress, latência PostgREST e monitoramento de cotas do PostgreSQL.
     - 🧪 **Recursos de Teste**: Seletor de contas por UUID ou e-mail, progressão gradativa de níveis, moedas de teste, atalhos de desafios e auditoria de concessões.
     - 👨‍🏫 **Professores**: Adição e revogação de acessos de docentes com e-mail institucional e higienização retroativa de rankings escolares.
     - ⚠️ **Zona de Perigo (Wipe)**: Limpeza total do banco Supabase e coleções legadas com dupla confirmação digitada.

---

## Arquitetura de Execução, Renderização 60 FPS & Desacoplamento de Concorrência

Para garantir que a experiência de jogo atinja 60 a 144 FPS consistentes mesmo em computadores e Chromebooks modestos dos laboratórios escolares, a plataforma implementa diretrizes estritas de concorrência e renderização gráfica:

1. **Desacoplamento de Canvas Loops vs. React Reconciliation**:
   - Componentes Canvas 2D (`RadarCanvas`, `TyperDashCanvas`, `ScratchBoardCanvas`) executam um único ciclo de vida contínuo via `requestAnimationFrame` sem dependências de arrays de estado voláteis no `useEffect`.
   - Atualizações de alta frequência das entidades (`enemies`, `particles`, `lasers`, `shockwaves`) trafegam por referências mutáveis (`useRef`) consumidas diretamente no tick do canvas.
   - O delta time (`dt`) é estritamente não-negativo e limitado (`Math.max(0, Math.min(0.05, (time - lastTime) / 1000))`), prevenindo recuos angulares (efeito elástico / rubber-banding) causados por dessincronia de timestamps do compositor.
   - Chamadas a `setState` nos jogos canvas são reservadas para alterações estruturais (spawn, destruição ou conclusão de onda), eliminando 60 re-renderizações desnecessárias por segundo da árvore JSX.

2. **Isolamento de Processos de Fundo no Hub Multi-Jogos**:
   - Os timers de alta cadência do TypeClicker no `App.tsx` (`idleTimer` a cada 100ms, `secTimer` a 1s e `saveTimer` a 5s) e listeners globais de digitação (`keydown`) são protegidos por checagens imediatas de jogo ativo (`selectedGameRef.current === 'typeclicker'`).
   - Ao executar qualquer outro minijogo (`TyperDash`, `Type: Radar`, `ProgPlay`, `ScratchBot`) ou navegar no catálogo, a thread principal é 100% liberada de chamadas em segundo plano ao `setState` e ao `localStorage`.

3. **Eliminação de Forced Synchronous Layouts (Reflows)**:
   - Eliminação de chamadas síncronas a `getBoundingClientRect()` durante o ciclo crítico de digitação tecla a tecla. A geometria das letras é pré-computada em cache O(1) (`charCoordsCacheRef`) no momento do carregamento da palavra ou redimensionamento de janela.
   - Substituição de filtros gráficos pesados (`filter: drop-shadow(...)`) por estilos nativos de tipografia (`[text-shadow:...]`) nos caracteres já concluídos (`isDone`), reduzindo drasticamente o consumo de pixel shaders e texturização na GPU.

4. **Otimização de Compra Contínua na Loja (`ShopPanel`)**:
   - O modo turbo com clique pressionado (holding) utiliza a flag `isContinuous` para desacoplar a geração de partículas pesadas (`canvas-confetti`), textos flutuantes no componente pai e montagem de nós transitórios do Framer Motion (`<motion.div>`), reservando animações épicas para o primeiro clique e para marcos de 5 em 5 níveis (`isMilestone`).
   - Throttling no sintetizador WebAudio (`sound.playUpgrade()`) para prevenir saturação do buffer de som.

5. **Gerenciamento Sob Demanda de Camadas de GPU**:
   - O canvas global de partículas (`arcadeVfxEngine`) opera com `display: none` por padrão, tornando-se `display: block` exclusivamente enquanto houver partículas vivas no buffer, evitando que uma camada transparente fullscreen de hardware compositing permaneça ativa sobre os demais jogos.

---

## Histórico de Sanitização da Arquitetura Híbrida & Evolução do Core

| Assunto / Marco | Commit | Componentes & Arquivos Afetados | Detalhes da Implementação & Impacto Arquitetural |
|---|---|---|---|
| **Alta Performance: Fim do Stutter, Elástico no Radar e Reflows** | `2b0bff7` | `RadarCanvas.tsx`, `TypeRadarGame.tsx`, `TypingArena.tsx`, `ShopPanel.tsx`, `fxEngine.ts`, `App.tsx`, `arcadeVfxEngine.ts`, `audio.ts` | • Desacoplamento do loop `requestAnimationFrame` do `RadarCanvas` com consumo de entidades via `enemiesRef` e proteção `dt >= 0`, eliminando o efeito elástico e 60 re-renders/s do pai;<br>• Eliminação de Forced Synchronous Layouts (`getBoundingClientRect`) na digitação do TypeClicker via cache pré-computado O(1) de coordenadas (`charCoordsCacheRef`);<br>• Substituição de filtros caros de `drop-shadow` por `[text-shadow:...]` em 27 estilos de finalização de caracteres em `fxEngine.ts`;<br>• Otimização do modo turbo de compras de upgrades (`ShopPanel` & `App.tsx`) com desacoplamento de confetti, throttle de áudio e supressão de Framer Motion intermediário;<br>• Isolamento completo de timers de 100ms e listeners de teclado do `App.tsx` quando outros minijogos estiverem em foco;<br>• Desbloqueio preguiçoso de áudio (`audio.ts`) e canvas overlay on-demand (`arcadeVfxEngine.ts`). |
| **Iconografia Vetorial Canônica & Zero Emojis** | `a60eaf9` | `src/components/*`, `src/components/vectors/*`, `src/components/games/*`, `src/components/layouts/*` | • Eliminação integral de emojis Unicode em toda a interface visual, HUDs, arenas, layouts e minijogos;<br>• Criação de renderizadores canônicos com suporte retrocompatível para dados legados do banco: `TrackIconRenderer`, `RpgClassIcon`, `StudentAvatarRenderer`, `LevelBadgeRenderer`, `AchievementIconRenderer`, `CardFrameIcon`;<br>• Desenho vetorial procedural em HTML5 Canvas (`TyperDashCanvas`, `RadarCanvas`, `ScratchBoardCanvas`) e suporte a `size="xs"` em `BytezinhoAvatar`;<br>• Preservação absoluta do schema de dados no Supabase e Firestore sem migrações destrutivas. |
| **Avatares Vetoriais Canônicos de Estudante** | `235865c` | `StudentModal.tsx`, `StudentProfileCard.tsx`, `StudentAvatarRenderer.tsx` | • Substituição de emojis de avatares escolares por renderizadores vetoriais proceduralmente gerados e mapeados para chaves de dados existentes. |
| **Autorização Docente & Sessões Escolares** | `4d232ce` | `firestore.rules`, `App.tsx`, `AdminPanel.tsx`, `supabaseAdapter.ts`, `leaderboardUtils.ts` | • Implementação da função `isTeacher()` no Firestore para permitir geração/encerramento de sessões e lançamento de corridas/raids por professores autorizados em `allowedTeachers`;<br>• Proteção contra escalonamento de privilégios (`allowedTeachers`, `testGrantsHistory`);<br>• Reconhecimento de `isStaffUser` com `adminStatus` no `App.tsx` e preservação de `role = 'teacher'` no Supabase;<br>• Sincronização automática de papel no Supabase via `AdminPanel` ao adicionar/remover docentes e remoção de e-mail descontinuado da lista de SuperAdmin. |
| **ScratchBot: Logic Quest (Oficiais / Lógica)** | `a038456` | `src/components/games/scratchbot/*`, `gameCatalog.ts`, `gamePlugin.ts`, `App.tsx` | • Implementação ponta a ponta do jogo oficial de lógica algorítmica substituindo `byte_logic`;<br>• Interpretador de blocos estilo Scratch com montagem híbrida (HTML5 DnD + clique rápido) e suporte a aninhamento em loops;<br>• Layout ergonômico de 3 colunas (paleta compacta, workspace e palco expandido com renderização do mascote com skins oficiais);<br>• Ecossistema dinâmico de obstáculos: EMP Hazards (pisos de choque), Warp Pads (teletransportadores), Portões Laser com Chaves Criptográficas e Esteiras de Impulso;<br>• Trilha pedagógica de 8 fases + Modo Desafio Infinito procedural com garantia de solvabilidade (BFS);<br>• Sintetizador procedural de áudio Web Audio API e retorno oficial com `BaseGameProps`. |
| **Hub: Ordenação Prioritária & Boas-Vindas ProgPlay** | `c373682` | `gameCatalog.ts`, `ProgPlayGame.tsx`, `LanguageSelectModal.tsx` | • Reordenação visual do catálogo: os 3 jogos principais (`TyperDash`, `TypeClicker`, `Type: Radar`) ocupam o topo prioritário e novos jogos (`ProgPlay`) assumem a 4ª posição;<br>• Painel de boas-vindas do ProgPlay com apresentação da proposta pedagógica, créditos de autoria e grid com os 5 botões de linguagens. |
| **Integração do 1º Jogo de Aluno (ProgPlay)** | `e289ff9` | `src/plugins/progplay/*`, `gameCatalog.ts`, `gamePlugin.ts`, `App.tsx` | • Integração do jogo **ProgPlay** desenvolvido pelo aluno **André Luís Borato Ferreira (8º 2)**;<br>• Adaptação para o contrato de plug-in `BaseGameProps` com lazy loading no Hub;<br>• **Duelo 1v1 Sem IA**: Modo offline contra bot mascote *Bytezinho 🐸* e multiplayer local via Supabase Realtime Broadcast sem consumo de LLM/tokens;<br>• Suporte aos 100 níveis (HTML, CSS, JS, Python, SQL) com editor Monaco integrado. |
| **Resiliência no Backup & Migração de Temporadas** | `0a9521d` | `supabaseBackupService.ts`, `AdminPanel.tsx`, `create_season_history.sql`, `initialize-current-trimester.sql` | • Tratamento gracioso para tabelas ausentes do schema cache do PostgREST (`PGRST205`/`42P01`), impedindo bloqueio de backups;<br>• Migração SQL idempotente com `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS season_bytes...`;<br>• Script de transição para herdar o progresso letivo acumulado para o 3º Trimestre ativo. |
| **Segregação Pedagógico vs. Administrativo** | `7e102b8` | `PedagogicalPanel.tsx`, `AdminPanel.tsx`, `Header.tsx`, `GameSelectionScreen.tsx`, `App.tsx` | • Separação do painel monolítico em dois componentes focados: `PedagogicalPanel` (rotina de sala, docentes) e `AdminPanel` (infraestrutura e governança, SuperAdmin);<br>• Entradas visuais independentes no Header e no Hub de Jogos (Esmeralda/Sky vs Roxo/Âmbar);<br>• Proteção de acesso e desacoplamento de listeners de corrida/raid em tela ativa. |
| **Gestão de Dados & Testes no Supabase** | `18a2831` | `AdminPanel.tsx`, `supabaseBackupService.ts`, `supabaseMetricsService.ts`, `supabaseTestService.ts`, `App.tsx` | • Modernização integral das abas `backups`, `monitoramento`, `wipe` e `testes` no painel administrativo;<br>• Exportação de snapshot JSON e restauração com upsert idempotente no PostgreSQL;<br>• Monitoramento de latência e contadores de tabelas via head queries HTTP sem consumo de egress;<br>• Seletor de alunos por `userId` real e injeção atômica de recursos de teste no Supabase com resgate automático no login. |
| **RPC Atômica `record_game_session`** | `7d8ef01` | `dbInterface.ts`, `supabaseAdapter.ts`, `firebaseAdapter.ts`, `App.tsx` | • Padronização de `recordGameSession(userId, gameId, bytesEarned, session)` na interface e adaptadores;<br>• Chamada segura à Stored Procedure `record_game_session` no PostgreSQL do Supabase (atualização atômica de `game_progress` e `profiles`);<br>• Fallback simétrico no `FirebaseAdapter` e integração imediata no encerramento de partidas (`Type: Radar` em `App.tsx`). |
| **Caps Lock Global & Case Mismatch** | `39aef74` | `keyboardCase.ts`, `CapsLockWarning.tsx`, 9 Arenas | • Criação do hook `useCapsLock()` e utilitário `checkCaseMismatch`;<br>• Componente visual `CapsLockWarning` integrado em todas as 9 instâncias do TypeClicker;<br>• Alerta pedagógico flutuante/contextual de tecla Maiúscula (`Shift + [X]`) ou Minúscula. |
| **Correção de Frases no Terminal & Dead Keys** | `4ec9cad` | `TypingArena.tsx`, `FocusDrillModal.tsx`, `App.tsx` | • Container adaptativo com auto-scroll em frases/códigos sem corte de texto;<br>• Interceptação e composição de `Dead` keys no Modo Foco com remoção de bypass de acento;<br>• Elevação do limiar de ativação para 5 erros repetidos e cooldown de 30s. |
| **Auditoria & Sanitização de Bypasses** | `5f1213c` | `App.tsx`, `AdminPanel.tsx`, `adapters/*`, `dbInterface.ts`, `leaderboardUtils.ts` | • Eliminados 14 pontos de bypass onde `saveProgressToCloud` burlava o provedor ativo;<br>• Todas as gravações de estado redirecionadas para `dbService.saveLegacyGameState`;<br>• Extensão de `IDatabaseService` com 5 operações administrativas implementadas no `SupabaseAdapter` e `FirebaseAdapter`;<br>• Extração de utilitários puros para `leaderboardUtils.ts` e desacoplamento de 8 componentes visuais/hooks de `firebaseService`. |
| **Temporadas Trimestrais & Hall da Fama** | `2924470` | `LeaderboardModal.tsx`, `AdminPanel.tsx`, `schema.sql`, `supabaseAdapter.ts` | • Ciclo trimestral alinhado ao calendário SEED-PR;<br>• Seletor "3º Trimestre (Atual) \| Todos os Tempos \| Hall da Fama";<br>• Pódio comemorativo e memorial histórico Top 3;<br>• Fechamento seguro de temporada no painel docente com confirmação digitada (`"CONFIRMAR"`). |
| **Migração Baseline v1.0.0** | `5b4aaa5` | Core Platform | • Baseline de referência estável da plataforma com arquitetura original Cloud Firestore. |

## Modelo de Identidade e Segurança de Dados (auditoria 06/10/2026)

- **Fonte oficial:** Supabase (PostgreSQL). O `FirebaseAdapter` foi eliminado na Fase A; `dbFactory.ts` instancia exclusivamente o `SupabaseAdapter`.
- **Identidade no Postgres:** Firebase JWT via Supabase Third-Party Auth. `public.fb_uid()` devolve o `sub`; `public.is_staff()` consulta `public.staff_users` (tabela sem acesso via API). Cliente: `supabaseClient.ts` envia o ID token somente com `VITE_SUPABASE_FIREBASE_AUTH=true`.
- **Autoridade de admin/professor:** `firestore.rules` e `server.ts` (token verificado) para Firestore/API; `staff_users` para Postgres. Checagens no cliente (`isSuperAdminEmail`, `isStaffMember`) servem apenas à UI.
- **Escrita sensível** (`role`, temporada, créditos de bytes) passa por trigger/RPC com validação do chamador, nunca por `update` direto do cliente.
- **Pendências conhecidas:** execução de código de aluno do ProgPlay (`new Function`) deve migrar para Web Worker/iframe sandbox; `/system/settings` ainda é legível por qualquer usuário logado (mover `pendingTestGrants`/`testerEmails`); resgate de concessões de teste ainda ocorre no cliente.
