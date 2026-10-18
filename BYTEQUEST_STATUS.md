# 🏰 BYTEQUEST — Status de Desenvolvimento & Contexto de Continuidade

> **Data de Atualização**: 18 de Outubro de 2026  
> **Status de Compilação**: ✅ `npm run build` e `npx tsc --noEmit` código 0 (Zero erros)  
> **Branch**: `main`  
> **Documento Principal de Continuidade**: Consulte também [`contexto.md`](file:///home/marcoswrobel/Code/TypeClicker/contexto.md) na raiz do projeto.

---

## 🎮 1. O Que É o ByteQuest?
O **ByteQuest** é um jogo oficial integrado ao ecossistema **TypeClicker**.  
Trata-se de um *Roguelite Combat Runner* inspirado na dinâmica de *Vampire Survivors*, com foco em:
- **Combate de Ação Contínuo a 60 FPS** em Canvas 2D em um mundo de **5000 x 3600 pixels**.
- **Câmera Suave Lerp** que acompanha o herói dinamicamente.
- **3 Biomas Dinâmicos**: Cripta de Dados (`crypt`), Forja de Silício (`forge`) e Núcleo Quântico (`quantum_core`).
- **Sistema de Câmaras & Chefões Desafiadores**: Chefes com habilidades teleguiadas e combate híbrido que mescla digitação tática com combate automático.
- **Diferenciação Forte de Classes RPG & Subclasses**: Guerreiro (Paladino/Berserker), Arqueiro (Franco-Atirador/Caçador), Mago (Piromante/Cronotécnico).
- **Foco Tático (Bullet Time)**: Desaceleração do tempo ao digitar alvos para precisão ergonômica.
- **Ações de Esquiva com Espaço**: Investida, Dash evasivo e Teleporte.
- **Suporte Nativo a Teclas Mortas e Til (`~`)**: Composição de acentos em teclados ABNT2/US-Intl e tolerância inteligente de digitação no motor.

---

## 📂 2. Estrutura de Arquivos

```
src/
├── types/
│   ├── byteQuest.ts                # Modelos de Inimigos, Chefes, Biomas, Câmaras, HomingMissiles, Subclasses, Chips
│   └── gamePlugin.ts               # Contrato canônico BaseGameProps
├── data/
│   ├── byteQuestWords.ts           # Banco de palavras de programação/computação graduadas por nível
│   ├── byteQuestItems.ts           # Equipamentos, armas, anéis e forja
│   └── gameCatalog.ts              # Metadados e card do ByteQuest no Hub
├── utils/
│   └── keyboardAccents.ts          # Resolução de Dead Keys e composição ABNT2/US-Intl
└── components/games/bytequest/
    ├── ByteQuestGame.tsx           # Orquestrador principal (Lobby ↔ Arena ↔ Recompensas, Dead Keys e acentuação)
    ├── ByteQuestLobby.tsx          # Menu inicial didático com modais flutuantes (Arsenal, Talentos, Chips, Dificuldade)
    ├── ByteQuestArenaCanvas.tsx    # Loop gráfico Canvas 2D a 60 FPS (Mundo 5000x3600, Câmera Lerp, Biomas, Chefes)
    ├── ByteQuestHUD.tsx            # Interface HUD: HP, Energia, Foco, Bioma, Boss Bar e Badge de Acento Pendente
    ├── ByteQuestUpgradeModal.tsx   # Modal de escolha de cartas de upgrade ao subir de nível
    ├── ByteQuestRewardModal.tsx    # Modal de fim de partida (recompensas em XP, Bytes e conquistas)
    ├── ByteQuestHeroCanvas.tsx     # Renderizador procedural das poses do Bytezinho estilizado por classe
    ├── byteQuestEngine.ts          # Motor de simulação física, colisão, IA de chefes teleguiados e matchChars
    └── byteQuestAudio.ts           # Síntese sonora procedural pura com Web Audio API
```

---

## 🚀 3. Principais Alterações Concluídas

1. **Mundo Expandido (5000x3600)** com Câmera Lerp suave e container de visualização de 1000x640px.
2. **Biomas e Câmaras**: Cripta de Dados, Forja de Silício e Núcleo Quântico com portais de salto de ativação digitada.
3. **Chefes Épicos com Homing Missiles**: Mísseis que curvam em perseguição ao herói e zonas de perigo no chão. O combate automático causa dano constante, e digitar palavras no chefe quebra escudos e atordoa.
4. **Bullet Time (Foco Tático)**: Câmera lenta ativada ao digitar alvos com medidor de foco.
5. **Ação de Mobilidade no Espaço**: Dash no Arqueiro, Teleporte no Mago e Investida no Guerreiro.
6. **Santuários e Terminais Híbridos**: Pontos de interesse espalhados pelo mapa ativados por digitação.
7. **Subclasses, Chips de IA e Níveis de Tormento**: Customização profunda de build no Lobby.
8. **Redesign do Lobby & HUD**: Modais flutuantes sobrepostos, instruções de controles movidas para fora do canvas e fim da sobreposição entre a barra de chefe e os combos.
9. **Correção de Acentos e Tecla `~` (Til)**: Suporte completo a ABNT2/Dead keys, composição de acento pendente, tolerância `matchChars` no motor e badge visual no HUD.
