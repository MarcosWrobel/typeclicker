import { WordCategory } from '../types';

export const WORD_CATEGORIES: WordCategory[] = [
  {
    id: 'iniciante',
    name: 'Iniciante',
    badge: 'Nível 1',
    levelNumber: 1,
    bonusMultiplier: 1.0,
    bonusLabel: '1.0x (Padrão)',
    themeColor: 'emerald',
    description: 'Palavras curtas de 3 a 5 letras sem acentuação. Ideal para aquecimento e domínio da posição dos dedos no teclado.',
    words: [
      'casa', 'bola', 'mesa', 'jogo', 'dado', 'sala', 'fada', 'faca', 'gato', 'rato',
      'pato', 'pipa', 'suco', 'lobo', 'vela', 'rio', 'sol', 'lua', 'mar', 'flor',
      'lama', 'cola', 'doce', 'pote', 'boca', 'dedo', 'sono', 'sapo', 'copo', 'bala',
      'bule', 'mato', 'fogo', 'navio', 'loja', 'anel', 'rede', 'foto', 'muro', 'piso',
      'lago', 'fita', 'urso', 'ovo', 'osso', 'nome', 'neve', 'mapa', 'mula', 'luva',
      'leite', 'lupa', 'galo', 'gelo', 'gota', 'gema', 'gula', 'frio', 'fome', 'fuga',
      'fila', 'fio', 'ferro', 'festa', 'dona', 'dente', 'dica', 'data', 'pano', 'pena',
      'pelo', 'peso', 'pino', 'povo', 'pneu', 'pulo', 'taco', 'teto', 'tubo', 'touro',
      'tinta', 'tese', 'teia', 'tela', 'tema', 'time', 'tipo', 'toma', 'urubu', 'vaca',
      'vaso', 'veia', 'vida', 'vila', 'voo', 'voto', 'vaga', 'valsa', 'verde', 'velho',
      'vento', 'vidro', 'zebu', 'zero', 'caixa', 'cama', 'cabo', 'cacau', 'caju', 'calor',
      'carro', 'carta', 'casco', 'banco', 'balsa', 'banda', 'barco', 'barro', 'beijo', 'belo',
      'bicho', 'bife', 'bloco', 'bolso', 'bomba', 'bordo', 'brisa', 'broto', 'bruxa', 'busto',
      'chave', 'chefe', 'choro', 'chuva', 'cinza', 'cinto', 'circo', 'cisne', 'claro', 'clube',
      'cobre', 'cofre', 'coisa', 'combo', 'conde', 'conta', 'conto', 'corpo', 'corte', 'corvo',
      'couro', 'cravo', 'crime', 'crise', 'cruel', 'culpa', 'curva', 'custo', 'prato', 'praia'
    ]
  },
  {
    id: 'facil',
    name: 'Fácil',
    badge: 'Nível 2',
    levelNumber: 2,
    bonusMultiplier: 1.25,
    bonusLabel: '+25% Bônus (1.25x)',
    themeColor: 'sky',
    description: 'Palavras cotidianas de 5 a 7 letras com introdução sutil a cedilha e acentos leves do dia a dia escolar.',
    words: [
      'amigo', 'escola', 'livro', 'papel', 'lousa', 'turma', 'tempo', 'sonho', 'tarde', 'mundo',
      'janela', 'porta', 'estudo', 'tarefa', 'caderno', 'braço', 'criança', 'praça', 'alegre', 'correr',
      'saltar', 'rápido', 'doçura', 'fácil', 'mágico', 'lápis', 'recreio', 'caneta', 'regra', 'quadro',
      'canção', 'jardim', 'abraço', 'brincar', 'poema', 'viagem', 'vento', 'campo', 'festa', 'terra',
      'música', 'maçã', 'balão', 'fogão', 'cão', 'pão', 'leão', 'peão', 'limão', 'botão',
      'violão', 'portão', 'mamão', 'feijão', 'melão', 'irmão', 'avião', 'cartão', 'paixão', 'canção',
      'lição', 'nação', 'ação', 'poço', 'moça', 'roça', 'taça', 'peça', 'laço', 'aço',
      'berço', 'terço', 'terça', 'força', 'calça', 'onça', 'dança', 'lança', 'pança', 'trança',
      'frança', 'alça', 'caçula', 'carroça', 'fumaça', 'árvore', 'óculos', 'índice', 'pêssego', 'pássaro',
      'cérebro', 'bússola', 'lâmpada', 'prêmio', 'glória', 'família', 'rádio', 'régua', 'relógio', 'série',
      'tênis', 'vôlei', 'túnel', 'vírus', 'álbum', 'bônus', 'fórum', 'tórax', 'líder', 'ímã',
      'órfão', 'fóssil', 'réptil', 'móvel', 'nível', 'útil', 'dócil', 'frágil', 'ágil', 'médico',
      'lógico', 'mágico', 'básico', 'físico', 'crítico', 'público', 'líquido', 'sólido', 'pálido', 'tímido',
      'vívido', 'cálido', 'rápido', 'lúcido', 'úmido', 'cálcio', 'sódio'
    ]
  },
  {
    id: 'medio',
    name: 'Médio',
    badge: 'Nível 3',
    levelNumber: 3,
    bonusMultiplier: 1.5,
    bonusLabel: '+50% Bônus (1.5x)',
    themeColor: 'amber',
    description: 'Termos de tecnologia e ciências (6 a 9 letras) com acentuação frequente (til, agudo, circunflexo) e ritmo dinâmico.',
    words: [
      'teclado', 'monitor', 'memória', 'sistema', 'arquivo', 'ciência', 'história', 'química', 'código', 'robótica',
      'matriz', 'janelas', 'internet', 'planeta', 'universo', 'energia', 'mecânica', 'prático', 'atenção', 'coração',
      'pressão', 'estação', 'leitura', 'desenho', 'desafio', 'software', 'projeto', 'máquina', 'comando', 'fórmula',
      'espírito', 'elétrico', 'biologia', 'botânica', 'biólogo', 'célula', 'núcleo', 'próton', 'elétron', 'átomo',
      'molécula', 'eclipse', 'galáxia', 'cometa', 'meteoro', 'órbita', 'gravidade', 'inércia', 'prisma', 'cálculo',
      'álgebra', 'equação', 'fração', 'decimal', 'polígono', 'triângulo', 'quadrado', 'círculo', 'esfera', 'pirâmide',
      'cilindro', 'hardware', 'servidor', 'backup', 'usuário', 'portal', 'página', 'domínio', 'diretório', 'variável',
      'objeto', 'método', 'sistema', 'lógica', 'kilobyte', 'megabyte', 'gigabyte', 'análise', 'pesquisa', 'ensaio',
      'teoria', 'técnica', 'solução', 'problema', 'questão', 'resposta', 'diálogo', 'síntese', 'redação', 'crônica',
      'estética', 'cultura', 'folclore', 'pintura', 'museu', 'artista', 'oxigênio', 'hidrogênio', 'nitrogênio',
      'carbono', 'magnésio', 'potássio', 'alumínio', 'cálcio', 'fósforo', 'enxofre', 'cloro'
    ]
  },
  {
    id: 'avancado',
    name: 'Avançado',
    badge: 'Nível 4',
    levelNumber: 4,
    bonusMultiplier: 2.0,
    bonusLabel: '+100% Bônus (2.0x)',
    themeColor: 'purple',
    description: 'Palavras longas de 8 a 13 letras com acentuação rigorosa, pontuação e alta exigência de fluência nas teclas.',
    words: [
      'programação', 'informática', 'inteligência', 'eletricidade', 'comunicação', 'organização',
      'pensamento', 'experiência', 'laboratório', 'dicionário', 'vocabulário', 'fenômeno', 'tecnologia',
      'sustentável', 'construção', 'estratégia', 'matemática', 'astronomia', 'processador', 'descoberta',
      'sociedade', 'navegação', 'resolução', 'percepção', 'geometria', 'psicologia', 'conhecimento',
      'imaginação', 'criatividade', 'civilização', 'temperatura', 'biodiversidade', 'investigação',
      'desenvolvedor', 'engenharia', 'algoritmo', 'criptografia', 'arquitetura', 'cibernética',
      'ciberespaço', 'virtualidade', 'digitalização', 'conectividade', 'interatividade',
      'acessibilidade', 'usabilidade', 'interface', 'plataforma', 'aplicativo',
      'habilidade', 'competência', 'proficiência', 'eficiência', 'produtividade',
      'qualidade', 'excelência', 'performance', 'rendimento', 'capacidade',
      'velocidade', 'agilidade', 'dinamismo', 'flexibilidade', 'adaptabilidade',
      'resiliência', 'persistência', 'consistência', 'coerência', 'pertinência',
      'relevância', 'importância', 'significância', 'abrangência', 'profundidade',
      'complexidade', 'simplicidade', 'pluralidade', 'diversidade', 'multiplicidade',
      'homogeneidade', 'heterogeneidade', 'estabilidade', 'instabilidade',
      'sustentabilidade', 'durabilidade', 'confiabilidade', 'previsibilidade',
      'probabilidade', 'possibilidade', 'viabilidade', 'factibilidade',
      'racionalidade', 'objetividade', 'subjetividade', 'relatividade',
      'proporcionalidade', 'intencionalidade', 'funcionalidade'
    ]
  },
  {
    id: 'expert',
    name: 'Expert',
    badge: 'Nível 5',
    levelNumber: 5,
    bonusMultiplier: 2.5,
    bonusLabel: '+150% Bônus (2.5x)',
    themeColor: 'rose',
    description: 'O teste supremo de velocidade e precisão: vocabulário acadêmico e técnico complexo de 11 a 18 letras.',
    words: [
      'desenvolvimento', 'sustentabilidade', 'responsabilidade', 'extraordinário', 'institucional',
      'paralelepípedo', 'infraestrutura', 'transformação', 'revolucionário', 'interdisciplinar',
      'telecomunicação', 'cinematográfico', 'biodiversidade', 'empreendedorismo', 'eletromagnético',
      'descentralizado', 'compartilhamento', 'conscientização', 'inconstitucional', 'multidisciplinar',
      'desproporcional', 'hiperatividade', 'contemporâneo', 'individualismo', 'reestruturação',
      'imprescindível', 'inquestionável', 'irrepreensível', 'incompreensível', 'incompatibilidade',
      'inconveniência', 'particularidade', 'peculiaridade', 'especificidade', 'singularidade',
      'vulnerabilidade', 'suscetibilidade', 'irredutibilidade', 'irreversibilidade',
      'irrevogabilidade', 'inviolabilidade', 'imprescindibilidade', 'incomensurabilidade',
      'internacionalização', 'constitucionalidade', 'institucionalização', 'instrumentalização',
      'desburocratização', 'descentralização', 'desmilitarização', 'desestatização',
      'desregulamentação', 'reestruturação', 'reconfiguração', 'ressignificação',
      'interoperabilidade', 'retrocompatibilidade', 'microprocessador', 'semicondutor',
      'nanotecnologia', 'biotecnologia', 'neurociência', 'paleobotânica',
      'paleontologia', 'microbiologia', 'epidemiologia', 'endocrinologia',
      'otorrinolaringologista', 'oftalmologista', 'dermatologista', 'cardiologista',
      'pneumologista', 'gastroenterologista', 'endocrinologista', 'neurologista',
      'psicopedagogia', 'psicomotricidade', 'neuropsicologia', 'linguística',
      'sociolinguística', 'psicolinguística', 'etnolinguística',
      'antropologia', 'arqueologia', 'epistemologia', 'hermenêutica',
      'fenomenologia', 'existencialismo', 'estruturalismo', 'pós-estruturalismo'
    ]
  }
];

export function getRandomWord(categoryId: string, excludeWord?: string): string {
  const category = WORD_CATEGORIES.find(c => c.id === categoryId) || WORD_CATEGORIES[0];
  const list = category.words.filter(w => w !== excludeWord);
  if (list.length === 0) return category.words[0] || 'linux';
  return list[Math.floor(Math.random() * list.length)];
}
