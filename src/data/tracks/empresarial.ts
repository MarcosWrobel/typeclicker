import { CurricularTrackConfig } from '../../types';

export const EMPRESARIAL_TRACK: CurricularTrackConfig = {
  id: 'empresarial',
  name: 'Informática Empresarial',
  discipline: 'Informática Empresarial',
  targetAudience: '1º e 2º Anos (EM)',
  icon: '💼',
  badgeColor: 'purple',
  description: 'Planilhas eletrônicas, produtividade de escritório, redação empresarial, relatórios e ferramentas corporativas.',
  categories: [
    {
      id: 'iniciante',
      name: 'Iniciante',
      badge: 'Nível 1',
      levelNumber: 1,
      bonusMultiplier: 1.0,
      bonusLabel: '1.0x (Padrão)',
      themeColor: 'emerald',
      description: 'Termos de 3 a 5 letras do cotidiano corporativo: documentos, registros, custos e prazos.',
      words: [
        'doc', 'ata', 'data', 'nota', 'memo', 'guia', 'meta', 'pasta', 'copia', 'colar',
        'texto', 'fonte', 'foco', 'envio', 'prazo', 'soma', 'linha', 'vaga', 'lucro', 'custo',
        'caixa', 'saldo', 'cargo', 'meta', 'hora', 'plano', 'taxa', 'juro', 'setor', 'ramal',
        'bloco', 'ponto', 'folha', 'valor', 'total', 'grupo', 'termo', 'marca', 'anexo', 'aviso',
        'email', 'fluxo', 'meta', 'dado', 'guia', 'sede', 'fase', 'base', 'meta', 'venda'
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
      description: 'Planilhas e escritório (5 a 7 letras): células, fórmulas, atalhos, tabelas e comunicação.',
      words: [
        'planilha', 'célula', 'tabela', 'coluna', 'arquivo', 'atalho', 'salvar', 'imprimir',
        'filtro', 'backup', 'reunião', 'cliente', 'recibo', 'fatura', 'contrato', 'despesa',
        'receita', 'estoque', 'cotação', 'equipe', 'gestor', 'ofício', 'agenda', 'recado',
        'crédito', 'débito', 'boleto', 'tributo', 'cálculo', 'função', 'página', 'gráfico',
        'modelo', 'manual', 'trabalho', 'tarefa', 'projeto', 'rotina', 'quadro', 'painel'
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
      description: 'Funções avançadas e gestão (6 a 9 letras): fórmulas de planilhas, relatórios e processos.',
      words: [
        'relatório', 'fórmula', 'cabeçalho', 'rodapé', 'memorando', 'etiqueta', 'protocolo',
        'empresa', 'negócio', 'negociação', 'orçamento', 'provento', 'desconto', 'comissão',
        'auditoria', 'processo', 'parecer', 'certidão', 'recursos', 'logística', 'estratégia',
        'indicador', 'conversão', 'mercado', 'produção', 'operação', 'desempenho', 'pesquisa',
        'inventário', 'fornecedor', 'pagamento', 'cobrança', 'conferência', 'expedição', 'diretoria'
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
      description: 'Produtividade corporativa (8 a 13 letras): formatação condicional, tabelas dinâmicas e relatórios.',
      words: [
        'formatação', 'condicional', 'produtividade', 'correspondência', 'corporativo',
        'gerenciamento', 'organização', 'confidencial', 'faturamento', 'conciliação',
        'departamento', 'colaborativo', 'automação', 'comunicação', 'apresentação',
        'cronograma', 'rendimento', 'sustentabilidade', 'planejamento', 'estatística',
        'administração', 'competitividade', 'profissional', 'reestruturação'
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
      description: 'Gestão executiva e empresarial (11 a 18 letras): planejamento estratégico e governança.',
      words: [
        'telecomunicação', 'empreendedorismo', 'sustentabilidade', 'conformidade',
        'desburocratização', 'planejamento-estratégico', 'inteligência-competitiva',
        'responsabilidade-social', 'liderança-operacional', 'governança-corporativa',
        'interdisciplinaridade', 'transformação-digital', 'desenvolvimento-humano'
      ]
    }
  ]
};
