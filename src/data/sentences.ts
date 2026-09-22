import { CurricularTrackId, CategoryId } from '../types';

export interface TrackSentences {
  iniciante: string[];
  facil: string[];
  medio: string[];
  avancado: string[];
  expert: string[];
}

export const SENTENCES_BY_TRACK: Record<CurricularTrackId, TrackSentences> = {
  geral: {
    iniciante: [
      'O sol brilha no céu azul.',
      'A bola rola pelo chão da sala.',
      'O gato dorme na cama quente.',
      'O pato nada no lago calmo.',
      'A pipa voa alto com o vento forte.',
      'O dia está lindo para brincar.',
      'A flor do jardim tem uma bela cor.',
      'O rio corre depressa até o mar.',
      'A fruta doce caiu no prato.',
      'O lobo correu pela floresta verde.'
    ],
    facil: [
      'A leitura de livros abre portas para o conhecimento.',
      'Na escola, aprendemos a conviver e a respeitar os colegas.',
      'O pássaro construiu um lindo ninho no topo da árvore.',
      'A tecnologia aproxima pessoas que vivem distantes.',
      'Praticar exercícios melhora nossa saúde física e mental.',
      'A música transmite emoções que as palavras não explicam.',
      'Cada dia traz uma nova oportunidade de aprender algo bom.',
      'O vento suave balança as folhas das árvores no parque.',
      'Com esforço e dedicação, podemos alcançar nossos objetivos.',
      'A amizade verdadeira resiste ao tempo e às dificuldades.'
    ],
    medio: [
      'A gravidade mantém os planetas em órbita ao redor do Sol.',
      'A robótica e a inteligência artificial transformam o mundo moderno.',
      'O equilíbrio ecológico depende da preservação da biodiversidade.',
      'A eletricidade percorre circuitos condutores com grande velocidade.',
      'Grandes descobertas científicas surgiram da curiosidade humana.',
      'A atmosfera protege a Terra contra radiações solares perigosas.',
      'O sistema nervoso coordena as funções vitais de todo o organismo.',
      'A água é um recurso natural indispensável para a vida no planeta.',
      'O microscópio óptico revelou a existência de bactérias e células.',
      'A energia renovável reduz os impactos negativos no meio ambiente.'
    ],
    avancado: [
      'O desenvolvimento sustentável busca equilibrar a economia, a sociedade e o meio ambiente.',
      'A computação quântica promete solucionar cálculos complexos em frações de segundo.',
      'A comunicação interpessoal eficaz requer empatia, escuta ativa e clareza de ideias.',
      'A preservação do patrimônio histórico fortalece a identidade cultural de uma nação.',
      'A evolução dos processadores acelerou a digitalização de processos industriais e urbanos.',
      'O pensamento crítico permite aos cidadãos analisar informações e combater notícias falsas.',
      'A cooperação internacional é indispensável para enfrentar os desafios climáticos globais.',
      'A acessibilidade digital garante que pessoas com deficiência naveguem com autonomia na web.'
    ],
    expert: [
      'A interdisciplinaridade entre a neurociência e a inteligência artificial possibilita a modelagem de algoritmos bioinspirados altamente sofisticados.',
      'A epistemologia contemporânea questiona os fundamentos da certeza empírica em sistemas cibernéticos dinâmicos e adaptativos.',
      'A reestruturação socioeconômica exige políticas públicas sustentáveis, descentralização administrativa e governança participativa.',
      'O espectro eletromagnético viabiliza transmissões quânticas que garantem criptografia incondicional contra ataques computacionais externos.'
    ]
  },
  scratch: {
    iniciante: [
      'Quando a bandeira for clicada, mova 10 passos.',
      'Gire 15 graus para a direita e toque o som.',
      'Mude para a próxima fantasia e espere um segundo.',
      'Aponte para o ponteiro do mouse e deslize até lá.',
      'Defina o tamanho do ator para 100 por cento.',
      'Mostre o ator no palco e defina o volume.',
      'O gato anda pela tela e mia ao clicar.',
      'Toque a nota musical e mude a cor do efeito.',
      'Se tocar na borda da tela, volte devagar.',
      'Esconda o personagem até que o jogo comece.'
    ],
    facil: [
      'Sempre que a tecla espaço for pressionada, execute o pulo.',
      'Crie um clone deste ator quando a pontuação aumentar.',
      'Se o ator estiver tocando na cor vermelha, pare todos os sons.',
      'Pergunte o nome do jogador e espere pela resposta.',
      'Transmita a mensagem inicio e mude o cenário de fundo.',
      'Adicione 1 ponto à variável de placar a cada moeda coletada.',
      'Repita até que a distância até o alvo seja menor que dez.',
      'Mude o efeito de brilho para criar uma sensação mágica no jogo.',
      'Quando receber a mensagem vitória, mostre o troféu no palco.',
      'O sensor de colisão detecta quando o inimigo encosta no herói.'
    ],
    medio: [
      'Use blocos de controle condicional se e senão para definir a lógica do jogo.',
      'A física de gravidade diminui a velocidade vertical a cada iteração do loop.',
      'A comunicação entre diferentes atores ocorre através do envio de transmissões.',
      'O operador matemático aleatório sorteia a posição inicial dos obstáculos.',
      'Gerencie listas para armazenar o histórico dos melhores recordes da turma.',
      'Crie blocos personalizados para organizar e reutilizar rotinas repetitivas.',
      'A coordenada X controla a posição horizontal e o Y a altura do personagem.',
      'A detecção de colisão por raio de cor assegura que o herói pise na plataforma.'
    ],
    avancado: [
      'A sincronização de clones em múltiplos eventos requer gerenciamento rigoroso de variáveis locais.',
      'O algoritmo de inteligência artificial simples faz o inimigo perseguir as coordenadas do jogador.',
      'A arquitetura modular com Meus Blocos facilita a depuração e torna o código mais legível.',
      'O cronômetro interno mede o tempo de reação do estudante para conceder bônus de velocidade.'
    ],
    expert: [
      'A implementação de um motor de física 2D completo no Scratch exige matrizes de vetores e cálculo trigonométrico.',
      'Sistemas de jogos avançados utilizam pseudo-paralelismo através de disparadores customizados e broadcasting sem travamento.'
    ]
  },
  web: {
    iniciante: [
      'O elemento h1 define o título principal da página web.',
      'A tag p organiza os parágrafos de texto no corpo do documento.',
      'O atributo href especifica o link de destino no elemento a.',
      'A propriedade color altera a cor da fonte no arquivo CSS.',
      'A tag img exibe imagens usando os atributos src e alt.',
      'O seletor de classe aplica estilos aos elementos marcados.',
      'O display flex organiza itens em linhas ou colunas facilmente.',
      'A tag form agrupa campos de entrada para envio de dados.',
      'O botão envia os dados digitados através do evento click.',
      'O arquivo style.css contém as regras visuais do site.'
    ],
    facil: [
      'O box model é composto por margem, borda, preenchimento e conteúdo.',
      'A propriedade border-radius cria cantos arredondados modernos nos cartões.',
      'Com media queries, a página adapta seu layout para celulares e computadores.',
      'A pseudo-classe hover adiciona efeitos interativos quando o mouse passa por cima.',
      'O seletor de ID deve ser único para identificar apenas um elemento no DOM.',
      'A tag main representa o conteúdo central e exclusivo da aplicação web.',
      'O CSS Grid permite a criação de grades bidimensionais com linhas e colunas.',
      'A tag script conecta a lógica de JavaScript ao documento HTML.',
      'O atributo placeholder exibe uma dica dentro do campo de digitação.',
      'O footer geralmente contém direitos autorais, links úteis e contatos.'
    ],
    medio: [
      'O método addEventListener escuta interações do usuário sem poluir o código HTML.',
      'Funções assíncronas com async e await facilitam o consumo de dados de APIs externas.',
      'A manipulação do DOM via querySelector permite alterar classes e estilos dinamicamente.',
      'O localStorage armazena informações no navegador do cliente sem expirar ao fechar.',
      'As tags semânticas do HTML5 melhoram o posicionamento nos mecanismos de busca.',
      'A transição suave com transition torna as animações de botões fluidas e agradáveis.',
      'O método map transforma os itens de um array criando uma nova lista com os resultados.',
      'A validação de formulários no frontend evita o envio de dados incompletos ao servidor.'
    ],
    avancado: [
      'A arquitetura de componentes reutilizáveis melhora a manutenibilidade de aplicações web de grande porte.',
      'A desestruturação de objetos e arrays em JavaScript moderno torna o código mais limpo e expressivo.',
      'Técnicas de responsividade como clamp e unidades relativas garantem tipografia fluida em qualquer resolução.',
      'O tratamento de erros com blocos try e catch previne que falhas inesperadas interrompam a execução da aplicação.'
    ],
    expert: [
      'O Virtual DOM compara árvores de elementos na memória para renderizar apenas os nós alterados com máximo desempenho.',
      'A criação de interfaces com suporte a Progressive Web Apps permite funcionamento offline e notificações push em tempo real.'
    ]
  },
  empresarial: {
    iniciante: [
      'A ata da reunião foi aprovada por todos os presentes.',
      'O prazo de entrega do relatório vence nesta sexta-feira.',
      'A soma dos valores da coluna resultou no saldo total.',
      'O e-mail com a proposta comercial foi enviado ao cliente.',
      'O setor de compras aprovou a cotação com menor custo.',
      'A cópia do documento foi arquivada na pasta correta.',
      'O memorando interno informou o novo horário de trabalho.',
      'O saldo bancário positivo cobriu as despesas do mês.',
      'A nota fiscal eletrônica foi emitida para o fornecedor.',
      'O recibo de pagamento deve ser assinado e devolvido.'
    ],
    facil: [
      'A planilha eletrônica automatiza cálculos financeiros com rapidez e precisão.',
      'O filtro de dados permite localizar clientes por cidade ou volume de compras.',
      'A reunião de alinhamento definiu as metas da equipe para o próximo trimestre.',
      'O contrato de prestação de serviços foi revisado pelo departamento jurídico.',
      'O controle rigoroso de estoque evita o desperdício e a falta de mercadorias.',
      'A apresentação de slides resume os principais indicadores de desempenho do setor.',
      'O ofício formal solicitou a autorização para a compra de novos equipamentos.',
      'O gráfico em colunas demonstra o crescimento contínuo das vendas do projeto.',
      'A pontualidade nas entregas fortalece a credibilidade da empresa no mercado.',
      'A política de atendimento ao cliente prioriza a agilidade e a cordialidade.'
    ],
    medio: [
      'A função PROCV busca informações correlacionadas em diferentes abas da planilha de custos.',
      'A formatação condicional destaca automaticamente os valores abaixo da média esperada.',
      'O cronograma do projeto distribui tarefas entre os colaboradores com prazos definidos.',
      'A conciliação bancária diária garante a exatidão entre o extrato e os livros contábeis.',
      'O demonstrativo de resultados do exercício evidencia a lucratividade real da organização.',
      'A pesquisa de clima organizacional avalia o grau de satisfação e bem-estar dos funcionários.',
      'A auditoria interna identificou oportunidades para otimizar os fluxos de trabalho no setor.',
      'O planejamento orçamentário anual prevê investimentos em tecnologia e capacitação da equipe.'
    ],
    avancado: [
      'A tabela dinâmica consolida milhares de registros de vendas em relatórios executivos em poucos segundos.',
      'A comunicação empresarial assertiva evita ruídos, diminui retrabalhos e melhora a cooperação interpessoal.',
      'O gerenciamento estratégico de riscos antecipa cenários desfavoráveis e protege a liquidez da empresa.',
      'A transformação digital simplifica processos burocráticos e aumenta a produtividade de toda a organização.'
    ],
    expert: [
      'A governança corporativa transparente consolida a conformidade regulatória e atrai investimentos de longo prazo.',
      'O planejamento estratégico plurianual orienta a expansão mercadológica com responsabilidade socioambiental e sustentabilidade financeira.'
    ]
  },
  ingles: {
    iniciante: [
      'The book is on the desk next to the blue pen.',
      'The sun is shining in the clear blue sky.',
      'The dog is playing with a red ball in the park.',
      'Good morning to all students and teachers.',
      'We read stories and write words every day.',
      'The bird is singing on top of the green tree.',
      'I love to play games with my best friends.',
      'The water in the glass is cold and fresh.',
      'Open the door and look at the beautiful city.',
      'Time flies when we are having so much fun.'
    ],
    facil: [
      'The teacher explained the lesson clearly on the board.',
      'Our school has a modern library with thousands of books.',
      'Learning a new language opens wonderful opportunities in life.',
      'Technology connects people from different cultures around the world.',
      'We should protect nature, plant trees and keep rivers clean.',
      'Eating fresh fruits and drinking water improves your health.',
      'Practice makes perfect when you are learning how to type fast.',
      'The students completed their homework before going to the playground.',
      'Kindness and respect make our classroom a wonderful place to learn.',
      'The science experiment showed how plants absorb sunlight and water.'
    ],
    medio: [
      'Computer programming is an essential skill for the modern digital era.',
      'The internet allows people to communicate and share ideas instantly across continents.',
      'Critical thinking helps students analyze information and make responsible decisions.',
      'Renewable energy sources like solar and wind power reduce environmental pollution.',
      'The space telescope captured breathtaking images of distant galaxies and stars.',
      'Cooperation and teamwork are fundamental to solving complex global challenges.',
      'Reading books regularly expands your vocabulary and stimulates your imagination.',
      'Artificial intelligence is transforming education, medicine, and engineering worldwide.'
    ],
    avancado: [
      'Effective cross-cultural communication requires empathy, curiosity, and mutual understanding.',
      'Technological innovation should always prioritize human well-being and environmental sustainability.',
      'Mastering touch typing on the keyboard dramatically improves daily academic and professional productivity.',
      'Scientific research provides evidence-based solutions for public health and climate issues.'
    ],
    expert: [
      'The multidisciplinary collaboration between computer scientists and linguists enables advanced natural language processing architectures.',
      'Technological democratisation requires comprehensive public policies, accessible infrastructure, and inclusive digital education worldwide.'
    ]
  }
};

export function getRandomSentence(
  trackId?: CurricularTrackId | string | null,
  categoryId?: CategoryId | string | null,
  excludeSentence?: string
): string {
  const safeTrack = (trackId && trackId in SENTENCES_BY_TRACK) ? (trackId as CurricularTrackId) : 'geral';
  const safeCat = (categoryId && ['iniciante', 'facil', 'medio', 'avancado', 'expert'].includes(categoryId))
    ? (categoryId as CategoryId)
    : 'facil';

  const list = SENTENCES_BY_TRACK[safeTrack][safeCat] || SENTENCES_BY_TRACK.geral.facil;
  const filtered = list.filter(s => s !== excludeSentence);
  if (filtered.length === 0) return list[0] || 'Praticar digitação melhora sua agilidade.';
  return filtered[Math.floor(Math.random() * filtered.length)];
}
