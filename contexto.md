# 🌌 TypeClicker — Contexto Geral do Projeto & ByteQuest

> **Data de Atualização**: 18 de Outubro de 2026  
> **Branch**: `main`  
> **Status de Compilação**: ✅ `npm run build` e `npx tsc --noEmit` compilam com **0 erros**  
> **Objetivo deste documento**: Servir como ponto de sincronização rápido e completo para desenvolvimento multiplataforma (Desktop ↔ Notebook).

---

## 📌 1. Visão Geral do Projeto

O **TypeClicker** é uma plataforma educacional e laboratório pedagógico gamificado focado no desenvolvimento de digitação ágil, precisão tática e ergonomia computacional (especialmente voltado para teclados ABNT2 no Brasil e padrões internacionais).

O ecossistema é construído com **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, áudio procedural com **Web Audio API** e persistência híbrida (**Supabase** e **Firebase**).

### ⚔️ O Minigame Principal em Destaque: `ByteQuest`
O **ByteQuest** é um *Roguelite Combat Runner 360°* em tempo real executado em Canvas 2D a 60 FPS. Inspirado em mecânicas no estilo *Vampire Survivors*, o jogo funde:
1. **Combate Contínuo e Automático**: Movimentação livre em 360°, ataques básicos e magias ativadas por classe/cooldown.
2. **Digitação Tática de Alvos**: Digitação reservada para inimigos de elite, santuários, portais de salto e enfraquecimento de chefões épicos.
3. **Progressão Roguelite**: Upgrades temporários durante a run (cartas de level-up) e progressão persistente no Lobby (Forja de Equipamentos, Talentos, Subclasses e Chips de IA com a moeda *Bytes*).

---

## 🚀 2. Resumo das Últimas Grandes Alterações

Abaixo estão todas as implementações e refatorações realizadas recentemente no projeto:

### 🗺️ A. Expansão Gigante de Mapa & Câmera Suave (Lerp)
- **Dimensões do Mundo**: O mapa foi expandido de uma arena estática para um mundo aberto de **5000 x 3600 pixels**.
- **Câmera Suave (*Smooth Camera Lerp*)**: Implementado sistema de interpolação contínua da câmera (`cameraX`, `cameraY`) centrada suavemente no herói.
- **Canvas Ampliado**: O canvas de jogo agora opera em **1000 x 640 pixels** com container `max-w-7xl` responsivo, proporcionando ampla visão tática sem aperto.
- **3 Biomas Dinâmicos Procedurais**:
  - 🏛️ **Cripta de Dados (`crypt`)**: Piso em blocos cianos com ruínas de servidores antigos e névoa holográfica.
  - 🔥 **Forja de Silício (`forge`)**: Fissuras térmicas com lava incandescente, brasas e iluminação alaranjada.
  - 🌌 **Núcleo Quântico (`quantum_core`)**: Piso cósmico com névoa violeta/neon e anomalias de pulso rúnico.

### 👑 B. Sistema de Câmaras & Chefes Épicos com Habilidades Teleguiadas
- **Estrutura por Câmaras**: Cada partida progride por 4 Câmaras (Combate, Sobrevivência cronometrada, Cerco e Câmara do Chefe), com portais de salto holográficos entre elas.
- **Chefes Épicos Reais**:
  - Chefes possuem barras de HP massivas e **não morrem com um simples digitar de palavra**.
  - **Mísseis Teleguiados (*Homing Missiles*)**: Projéteis com aceleração angular contínua que perseguem o jogador e demandam manobras evasivas.
  - **Zonas de Perigo no Solo (*BossHazardZones*)**: Áreas circulares telegrafadas com contagem regressiva e detonação de alto dano.
  - **Padrões de Balas Bullet Hell**: Disparos em espiral, anéis concêntricos e raios orbitais.
- **Combate Híbrido com o Chefe**: O combate automático dá dano constante, enquanto digitar as palavras sobre o chefe quebra escudos de imunidade, atordoa ataques canalizados e desfere críticos devastadores.

### ⏱️ C. Foco Tático (Bullet Time) & Mobilidade do Arquétipo
- **Foco Tático (Bullet Time)**: Ao digitar palavras de alvos ou comandos, o tempo do jogo desacelera (`focusTimeScale` reduzido para até 0.25x), consumindo estamina de foco (`focusStamina`). Isso permite digitar sem ser atropelado pela velocidade dos monstros.
- **Ações de Esquiva/Mobilidade no Espaço (`Spacebar`)**:
  - **Guerreiro**: *Investida Brutal* — avanço rápido com empurrão (*Knockback*) e atordoamento de inimigos à frente.
  - **Arqueiro**: *Dash Evasivo* — deslizamento rápido com vento cortante e invulnerabilidade momentânea.
  - **Mago**: *Teleporte Instantâneo (Blink)* — desmaterialização e reaparecimento à frente com onda de choque de plasma.

### 🏛️ D. Pontos de Interesse no Mapa (POIs)
- **Santuários de Código**: Estruturas místicas espalhadas pela masmorra (Santuário de Overclock, Restauração de HP e Foco Tático). Ao se aproximar e digitar a palavra rúnica, o santuário detona ondas de choque e concede bônus temporários.
- **Terminais Híbridos da Câmara**: Lojas tecnológicas nas câmara onde o jogador pode digitar a palavra da oferta para comprar buffs imediatos com moedas acumuladas na run.
- **Drones Aliados & Armas Automáticas**: Drones orbitais de combate, Aura de Fogo permanente, Mísseis Teleguiados heróicos e Lâminas Bumerangue.

