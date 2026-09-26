/**
 * Utilitário de Geração de SVG Oficial do Bytezinho
 * Gera o SVG vetorial 1:1 com todas as 25 skins cosméticas da plataforma
 * e expressões dinâmicas para renderização em Canvas 2D ou componentes visuais.
 */

export interface BytezinhoSvgOptions {
  skin?: string;
  mood?: 'normal' | 'happy' | 'fire' | 'oops' | 'upgrade' | 'glitch' | 'warning' | 'leak';
  isBlinking?: boolean;
  isCombo?: boolean;
  comboCount?: number;
  isTyping?: boolean;
}

export function getBytezinhoEyeColor(skin: string = 'classic', mood: string = 'normal'): string {
  if (mood === 'glitch') return '#f43f5e';
  if (mood === 'warning') return '#f59e0b';
  if (mood === 'leak') return '#38bdf8';
  if (mood === 'fire') return '#fbbf24';

  switch (skin) {
    case 'cyber': return '#22d3ee';
    case 'retro_8bit': return '#4ade80';
    case 'wizard': return '#c084fc';
    case 'astronaut': return '#38bdf8';
    case 'ninja': return '#ef4444';
    case 'steampunk': return '#f59e0b';
    case 'golden_king': return '#fde047';
    case 'diver': return '#38bdf8';
    case 'robot_mecha': return '#22d3ee';
    case 'hoodie_hacker': return '#34d399';
    case 'jedi_master': return '#38bdf8';
    case 'miner_diamond': return '#06b6d4';
    case 'saiyan_warrior': return '#22d3ee';
    case 'arachnid_hero': return '#ffffff';
    // Míticos / Quânticos
    case 'blindfolded_sorcerer': return '#38bdf8';
    case 'rubber_pirate': return '#ffffff';
    case 'hoodie_skeleton': return '#06b6d4';
    case 'urban_cyborg': return '#06b6d4';
    case 'demon_slayer': return '#f97316';
    case 'electric_rodent': return '#facc15';
    case 'bored_hero': return '#ffffff';
    case 'needle_knight': return '#e0f2fe';
    case 'supersonic_hedgehog': return '#22c55e';
    case 'shadow_crusader': return '#ffffff';
    case 'classic':
    default: return '#10b981';
  }
}

export function getBytezinhoChassisColor(skin: string = 'classic'): string {
  switch (skin) {
    case 'retro_8bit': return '#d1c7b7';
    case 'hoodie_hacker': return '#14161f';
    case 'cyber': return '#0a1424';
    case 'wizard': return '#1e1136';
    case 'astronaut': return '#e2e8f0';
    case 'ninja': return '#111318';
    case 'steampunk': return '#3d2516';
    case 'golden_king': return '#2a1f0a';
    case 'diver': return '#0b2333';
    case 'robot_mecha': return '#1e293b';
    case 'jedi_master': return '#292524';
    case 'miner_diamond': return '#292524';
    case 'saiyan_warrior': return '#1e1b4b';
    case 'arachnid_hero': return '#991b1b';
    // Míticos / Quânticos
    case 'blindfolded_sorcerer': return '#0b0f19';
    case 'rubber_pirate': return '#b91c1c';
    case 'hoodie_skeleton': return '#1e3a8a';
    case 'urban_cyborg': return '#1c1917';
    case 'demon_slayer': return '#0f172a';
    case 'electric_rodent': return '#ca8a04';
    case 'bored_hero': return '#eab308';
    case 'needle_knight': return '#1e293b';
    case 'supersonic_hedgehog': return '#1d4ed8';
    case 'shadow_crusader': return '#09090b';
    case 'classic':
    default: return '#1c2230';
  }
}

export function getBytezinhoChassisBorder(skin: string = 'classic', isGlitch: boolean = false): string {
  if (isGlitch) return '#e11d48';
  switch (skin) {
    case 'retro_8bit': return '#a89c8a';
    case 'hoodie_hacker': return '#333b52';
    case 'cyber': return '#06b6d4';
    case 'wizard': return '#8b5cf6';
    case 'astronaut': return '#38bdf8';
    case 'ninja': return '#dc2626';
    case 'steampunk': return '#b45309';
    case 'golden_king': return '#eab308';
    case 'diver': return '#0ea5e9';
    case 'robot_mecha': return '#64748b';
    case 'jedi_master': return '#38bdf8';
    case 'miner_diamond': return '#06b6d4';
    case 'saiyan_warrior': return '#eab308';
    case 'arachnid_hero': return '#0284c7';
    // Míticos / Quânticos
    case 'blindfolded_sorcerer': return '#38bdf8';
    case 'rubber_pirate': return '#f59e0b';
    case 'hoodie_skeleton': return '#38bdf8';
    case 'urban_cyborg': return '#eab308';
    case 'demon_slayer': return '#22c55e';
    case 'electric_rodent': return '#facc15';
    case 'bored_hero': return '#ef4444';
    case 'needle_knight': return '#cbd5e1';
    case 'supersonic_hedgehog': return '#38bdf8';
    case 'shadow_crusader': return '#f59e0b';
    case 'classic':
    default: return '#10b981';
  }
}

