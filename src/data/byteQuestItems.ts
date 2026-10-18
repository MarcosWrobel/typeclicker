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
    passiveAbility: {
      id: 'passive_rage_burst',
      name: 'Explosão Térmica',
      description: 'Ao desferir acertos críticos, tem 35% de chance de ativar Fúria de Batalha instantânea por 3s.',
      trigger: 'on_crit',
      type: 'rage_burst',
      chancePercent: 35,
      value: 3
    },
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
    passiveAbility: {
      id: 'passive_sigkill_strike',
      name: 'Descarga SIGKILL',
      description: 'Acertos críticos invocam raios quânticos em cadeia que atingem 4 inimigos próximos.',
      trigger: 'on_crit',
      type: 'lightning_strike',
      chancePercent: 50,
      value: 4
    },
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
    passiveAbility: {
      id: 'passive_speed_surge',
      name: 'Surto de Banda Larga',
      description: 'Ao derrotar inimigos, tem 40% de chance de conceder bônus de velocidade de esquiva (+80 px/s) por 3s.',
      trigger: 'on_kill',
      type: 'speed_surge',
      chancePercent: 40,
      value: 3
    },
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
    passiveAbility: {
      id: 'passive_frost_nova',
      name: 'Pausa Síncrona',
      description: 'Acertos críticos provocam uma explosão criogênica congelando monstros próximos por 2.5s.',
      trigger: 'on_crit',
      type: 'frost_nova',
      chancePercent: 45,
      value: 2.5
    },
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
    passiveAbility: {
      id: 'passive_kernel_barrier',
      name: 'Barreira de Kernel',
      description: 'Ao sofrer dano, tem 25% de chance de erguer um escudo inviolável de 100 HP por 4s.',
      trigger: 'on_hit_taken',
      type: 'quantum_shield',
      chancePercent: 25,
      value: 100
    },
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
    passiveAbility: {
      id: 'passive_entropy_drain',
      name: 'Dreno de Entropia',
      description: 'Acertos críticos restauram 14 HP instantaneamente ao herói (vampirismo de dados).',
      trigger: 'on_crit',
      type: 'vampirism',
      chancePercent: 40,
      value: 14
    },
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
    passiveAbility: {
      id: 'passive_school_matrix',
      name: 'Unidade Escolar',
      description: 'Ao derrotar qualquer monstro, tem 60% de chance de disparar uma tempestade de raios em cadeia.',
      trigger: 'on_kill',
      type: 'lightning_strike',
      chancePercent: 60,
      value: 5
    },
    visualAssetKey: 'quantum_matrix',
    description: 'Relíquia máxima do colégio, guardada no cofre do laboratório de informática.',
    flavorText: 'O poder combinado de todas as turmas em um único artefato.'
  },

  // ─── BOOTS (BOTAS DE MOBILIDADE & TRILHA) ───
  {
    id: 'boots_runner_basic',
    name: 'Botas de Fibra Cinética',
    slot: 'boots',
    rarity: 'common',
    requiredLevel: 1,
    stats: { speedBps: 8, health: 15 },
    visualAssetKey: 'boots_kinetic',
    description: 'Solado magnético leve que reduz o atrito no piso da masmorra.'
  },
  {
    id: 'boots_magma_strider',
    name: 'Grevas da Trilha Vulcânica',
    slot: 'boots',
    rarity: 'epic',
    requiredLevel: 25,
    stats: { speedBps: 18, health: 45, damage: 12 },
    passiveAbility: {
      id: 'passive_fire_trail',
      name: 'Rastro de Magma',
      description: 'Usar a Ação de Mobilidade (Espaço) deixa uma trilha de fogo incandescente que queima inimigos por 4s.',
      trigger: 'on_mobility',
      type: 'mobility_fire_trail',
      chancePercent: 100,
      value: 35
    },
    visualAssetKey: 'boots_magma',
    description: 'Forjadas no núcleo de silício; cada passo em alta velocidade derrete o chão.'
  },
  {
    id: 'boots_quantum_phantom',
    name: 'Propulsores de Dobra Quântica',
    slot: 'boots',
    rarity: 'quantum',
    requiredLevel: 50,
    stats: { speedBps: 30, critRate: 10, defense: 15, health: 70 },
    passiveAbility: {
      id: 'passive_shock_dash',
      name: 'Descarga de Dobra',
      description: 'Usar a Ação de Mobilidade (Espaço) detona uma Nova Elétrica ao redor do herói causando dano em área.',
      trigger: 'on_mobility',
      type: 'mobility_shock_nova',
      chancePercent: 100,
      value: 95
    },
    visualAssetKey: 'boots_quantum',
    description: 'Rompe a barreira de clock ao deslizar pela arena.'
  },

  // ─── RELICS (RELÍQUIAS ANCESTRAIS DE CÓDIGO) ───
  {
    id: 'relic_hourglass_silicon',
    name: 'Ampulheta de Silício',
    slot: 'relic',
    rarity: 'rare',
    requiredLevel: 10,
    stats: { speedBps: 6, critRate: 6, health: 30 },
    visualAssetKey: 'relic_hourglass',
    description: 'Dilata os ciclos do processador, acelerando a regeneração de energia e foco.'
  },
  {
    id: 'relic_necro_codex',
    name: 'Códice do Necromante Digital',
    slot: 'relic',
    rarity: 'epic',
    requiredLevel: 30,
    stats: { damage: 22, critRate: 10, health: 50 },
    passiveAbility: {
      id: 'passive_summon_spirit',
      name: 'Espíritos Compilados',
      description: 'Completar qualquer palavra digitada invoca 2 Espíritos Cibernéticos teleguiados que caçam inimigos.',
      trigger: 'on_word_complete',
      type: 'summon_spirit',
      chancePercent: 100,
      value: 2
    },
    visualAssetKey: 'relic_codex',
    description: 'Processos zumbis reescritos para lutar ao lado do programador.'
  },
  {
    id: 'relic_singularity_core',
    name: 'Coração do Arquiteto Supremo',
    slot: 'relic',
    rarity: 'quantum',
    requiredLevel: 60,
    stats: { damage: 45, critRate: 18, defense: 18, health: 110, speedBps: 16 },
    passiveAbility: {
      id: 'passive_architect_wrath',
      name: 'Legião do Arquiteto',
      description: 'Completar palavras invoca 4 Espíritos Quânticos de alto dano e restaura 10 HP.',
      trigger: 'on_word_complete',
      type: 'summon_spirit',
      chancePercent: 100,
      value: 4
    },
    visualAssetKey: 'relic_core',
    description: 'Artefato ancestral extraído do próprio Guardião Rúnico do Núcleo Quântico.'
  }
];

