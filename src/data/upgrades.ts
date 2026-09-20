import { UpgradeDef } from '../types';

export const UPGRADES: UpgradeDef[] = [
  // --- UPGRADES ATIVOS (Aumentam Bytes por Tecla Correta) ---
  {
    id: 'switch_lube',
    name: 'Switches Mecânicos Lubrificados',
    description: '+1 Byte por tecla digitada',
    type: 'active',
    baseCost: 20,
    costMultiplier: 1.15,
    value: 1,
    icon: 'Keyboard',
    flavor: 'Teclas mais suaves reduzem o atrito mecânico e aumentam sua cadência de acertos.'
  },
  {
    id: 'muscle_memory',
    name: 'Treino de Memória Muscular',
    description: '+3 Bytes por tecla digitada',
    type: 'active',
    baseCost: 90,
    costMultiplier: 1.17,
    value: 3,
    icon: 'Zap',
    flavor: 'Seus dedos encontram as teclas da fileira guia sem precisar olhar para o teclado.'
  },
  {
    id: 'pbt_keycaps',
    name: 'Keycaps PBT Texturizadas',
    description: '+8 Bytes por tecla digitada',
    type: 'active',
    baseCost: 400,
    costMultiplier: 1.19,
    value: 8,
    icon: 'Sparkles',
    flavor: 'Plástico de alta durabilidade com ranhuras táteis na tecla F e na tecla J.'
  },
  {
    id: 'haptic_gloves',
    name: 'Luvas de Feedback Háptico',
    description: '+25 Bytes por tecla digitada',
    type: 'active',
    baseCost: 1800,
    costMultiplier: 1.22,
    value: 25,
    icon: 'HandMetal',
    flavor: 'Sensores de pulso que enviam micromovimentos para antecipar a próxima sílaba.'
  },
  {
    id: 'neural_boost',
    name: 'Overclock Cerebral de Digitação',
    description: '+80 Bytes por tecla digitada',
    type: 'active',
    baseCost: 7500,
    costMultiplier: 1.25,
    value: 80,
    icon: 'Cpu',
    flavor: 'Foco e reflexo sináptico dignos de um digitador de elite da equipe de robótica.'
  },

  // --- UPGRADES PASSIVOS (Geram Bytes por Segundo / Idle) ---
  {
    id: 'shell_script',
    name: 'Script Bash no Laboratório',
    description: '+1 Byte gerado por segundo',
    type: 'passive',
    baseCost: 35,
    costMultiplier: 1.15,
    value: 1,
    icon: 'Terminal',
    flavor: 'Um script simples executando em segundo plano no terminal do laboratório.'
  },
  {
    id: 'lab_robot',
    name: 'Robô Assistente do Laboratório',
    description: '+6 Bytes gerados por segundo',
    type: 'passive',
    baseCost: 150,
    costMultiplier: 1.18,
    value: 6,
    icon: 'Bot',
    flavor: 'Pequeno robô educacional programado pelos alunos para automatizar tarefas de digitação.'
  },
  {
    id: 'school_server',
    name: 'Servidor Local do Colégio',
    description: '+24 Bytes gerados por segundo',
    type: 'passive',
    baseCost: 700,
    costMultiplier: 1.20,
    value: 24,
    icon: 'Server',
    flavor: 'Uma máquina dedicada no rack escolar compilando dados em alta velocidade.'
  },
  {
    id: 'daemon_compiler',
    name: 'Daemon de Backup em Background',
    description: '+85 Bytes gerados por segundo',
    type: 'passive',
    baseCost: 3200,
    costMultiplier: 1.22,
    value: 85,
    icon: 'HardDrive',
    flavor: 'Processo contínuo que processa pacotes de texto mesmo quando você faz uma pausa.'
  },
  {
    id: 'quantum_cluster',
    name: 'Cluster Quântico Educacional',
    description: '+320 Bytes gerados por segundo',
    type: 'passive',
    baseCost: 14000,
    costMultiplier: 1.25,
    value: 320,
    icon: 'Activity',
    flavor: 'Simulação supercondutora gerando milhares de sequências de caracteres instantâneos.'
  }
];

export function getUpgradeCost(upgrade: UpgradeDef, count: number): number {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, count));
}