export function getBytezinhoScreenBg(skin: string = 'classic', mood: string = 'normal'): string {
  if (mood === 'glitch') return '#3b0d14';
  if (mood === 'warning') return '#2b1c09';
  if (mood === 'leak') return '#091c2b';
  switch (skin) {
    case 'cyber': return '#061324';
    case 'retro_8bit': return '#08180c';
    case 'wizard': return '#1a0d2e';
    case 'astronaut': return '#06101e';
    case 'ninja': return '#0f1015';
    case 'steampunk': return '#211508';
    case 'golden_king': return '#1c1504';
    case 'diver': return '#041624';
    case 'robot_mecha': return '#0a141e';
    case 'hoodie_hacker': return '#090d14';
    case 'jedi_master': return '#07151e';
    case 'miner_diamond': return '#081820';
    case 'saiyan_warrior': return '#1a1202';
    case 'arachnid_hero': return '#180407';
    case 'blindfolded_sorcerer': return '#020617';
    case 'rubber_pirate': return '#1a0505';
    case 'hoodie_skeleton': return '#000000';
    case 'urban_cyborg': return '#0f1406';
    case 'demon_slayer': return '#120502';
    case 'electric_rodent': return '#141405';
    case 'bored_hero': return '#0f0f12';
    case 'needle_knight': return '#050a12';
    case 'supersonic_hedgehog': return '#040d22';
    case 'shadow_crusader': return '#050508';
    case 'classic':
    default: return '#09140c';
  }
}

/**
 * Gera a string SVG completa do Bytezinho oficial de acordo com as opções informadas.
 */
