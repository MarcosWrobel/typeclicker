# 🏰 BYTEQUEST — Status de Desenvolvimento & Contexto de Continuidade

> **Data de Atualização**: 14 de Outubro de 2026  
> **Último Commit**: `abe41d6` (`feat(bytequest): implement ByteQuest roguelite combat runner with 360 combat and game feel`)  
> **Status de Compilação**: ✅ `npx tsc --noEmit` código 0 (Zero erros)  
> **Branch**: `main`

---

## 🎮 1. O Que É o ByteQuest?
O **ByteQuest** é um novo jogo oficial integrado ao ecossistema **TypeClicker**.  
Trata-se de um *Roguelite Combat Runner* inspirado na dinâmica de *Vampire Survivors*, com foco em:
- **Combate de Ação Contínuo a 60 FPS** em Canvas 2D.
- **Diferenciação Forte de Classes RPG**: Guerreiro (Melee/Tanque), Arqueiro (Rápido/Longo Alcance), Mago (Elemental/Área).
- **Digitação Estratégica**: Minions comuns são derrotados com ataques básicos e feitiços; digitação reservada para desferir golpes críticos massivos em **Inimigos Elites**, **Mini-Bosses** e no **Chefão Supremo**.
- **Conjuração de Feitiços via Linha de Comando**: Digitando `/comando` (ex: `/furia`, `/chuva`, `/meteoro`) consumindo Mana/Energia gerada no combate.
- **Progressão Roguelite**: Upgrades temporários de cartas durante a partida e Forja de Itens persistentes no Lobby com a moeda *Bytes*.

---

## 📂 2. Estrutura de Arquivos Criados

```
src/
├── types/
│   ├── byteQuest.ts                # Modelos de Inimigos, Projéteis, Obstáculos, Spells, Shockwaves e Upgrades
│   └── gamePlugin.ts               # Inclusão do 'bytequest' no catálogo de GameId
├── data/
│   ├── byteQuestWords.ts           # Banco de palavras de programação/cyberpunk graduadas por nível
│   └── gameCatalog.ts              # Metadados e card do ByteQuest no Hub do TypeClicker
└── components/games/bytequest/
    ├── ByteQuestGame.tsx           # Orquestrador principal da tela (Lobby ↔ Arena ↔ Game Over / Vitória)
    ├── ByteQuestLobby.tsx          # Pré-jogo: seleção de arquétipo, exibição de stats e Forja de Itens com Bytes
    ├── ByteQuestArenaCanvas.tsx    # Loop gráfico Canvas 2D a 60 FPS (Castelo, Obstáculos, Herói, Efeitos, Shockwaves)
    ├── ByteQuestHUD.tsx            # Interface HUD: Relógio em tempo real, Barras de HP/Energia, Feitiços e Log
    ├── ByteQuestUpgradeModal.tsx   # Modal de escolha de 1 entre 3 cartas de upgrade ao subir de nível
    ├── ByteQuestRewardModal.tsx    # Modal de fim de partida (recompensas em XP, Bytes e conquistas)
    ├── ByteQuestHeroCanvas.tsx     # Renderizador procedural das poses do Bytezinho estilizado por classe
    ├── byteQuestEngine.ts          # Motor de simulação física, colisão, IA, ondas e cálculo de combate 360°
    └── byteQuestAudio.ts           # Síntese sonora procedural pura com Web Audio API (sem assets externos)
```

---

## 🚀 3. Funcionalidades Desenvolvidas & Estado Atual

### A. Arena Ampla & Movimentação 360° Livre
- O container de combate foi ampliado para `max-w-6xl xl:max-w-7xl` e `640px` de altura.
- O herói se movimenta livremente em todo o espaço visível pelos eixos X e Y usando **WASD** ou as **Setas do Teclado**.
- Inimigos surgem em 360° pelas 4 bordas da tela (Norte, Sul, Leste e Oeste) e perseguem ativamente o jogador.

### B. Obstáculos de Cobertura Tática
- 5 obstáculos procedurais distribuídos na masmorra (4 pilares góticos rúnicos + 1 monólito central).
- Colisão física sólida: o herói e os inimigos não atravessam os pilares.
- Absorção de projéteis de plasma: o jogador pode utilizar os obstáculos para se proteger dos tiros inimigos.

