// ─────────────────────────────────────────────────────────────
// Gerador Procedural de Labirintos Solúveis — ScratchBot
// Garante sempre existência de rota livre usando BFS / Random Walk
// ─────────────────────────────────────────────────────────────
import { GridCoord, RobotDirection, ScratchLevelDef } from '../../../types/scratchBot';

function coordEquals(a: GridCoord, b: GridCoord): boolean {
  return a.x === b.x && a.y === b.y;
}

function coordKey(c: GridCoord): string {
  return `${c.x},${c.y}`;
}

export function generateProceduralLevel(seedNumber: number): ScratchLevelDef {
  // Dificuldade cresce com a semente
  const stage = Math.max(1, seedNumber);
  const size = Math.min(8, 5 + Math.floor(stage / 3)); // 5x5 até 8x8
  const width = size;
  const height = size;

  const startPos: GridCoord = { x: 0, y: height - 1 };
  const targetPos: GridCoord = { x: width - 1, y: 0 };
  const startDir: RobotDirection = 'UP';

  // 1. Gera um caminho garantido do início ao fim usando Random Walk direcionado
  const pathCoords: GridCoord[] = [{ ...startPos }];
  let current: GridCoord = { ...startPos };

  while (!coordEquals(current, targetPos)) {
    const moves: GridCoord[] = [];
    // Favorece avançar em direção ao target (x crescente, y decrescente)
    if (current.x < targetPos.x) moves.push({ x: current.x + 1, y: current.y });
    if (current.y > targetPos.y) moves.push({ x: current.x, y: current.y - 1 });
    // Pequena chance de movimento alternativo se tiver espaço
    if (moves.length === 0 || Math.random() < 0.25) {
      if (current.x > 0) moves.push({ x: current.x - 1, y: current.y });
      if (current.y < height - 1) moves.push({ x: current.x, y: current.y + 1 });
    }

    // Escolhe um movimento válido não visitado recentemente
    const validMoves = moves.filter((m) => !pathCoords.some((p) => coordEquals(p, m)));
    const chosen = validMoves.length > 0
      ? validMoves[Math.floor(Math.random() * validMoves.length)]
      : moves[Math.floor(Math.random() * moves.length)];

    current = chosen;
    pathCoords.push({ ...current });

    // Proteção contra loops excessivos
    if (pathCoords.length > width * height * 2) {
      break;
    }
  }

  // 2. Preenche obstáculos aleatórios fora do caminho da solução
  const pathSet = new Set(pathCoords.map(coordKey));
  pathSet.add(coordKey(startPos));
  pathSet.add(coordKey(targetPos));

  const obstacles: GridCoord[] = [];
  const obstacleDensity = Math.min(0.35, 0.15 + stage * 0.02);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const coord = { x, y };
      if (!pathSet.has(coordKey(coord))) {
        if (Math.random() < obstacleDensity) {
          obstacles.push(coord);
        }
      }
    }
  }

  // 3. Adiciona gemas no meio do caminho a partir do nível 3
  const gems: GridCoord[] = [];
  if (stage >= 3 && pathCoords.length > 4) {
    const numGems = Math.min(3, 1 + Math.floor(stage / 4));
    const step = Math.floor(pathCoords.length / (numGems + 1));
    for (let i = 1; i <= numGems; i++) {
      const gCoord = pathCoords[i * step];
      if (gCoord && !coordEquals(gCoord, startPos) && !coordEquals(gCoord, targetPos)) {
        gems.push({ ...gCoord });
      }
    }
  }

  // 4. Estimativa de estrelas
  const pathLen = pathCoords.length;
  const maxBlocks3 = Math.max(5, Math.ceil(pathLen * 0.7) + (gems.length > 0 ? 3 : 0));
  const maxBlocks2 = Math.ceil(maxBlocks3 * 1.5);

  return {
    id: 1000 + stage,
    title: `Desafio Procedural #${stage}`,
    subtitle: `Setor Algorítmico ${width}x${height}`,
    description: `Circuito gerado proceduralmente com semente ${seedNumber}. Encontre o caminho até o portal!`,
    tip: 'Observe as curvas necessárias e agrupe passos iguais com laços de repetição.',
    gridSize: { width, height },
    startPos,
    startDir,
    targetPos,
    obstacles,
    gems: gems.length > 0 ? gems : undefined,
    maxBlocksFor3Stars: maxBlocks3,
    maxBlocksFor2Stars: maxBlocks2,
    baseRewardBytes: 150 + stage * 50,
    availableBlockTypes: [
      'move_forward',
      'turn_left',
      'turn_right',
      'repeat',
      ...(stage >= 3 ? (['collect_gem'] as const) : []),
    ],
  };
}
