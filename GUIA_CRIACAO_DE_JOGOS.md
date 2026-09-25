# Guia de Criação de Jogos — Educa GameHub
### Colégio Estadual Leopoldina Bittencourt Pedroso
**Versão 2.1 — Setembro 2026 | Para uso no AI Studio**

---

## Como usar este guia

Cole o conteúdo das seções **2, 3 e 4** como prompt no AI Studio junto com a sua ideia de jogo. O modelo vai gerar um componente React pronto para entrar na plataforma.

> **Regra de ouro:** o jogo que você criar vai rodar dentro da plataforma TypeClicker que seus colegas já usam. O código precisa se encaixar sem quebrar nada. Siga o contrato à risca.

---

## 1. O que é a plataforma e onde seu jogo vai entrar

A plataforma TypeClicker roda em `typeclicker-leopoldina.ai.studio`. Ela tem um **Hub** central que exibe cards de jogos. Quando o aluno clica em um card, o jogo abre em tela cheia. Quando o jogo termina, ele devolve os dados para o Hub (bytes, fichas, estatísticas) e o Hub salva tudo.

**Jogos já existentes na plataforma:**
- `typeclicker` — jogo principal de digitação (não modificar)
- `type_radar` — torre de defesa com digitação (não modificar)
- `byte_logic`, `math_storm`, `syntax_maze` — jogos criados pelo professor (não modificar)

**Você, como aluno, cria um jogo novo com tema e nome à sua escolha.**  
O professor define o `GameId` e faz a integração no Hub após avaliar o seu componente. Todos os jogos de alunos são carregados via **Lazy Loading** (`React.lazy`). Isso significa que bibliotecas pesadas usadas no seu jogo não deixam a plataforma lenta para os outros alunos.

---

## 2. Stack obrigatória (copie este bloco no prompt do AI Studio)

```
Stack tecnológica disponível — use APENAS o que está listado abaixo:

BASE DO SISTEMA:
- React 19 com hooks (useState, useEffect, useRef, useCallback)
- TypeScript ~5.8 com tipagem estrita
- Tailwind CSS 4 (classes utilitárias inline, sem CSS externo)
- Web Audio API nativa do browser (sem arquivos .mp3 ou .ogg)

BIBLIOTECAS VISUAIS (Já instaladas):
- motion/react (animações — import de "motion/react")
- canvas-confetti (vitória — import confetti from 'canvas-confetti')
- lucide-react (ícones — import { Trophy, ArrowLeft } from 'lucide-react')

FERRAMENTAS AVANÇADAS PERMITIDAS (Podem ser usadas livremente):
- @monaco-editor/react: Para criar desafios de programação e editores de código in-game.
- recharts: Para criar gráficos dinâmicos (jogos de lógica de dados, estatística).
- react-markdown: Para renderizar textos ricos, dicas ou histórias de RPG.

NÃO use:
- Nenhum pacote npm além dos listados acima.
- Imagens externas, fontes de CDN, fetch para APIs.
- import de firebaseService, db, setDoc, getDoc ou qualquer Firebase.
- localStorage ou sessionStorage dentro do jogo (o Hub cuida do save).
```

---

## 3. Contrato de plug-in (copie este bloco COMPLETO no prompt)

Este é o arquivo real que já existe no repositório em `src/types/gamePlugin.ts`. Seu jogo deve usar exatamente estas interfaces — não invente variações.

```typescript
// src/types/gamePlugin.ts — NÃO MODIFIQUE ESTE ARQUIVO

export type StudentRpgClass = 'warrior' | 'archer' | 'mage';

// Métricas brutas que o seu jogo preenche ao encerrar.
// O Hub calcula os bytes finais — você só informa os dados brutos.
export interface GameSessionStats {
  score: number;               // Pontuação interna do jogo (escala livre)
  accuracyPercentage: number;  // Acurácia [0–100]
  timeSpentSeconds: number;    // Duração da sessão em segundos
  correctAnswers: number;      // Total de acertos
  wrongAnswers: number;        // Total de erros
  levelReached?: number;       // Fase/nível atingido (opcional)
  extraMetrics?: Record<string, number | string>; // Dados extras livres
}

// O que o seu jogo entrega ao Hub quando termina.
// bytesEarned é uma SUGESTÃO — o Hub pode recortar se for alto demais.
export interface GameExitPayload {
  bytesEarned: number;          // Sugestão de bytes (use: score × 0.15)
  levelTokensEarned?: number;   // Fichas cosméticas (só se acurácia >= 80%)
  duelTokensEarned?: number;    // Moedas de duelo (só para modo versus)
  sessionStats: GameSessionStats;
}

// Props que o Hub injeta no seu componente.
// Seu componente DEVE aceitar exatamente estas props.
export interface BaseGameProps {
  studentClass?: StudentRpgClass;    // Classe RPG do aluno
  difficultyMultiplier?: number;     // 0.8 fácil | 1.0 normal | 1.25 desafiador
  onExitToHub: (payload: GameExitPayload) => void; // Única saída do jogo
}
```

