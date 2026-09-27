import { GameLevel } from './types';

export const SQL_EXTRA_LEVELS: GameLevel[] = [
  {
    id: 21,
    title: "Fase 21: Filtros com HAVING após GROUP BY",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Filtre apenas categorias que possuem mais de 5 produtos cadastrados",
    puzzleDescription: "Filtragem analítica sobre métricas agregadas em bancos de dados. Neste desafio prático você irá dominar Filtros com HAVING após GROUP BY aplicando código profissional.",
    initialCode: `-- Encontre categorias com mais de 5 itens:
SELECT categoria, COUNT(*) as total_produtos
FROM produtos
GROUP BY categoria
HAVING COUNT(*) > 5;`,
    hints: ["WHERE filtra linhas antes do agrupamento; HAVING filtra grupos.","Agrupe por categoria primeiro.","Adicione HAVING COUNT(*) > 5."],
    expectedConditionText: "GROUP BY categoria HAVING COUNT(*) > 5",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Filtros com HAVING após GROUP BY","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Filtros com HAVING após GROUP BY</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /GROUP\s+BY\s+categoria[\s\S]*HAVING\s+COUNT\s*\(\s*\*\s*\)\s*>\s*5/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 21!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: GROUP BY categoria HAVING COUNT(*) > 5',
      };
    },
  },
  {
    id: 22,
    title: "Fase 22: CASE WHEN Condicional",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Categorize clientes entre Ouro, Prata e Bronze pelo valor gasto",
    puzzleDescription: "Geração de colunas calculadas e classificação de registros dinamicamente. Neste desafio prático você irá dominar CASE WHEN Condicional aplicando código profissional.",
    initialCode: `SELECT nome, total_gasto,
  CASE 
    WHEN total_gasto >= 1000 THEN 'Ouro'
    WHEN total_gasto >= 500 THEN 'Prata'
    ELSE 'Bronze'
  END AS nivel_fidelidade
FROM clientes;`,
    hints: ["CASE WHEN funciona como o switch/if dentro de queries SQL.","Avalie as faixas de valor em ordem decrescente.","Finalize com END AS nome_da_coluna."],
    expectedConditionText: "CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CASE WHEN Condicional","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CASE WHEN Condicional</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CASE[\s\S]*WHEN\s+total_gasto\s*>=\s*1000[\s\S]*END\s+AS\s+nivel_fidelidade/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 22!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade',
      };
    },
  },
  {
    id: 23,
    title: "Fase 23: LEFT JOIN com Filtro de Inexistência (IS NULL)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Encontre clientes que nunca realizaram nenhum pedido",
    puzzleDescription: "Padrão essencial para campanhas de reativação e auditoria de cadastros. Neste desafio prático você irá dominar LEFT JOIN com Filtro de Inexistência (IS NULL) aplicando código profissional.",
    initialCode: `SELECT c.id, c.nome
FROM clientes c
LEFT JOIN pedidos p ON c.id = p.cliente_id
WHERE p.id IS NULL;`,
    hints: ["LEFT JOIN mantém todos os clientes mesmo sem correspondência em pedidos.","Para os clientes sem pedidos, as colunas de pedidos vêm como NULL.","WHERE p.id IS NULL localiza os clientes inativos."],
    expectedConditionText: "LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL",
    previewType: "site-component",
    previewMeta: {"componentTitle":"LEFT JOIN com Filtro de Inexistência (IS NULL)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">LEFT JOIN com Filtro de Inexistência (IS NULL)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LEFT\s+JOIN\s+pedidos[\s\S]*WHERE\s+p\.id\s+IS\s+NULL/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 23!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL',
      };
    },
  },
  {
    id: 24,
    title: "Fase 24: Common Table Expressions (WITH / CTE)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Organize uma subquery complexa usando a cláusula WITH (CTE)",
    puzzleDescription: "Estruturação elegante de consultas analíticas e relatórios executivos. Neste desafio prático você irá dominar Common Table Expressions (WITH / CTE) aplicando código profissional.",
    initialCode: `WITH PedidosRecentes AS (
  SELECT cliente_id, SUM(valor) as total
  FROM pedidos
  WHERE data >= '2026-01-01'
  GROUP BY cliente_id
)
SELECT c.nome, pr.total
FROM clientes c
JOIN PedidosRecentes pr ON c.id = pr.cliente_id;`,
    hints: ["WITH cria uma tabela temporária nomeada (CTE) para a query.","Torna relatórios gigantes muito mais fáceis de ler e manter.","Faça o JOIN final com a CTE."],
    expectedConditionText: "WITH PedidosRecentes AS (...) SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Common Table Expressions (WITH / CTE)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Common Table Expressions (WITH / CTE)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WITH\s+PedidosRecentes\s+AS\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 24!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WITH PedidosRecentes AS (...) SELECT ...',
      };
    },
  },
  {
    id: 25,
    title: "Fase 25: Funções de Janela: ROW_NUMBER()",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Numere pedidos sequencialmente por cliente com ROW_NUMBER()",
    puzzleDescription: "Ranking, paginação e identificação do registro mais recente por usuário. Neste desafio prático você irá dominar Funções de Janela: ROW_NUMBER() aplicando código profissional.",
    initialCode: `SELECT id, cliente_id, data, valor,
  ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC) as ordem_pedido
FROM pedidos;`,
    hints: ["Funções de janela calculam métricas sem agrupar nem esconder linhas.","PARTITION BY reinicia a contagem para cada cliente.","ORDER BY data DESC coloca o pedido mais recente como 1."],
    expectedConditionText: "ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: ROW_NUMBER()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: ROW_NUMBER()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /ROW_NUMBER\s*\(\s*\)\s*OVER\s*\(\s*PARTITION\s+BY\s+cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 25!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)',
      };
    },
  },
  {
    id: 26,
    title: "Fase 26: Funções de Janela: LAG() e LEAD()",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Compare o valor da venda atual com a venda anterior usando LAG()",
    puzzleDescription: "Análise de séries temporais, tendências financeiras e churn rate. Neste desafio prático você irá dominar Funções de Janela: LAG() e LEAD() aplicando código profissional.",
    initialCode: `SELECT data, valor,
  LAG(valor, 1) OVER (ORDER BY data) as venda_anterior
FROM vendas;`,
    hints: ["LAG busca o valor da linha anterior na ordenação.","Permite calcular crescimento percentual entre períodos.","LEAD faz o oposto, buscando a linha seguinte."],
    expectedConditionText: "LAG(valor, 1) OVER (ORDER BY data)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: LAG() e LEAD()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: LAG() e LEAD()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LAG\s*\(\s*valor\s*,\s*1\s*\)\s*OVER\s*\(\s*ORDER\s+BY\s+data\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 26!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LAG(valor, 1) OVER (ORDER BY data)',
      };
    },
  },
  {
    id: 27,
    title: "Fase 27: Criação de Índices para Performance",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie um índice B-Tree composto nas colunas mais buscadas",
    puzzleDescription: "Otimização fundamental de latência de banco de dados em produção. Neste desafio prático você irá dominar Criação de Índices para Performance aplicando código profissional.",
    initialCode: `CREATE INDEX idx_pedidos_cliente_data 
ON pedidos (cliente_id, data DESC);`,
    hints: ["Índices aceleram buscas de O(n) para O(log n).","Colunas usadas no WHERE e ORDER BY devem ser indexadas.","Evita table scans lentos em milhões de registros."],
    expectedConditionText: "CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Criação de Índices para Performance","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Criação de Índices para Performance</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+INDEX\s+idx_pedidos_cliente_data\s+ON\s+pedidos\s*\(\s*cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 27!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)',
      };
    },
  },
  {
    id: 28,
    title: "Fase 28: Subquery Correlacionada com EXISTS",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Filtre produtos que possuem movimentação no estoque usando EXISTS",
    puzzleDescription: "Verificação rápida de relacionamento entre tabelas pai e filho. Neste desafio prático você irá dominar Subquery Correlacionada com EXISTS aplicando código profissional.",
    initialCode: `SELECT p.id, p.nome
FROM produtos p
WHERE EXISTS (
  SELECT 1 FROM estoque e 
  WHERE e.produto_id = p.id AND e.quantidade > 0
);`,
    hints: ["EXISTS encerra a busca assim que encontra o primeiro registro correspondente.","Mais rápido que IN em tabelas volumosas.","Verifica e.produto_id = p.id."],
    expectedConditionText: "WHERE EXISTS (SELECT 1 FROM estoque ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Subquery Correlacionada com EXISTS","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Subquery Correlacionada com EXISTS</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WHERE\s+EXISTS\s*\(\s*SELECT/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 28!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WHERE EXISTS (SELECT 1 FROM estoque ...)',
      };
    },
  },
  {
    id: 29,
    title: "Fase 29: Transações ACID: COMMIT e ROLLBACK",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Estruture uma transferência bancária atômica com transação segura",
    puzzleDescription: "Integridade de dados bancários, estoques e reservas concorrentes. Neste desafio prático você irá dominar Transações ACID: COMMIT e ROLLBACK aplicando código profissional.",
    initialCode: `BEGIN TRANSACTION;

UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;

COMMIT;`,
    hints: ["Transações garantem atomicidade: ou tudo passa ou nada muda.","Se houver falha, usa-se ROLLBACK para desfazer.","Finalize com COMMIT para gravar os dados de forma permanente."],
    expectedConditionText: "BEGIN TRANSACTION; ... COMMIT;",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Transações ACID: COMMIT e ROLLBACK","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Transações ACID: COMMIT e ROLLBACK</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /BEGIN\s+TRANSACTION;[\s\S]*COMMIT;/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 29!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: BEGIN TRANSACTION; ... COMMIT;',
      };
    },
  },
  {
    id: 30,
    title: "Fase 30: Views para Dashboards (CREATE VIEW)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma visualização (VIEW) simplificada de vendas mensais",
    puzzleDescription: "Construção de relatórios e isolamento de complexidade de dados. Neste desafio prático você irá dominar Views para Dashboards (CREATE VIEW) aplicando código profissional.",
    initialCode: `CREATE VIEW vw_vendas_resumo AS
SELECT 
  strftime('%Y-%m', data) as mes,
  COUNT(*) as total_pedidos,
  SUM(valor) as receita_total
FROM pedidos
GROUP BY mes;`,
    hints: ["Views encapsulam queries complexas como se fossem tabelas virtuais.","Simplifica o acesso para sistemas de BI e painéis analíticos.","Otimiza segurança ocultando tabelas sensíveis de baixo nível."],
    expectedConditionText: "CREATE VIEW vw_vendas_resumo AS SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Views para Dashboards (CREATE VIEW)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Views para Dashboards (CREATE VIEW)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+VIEW\s+vw_vendas_resumo\s+AS/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 30!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE VIEW vw_vendas_resumo AS SELECT ...',
      };
    },
  },
  {
    id: 31,
    title: "Fase 31: Filtros com HAVING após GROUP BY (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Filtre apenas categorias que possuem mais de 5 produtos cadastrados com rigor de produção",
    puzzleDescription: "Filtragem analítica sobre métricas agregadas em bancos de dados. Neste desafio prático você irá dominar Filtros com HAVING após GROUP BY aplicando código profissional.",
    initialCode: `-- Encontre categorias com mais de 5 itens:
SELECT categoria, COUNT(*) as total_produtos
FROM produtos
GROUP BY categoria
HAVING COUNT(*) > 5;`,
    hints: ["WHERE filtra linhas antes do agrupamento; HAVING filtra grupos.","Agrupe por categoria primeiro.","Adicione HAVING COUNT(*) > 5."],
    expectedConditionText: "GROUP BY categoria HAVING COUNT(*) > 5",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Filtros com HAVING após GROUP BY","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Filtros com HAVING após GROUP BY</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /GROUP\s+BY\s+categoria[\s\S]*HAVING\s+COUNT\s*\(\s*\*\s*\)\s*>\s*5/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 31!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: GROUP BY categoria HAVING COUNT(*) > 5',
      };
    },
  },
  {
    id: 32,
    title: "Fase 32: CASE WHEN Condicional (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Categorize clientes entre Ouro, Prata e Bronze pelo valor gasto com rigor de produção",
    puzzleDescription: "Geração de colunas calculadas e classificação de registros dinamicamente. Neste desafio prático você irá dominar CASE WHEN Condicional aplicando código profissional.",
    initialCode: `SELECT nome, total_gasto,
  CASE 
    WHEN total_gasto >= 1000 THEN 'Ouro'
    WHEN total_gasto >= 500 THEN 'Prata'
    ELSE 'Bronze'
  END AS nivel_fidelidade
FROM clientes;`,
    hints: ["CASE WHEN funciona como o switch/if dentro de queries SQL.","Avalie as faixas de valor em ordem decrescente.","Finalize com END AS nome_da_coluna."],
    expectedConditionText: "CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CASE WHEN Condicional","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CASE WHEN Condicional</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CASE[\s\S]*WHEN\s+total_gasto\s*>=\s*1000[\s\S]*END\s+AS\s+nivel_fidelidade/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 32!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade',
      };
    },
  },
  {
    id: 33,
    title: "Fase 33: LEFT JOIN com Filtro de Inexistência (IS NULL) (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Encontre clientes que nunca realizaram nenhum pedido com rigor de produção",
    puzzleDescription: "Padrão essencial para campanhas de reativação e auditoria de cadastros. Neste desafio prático você irá dominar LEFT JOIN com Filtro de Inexistência (IS NULL) aplicando código profissional.",
    initialCode: `SELECT c.id, c.nome
FROM clientes c
LEFT JOIN pedidos p ON c.id = p.cliente_id
WHERE p.id IS NULL;`,
    hints: ["LEFT JOIN mantém todos os clientes mesmo sem correspondência em pedidos.","Para os clientes sem pedidos, as colunas de pedidos vêm como NULL.","WHERE p.id IS NULL localiza os clientes inativos."],
    expectedConditionText: "LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL",
    previewType: "site-component",
    previewMeta: {"componentTitle":"LEFT JOIN com Filtro de Inexistência (IS NULL)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">LEFT JOIN com Filtro de Inexistência (IS NULL)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LEFT\s+JOIN\s+pedidos[\s\S]*WHERE\s+p\.id\s+IS\s+NULL/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 33!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL',
      };
    },
  },
  {
    id: 34,
    title: "Fase 34: Common Table Expressions (WITH / CTE) (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Organize uma subquery complexa usando a cláusula WITH (CTE) com rigor de produção",
    puzzleDescription: "Estruturação elegante de consultas analíticas e relatórios executivos. Neste desafio prático você irá dominar Common Table Expressions (WITH / CTE) aplicando código profissional.",
    initialCode: `WITH PedidosRecentes AS (
  SELECT cliente_id, SUM(valor) as total
  FROM pedidos
  WHERE data >= '2026-01-01'
  GROUP BY cliente_id
)
SELECT c.nome, pr.total
FROM clientes c
JOIN PedidosRecentes pr ON c.id = pr.cliente_id;`,
    hints: ["WITH cria uma tabela temporária nomeada (CTE) para a query.","Torna relatórios gigantes muito mais fáceis de ler e manter.","Faça o JOIN final com a CTE."],
    expectedConditionText: "WITH PedidosRecentes AS (...) SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Common Table Expressions (WITH / CTE)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Common Table Expressions (WITH / CTE)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WITH\s+PedidosRecentes\s+AS\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 34!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WITH PedidosRecentes AS (...) SELECT ...',
      };
    },
  },
  {
    id: 35,
    title: "Fase 35: Funções de Janela: ROW_NUMBER() (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Numere pedidos sequencialmente por cliente com ROW_NUMBER() com rigor de produção",
    puzzleDescription: "Ranking, paginação e identificação do registro mais recente por usuário. Neste desafio prático você irá dominar Funções de Janela: ROW_NUMBER() aplicando código profissional.",
    initialCode: `SELECT id, cliente_id, data, valor,
  ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC) as ordem_pedido
FROM pedidos;`,
    hints: ["Funções de janela calculam métricas sem agrupar nem esconder linhas.","PARTITION BY reinicia a contagem para cada cliente.","ORDER BY data DESC coloca o pedido mais recente como 1."],
    expectedConditionText: "ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: ROW_NUMBER()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: ROW_NUMBER()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /ROW_NUMBER\s*\(\s*\)\s*OVER\s*\(\s*PARTITION\s+BY\s+cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 35!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)',
      };
    },
  },
  {
    id: 36,
    title: "Fase 36: Funções de Janela: LAG() e LEAD() (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Compare o valor da venda atual com a venda anterior usando LAG() com rigor de produção",
    puzzleDescription: "Análise de séries temporais, tendências financeiras e churn rate. Neste desafio prático você irá dominar Funções de Janela: LAG() e LEAD() aplicando código profissional.",
    initialCode: `SELECT data, valor,
  LAG(valor, 1) OVER (ORDER BY data) as venda_anterior
FROM vendas;`,
    hints: ["LAG busca o valor da linha anterior na ordenação.","Permite calcular crescimento percentual entre períodos.","LEAD faz o oposto, buscando a linha seguinte."],
    expectedConditionText: "LAG(valor, 1) OVER (ORDER BY data)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: LAG() e LEAD()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: LAG() e LEAD()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LAG\s*\(\s*valor\s*,\s*1\s*\)\s*OVER\s*\(\s*ORDER\s+BY\s+data\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 36!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LAG(valor, 1) OVER (ORDER BY data)',
      };
    },
  },
  {
    id: 37,
    title: "Fase 37: Criação de Índices para Performance (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie um índice B-Tree composto nas colunas mais buscadas com rigor de produção",
    puzzleDescription: "Otimização fundamental de latência de banco de dados em produção. Neste desafio prático você irá dominar Criação de Índices para Performance aplicando código profissional.",
    initialCode: `CREATE INDEX idx_pedidos_cliente_data 
ON pedidos (cliente_id, data DESC);`,
    hints: ["Índices aceleram buscas de O(n) para O(log n).","Colunas usadas no WHERE e ORDER BY devem ser indexadas.","Evita table scans lentos em milhões de registros."],
    expectedConditionText: "CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Criação de Índices para Performance","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Criação de Índices para Performance</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+INDEX\s+idx_pedidos_cliente_data\s+ON\s+pedidos\s*\(\s*cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 37!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)',
      };
    },
  },
  {
    id: 38,
    title: "Fase 38: Subquery Correlacionada com EXISTS (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Filtre produtos que possuem movimentação no estoque usando EXISTS com rigor de produção",
    puzzleDescription: "Verificação rápida de relacionamento entre tabelas pai e filho. Neste desafio prático você irá dominar Subquery Correlacionada com EXISTS aplicando código profissional.",
    initialCode: `SELECT p.id, p.nome
FROM produtos p
WHERE EXISTS (
  SELECT 1 FROM estoque e 
  WHERE e.produto_id = p.id AND e.quantidade > 0
);`,
    hints: ["EXISTS encerra a busca assim que encontra o primeiro registro correspondente.","Mais rápido que IN em tabelas volumosas.","Verifica e.produto_id = p.id."],
    expectedConditionText: "WHERE EXISTS (SELECT 1 FROM estoque ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Subquery Correlacionada com EXISTS","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Subquery Correlacionada com EXISTS</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WHERE\s+EXISTS\s*\(\s*SELECT/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 38!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WHERE EXISTS (SELECT 1 FROM estoque ...)',
      };
    },
  },
  {
    id: 39,
    title: "Fase 39: Transações ACID: COMMIT e ROLLBACK (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Estruture uma transferência bancária atômica com transação segura com rigor de produção",
    puzzleDescription: "Integridade de dados bancários, estoques e reservas concorrentes. Neste desafio prático você irá dominar Transações ACID: COMMIT e ROLLBACK aplicando código profissional.",
    initialCode: `BEGIN TRANSACTION;

UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;

COMMIT;`,
    hints: ["Transações garantem atomicidade: ou tudo passa ou nada muda.","Se houver falha, usa-se ROLLBACK para desfazer.","Finalize com COMMIT para gravar os dados de forma permanente."],
    expectedConditionText: "BEGIN TRANSACTION; ... COMMIT;",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Transações ACID: COMMIT e ROLLBACK","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Transações ACID: COMMIT e ROLLBACK</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /BEGIN\s+TRANSACTION;[\s\S]*COMMIT;/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 39!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: BEGIN TRANSACTION; ... COMMIT;',
      };
    },
  },
  {
    id: 40,
    title: "Fase 40: Views para Dashboards (CREATE VIEW) (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma visualização (VIEW) simplificada de vendas mensais com rigor de produção",
    puzzleDescription: "Construção de relatórios e isolamento de complexidade de dados. Neste desafio prático você irá dominar Views para Dashboards (CREATE VIEW) aplicando código profissional.",
    initialCode: `CREATE VIEW vw_vendas_resumo AS
SELECT 
  strftime('%Y-%m', data) as mes,
  COUNT(*) as total_pedidos,
  SUM(valor) as receita_total
FROM pedidos
GROUP BY mes;`,
    hints: ["Views encapsulam queries complexas como se fossem tabelas virtuais.","Simplifica o acesso para sistemas de BI e painéis analíticos.","Otimiza segurança ocultando tabelas sensíveis de baixo nível."],
    expectedConditionText: "CREATE VIEW vw_vendas_resumo AS SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Views para Dashboards (CREATE VIEW)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Views para Dashboards (CREATE VIEW)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+VIEW\s+vw_vendas_resumo\s+AS/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 40!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE VIEW vw_vendas_resumo AS SELECT ...',
      };
    },
  },
  {
    id: 41,
    title: "Fase 41: Filtros com HAVING após GROUP BY (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Filtre apenas categorias que possuem mais de 5 produtos cadastrados com rigor de produção",
    puzzleDescription: "Filtragem analítica sobre métricas agregadas em bancos de dados. Neste desafio prático você irá dominar Filtros com HAVING após GROUP BY aplicando código profissional.",
    initialCode: `-- Encontre categorias com mais de 5 itens:
SELECT categoria, COUNT(*) as total_produtos
FROM produtos
GROUP BY categoria
HAVING COUNT(*) > 5;`,
    hints: ["WHERE filtra linhas antes do agrupamento; HAVING filtra grupos.","Agrupe por categoria primeiro.","Adicione HAVING COUNT(*) > 5."],
    expectedConditionText: "GROUP BY categoria HAVING COUNT(*) > 5",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Filtros com HAVING após GROUP BY","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Filtros com HAVING após GROUP BY</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /GROUP\s+BY\s+categoria[\s\S]*HAVING\s+COUNT\s*\(\s*\*\s*\)\s*>\s*5/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 41!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: GROUP BY categoria HAVING COUNT(*) > 5',
      };
    },
  },
  {
    id: 42,
    title: "Fase 42: CASE WHEN Condicional (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Categorize clientes entre Ouro, Prata e Bronze pelo valor gasto com rigor de produção",
    puzzleDescription: "Geração de colunas calculadas e classificação de registros dinamicamente. Neste desafio prático você irá dominar CASE WHEN Condicional aplicando código profissional.",
    initialCode: `SELECT nome, total_gasto,
  CASE 
    WHEN total_gasto >= 1000 THEN 'Ouro'
    WHEN total_gasto >= 500 THEN 'Prata'
    ELSE 'Bronze'
  END AS nivel_fidelidade
FROM clientes;`,
    hints: ["CASE WHEN funciona como o switch/if dentro de queries SQL.","Avalie as faixas de valor em ordem decrescente.","Finalize com END AS nome_da_coluna."],
    expectedConditionText: "CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CASE WHEN Condicional","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CASE WHEN Condicional</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CASE[\s\S]*WHEN\s+total_gasto\s*>=\s*1000[\s\S]*END\s+AS\s+nivel_fidelidade/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 42!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade',
      };
    },
  },
  {
    id: 43,
    title: "Fase 43: LEFT JOIN com Filtro de Inexistência (IS NULL) (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Encontre clientes que nunca realizaram nenhum pedido com rigor de produção",
    puzzleDescription: "Padrão essencial para campanhas de reativação e auditoria de cadastros. Neste desafio prático você irá dominar LEFT JOIN com Filtro de Inexistência (IS NULL) aplicando código profissional.",
    initialCode: `SELECT c.id, c.nome
FROM clientes c
LEFT JOIN pedidos p ON c.id = p.cliente_id
WHERE p.id IS NULL;`,
    hints: ["LEFT JOIN mantém todos os clientes mesmo sem correspondência em pedidos.","Para os clientes sem pedidos, as colunas de pedidos vêm como NULL.","WHERE p.id IS NULL localiza os clientes inativos."],
    expectedConditionText: "LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL",
    previewType: "site-component",
    previewMeta: {"componentTitle":"LEFT JOIN com Filtro de Inexistência (IS NULL)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">LEFT JOIN com Filtro de Inexistência (IS NULL)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LEFT\s+JOIN\s+pedidos[\s\S]*WHERE\s+p\.id\s+IS\s+NULL/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 43!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL',
      };
    },
  },
  {
    id: 44,
    title: "Fase 44: Common Table Expressions (WITH / CTE) (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Organize uma subquery complexa usando a cláusula WITH (CTE) com rigor de produção",
    puzzleDescription: "Estruturação elegante de consultas analíticas e relatórios executivos. Neste desafio prático você irá dominar Common Table Expressions (WITH / CTE) aplicando código profissional.",
    initialCode: `WITH PedidosRecentes AS (
  SELECT cliente_id, SUM(valor) as total
  FROM pedidos
  WHERE data >= '2026-01-01'
  GROUP BY cliente_id
)
SELECT c.nome, pr.total
FROM clientes c
JOIN PedidosRecentes pr ON c.id = pr.cliente_id;`,
    hints: ["WITH cria uma tabela temporária nomeada (CTE) para a query.","Torna relatórios gigantes muito mais fáceis de ler e manter.","Faça o JOIN final com a CTE."],
    expectedConditionText: "WITH PedidosRecentes AS (...) SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Common Table Expressions (WITH / CTE)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Common Table Expressions (WITH / CTE)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WITH\s+PedidosRecentes\s+AS\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 44!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WITH PedidosRecentes AS (...) SELECT ...',
      };
    },
  },
  {
    id: 45,
    title: "Fase 45: Funções de Janela: ROW_NUMBER() (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Numere pedidos sequencialmente por cliente com ROW_NUMBER() com rigor de produção",
    puzzleDescription: "Ranking, paginação e identificação do registro mais recente por usuário. Neste desafio prático você irá dominar Funções de Janela: ROW_NUMBER() aplicando código profissional.",
    initialCode: `SELECT id, cliente_id, data, valor,
  ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC) as ordem_pedido
FROM pedidos;`,
    hints: ["Funções de janela calculam métricas sem agrupar nem esconder linhas.","PARTITION BY reinicia a contagem para cada cliente.","ORDER BY data DESC coloca o pedido mais recente como 1."],
    expectedConditionText: "ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: ROW_NUMBER()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: ROW_NUMBER()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /ROW_NUMBER\s*\(\s*\)\s*OVER\s*\(\s*PARTITION\s+BY\s+cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 45!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)',
      };
    },
  },
  {
    id: 46,
    title: "Fase 46: Funções de Janela: LAG() e LEAD() (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Compare o valor da venda atual com a venda anterior usando LAG() com rigor de produção",
    puzzleDescription: "Análise de séries temporais, tendências financeiras e churn rate. Neste desafio prático você irá dominar Funções de Janela: LAG() e LEAD() aplicando código profissional.",
    initialCode: `SELECT data, valor,
  LAG(valor, 1) OVER (ORDER BY data) as venda_anterior
FROM vendas;`,
    hints: ["LAG busca o valor da linha anterior na ordenação.","Permite calcular crescimento percentual entre períodos.","LEAD faz o oposto, buscando a linha seguinte."],
    expectedConditionText: "LAG(valor, 1) OVER (ORDER BY data)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: LAG() e LEAD()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: LAG() e LEAD()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LAG\s*\(\s*valor\s*,\s*1\s*\)\s*OVER\s*\(\s*ORDER\s+BY\s+data\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 46!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LAG(valor, 1) OVER (ORDER BY data)',
      };
    },
  },
  {
    id: 47,
    title: "Fase 47: Criação de Índices para Performance (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie um índice B-Tree composto nas colunas mais buscadas com rigor de produção",
    puzzleDescription: "Otimização fundamental de latência de banco de dados em produção. Neste desafio prático você irá dominar Criação de Índices para Performance aplicando código profissional.",
    initialCode: `CREATE INDEX idx_pedidos_cliente_data 
ON pedidos (cliente_id, data DESC);`,
    hints: ["Índices aceleram buscas de O(n) para O(log n).","Colunas usadas no WHERE e ORDER BY devem ser indexadas.","Evita table scans lentos em milhões de registros."],
    expectedConditionText: "CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Criação de Índices para Performance","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Criação de Índices para Performance</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+INDEX\s+idx_pedidos_cliente_data\s+ON\s+pedidos\s*\(\s*cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 47!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)',
      };
    },
  },
  {
    id: 48,
    title: "Fase 48: Subquery Correlacionada com EXISTS (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Filtre produtos que possuem movimentação no estoque usando EXISTS com rigor de produção",
    puzzleDescription: "Verificação rápida de relacionamento entre tabelas pai e filho. Neste desafio prático você irá dominar Subquery Correlacionada com EXISTS aplicando código profissional.",
    initialCode: `SELECT p.id, p.nome
FROM produtos p
WHERE EXISTS (
  SELECT 1 FROM estoque e 
  WHERE e.produto_id = p.id AND e.quantidade > 0
);`,
    hints: ["EXISTS encerra a busca assim que encontra o primeiro registro correspondente.","Mais rápido que IN em tabelas volumosas.","Verifica e.produto_id = p.id."],
    expectedConditionText: "WHERE EXISTS (SELECT 1 FROM estoque ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Subquery Correlacionada com EXISTS","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Subquery Correlacionada com EXISTS</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WHERE\s+EXISTS\s*\(\s*SELECT/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 48!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WHERE EXISTS (SELECT 1 FROM estoque ...)',
      };
    },
  },
  {
    id: 49,
    title: "Fase 49: Transações ACID: COMMIT e ROLLBACK (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Estruture uma transferência bancária atômica com transação segura com rigor de produção",
    puzzleDescription: "Integridade de dados bancários, estoques e reservas concorrentes. Neste desafio prático você irá dominar Transações ACID: COMMIT e ROLLBACK aplicando código profissional.",
    initialCode: `BEGIN TRANSACTION;

UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;

COMMIT;`,
    hints: ["Transações garantem atomicidade: ou tudo passa ou nada muda.","Se houver falha, usa-se ROLLBACK para desfazer.","Finalize com COMMIT para gravar os dados de forma permanente."],
    expectedConditionText: "BEGIN TRANSACTION; ... COMMIT;",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Transações ACID: COMMIT e ROLLBACK","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Transações ACID: COMMIT e ROLLBACK</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /BEGIN\s+TRANSACTION;[\s\S]*COMMIT;/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 49!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: BEGIN TRANSACTION; ... COMMIT;',
      };
    },
  },
  {
    id: 50,
    title: "Fase 50: Views para Dashboards (CREATE VIEW) (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma visualização (VIEW) simplificada de vendas mensais com rigor de produção",
    puzzleDescription: "Construção de relatórios e isolamento de complexidade de dados. Neste desafio prático você irá dominar Views para Dashboards (CREATE VIEW) aplicando código profissional.",
    initialCode: `CREATE VIEW vw_vendas_resumo AS
SELECT 
  strftime('%Y-%m', data) as mes,
  COUNT(*) as total_pedidos,
  SUM(valor) as receita_total
FROM pedidos
GROUP BY mes;`,
    hints: ["Views encapsulam queries complexas como se fossem tabelas virtuais.","Simplifica o acesso para sistemas de BI e painéis analíticos.","Otimiza segurança ocultando tabelas sensíveis de baixo nível."],
    expectedConditionText: "CREATE VIEW vw_vendas_resumo AS SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Views para Dashboards (CREATE VIEW)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Views para Dashboards (CREATE VIEW)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+VIEW\s+vw_vendas_resumo\s+AS/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 50!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE VIEW vw_vendas_resumo AS SELECT ...',
      };
    },
  },
  {
    id: 51,
    title: "Fase 51: Filtros com HAVING após GROUP BY (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Filtre apenas categorias que possuem mais de 5 produtos cadastrados com rigor de produção",
    puzzleDescription: "Filtragem analítica sobre métricas agregadas em bancos de dados. Neste desafio prático você irá dominar Filtros com HAVING após GROUP BY aplicando código profissional.",
    initialCode: `-- Encontre categorias com mais de 5 itens:
SELECT categoria, COUNT(*) as total_produtos
FROM produtos
GROUP BY categoria
HAVING COUNT(*) > 5;`,
    hints: ["WHERE filtra linhas antes do agrupamento; HAVING filtra grupos.","Agrupe por categoria primeiro.","Adicione HAVING COUNT(*) > 5."],
    expectedConditionText: "GROUP BY categoria HAVING COUNT(*) > 5",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Filtros com HAVING após GROUP BY","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Filtros com HAVING após GROUP BY</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /GROUP\s+BY\s+categoria[\s\S]*HAVING\s+COUNT\s*\(\s*\*\s*\)\s*>\s*5/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 51!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: GROUP BY categoria HAVING COUNT(*) > 5',
      };
    },
  },
  {
    id: 52,
    title: "Fase 52: CASE WHEN Condicional (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Categorize clientes entre Ouro, Prata e Bronze pelo valor gasto com rigor de produção",
    puzzleDescription: "Geração de colunas calculadas e classificação de registros dinamicamente. Neste desafio prático você irá dominar CASE WHEN Condicional aplicando código profissional.",
    initialCode: `SELECT nome, total_gasto,
  CASE 
    WHEN total_gasto >= 1000 THEN 'Ouro'
    WHEN total_gasto >= 500 THEN 'Prata'
    ELSE 'Bronze'
  END AS nivel_fidelidade
FROM clientes;`,
    hints: ["CASE WHEN funciona como o switch/if dentro de queries SQL.","Avalie as faixas de valor em ordem decrescente.","Finalize com END AS nome_da_coluna."],
    expectedConditionText: "CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CASE WHEN Condicional","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CASE WHEN Condicional</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CASE[\s\S]*WHEN\s+total_gasto\s*>=\s*1000[\s\S]*END\s+AS\s+nivel_fidelidade/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 52!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade',
      };
    },
  },
  {
    id: 53,
    title: "Fase 53: LEFT JOIN com Filtro de Inexistência (IS NULL) (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Encontre clientes que nunca realizaram nenhum pedido com rigor de produção",
    puzzleDescription: "Padrão essencial para campanhas de reativação e auditoria de cadastros. Neste desafio prático você irá dominar LEFT JOIN com Filtro de Inexistência (IS NULL) aplicando código profissional.",
    initialCode: `SELECT c.id, c.nome
FROM clientes c
LEFT JOIN pedidos p ON c.id = p.cliente_id
WHERE p.id IS NULL;`,
    hints: ["LEFT JOIN mantém todos os clientes mesmo sem correspondência em pedidos.","Para os clientes sem pedidos, as colunas de pedidos vêm como NULL.","WHERE p.id IS NULL localiza os clientes inativos."],
    expectedConditionText: "LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL",
    previewType: "site-component",
    previewMeta: {"componentTitle":"LEFT JOIN com Filtro de Inexistência (IS NULL)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">LEFT JOIN com Filtro de Inexistência (IS NULL)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LEFT\s+JOIN\s+pedidos[\s\S]*WHERE\s+p\.id\s+IS\s+NULL/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 53!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL',
      };
    },
  },
  {
    id: 54,
    title: "Fase 54: Common Table Expressions (WITH / CTE) (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Organize uma subquery complexa usando a cláusula WITH (CTE) com rigor de produção",
    puzzleDescription: "Estruturação elegante de consultas analíticas e relatórios executivos. Neste desafio prático você irá dominar Common Table Expressions (WITH / CTE) aplicando código profissional.",
    initialCode: `WITH PedidosRecentes AS (
  SELECT cliente_id, SUM(valor) as total
  FROM pedidos
  WHERE data >= '2026-01-01'
  GROUP BY cliente_id
)
SELECT c.nome, pr.total
FROM clientes c
JOIN PedidosRecentes pr ON c.id = pr.cliente_id;`,
    hints: ["WITH cria uma tabela temporária nomeada (CTE) para a query.","Torna relatórios gigantes muito mais fáceis de ler e manter.","Faça o JOIN final com a CTE."],
    expectedConditionText: "WITH PedidosRecentes AS (...) SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Common Table Expressions (WITH / CTE)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Common Table Expressions (WITH / CTE)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WITH\s+PedidosRecentes\s+AS\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 54!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WITH PedidosRecentes AS (...) SELECT ...',
      };
    },
  },
  {
    id: 55,
    title: "Fase 55: Funções de Janela: ROW_NUMBER() (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Numere pedidos sequencialmente por cliente com ROW_NUMBER() com rigor de produção",
    puzzleDescription: "Ranking, paginação e identificação do registro mais recente por usuário. Neste desafio prático você irá dominar Funções de Janela: ROW_NUMBER() aplicando código profissional.",
    initialCode: `SELECT id, cliente_id, data, valor,
  ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC) as ordem_pedido
FROM pedidos;`,
    hints: ["Funções de janela calculam métricas sem agrupar nem esconder linhas.","PARTITION BY reinicia a contagem para cada cliente.","ORDER BY data DESC coloca o pedido mais recente como 1."],
    expectedConditionText: "ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: ROW_NUMBER()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: ROW_NUMBER()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /ROW_NUMBER\s*\(\s*\)\s*OVER\s*\(\s*PARTITION\s+BY\s+cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 55!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)',
      };
    },
  },
  {
    id: 56,
    title: "Fase 56: Funções de Janela: LAG() e LEAD() (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Compare o valor da venda atual com a venda anterior usando LAG() com rigor de produção",
    puzzleDescription: "Análise de séries temporais, tendências financeiras e churn rate. Neste desafio prático você irá dominar Funções de Janela: LAG() e LEAD() aplicando código profissional.",
    initialCode: `SELECT data, valor,
  LAG(valor, 1) OVER (ORDER BY data) as venda_anterior
FROM vendas;`,
    hints: ["LAG busca o valor da linha anterior na ordenação.","Permite calcular crescimento percentual entre períodos.","LEAD faz o oposto, buscando a linha seguinte."],
    expectedConditionText: "LAG(valor, 1) OVER (ORDER BY data)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: LAG() e LEAD()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: LAG() e LEAD()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LAG\s*\(\s*valor\s*,\s*1\s*\)\s*OVER\s*\(\s*ORDER\s+BY\s+data\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 56!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LAG(valor, 1) OVER (ORDER BY data)',
      };
    },
  },
  {
    id: 57,
    title: "Fase 57: Criação de Índices para Performance (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie um índice B-Tree composto nas colunas mais buscadas com rigor de produção",
    puzzleDescription: "Otimização fundamental de latência de banco de dados em produção. Neste desafio prático você irá dominar Criação de Índices para Performance aplicando código profissional.",
    initialCode: `CREATE INDEX idx_pedidos_cliente_data 
ON pedidos (cliente_id, data DESC);`,
    hints: ["Índices aceleram buscas de O(n) para O(log n).","Colunas usadas no WHERE e ORDER BY devem ser indexadas.","Evita table scans lentos em milhões de registros."],
    expectedConditionText: "CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Criação de Índices para Performance","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Criação de Índices para Performance</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+INDEX\s+idx_pedidos_cliente_data\s+ON\s+pedidos\s*\(\s*cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 57!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)',
      };
    },
  },
  {
    id: 58,
    title: "Fase 58: Subquery Correlacionada com EXISTS (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Filtre produtos que possuem movimentação no estoque usando EXISTS com rigor de produção",
    puzzleDescription: "Verificação rápida de relacionamento entre tabelas pai e filho. Neste desafio prático você irá dominar Subquery Correlacionada com EXISTS aplicando código profissional.",
    initialCode: `SELECT p.id, p.nome
FROM produtos p
WHERE EXISTS (
  SELECT 1 FROM estoque e 
  WHERE e.produto_id = p.id AND e.quantidade > 0
);`,
    hints: ["EXISTS encerra a busca assim que encontra o primeiro registro correspondente.","Mais rápido que IN em tabelas volumosas.","Verifica e.produto_id = p.id."],
    expectedConditionText: "WHERE EXISTS (SELECT 1 FROM estoque ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Subquery Correlacionada com EXISTS","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Subquery Correlacionada com EXISTS</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WHERE\s+EXISTS\s*\(\s*SELECT/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 58!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WHERE EXISTS (SELECT 1 FROM estoque ...)',
      };
    },
  },
  {
    id: 59,
    title: "Fase 59: Transações ACID: COMMIT e ROLLBACK (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Estruture uma transferência bancária atômica com transação segura com rigor de produção",
    puzzleDescription: "Integridade de dados bancários, estoques e reservas concorrentes. Neste desafio prático você irá dominar Transações ACID: COMMIT e ROLLBACK aplicando código profissional.",
    initialCode: `BEGIN TRANSACTION;

UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;

COMMIT;`,
    hints: ["Transações garantem atomicidade: ou tudo passa ou nada muda.","Se houver falha, usa-se ROLLBACK para desfazer.","Finalize com COMMIT para gravar os dados de forma permanente."],
    expectedConditionText: "BEGIN TRANSACTION; ... COMMIT;",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Transações ACID: COMMIT e ROLLBACK","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Transações ACID: COMMIT e ROLLBACK</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /BEGIN\s+TRANSACTION;[\s\S]*COMMIT;/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 59!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: BEGIN TRANSACTION; ... COMMIT;',
      };
    },
  },
  {
    id: 60,
    title: "Fase 60: Views para Dashboards (CREATE VIEW) (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma visualização (VIEW) simplificada de vendas mensais com rigor de produção",
    puzzleDescription: "Construção de relatórios e isolamento de complexidade de dados. Neste desafio prático você irá dominar Views para Dashboards (CREATE VIEW) aplicando código profissional.",
    initialCode: `CREATE VIEW vw_vendas_resumo AS
SELECT 
  strftime('%Y-%m', data) as mes,
  COUNT(*) as total_pedidos,
  SUM(valor) as receita_total
FROM pedidos
GROUP BY mes;`,
    hints: ["Views encapsulam queries complexas como se fossem tabelas virtuais.","Simplifica o acesso para sistemas de BI e painéis analíticos.","Otimiza segurança ocultando tabelas sensíveis de baixo nível."],
    expectedConditionText: "CREATE VIEW vw_vendas_resumo AS SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Views para Dashboards (CREATE VIEW)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Views para Dashboards (CREATE VIEW)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+VIEW\s+vw_vendas_resumo\s+AS/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 60!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE VIEW vw_vendas_resumo AS SELECT ...',
      };
    },
  },
  {
    id: 61,
    title: "Fase 61: Filtros com HAVING após GROUP BY (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Filtre apenas categorias que possuem mais de 5 produtos cadastrados com rigor de produção",
    puzzleDescription: "Filtragem analítica sobre métricas agregadas em bancos de dados. Neste desafio prático você irá dominar Filtros com HAVING após GROUP BY aplicando código profissional.",
    initialCode: `-- Encontre categorias com mais de 5 itens:
SELECT categoria, COUNT(*) as total_produtos
FROM produtos
GROUP BY categoria
HAVING COUNT(*) > 5;`,
    hints: ["WHERE filtra linhas antes do agrupamento; HAVING filtra grupos.","Agrupe por categoria primeiro.","Adicione HAVING COUNT(*) > 5."],
    expectedConditionText: "GROUP BY categoria HAVING COUNT(*) > 5",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Filtros com HAVING após GROUP BY","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Filtros com HAVING após GROUP BY</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /GROUP\s+BY\s+categoria[\s\S]*HAVING\s+COUNT\s*\(\s*\*\s*\)\s*>\s*5/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 61!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: GROUP BY categoria HAVING COUNT(*) > 5',
      };
    },
  },
  {
    id: 62,
    title: "Fase 62: CASE WHEN Condicional (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Categorize clientes entre Ouro, Prata e Bronze pelo valor gasto com rigor de produção",
    puzzleDescription: "Geração de colunas calculadas e classificação de registros dinamicamente. Neste desafio prático você irá dominar CASE WHEN Condicional aplicando código profissional.",
    initialCode: `SELECT nome, total_gasto,
  CASE 
    WHEN total_gasto >= 1000 THEN 'Ouro'
    WHEN total_gasto >= 500 THEN 'Prata'
    ELSE 'Bronze'
  END AS nivel_fidelidade
FROM clientes;`,
    hints: ["CASE WHEN funciona como o switch/if dentro de queries SQL.","Avalie as faixas de valor em ordem decrescente.","Finalize com END AS nome_da_coluna."],
    expectedConditionText: "CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CASE WHEN Condicional","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CASE WHEN Condicional</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CASE[\s\S]*WHEN\s+total_gasto\s*>=\s*1000[\s\S]*END\s+AS\s+nivel_fidelidade/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 62!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade',
      };
    },
  },
  {
    id: 63,
    title: "Fase 63: LEFT JOIN com Filtro de Inexistência (IS NULL) (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Encontre clientes que nunca realizaram nenhum pedido com rigor de produção",
    puzzleDescription: "Padrão essencial para campanhas de reativação e auditoria de cadastros. Neste desafio prático você irá dominar LEFT JOIN com Filtro de Inexistência (IS NULL) aplicando código profissional.",
    initialCode: `SELECT c.id, c.nome
FROM clientes c
LEFT JOIN pedidos p ON c.id = p.cliente_id
WHERE p.id IS NULL;`,
    hints: ["LEFT JOIN mantém todos os clientes mesmo sem correspondência em pedidos.","Para os clientes sem pedidos, as colunas de pedidos vêm como NULL.","WHERE p.id IS NULL localiza os clientes inativos."],
    expectedConditionText: "LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL",
    previewType: "site-component",
    previewMeta: {"componentTitle":"LEFT JOIN com Filtro de Inexistência (IS NULL)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">LEFT JOIN com Filtro de Inexistência (IS NULL)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LEFT\s+JOIN\s+pedidos[\s\S]*WHERE\s+p\.id\s+IS\s+NULL/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 63!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL',
      };
    },
  },
  {
    id: 64,
    title: "Fase 64: Common Table Expressions (WITH / CTE) (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Organize uma subquery complexa usando a cláusula WITH (CTE) com rigor de produção",
    puzzleDescription: "Estruturação elegante de consultas analíticas e relatórios executivos. Neste desafio prático você irá dominar Common Table Expressions (WITH / CTE) aplicando código profissional.",
    initialCode: `WITH PedidosRecentes AS (
  SELECT cliente_id, SUM(valor) as total
  FROM pedidos
  WHERE data >= '2026-01-01'
  GROUP BY cliente_id
)
SELECT c.nome, pr.total
FROM clientes c
JOIN PedidosRecentes pr ON c.id = pr.cliente_id;`,
    hints: ["WITH cria uma tabela temporária nomeada (CTE) para a query.","Torna relatórios gigantes muito mais fáceis de ler e manter.","Faça o JOIN final com a CTE."],
    expectedConditionText: "WITH PedidosRecentes AS (...) SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Common Table Expressions (WITH / CTE)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Common Table Expressions (WITH / CTE)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WITH\s+PedidosRecentes\s+AS\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 64!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WITH PedidosRecentes AS (...) SELECT ...',
      };
    },
  },
  {
    id: 65,
    title: "Fase 65: Funções de Janela: ROW_NUMBER() (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Numere pedidos sequencialmente por cliente com ROW_NUMBER() com rigor de produção",
    puzzleDescription: "Ranking, paginação e identificação do registro mais recente por usuário. Neste desafio prático você irá dominar Funções de Janela: ROW_NUMBER() aplicando código profissional.",
    initialCode: `SELECT id, cliente_id, data, valor,
  ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC) as ordem_pedido
FROM pedidos;`,
    hints: ["Funções de janela calculam métricas sem agrupar nem esconder linhas.","PARTITION BY reinicia a contagem para cada cliente.","ORDER BY data DESC coloca o pedido mais recente como 1."],
    expectedConditionText: "ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: ROW_NUMBER()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: ROW_NUMBER()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /ROW_NUMBER\s*\(\s*\)\s*OVER\s*\(\s*PARTITION\s+BY\s+cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 65!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)',
      };
    },
  },
  {
    id: 66,
    title: "Fase 66: Funções de Janela: LAG() e LEAD() (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Compare o valor da venda atual com a venda anterior usando LAG() com rigor de produção",
    puzzleDescription: "Análise de séries temporais, tendências financeiras e churn rate. Neste desafio prático você irá dominar Funções de Janela: LAG() e LEAD() aplicando código profissional.",
    initialCode: `SELECT data, valor,
  LAG(valor, 1) OVER (ORDER BY data) as venda_anterior
FROM vendas;`,
    hints: ["LAG busca o valor da linha anterior na ordenação.","Permite calcular crescimento percentual entre períodos.","LEAD faz o oposto, buscando a linha seguinte."],
    expectedConditionText: "LAG(valor, 1) OVER (ORDER BY data)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: LAG() e LEAD()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: LAG() e LEAD()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LAG\s*\(\s*valor\s*,\s*1\s*\)\s*OVER\s*\(\s*ORDER\s+BY\s+data\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 66!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LAG(valor, 1) OVER (ORDER BY data)',
      };
    },
  },
  {
    id: 67,
    title: "Fase 67: Criação de Índices para Performance (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie um índice B-Tree composto nas colunas mais buscadas com rigor de produção",
    puzzleDescription: "Otimização fundamental de latência de banco de dados em produção. Neste desafio prático você irá dominar Criação de Índices para Performance aplicando código profissional.",
    initialCode: `CREATE INDEX idx_pedidos_cliente_data 
ON pedidos (cliente_id, data DESC);`,
    hints: ["Índices aceleram buscas de O(n) para O(log n).","Colunas usadas no WHERE e ORDER BY devem ser indexadas.","Evita table scans lentos em milhões de registros."],
    expectedConditionText: "CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Criação de Índices para Performance","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Criação de Índices para Performance</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+INDEX\s+idx_pedidos_cliente_data\s+ON\s+pedidos\s*\(\s*cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 67!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)',
      };
    },
  },
  {
    id: 68,
    title: "Fase 68: Subquery Correlacionada com EXISTS (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Filtre produtos que possuem movimentação no estoque usando EXISTS com rigor de produção",
    puzzleDescription: "Verificação rápida de relacionamento entre tabelas pai e filho. Neste desafio prático você irá dominar Subquery Correlacionada com EXISTS aplicando código profissional.",
    initialCode: `SELECT p.id, p.nome
FROM produtos p
WHERE EXISTS (
  SELECT 1 FROM estoque e 
  WHERE e.produto_id = p.id AND e.quantidade > 0
);`,
    hints: ["EXISTS encerra a busca assim que encontra o primeiro registro correspondente.","Mais rápido que IN em tabelas volumosas.","Verifica e.produto_id = p.id."],
    expectedConditionText: "WHERE EXISTS (SELECT 1 FROM estoque ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Subquery Correlacionada com EXISTS","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Subquery Correlacionada com EXISTS</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WHERE\s+EXISTS\s*\(\s*SELECT/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 68!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WHERE EXISTS (SELECT 1 FROM estoque ...)',
      };
    },
  },
  {
    id: 69,
    title: "Fase 69: Transações ACID: COMMIT e ROLLBACK (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Estruture uma transferência bancária atômica com transação segura com rigor de produção",
    puzzleDescription: "Integridade de dados bancários, estoques e reservas concorrentes. Neste desafio prático você irá dominar Transações ACID: COMMIT e ROLLBACK aplicando código profissional.",
    initialCode: `BEGIN TRANSACTION;

UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;

COMMIT;`,
    hints: ["Transações garantem atomicidade: ou tudo passa ou nada muda.","Se houver falha, usa-se ROLLBACK para desfazer.","Finalize com COMMIT para gravar os dados de forma permanente."],
    expectedConditionText: "BEGIN TRANSACTION; ... COMMIT;",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Transações ACID: COMMIT e ROLLBACK","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Transações ACID: COMMIT e ROLLBACK</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /BEGIN\s+TRANSACTION;[\s\S]*COMMIT;/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 69!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: BEGIN TRANSACTION; ... COMMIT;',
      };
    },
  },
  {
    id: 70,
    title: "Fase 70: Views para Dashboards (CREATE VIEW) (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma visualização (VIEW) simplificada de vendas mensais com rigor de produção",
    puzzleDescription: "Construção de relatórios e isolamento de complexidade de dados. Neste desafio prático você irá dominar Views para Dashboards (CREATE VIEW) aplicando código profissional.",
    initialCode: `CREATE VIEW vw_vendas_resumo AS
SELECT 
  strftime('%Y-%m', data) as mes,
  COUNT(*) as total_pedidos,
  SUM(valor) as receita_total
FROM pedidos
GROUP BY mes;`,
    hints: ["Views encapsulam queries complexas como se fossem tabelas virtuais.","Simplifica o acesso para sistemas de BI e painéis analíticos.","Otimiza segurança ocultando tabelas sensíveis de baixo nível."],
    expectedConditionText: "CREATE VIEW vw_vendas_resumo AS SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Views para Dashboards (CREATE VIEW)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Views para Dashboards (CREATE VIEW)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+VIEW\s+vw_vendas_resumo\s+AS/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 70!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE VIEW vw_vendas_resumo AS SELECT ...',
      };
    },
  },
  {
    id: 71,
    title: "Fase 71: Filtros com HAVING após GROUP BY (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Filtre apenas categorias que possuem mais de 5 produtos cadastrados com rigor de produção",
    puzzleDescription: "Filtragem analítica sobre métricas agregadas em bancos de dados. Neste desafio prático você irá dominar Filtros com HAVING após GROUP BY aplicando código profissional.",
    initialCode: `-- Encontre categorias com mais de 5 itens:
SELECT categoria, COUNT(*) as total_produtos
FROM produtos
GROUP BY categoria
HAVING COUNT(*) > 5;`,
    hints: ["WHERE filtra linhas antes do agrupamento; HAVING filtra grupos.","Agrupe por categoria primeiro.","Adicione HAVING COUNT(*) > 5."],
    expectedConditionText: "GROUP BY categoria HAVING COUNT(*) > 5",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Filtros com HAVING após GROUP BY","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Filtros com HAVING após GROUP BY</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /GROUP\s+BY\s+categoria[\s\S]*HAVING\s+COUNT\s*\(\s*\*\s*\)\s*>\s*5/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 71!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: GROUP BY categoria HAVING COUNT(*) > 5',
      };
    },
  },
  {
    id: 72,
    title: "Fase 72: CASE WHEN Condicional (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Categorize clientes entre Ouro, Prata e Bronze pelo valor gasto com rigor de produção",
    puzzleDescription: "Geração de colunas calculadas e classificação de registros dinamicamente. Neste desafio prático você irá dominar CASE WHEN Condicional aplicando código profissional.",
    initialCode: `SELECT nome, total_gasto,
  CASE 
    WHEN total_gasto >= 1000 THEN 'Ouro'
    WHEN total_gasto >= 500 THEN 'Prata'
    ELSE 'Bronze'
  END AS nivel_fidelidade
FROM clientes;`,
    hints: ["CASE WHEN funciona como o switch/if dentro de queries SQL.","Avalie as faixas de valor em ordem decrescente.","Finalize com END AS nome_da_coluna."],
    expectedConditionText: "CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CASE WHEN Condicional","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CASE WHEN Condicional</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CASE[\s\S]*WHEN\s+total_gasto\s*>=\s*1000[\s\S]*END\s+AS\s+nivel_fidelidade/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 72!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade',
      };
    },
  },
  {
    id: 73,
    title: "Fase 73: LEFT JOIN com Filtro de Inexistência (IS NULL) (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Encontre clientes que nunca realizaram nenhum pedido com rigor de produção",
    puzzleDescription: "Padrão essencial para campanhas de reativação e auditoria de cadastros. Neste desafio prático você irá dominar LEFT JOIN com Filtro de Inexistência (IS NULL) aplicando código profissional.",
    initialCode: `SELECT c.id, c.nome
FROM clientes c
LEFT JOIN pedidos p ON c.id = p.cliente_id
WHERE p.id IS NULL;`,
    hints: ["LEFT JOIN mantém todos os clientes mesmo sem correspondência em pedidos.","Para os clientes sem pedidos, as colunas de pedidos vêm como NULL.","WHERE p.id IS NULL localiza os clientes inativos."],
    expectedConditionText: "LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL",
    previewType: "site-component",
    previewMeta: {"componentTitle":"LEFT JOIN com Filtro de Inexistência (IS NULL)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">LEFT JOIN com Filtro de Inexistência (IS NULL)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LEFT\s+JOIN\s+pedidos[\s\S]*WHERE\s+p\.id\s+IS\s+NULL/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 73!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL',
      };
    },
  },
  {
    id: 74,
    title: "Fase 74: Common Table Expressions (WITH / CTE) (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Organize uma subquery complexa usando a cláusula WITH (CTE) com rigor de produção",
    puzzleDescription: "Estruturação elegante de consultas analíticas e relatórios executivos. Neste desafio prático você irá dominar Common Table Expressions (WITH / CTE) aplicando código profissional.",
    initialCode: `WITH PedidosRecentes AS (
  SELECT cliente_id, SUM(valor) as total
  FROM pedidos
  WHERE data >= '2026-01-01'
  GROUP BY cliente_id
)
SELECT c.nome, pr.total
FROM clientes c
JOIN PedidosRecentes pr ON c.id = pr.cliente_id;`,
    hints: ["WITH cria uma tabela temporária nomeada (CTE) para a query.","Torna relatórios gigantes muito mais fáceis de ler e manter.","Faça o JOIN final com a CTE."],
    expectedConditionText: "WITH PedidosRecentes AS (...) SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Common Table Expressions (WITH / CTE)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Common Table Expressions (WITH / CTE)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WITH\s+PedidosRecentes\s+AS\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 74!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WITH PedidosRecentes AS (...) SELECT ...',
      };
    },
  },
  {
    id: 75,
    title: "Fase 75: Funções de Janela: ROW_NUMBER() (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Numere pedidos sequencialmente por cliente com ROW_NUMBER() com rigor de produção",
    puzzleDescription: "Ranking, paginação e identificação do registro mais recente por usuário. Neste desafio prático você irá dominar Funções de Janela: ROW_NUMBER() aplicando código profissional.",
    initialCode: `SELECT id, cliente_id, data, valor,
  ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC) as ordem_pedido
FROM pedidos;`,
    hints: ["Funções de janela calculam métricas sem agrupar nem esconder linhas.","PARTITION BY reinicia a contagem para cada cliente.","ORDER BY data DESC coloca o pedido mais recente como 1."],
    expectedConditionText: "ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: ROW_NUMBER()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: ROW_NUMBER()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /ROW_NUMBER\s*\(\s*\)\s*OVER\s*\(\s*PARTITION\s+BY\s+cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 75!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)',
      };
    },
  },
  {
    id: 76,
    title: "Fase 76: Funções de Janela: LAG() e LEAD() (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Compare o valor da venda atual com a venda anterior usando LAG() com rigor de produção",
    puzzleDescription: "Análise de séries temporais, tendências financeiras e churn rate. Neste desafio prático você irá dominar Funções de Janela: LAG() e LEAD() aplicando código profissional.",
    initialCode: `SELECT data, valor,
  LAG(valor, 1) OVER (ORDER BY data) as venda_anterior
FROM vendas;`,
    hints: ["LAG busca o valor da linha anterior na ordenação.","Permite calcular crescimento percentual entre períodos.","LEAD faz o oposto, buscando a linha seguinte."],
    expectedConditionText: "LAG(valor, 1) OVER (ORDER BY data)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: LAG() e LEAD()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: LAG() e LEAD()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LAG\s*\(\s*valor\s*,\s*1\s*\)\s*OVER\s*\(\s*ORDER\s+BY\s+data\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 76!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LAG(valor, 1) OVER (ORDER BY data)',
      };
    },
  },
  {
    id: 77,
    title: "Fase 77: Criação de Índices para Performance (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie um índice B-Tree composto nas colunas mais buscadas com rigor de produção",
    puzzleDescription: "Otimização fundamental de latência de banco de dados em produção. Neste desafio prático você irá dominar Criação de Índices para Performance aplicando código profissional.",
    initialCode: `CREATE INDEX idx_pedidos_cliente_data 
ON pedidos (cliente_id, data DESC);`,
    hints: ["Índices aceleram buscas de O(n) para O(log n).","Colunas usadas no WHERE e ORDER BY devem ser indexadas.","Evita table scans lentos em milhões de registros."],
    expectedConditionText: "CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Criação de Índices para Performance","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Criação de Índices para Performance</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+INDEX\s+idx_pedidos_cliente_data\s+ON\s+pedidos\s*\(\s*cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 77!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)',
      };
    },
  },
  {
    id: 78,
    title: "Fase 78: Subquery Correlacionada com EXISTS (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Filtre produtos que possuem movimentação no estoque usando EXISTS com rigor de produção",
    puzzleDescription: "Verificação rápida de relacionamento entre tabelas pai e filho. Neste desafio prático você irá dominar Subquery Correlacionada com EXISTS aplicando código profissional.",
    initialCode: `SELECT p.id, p.nome
FROM produtos p
WHERE EXISTS (
  SELECT 1 FROM estoque e 
  WHERE e.produto_id = p.id AND e.quantidade > 0
);`,
    hints: ["EXISTS encerra a busca assim que encontra o primeiro registro correspondente.","Mais rápido que IN em tabelas volumosas.","Verifica e.produto_id = p.id."],
    expectedConditionText: "WHERE EXISTS (SELECT 1 FROM estoque ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Subquery Correlacionada com EXISTS","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Subquery Correlacionada com EXISTS</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WHERE\s+EXISTS\s*\(\s*SELECT/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 78!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WHERE EXISTS (SELECT 1 FROM estoque ...)',
      };
    },
  },
  {
    id: 79,
    title: "Fase 79: Transações ACID: COMMIT e ROLLBACK (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Estruture uma transferência bancária atômica com transação segura com rigor de produção",
    puzzleDescription: "Integridade de dados bancários, estoques e reservas concorrentes. Neste desafio prático você irá dominar Transações ACID: COMMIT e ROLLBACK aplicando código profissional.",
    initialCode: `BEGIN TRANSACTION;

UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;

COMMIT;`,
    hints: ["Transações garantem atomicidade: ou tudo passa ou nada muda.","Se houver falha, usa-se ROLLBACK para desfazer.","Finalize com COMMIT para gravar os dados de forma permanente."],
    expectedConditionText: "BEGIN TRANSACTION; ... COMMIT;",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Transações ACID: COMMIT e ROLLBACK","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Transações ACID: COMMIT e ROLLBACK</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /BEGIN\s+TRANSACTION;[\s\S]*COMMIT;/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 79!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: BEGIN TRANSACTION; ... COMMIT;',
      };
    },
  },
  {
    id: 80,
    title: "Fase 80: Views para Dashboards (CREATE VIEW) (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma visualização (VIEW) simplificada de vendas mensais com rigor de produção",
    puzzleDescription: "Construção de relatórios e isolamento de complexidade de dados. Neste desafio prático você irá dominar Views para Dashboards (CREATE VIEW) aplicando código profissional.",
    initialCode: `CREATE VIEW vw_vendas_resumo AS
SELECT 
  strftime('%Y-%m', data) as mes,
  COUNT(*) as total_pedidos,
  SUM(valor) as receita_total
FROM pedidos
GROUP BY mes;`,
    hints: ["Views encapsulam queries complexas como se fossem tabelas virtuais.","Simplifica o acesso para sistemas de BI e painéis analíticos.","Otimiza segurança ocultando tabelas sensíveis de baixo nível."],
    expectedConditionText: "CREATE VIEW vw_vendas_resumo AS SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Views para Dashboards (CREATE VIEW)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Views para Dashboards (CREATE VIEW)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+VIEW\s+vw_vendas_resumo\s+AS/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 80!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE VIEW vw_vendas_resumo AS SELECT ...',
      };
    },
  },
  {
    id: 81,
    title: "Fase 81: Filtros com HAVING após GROUP BY (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Filtre apenas categorias que possuem mais de 5 produtos cadastrados com rigor de produção",
    puzzleDescription: "Filtragem analítica sobre métricas agregadas em bancos de dados. Neste desafio prático você irá dominar Filtros com HAVING após GROUP BY aplicando código profissional.",
    initialCode: `-- Encontre categorias com mais de 5 itens:
SELECT categoria, COUNT(*) as total_produtos
FROM produtos
GROUP BY categoria
HAVING COUNT(*) > 5;`,
    hints: ["WHERE filtra linhas antes do agrupamento; HAVING filtra grupos.","Agrupe por categoria primeiro.","Adicione HAVING COUNT(*) > 5."],
    expectedConditionText: "GROUP BY categoria HAVING COUNT(*) > 5",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Filtros com HAVING após GROUP BY","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Filtros com HAVING após GROUP BY</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /GROUP\s+BY\s+categoria[\s\S]*HAVING\s+COUNT\s*\(\s*\*\s*\)\s*>\s*5/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 81!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: GROUP BY categoria HAVING COUNT(*) > 5',
      };
    },
  },
  {
    id: 82,
    title: "Fase 82: CASE WHEN Condicional (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Categorize clientes entre Ouro, Prata e Bronze pelo valor gasto com rigor de produção",
    puzzleDescription: "Geração de colunas calculadas e classificação de registros dinamicamente. Neste desafio prático você irá dominar CASE WHEN Condicional aplicando código profissional.",
    initialCode: `SELECT nome, total_gasto,
  CASE 
    WHEN total_gasto >= 1000 THEN 'Ouro'
    WHEN total_gasto >= 500 THEN 'Prata'
    ELSE 'Bronze'
  END AS nivel_fidelidade
FROM clientes;`,
    hints: ["CASE WHEN funciona como o switch/if dentro de queries SQL.","Avalie as faixas de valor em ordem decrescente.","Finalize com END AS nome_da_coluna."],
    expectedConditionText: "CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CASE WHEN Condicional","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CASE WHEN Condicional</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CASE[\s\S]*WHEN\s+total_gasto\s*>=\s*1000[\s\S]*END\s+AS\s+nivel_fidelidade/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 82!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade',
      };
    },
  },
  {
    id: 83,
    title: "Fase 83: LEFT JOIN com Filtro de Inexistência (IS NULL) (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Encontre clientes que nunca realizaram nenhum pedido com rigor de produção",
    puzzleDescription: "Padrão essencial para campanhas de reativação e auditoria de cadastros. Neste desafio prático você irá dominar LEFT JOIN com Filtro de Inexistência (IS NULL) aplicando código profissional.",
    initialCode: `SELECT c.id, c.nome
FROM clientes c
LEFT JOIN pedidos p ON c.id = p.cliente_id
WHERE p.id IS NULL;`,
    hints: ["LEFT JOIN mantém todos os clientes mesmo sem correspondência em pedidos.","Para os clientes sem pedidos, as colunas de pedidos vêm como NULL.","WHERE p.id IS NULL localiza os clientes inativos."],
    expectedConditionText: "LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL",
    previewType: "site-component",
    previewMeta: {"componentTitle":"LEFT JOIN com Filtro de Inexistência (IS NULL)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">LEFT JOIN com Filtro de Inexistência (IS NULL)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LEFT\s+JOIN\s+pedidos[\s\S]*WHERE\s+p\.id\s+IS\s+NULL/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 83!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL',
      };
    },
  },
  {
    id: 84,
    title: "Fase 84: Common Table Expressions (WITH / CTE) (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Organize uma subquery complexa usando a cláusula WITH (CTE) com rigor de produção",
    puzzleDescription: "Estruturação elegante de consultas analíticas e relatórios executivos. Neste desafio prático você irá dominar Common Table Expressions (WITH / CTE) aplicando código profissional.",
    initialCode: `WITH PedidosRecentes AS (
  SELECT cliente_id, SUM(valor) as total
  FROM pedidos
  WHERE data >= '2026-01-01'
  GROUP BY cliente_id
)
SELECT c.nome, pr.total
FROM clientes c
JOIN PedidosRecentes pr ON c.id = pr.cliente_id;`,
    hints: ["WITH cria uma tabela temporária nomeada (CTE) para a query.","Torna relatórios gigantes muito mais fáceis de ler e manter.","Faça o JOIN final com a CTE."],
    expectedConditionText: "WITH PedidosRecentes AS (...) SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Common Table Expressions (WITH / CTE)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Common Table Expressions (WITH / CTE)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WITH\s+PedidosRecentes\s+AS\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 84!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WITH PedidosRecentes AS (...) SELECT ...',
      };
    },
  },
  {
    id: 85,
    title: "Fase 85: Funções de Janela: ROW_NUMBER() (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Numere pedidos sequencialmente por cliente com ROW_NUMBER() com rigor de produção",
    puzzleDescription: "Ranking, paginação e identificação do registro mais recente por usuário. Neste desafio prático você irá dominar Funções de Janela: ROW_NUMBER() aplicando código profissional.",
    initialCode: `SELECT id, cliente_id, data, valor,
  ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC) as ordem_pedido
FROM pedidos;`,
    hints: ["Funções de janela calculam métricas sem agrupar nem esconder linhas.","PARTITION BY reinicia a contagem para cada cliente.","ORDER BY data DESC coloca o pedido mais recente como 1."],
    expectedConditionText: "ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: ROW_NUMBER()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: ROW_NUMBER()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /ROW_NUMBER\s*\(\s*\)\s*OVER\s*\(\s*PARTITION\s+BY\s+cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 85!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)',
      };
    },
  },
  {
    id: 86,
    title: "Fase 86: Funções de Janela: LAG() e LEAD() (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Compare o valor da venda atual com a venda anterior usando LAG() com rigor de produção",
    puzzleDescription: "Análise de séries temporais, tendências financeiras e churn rate. Neste desafio prático você irá dominar Funções de Janela: LAG() e LEAD() aplicando código profissional.",
    initialCode: `SELECT data, valor,
  LAG(valor, 1) OVER (ORDER BY data) as venda_anterior
FROM vendas;`,
    hints: ["LAG busca o valor da linha anterior na ordenação.","Permite calcular crescimento percentual entre períodos.","LEAD faz o oposto, buscando a linha seguinte."],
    expectedConditionText: "LAG(valor, 1) OVER (ORDER BY data)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: LAG() e LEAD()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: LAG() e LEAD()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LAG\s*\(\s*valor\s*,\s*1\s*\)\s*OVER\s*\(\s*ORDER\s+BY\s+data\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 86!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LAG(valor, 1) OVER (ORDER BY data)',
      };
    },
  },
  {
    id: 87,
    title: "Fase 87: Criação de Índices para Performance (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie um índice B-Tree composto nas colunas mais buscadas com rigor de produção",
    puzzleDescription: "Otimização fundamental de latência de banco de dados em produção. Neste desafio prático você irá dominar Criação de Índices para Performance aplicando código profissional.",
    initialCode: `CREATE INDEX idx_pedidos_cliente_data 
ON pedidos (cliente_id, data DESC);`,
    hints: ["Índices aceleram buscas de O(n) para O(log n).","Colunas usadas no WHERE e ORDER BY devem ser indexadas.","Evita table scans lentos em milhões de registros."],
    expectedConditionText: "CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Criação de Índices para Performance","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Criação de Índices para Performance</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+INDEX\s+idx_pedidos_cliente_data\s+ON\s+pedidos\s*\(\s*cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 87!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)',
      };
    },
  },
  {
    id: 88,
    title: "Fase 88: Subquery Correlacionada com EXISTS (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Filtre produtos que possuem movimentação no estoque usando EXISTS com rigor de produção",
    puzzleDescription: "Verificação rápida de relacionamento entre tabelas pai e filho. Neste desafio prático você irá dominar Subquery Correlacionada com EXISTS aplicando código profissional.",
    initialCode: `SELECT p.id, p.nome
FROM produtos p
WHERE EXISTS (
  SELECT 1 FROM estoque e 
  WHERE e.produto_id = p.id AND e.quantidade > 0
);`,
    hints: ["EXISTS encerra a busca assim que encontra o primeiro registro correspondente.","Mais rápido que IN em tabelas volumosas.","Verifica e.produto_id = p.id."],
    expectedConditionText: "WHERE EXISTS (SELECT 1 FROM estoque ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Subquery Correlacionada com EXISTS","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Subquery Correlacionada com EXISTS</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WHERE\s+EXISTS\s*\(\s*SELECT/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 88!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WHERE EXISTS (SELECT 1 FROM estoque ...)',
      };
    },
  },
  {
    id: 89,
    title: "Fase 89: Transações ACID: COMMIT e ROLLBACK (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Estruture uma transferência bancária atômica com transação segura com rigor de produção",
    puzzleDescription: "Integridade de dados bancários, estoques e reservas concorrentes. Neste desafio prático você irá dominar Transações ACID: COMMIT e ROLLBACK aplicando código profissional.",
    initialCode: `BEGIN TRANSACTION;

UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;

COMMIT;`,
    hints: ["Transações garantem atomicidade: ou tudo passa ou nada muda.","Se houver falha, usa-se ROLLBACK para desfazer.","Finalize com COMMIT para gravar os dados de forma permanente."],
    expectedConditionText: "BEGIN TRANSACTION; ... COMMIT;",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Transações ACID: COMMIT e ROLLBACK","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Transações ACID: COMMIT e ROLLBACK</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /BEGIN\s+TRANSACTION;[\s\S]*COMMIT;/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 89!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: BEGIN TRANSACTION; ... COMMIT;',
      };
    },
  },
  {
    id: 90,
    title: "Fase 90: Views para Dashboards (CREATE VIEW) (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma visualização (VIEW) simplificada de vendas mensais com rigor de produção",
    puzzleDescription: "Construção de relatórios e isolamento de complexidade de dados. Neste desafio prático você irá dominar Views para Dashboards (CREATE VIEW) aplicando código profissional.",
    initialCode: `CREATE VIEW vw_vendas_resumo AS
SELECT 
  strftime('%Y-%m', data) as mes,
  COUNT(*) as total_pedidos,
  SUM(valor) as receita_total
FROM pedidos
GROUP BY mes;`,
    hints: ["Views encapsulam queries complexas como se fossem tabelas virtuais.","Simplifica o acesso para sistemas de BI e painéis analíticos.","Otimiza segurança ocultando tabelas sensíveis de baixo nível."],
    expectedConditionText: "CREATE VIEW vw_vendas_resumo AS SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Views para Dashboards (CREATE VIEW)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Views para Dashboards (CREATE VIEW)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+VIEW\s+vw_vendas_resumo\s+AS/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 90!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE VIEW vw_vendas_resumo AS SELECT ...',
      };
    },
  },
  {
    id: 91,
    title: "Fase 91: Filtros com HAVING após GROUP BY (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Filtre apenas categorias que possuem mais de 5 produtos cadastrados com rigor de produção",
    puzzleDescription: "Filtragem analítica sobre métricas agregadas em bancos de dados. Neste desafio prático você irá dominar Filtros com HAVING após GROUP BY aplicando código profissional.",
    initialCode: `-- Encontre categorias com mais de 5 itens:
SELECT categoria, COUNT(*) as total_produtos
FROM produtos
GROUP BY categoria
HAVING COUNT(*) > 5;`,
    hints: ["WHERE filtra linhas antes do agrupamento; HAVING filtra grupos.","Agrupe por categoria primeiro.","Adicione HAVING COUNT(*) > 5."],
    expectedConditionText: "GROUP BY categoria HAVING COUNT(*) > 5",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Filtros com HAVING após GROUP BY","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Filtros com HAVING após GROUP BY</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /GROUP\s+BY\s+categoria[\s\S]*HAVING\s+COUNT\s*\(\s*\*\s*\)\s*>\s*5/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 91!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: GROUP BY categoria HAVING COUNT(*) > 5',
      };
    },
  },
  {
    id: 92,
    title: "Fase 92: CASE WHEN Condicional (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Categorize clientes entre Ouro, Prata e Bronze pelo valor gasto com rigor de produção",
    puzzleDescription: "Geração de colunas calculadas e classificação de registros dinamicamente. Neste desafio prático você irá dominar CASE WHEN Condicional aplicando código profissional.",
    initialCode: `SELECT nome, total_gasto,
  CASE 
    WHEN total_gasto >= 1000 THEN 'Ouro'
    WHEN total_gasto >= 500 THEN 'Prata'
    ELSE 'Bronze'
  END AS nivel_fidelidade
FROM clientes;`,
    hints: ["CASE WHEN funciona como o switch/if dentro de queries SQL.","Avalie as faixas de valor em ordem decrescente.","Finalize com END AS nome_da_coluna."],
    expectedConditionText: "CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CASE WHEN Condicional","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CASE WHEN Condicional</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CASE[\s\S]*WHEN\s+total_gasto\s*>=\s*1000[\s\S]*END\s+AS\s+nivel_fidelidade/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 92!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade',
      };
    },
  },
  {
    id: 93,
    title: "Fase 93: LEFT JOIN com Filtro de Inexistência (IS NULL) (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Encontre clientes que nunca realizaram nenhum pedido com rigor de produção",
    puzzleDescription: "Padrão essencial para campanhas de reativação e auditoria de cadastros. Neste desafio prático você irá dominar LEFT JOIN com Filtro de Inexistência (IS NULL) aplicando código profissional.",
    initialCode: `SELECT c.id, c.nome
FROM clientes c
LEFT JOIN pedidos p ON c.id = p.cliente_id
WHERE p.id IS NULL;`,
    hints: ["LEFT JOIN mantém todos os clientes mesmo sem correspondência em pedidos.","Para os clientes sem pedidos, as colunas de pedidos vêm como NULL.","WHERE p.id IS NULL localiza os clientes inativos."],
    expectedConditionText: "LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL",
    previewType: "site-component",
    previewMeta: {"componentTitle":"LEFT JOIN com Filtro de Inexistência (IS NULL)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">LEFT JOIN com Filtro de Inexistência (IS NULL)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LEFT\s+JOIN\s+pedidos[\s\S]*WHERE\s+p\.id\s+IS\s+NULL/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 93!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL',
      };
    },
  },
  {
    id: 94,
    title: "Fase 94: Common Table Expressions (WITH / CTE) (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Organize uma subquery complexa usando a cláusula WITH (CTE) com rigor de produção",
    puzzleDescription: "Estruturação elegante de consultas analíticas e relatórios executivos. Neste desafio prático você irá dominar Common Table Expressions (WITH / CTE) aplicando código profissional.",
    initialCode: `WITH PedidosRecentes AS (
  SELECT cliente_id, SUM(valor) as total
  FROM pedidos
  WHERE data >= '2026-01-01'
  GROUP BY cliente_id
)
SELECT c.nome, pr.total
FROM clientes c
JOIN PedidosRecentes pr ON c.id = pr.cliente_id;`,
    hints: ["WITH cria uma tabela temporária nomeada (CTE) para a query.","Torna relatórios gigantes muito mais fáceis de ler e manter.","Faça o JOIN final com a CTE."],
    expectedConditionText: "WITH PedidosRecentes AS (...) SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Common Table Expressions (WITH / CTE)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Common Table Expressions (WITH / CTE)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WITH\s+PedidosRecentes\s+AS\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 94!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WITH PedidosRecentes AS (...) SELECT ...',
      };
    },
  },
  {
    id: 95,
    title: "Fase 95: Funções de Janela: ROW_NUMBER() (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Numere pedidos sequencialmente por cliente com ROW_NUMBER() com rigor de produção",
    puzzleDescription: "Ranking, paginação e identificação do registro mais recente por usuário. Neste desafio prático você irá dominar Funções de Janela: ROW_NUMBER() aplicando código profissional.",
    initialCode: `SELECT id, cliente_id, data, valor,
  ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC) as ordem_pedido
FROM pedidos;`,
    hints: ["Funções de janela calculam métricas sem agrupar nem esconder linhas.","PARTITION BY reinicia a contagem para cada cliente.","ORDER BY data DESC coloca o pedido mais recente como 1."],
    expectedConditionText: "ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: ROW_NUMBER()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: ROW_NUMBER()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /ROW_NUMBER\s*\(\s*\)\s*OVER\s*\(\s*PARTITION\s+BY\s+cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 95!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)',
      };
    },
  },
  {
    id: 96,
    title: "Fase 96: Funções de Janela: LAG() e LEAD() (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Compare o valor da venda atual com a venda anterior usando LAG() com rigor de produção",
    puzzleDescription: "Análise de séries temporais, tendências financeiras e churn rate. Neste desafio prático você irá dominar Funções de Janela: LAG() e LEAD() aplicando código profissional.",
    initialCode: `SELECT data, valor,
  LAG(valor, 1) OVER (ORDER BY data) as venda_anterior
FROM vendas;`,
    hints: ["LAG busca o valor da linha anterior na ordenação.","Permite calcular crescimento percentual entre períodos.","LEAD faz o oposto, buscando a linha seguinte."],
    expectedConditionText: "LAG(valor, 1) OVER (ORDER BY data)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: LAG() e LEAD()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: LAG() e LEAD()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LAG\s*\(\s*valor\s*,\s*1\s*\)\s*OVER\s*\(\s*ORDER\s+BY\s+data\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 96!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LAG(valor, 1) OVER (ORDER BY data)',
      };
    },
  },
  {
    id: 97,
    title: "Fase 97: Criação de Índices para Performance (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie um índice B-Tree composto nas colunas mais buscadas com rigor de produção",
    puzzleDescription: "Otimização fundamental de latência de banco de dados em produção. Neste desafio prático você irá dominar Criação de Índices para Performance aplicando código profissional.",
    initialCode: `CREATE INDEX idx_pedidos_cliente_data 
ON pedidos (cliente_id, data DESC);`,
    hints: ["Índices aceleram buscas de O(n) para O(log n).","Colunas usadas no WHERE e ORDER BY devem ser indexadas.","Evita table scans lentos em milhões de registros."],
    expectedConditionText: "CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Criação de Índices para Performance","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Criação de Índices para Performance</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+INDEX\s+idx_pedidos_cliente_data\s+ON\s+pedidos\s*\(\s*cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 97!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)',
      };
    },
  },
  {
    id: 98,
    title: "Fase 98: Subquery Correlacionada com EXISTS (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Filtre produtos que possuem movimentação no estoque usando EXISTS com rigor de produção",
    puzzleDescription: "Verificação rápida de relacionamento entre tabelas pai e filho. Neste desafio prático você irá dominar Subquery Correlacionada com EXISTS aplicando código profissional.",
    initialCode: `SELECT p.id, p.nome
FROM produtos p
WHERE EXISTS (
  SELECT 1 FROM estoque e 
  WHERE e.produto_id = p.id AND e.quantidade > 0
);`,
    hints: ["EXISTS encerra a busca assim que encontra o primeiro registro correspondente.","Mais rápido que IN em tabelas volumosas.","Verifica e.produto_id = p.id."],
    expectedConditionText: "WHERE EXISTS (SELECT 1 FROM estoque ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Subquery Correlacionada com EXISTS","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Subquery Correlacionada com EXISTS</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WHERE\s+EXISTS\s*\(\s*SELECT/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 98!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WHERE EXISTS (SELECT 1 FROM estoque ...)',
      };
    },
  },
  {
    id: 99,
    title: "Fase 99: Transações ACID: COMMIT e ROLLBACK (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Estruture uma transferência bancária atômica com transação segura com rigor de produção",
    puzzleDescription: "Integridade de dados bancários, estoques e reservas concorrentes. Neste desafio prático você irá dominar Transações ACID: COMMIT e ROLLBACK aplicando código profissional.",
    initialCode: `BEGIN TRANSACTION;

UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;

COMMIT;`,
    hints: ["Transações garantem atomicidade: ou tudo passa ou nada muda.","Se houver falha, usa-se ROLLBACK para desfazer.","Finalize com COMMIT para gravar os dados de forma permanente."],
    expectedConditionText: "BEGIN TRANSACTION; ... COMMIT;",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Transações ACID: COMMIT e ROLLBACK","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Transações ACID: COMMIT e ROLLBACK</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /BEGIN\s+TRANSACTION;[\s\S]*COMMIT;/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 99!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: BEGIN TRANSACTION; ... COMMIT;',
      };
    },
  },
  {
    id: 100,
    title: "Fase 100: Views para Dashboards (CREATE VIEW) (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma visualização (VIEW) simplificada de vendas mensais com rigor de produção",
    puzzleDescription: "Construção de relatórios e isolamento de complexidade de dados. Neste desafio prático você irá dominar Views para Dashboards (CREATE VIEW) aplicando código profissional.",
    initialCode: `CREATE VIEW vw_vendas_resumo AS
SELECT 
  strftime('%Y-%m', data) as mes,
  COUNT(*) as total_pedidos,
  SUM(valor) as receita_total
FROM pedidos
GROUP BY mes;`,
    hints: ["Views encapsulam queries complexas como se fossem tabelas virtuais.","Simplifica o acesso para sistemas de BI e painéis analíticos.","Otimiza segurança ocultando tabelas sensíveis de baixo nível."],
    expectedConditionText: "CREATE VIEW vw_vendas_resumo AS SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Views para Dashboards (CREATE VIEW)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Views para Dashboards (CREATE VIEW)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+VIEW\s+vw_vendas_resumo\s+AS/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 100!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE VIEW vw_vendas_resumo AS SELECT ...',
      };
    },
  },
  {
    id: 101,
    title: "Fase 101: Filtros com HAVING após GROUP BY (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Filtre apenas categorias que possuem mais de 5 produtos cadastrados com rigor de produção",
    puzzleDescription: "Filtragem analítica sobre métricas agregadas em bancos de dados. Neste desafio prático você irá dominar Filtros com HAVING após GROUP BY aplicando código profissional.",
    initialCode: `-- Encontre categorias com mais de 5 itens:
SELECT categoria, COUNT(*) as total_produtos
FROM produtos
GROUP BY categoria
HAVING COUNT(*) > 5;`,
    hints: ["WHERE filtra linhas antes do agrupamento; HAVING filtra grupos.","Agrupe por categoria primeiro.","Adicione HAVING COUNT(*) > 5."],
    expectedConditionText: "GROUP BY categoria HAVING COUNT(*) > 5",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Filtros com HAVING após GROUP BY","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Filtros com HAVING após GROUP BY</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /GROUP\s+BY\s+categoria[\s\S]*HAVING\s+COUNT\s*\(\s*\*\s*\)\s*>\s*5/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 101!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: GROUP BY categoria HAVING COUNT(*) > 5',
      };
    },
  },
  {
    id: 102,
    title: "Fase 102: CASE WHEN Condicional (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Categorize clientes entre Ouro, Prata e Bronze pelo valor gasto com rigor de produção",
    puzzleDescription: "Geração de colunas calculadas e classificação de registros dinamicamente. Neste desafio prático você irá dominar CASE WHEN Condicional aplicando código profissional.",
    initialCode: `SELECT nome, total_gasto,
  CASE 
    WHEN total_gasto >= 1000 THEN 'Ouro'
    WHEN total_gasto >= 500 THEN 'Prata'
    ELSE 'Bronze'
  END AS nivel_fidelidade
FROM clientes;`,
    hints: ["CASE WHEN funciona como o switch/if dentro de queries SQL.","Avalie as faixas de valor em ordem decrescente.","Finalize com END AS nome_da_coluna."],
    expectedConditionText: "CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CASE WHEN Condicional","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CASE WHEN Condicional</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CASE[\s\S]*WHEN\s+total_gasto\s*>=\s*1000[\s\S]*END\s+AS\s+nivel_fidelidade/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 102!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade',
      };
    },
  },
  {
    id: 103,
    title: "Fase 103: LEFT JOIN com Filtro de Inexistência (IS NULL) (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Encontre clientes que nunca realizaram nenhum pedido com rigor de produção",
    puzzleDescription: "Padrão essencial para campanhas de reativação e auditoria de cadastros. Neste desafio prático você irá dominar LEFT JOIN com Filtro de Inexistência (IS NULL) aplicando código profissional.",
    initialCode: `SELECT c.id, c.nome
FROM clientes c
LEFT JOIN pedidos p ON c.id = p.cliente_id
WHERE p.id IS NULL;`,
    hints: ["LEFT JOIN mantém todos os clientes mesmo sem correspondência em pedidos.","Para os clientes sem pedidos, as colunas de pedidos vêm como NULL.","WHERE p.id IS NULL localiza os clientes inativos."],
    expectedConditionText: "LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL",
    previewType: "site-component",
    previewMeta: {"componentTitle":"LEFT JOIN com Filtro de Inexistência (IS NULL)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">LEFT JOIN com Filtro de Inexistência (IS NULL)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LEFT\s+JOIN\s+pedidos[\s\S]*WHERE\s+p\.id\s+IS\s+NULL/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 103!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL',
      };
    },
  },
  {
    id: 104,
    title: "Fase 104: Common Table Expressions (WITH / CTE) (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Organize uma subquery complexa usando a cláusula WITH (CTE) com rigor de produção",
    puzzleDescription: "Estruturação elegante de consultas analíticas e relatórios executivos. Neste desafio prático você irá dominar Common Table Expressions (WITH / CTE) aplicando código profissional.",
    initialCode: `WITH PedidosRecentes AS (
  SELECT cliente_id, SUM(valor) as total
  FROM pedidos
  WHERE data >= '2026-01-01'
  GROUP BY cliente_id
)
SELECT c.nome, pr.total
FROM clientes c
JOIN PedidosRecentes pr ON c.id = pr.cliente_id;`,
    hints: ["WITH cria uma tabela temporária nomeada (CTE) para a query.","Torna relatórios gigantes muito mais fáceis de ler e manter.","Faça o JOIN final com a CTE."],
    expectedConditionText: "WITH PedidosRecentes AS (...) SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Common Table Expressions (WITH / CTE)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Common Table Expressions (WITH / CTE)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WITH\s+PedidosRecentes\s+AS\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 104!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WITH PedidosRecentes AS (...) SELECT ...',
      };
    },
  },
  {
    id: 105,
    title: "Fase 105: Funções de Janela: ROW_NUMBER() (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Numere pedidos sequencialmente por cliente com ROW_NUMBER() com rigor de produção",
    puzzleDescription: "Ranking, paginação e identificação do registro mais recente por usuário. Neste desafio prático você irá dominar Funções de Janela: ROW_NUMBER() aplicando código profissional.",
    initialCode: `SELECT id, cliente_id, data, valor,
  ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC) as ordem_pedido
FROM pedidos;`,
    hints: ["Funções de janela calculam métricas sem agrupar nem esconder linhas.","PARTITION BY reinicia a contagem para cada cliente.","ORDER BY data DESC coloca o pedido mais recente como 1."],
    expectedConditionText: "ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: ROW_NUMBER()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: ROW_NUMBER()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /ROW_NUMBER\s*\(\s*\)\s*OVER\s*\(\s*PARTITION\s+BY\s+cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 105!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)',
      };
    },
  },
  {
    id: 106,
    title: "Fase 106: Funções de Janela: LAG() e LEAD() (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Compare o valor da venda atual com a venda anterior usando LAG() com rigor de produção",
    puzzleDescription: "Análise de séries temporais, tendências financeiras e churn rate. Neste desafio prático você irá dominar Funções de Janela: LAG() e LEAD() aplicando código profissional.",
    initialCode: `SELECT data, valor,
  LAG(valor, 1) OVER (ORDER BY data) as venda_anterior
FROM vendas;`,
    hints: ["LAG busca o valor da linha anterior na ordenação.","Permite calcular crescimento percentual entre períodos.","LEAD faz o oposto, buscando a linha seguinte."],
    expectedConditionText: "LAG(valor, 1) OVER (ORDER BY data)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: LAG() e LEAD()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: LAG() e LEAD()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LAG\s*\(\s*valor\s*,\s*1\s*\)\s*OVER\s*\(\s*ORDER\s+BY\s+data\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 106!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LAG(valor, 1) OVER (ORDER BY data)',
      };
    },
  },
  {
    id: 107,
    title: "Fase 107: Criação de Índices para Performance (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie um índice B-Tree composto nas colunas mais buscadas com rigor de produção",
    puzzleDescription: "Otimização fundamental de latência de banco de dados em produção. Neste desafio prático você irá dominar Criação de Índices para Performance aplicando código profissional.",
    initialCode: `CREATE INDEX idx_pedidos_cliente_data 
ON pedidos (cliente_id, data DESC);`,
    hints: ["Índices aceleram buscas de O(n) para O(log n).","Colunas usadas no WHERE e ORDER BY devem ser indexadas.","Evita table scans lentos em milhões de registros."],
    expectedConditionText: "CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Criação de Índices para Performance","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Criação de Índices para Performance</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+INDEX\s+idx_pedidos_cliente_data\s+ON\s+pedidos\s*\(\s*cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 107!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)',
      };
    },
  },
  {
    id: 108,
    title: "Fase 108: Subquery Correlacionada com EXISTS (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Filtre produtos que possuem movimentação no estoque usando EXISTS com rigor de produção",
    puzzleDescription: "Verificação rápida de relacionamento entre tabelas pai e filho. Neste desafio prático você irá dominar Subquery Correlacionada com EXISTS aplicando código profissional.",
    initialCode: `SELECT p.id, p.nome
FROM produtos p
WHERE EXISTS (
  SELECT 1 FROM estoque e 
  WHERE e.produto_id = p.id AND e.quantidade > 0
);`,
    hints: ["EXISTS encerra a busca assim que encontra o primeiro registro correspondente.","Mais rápido que IN em tabelas volumosas.","Verifica e.produto_id = p.id."],
    expectedConditionText: "WHERE EXISTS (SELECT 1 FROM estoque ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Subquery Correlacionada com EXISTS","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Subquery Correlacionada com EXISTS</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WHERE\s+EXISTS\s*\(\s*SELECT/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 108!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WHERE EXISTS (SELECT 1 FROM estoque ...)',
      };
    },
  },
  {
    id: 109,
    title: "Fase 109: Transações ACID: COMMIT e ROLLBACK (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Estruture uma transferência bancária atômica com transação segura com rigor de produção",
    puzzleDescription: "Integridade de dados bancários, estoques e reservas concorrentes. Neste desafio prático você irá dominar Transações ACID: COMMIT e ROLLBACK aplicando código profissional.",
    initialCode: `BEGIN TRANSACTION;

UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;

COMMIT;`,
    hints: ["Transações garantem atomicidade: ou tudo passa ou nada muda.","Se houver falha, usa-se ROLLBACK para desfazer.","Finalize com COMMIT para gravar os dados de forma permanente."],
    expectedConditionText: "BEGIN TRANSACTION; ... COMMIT;",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Transações ACID: COMMIT e ROLLBACK","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Transações ACID: COMMIT e ROLLBACK</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /BEGIN\s+TRANSACTION;[\s\S]*COMMIT;/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 109!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: BEGIN TRANSACTION; ... COMMIT;',
      };
    },
  },
  {
    id: 110,
    title: "Fase 110: Views para Dashboards (CREATE VIEW) (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma visualização (VIEW) simplificada de vendas mensais com rigor de produção",
    puzzleDescription: "Construção de relatórios e isolamento de complexidade de dados. Neste desafio prático você irá dominar Views para Dashboards (CREATE VIEW) aplicando código profissional.",
    initialCode: `CREATE VIEW vw_vendas_resumo AS
SELECT 
  strftime('%Y-%m', data) as mes,
  COUNT(*) as total_pedidos,
  SUM(valor) as receita_total
FROM pedidos
GROUP BY mes;`,
    hints: ["Views encapsulam queries complexas como se fossem tabelas virtuais.","Simplifica o acesso para sistemas de BI e painéis analíticos.","Otimiza segurança ocultando tabelas sensíveis de baixo nível."],
    expectedConditionText: "CREATE VIEW vw_vendas_resumo AS SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Views para Dashboards (CREATE VIEW)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Views para Dashboards (CREATE VIEW)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+VIEW\s+vw_vendas_resumo\s+AS/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 110!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE VIEW vw_vendas_resumo AS SELECT ...',
      };
    },
  },
  {
    id: 111,
    title: "Fase 111: Filtros com HAVING após GROUP BY (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Filtre apenas categorias que possuem mais de 5 produtos cadastrados com rigor de produção",
    puzzleDescription: "Filtragem analítica sobre métricas agregadas em bancos de dados. Neste desafio prático você irá dominar Filtros com HAVING após GROUP BY aplicando código profissional.",
    initialCode: `-- Encontre categorias com mais de 5 itens:
SELECT categoria, COUNT(*) as total_produtos
FROM produtos
GROUP BY categoria
HAVING COUNT(*) > 5;`,
    hints: ["WHERE filtra linhas antes do agrupamento; HAVING filtra grupos.","Agrupe por categoria primeiro.","Adicione HAVING COUNT(*) > 5."],
    expectedConditionText: "GROUP BY categoria HAVING COUNT(*) > 5",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Filtros com HAVING após GROUP BY","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Filtros com HAVING após GROUP BY</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /GROUP\s+BY\s+categoria[\s\S]*HAVING\s+COUNT\s*\(\s*\*\s*\)\s*>\s*5/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 111!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: GROUP BY categoria HAVING COUNT(*) > 5',
      };
    },
  },
  {
    id: 112,
    title: "Fase 112: CASE WHEN Condicional (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Categorize clientes entre Ouro, Prata e Bronze pelo valor gasto com rigor de produção",
    puzzleDescription: "Geração de colunas calculadas e classificação de registros dinamicamente. Neste desafio prático você irá dominar CASE WHEN Condicional aplicando código profissional.",
    initialCode: `SELECT nome, total_gasto,
  CASE 
    WHEN total_gasto >= 1000 THEN 'Ouro'
    WHEN total_gasto >= 500 THEN 'Prata'
    ELSE 'Bronze'
  END AS nivel_fidelidade
FROM clientes;`,
    hints: ["CASE WHEN funciona como o switch/if dentro de queries SQL.","Avalie as faixas de valor em ordem decrescente.","Finalize com END AS nome_da_coluna."],
    expectedConditionText: "CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CASE WHEN Condicional","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CASE WHEN Condicional</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CASE[\s\S]*WHEN\s+total_gasto\s*>=\s*1000[\s\S]*END\s+AS\s+nivel_fidelidade/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 112!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CASE WHEN ... THEN ... ELSE ... END AS nivel_fidelidade',
      };
    },
  },
  {
    id: 113,
    title: "Fase 113: LEFT JOIN com Filtro de Inexistência (IS NULL) (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Encontre clientes que nunca realizaram nenhum pedido com rigor de produção",
    puzzleDescription: "Padrão essencial para campanhas de reativação e auditoria de cadastros. Neste desafio prático você irá dominar LEFT JOIN com Filtro de Inexistência (IS NULL) aplicando código profissional.",
    initialCode: `SELECT c.id, c.nome
FROM clientes c
LEFT JOIN pedidos p ON c.id = p.cliente_id
WHERE p.id IS NULL;`,
    hints: ["LEFT JOIN mantém todos os clientes mesmo sem correspondência em pedidos.","Para os clientes sem pedidos, as colunas de pedidos vêm como NULL.","WHERE p.id IS NULL localiza os clientes inativos."],
    expectedConditionText: "LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL",
    previewType: "site-component",
    previewMeta: {"componentTitle":"LEFT JOIN com Filtro de Inexistência (IS NULL)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">LEFT JOIN com Filtro de Inexistência (IS NULL)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LEFT\s+JOIN\s+pedidos[\s\S]*WHERE\s+p\.id\s+IS\s+NULL/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 113!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LEFT JOIN pedidos p ON c.id = p.cliente_id WHERE p.id IS NULL',
      };
    },
  },
  {
    id: 114,
    title: "Fase 114: Common Table Expressions (WITH / CTE) (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Organize uma subquery complexa usando a cláusula WITH (CTE) com rigor de produção",
    puzzleDescription: "Estruturação elegante de consultas analíticas e relatórios executivos. Neste desafio prático você irá dominar Common Table Expressions (WITH / CTE) aplicando código profissional.",
    initialCode: `WITH PedidosRecentes AS (
  SELECT cliente_id, SUM(valor) as total
  FROM pedidos
  WHERE data >= '2026-01-01'
  GROUP BY cliente_id
)
SELECT c.nome, pr.total
FROM clientes c
JOIN PedidosRecentes pr ON c.id = pr.cliente_id;`,
    hints: ["WITH cria uma tabela temporária nomeada (CTE) para a query.","Torna relatórios gigantes muito mais fáceis de ler e manter.","Faça o JOIN final com a CTE."],
    expectedConditionText: "WITH PedidosRecentes AS (...) SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Common Table Expressions (WITH / CTE)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Common Table Expressions (WITH / CTE)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WITH\s+PedidosRecentes\s+AS\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 114!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WITH PedidosRecentes AS (...) SELECT ...',
      };
    },
  },
  {
    id: 115,
    title: "Fase 115: Funções de Janela: ROW_NUMBER() (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Numere pedidos sequencialmente por cliente com ROW_NUMBER() com rigor de produção",
    puzzleDescription: "Ranking, paginação e identificação do registro mais recente por usuário. Neste desafio prático você irá dominar Funções de Janela: ROW_NUMBER() aplicando código profissional.",
    initialCode: `SELECT id, cliente_id, data, valor,
  ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC) as ordem_pedido
FROM pedidos;`,
    hints: ["Funções de janela calculam métricas sem agrupar nem esconder linhas.","PARTITION BY reinicia a contagem para cada cliente.","ORDER BY data DESC coloca o pedido mais recente como 1."],
    expectedConditionText: "ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: ROW_NUMBER()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: ROW_NUMBER()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /ROW_NUMBER\s*\(\s*\)\s*OVER\s*\(\s*PARTITION\s+BY\s+cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 115!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC)',
      };
    },
  },
  {
    id: 116,
    title: "Fase 116: Funções de Janela: LAG() e LEAD() (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Compare o valor da venda atual com a venda anterior usando LAG() com rigor de produção",
    puzzleDescription: "Análise de séries temporais, tendências financeiras e churn rate. Neste desafio prático você irá dominar Funções de Janela: LAG() e LEAD() aplicando código profissional.",
    initialCode: `SELECT data, valor,
  LAG(valor, 1) OVER (ORDER BY data) as venda_anterior
FROM vendas;`,
    hints: ["LAG busca o valor da linha anterior na ordenação.","Permite calcular crescimento percentual entre períodos.","LEAD faz o oposto, buscando a linha seguinte."],
    expectedConditionText: "LAG(valor, 1) OVER (ORDER BY data)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Funções de Janela: LAG() e LEAD()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Funções de Janela: LAG() e LEAD()</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /LAG\s*\(\s*valor\s*,\s*1\s*\)\s*OVER\s*\(\s*ORDER\s+BY\s+data\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 116!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: LAG(valor, 1) OVER (ORDER BY data)',
      };
    },
  },
  {
    id: 117,
    title: "Fase 117: Criação de Índices para Performance (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie um índice B-Tree composto nas colunas mais buscadas com rigor de produção",
    puzzleDescription: "Otimização fundamental de latência de banco de dados em produção. Neste desafio prático você irá dominar Criação de Índices para Performance aplicando código profissional.",
    initialCode: `CREATE INDEX idx_pedidos_cliente_data 
ON pedidos (cliente_id, data DESC);`,
    hints: ["Índices aceleram buscas de O(n) para O(log n).","Colunas usadas no WHERE e ORDER BY devem ser indexadas.","Evita table scans lentos em milhões de registros."],
    expectedConditionText: "CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Criação de Índices para Performance","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Criação de Índices para Performance</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+INDEX\s+idx_pedidos_cliente_data\s+ON\s+pedidos\s*\(\s*cliente_id/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 117!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data DESC)',
      };
    },
  },
  {
    id: 118,
    title: "Fase 118: Subquery Correlacionada com EXISTS (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Filtre produtos que possuem movimentação no estoque usando EXISTS com rigor de produção",
    puzzleDescription: "Verificação rápida de relacionamento entre tabelas pai e filho. Neste desafio prático você irá dominar Subquery Correlacionada com EXISTS aplicando código profissional.",
    initialCode: `SELECT p.id, p.nome
FROM produtos p
WHERE EXISTS (
  SELECT 1 FROM estoque e 
  WHERE e.produto_id = p.id AND e.quantidade > 0
);`,
    hints: ["EXISTS encerra a busca assim que encontra o primeiro registro correspondente.","Mais rápido que IN em tabelas volumosas.","Verifica e.produto_id = p.id."],
    expectedConditionText: "WHERE EXISTS (SELECT 1 FROM estoque ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Subquery Correlacionada com EXISTS","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Subquery Correlacionada com EXISTS</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /WHERE\s+EXISTS\s*\(\s*SELECT/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 118!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: WHERE EXISTS (SELECT 1 FROM estoque ...)',
      };
    },
  },
  {
    id: 119,
    title: "Fase 119: Transações ACID: COMMIT e ROLLBACK (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Estruture uma transferência bancária atômica com transação segura com rigor de produção",
    puzzleDescription: "Integridade de dados bancários, estoques e reservas concorrentes. Neste desafio prático você irá dominar Transações ACID: COMMIT e ROLLBACK aplicando código profissional.",
    initialCode: `BEGIN TRANSACTION;

UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;

COMMIT;`,
    hints: ["Transações garantem atomicidade: ou tudo passa ou nada muda.","Se houver falha, usa-se ROLLBACK para desfazer.","Finalize com COMMIT para gravar os dados de forma permanente."],
    expectedConditionText: "BEGIN TRANSACTION; ... COMMIT;",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Transações ACID: COMMIT e ROLLBACK","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Transações ACID: COMMIT e ROLLBACK</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /BEGIN\s+TRANSACTION;[\s\S]*COMMIT;/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 119!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: BEGIN TRANSACTION; ... COMMIT;',
      };
    },
  },
  {
    id: 120,
    title: "Fase 120: Views para Dashboards (CREATE VIEW) (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma visualização (VIEW) simplificada de vendas mensais com rigor de produção",
    puzzleDescription: "Construção de relatórios e isolamento de complexidade de dados. Neste desafio prático você irá dominar Views para Dashboards (CREATE VIEW) aplicando código profissional.",
    initialCode: `CREATE VIEW vw_vendas_resumo AS
SELECT 
  strftime('%Y-%m', data) as mes,
  COUNT(*) as total_pedidos,
  SUM(valor) as receita_total
FROM pedidos
GROUP BY mes;`,
    hints: ["Views encapsulam queries complexas como se fossem tabelas virtuais.","Simplifica o acesso para sistemas de BI e painéis analíticos.","Otimiza segurança ocultando tabelas sensíveis de baixo nível."],
    expectedConditionText: "CREATE VIEW vw_vendas_resumo AS SELECT ...",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Views para Dashboards (CREATE VIEW)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Views para Dashboards (CREATE VIEW)</span>: Pronto para validação.</div>","successBadge":"Especialista SQL"},
    validate: (rawCode) => {
      const passed = /CREATE\s+VIEW\s+vw_vendas_resumo\s+AS/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 120!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: CREATE VIEW vw_vendas_resumo AS SELECT ...',
      };
    },
  },
];