### C. Foco de Digitação em Elites e Chefões
- **Minions comuns**: Não têm palavras sobre a cabeça (`word = ''`). A tela permanece visualmente limpa e o combate flui como um survivor tradicional.
- **Elites**: Inimigos especiais com aura violeta/dourada pulsante e brasão. Concluir a digitação da sua palavra desfere um golpe crítico instantâneo de 240+ de dano.
- **Mini-Boss (120s) e Chefe Supremo (270s)**: Batalhas épicas com barras de vida reforçadas e comandos de digitação múltiplos.

### D. Sistema de Recursos (Energia / Mana) e Rebalanceamento
- **Barra de Energia (0 - 100)** adicionada ao HUD.
- Ataques básicos concedem +3 EN no impacto. Inimigos derrotados dropam orbes de energia (+6 a +35 EN).
- Regeneração passiva constante (Mago: +3.2/s; Guerreiro/Arqueiro: +2.0/s).
- Magias agora exigem energia (30 a 70 EN) além do cooldown.
- Danos dos monstros e do herói rebalanceados para progressão orgânica por ondas (Fases 1 a 5).

### E. Relógio do HUD Corrigido
- Implementado um sincronizador a 60 FPS com `requestAnimationFrame` em `ByteQuestHUD.tsx`. O cronômetro (`MM:SS`) agora avança continuamente em tempo real sincronizado com a física.

### F. Game Feel, Mira 360° e Áudio Web Audio API
- **Mira 360°**:
  - *Guerreiro*: cleave direcional de 150° no inimigo mais próximo no alcance corporal ou na direção do olhar, com empurrão físico.
  - *Arqueiro*: disparo direcional de flechas velozes em 360° no inimigo prioritário.
  - *Mago*: disparo de esferas arcanas em 360° em direção ao alvo.
- **Game Feel Implementado**:
  - *Screen Shake*: tremor suave da câmera em críticos e tremor forte em magias e chefões.
  - *Shockwaves*: anéis de choque expansivos desenhados no piso da arena.
  - *Hit-Flash*: inimigos atingidos piscam em branco luminoso instantaneamente.
  - *Partículas de Impacto*: fagulhas metálicas (Guerreiro), rajadas de vento (Arqueiro) e brasas arcanas (Mago).
- **Web Audio API**:
  - `playHitCrunch(isCrit)` para impacto físico encorpado.
  - `playCritHit()` com estrondo grave e sub-frequências.
  - Timbres distintos para lâmina, corda de arco retesada e ressonância de cajado.

---

## 🎯 4. Decisões do `/grill-me` Fechadas com o Usuário

1. **Mira de Ataque**:
   - **Híbrido Dinâmico**: Guerreiro ataca na direção do movimento/olhar ou cleave no alvo corpo a corpo mais próximo; Arqueiro e Mago miram e disparam em 360° livremente no alvo prioritário.
2. **Estilo de Animação**:
   - **Poses de Ação com Recuo**: Bytezinho com recuo elástico e puxada de corda no Arqueiro; avanço com espada no Guerreiro; elevação do cajado com glifo rúnico no chão para o Mago.
3. **Game Feel**:
   - Pacote completo ativado (Screen shake + Hit-flash + Shockwaves + Partículas dinâmicas).
4. **Áudio Procedural**:
   - Síntese de impacto e acertos críticos via Web Audio API.

---

## 📌 5. Ponto Exato de Retomada (Next Step)

A física, tipos, motor, HUD e efeitos de partículas/shockwaves estão **100% integrados e commitados**.

Ao retomar no outro dispositivo:
1. `git pull origin main`
2. Abrir `src/components/games/bytequest/ByteQuestArenaCanvas.tsx`.
3. Na função `drawHero`:
   - Conectar os estados já existentes de `heroAttackTimer`, `heroAttackDuration` e `heroAttackAngle` para desenhar as **poses expressivas das armas**:
     - **Arqueiro**: arco rotacionado em 360° para `heroAttackAngle`, com corda retesando para trás e flecha engatilhada, soltando com recuo elástico.
     - **Guerreiro**: espada executando arco de corte angular luminoso em 360° com rastro neon e avanço do tronco.
     - **Mago**: cajado apontado para o alvo com cristal hiper-brilhante e círculo rúnico circular projetado no chão sob os pés do herói.
4. Testar a experiência visual em combate e validar se o feel está satisfatório.
