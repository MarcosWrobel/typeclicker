# Decisões de Arquitetura — TypeClicker

## Decisões Estratégicas (Supabase & Multi-Jogos)

- **Supabase como Provedor Primário com Fallback de Contingência**: O ecossistema adota o Supabase (PostgreSQL) como banco de dados oficial padrão via `VITE_DB_PROVIDER="supabase"`. O `FirebaseAdapter` é mantido íntegro e testado como fallback emergencial via variável de ambiente.
- **Identidade Híbrida (Firebase Auth + Supabase Postgres)**: A autenticação continua utilizando o Firebase Auth com Google Sign-In institucional (`@escola.pr.gov.br`), aproveitando o domínio de produção já autorizado no Google Cloud. O UID do Google é utilizado como chave primária `TEXT` no Supabase (`profiles.id`).
- **Arquitetura de Dados Híbrida (Relacional + JSONB)**:
  - `public.profiles`: colunas relacionais indexadas para ordenações e filtros rápidos (Bytes, Turma, Nível, Nome, Apelido, Tokens, Classe RPG).
  - `public.game_progress`: uma linha por minijogo com métricas resumidas e um campo `state_payload JSONB` para persistência rica e granular sem necessidade de migrações DDL constantes.
  - `public.user_cosmetics` e `public.user_achievements`: tabelas relacionais dedicadas para controle de inventário e conquistas.
- **Política de Autosave Event-Driven**: Throttle de 60 segundos mantido para digitação contínua em sala (economiza banda da escola e conexão com o pooler do Postgres), combinado com flush/sincronização imediata em marcos críticos (subir de nível, derrotar boss da masmorra, encerrar partida e eventos `beforeunload`/`pagehide`).
- **Leitura Balanceada de Leaderboards (Capacidade: 35–90 máquinas)**:
  - Placares gerais, pódios e rankings consom a API HTTP PostgREST com cache leve em memória (30s a 60s) e índices B-Tree (`idx_profiles_turma`, `idx_profiles_points`).
  - WebSockets (Supabase Realtime) são reservados **exclusivamente sob demanda** para a Corrida Sincronizada (Race) e Raid do Chefão, impedindo o esgotamento do limite mensal de 2M mensagens do tier gratuito.
- **Anti-Cheat em Camadas (Client + Database)**: Guardrails no frontend para feedback instantâneo + Stored Procedures atômicas (`record_game_session`) com travas de incremento no PostgreSQL, impedindo adulteração de saldo via console do navegador.
- **Rankings Trimestrais e Hall da Fama**: Suporte ao ciclo pedagógico oficial da escola estadual por **Trimestres** (`season_bytes` no perfil e histórico arquivado em `public.season_history`). A visualização padrão do Leaderboard passa a ser o Trimestre Atual, com alternador para "Todos os Tempos" e consulta ao Hall da Fama com pódio Top 3 + ranking por turma. O progresso letivo corrente pode ser promovido para o trimestre ativo via script de inicialização (`season_bytes = COALESCE(total_bytes_earned, bytes, 0)`). O fechamento é protegido no AdminPanel com confirmação digitada ("CONFIRMAR"). O saldo vitalício de moedas (`bytes`) e prestígio geral (`total_bytes_earned`) são permanentes e nunca zeram.
- **Escopo Universal**: O Hub deixou de ser exclusivamente um "treinador de digitação" para se tornar uma plataforma educacional genérica. O TypeClicker clássico permanece como o gerador primário da "economia" (Bytes), mas a vitrine do Hub aceita jogos de Matemática, História, Lógica, etc.
- **Separação de Pastas (Core vs Plugins)**: Jogos criados pelo professor (Oficiais/Core) residem em `src/components/games/`. Jogos submetidos por alunos residem em `src/plugins/`. Isso impede que o repositório principal se torne uma bagunça estrutural.
- **Catálogo Client-Side Dinâmico**: Vitrine alimentada por `src/data/gameCatalog.ts` e hook `useGameCatalog()`, suportando abas de categorias (*Oficiais*, *Alunos*, *Novidades*), busca por texto e sub-filtros de Matéria e Gênero.
- **Zero Bypasses e Mediação Estrita via `dbService`**: Toda persistência de progresso de jogos (`saveLegacyGameState`), consultas de placares e operações de painel administrativo (`adminUpdateStudentProfile`, `adminAutoBalanceRpgClasses`, `wipeDatabase`, `sanitizeStaffLeaderboard`, `getAdminDashboardData`) devem ser realizadas unicamente através da interface [`IDatabaseService`](src/services/dbInterface.ts). Chamadas diretas da UI para métodos de SDK (`firebase/firestore`, `saveProgressToCloud`, `@supabase/supabase-js`) são expressamente proibidas para garantir alternância funcional imediata via `VITE_DB_PROVIDER`.
- **Desacoplamento de Utilitários de Domínio (`leaderboardUtils.ts`)**: Funções de domínio puras (`isStaffMember`, `extractLevel100Pioneers`, `ADMIN_EMAILS`) foram isoladas em [`src/utils/leaderboardUtils.ts`](src/utils/leaderboardUtils.ts). Componentes visuais (`LeaderboardModal`, `StatsSidebar`, `StudentProfileCard*`, etc.) e hooks não importam mais arquivos de infraestrutura de banco (`firebaseService.ts`) para avaliações lógicas puras.
- **Bibliotecas whitelisted e Lazy Loading obrigatório**: pacotes permitidos (`@monaco-editor/react`, `recharts`, `react-markdown`) importados dinamicamente via `React.lazy()` e `<Suspense>` no roteador do Hub para proteger a performance inicial.
- **Detecção de Caps Lock e Comparação Estrita de Caracteres**:
  - Para garantir suporte a teclados escolares heterogêneos (Chromebooks, ABNT2 e US), a detecção de Caps Lock foi centralizada no hook `useCapsLock()` (`keyboardCase.ts`) utilizando `e.getModifierState('CapsLock')` em fase de captura global.
  - O componente visual [`CapsLockWarning`](src/components/common/CapsLockWarning.tsx) unifica a sinalização nas 9 instâncias de digitação do sistema.
  - A checagem de caracteres migrou de comparações permissivas/case-insensitive para comparação estrita (`finalChar === expectedChar`). Ao detectar divergência exclusiva de caixa alta/baixa, a função `checkCaseMismatch()` aciona feedback pedagógico ("Pressione Shift + [X]" ou "Desative o Caps Lock"), prevenindo frustração e reforçando a ergonomia motora.
