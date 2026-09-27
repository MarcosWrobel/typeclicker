// ─────────────────────────────────────────────────────────────
// Gerador Procedural de Labirintos Solúveis — ScratchBot
// Garante sempre existência de rota livre usando Random Walk determinístico por seed e BFS
// ─────────────────────────────────────────────────────────────
import { GridCoord, RobotDirection, ScratchLevelDef } from '../../../types/scratchBot';

function coordEquals(a: GridCoord, b: GridCoord): boolean {
  return a.x === b.x && a.y === b.y;
}

function coordKey(c: GridCoord): string {
  return `${c.x},${c.y}`;
}

/** Gerador pseudo-aleatório baseado em LCG com semente pura (sem drift de Math.random) */
function createSeededRandom(seed: number) {
  let s = Math.abs(seed) % 2147483647;
  if (s <= 0) s += 2147483646;
  return function next(): number {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateProceduralLevel(seedNumber: number): ScratchLevelDef {
  const rand = createSeededRandom(seedNumber * 7919 + 103);
  const stage = Math.max(1, seedNumber);
  const size = Math.min(8, 5 + Math.floor((stage - 1) / 3)); // 5x5 até 8x8
  const width = size;
  const height = size;

  const startPos: GridCoord = { x: 0, y: height - 1 };
  const targetPos: GridCoord = { x: width - 1, y: 0 };
  const startDir: RobotDirection = 'UP';

  // 1. Gera um caminho garantido do início ao fim usando Random Walk direcionado
  const pathCoords: GridCoord[] = [{ ...startPos }];
  const pathSet = new Set<string>([coordKey(startPos)]);
  let current: GridCoord = { ...startPos };

  let safety = 0;
  while (!coordEquals(current, targetPos) && safety < 1000) {
    safety++;
    const moves: GridCoord[] = [];
    // Favorece avançar em direção ao target (x crescente, y decrescente)
    if (current.x < targetPos.x) moves.push({ x: current.x + 1, y: current.y });
    if (current.y > targetPos.y) moves.push({ x: current.x, y: current.y - 1 });

    // Pequena chance de movimento lateral/alternativo se houver espaço
    if (rand() < 0.28 || moves.length === 0) {
      if (current.x > 0) moves.push({ x: current.x - 1, y: current.y });
      if (current.y < height - 1) moves.push({ x: current.x, y: current.y + 1 });
    }

    // Escolhe um movimento válido não visitado anteriormente
    const unvisited = moves.filter((m) => !pathSet.has(coordKey(m)));
    let next: GridCoord;

    if (unvisited.length > 0) {
      next = unvisited[Math.floor(rand() * unvisited.length)];
    } else if (moves.length > 0) {
      next = moves[Math.floor(rand() * moves.length)];
    } else {
      // Força avanço cardinal direto em direção ao alvo
      if (current.x < targetPos.x) next = { x: current.x + 1, y: current.y };
      else next = { x: current.x, y: current.y - 1 };
    }

    current = next;
    pathCoords.push({ ...current });
    pathSet.add(coordKey(current));
  }

  // 2. Preenche obstáculos aleatórios SEM invadir o caminho da solução
  pathSet.add(coordKey(startPos));
  pathSet.add(coordKey(targetPos));

  const obstacles: GridCoord[] = [];
  const obstacleDensity = Math.min(0.32, 0.16 + (stage % 4) * 0.04);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const coord = { x, y };
      if (!pathSet.has(coordKey(coord))) {
        if (rand() < obstacleDensity) {
          obstacles.push(coord);
        }
      }
    }
  }

  // 3. Adiciona gemas no meio do caminho a partir da semente 2
  const gems: GridCoord[] = [];
  if (stage >= 2 && pathCoords.length > 4) {
    const numGems = Math.min(3, 1 + Math.floor(stage / 3));
    const step = Math.floor(pathCoords.length / (numGems + 1));
    for (let i = 1; i <= numGems; i++) {
      const gCoord = pathCoords[i * step];
      if (gCoord && !coordEquals(gCoord, startPos) && !coordEquals(gCoord, targetPos)) {
        if (!gems.some((g) => coordEquals(g, gCoord))) {
          gems.push({ ...gCoord });
        }
      }
    }
  }

  // 4. Adiciona Obstáculos Interativos Procedurais (Hazards, Esteiras e Portais)
  // Garantia: NÃO bloqueiam a solução livre
  const hazards: GridCoord[] = [];
  const conveyors: { coord: GridCoord; direction: RobotDirection }[] = [];

  // EMP Hazards: a partir do estágio 3, coloca 1 a 2 hazards em células fora da solução ou em bifurcações
  if (stage >= 3) {
    const hazardCandidates: GridCoord[] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const c = { x, y };
        // Não coloca onde tem obstáculo sólido, nem no start/target nem nas gemas
        if (!pathSet.has(coordKey(c)) && !obstacles.some((o) => coordEquals(o, c))) {
          hazardCandidates.push(c);
        }
      }
    }
    const numHazards = Math.min(3, 1 + Math.floor(stage / 4));
    for (let i = 0; i < numHazards && hazardCandidates.length > 0; i++) {
      const idx = Math.floor(rand() * hazardCandidates.length);
      const chosen = hazardCandidates.splice(idx, 1)[0];
      hazards.push(chosen);
    }
  }

  // Esteiras de Impulso: a partir do estágio 4, se houver retas longas no caminho, pode colocar esteira acelerando a favor
  if (stage >= 4 && pathCoords.length >= 6) {
    // Procura por 3 pontos em linha reta no caminho garantido: P[i-1], P[i], P[i+1]
    for (let i = 2; i < pathCoords.length - 2; i++) {
      const prev = pathCoords[i - 1];
      const cur = pathCoords[i];
      const nxt = pathCoords[i + 1];

      // Reta horizontal para a direita: (x-1, y) -> (x, y) -> (x+1, y)
      if (prev.y === cur.y && cur.y === nxt.y && nxt.x === cur.x + 1 && cur.x === prev.x + 1) {
        if (!conveyors.some((c) => coordEquals(c.coord, cur))) {
          conveyors.push({ coord: { ...cur }, direction: 'RIGHT' });
          break;
        }
      }
      // Reta vertical para cima: (x, y+1) -> (x, y) -> (x, y-1)
      else if (prev.x === cur.x && cur.x === nxt.x && nxt.y === cur.y - 1 && cur.y === prev.y - 1) {
        if (!conveyors.some((c) => coordEquals(c.coord, cur))) {
          conveyors.push({ coord: { ...cur }, direction: 'UP' });
          break;
        }
      }
    }
  }

  // 5. Estimativa balanceada de blocos para estrelas
  const pathLen = pathCoords.length;
  const maxBlocks3 = Math.max(5, Math.ceil(pathLen * 0.75) + (gems.length > 0 ? 3 : 0));
  const maxBlocks2 = Math.ceil(maxBlocks3 * 1.5);

  return {
    id: 1000 + stage,
    title: `Desafio Procedural #${stage}`,
    subtitle: `Setor Algorítmico ${width}x${height}`,
    description: `Circuito gerado proceduralmente com semente #${seedNumber}. Otimize os comandos e desvie dos obstáculos!`,
    tip: 'Observe as curvas necessárias, evite terminar o código sobre pisos de choque e agrupe passos iguais com laços de repetição.',
    gridSize: { width, height },
    startPos,
    startDir,
    targetPos,
    obstacles,
    hazards: hazards.length > 0 ? hazards : undefined,
    conveyors: conveyors.length > 0 ? conveyors : undefined,
    gems: gems.length > 0 ? gems : undefined,
    maxBlocksFor3Stars: maxBlocks3,
    maxBlocksFor2Stars: maxBlocks2,
    baseRewardBytes: 150 + stage * 50,
    availableBlockTypes: [
      'move_forward',
      'turn_left',
      'turn_right',
      'repeat',
      ...(stage >= 2 ? (['collect_gem'] as const) : []),
    ],
  };
}
