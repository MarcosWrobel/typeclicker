import { CurricularTrackConfig } from '../../types';

export const INGLES_TRACK: CurricularTrackConfig = {
  id: 'ingles',
  name: 'Língua Inglesa (Geral)',
  discipline: 'Língua Inglesa',
  targetAudience: 'Todas as Turmas',
  icon: '🇬🇧',
  badgeColor: 'blue',
  description: 'Vocabulário do dia a dia, verbos fundamentais, termos escolares e expressões úteis em inglês.',
  categories: [
    {
      id: 'iniciante',
      name: 'Iniciante',
      badge: 'Nível 1',
      levelNumber: 1,
      bonusMultiplier: 1.0,
      bonusLabel: '1.0x (Padrão)',
      themeColor: 'emerald',
      description: 'Short words (3 to 5 letters): colors, basic actions, everyday items and classroom objects.',
      words: [
        'book', 'door', 'desk', 'pen', 'red', 'blue', 'cat', 'dog', 'run', 'jump',
        'help', 'time', 'play', 'game', 'fast', 'slow', 'stop', 'look', 'read', 'hand',
        'head', 'bird', 'fish', 'tree', 'food', 'milk', 'good', 'love', 'open', 'city',
        'star', 'fire', 'moon', 'ship', 'car', 'boy', 'girl', 'ball', 'sun', 'sky',
        'rain', 'wind', 'snow', 'warm', 'cold', 'dark', 'gold', 'ring', 'home', 'road',
        'baby', 'boat', 'cake', 'cup', 'duck', 'egg', 'farm', 'frog', 'hill', 'king',
        'leaf', 'lion', 'nest', 'park', 'queen', 'rock', 'seed', 'song', 'wave', 'wood'
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
      description: 'Daily life & school (5 to 7 letters): family, feelings, activities and classroom routines.',
      words: [
        'school', 'student', 'teacher', 'pencil', 'yellow', 'orange', 'friend', 'family',
        'brother', 'sister', 'window', 'listen', 'speak', 'write', 'learn', 'lesson',
        'morning', 'night', 'clock', 'colors', 'animal', 'person', 'happy', 'little',
        'summer', 'winter', 'spring', 'planet', 'garden', 'market', 'doctor', 'driver',
        'street', 'number', 'answer', 'letter', 'bridge', 'silver', 'forest', 'valley',
        'artist', 'camera', 'castle', 'circle', 'coffee', 'cotton', 'crying', 'danger',
        'dinner', 'energy', 'fabric', 'flavor', 'flower', 'future', 'gentle', 'ground',
        'island', 'jacket', 'jungle', 'liquid', 'modern', 'nature', 'palace', 'picture'
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
      description: 'Intermediate English (6 to 9 letters): sciences, communication, history and adventures.',
      words: [
        'computer', 'keyboard', 'internet', 'question', 'tomorrow', 'yesterday', 'language',
        'exercise', 'challenge', 'homework', 'library', 'science', 'history', 'geography',
        'weather', 'holiday', 'journey', 'adventure', 'music', 'dialogue', 'sentence',
        'practice', 'together', 'discover', 'building', 'mountain', 'wildlife', 'universe',
        'creative', 'friendly', 'remember', 'calendar', 'hospital', 'airplane', 'activity',
        'algorithm', 'beautiful', 'butterfly', 'celebrate', 'champion', 'chemistry',
        'classroom', 'community', 'condition', 'continent', 'curiosity', 'delicious',
        'direction', 'ecosystem', 'education', 'emergency', 'emotional', 'fantastic',
        'generate', 'important', 'invention', 'knowledge', 'landscape', 'magnitude', 'navigator'
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
      description: 'Advanced vocabulary (8 to 13 letters): education, civilization, technology and critical thinking.',
      words: [
        'education', 'understanding', 'conversation', 'pronunciation', 'knowledge',
        'experience', 'dictionary', 'civilization', 'imagination', 'creativity',
        'technology', 'environment', 'connection', 'development', 'communication',
        'information', 'international', 'celebration', 'opportunity', 'generation',
        'collaboration', 'relationship', 'championship', 'organization', 'perspective',
        'accomplishment', 'biodiversity', 'computational', 'configuration', 'consciousness',
        'consideration', 'determination', 'differentiation', 'distinguished', 'encouragement',
        'extraordinary', 'globalization', 'infrastructure', 'instrumentation', 'investigation',
        'methodological', 'multicultural', 'neighborhood', 'qualification', 'responsibility'
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
      description: 'Mastery and academic fluency (11 to 18 letters): complex structures and global concepts.',
      words: [
        'internationalization', 'extraordinary', 'uninterrupted', 'responsibility',
        'comprehensive', 'multidisciplinary', 'sustainability', 'biodiversity',
        'interconnectedness', 'transformational', 'interdisciplinary', 'characteristics',
        'incomprehensible', 'telecommunications', 'entrepreneurship',
        'counterproductive', 'electromagnetism', 'environmentalism', 'hyperconnectivity',
        'institutionalized', 'interoperability', 'micromanagement', 'misunderstanding',
        'neurotransmitters', 'oversimplification', 'photosynthesis', 'unconventionality'
      ]
    }
  ]
};