---

## 4. Sintetizador de áudio (copie este bloco no prompt)

Não use arquivos de som externos. Use esta classe para criar sons via código:

```typescript
// Cole este utilitário no seu arquivo index.tsx
class GameAudio {
  private static ctx: AudioContext | null = null;

  private static getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  // Som de acerto (tom ascendente)
  static playSuccess(): void {
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  // Som de erro (tom descendente áspero)
  static playError(): void {
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  // Limpeza obrigatória no unmount do componente
  static cleanup(): void {
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
  }
}
```

---

## 5. Template completo para o AI Studio

Cole o bloco abaixo como prompt, substituindo `[DESCREVA SEU JOGO AQUI]`:

```
Você é um desenvolvedor React 19 + TypeScript criando um minijogo educacional
para a plataforma TypeClicker do Colégio Leopoldina.

IDEIA DO JOGO:
[DESCREVA SEU JOGO AQUI]
Exemplos de ideia: "Quiz de matemática com 10 perguntas e tempo limite de 30s por pergunta",
"Jogo de ordenar etapas do algoritmo de seleção por bolha", "Adivinhe o comando Git".

REGRAS INVIOLÁVEIS:
1. O componente principal se chama com o nome do jogo em PascalCase e fica em
   src/components/games/<nome-do-jogo>/index.tsx
2. Ele importa e implementa BaseGameProps de '../../../types/gamePlugin'
3. onExitToHub(payload) é chamado UMA vez ao final, seja por vitória, derrota ou botão "Voltar"
4. bytesEarned = Math.round(score × 0.15) — não invente outra fórmula
5. levelTokensEarned = sessionStats.accuracyPercentage >= 80 ? 1 : 0
6. TODO requestAnimationFrame, setInterval, setTimeout cancelados no cleanup do useEffect
7. GameAudio.cleanup() chamado no cleanup do useEffect
8. window.removeEventListener para todos os listeners globais no cleanup
9. Zero imports de firebaseService, db, setDoc, getDoc
10. Zero arquivos externos: sem .mp3, .ogg, imagens de URL, fontes remotas
11. Tailwind CSS para estilo — fundo escuro (#0e1013 ou slate-950), texto claro
12. Botão "Voltar ao Hub" no topo esquerdo com ícone ArrowLeft do lucide-react
13. Bônus da classe RPG:
    - warrior: +20% em bytesEarned se score > 50% do máximo possível
    - archer: score bonus se wrongAnswers === 0 (perfection streak)
    - mage: exibir dica extra antes de cada pergunta/fase

INTERFACES OBRIGATÓRIAS (copie como estão):

[Cole aqui o conteúdo da Seção 3 e da Seção 4 do guia]

ESTRUTURA ESPERADA DO ARQUIVO:

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Trophy, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BaseGameProps, GameExitPayload, GameSessionStats } from '../../../types/gamePlugin';

// [GameAudio class aqui]

// [Interfaces e dados do jogo aqui]

export const MeuJogo: React.FC<BaseGameProps> = ({
  studentClass = 'warrior',
  difficultyMultiplier = 1.0,
  onExitToHub,
}) => {
  // [Estados do jogo]
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    return () => {
      // OBRIGATÓRIO: limpar todos os recursos
      GameAudio.cleanup();
    };
  }, []);

  const handleExit = useCallback((won: boolean) => {
    const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    // [Calcule score, correctAnswers, wrongAnswers aqui]
    const accuracy = ...; // [0–100]
    const score = ...;
    const bytesBase = Math.round(score * 0.15);
    const classBonus = studentClass === 'warrior' && score > MAX_SCORE * 0.5 ? 1.2 : 1.0;

    const payload: GameExitPayload = {
      bytesEarned: Math.round(bytesBase * classBonus * difficultyMultiplier),
      levelTokensEarned: accuracy >= 80 ? 1 : 0,
      sessionStats: {
        score,
        accuracyPercentage: accuracy,
        timeSpentSeconds: elapsed,
        correctAnswers: ...,
        wrongAnswers: ...,
        levelReached: ...,
      },
    };
    onExitToHub(payload);
  }, [...]);

  return (
    <div className="flex flex-col h-full w-full min-h-screen bg-[#0e1013] text-slate-100 p-4 select-none">
      {/* Barra superior */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
        <button
          onClick={() => handleExit(false)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-sm font-medium transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          Voltar ao Hub
        </button>
        {/* [Placar, tempo, etc.] */}
      </div>
      {/* [Conteúdo principal] */}
    </div>
  );
};
```