export function generateBytezinhoSvgMarkup(options: BytezinhoSvgOptions = {}): string {
  const {
    skin = 'classic',
    mood = 'normal',
    isBlinking = false,
    isCombo = false,
    comboCount = 0,
    isTyping = false
  } = options;

  const isGlitch = mood === 'glitch';
  const eyeColor = getBytezinhoEyeColor(skin, mood);
  const chassisColor = getBytezinhoChassisColor(skin);
  const chassisBorder = getBytezinhoChassisBorder(skin, isGlitch);
  const screenBg = getBytezinhoScreenBg(skin, mood);

  let backAccessories = '';

  // 0. FEITICEIRO VENDADO: Cabelo arrepiado prateado
  if (skin === 'blindfolded_sorcerer') {
    backAccessories += `
      <g id="sorcerer-hair-back">
        <polygon points="20,26 8,10 22,14 30,-6 46,6 58,-12 70,6 86,-6 96,14 112,10 100,26" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" stroke-linejoin="round" />
        <polygon points="34,12 44,-2 52,8 60,-8 68,8 78,-2 86,14" fill="#e2e8f0" />
      </g>`;
  }

  // 0. PIRATA EMBORRACHADO: Chapéu de palha com fita vermelha
  if (skin === 'rubber_pirate') {
    backAccessories += `
      <g id="pirate-straw-hat">
        <ellipse cx="60" cy="24" rx="48" ry="10" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
        <path d="M38 24 Q38 4 60 4 Q82 4 82 24 Z" fill="#eab308" stroke="#ca8a04" stroke-width="2" />
        <path d="M38 24 Q60 21 82 24 L82 19 Q60 16 38 19 Z" fill="#dc2626" stroke="#991b1b" stroke-width="0.8" />
      </g>`;
  }

  // 0. ROEDOR ELÉTRICO: Orelhas longas com pontas pretas e cauda em raio
  if (skin === 'electric_rodent') {
    backAccessories += `
      <g id="electric-rodent-ears">
        <polygon points="32,26 14,-10 24,-12 42,22" fill="#facc15" stroke="#ca8a04" stroke-width="1.8" stroke-linejoin="round" />
        <polygon points="14,-10 24,-12 21,-2 16,0" fill="#09090b" />
        <polygon points="88,26 106,-10 96,-12 78,22" fill="#facc15" stroke="#ca8a04" stroke-width="1.8" stroke-linejoin="round" />
        <polygon points="106,-10 96,-12 99,-2 104,0" fill="#09090b" />
        <polygon points="104,78 116,68 110,64 122,50 114,48 126,30 118,34 110,54 114,56 102,72" fill="#eab308" stroke="#ca8a04" stroke-width="1.5" />
      </g>`;
  }

  // 0. BESOURO AGULHEIRO: Chifres curvados de cavaleiro
  if (skin === 'needle_knight') {
    backAccessories += `
      <g id="needle-knight-horns">
        <path d="M42 26 Q30 4 22 -4 Q28 8 36 24" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.8" />
        <path d="M78 26 Q90 4 98 -4 Q92 8 84 24" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.8" />
      </g>`;
  }

  // 0. OURIÇO SUPERSÔNICO: Espinhos aerodinâmicos azuis para trás
  if (skin === 'supersonic_hedgehog') {
    backAccessories += `
      <g id="hedgehog-quills">
        <polygon points="26,26 4,14 20,38" fill="#1d4ed8" stroke="#1e40af" stroke-width="2" stroke-linejoin="round" />
        <polygon points="20,40 -2,38 18,58" fill="#1d4ed8" stroke="#1e40af" stroke-width="2" stroke-linejoin="round" />
        <polygon points="94,26 116,14 100,38" fill="#1d4ed8" stroke="#1e40af" stroke-width="2" stroke-linejoin="round" />
        <polygon points="100,40 122,38 102,58" fill="#1d4ed8" stroke="#1e40af" stroke-width="2" stroke-linejoin="round" />
        <polygon points="40,20 60,-6 80,20" fill="#2563eb" stroke="#1d4ed8" stroke-width="2" />
      </g>`;
  }

  // 0. CAVALEIRO DAS SOMBRAS: Orelhas pontiagudas de morcego
  if (skin === 'shadow_crusader') {
    backAccessories += `
      <g id="bat-ears">
        <polygon points="24,26 18,-4 36,18" fill="#09090b" stroke="#27272a" stroke-width="2" stroke-linejoin="round" />
        <polygon points="96,26 102,-4 84,18" fill="#09090b" stroke="#27272a" stroke-width="2" stroke-linejoin="round" />
      </g>`;
  }

  // 1. CLÁSSICO: Antena única com bolinha pulsante
  if (skin === 'classic') {
    backAccessories += `
      <g id="classic-antenna">
        <line x1="60" y1="26" x2="60" y2="10" stroke="#475569" stroke-width="3" stroke-linecap="round" />
        <circle cx="60" cy="8" r="4.5" fill="${eyeColor}" />
        <circle cx="60" cy="8" r="7" fill="${eyeColor}" opacity="0.25" />
      </g>`;
  }

  // 2. RETRO 8-BIT: Antena dupla de TV portátil
  if (skin === 'retro_8bit') {
    backAccessories += `
      <g id="retro-antennae">
        <line x1="45" y1="26" x2="28" y2="7" stroke="#8c8273" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="28" cy="7" r="3.5" fill="#e2d9cc" />
        <line x1="75" y1="26" x2="92" y2="7" stroke="#8c8273" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="92" cy="7" r="3.5" fill="#e2d9cc" />
      </g>`;
  }

  // 3. CYBER: Chifre de fibra óptica / Antena neon
  if (skin === 'cyber') {
    backAccessories += `
      <g id="cyber-antenna">
        <path d="M54 26 L60 8 L66 26" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="60" cy="7" r="3.5" fill="#22d3ee" />
        <path d="M50 8 Q60 2 70 8" stroke="#06b6d4" stroke-width="1.5" stroke-linecap="round" opacity="0.8" />
        <path d="M44 4 Q60 -4 76 4" stroke="#38bdf8" stroke-width="1" stroke-linecap="round" opacity="0.5" />
      </g>`;
  }

  // 4. ASTRONAUTA: Anel de acoplamento do capacete e tubo de oxigênio
  if (skin === 'astronaut') {
    backAccessories += `
      <g id="astronaut-gear">
        <path d="M18 65 Q4 70 8 90 Q12 105 44 104" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 2" fill="none" />
        <ellipse cx="60" cy="26" rx="46" ry="8" fill="#cbd5e1" stroke="#0ea5e9" stroke-width="1.5" />
      </g>`;
  }

  // 5. STEAMPUNK: Chaminé de exaustão com vapor subindo
  if (skin === 'steampunk') {
    backAccessories += `
      <g id="steampunk-pipe">
        <rect x="80" y="8" width="10" height="20" rx="2" fill="#b45309" stroke="#78350f" stroke-width="1.5" />
        <ellipse cx="85" cy="8" rx="6" ry="2" fill="#f59e0b" />
        <circle cx="86" cy="2" r="3" fill="#e2e8f0" opacity="0.6" />
        <circle cx="89" cy="-5" r="4" fill="#cbd5e1" opacity="0.4" />
      </g>`;
  }

  // 6. MECHA: Antenas angulares de radar
  if (skin === 'robot_mecha') {
    backAccessories += `
      <g id="mecha-antennae">
        <polygon points="20,26 14,8 26,16" fill="#475569" stroke="#06b6d4" stroke-width="1.5" />
        <polygon points="100,26 106,8 94,16" fill="#475569" stroke="#06b6d4" stroke-width="1.5" />
        <circle cx="14" cy="8" r="2" fill="#22d3ee" />
        <circle cx="106" cy="8" r="2" fill="#22d3ee" />
      </g>`;
  }

  // 7. DIVER: Tubo do Snorkel aquático
  if (skin === 'diver') {
    backAccessories += `
      <g id="diver-snorkel">
        <path d="M96 70 L98 30 Q98 12 108 12 L110 16" stroke="#facc15" stroke-width="4" stroke-linecap="round" fill="none" />
        <circle cx="110" cy="16" r="3" fill="#ca8a04" />
        <circle cx="108" cy="4" r="2.5" fill="#38bdf8" opacity="0.7" />
        <circle cx="106" cy="-4" r="1.8" fill="#7dd3fc" opacity="0.5" />
      </g>`;
  }

  // Montar detalhes do chassis
  let chassisDetails = '';
  if (skin === 'retro_8bit') {
    chassisDetails += `
      <g id="retro-details">
        <line x1="22" y1="36" x2="22" y2="50" stroke="#948b7d" stroke-width="1.5" stroke-linecap="round" />
        <line x1="22" y1="56" x2="22" y2="70" stroke="#948b7d" stroke-width="1.5" stroke-linecap="round" />
        <rect x="24" y="86" width="22" height="3" rx="1" fill="#4a443a" />
        <rect x="24" y="91" width="16" height="2" rx="0.5" fill="#786f61" />
        <circle cx="49" cy="88" r="1.5" fill="${isTyping ? '#22c55e' : '#eab308'}" />
      </g>`;
  } else if (skin === 'cyber') {
    chassisDetails += `
      <g id="cyber-circuits" opacity="0.65">
        <path d="M22 40 L26 40 L30 44" stroke="#06b6d4" stroke-width="1.2" stroke-linecap="round" />
        <circle cx="30" cy="44" r="1.5" fill="#22d3ee" />
        <path d="M98 70 L94 70 L90 66" stroke="#f43f5e" stroke-width="1.2" stroke-linecap="round" />
        <circle cx="90" cy="66" r="1.5" fill="#fb7185" />
      </g>`;
  } else if (skin === 'robot_mecha') {
    chassisDetails += `
      <g id="mecha-rivets">
        <circle cx="23" cy="32" r="1.5" fill="#94a3b8" />
        <circle cx="97" cy="32" r="1.5" fill="#94a3b8" />
        <circle cx="23" cy="94" r="1.5" fill="#94a3b8" />
        <circle cx="97" cy="94" r="1.5" fill="#94a3b8" />
      </g>`;
  }

  // Olho Esquerdo e Olho Direito
  let leftEyeSvg = '';
  let rightEyeSvg = '';

  if (isGlitch) {
    leftEyeSvg = `<path d="M40 50 L46 56 L42 58 L48 66" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />`;
    rightEyeSvg = `<path d="M72 50 L78 56 L74 58 L80 66" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />`;
  } else if (isBlinking) {
    leftEyeSvg = `<line x1="38" y1="56" x2="48" y2="56" stroke="${eyeColor}" stroke-width="3" stroke-linecap="round" />`;
    rightEyeSvg = `<line x1="72" y1="56" x2="82" y2="56" stroke="${eyeColor}" stroke-width="3" stroke-linecap="round" />`;
  } else if (mood === 'happy' || mood === 'upgrade') {
    leftEyeSvg = `<path d="M38 58 Q43 50 48 58" stroke="${eyeColor}" stroke-width="3" stroke-linecap="round" fill="none" />`;
    rightEyeSvg = `<path d="M72 58 Q77 50 82 58" stroke="${eyeColor}" stroke-width="3" stroke-linecap="round" fill="none" />`;
  } else if (mood === 'fire' || isCombo || comboCount >= 8) {
    // Olhos em Chamas Estilo Anime
    leftEyeSvg = `
      <g>
        <path d="M38 60 Q40 48 43 46 Q47 50 48 60 Z" fill="#ea580c" />
        <path d="M40 59 Q42 50 44 49 Q46 52 47 59 Z" fill="#fef08a" />
        <circle cx="43" cy="55" r="1.5" fill="#ffffff" />
      </g>`;
    rightEyeSvg = `
      <g>
        <path d="M72 60 Q74 48 77 46 Q81 50 82 60 Z" fill="#ea580c" />
        <path d="M74 59 Q76 50 78 49 Q80 52 81 59 Z" fill="#fef08a" />
        <circle cx="77" cy="55" r="1.5" fill="#ffffff" />
      </g>`;
  } else if (mood === 'oops') {
    leftEyeSvg = `<circle cx="43" cy="56" r="4.5" stroke="#f43f5e" stroke-width="2.5" fill="none" />`;
    rightEyeSvg = `<circle cx="77" cy="56" r="4.5" stroke="#f43f5e" stroke-width="2.5" fill="none" />`;
  } else if (skin === 'retro_8bit') {
    leftEyeSvg = `<rect x="39" y="52" width="7" height="8" rx="1" fill="${eyeColor}" />`;
    rightEyeSvg = `<rect x="74" y="52" width="7" height="8" rx="1" fill="${eyeColor}" />`;
  } else if (skin === 'robot_mecha') {
    leftEyeSvg = `<polygon points="38,52 48,52 45,61 38,61" fill="${eyeColor}" />`;
    rightEyeSvg = `<polygon points="72,52 82,52 82,61 75,61" fill="${eyeColor}" />`;
  } else {
    // Clássico com reflexo especular
    leftEyeSvg = `
      <g>
        <rect x="39" y="51" width="8" height="11" rx="4" fill="${eyeColor}" />
        <circle cx="41.5" cy="54" r="1.5" fill="#ffffff" opacity="0.9" />
      </g>`;
    rightEyeSvg = `
      <g>
        <rect x="73" y="51" width="8" height="11" rx="4" fill="${eyeColor}" />
        <circle cx="75.5" cy="54" r="1.5" fill="#ffffff" opacity="0.9" />
      </g>`;
  }

  // Boca
  let mouthSvg = '';
  if (skin !== 'ninja' && skin !== 'arachnid_hero') {
    if (isGlitch) {
      mouthSvg = `<path d="M50 72 L55 70 L60 74 L65 70 L70 72" stroke="#f43f5e" stroke-width="2" stroke-linecap="round" />`;
    } else if (mood === 'happy' || mood === 'upgrade') {
      mouthSvg = `<path d="M52 70 Q60 78 68 70" stroke="${eyeColor}" stroke-width="2.5" stroke-linecap="round" fill="none" />`;
    } else if (isTyping || mood === 'fire') {
      mouthSvg = `<ellipse cx="60" cy="72" rx="4.5" ry="3" fill="${eyeColor}" />`;
    } else if (mood === 'oops') {
      mouthSvg = `<path d="M53 74 Q60 69 67 74" stroke="#f43f5e" stroke-width="2" stroke-linecap="round" fill="none" />`;
    } else if (skin === 'retro_8bit') {
      mouthSvg = `<line x1="53" y1="72" x2="67" y2="72" stroke="${eyeColor}" stroke-width="2.5" />`;
    } else {
      mouthSvg = `<path d="M54 71 Q60 75 66 71" stroke="${eyeColor}" stroke-width="2.2" stroke-linecap="round" fill="none" />`;
    }
  }

  // Visores sobrepostos na tela
  let screenOverlays = '';
  if (skin === 'cyber') {
    screenOverlays += `
      <g id="cyber-visor">
        <path d="M32 46 L88 46 L84 62 L36 62 Z" fill="#06b6d4" fill-opacity="0.2" stroke="#22d3ee" stroke-width="1.8" />
        <line x1="33" y1="50" x2="87" y2="50" stroke="#a5f3fc" stroke-width="1" stroke-dasharray="3 2" opacity="0.6" />
        <circle cx="85" cy="54" r="2" fill="#f43f5e" />
      </g>`;
  } else if (skin === 'diver') {
    screenOverlays += `
      <g id="diver-mask">
        <ellipse cx="60" cy="58" rx="28" ry="18" stroke="#0284c7" stroke-width="2.5" fill="none" opacity="0.8" />
        <ellipse cx="60" cy="58" rx="26" ry="16" fill="#38bdf8" fill-opacity="0.1" />
      </g>`;
  }

  // Acessórios frontais de cada skin
  let frontAccessories = '';

  if (skin === 'hoodie_hacker') {
    frontAccessories += `
      <g id="hacker-hoodie">
        <path d="M14 36 Q18 16 60 14 Q102 16 106 36 Q100 24 60 22 Q20 24 14 36 Z" fill="#090a0f" stroke="#2e354b" stroke-width="2" />
        <path d="M14 36 Q10 60 16 88 Q20 54 22 36 Z" fill="#0d0f17" opacity="0.95" />
        <path d="M106 36 Q110 60 104 88 Q100 54 98 36 Z" fill="#0d0f17" opacity="0.95" />
        <path d="M28 84 Q26 96 30 102" stroke="#475569" stroke-width="2" stroke-linecap="round" />
        <circle cx="30" cy="102" r="2" fill="#94a3b8" />
        <path d="M92 84 Q94 96 90 102" stroke="#475569" stroke-width="2" stroke-linecap="round" />
        <circle cx="90" cy="102" r="2" fill="#94a3b8" />
      </g>`;
  } else if (skin === 'wizard') {
    frontAccessories += `
      <g id="wizard-hat">
        <ellipse cx="60" cy="28" rx="46" ry="10" fill="#2e1065" stroke="#7c3aed" stroke-width="2.5" />
        <ellipse cx="60" cy="27" rx="38" ry="7" fill="#4c1d95" />
        <path d="M34 26 Q46 6 82 -2 Q74 14 86 26 Z" fill="#5b21b6" stroke="#8b5cf6" stroke-width="2.5" stroke-linejoin="round" />
        <path d="M36 26 Q60 22 84 26 L85 22 Q60 18 35 22 Z" fill="#f59e0b" stroke="#d97706" stroke-width="1" />
        <polygon points="56,8 58,13 63,14 59,17 60,22 56,19 52,22 53,17 49,14 54,13" fill="#fde047" stroke="#ca8a04" stroke-width="0.5" />
        <circle cx="82" cy="-2" r="3.5" fill="#fde047" />
      </g>`;
  } else if (skin === 'ninja') {
    frontAccessories += `
      <g id="ninja-gear">
        <path d="M16 32 L104 32 L102 24 L18 24 Z" fill="#b91c1c" stroke="#991b1b" stroke-width="1.5" />
        <rect x="42" y="24" width="36" height="10" rx="2" fill="#94a3b8" stroke="#475569" stroke-width="1" />
        <path d="M26 66 L94 66 L86 86 L34 86 Z" fill="#090a0f" stroke="#dc2626" stroke-width="1.5" />
        <line x1="60" y1="67" x2="60" y2="85" stroke="#262626" stroke-width="1.5" />
      </g>`;
  } else if (skin === 'steampunk') {
    frontAccessories += `
      <g id="steampunk-hat">
        <ellipse cx="60" cy="27" rx="44" ry="8" fill="#451a03" stroke="#92400e" stroke-width="2" />
        <rect x="34" y="6" width="52" height="20" rx="3" fill="#542304" stroke="#78350f" stroke-width="2" />
        <rect x="34" y="20" width="52" height="5" fill="#d97706" />
        <circle cx="48" cy="25" r="7" fill="#78350f" stroke="#f59e0b" stroke-width="2" />
        <circle cx="48" cy="25" r="5" fill="#14532d" />
        <circle cx="72" cy="25" r="7" fill="#78350f" stroke="#f59e0b" stroke-width="2" />
        <circle cx="72" cy="25" r="5" fill="#14532d" />
        <line x1="55" y1="25" x2="65" y2="25" stroke="#f59e0b" stroke-width="2" />
      </g>`;
  } else if (skin === 'golden_king') {
    frontAccessories += `
      <g id="royal-crown">
        <polygon points="30,26 34,10 47,20 60,6 73,20 86,10 90,26" fill="#eab308" stroke="#ca8a04" stroke-width="2" stroke-linejoin="round" />
        <rect x="28" y="24" width="64" height="6" rx="2" fill="#d97706" stroke="#b45309" stroke-width="1" />
        <circle cx="34" cy="11" r="2.5" fill="#ef4444" stroke="#991b1b" stroke-width="0.8" />
        <circle cx="60" cy="7" r="3.5" fill="#ef4444" stroke="#991b1b" stroke-width="0.8" />
        <circle cx="86" cy="11" r="2.5" fill="#ef4444" stroke="#991b1b" stroke-width="0.8" />
        <circle cx="60" cy="6" r="8" fill="#fef08a" opacity="0.3" />
      </g>`;
  } else if (skin === 'jedi_master') {
    frontAccessories += `
      <g id="jedi-gear">
        <path d="M14 36 Q18 16 60 14 Q102 16 106 36 Q100 24 60 22 Q20 24 14 36 Z" fill="#3e2723" stroke="#271406" stroke-width="2" />
        <path d="M14 36 Q10 60 16 88 Q20 54 22 36 Z" fill="#4e342e" opacity="0.95" />
        <path d="M106 36 Q110 60 104 88 Q100 54 98 36 Z" fill="#4e342e" opacity="0.95" />
        <rect x="104" y="55" width="6" height="18" rx="2" fill="#64748b" stroke="#334155" stroke-width="1" />
        <rect x="105.5" y="8" width="3" height="47" rx="1.5" fill="#ffffff" stroke="#38bdf8" stroke-width="2.5" />
      </g>`;
  } else if (skin === 'miner_diamond') {
    frontAccessories += `
      <g id="minecraft-miner-gear">
        <path d="M26 26 L26 12 L94 12 L94 26 L80 26 L80 20 L40 20 L40 26 Z" fill="#06b6d4" stroke="#0891b2" stroke-width="2" />
        <rect x="28" y="14" width="7" height="7" fill="#67e8f9" />
        <rect x="85" y="14" width="7" height="7" fill="#0e7490" />
        <rect x="56" y="13" width="8" height="6" fill="#22d3ee" />
        <line x1="10" y1="85" x2="22" y2="60" stroke="#78350f" stroke-width="3" stroke-linecap="round" />
        <path d="M16 57 Q23 52 28 66" stroke="#06b6d4" stroke-width="4" stroke-linecap="round" fill="none" />
      </g>`;
  } else if (skin === 'saiyan_warrior') {
    frontAccessories += `
      <g id="saiyan-gear">
        <polygon points="18,26 10,6 28,14 38,-6 54,8 60,-8 76,8 96,0 88,26" fill="#facc15" stroke="#ca8a04" stroke-width="2.5" stroke-linejoin="round" />
        <path d="M28 18 L38 2 L48 14 L58 -2 L68 14 L82 8" stroke="#fef08a" stroke-width="2" stroke-linecap="round" fill="none" />
        <path d="M34 94 L42 102 L78 102 L86 94 Z" fill="#e2e8f0" stroke="#ca8a04" stroke-width="1.5" />
        <rect x="50" y="96" width="20" height="5" fill="#ca8a04" rx="1" />
      </g>`;
  } else if (skin === 'arachnid_hero') {
    frontAccessories += `
      <g id="arachnid-mask">
        <line x1="20" y1="28" x2="100" y2="98" stroke="#000000" stroke-width="1" opacity="0.3" />
        <line x1="100" y1="28" x2="20" y2="98" stroke="#000000" stroke-width="1" opacity="0.3" />
        <polygon points="34,48 50,56 46,65 34,60" fill="#ffffff" stroke="#0f172a" stroke-width="2.5" stroke-linejoin="round" />
        <polygon points="86,48 70,56 74,65 86,60" fill="#ffffff" stroke="#0f172a" stroke-width="2.5" stroke-linejoin="round" />
        <ellipse cx="60" cy="94" rx="2" ry="3" fill="#0f172a" />
      </g>`;
  } else if (skin === 'blindfolded_sorcerer') {
    const isUnveiled = isCombo || comboCount >= 6 || mood === 'fire';
    frontAccessories += `
      <g id="sorcerer-attire">
        <path d="M24 82 L18 104 L102 104 L96 82 L82 88 L60 80 L38 88 Z" fill="#020617" stroke="#1e293b" stroke-width="2" />
        ${isUnveiled ? `
          <g id="sorcerer-unveiled">
            <path d="M26 38 L94 38 L92 30 L28 30 Z" fill="#09090b" stroke="#1e293b" stroke-width="1.8" />
            <g id="cosmic-eyes">
              <ellipse cx="44" cy="54" rx="8" ry="7" fill="#0284c7" />
              <circle cx="44" cy="54" r="5" fill="#38bdf8" />
              <circle cx="44" cy="54" r="2" fill="#ffffff" />
              <ellipse cx="76" cy="54" rx="8" ry="7" fill="#0284c7" />
              <circle cx="76" cy="54" r="5" fill="#38bdf8" />
              <circle cx="76" cy="54" r="2" fill="#ffffff" />
            </g>
          </g>
        ` : `
          <g id="sorcerer-blindfold">
            <path d="M24 46 L96 46 L94 64 L26 64 Z" fill="#09090b" stroke="#1e293b" stroke-width="2" />
            <line x1="26" y1="55" x2="94" y2="55" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="4 2" />
            <circle cx="92" cy="55" r="2" fill="#38bdf8" opacity="0.7" />
          </g>
        `}
      </g>`;
  } else if (skin === 'rubber_pirate') {
    frontAccessories += `
      <g id="pirate-vest">
        <path d="M22 84 L18 104 L44 104 L48 88 Z" fill="#b91c1c" stroke="#991b1b" stroke-width="1.5" />
        <path d="M98 84 L102 104 L76 104 L72 88 Z" fill="#b91c1c" stroke="#991b1b" stroke-width="1.5" />
        <path d="M38 64 Q42 67 46 64" stroke="#7f1d1d" stroke-width="1.5" stroke-linecap="round" fill="none" />
      </g>`;
  } else if (skin === 'hoodie_skeleton') {
    frontAccessories += `
      <g id="skeleton-hoodie">
        <path d="M14 36 Q18 16 60 14 Q102 16 106 36 Q100 24 60 22 Q20 24 14 36 Z" fill="#1e3a8a" stroke="#172554" stroke-width="2" />
        <path d="M14 36 Q10 60 18 96 Q22 54 22 36 Z" fill="#1e40af" opacity="0.95" />
        <path d="M106 36 Q110 60 102 96 Q98 54 98 36 Z" fill="#1e40af" opacity="0.95" />
        <path d="M46 72 Q60 76 74 72" stroke="#0f172a" stroke-width="2" fill="none" />
        <line x1="52" y1="69" x2="52" y2="74" stroke="#0f172a" stroke-width="1.5" />
        <line x1="60" y1="70" x2="60" y2="75" stroke="#0f172a" stroke-width="1.5" />
        <line x1="68" y1="69" x2="68" y2="74" stroke="#0f172a" stroke-width="1.5" />
        ${(isCombo || comboCount > 0) ? `
          <g id="bad-time-eye">
            <circle cx="44" cy="54" r="4.5" fill="#06b6d4" />
            <circle cx="44" cy="54" r="3" fill="#22d3ee" />
            <path d="M44 54 Q40 42 42 36 Q46 44 44 54 Z" fill="#67e8f9" opacity="0.8" />
          </g>
        ` : ''}
      </g>`;
  } else if (skin === 'urban_cyborg') {
    frontAccessories += `
      <g id="cyborg-jacket">
        <path d="M22 84 L16 106 L104 106 L98 84 L80 90 L60 82 L40 90 Z" fill="#eab308" stroke="#ca8a04" stroke-width="2" />
        <line x1="60" y1="82" x2="60" y2="106" stroke="#0f172a" stroke-width="2" />
        <rect x="94" y="44" width="5" height="24" rx="2" fill="#0f172a" stroke="#06b6d4" stroke-width="1" />
        <circle cx="96.5" cy="48" r="1.5" fill="#22d3ee" />
        <circle cx="96.5" cy="56" r="1.5" fill="#06b6d4" />
      </g>`;
  } else if (skin === 'demon_slayer') {
    frontAccessories += `
      <g id="demon-slayer-gear">
        <path d="M22 86 L18 104 L102 104 L98 86 Z" fill="#0f172a" stroke="#16a34a" stroke-width="1.5" />
        <rect x="36" y="88" width="12" height="12" fill="#16a34a" />
        <rect x="48" y="88" width="12" height="12" fill="#09090b" />
        <rect x="60" y="88" width="12" height="12" fill="#16a34a" />
        <rect x="72" y="88" width="12" height="12" fill="#09090b" />
        <rect x="18" y="60" width="6" height="14" rx="1" fill="#f8fafc" stroke="#dc2626" stroke-width="0.8" />
        <circle cx="21" cy="65" r="1.5" fill="#dc2626" />
        <rect x="96" y="60" width="6" height="14" rx="1" fill="#f8fafc" stroke="#dc2626" stroke-width="0.8" />
        <circle cx="99" cy="65" r="1.5" fill="#dc2626" />
      </g>`;
  } else if (skin === 'electric_rodent') {
    frontAccessories += `
      <g id="electric-rodent-cheeks">
        <circle cx="34" cy="66" r="6" fill="#ef4444" stroke="#dc2626" stroke-width="1" />
        <circle cx="86" cy="66" r="6" fill="#ef4444" stroke="#dc2626" stroke-width="1" />
      </g>`;
  } else if (skin === 'bored_hero') {
    frontAccessories += `
      <g id="bored-hero-gear">
        <path d="M22 84 L14 106 L106 106 L98 84 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
        <circle cx="32" cy="86" r="4.5" fill="#dc2626" stroke="#991b1b" stroke-width="1" />
        <circle cx="88" cy="86" r="4.5" fill="#dc2626" stroke="#991b1b" stroke-width="1" />
      </g>`;
  } else if (skin === 'needle_knight') {
    frontAccessories += `
      <g id="needle-knight-cloak">
        <path d="M22 80 Q60 74 98 80 L102 106 L18 106 Z" fill="#334155" stroke="#1e293b" stroke-width="1.5" />
        <line x1="102" y1="96" x2="114" y2="40" stroke="#e2e8f0" stroke-width="2" stroke-linecap="round" />
      </g>`;
  } else if (skin === 'shadow_crusader') {
    frontAccessories += `
      <g id="shadow-crusader-gear">
        <path d="M20 84 Q14 106 28 106 Q40 96 60 102 Q80 96 92 106 Q106 106 100 84 Z" fill="#09090b" stroke="#27272a" stroke-width="2" />
        <polygon points="36,52 48,56 46,62 36,58" fill="#ffffff" />
        <polygon points="84,52 72,56 74,62 84,58" fill="#ffffff" />
      </g>`;
  }

  // Aura de combo para o modo fogo
  let auraSvg = '';
  if (mood === 'fire' || isCombo || comboCount >= 8) {
    auraSvg = `
      <circle cx="60" cy="60" r="54" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6 3" opacity="0.6" />
      <circle cx="60" cy="60" r="58" fill="none" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.4" />
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      ${auraSvg}
      ${backAccessories}
      <!-- Monitor Chassis -->
      <g id="monitor-chassis">
        <ellipse cx="60" cy="112" rx="36" ry="6" fill="#000000" opacity="0.35" />
        <path d="M46 100 L50 106 L70 106 L74 100 Z" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
        <rect x="42" y="106" width="36" height="4" rx="2" fill="#1e293b" />
        <rect x="18" y="26" width="84" height="74" rx="14" fill="${chassisColor}" stroke="${chassisBorder}" stroke-width="3" />
        <path d="M24 30 L96 30" stroke="#475569" stroke-width="1.5" stroke-linecap="round" opacity="0.4" />
        ${chassisDetails}
      </g>
      <!-- CRT Screen -->
      <g id="crt-screen">
        <rect x="26" y="34" width="68" height="54" rx="9" fill="${screenBg}" stroke="#020617" stroke-width="2.5" />
        <line x1="28" y1="42" x2="92" y2="42" stroke="#ffffff" stroke-width="0.5" opacity="0.06" />
        <line x1="28" y1="50" x2="92" y2="50" stroke="#ffffff" stroke-width="0.5" opacity="0.06" />
        <line x1="28" y1="58" x2="92" y2="58" stroke="#ffffff" stroke-width="0.5" opacity="0.06" />
        <line x1="28" y1="66" x2="92" y2="66" stroke="#ffffff" stroke-width="0.5" opacity="0.06" />
        <line x1="28" y1="74" x2="92" y2="74" stroke="#ffffff" stroke-width="0.5" opacity="0.06" />
        <path d="M30 38 Q60 36 86 42 Q56 42 34 50 Z" fill="#ffffff" opacity="0.1" />
        <!-- Face Elements -->
        <g id="face-elements">
          <g id="left-eye">${leftEyeSvg}</g>
          <g id="right-eye">${rightEyeSvg}</g>
          <g id="mouth">${mouthSvg}</g>
        </g>
        ${screenOverlays}
      </g>
      ${frontAccessories}
    </svg>
  `.trim();
}
