import { RpgItem } from '../types/byteQuest';

export const BYTE_QUEST_ITEMS: RpgItem[] = [
  // ─── WEAPONS (WARRIOR) ───
  {
    id: 'warrior_blade_starter',
    name: 'Espada de Ferro Reciclado',
    slot: 'weapon',
    rarity: 'common',
    requiredLevel: 1,
    requiredClass: 'warrior',
    stats: { damage: 8, speedBps: 2 },
    visualAssetKey: 'blade_iron',
    description: 'Forjada a partir de sucata de gabinetes antigos. Confiável para os primeiros andares.',
    flavorText: 'Todo herói começa com o que tem à mão no laboratório.'
  },
  {
    id: 'warrior_blade_cyber',
    name: 'Cyberblade Térmica',
    slot: 'weapon',
    rarity: 'rare',
    requiredLevel: 15,
    requiredClass: 'warrior',
    stats: { damage: 24, critRate: 8, speedBps: 5 },
    visualAssetKey: 'blade_thermal',
    description: 'Lâmina com filamento incandescente ativada pela velocidade de digitação contínua.',
    flavorText: 'Quanto mais rápido os dedos, mais quente o corte.'
  },
  {
    id: 'warrior_blade_quantum',
    name: 'Mata-Processos Quântica',
    slot: 'weapon',
    rarity: 'quantum',
    requiredLevel: 50,
    requiredClass: 'warrior',
    stats: { damage: 85, critRate: 20, speedBps: 18, accuracy: 5 },
    visualAssetKey: 'blade_quantum',
    description: 'Encerra threads corrompidas com um único golpe fatal.',
    flavorText: 'SIGKILL instantâneo na arquitetura da masmorra.'
  },

  // ─── WEAPONS (ARCHER) ───
  {
    id: 'archer_bow_starter',
    name: 'Arco de Fibra Óptica',
    slot: 'weapon',
    rarity: 'common',
    requiredLevel: 1,
    requiredClass: 'archer',
    stats: { damage: 6, accuracy: 4, critRate: 5 },
    visualAssetKey: 'bow_fiber',
    description: 'Dispara pulsos luminosos de dados com alta precisão direcional.',
    flavorText: 'A mira não erra quando o ritmo é constante.'
  },
  {
    id: 'archer_bow_plasma',
    name: 'Repetidor de Plasma Sub-Rede',
    slot: 'weapon',
    rarity: 'epic',
    requiredLevel: 30,
    requiredClass: 'archer',
    stats: { damage: 45, accuracy: 12, critRate: 15 },
    visualAssetKey: 'bow_plasma',
    description: 'Sincronizado ao buffer de acurácia: combos longos multiplicam os projéteis.',
    flavorText: 'Precisão cirúrgica sem soltar a linha guia.'
  },

  // ─── WEAPONS (MAGE) ───
  {
    id: 'mage_staff_starter',
    name: 'Cajado do Compilador',
    slot: 'weapon',
    rarity: 'common',
    requiredLevel: 1,
    requiredClass: 'mage',
    stats: { damage: 7, speedBps: 4 },
    visualAssetKey: 'staff_compiler',
    description: 'Canaliza comandos aritméticos em feixes energéticos.',
    flavorText: 'Um erro de sintaxe pode custar caro.'
  },
  {
    id: 'mage_staff_singularity',
    name: 'Cetro da Singularidade Assíncrona',
    slot: 'weapon',
    rarity: 'quantum',
    requiredLevel: 50,
    requiredClass: 'mage',
    stats: { damage: 90, speedBps: 22, critRate: 12 },
    visualAssetKey: 'staff_singularity',
    description: 'Executa promessas de destruição massiva antes mesmo do ciclo de eventos resolver.',
    flavorText: 'Promise.allSettled() com dano supremo.'
  },

  // ─── CHEST ARMOR ───
  {
    id: 'chest_tunic_novice',
    name: 'Colete de Malha Antiestática',
    slot: 'chest',
    rarity: 'common',
    requiredLevel: 1,
    stats: { defense: 5, health: 30 },
    visualAssetKey: 'chest_antistatic',
    description: 'Protege contra descargas eletrostáticas em salas com fiação exposta.'
  },
  {
    id: 'chest_plate_titan',
    name: 'Peitoral Blindado do Firewall',
    slot: 'chest',
    rarity: 'rare',
    requiredLevel: 20,
    requiredClass: 'warrior',
    stats: { defense: 22, health: 120 },
    visualAssetKey: 'plate_titan',
    description: 'Bloqueia pacotes de dano não autorizados com densas camadas de titânio digital.'
  },
  {
    id: 'chest_robe_arcane',
    name: 'Manto da Memória Cache L1',
    slot: 'chest',
    rarity: 'epic',
    requiredLevel: 35,
    requiredClass: 'mage',
    stats: { defense: 14, health: 80, speedBps: 10 },
    visualAssetKey: 'robe_arcane',
    description: 'Acelera a recuperação de recursos com latência quase nula.'
  },
  {
    id: 'chest_aegis_quantum',
    name: 'Égide do Kernel Imutável',
    slot: 'chest',
    rarity: 'quantum',
    requiredLevel: 60,
    stats: { defense: 45, health: 260, critRate: 8 },
    visualAssetKey: 'aegis_quantum',
    description: 'Armadura sagrada com permissão somente-leitura contra qualquer ataque inimigo.'
  },

  // ─── HELMETS / HEAD ───
  {
    id: 'head_visor_basic',
    name: 'Óculos de Realidade do Terminal',
    slot: 'head',
    rarity: 'common',
    requiredLevel: 1,
    stats: { accuracy: 3 },
    visualAssetKey: 'head_visor',
    description: 'Destaque visual sutil sobre as teclas corretas.'
  },
  {
    id: 'head_helm_crusader',
    name: 'Elmo de Redes Gigabit',
    slot: 'head',
    rarity: 'rare',
    requiredLevel: 18,
    requiredClass: 'warrior',
    stats: { defense: 10, health: 50 },
    visualAssetKey: 'head_helm',
    description: 'Blindagem facial com dutos de ventilação para digitação contínua sob estresse.'
  },
  {
    id: 'head_visor_quantum',
    name: 'Visor Quântico de Overclock',
    slot: 'head',
    rarity: 'quantum',
    requiredLevel: 55,
    stats: { accuracy: 15, critRate: 14, speedBps: 12 },
    visualAssetKey: 'quantum_visor',
    description: 'Prevê a posição das palavras nos milissegundos anteriores ao render do Canvas.'
  },

  // ─── ACCESSORIES ───
  {
    id: 'acc_ring_clock',
    name: 'Anel do Cristal de Quartzo',
    slot: 'accessory',
    rarity: 'common',
    requiredLevel: 1,
    stats: { speedBps: 3 },
    visualAssetKey: 'ring_quartz',
    description: 'Emite um pulso de sincronização que estabiliza o BPM de digitação.'
  },
  {
    id: 'acc_amulet_entropy',
    name: 'Amuleto de Baixa Entropia',
    slot: 'accessory',
    rarity: 'epic',
    requiredLevel: 32,
    stats: { critRate: 12, damage: 18 },
    visualAssetKey: 'amulet_entropy',
    description: 'Converte a frustração de erros em ondas críticas de retaliação.'
  },
  {
    id: 'acc_matrix_quantum',
    name: 'Matriz Espectral do Leopoldina',
    slot: 'accessory',
    rarity: 'quantum',
    requiredLevel: 70,
    stats: { damage: 35, defense: 20, accuracy: 10, critRate: 15, speedBps: 20 },
    visualAssetKey: 'quantum_matrix',
    description: 'Relíquia máxima do colégio, guardada no cofre do laboratório de informática.',
    flavorText: 'O poder combinado de todas as turmas em um único artefato.'
  }
];

export function getItemById(id: string): RpgItem | undefined {
  return BYTE_QUEST_ITEMS.find((item) => item.id === id);
}

export function getStarterLoadout(rpgClass: 'warrior' | 'archer' | 'mage'): {
  weapon: RpgItem;
  chest: RpgItem;
  head: RpgItem;
  accessory: RpgItem;
} {
  const weaponMap = {
    warrior: 'warrior_blade_starter',
    archer: 'archer_bow_starter',
    mage: 'mage_staff_starter'
  };

  return {
    weapon: getItemById(weaponMap[rpgClass]) || BYTE_QUEST_ITEMS[0],
    chest: getItemById('chest_tunic_novice') || BYTE_QUEST_ITEMS[6],
    head: getItemById('head_visor_basic') || BYTE_QUEST_ITEMS[10],
    accessory: getItemById('acc_ring_clock') || BYTE_QUEST_ITEMS[13]
  };
}