- **Terminal Adaptativo com Auto-Scroll para Frases e Códigos**:
  - Em textos longos (`sentences` e `code`), o container da `TypingArena` utiliza layout dinâmico com auto-scroll focalizado no elemento com a classe `.char-current` (`scrollIntoView`), evitando que caracteres finais fiquem encobertos por sobreposições visuais da interface.
- **Chamada Atômica de Ganho de Bytes e Progresso de Sessão (`recordGameSession`)**:
  - A interface `IDatabaseService.recordGameSession` exige o `userId: string` explicitamente para acomodar a arquitetura de Identidade Híbrida (onde o Firebase Auth fornece o UID autenticado que mapeia em `profiles.id`).
  - No `SupabaseAdapter`, a execução invoca o RPC PostgreSQL `record_game_session`, que de forma atômica atualiza o `game_progress` (com `GREATEST(high_score)` e `metrics`) e credita cumulativamente os `bytes`, `total_bytes_earned` e `season_bytes` na tabela `public.profiles`.
  - No `FirebaseAdapter`, atualiza de forma defensiva os campos de `bytes` e `points` do documento no Firestore, garantindo simetria de comportamento entre ambos os provedores.
  - A saída de minijogos (como `Type: Radar` em `App.tsx`) aciona essa gravação imediatamente após a partida.
- **Backups e Restauração Relacional por Arquivo JSON (`supabaseBackupService.ts`)**:
  - Exporta um snapshot completo de todas as 5 tabelas vitais (`profiles`, `game_progress`, `user_cosmetics`, `user_achievements`, `season_history`) com identificador de versão (`version: 2.0.0`) e metadados de contagem.
  - **Tolerância e Resiliência a Cache de Schema**: O serviço implementa salvaguarda ativa (`isTableMissingError`) para falhas decorrentes de tabelas ainda não migradas no ambiente (como `season_history` em produção ou códigos PostgREST `PGRST205` / `42P01`). Nessas condições, as tabelas secundárias ausentes degradam graciosamente para coleções vazias com avisos de auditoria, assegurando que o backup integral dos dados essenciais dos estudantes nunca seja bloqueado.
  - A restauração opera inteiramente no navegador do professor através de upload do JSON, com validação estrita de integridade e `upsert` com resolução de conflitos por chave primária no PostgreSQL, dispensando acessos SSH ou painéis externos.
- **Monitoramento de Infraestrutura com Custo Zero de Transferência (`supabaseMetricsService.ts`)**:
  - O censo de tabelas utiliza o parâmetro `{ count: 'exact', head: true }` da API PostgREST do Supabase, retornando o total exato de linhas no header `content-range` com corpo vazio (`egress 0`).
  - A latência ponta a ponta é aferida em tempo real via ping HTTP leve, combinada com cache de 30 segundos para evitar sobrecarga no servidor.