### 🌟 E. Subclasses, Chips de IA e Níveis de Tormento
- **Subclasses por Arquétipo**:
  - *Guerreiro*: Paladino (Escudo sagrado e cura) e Berserker (Dano crescente conforme o HP cai).
  - *Arqueiro*: Franco-Atirador (Críticos devastadores) e Caçador das Sombras (Velocidade e perfuração).
  - *Mago*: Piromante (Meteoro e chamas) e Cronotécnico (Manipulação do tempo e recargas).
- **Chips de IA**: Módulos instaláveis no Lobby (ex: Ressonador de Santuários, Condutor de Sobrecarga, Ímã Neural).
- **Graus de Tormento (Corrupção 0 a 5)**: Multiplicadores de dificuldade para veteranos com recompensas dobradas de XP e Bytes.

### 🎨 F. Redesign do Lobby & Layout do HUD
- **Lobby Redesenhado**: Menu inicial limpo e moderno com navegação por abas/modais sobrepostos (Arsenal, Talentos, Chips de IA, Dificuldade).
- **Ergonomia do Display de Jogo**:
  - O **Arsenal** foi reposicionado logo acima da barra de habilidades.
  - As **Instruções de Como Jogar** foram movidas para fora do canvas de combate.
  - A **Barra de Vida do Chefe** foi separada espacialmente do **Contador de Combo/Overclock**, eliminando a sobreposição de elementos.

### ⌨️ G. Suporte Completo a Teclas Mortas (`Dead Keys`), Til (`~`) e Teclados ABNT2/US-Intl
- **Detecção de Teclas Mortas**: O jogo agora intercepta `e.key === 'Dead'` e `isAccentKey(e.key)` no Linux e Windows.
- **Composição de Acentos**: Pressionar `~` armazena o acento pendente; a vogal seguinte compõe automaticamente (`~` + `a` $\rightarrow$ `ã`, `~` + `o` $\rightarrow$ `õ`).
- **Normalização e Tolerância (`matchChars`)**: Implementada comparação tolerante com normalização NFD no motor — se o jogador teclar `ã` ou `a`, o motor aceita sem quebrar o combo rítmico.
- **Feedback Visual no HUD**: Badge animado ao lado do Caps Lock avisando `Acento: Til ( ~ ) (digite a vogal)`.

---

## 📁 3. Mapa de Arquivos-Chave do ByteQuest

```
src/
├── types/
│   └── byteQuest.ts                # Modelagem de dados: Chefes, Biomas, Câmaras, HomingMissiles, Subclasses, Chips de IA
├── data/
│   ├── byteQuestWords.ts           # Vocabulário pedagógico graduado por tier e dificuldade
│   └── byteQuestItems.ts           # Definições de armas, armaduras, anéis e forja
├── utils/
│   └── keyboardAccents.ts          # Normalização de ABNT2/US-Intl, resolução de Dead Keys e tabela de combinação
└── components/games/bytequest/
    ├── ByteQuestGame.tsx           # Orquestrador React, listeners de teclado (Setas, Espaço, Digitação, Til/Dead Keys)
    ├── byteQuestEngine.ts          # Motor de simulação: física 60 FPS, câmera Lerp, IA de chefes teleguiados, matchChars
    ├── ByteQuestArenaCanvas.tsx    # Renderizador Canvas 2D: mapa 5000x3600, biomas, iluminação, shockwaves, partículas
    ├── ByteQuestHUD.tsx            # Interface de combate: HP, Energia, Foco, Bioma, Câmara, Boss Bar, Badge de Acento
    ├── ByteQuestLobby.tsx          # Menu inicial didático: seleção de classe, abas flutuantes, talentos e chips de IA
    ├── ByteQuestHeroCanvas.tsx     # Renderizador procedural do avatar do herói (poses de ataque, recuo de arco, magias)
    ├── ByteQuestUpgradeModal.tsx   # Modal de cartas de upgrade por nível
    ├── ByteQuestRewardModal.tsx    # Tela de fim de partida (recompensas, vitórias e modo infinito)
    └── byteQuestAudio.ts           # Síntese sonora procedural com Web Audio API pura (sem arquivos mp3/ogg)
```

---

## 💻 4. Guia Rápido de Sincronização (Desktop ↔ Notebook)

### No Desktop (para enviar as alterações):
```bash
# 1. Verificar arquivos alterados
git status

# 2. Adicionar todas as mudanças
git add .

# 3. Criar commit descritivo
git commit -m "feat(bytequest): expand map to 5000x3600, homing boss mechanics, dead key accent fix and lobby overhaul"

# 4. Enviar para o GitHub
git push origin main
```

### No Notebook (ao abrir para continuar o trabalho):
```bash
# 1. Navegar até a pasta do projeto
cd ~/Code/TypeClicker   # ou o caminho no seu notebook

# 2. Puxar as atualizações
git pull origin main

# 3. Instalar novas dependências (se houver)
npm install

# 4. Validar compilação do TypeScript
npx tsc --noEmit

# 5. Iniciar o servidor de desenvolvimento
npm run dev
```

---

## 🎯 5. Próximos Passos Sugeridos no Notebook

1. **Sprite Engine e Assets (Opcional/Futuro)**:
   - Foram iniciados os arquivos de suporte a sprites (`byteQuestSpriteEngine.ts`, `ByteQuestPixiArena.tsx`), que podem ser ativados gradualmente caso se queira testar renderização pixel art além do Canvas 2D procedural atual.
2. **Novos Padrões de Ataque para o Chefe da Forja e do Núcleo**:
   - Ajustar e customizar os projéteis específicos de cada bioma (ex: fendas de magma teleguiadas na Forja de Silício).
3. **Persistência em Nuvem (Supabase)**:
   - Expandir a gravação das estatísticas de câmara concluída e tormento no perfil do usuário no Supabase para exibição no ranking de turmas.

---
*Documento gerado automaticamente para continuidade de desenvolvimento.*