---

## 6. O que o professor faz depois que você entrega o jogo

Você entrega o arquivo `index.tsx` finalizado. O professor faz as seguintes alterações no repositório para conectar o jogo ao hub **usando Lazy Loading**:

**Passo 1 — `src/types/gamePlugin.ts`:** adiciona o ID do seu jogo (definido pelo professor) ao tipo `GameId`.
```typescript
export type GameId =
  | 'typeclicker'
  | 'type_radar'
  | 'byte_logic'
  | 'math_storm'
  | 'syntax_maze'
  | 'nome_do_seu_jogo'; // ← professor adiciona aqui
```

**Passo 2 — `src/App.tsx`:** importa o jogo preguiçosamente e cria o bloco de renderização com `Suspense`:
```typescript
import { Suspense, lazy } from 'react';

// Import preguiçoso para não pesar a plataforma
const NomeDoSeuJogo = lazy(() => import('./components/games/nome_do_seu_jogo'));

// No corpo principal:
if (selectedGame === 'nome_do_seu_jogo') {
  return (
    <Suspense fallback={<div className="text-emerald-400 p-10 text-center font-mono animate-pulse">Carregando Jogo...</div>}>
      <NomeDoSeuJogo
        studentClass={state.rpgClass}
        difficultyMultiplier={1.0}
        onExitToHub={(payload) => {
          const finalBytes = payload.bytesEarned;
          setState(prev => ({
            ...prev,
            bytes: prev.bytes + finalBytes,
            totalBytesEarned: prev.totalBytesEarned + finalBytes,
            cosmetics: payload.levelTokensEarned ? {
              ...prev.cosmetics,
              levelTokens: (prev.cosmetics?.levelTokens ?? 0) + payload.levelTokensEarned,
            } : prev.cosmetics,
          }));
          setSelectedGame(null);
        }}
      />
    </Suspense>
  );
}
```

**Passo 3 — `src/components/GameSelectionScreen.tsx`:** adiciona o card do jogo na lista de jogos.

**Passo 4 — Painel Admin:** habilita o jogo em **Configuração do Hub → Jogos ativos**.

---

## 7. Checklist antes de entregar

Revise cada item antes de passar o código para o professor:

- [ ] Compila sem erros de TypeScript (peça ao AI Studio para verificar)
- [ ] O componente exportado (`export const MeuJogo`) tem nome em PascalCase
- [ ] Props seguem `BaseGameProps` — sem props extras obrigatórias
- [ ] `onExitToHub(payload)` é chamado em TODOS os caminhos de saída (vitória, derrota, botão voltar)
- [ ] `bytesEarned` = `Math.round(score × 0.15 × difficultyMultiplier × classBônus)`
- [ ] `levelTokensEarned` = `accuracy >= 80 ? 1 : 0` (nunca mais que 2)
- [ ] Nenhum import de Firebase no arquivo
- [ ] Nenhum `fetch`, `axios` ou chamada de rede
- [ ] Nenhum arquivo `.mp3`, `.ogg`, imagem de URL
- [ ] `GameAudio.cleanup()` está no `return` do `useEffect` principal
- [ ] Todos os `setInterval` / `setTimeout` têm `clearInterval` / `clearTimeout` no cleanup
- [ ] Todos os `requestAnimationFrame` têm `cancelAnimationFrame` no cleanup
- [ ] Todos os `window.addEventListener` têm `window.removeEventListener` no cleanup
- [ ] Botão "Voltar ao Hub" presente no topo esquerdo
- [ ] Interface visual com fundo escuro (não use fundo branco)
- [ ] Tela de resultado mostrando pontuação e acurácia antes de chamar `onExitToHub`

---

## 8. Exemplo de prompt completo para o AI Studio

```
Você é um desenvolvedor React 19 + TypeScript criando um minijogo educacional
para a plataforma TypeClicker do Colégio Leopoldina.

IDEIA DO JOGO:
Desafio de Refatoração de Código usando @monaco-editor/react. O jogo exibe 
um código cheio de más práticas. O aluno deve editar o código para limpá-lo. 
Quando o aluno clica em "Verificar", o jogo avalia o conteúdo usando Regex 
e dá uma pontuação.

[Cole aqui as seções 2, 3 e 4 deste guia]

[Cole aqui a estrutura esperada da seção 5]

Gere o arquivo completo src/components/games/refactor_hero/index.tsx.
O nome do componente exportado deve ser RefactorHeroGame.
O professor vai definir o GameId final na hora de integrar ao hub.
```

---

*Dúvidas? Fale com o professor antes de começar a codar.*  
*Repositório: `typeclicker-leopoldina.ai.studio` · Plataforma: Educa GameHub*
