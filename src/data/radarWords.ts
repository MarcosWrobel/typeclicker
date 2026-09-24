import { CurricularTrackId } from '../types';
import { getCurricularTrack } from './tracks';

/**
 * Normaliza caracteres para validação flexível de acentos e cedilhas.
 * Ex: 'Ã' -> 'A', 'É' -> 'E', 'Ç' -> 'C'.
 */
export function normalizeChar(char: string): string {
  if (!char) return '';
  return char
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

/**
 * Compara se o caractere digitado corresponde ao caractere esperado,
 * aceitando correspondência estrita ou com tolerância a acentos.
 */
export function charMatches(expected: string, input: string, strict: boolean = false): boolean {
  if (!expected || !input) return false;
  if (expected.toUpperCase() === input.toUpperCase()) return true;
  if (!strict) {
    return normalizeChar(expected) === normalizeChar(input);
  }
  return false;
}

// Palavras Curtas (Sondas / Mísseis Rápidos) - 3 a 4 letras
export const RADAR_SCOUT_WORDS = [
  'cpu', 'ram', 'byte', 'web', 'css', 'html', 'bot', 'bug', 'git', 'dev',
  'bio', 'neo', 'led', 'usb', 'dns', 'ip', 'tag', 'loop', 'bit', 'hub',
  'net', 'key', 'lan', 'app', 'cli', 'ide', 'link', 'root', 'data', 'ping',
  'host', 'code', 'file', 'node', 'wifi', 'sync', 'hack', 'chip', 'plug', 'flow'
];

// Palavras Médias (Drones Intermediários) - 5 a 7 letras
export const RADAR_DRONE_WORDS = [
  'pixel', 'array', 'linux', 'virus', 'proxy', 'fibra', 'modem', 'login',
  'mouse', 'senha', 'placa', 'drone', 'robos', 'laser', 'clock', 'turbo',
  'dados', 'nuvem', 'rede', 'tecla', 'script', 'python', 'react', 'cyber',
  'cursor', 'socket', 'cookie', 'buffer', 'memoria', 'janela', 'sistema',
  'online', 'upload', 'stream', 'codigo', 'matriz', 'backup', 'router', 'server'
];

// Palavras Longas (Cruzadores Pesados / Tanques) - 8+ letras
export const RADAR_TANK_WORDS = [
  'hardware', 'software', 'terminal', 'servidor', 'monitor', 'internet',
  'algoritmo', 'seguranca', 'processador', 'computador', 'programa',
  'firewall', 'navegador', 'antivirus', 'linguagem', 'velocidade',
  'tecnologia', 'criptografia', 'inteligencia', 'informacao', 'desenvolvimento',
  'conectividade', 'bancodedados', 'programador', 'compilador'
];

// Ameaças de Código / Glitch (Sintaxe de Programação e Comandos)
export const RADAR_GLITCH_WORDS = [
  'print()', 'for(i)', 'if(ok)', 'const', 'return;', 'def()',
  'while()', 'let[x]', 'fn()', 'arr.pop', 'try{}', 'bool',
  'import', 'async', 'await', 'eval()', 'null;', 'break;', 'alert()'
];

// Comandos de Terminal Universais Suportados pelo Radar
export const RADAR_COMMANDS = [
  {
    keyword: '/NUKE',
    name: 'Bomba Nuclear Cibernética',
    description: 'Detona todos os inimigos visíveis no radar com um pulso devastador.',
    energyCost: 100,
    cooldownMs: 15000,
    icon: 'nuke'
  },
  {
    keyword: '/FREEZE',
    name: 'Dilatação Temporal (Bullet Time)',
    description: 'Desacelera a velocidade de todos os mísseis em 75% por 5 segundos.',
    energyCost: 50,
    cooldownMs: 8000,
    icon: 'freeze'
  },
  {
    keyword: '/SHIELD',
    name: 'Recarga do Escudo Defensivo',
    description: 'Restaura imediatamente +50 pontos de escudo da base central.',
    energyCost: 40,
    cooldownMs: 6000,
    icon: 'shield'
  },
  {
    keyword: '/EMP',
    name: 'Pulso Eletromagnético Local',
    description: 'Paralisa completamente as 3 ameaças mais próximas da base por 6s.',
    energyCost: 60,
    cooldownMs: 10000,
    icon: 'emp'
  }
];

export interface RadarWordOptions {
  tier: 'scout' | 'drone' | 'tank' | 'glitch';
  activeTrack?: CurricularTrackId | null;
  usedWords?: Set<string>;
}

/**
 * Retorna uma palavra adequada para o inimigo, priorizando vocabulário curricular
 * ativo na escola se disponível, evitando colisões com palavras ativas no radar.
 */
export function getRandomRadarWord({ tier, activeTrack, usedWords }: RadarWordOptions): string {
  let pool: string[] = [];

  // Se houver trilha pedagógica ativa, tentar usar palavras da trilha que encaixem no tamanho
  if (activeTrack && activeTrack !== 'geral') {
    const track = getCurricularTrack(activeTrack);
    if (track && track.categories && track.categories.length > 0) {
      const trackWords = track.categories.flatMap(c => c.words || []);
      if (trackWords.length > 0) {
        if (tier === 'scout') {
          const filtered = trackWords.filter(w => w.length <= 5 && !w.includes(' '));
          if (filtered.length >= 5) pool = filtered;
        } else if (tier === 'drone') {
          const filtered = trackWords.filter(w => w.length >= 5 && w.length <= 8 && !w.includes(' '));
          if (filtered.length >= 5) pool = filtered;
        } else if (tier === 'tank') {
          const filtered = trackWords.filter(w => w.length >= 8 && !w.includes(' '));
          if (filtered.length >= 5) pool = filtered;
        }
      }
    }
  }

  // Fallback para os bancos padrão do Type: Radar
  if (pool.length === 0) {
    switch (tier) {
      case 'scout':
        pool = RADAR_SCOUT_WORDS;
        break;
      case 'drone':
        pool = RADAR_DRONE_WORDS;
        break;
      case 'tank':
        pool = RADAR_TANK_WORDS;
        break;
      case 'glitch':
        pool = RADAR_GLITCH_WORDS;
        break;
      default:
        pool = RADAR_DRONE_WORDS;
    }
  }

  // Filtra palavras que já estão ativas na tela para evitar ambiguidade de alvo
  const available = usedWords ? pool.filter(w => !usedWords.has(w.toUpperCase())) : pool;
  const finalPool = available.length > 0 ? available : pool;

  const chosen = finalPool[Math.floor(Math.random() * finalPool.length)];
  return chosen.toUpperCase();
}

// Sequências de palavras para Chefões (Dreadnoughts multi-fases)
export const RADAR_BOSS_SEQUENCES: string[][] = [
  ['FIREWALL', 'SOBRECARGA', 'EXTERMINIO'],
  ['DECRYPT', 'MAINFRAME', 'NUCLEO'],
  ['CORRUPCAO', 'ALGORITMO', 'COLAPSO'],
  ['PROTOCOLO', 'DEFESA', 'SINGULARIDADE'],
  ['BLINDAGEM', 'REATOR', 'SUPERNOVA'],
  ['CRIPTOGRAFIA', 'VULNERABILIDADE', 'ANIQUILACAO']
];

export function getRandomBossSequence(wave: number): string[] {
  const seq = RADAR_BOSS_SEQUENCES[(Math.floor(wave / 5) - 1) % RADAR_BOSS_SEQUENCES.length] || RADAR_BOSS_SEQUENCES[0];
  // Se onda for alta (10+), adiciona uma 4ª palavra desafiadora
  if (wave >= 10 && seq.length === 3) {
    return [...seq, 'DESTRUIDOR'];
  }
  return [...seq];
}