- **Concessão de Testes com Chave Primária Real e Fila de Resgate (`supabaseTestService.ts`)**:
  - A seleção de alunos no painel de testes utiliza o `userId` real do Supabase (`profiles.id`), eliminando qualquer suposição de e-mail institucional sintético.
  - As concessões de teste calculam a curva de XP oficial via `calculateMinBytesForLevel` e atualizam atomicamente o saldo de Bytes, Nível, Tokens e Fragmentos no `profiles`, além de realizar upsert de cosméticos em lote na tabela `user_cosmetics`.
  - Para contas não cadastradas no momento da concessão, os recursos são agendados e aplicados automaticamente no login via `claimPendingTestGrantsSupabase`.
- **Wipe Seguro com Limpeza Sincronizada Multi-Provedor**:
  - A exclusão de dados respeita integridade relacional, preservando contas docentes (`role = 'teacher'`) e limpando tabelas filhas antes de resetar os perfis dos alunos.
  - Para prevenir ressurgimento de dados fantasmas caso a aplicação seja executada em ambientes com fallback para Firestore ativado, uma exclusão sincronizada é disparada em paralelo nas coleções legadas (`/saves`, `/leaderboard`).
- **Arquitetura Vetorial Canônica & Política de Zero Emojis Unicode**:
  - É proibido o uso de glifos de emoji Unicode em UI e gameplay por incompatibilidade de renderização entre SOs (Linux, ChromeOS, Windows, macOS), quebra de alinhamento e dissonância estética com o tema retrô/cyberpunk escolar.
  - Adota-se a ordem de precedência: 1) `lucide-react` para utilitários; 2) `src/constants/vectorShapes.ts` e mascotes existentes (`BytezinhoAvatar`, `BytezinhoMascot`); 3) vetores icônicos em SVG nativo React em `src/components/vectors/` ou pastas de jogos específicos (`RadarIcons.tsx`, etc.). Todos com custo zero de rede/egress, renderização SVG inline e suporte a herança de cores via Tailwind (`currentColor`).

## Decisões do Código Legado e Status de Migração

- **[OBSOLETO / SUBSTITUÍDO] Firestore em vez de Realtime Database**: O Firestore foi o banco inicial (`FIRESTORE_NATIVE`), mas tornou-se obsoleto e foi substituído pelo **Supabase (PostgreSQL 15+)** como banco primário oficial. O `FirebaseAdapter` foi preservado exclusivamente para rollback/contingência em caso de emergência.
- **Cloud Run como runtime de produção**: `server.ts` detecta `process.env.K_SERVICE`; serve `dist/` via `express.static`. (Ativo e mantido).
- **Toda a lógica de jogo é client-side**: `server.ts` atua apenas como servidor de arquivos estáticos e métricas; a lógica de gameplay permanece no browser e a liquidação segura de progresso é delegada a Stored Procedures do Supabase.
- **[OBSOLETO / SUBSTITUÍDO] Plano Blaze e Cotas Firestore**: Os limites de cotas do Firestore (50k leituras / 20k gravações diárias no Spark/Blaze) foram superados. As novas restrições de arquitetura no Supabase Free Tier concentram-se em:
  - Armazenamento em disco: 500 MB (suficiente para milhares de alunos usando estrutura híbrida).
  - WebSockets Realtime: Cota de 2M mensagens/mês e 200 conexões simultâneas (mitigado usando PostgREST com cache leve para placares e ativando Realtime apenas sob demanda em Corridas e Raids).