export function getItemById(id: string): RpgItem | undefined {
  return BYTE_QUEST_ITEMS.find((item) => item.id === id);
}

/**
 * Balanceamento de Chances da Forja do Masmorreiro:
 * - Comum: 65%
 * - Raro: 24%
 * - Épico: 8.5%
 * - Quântico (Lendário supremo): 2.5%
 */
export function forgeWeightedRandomItem(
  rpgClass: 'warrior' | 'archer' | 'mage',
  excludedIds: string[] = []
): { item: RpgItem; rollRarity: string } {
  const roll = Math.random() * 100;
  let targetRarity: 'common' | 'rare' | 'epic' | 'quantum' = 'common';

  if (roll < 2.5) {
    targetRarity = 'quantum'; // 2.5% chance
  } else if (roll < 11.0) {
    targetRarity = 'epic'; // 8.5% chance
  } else if (roll < 35.0) {
    targetRarity = 'rare'; // 24% chance
  } else {
    targetRarity = 'common'; // 65% chance
  }

  // Filtra itens adequados para o arquétipo
  const classEligible = BYTE_QUEST_ITEMS.filter(
    (item) => !item.requiredClass || item.requiredClass === rpgClass
  );

  // Prioriza itens da raridade sorteada que o jogador ainda não possua
  const matchingRarity = classEligible.filter((item) => item.rarity === targetRarity);
  const unowned = matchingRarity.filter((item) => !excludedIds.includes(item.id));

  const pool = unowned.length > 0 ? unowned : matchingRarity.length > 0 ? matchingRarity : classEligible;
  const item = pool[Math.floor(Math.random() * pool.length)];

  return { item, rollRarity: targetRarity };
}

/**
 * Retorno de Bytes ao desmantelar/destruir um item no laboratório
 * Custo de forja base: 400 Bytes
 */
export function getItemDismantleValue(rarity: string): number {
  switch (rarity) {
    case 'quantum':
      return 320; // 80% de retorno
    case 'epic':
      return 220; // 55% de retorno
    case 'rare':
      return 140; // 35% de retorno
    default:
      return 80; // 20% de retorno para comuns
  }
}

export function getStarterLoadout(rpgClass: 'warrior' | 'archer' | 'mage'): {
  weapon: RpgItem;
  chest: RpgItem;
  head: RpgItem;
  boots: RpgItem;
  accessory: RpgItem;
  relic: RpgItem;
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
    boots: getItemById('boots_runner_basic') || BYTE_QUEST_ITEMS[0],
    accessory: getItemById('acc_ring_clock') || BYTE_QUEST_ITEMS[13],
    relic: getItemById('relic_hourglass_silicon') || BYTE_QUEST_ITEMS[0]
  };
}

