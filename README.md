# 🖥️ TypeClicker Educa

**Plataforma educacional gamificada de digitação para laboratórios de informática escolares.**

Desenvolvida para o **Colégio Estadual Leopoldina Bittencourt Pedroso** (Curitiba / PR), a plataforma transforma o aprendizado de digitação em uma experiência de RPG competitivo e cooperativo — com múltiplos modos de jogo, ranking em tempo real, painel administrativo completo para o professor e trilhas curriculares vinculadas às disciplinas lecionadas.

---

## 🚀 Stack Tecnológico

| Camada | Tecnologia | Versão |
|---|---|---|
| **Framework UI** | [React](https://react.dev/) | 19.0.1 |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org/) | 5.8.2 |
| **Build Tool** | [Vite](https://vitejs.dev/) | 6.2.3 |
| **Estilização** | [Tailwind CSS](https://tailwindcss.com/) | 4.1.14 |
| **Animações** | [Motion (Framer Motion)](https://motion.dev/) | 12.23.x |
| **Ícones** | [Lucide React](https://lucide.dev/) | 0.546.x |
| **Banco de Dados (Oficial)** | [Supabase](https://supabase.com/) (PostgreSQL 15+) | `@supabase/supabase-js` 2.x |
| **Banco de Dados (Legado / Contingência)** | [Cloud Firestore](https://firebase.google.com/docs/firestore) *(obsoleto)* | SDK 12.x (`FirebaseAdapter`) |
| **Autenticação** | [Firebase Auth](https://firebase.google.com/docs/auth) (Google Identity institucional) | SDK 12.x |
| **Servidor** | [Express](https://expressjs.com/) + Vite SSR/Middleware | 4.x / 6.x |
| **Monitoramento** | Métricas Supabase Postgres + [@google-cloud/monitoring](https://cloud.google.com/monitoring) *(legado)* | 6.x |
| **VFX de Confetti** | [canvas-confetti](https://github.com/catdad/canvas-confetti) | 1.9.x |
| **Áudio** | Web Audio API (nativa) — sintetizador procedural | — |
| **Hospedagem** | Google Cloud Run (containerizado) | — |

---

## 🎮 Modos de Jogo

### 1. TypeClicker — Terminal de Digitação (Jogo Principal)
O modo central da plataforma. O aluno digita palavras ou frases em um terminal gamificado e acumula **Bytes** como moeda de progresso.

- **Modos de texto:** `words` (palavras isoladas), `sentences` (frases completas), `code` (trechos de código)
- **Dificuldade adaptativa:** Categorias de palavras desbloqueadas progressivamente conforme o nível do jogador
- **Multiplicador de Combo:** A cada sequência de acertos consecutivos o multiplicador de Bytes cresce (até 8x)
- **Focus Buffer System:** Barra de calor que drena com erros e entra em sobreaquecimento — aciona debuffs visuais
- **Teclas ABNT2 e Dead Keys:** Suporte completo a acentos do português (`´`, `` ` ``, `^`, `~`, `¨`) via resolução de dead keys
- **Detecção Global de Caps Lock:** Alerta visual instantâneo quando o Caps Lock está ativo, prevenindo sequências de erros involuntários em todas as 9 interfaces de digitação
- **Aviso Pedagógico de Caixa (Case Mismatch):** Identificação contextual quando a letra correta é digitada com caixa invertida, orientando o aluno a usar `Shift` ou desativar o `Caps Lock`
- **Auto-Scroll e Responsividade para Frases e Códigos:** Terminal adaptativo com rolagem suave que mantém o caractere ativo `.char-current` sempre visível em telas de qualquer proporção
- **Input invisível nativo:** Compatível com IME de entrada de texto, sem conflito com atalhos do sistema operacional
- **Keystroke VFX:** Animações de partículas temáticas a cada acerto, configuráveis por skin comprada na loja
- **Screen Shake:** Tremor de tela configurável por nível de acessibilidade
- **Pausa automática:** Jogo pausa e perde o foco ao abrir qualquer modal sobreposto

### 2. Type: Radar — Defesa de Núcleo (Jogo de Ação)
Modo de ação estratégica com mecânica de mira por digitação. O jogador controla uma torre de defesa e abate naves invasoras digitando palavras vinculadas a cada alvo.

- **Naves e ondas:** Alvos aparecem em trajetórias variadas; cada nave é identificada pela primeira letra de sua palavra
- **Console de Comandos (`/`):** Ativa poderes especiais — `/freeze`, `/nuke`, `/shockwave` — por digitação de comandos
- **Upgrades por rodada:** Ao completar uma onda, o jogador escolhe entre 3 upgrades aleatórios (dano, recarga, escudo, etc.)
- **Passivos de classe RPG:** Habilidades passivas da classe afetam os bônus de cada upgrade
- **Ranking dedicado:** Pontuação final convertida em Bytes e registrada no leaderboard global
- **Áudio procedural:** Trilha e efeitos de som sintetizados em tempo real pelo `radarAudio.ts` via Web Audio API

### 3. Corrida Escolar — Multiplayer em Tempo Real
Corrida de digitação simultânea para toda a sala de aula, lançada pelo professor no painel administrativo.

- **Disparo por sessão:** O professor seleciona os parâmetros (texto, modo, duração) e lança a corrida com 1 clique
- **Barra de progresso ao vivo:** Cada aluno vê em tempo real o avanço de todos os competidores via Supabase Realtime sob demanda (WebSockets) *(com fallback para Firestore `onSnapshot`)*
- **Pódio automático:** 🥇🥈🥉 exibido ao finalizar com PPM, acurácia e bytes ganhos
- **Recompensas escaladas:** Configuráveis por colocação
- **Cancelamento de emergência:** O professor pode encerrar a corrida a qualquer momento

### 4. Raid Coletiva — Boss Cooperativo
Batalha cooperativa em que **toda a sala digita junta** para derrotar um boss com HP compartilhado.

- **Bosses calibrados:** HP escalonado pelo número de alunos ativos (ex: *Sentinela de Dados*, *Leviatã de Fogo*, *Titã Quântico*)
- **Dano coletivo:** Cada aluno contribui com dano proporcional à sua velocidade e precisão
- **Barra de HP ao vivo:** Estado do boss sincronizado em tempo real para todos via Supabase Realtime *(com fallback para Firestore `onSnapshot`)*
- **Modo Fúria:** Boss entra em berserk abaixo de 30% de HP
- **Professor como GM:** Escolhe o boss, lança a raid e monitora o dano de cada aluno

### 5. Arena 1x1 — Duelo PvP
Duelos diretos entre alunos em tempo real com sistema de ranking competitivo (ELO/Pontos de Glória).

- **Salas por código:** Um aluno cria a sala e compartilha o código (ex: `LEO88`) com o adversário
- **Bot adversário:** Treino contra IAs com 3 dificuldades calibradas (Mestre, Grão-Mestre, Lendário)
- **Ranking de duelos:** 7 patentes — de *Recruta do Coliseu* a *Lenda Imortal Leopoldina*
- **Moeda de duelo (🪙):** Vitórias geram `duel_coins` para cosméticos exclusivos da Arena
- **Temas e skins exclusivos da Arena:** Layouts e skins de cultura pop desbloqueáveis apenas via vitórias PvP

### 6. Masmorra RPG — Andares Procedurais
Dungeon crawler de texto onde o aluno enfrenta inimigos e bosses digitando palavras em tempo limitado.

- **100 andares gerados:** Andares com inimigos, armadilhas, baús e expedições
- **Boss a cada 10 níveis:** 10 guardiões únicos com mecânicas exclusivas — escudo de tokens, loop de palavras, cast bar de invasão, branching de rota estratégica (Nv 10–100)
- **Chave de Masmorra:** Recurso consumível obrigatório para entrar em andares
- **Sistema de equipamentos:** Perks equipáveis que modificam as passivas dentro da dungeon
- **Baú Minigame:** Mini-jogo de decifração criptográfica para abrir baús encontrados nos andares
- **Crónicas RPG Infinitas:** Narrativa procedural adaptada às teclas fracas do aluno
- **Debuffs visuais:** Flash, tremor e HUD de debuff animado com countdown de dano

### 7. Time Attack — Desafio Cronometrado
Modo de pressão máxima com duração de 30 ou 60 segundos.

- **Modos:** `words` ou `sentences` com texto da trilha curricular ativa
- **Telemetria:** PPM, acurácia, combo máximo, total de palavras concluídas
- **Recompensa:** Bytes e tokens de duelo escalados pela performance final

### 8. Foco Drill — Treino Adaptativo de Teclas Fracas
Treino direcionado gerado automaticamente pela análise da telemetria do aluno.

- **IDT (Índice de Dificuldade da Tecla):** Taxa de erro (70%) + latência de resposta (30%)
- **Geração de batch:** Sequências de palavras que maximizam a exposição às teclas problemáticas
- **Relatório de fraquezas:** Exibe as 3 teclas mais problemáticas com taxa de erro e tempo médio de resposta

---

## 🎭 Sistema de Progressão e Gamificação

### Níveis e Bytes
- **100 níveis de progressão:** Curva exponencial com requisitos calculados por `calculateMinBytesForLevel()`
- **3 moedas:** `level_tokens` (progressão), `duel_coins` (PvP), `quantum_fragments` (endgame mítico)
- **Upgrades de Servidor:** Melhorias passivas que aumentam produção automática de Bytes
- **Celebração de Nível 100:** Modal especial + registro permanente no Hall da Fama

### Classes RPG
Escolhida uma vez, a classe define passivas permanentes em toda a plataforma:

| Classe | Foco | Passivas |
|---|---|---|
| ⚔️ **Guerreiro Veloz** | Alta velocidade (PPM) | +25% Bytes acima de 55 PPM; golpes críticos em bosses |
| 🏹 **Arqueiro do Combo** | Precisão e combos longos | +0.2x multiplicador a cada 20 acertos; 50% perdão de erro |
| 🧙 **Mago dos Bytes** | Geração passiva | +25% produção automática; escudo arcano com acentos |

### Sistema de Conquistas (60+)
Categorizadas em: Velocidade & Precisão, Volume, Progressão, PvP & Social, Hardcore (com recompensas em 🌌 Fragmentos Quânticos)

### Quests Semanais
Reset toda segunda-feira (00:00 UTC). 3 missões ativas por ciclo, categorizadas em: volume, velocidade, precisão, PvP, RPG. Recompensas em Bytes e `level_tokens`.

### Prestígio
Reinício voluntário com recompensas cosméticas exclusivas que persistem entre prestígios.

---

## 🏆 Ranking e Competição

### Leaderboard Global
- **6 métricas:** Nível, PPM, Combo, Bytes, Vitórias PvP, Vitórias em Corridas
- **Filtro de staff:** Professores e admins excluídos automaticamente do ranking
- **Guerra de Turmas:** Ranking consolidado por sala — média de PPM, conquistas somadas, aluno destaque por turma

### Pódio ao Vivo na Barra Lateral
- **Dual-Timer:** Rotação local a cada 12s (zero leituras de banco) + sincronização cloud a cada 3 minutos
- **Congelamento por inatividade:** Timer pausado quando a aba perde foco (`document.hidden`)
- **Acesso rápido:** Clicar em um competidor abre o leaderboard na métrica correspondente

### Hall of Fame — Pioneiros do Nível 100
Os **3 primeiros alunos** a alcançarem o nível 100 ficam registrados permanentemente com data/hora em destaque na interface.

---

## 🎨 Sistema de Cosméticos

### Temas de Terminal (30+)
Matrix, Dracula, Cyberpunk, Synthwave, Monokai, Solarized Dark, Nordic Ice, Lava Terminal, Golden Luxury, Stealth Mono + temas de **cultura pop** (Sith Darkside, Super Saiyan, Nether Magma, Spider-Verse) + temas **míticos de endgame** (Sandevistan, Sun Breathing, Electric Thunder, Abyssal Vessel) + temas de **apps populares** (WhatsApp, Instagram, YouTube, TikTok, Roblox)

### Layouts de Interface (25+)
Arcade Cabinet, Zen Focus, BIOS/DOS, Cyber Deck, IDE Developer, Space Station, Steampunk Lab, Mac Classic, Speedrun Arena, School Chalkboard + layouts de **cultura pop** (Star Wars Cockpit, Minecraft Block, Shonen Combat, Mushroom Kingdom) + layouts **míticos** (Infinite Void, Pirate Deck, Judgment Hall, Edgerunner Rig, Bat Cave Tactical) + layouts de **apps** (WhatsApp Chat, Instagram Feed, YouTube Theater, TikTok Stream, Roblox Studio)

### Skins do Bytezinho (20+)
Classic, Cyber, Retro 8-bit, Hoodie Hacker, Wizard, Astronaut, Ninja, Steampunk, Golden King, Diver, Robot Mecha + skins de **cultura pop** (Jedi Master, Diamond Miner, Saiyan Warrior, Arachnid Hero) + skins **míticas** (Blindfolded Sorcerer, Rubber Pirate, Urban Cyborg, Demon Slayer, Supersonic Hedgehog, Shadow Crusader)

### Efeitos VFX de Animação (25+)
Confetti, Golden Coins, Matrix Stream, Supernova Burst, Tesla Lightning, Volcano Flame + efeitos de **cultura pop** (Hyperspace Warp, Kamehameha, Diamond Rain) + efeitos **míticos** (Gear Second Steam, Gaster Bone Barrage, Sandevistan Afterimage, Thunder Storm) + efeitos de **apps** (WhatsApp Bubbles, Instagram Hearts, YouTube Play Spark, TikTok Music Glitch, Roblox Blocks Fall)

### Molduras de Card de Perfil (8)
Basic, Foil Holográfico, Neon, Gold, Magma, Cosmic, Matrix, Steampunk — com efeitos visuais de brilho, pulso e estrelas procedurais via CSS

### Badges Dinâmicos de Perfil
Badges automáticos por categoria (velocidade, precisão, combo, volume, PvP, corridas, progressão, conquistas, classe RPG) com raridades: Common → Rare → Epic → Legendary → Mythic

### Conversor Quântico
Converte `level_tokens` em `quantum_fragments` — moeda de endgame para itens Míticos e Quânticos

---

## 📚 Trilhas Curriculares Dinâmicas

O professor seleciona a trilha ao criar uma sessão. O banco de palavras e textos se adapta automaticamente:

| Trilha | Disciplina | Turmas |
|---|---|---|
| `geral` | Português geral | Todas |
| `scratch` | Educação Digital — Blocos Scratch | 8º e 9º Anos |
| `web` | Educação Digital — HTML, CSS, JavaScript | 1º e 2º Médio |
| `empresarial` | Informática Empresarial | 1º e 2º Médio |
| `ingles` | Inglês | Todas |

---

## 🔐 Sistema de Turmas com Verificação Criptográfica

1. O professor gera um **código de sessão** (ex: `A5F9`) com validade configurável (1h, 2h ou 4h)
2. O aluno insere o código; o sistema verifica criptograficamente se pertence à sessão atual
3. A turma é gravada no perfil do aluno no Supabase (`public.profiles.turma`), protegida pelas políticas RLS (e replicada no Firestore em modo de contingência)
4. Após a atribuição, o campo de turma é **somente-leitura para o aluno**

---

## 🏫 Painel do Professor (AdminPanel)

Suite administrativa completa (`AdminPanel.tsx`) com múltiplas abas funcionais:

- **Trava de Laboratório:** Bloqueia/libera acesso à plataforma fora do horário de aula
- **Código de Sessão:** Geração com validade, trilha curricular selecionada e tela de espera do aluno
- **Dashboard de Métricas:** PPM médio, acurácia, nível e Bytes por turma em tempo real
- **Exportação CSV (UTF-8 BOM):** Boletim escolar com compatibilidade nativa com Excel — Nome, E-mail, Turma, Nível, PPM, Acurácia, Maior Combo, Bytes, Vitórias em Corridas — **0 requisições adicionais ao banco** (agregado client-side em memória)
- **Lançador de Corridas:** Seleção de texto/modo/duração + monitoramento de pódio ao vivo via canais Realtime
- **Lançador de Raids:** Seleção de boss com HP calibrado + acompanhamento de dano coletivo via canais Realtime
- **Biblioteca Curricular:** Acervo de textos temáticos por disciplina com envio direto à corrida
- **Backup Local / Cloud:** Download/upload de JSON + snapshots do Supabase (e Firestore de contingência) com rollback em 1 clique
- **Gestão de Temporadas Bimestrais:** Fechamento de ciclo bimestral com geração automática de Hall da Fama (`public.season_history`) e reset de pontuação sazonal sem afetar moedas permanentes
- **Gestão de Professores:** Inclusão e revogação de outros docentes autorizados
- **Monitor de Cotas e Infraestrutura:** Painel de saúde do Supabase PostgreSQL (com suporte legado a métricas do Google Cloud Monitoring API para instâncias Firestore)

---

## ♿ Acessibilidade Pedagógica

- **Alto Contraste:** Paletas para telas de baixo brilho
- **Proteção contra Fotossensibilidade:** Desativa flashes estroboscópicos e tremores
- **Cadência Adaptativa:** Tolerância sem limite / 10s / 15s para o Focus Buffer
- **Escala Tipográfica:** Ajuste de tamanho de fonte do terminal
- **Cursor de Alta Visibilidade:** Cursor de digitação ampliado

---

## ⚙️ Arquitetura de Sincronização & Capacidade (Supabase PostgreSQL)

A plataforma opera com **custo zero** no tier gratuito do Supabase, calibrada para atender picos simultâneos de **35 a 90 máquinas** no laboratório de informática escolar:

| Dimensão | Cota Supabase (Free Tier) | Estratégia Adotada | Impacto no Laboratório |
|---|---|---|---|
| **Armazenamento** | 500 MB PostgreSQL | Modelo Híbrido: Relacional (`profiles`) + `JSONB` (`game_progress`) | < 30 MB para 5.000+ alunos |
| **Requisições de Leitura** | Ilimitadas (PostgREST HTTP) | Placares e pódios consultam API REST com cache de 30s–60s e deduplicação de promessas | Consultas indexadas executam em < 5ms |
| **WebSockets Realtime** | 200 conexões / 2M msgs/mês | Realtime ativado **estritamente sob demanda** apenas durante Corridas e Raids | Zero risco de esgotamento de mensagens mensais |
| **Escritas / Autosave** | Ilimitadas (PostgREST HTTP) | Throttle de 60s em digitação + flush imediato em marcos críticos | Evita sobrecarga de pooling |

### Estratégias de Engenharia:

- **Autosave Event-Driven:** Progresso contínuo acumulado localmente e enviado com throttle de 60s (`useGameSync.ts`). Em eventos críticos (subir de nível, derrotar boss, sair de jogo), o flush é executado instantaneamente.
- **Buffer Offline e Tolerância a Falhas:** Contingência em `localStorage` por UID evita perda de progresso caso a conexão do laboratório oscile.
- **Persistência no Desligamento:** `beforeunload` + `pagehide` garantem salvamento atômico quando o aluno fecha a tampa do notebook ou encerra a aba.
- **Pódio com Dual-Timer:** Rotação visual local (12s) sem requisições de rede + sincronização cloud com cache de 3 minutos.
- **Guerra de Turmas em Memória:** Agregações por turma e série calculadas em memória via `turmasAggregator.ts` — **0 leituras adicionais ao banco**.
- **Pausa por Inatividade:** Timers e conexões em segundo plano pausados quando a aba perde foco (`document.hidden`).

> **Nota sobre o Firestore (Legado / Contingência):** A plataforma mantém o `FirebaseAdapter` totalmente funcional via flag `VITE_DB_PROVIDER="firestore"`. A arquitetura anterior operava sob o plano Spark do Firebase (limite de 50.000 leituras e 20.000 gravações diárias). Todo o tráfego atual de produção foi migrado com sucesso para o Supabase.

---

## 🔒 Segurança

- **Identidade Híbrida (Firebase Auth + Supabase):** Autenticação segura via Google Identity institucional (`@escola.pr.gov.br`). O UID gerado no Google Auth é mapeado diretamente como chave primária `TEXT` no Supabase (`public.profiles.id`).
- **Supabase Row Level Security (RLS):** Todas as tabelas possuem políticas RLS ativas:
  - `public.profiles`: Leitura pública para pódios/placar; inserção e atualização permitidas apenas para o próprio usuário (`auth.uid() = id`).
  - `public.game_progress`: Leitura pública de pontuações; gravação restrita ao proprietário.
  - `public.user_cosmetics` e `public.user_achievements`: Apenas o dono pode gerenciar seu inventário.
  - `public.seasons_history`: Histórico de Hall da Fama aberto para consulta pública.
- **Anti-Cheat em Camadas:**
  - *Client-side:* Validação de sanidade do estado (`validateStateSanity`) checa deltas máximos por segundo.
  - *Database-side:* Stored Procedure `record_game_session` com validação de caps no PostgreSQL, impedindo adulteração de saldo via DevTools.
- **Turma Imutável pelo Aluno:** Atribuição de turma somente via código de sessão verificado pelo professor.
- **Código de Sessão com Expiração:** Validade configurável pelo professor (1h a 4h) com invalidação automática.

---

## 🧩 Arquitetura de Componentes

```
src/
├── App.tsx                          # Componente raiz — estado global, modais, listeners
├── components/
│   ├── TypingArena.tsx              # Arena de digitação ABNT2 + dead keys + VFX + IME
│   ├── AdminPanel.tsx               # Painel administrativo completo do professor
│   ├── GameSelectionScreen.tsx      # Hub central de seleção de modos de jogo
│   ├── LeaderboardModal.tsx         # Ranking global multimétrica + Guerra de Turmas
│   ├── CosmeticsShopModal.tsx       # Loja de cosméticos com 5 categorias
│   ├── ArenaModal.tsx               # Duelos 1x1 PvP (com bot IA)
│   ├── ClassroomRaceArena.tsx       # Arena de Corrida Escolar (multiplayer)
│   ├── ClassroomRaidArena.tsx       # Arena de Raid Coletiva (cooperativo)
│   ├── RpgDungeonModal.tsx          # Entrada e gestão da Masmorra RPG
│   ├── RpgChronicleArena.tsx        # Combate de texto nos andares da Masmorra
│   ├── RpgChestMinigame.tsx         # Minigame de baú criptográfico
│   ├── TimeAttackModal.tsx          # Desafio cronometrado 30s/60s
│   ├── FocusDrillModal.tsx          # Treino adaptativo de teclas fracas
│   ├── QuestsModal.tsx              # Quests semanais e progresso
│   ├── AchievementsModal.tsx        # Catálogo de 60+ conquistas
│   ├── StudentModal.tsx             # Perfil, nickname, turma e classe RPG do aluno
│   ├── StudentProfileCard.tsx       # Card de perfil colecionável com moldura e badges
│   ├── MetricsModal.tsx             # Métricas pedagógicas detalhadas do aluno
│   ├── AccessibilityModal.tsx       # Central de acessibilidade
│   ├── PauseOverlay.tsx             # Overlay de pausa do jogo
│   ├── SessionLockOverlay.tsx       # Tela de espera antes da sessão
│   ├── StatsSidebar.tsx             # Barra lateral de status e pódio ao vivo
│   ├── TopPodiumWidget.tsx          # Widget do pódio Top 3 com dual-timer
│   ├── Level100PioneersWidget.tsx   # Hall of Fame dos pioneiros nível 100
│   ├── BytezinhoAvatar.tsx          # Avatar animado do mascote (20+ skins)
│   ├── TerminalThemeEffects.tsx     # Efeitos visuais temáticos do terminal
│   ├── games/radar/
│   │   └── TypeRadarGame.tsx        # Jogo Type: Radar completo
│   └── layouts/                     # 18 layouts de interface cosméticos
├── supabase/
│   └── schema.sql                   # DDL PostgreSQL, RLS, índices e Stored Procedures
├── src/
│   ├── App.tsx                      # Componente raiz — estado global, modais, listeners
│   ├── components/
│   │   ├── TypingArena.tsx          # Arena de digitação ABNT2 + dead keys + VFX + IME
│   │   ├── AdminPanel.tsx           # Painel administrativo completo do professor
│   │   ├── GameSelectionScreen.tsx  # Hub multi-jogos (abas, filtros, busca)
│   │   ├── LeaderboardModal.tsx     # Ranking multimétrica + Guerra de Turmas
│   │   ├── CosmeticsShopModal.tsx   # Loja de cosméticos com 5 categorias
│   │   ├── ArenaModal.tsx           # Duelos 1x1 PvP (com bot IA)
│   │   ├── ClassroomRaceArena.tsx   # Arena de Corrida Escolar (multiplayer)
│   │   ├── ClassroomRaidArena.tsx   # Arena de Raid Coletiva (cooperativo)
│   │   ├── RpgDungeonModal.tsx      # Entrada e gestão da Masmorra RPG
│   │   ├── RpgChronicleArena.tsx    # Combate de texto nos andares da Masmorra
│   │   ├── RpgChestMinigame.tsx     # Minigame de baú criptográfico
│   │   ├── TimeAttackModal.tsx      # Desafio cronometrado 30s/60s
│   │   ├── FocusDrillModal.tsx      # Treino adaptativo de teclas fracas
│   │   ├── QuestsModal.tsx          # Quests semanais e progresso
│   │   ├── AchievementsModal.tsx    # Catálogo de 60+ conquistas
│   │   ├── StudentModal.tsx         # Perfil, nickname, turma e classe RPG do aluno
│   │   ├── StudentProfileCard.tsx   # Card de perfil colecionável com moldura e badges
│   │   ├── MetricsModal.tsx         # Métricas pedagógicas detalhadas do aluno
│   │   ├── AccessibilityModal.tsx   # Central de acessibilidade
│   │   ├── PauseOverlay.tsx         # Overlay de pausa do jogo
│   │   ├── SessionLockOverlay.tsx   # Tela de espera antes da sessão
│   │   ├── StatsSidebar.tsx         # Barra lateral de status e pódio ao vivo
│   │   ├── TopPodiumWidget.tsx      # Widget do pódio Top 3 com dual-timer
│   │   ├── Level100PioneersWidget.tsx # Hall of Fame dos pioneiros nível 100
│   │   ├── BytezinhoAvatar.tsx      # Avatar animado do mascote (20+ skins)
│   │   ├── TerminalThemeEffects.tsx # Efeitos visuais temáticos do terminal
│   │   ├── games/radar/
│   │   │   └── TypeRadarGame.tsx    # Jogo Type: Radar completo
│   │   └── layouts/                 # 18 layouts de interface cosméticos
│   ├── plugins/                     # Jogos criados e submetidos por alunos
│   ├── services/
│   │   ├── dbInterface.ts           # Contrato agnóstico IDatabaseService
│   │   ├── dbFactory.ts             # Injeção dinâmica do adaptador via VITE_DB_PROVIDER
│   │   ├── adapters/
│   │   │   ├── supabaseAdapter.ts   # Provedor oficial Supabase (PostgreSQL 15+)
│   │   │   └── firebaseAdapter.ts   # [LEGADO / FALLBACK] Provedor Firestore
│   │   ├── firebaseService.ts       # Auth Google institucional e rotas legadas
│   │   ├── raceService.ts           # Launchpad e stream de Corridas Escolares
│   │   ├── raidService.ts           # Launchpad e stream de Raids Coletivas
│   │   ├── arenaService.ts          # Duelos 1x1 PvP
│   │   ├── audioSynthesizer.ts      # Sons sintetizados via Web Audio API
│   │   ├── fxEngine.ts              # VFX de partículas + canvas-confetti customizado
│   │   ├── arcadeVfxEngine.ts       # VFX do modo Arcade
│   │   ├── adaptiveDrillEngine.ts   # IDT, análise de telemetria, geração de drills
│   │   ├── questsEngine.ts          # Quests semanais + geração de andares RPG
│   │   ├── achievementEngine.ts     # Avaliação e desbloqueio de conquistas
│   │   ├── profileBadges.ts         # Badges dinâmicos do card de perfil
│   │   ├── radarEngine.ts           # Motor de física e estado do Type: Radar
│   │   ├── radarAudio.ts            # Áudio procedural do Type: Radar
│   │   └── adminMetricsService.ts   # Métricas operacionais e monitoramento
│   ├── data/
│   │   ├── gameCatalog.ts           # Catálogo centralizado de jogos da vitrine
│   │   ├── tracks/                  # 5 trilhas curriculares (geral, scratch, web, empresarial, ingles)
│   │   ├── levelBosses.ts           # 10 guardiões únicos de nível (Nv 10–100)
│   │   ├── rpgChronicles.ts         # Narrativas RPG e lore dos bosses
│   │   ├── levels.ts                # Curva de progressão dos 100 níveis
│   │   ├── sentences.ts             # Banco de frases por categoria
│   │   ├── words.ts                 # Banco de palavras por categoria
│   │   ├── radarWords.ts            # Banco de palavras do Type: Radar
│   │   └── codeSnippets.ts          # Trechos de código para o modo `code`
│   ├── hooks/
│   │   ├── useGameCatalog.ts        # Hook para catálogo de jogos, abas e filtros
│   │   ├── useGameSync.ts           # Sincronização agnóstica (throttle 60s + flush)
│   │   └── useLeaderboardPodium.ts  # Hook de pódio com dual-timer desacoplado
│   ├── constants/
│   │   ├── achievementsCatalog.ts   # 60+ conquistas com evaluate functions
│   │   ├── cosmeticsCatalog.ts      # Catálogo completo de cosméticos com preços
│   │   ├── themes.ts                # 30+ temas de terminal (CSS vars)
│   │   └── school.ts                # Config de turmas e séries da escola
│   ├── types/                       # Types TypeScript (GameState, cosmetics, RPG, leaderboard...)
│   └── utils/
│       ├── keyboardAccents.ts       # Resolução de dead keys ABNT2
│       ├── antiCheat.ts             # Validação de sanidade do GameState
│       ├── leaderboardUtils.ts      # Utilitários puros de ranking, filtro de staff e pioneiros
│       ├── turmasAggregator.ts      # Agregação de ranking por turma (in-memory)
│       ├── audio.ts                 # Engine de som com toggle e volume
│       ├── formatting.ts            # PPM, acurácia, rank, formatBytes
│       ├── storage.ts               # Estado inicial, exportação de save, defaults
│       └── difficulty.ts            # Filtro de categorias por dificuldade e nível
```

---

## ▶️ Como Executar Localmente

### Pré-requisitos
- Node.js 20+
- Instância Supabase (PostgreSQL) com o schema `supabase/schema.sql` executado
- Projeto Firebase configurado para autenticação Google Identity institucional (`firebase-applet-config.json`)
- Variáveis de ambiente configuradas no `.env` (ou `.env.local`):
  ```bash
  # Provedor ativo ('supabase' oficial ou 'firestore' legado de contingência)
  VITE_DB_PROVIDER="supabase"

  # Credenciais Supabase
  VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
  VITE_SUPABASE_ANON_KEY="sua-anon-key"
  ```

### Instalação e Dev

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (Express + Vite)
npm run dev
```

### Build de Produção

```bash
# Build completo (frontend Vite + bundle do servidor Express)
npm run build

# Iniciar servidor de produção
npm start
```

### Verificação de Tipos

```bash
npm run lint   # TypeScript strict check sem emissão de arquivos
```

---

## 👥 Créditos

- **Instituição:** Colégio Estadual Leopoldina Bittencourt Pedroso (Curitiba / PR)
- **Orientação Pedagógica & Coordenação:** Professor Marcos Wrobel
- **Público-Alvo:** Estudantes do Ensino Fundamental e Médio
- **Finalidade:** Projeto pedagógico sem fins lucrativos voltado à inclusão digital e excelência tecnológica na rede pública de ensino
