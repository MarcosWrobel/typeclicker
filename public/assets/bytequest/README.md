# Diretório de Spritesheets & Assets — ByteQuest

Este diretório armazena os **Spritesheets e Atlas de Texturas** carregados pelo `ByteQuestSpriteManager` via PixiJS v8.

## Como adicionar novos sprites:

### 1. Formato Aseprite / TexturePacker (JSON + PNG)
Exporte suas animações no formato **JSON Array** ou **JSON Hash** do Aseprite/TexturePacker:
- `hero_warrior.png` e `hero_warrior.json`
- `goblin.png` e `goblin.json`
- `skeleton.png` e `skeleton.json`

### 2. Estrutura recomendada de animações no JSON:
O `ByteQuestSpriteManager` reconhece automaticamente as seguintes tags de animação:
- `"idle"`: Animação parada respirando
- `"walk"` ou `"run"`: Animação de caminhada/corrida
- `"attack"`: Animação de ataque/golpe
- `"hurt"`: Animação de dano sofrido
- `"death"`: Animação de derrota/morte

### 3. Como registrar no jogo:
Basta invocar no seu carregador:
```ts
await spriteManager.loadSpritesheet('hero_warrior', '/assets/bytequest/hero_warrior.json');
```

Enquanto um spritesheet não for carregado, o PixiJS utiliza automaticamente o **fallback gráfico vetorial procedural** do `ByteQuestSpriteManager`.
