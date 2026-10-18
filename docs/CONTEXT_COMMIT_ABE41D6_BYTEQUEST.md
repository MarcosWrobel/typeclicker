# Contexto do Commit: `feat(bytequest)` (abe41d6)

**Commit Hash:** `abe41d6d514fef5434446697c95add3d29544a81`  
**Data:** 14 de Outubro de 2026  
**Mensagem:** `feat(bytequest): implement ByteQuest roguelite combat runner with 360 combat and game feel`  
**Status do Build:** ✅ `npm run build` e `npx tsc --noEmit` compilam com 0 erros.

---

## 1. Visão Geral da Mudança

O commit introduziu a versão completa e jogável do **`ByteQuest`**, um *roguelite combat runner* em tempo real estilo survivor no Canvas 2D (60 FPS) integrado como jogo plug-in no TypeClicker (obedecendo estritamente ao contrato canônico [`BaseGameProps`](file:///home/marcoswrobel/Code/TypeClicker/src/types/gamePlugin.ts) e [`onExitToHub`](file:///home/marcoswrobel/Code/TypeClicker/src/types/gamePlugin.ts#L30)).

O jogo mescla jogabilidade arcade em tempo real (movimentação livre WASD/Setas, esquiva de hordas e ataques por classe) com digitação pedagógica de precisão focada em alvos estratégicos (Inimigos de Elite e Chefões de Onda).

---

## 2. Arquivos Envolvidos e Suas Responsabilidades

| Arquivo | Papel / Responsabilidade |
|---|---|
| [`src/types/byteQuest.ts`](file:///home/marcoswrobel/Code/TypeClicker/src/types/byteQuest.ts) | Modelagem de tipos completa: atributos de RPG, equipamentos, tipos de inimigos (`slime`, `skeleton`, `gargoyle`, `miniboss`, `boss`), feitiços de comando (`SpellDefinition`), cartas de upgrade roguelite (`RunUpgradeCard`), projéteis, shockwaves e partículas. |
| [`src/components/games/bytequest/byteQuestEngine.ts`](file:///home/marcoswrobel/Code/TypeClicker/src/components/games/bytequest/byteQuestEngine.ts) | Motor lógico de simulação isolado de UI (`ByteQuestSimulation`). Gerencia o loop de 60 FPS com delta time, spawning procedural de ondas e hordas, detecção de colisão com círculos/obstáculos, sistema de combo, pulso de shockwaves, knockback, coleta de gemas de XP e mecânica de digitação para Elites/Chefões. |
| [`src/components/games/bytequest/ByteQuestArenaCanvas.tsx`](file:///home/marcoswrobel/Code/TypeClicker/src/components/games/bytequest/ByteQuestArenaCanvas.tsx) | Renderizador Canvas 2D de alta performance. Desenha o piso rúnico com pedras medievais, pilares e obeliscos de colisão, herói com sombras e efeitos de classe (golpe giratório de guerreiro, disparos de flecha de arqueiro, projéteis arcanos de mago), projéteis, gemas gravitacionais, shockwaves, partículas e textos flutuantes de dano crítico. |
| [`src/components/games/bytequest/ByteQuestHUD.tsx`](file:///home/marcoswrobel/Code/TypeClicker/src/components/games/bytequest/ByteQuestHUD.tsx) | HUD responsivo com barra de vida do herói, barra de XP/nível, energia/mana, relógio de sobrevivência em tempo real acoplado a rAF (evitando re-renders desnecessários de React), barra de combo de digitação e slots de feitiço com atalhos de comando (`/furia`, `/chuva`, `/meteoro`, etc.). |
| [`src/components/games/bytequest/ByteQuestLobby.tsx`](file:///home/marcoswrobel/Code/TypeClicker/src/components/games/bytequest/ByteQuestLobby.tsx) | Tela pré-jogo permitindo a escolha de classe (Guerreiro, Mago, Arqueiro), visualização de stats, inventário/equipamentos e forja de aprimoramento com Bytes. |
| [`src/components/games/bytequest/ByteQuestUpgradeModal.tsx`](file:///home/marcoswrobel/Code/TypeClicker/src/components/games/bytequest/ByteQuestUpgradeModal.tsx) | Modal de level-up roguelite exibindo 3 cartas aleatórias de bônus (dano, velocidade, orbes orbitais, ímã de gemas, redução de recarga, etc.). |
| [`src/components/games/bytequest/ByteQuestRewardModal.tsx`](file:///home/marcoswrobel/Code/TypeClicker/src/components/games/bytequest/ByteQuestRewardModal.tsx) | Tela de fim de partida (vitória ou derrota) com resumo de monstros abatidos, tempo sobrevivido, precisão de digitação, XP, Bytes acumulados e retorno seguro ao Hub. |
| [`src/components/games/bytequest/byteQuestAudio.ts`](file:///home/marcoswrobel/Code/TypeClicker/src/components/games/bytequest/byteQuestAudio.ts) | Sintetizador de áudio procedural puramente via Web Audio API (`AudioContext` e osciladores nativos — sem arquivos externos `.mp3` ou `.ogg`), com efeitos sonoros de lâmina, arco, cajado arcano, explosões de feitiço, impacto de dano, pulso rúnico e level-up. |
| [`src/data/byteQuestWords.ts`](file:///home/marcoswrobel/Code/TypeClicker/src/data/byteQuestWords.ts) | Vocabulário pedagógico categorizado por termos de programação, algoritmos e computação para a digitação de Elites e Chefões. |
| [`src/data/gameCatalog.ts`](file:///home/marcoswrobel/Code/TypeClicker/src/data/gameCatalog.ts) | Registro oficial do card do `ByteQuest` no catálogo de jogos da plataforma. |
| [`src/App.tsx`](file:///home/marcoswrobel/Code/TypeClicker/src/App.tsx) | Montagem dinâmica do jogo no Hub com normalização de Bytes ganhos (`bytesEarned`), concede `levelTokens` se a acurácia for >= 80% e persiste o progresso de sessão. |

---

## 3. Arquitetura e Decisões de Design no Commit

1. **Separação Rígida entre Motor (Engine) e Apresentação (Canvas/React)**:
   - Toda a física de colisão, perseguição de inimigos e cálculo de vetores roda dentro de `ByteQuestSimulation` via `requestAnimationFrame`.
   - O React é utilizado apenas para estados de macro-fluxo (`lobby` → `playing` → `upgradeModal` → `reward`) e renderização da HUD/Modais.
2. **Pedagogia e Game Feel Integrados**:
   - Para evitar poluição visual com dezenas de palavras na tela simultaneamente, apenas **Elites e Chefões** exibem palavras para digitação. Monstros comuns morrem com os ataques de área e projéteis da classe.
   - Digitar corretamente palavras de chefões causa acertos críticos garantidos e ativa habilidades de recarga rápida de energia/mana.
3. **Zero Assets Externos**:
   - Todos os gráficos são vetoriais desenhados via Canvas 2D API (`ctx.arc`, `ctx.beginPath`, gradientes dinâmicos).
   - Todos os áudios são osciladores procedurais com envelope de ganho (`gainNode.exponentialRampToValueAtTime`).
4. **Persistência Local e Integração ao Hub**:
   - Loadout, inventário e estatísticas históricas do minigame persistem em `localStorage` sob a chave `bytequest_progress_v1`.
   - Ao encerrar a sessão, `onExitToHub` envia métricas consolidadas (WPM, acurácia, pontuação e bytes ganhos).

---

## 4. Oportunidades Imediatas de Continuidade

Com o motor central e a jogabilidade 360° finalizados e funcionais, os próximos passos naturais para enriquecer o `ByteQuest` ou o ecossistema incluem:

1. **Sons para Feitiços Avançados**: Adicionar timbres dedicados no `byteQuestAudio.ts` para magias de congelamento e muralha de fogo.
2. **Poderes Passivos Específicos de Equipamentos**: Ativar efeitos especiais ao equipar itens raros/épicos da forja (ex: chance de relâmpago em acertos críticos).
3. **Integração com Ranking de Turma**: Registrar a onda máxima (`highestWave`) e o tempo de sobrevivência no `public.game_progress` do Supabase para visualização no ranking de alunos.
4. **Tarefas Pendentes do Backlog Global**:
   - Divisão do `AdminPanel.tsx` (>2.500 linhas).
   - Ativação do RLS seguro no Supabase.
   - Isolamento com Web Worker / sandbox no `ProgPlay`.
