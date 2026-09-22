import { CurricularTrackConfig } from '../../types';

export const SCRATCH_TRACK: CurricularTrackConfig = {
  id: 'scratch',
  name: 'Educação Digital (Scratch)',
  discipline: 'Educação Digital',
  targetAudience: '8º e 9º Anos',
  icon: '🧩',
  badgeColor: 'amber',
  description: 'Programação visual em blocos, lógica computacional, animações, eventos, variáveis e jogos no Scratch.',
  categories: [
    {
      id: 'iniciante',
      name: 'Iniciante',
      badge: 'Nível 1',
      levelNumber: 1,
      bonusMultiplier: 1.0,
      bonusLabel: '1.0x (Padrão)',
      themeColor: 'emerald',
      description: 'Termos rápidos de 3 a 5 letras do Scratch: atores, movimentos básicos, sons e ações fundamentais.',
      words: [
        'ator', 'som', 'cena', 'gato', 'tela', 'mover', 'passo', 'tecla', 'falar', 'tocar',
        'tempo', 'parar', 'ponto', 'raio', 'pulo', 'vida', 'reset', 'clique', 'fundo', 'mouse',
        'bloco', 'girar', 'mudar', 'eixo', 'anda', 'pula', 'fixa', 'olha', 'vira', 'abre',
        'soma', 'cria', 'leva', 'mostra', 'sinal', 'tempo', 'grau', 'graus', 'loop', 'sons',
        'borda', 'teste', 'caixa', 'mapa', 'fase', 'meta', 'item', 'alvo', 'pega', 'sobe',
        'desce', 'dano', 'nivel', 'placar', 'trava', 'inicia', 'marca', 'risco', 'traço', 'vetor',
        'cor', 'azul', 'verde', 'tom', 'nota', 'ritmo', 'palco', 'traje', 'pista', 'clon',
        'faixa', 'laser', 'robo', 'clone', 'salva', 'guarda', 'solta', 'arrasta', 'bico', 'bico'
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
      description: 'Conceitos essenciais de 5 a 7 letras: fantasias, cenários, laços simples e eventos de palco.',
      words: [
        'fantasia', 'cenário', 'evento', 'repita', 'quando', 'sempre', 'direção', 'deslize', 'efeitos',
        'volume', 'tamanho', 'colisão', 'resposta', 'pergunta', 'posição', 'sensor', 'ocultar', 'mostrar',
        'mensagem', 'clones', 'girando', 'tocando', 'esperar', 'definir', 'alterar', 'inserir', 'apagar',
        'caneta', 'carimbo', 'desenho', 'espelho', 'estilo', 'rotação', 'frontal', 'alcance', 'distância',
        'comando', 'bandeira', 'espaço', 'direita', 'esquerda', 'cenários', 'silêncio', 'reiniciar',
        'contorno', 'preencher', 'vetorial', 'camada', 'frente', 'trás', 'atrás', 'cronômetro', 'número',
        'aplique', 'arraste', 'brilho', 'camadas', 'captura', 'conexão', 'cordas', 'diálogo', 'escala',
        'estampa', 'estágio', 'fadeout', 'jogador', 'matizes', 'módulos', 'painéis', 'pintura', 'pixelar',
        'quadros', 'reverso', 'sombra', 'sons-fx', 'suporte', 'teclado', 'timbres', 'vínculo', 'vitória'
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
      description: 'Lógica e mecânica de jogos (6 a 9 letras): variáveis, operadores matemáticos, condicionais e mensagens.',
      words: [
        'variável', 'operador', 'controle', 'transmita', 'receber', 'aleatório', 'booleano', 'coordenada',
        'pontuação', 'velocidade', 'gravidade', 'animação', 'movimento', 'ambiente', 'contador', 'dimensão',
        'disparar', 'interação', 'limites', 'obstáculo', 'parâmetro', 'percurso', 'sequência', 'trajetória',
        'visibilidade', 'bloqueio', 'reproduzir', 'adicionar', 'multiplicar', 'subtrair', 'divisão',
        'igualdade', 'maiorque', 'menorque', 'conectores', 'condição', 'gatilho', 'estrutura', 'estratégia',
        'jogabilidade', 'personagem', 'protótipo', 'plataforma', 'partícula', 'projetil', 'vencedor', 'derrota',
        'aceleração', 'armazenar', 'atribuição', 'bloqueador', 'caixa-texto', 'calculado', 'comparação',
        'constante', 'decremento', 'deslocamento', 'detector', 'dimensões', 'frequência', 'geometria',
        'horizontal', 'ilustração', 'indicador', 'intervalo', 'mecanismo', 'notificação', 'orientação',
        'paralelo', 'projeção', 'propriedade', 'resistência', 'retroceder', 'segmento', 'simulação', 'vertical'
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
      description: 'Termos avançados (8 a 13 letras): paralelismo, sub-rotinas (Meus Blocos), broadcasting e depuração.',
      words: [
        'coordenadas', 'temporizador', 'condicional', 'paralelismo', 'broadcasting', 'depuração',
        'clonagem', 'repetição', 'iteração', 'parâmetros', 'incremento', 'decremento', 'inicialização',
        'algoritmo', 'modularidade', 'comutação', 'recursividade', 'otimização', 'reutilização',
        'customização', 'verificação', 'encapsulamento', 'especificação', 'interatividade',
        'pensamento', 'computacional', 'sincronismo', 'sensoriamento', 'responsividade',
        'estruturação', 'decomposição', 'generalização', 'rastreamento', 'transformação',
        'arredondamento', 'automação-jogos', 'característica', 'cinemática-2d', 'compartilhado',
        'compatibilidade', 'comportamento', 'configurações', 'customizável', 'descentralizado',
        'estruturado', 'gerenciamento', 'intercalação', 'interconectado', 'manipuladores',
        'multiplataforma', 'normalização', 'perspectiva', 'pixelização', 'programabilidade',
        'reconfiguração', 'retroalimentação', 'sincronização', 'temporizadores', 'vetorização'
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
      description: 'Domínio máximo de computação visual (11 a 18 letras): arquitetura de jogos e inteligência algorítmica.',
      words: [
        'modularização', 'sincronização', 'interoperabilidade', 'pseudo-código', 'reatividade',
        'lógica-booleana', 'inteligência-artificial', 'computabilidade', 'estruturação-lógica',
        'refatoração-código', 'paralelismo-eventos', 'reconhecimento-padrões', 'abstração-algorítmica',
        'depuração-sistemática', 'desenvolvimento-jogos', 'automação-processos', 'arquitetura-software',
        'inteligência-coletiva', 'processamento-eventos', 'otimização-algorítmica', 'interatividade-avançada',
        'programação-orientada', 'retrocompatibilidade', 'sincronismo-multiprocesso', 'decomposição-sistemas',
        'sistematização-lógica', 'modelagem-computacional', 'renderização-gráfica', 'autômato-finito'
      ]
    }
  ]
};