- **[OBSOLETO / SUBSTITUÍDO] Sem Cloud Functions**: Decisão de evitar Cloud Functions mantida, mas agora complementada com **Stored Procedures (RPCs PL/pgSQL)** nativas do PostgreSQL no Supabase (`record_game_session`, `close_current_season`), garantindo atomicidade e anti-cheat sem custo de computação externa.
- **Hub normaliza bytes dos plug-ins**: jogos de alunos entregam métricas brutas; o Hub aplica `min(bytesEarned, timeSpentSeconds × CAP × accuracyFactor)` antes de creditar. Evita inflação. (Ativo).
- **Contrato adotado: `BaseGameProps` + `GameExitPayload`**: contrato pedagógico do guia dos alunos foi adotado como contrato real do código (`src/types/gamePlugin.ts`). (Ativo).
- **Fluxo de contribuição de alunos**: alunos desenvolvem usando `GUIA_CRIACAO_DE_JOGOS.md` → entregam o arquivo `index.tsx` → professor avalia → integra manualmente em `src/plugins/<nome>/`, define o `GameId` e roteamento lazy → habilita via painel admin. (Ativo).
- **Integração do 1º Jogo de Aluno — ProgPlay (André Luís Borato Ferreira - 8º 2)**:
  - Jogo importado em `src/plugins/progplay/` sob a categoria "Alunos" no catálogo.
  - **Duelo 1v1 Sem Dependência de IA**: O sistema original de batalha foi totalmente adaptado para não utilizar APIs de LLM externas nem custos de tokens. As perguntas utilizam a base pré-definida e curada de questões por linguagem (`quizQuestions.ts`). O modo 1v1 suporta duelo solo contra bot mascote inteligente (*Bytezinho 🐸*, simulando tempo de resposta humano e uso tático de poderes como Congelamento, Névoa e Escudo) ou duelo multiplayer local/sala via Supabase Realtime Broadcast efêmero, sem poluir o banco de dados.
  - **Totalmente desacoplado de Firebase Auth/Firestore próprio**: Utiliza a sessão e métricas do TypeClicker via `BaseGameProps` e normalização segura de saída com `onExitToHub`.
  - **Painel de Boas-Vindas e Seleção Imediata**: Ao carregar o jogo, um modal introdutório apresenta os objetivos pedagógicos, os créditos do autor e os cards com as 5 linguagens (JavaScript, Python, CSS3, HTML5 e SQL), permitindo ao aluno direcionar o início da sua prática sem atrito cognitivo.
- **Hierarquia Visual e Ordenação no Hub**: Os 3 jogos principais da plataforma (`TyperDash`, `TypeClicker Classic`, `Type: Radar`) permanecem ancorados nas primeiras posições. Jogos novos ou de alunos recém-integrados ocupam a vaga imediata seguinte (4ª posição em diante), garantindo previsibilidade para os jogos core ao mesmo tempo em que dá visibilidade de destaque para lançamentos.
- **Implementação do ScratchBot: Logic Quest (Substituindo `byte_logic`)**:
  - Jogo oficial de pensamento computacional e algoritmos em blocos visuais (`src/components/games/scratchbot/`).
  - **Mecânica Híbrida de Montagem**: Suporta Drag-and-Drop nativo HTML5 e clique rápido com auto-encaixe em estruturas aninhadas (`children` em laços `repeat`), ideal para ambientes escolares com mouse ou touchpad.
  - **Layout de 3 Colunas Otimizado**: Paleta compacta de blocos à esquerda (w-56), área de scripts centralizada (w-72/w-80) e palco do desafio ampliado (flex-1) com proporção equilibrada para máxima visibilidade do tabuleiro.
  - **Mascote Bytezinho com Skin Oficial**: O personagem não utiliza emojis genéricos; renderiza o `BytezinhoAvatar` oficial com a skin comprada/equipada pelo aluno na loja (`equippedSkin`) e expressões contextuais (`normal`, `oops`, `happy`).
  - **Ecossistema de Obstáculos Dinâmicos**: Além de firewalls estáticos, incorpora mecânicas interativas completas:
    - *EMP Hazards (Pisos de Sobrecarga)*: passagem livre durante a caminhada, mas choque/falha se o código terminar parado sobre eles.
    - *Warp Pads (Teletransportadores)*: saltos quânticos que preservam a rotação para transpor barreiras intransponíveis.
    - *Portões Laser & Chaves Criptográficas*: barreiras que só se abrem após o robô passar pela chave de segurança.
    - *Esteiras Aceleradoras*: impulso de +1 casa na direção da esteira sem custo de bloco de movimento.
  - **Trilha Pedagógica + Modo Procedural Solúvel**: 8 fases artesanais com progressão curricular de obstáculos combinadas com gerador procedural determinístico testado com busca BFS para garantir 100% de solvabilidade.
  - **Áudio Procedural**: Sintetizador Web Audio API puro com efeitos sonoros de snap de blocos, passos mecânicos, teleportes, choques, desbloqueios e fanfarra.
  - **Conformidade de Plug-in**: Implementa `BaseGameProps` e persistência no `game_progress` do Supabase via `onExitToHub`.
- **Opt-in por jogo via `HubConfig.disabledGames`**: professor habilita/desabilita jogos via painel sem deploy. (Ativo).

## Bugs / Débitos Técnicos
- O Baú Criptográfico escrevia num campo fantasma `hackTokens`. Substituído por `cosmetics.levelTokens`.
- `TypeRadarGame` ainda usa o contrato antigo e precisa ser migrado para `GameExitPayload`.
