import { GameLevel } from './types';
import { SQL_EXTRA_LEVELS } from './sql_extra';

const SQL_BASE_LEVELS: GameLevel[] = [
  // ==========================================
  // CAPÍTULO 1: O ENIGMA DA PORTA (FASES 1 A 10)
  // ==========================================
  {
    id: 1,
    title: 'Fase 1: O Booleano na Tabela',
    themeStyle: 'wooden',
    themeCategory: 'door',
    targetObjective: 'Atualize trancada para FALSE no UPDATE',
    puzzleDescription: 'A porta de madeira é controlada por um registro no banco de dados.',
    initialCode: `-- Modifique o status de trancada para FALSE:
UPDATE portas
SET trancada = TRUE
WHERE id = 1;
`,
    hints: [
      'O comando SQL está definindo trancada = TRUE.',
      'Altere a palavra TRUE para FALSE.',
      'Exemplo: SET trancada = FALSE.',
    ],
    expectedConditionText: 'SET trancada = FALSE',
    validate: (rawCode) => {
      if (/SET\s+trancada\s*=\s*(FALSE|false|0)\b/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Comando SQL executado com sucesso! A porta de madeira destrancou no banco!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A coluna trancada continua como TRUE. Altere para SET trancada = FALSE.',
      };
    },
  },
  {
    id: 2,
    title: 'Fase 2: Consultar a Chave de Ouro (SELECT)',
    themeStyle: 'iron',
    themeCategory: 'door',
    targetObjective: 'Consulte a chave com WHERE tipo = "ouro"',
    puzzleDescription: 'A fechadura de ferro só abre se a consulta buscar a chave de ouro.',
    initialCode: `-- Busque a chave correta no inventário de chaves:
SELECT * FROM chaves
WHERE tipo = 'ferrugem';
`,
    hints: [
      'Troque \'ferrugem\' por \'ouro\'.',
      'O banco retornará a chave dourada que abre o portão.',
    ],
    expectedConditionText: "WHERE tipo = 'ouro'",
    validate: (rawCode) => {
      if (/WHERE\s+tipo\s*=\s*['"]ouro['"]/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Chave de ouro selecionada! O trinco de ferro destrancou!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Filtro incorreto. Busque com WHERE tipo = \'ouro\'.',
      };
    },
  },
  {
    id: 3,
    title: 'Fase 3: O Código do Cofre',
    themeStyle: 'vault',
    themeCategory: 'door',
    targetObjective: 'Consulte a senha com WHERE codigo = 777',
    puzzleDescription: 'O cofre reforçado só destranca quando a consulta confere com 777.',
    initialCode: `-- Encontre o registro do cofre com código 777:
SELECT * FROM cofres
WHERE codigo = 0;
`,
    hints: [
      'Troque o número 0 por 777.',
      'A cláusula WHERE filtrará exatamente o cofre correto.',
    ],
    expectedConditionText: 'WHERE codigo = 777',
    validate: (rawCode) => {
      if (/WHERE\s+codigo\s*=\s*777\b/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Código 777 localizado na tabela! Os trincos do cofre se recolheram!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Altere para WHERE codigo = 777.',
      };
    },
  },
  {
    id: 4,
    title: 'Fase 4: Dois Sensores Ativos (AND)',
    themeStyle: 'scifi',
    themeCategory: 'door',
    targetObjective: 'Atualize ambos os sensores para status = "ativo"',
    puzzleDescription: 'O portal sci-fi necessita de ambos os registros alimentados.',
    initialCode: `-- Ative ambos os sensores do portal:
UPDATE sensores
SET sensor_a = 'ativo', sensor_b = 'inativo'
WHERE portal_id = 1;
`,
    hints: [
      'Altere sensor_b = \'inativo\' para sensor_b = \'ativo\'.',
      'Ambos precisam ter o valor \'ativo\'.',
    ],
    expectedConditionText: "sensor_a = 'ativo' e sensor_b = 'ativo'",
    validate: (rawCode) => {
      if (/sensor_a\s*=\s*['"]ativo['"]/i.test(rawCode) && /sensor_b\s*=\s*['"]ativo['"]/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Ambos os sensores ativos na tabela! O portal sci-fi se abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Defina sensor_b = \'ativo\' também.',
      };
    },
  },
  {
    id: 5,
    title: 'Fase 5: O Encantamento no Banco',
    themeStyle: 'portal',
    themeCategory: 'door',
    targetObjective: 'Insira o feitiço "abracadabra" na tabela de magias',
    puzzleDescription: 'O pedestal místico lê as invocações inseridas na tabela de feitiços.',
    initialCode: `-- Insira a palavra mística correta:
INSERT INTO feiticos (palavra)
VALUES ('silencio');
`,
    hints: [
      'Altere \'silencio\' para \'abracadabra\'.',
      'O comando INSERT colocará a palavra na tabela.',
    ],
    expectedConditionText: "VALUES ('abracadabra')",
    validate: (rawCode) => {
      if (/VALUES\s*\(\s*['"]abracadabra['"]\s*\)/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Palavra de poder inserida na tabela! O vórtice místico abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Insira o valor \'abracadabra\' na cláusula VALUES.',
      };
    },
  },
  {
    id: 6,
    title: 'Fase 6: A Contagem dos Cristais (COUNT)',
    themeStyle: 'portal',
    themeCategory: 'door',
    targetObjective: 'Consulte se COUNT(*) = 3 na mesa de runas',
    puzzleDescription: 'A função agregadora COUNT conta as linhas na tabela.',
    initialCode: `-- Verifique se existem exatamente 3 cristais:
SELECT COUNT(*) FROM cristais
HAVING COUNT(*) = 1;
`,
    hints: [
      'Troque HAVING COUNT(*) = 1 por HAVING COUNT(*) = 3.',
    ],
    expectedConditionText: 'COUNT(*) = 3',
    validate: (rawCode) => {
      if (/COUNT\s*\(\s*\*\s*\)\s*=\s*3\b/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Contagem confirmou 3 cristais! O portal dimensional abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Ajuste a condição para COUNT(*) = 3.',
      };
    },
  },
  {
    id: 7,
    title: 'Fase 7: A Tensão Máxima (ORDER BY & LIMIT)',
    themeStyle: 'scifi',
    themeCategory: 'door',
    targetObjective: 'Busque a maior voltagem com ORDER BY voltagem DESC LIMIT 1',
    puzzleDescription: 'Ordene do maior para o menor com DESC para canalizar a energia máxima.',
    initialCode: `-- Selecione o gerador de maior capacidade:
SELECT * FROM geradores
ORDER BY voltagem ASC
LIMIT 1;
`,
    hints: [
      'Altere ASC (crescente) para DESC (decrescente).',
      'Assim o gerador de maior voltagem virá primeiro.',
    ],
    expectedConditionText: 'ORDER BY voltagem DESC',
    validate: (rawCode) => {
      if (/ORDER\s+BY\s+voltagem\s+DESC\b/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Gerador de maior voltagem selecionado! Comporta liberada!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Ordene com ORDER BY voltagem DESC.',
      };
    },
  },
  {
    id: 8,
    title: 'Fase 8: Destruir a Trava (DELETE)',
    themeStyle: 'vault',
    themeCategory: 'door',
    targetObjective: 'Remova a trava com DELETE FROM travas WHERE id = 1',
    puzzleDescription: 'Deletar a linha da trava remove a barreira de proteção do cofre.',
    initialCode: `-- Delete a trava de segurança que bloqueia a porta:
DELETE FROM travas
WHERE id = 0;
`,
    hints: [
      'Altere WHERE id = 0 para WHERE id = 1.',
      'O comando DELETE removerá a linha da trava.',
    ],
    expectedConditionText: 'WHERE id = 1',
    validate: (rawCode) => {
      if (/DELETE\s+FROM\s+travas\s+WHERE\s+id\s*=\s*1\b/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Linha da trava excluída do banco! As engrenagens do cofre abriram!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Remova a trava com WHERE id = 1.',
      };
    },
  },
  {
    id: 9,
    title: 'Fase 9: Filtro de Negação (NOT)',
    themeStyle: 'iron',
    themeCategory: 'door',
    targetObjective: 'Consulte com WHERE NOT bloqueado',
    puzzleDescription: 'Selecione apenas as portas que não possuem o estado bloqueado.',
    initialCode: `-- Busque a porta onde bloqueado seja falso:
SELECT * FROM portas_seguranca
WHERE bloqueado = TRUE;
`,
    hints: [
      'Você pode usar: WHERE NOT bloqueado ou WHERE bloqueado = FALSE.',
    ],
    expectedConditionText: 'WHERE NOT bloqueado ou WHERE bloqueado = FALSE',
    validate: (rawCode) => {
      if (/WHERE\s+(NOT\s+bloqueado|bloqueado\s*=\s*FALSE)\b/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Filtro sem bloqueios aplicado! A porta de ferro abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Consulte usando WHERE NOT bloqueado ou WHERE bloqueado = FALSE.',
      };
    },
  },
  {
    id: 10,
    title: 'Fase 10: O Estado Destrancado',
    themeStyle: 'wooden',
    themeCategory: 'door',
    targetObjective: 'Altere status para "aberta" em todas as portas',
    puzzleDescription: 'O comando final do Capítulo 1 libera a passagem de madeira.',
    initialCode: `-- Atualize o status da porta para 'aberta':
UPDATE portal_mestre
SET status = 'fechada';
`,
    hints: [
      'Altere \'fechada\' para \'aberta\'.',
    ],
    expectedConditionText: "SET status = 'aberta'",
    validate: (rawCode) => {
      if (/SET\s+status\s*=\s*['"]aberta['"]/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Status atualizado para \'aberta\'! Você concluiu o Capítulo 1 das Portas em SQL!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Altere para SET status = \'aberta\'.',
      };
    },
  },

  // =======================================================
  // CAPÍTULO 2: CONSTRUÇÃO DE SITES REAIS (FASES 11 A 20)
  // =======================================================
  {
    id: 11,
    title: 'Fase 11: Criação da Tabela de Usuários (CREATE TABLE)',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Crie a tabela usuarios com id INT PRIMARY KEY, nome VARCHAR(100) e email VARCHAR(150) UNIQUE',
    puzzleDescription: 'Todo site que possui contas e login precisa de uma tabela oficial de usuários com chaves primárias e unicidade de email.',
    initialCode: `-- Crie a tabela fundamental de usuários do site:
CREATE TABLE usuarios (
  id INT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL
);
`,
    hints: [
      'PRIMARY KEY garante que cada usuário tenha um ID único e indexado.',
      'UNIQUE impede que dois usuários se cadastrem com o mesmo email.',
    ],
    expectedConditionText: 'CREATE TABLE usuarios com id PRIMARY KEY, nome e email UNIQUE',
    previewType: 'database-table',
    previewMeta: {
      componentTitle: 'Schema de Banco de Dados',
      previewSnippet: 'TABELA: usuarios\n• id (INT, PK)\n• nome (VARCHAR 100)\n• email (VARCHAR 150, UNIQUE)',
      successBadge: 'Tabela Criada',
    },
    validate: (rawCode) => {
      const hasCreate = /CREATE\s+TABLE\s+usuarios\b/i.test(rawCode);
      const hasPk = /id\s+INT\s+PRIMARY\s+KEY/i.test(rawCode);
      const hasEmail = /email\s+VARCHAR\s*\(\s*150\s*\)\s+UNIQUE/i.test(rawCode);
      if (hasCreate && hasPk && hasEmail) {
        return {
          success: true,
          doorState: true,
          message: 'Tabela de usuários criada com chave primária e restrição UNIQUE!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Defina CREATE TABLE usuarios com id INT PRIMARY KEY, nome e email VARCHAR(150) UNIQUE.',
      };
    },
  },
  {
    id: 12,
    title: 'Fase 12: Inserção de Produtos do E-commerce (INSERT INTO)',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Cadastre um produto na tabela com nome, preco e estoque usando INSERT INTO',
    puzzleDescription: 'Alimente o catálogo da loja online inserindo os produtos com nome, preço decimal e quantidade em estoque.',
    initialCode: `-- Cadastre um produto no catálogo da loja:
INSERT INTO produtos (nome, preco, estoque)
VALUES ('Monitor 4K 27pol', 1899.90, 15);
`,
    hints: [
      'INSERT INTO produtos especifica as colunas.',
      'VALUES fornece os valores correspondentes nas mesmas posições.',
    ],
    expectedConditionText: "INSERT INTO produtos (nome, preco, estoque) VALUES ('...', 1899.90, 15)",
    previewType: 'database-table',
    previewMeta: {
      componentTitle: 'Catálogo de Produtos',
      previewSnippet: 'ID | Nome             | Preço     | Estoque\n01 | Monitor 4K 27pol | R$ 1899,90| 15 un',
      successBadge: 'Produto Cadastrado',
    },
    validate: (rawCode) => {
      const hasInsert = /INSERT\s+INTO\s+produtos\s*\(\s*nome\s*,\s*preco\s*,\s*estoque\s*\)/i.test(rawCode);
      const hasValues = /VALUES\s*\(\s*['"][^'"]+['"]\s*,\s*\d+(\.\d+)?\s*,\s*\d+\s*\)/i.test(rawCode);
      if (hasInsert && hasValues) {
        return {
          success: true,
          doorState: true,
          message: 'Novo item gravado no catálogo do banco relacional!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Execute INSERT INTO produtos (nome, preco, estoque) com a cláusula VALUES.',
      };
    },
  },
  {
    id: 13,
    title: 'Fase 13: Filtro e Ordenação de Produtos (WHERE & ORDER BY)',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Consulte produtos com preco < 1000 ordenando do mais barato para o mais caro (ASC) com LIMIT 5',
    puzzleDescription: 'A query que abastece os filtros de "Menor Preço" e "Ofertas da Semana" em sites de e-commerce.',
    initialCode: `-- Busque os 5 produtos mais baratos abaixo de R$ 1000:
SELECT nome, preco FROM produtos
WHERE preco < 1000.00
ORDER BY preco ASC
LIMIT 5;
`,
    hints: [
      'WHERE preco < 1000.00 filtra apenas produtos acessíveis.',
      'ORDER BY preco ASC coloca os mais baratos primeiro.',
      'LIMIT 5 restringe aos 5 melhores resultados.',
    ],
    expectedConditionText: 'WHERE preco < 1000.00 ORDER BY preco ASC LIMIT 5',
    previewType: 'database-table',
    previewMeta: {
      componentTitle: 'Busca Otimizada de Produtos',
      previewSnippet: '1. Teclado USB: R$ 89,90\n2. Mouse Óptico: R$ 49,90\n(5 itens retornados em 2ms)',
      successBadge: 'Query Otimizada',
    },
    validate: (rawCode) => {
      const hasWhere = /WHERE\s+preco\s*<\s*1000/i.test(rawCode);
      const hasOrder = /ORDER\s+BY\s+preco\s+ASC\b/i.test(rawCode);
      const hasLimit = /LIMIT\s+5\b/i.test(rawCode);
      if (hasWhere && hasOrder && hasLimit) {
        return {
          success: true,
          doorState: true,
          message: 'Consulta de busca com filtro de preço, ordenação e limite de alta performance!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Inclua WHERE preco < 1000.00 ORDER BY preco ASC LIMIT 5.',
      };
    },
  },
  {
    id: 14,
    title: 'Fase 14: Relacionamento de Pedidos (FOREIGN KEY)',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Crie a tabela pedidos com FOREIGN KEY (usuario_id) REFERENCES usuarios(id)',
    puzzleDescription: 'Chaves estrangeiras ligam compras a clientes, garantindo a integridade dos relacionamentos.',
    initialCode: `-- Crie a tabela de pedidos ligada à tabela de usuários:
CREATE TABLE pedidos (
  id INT PRIMARY KEY,
  usuario_id INT,
  total DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
`,
    hints: [
      'FOREIGN KEY (usuario_id) REFERENCES usuarios(id) impede pedidos de clientes inexistentes.',
      'Mantenha a sintaxe da chave estrangeira.',
    ],
    expectedConditionText: 'FOREIGN KEY (usuario_id) REFERENCES usuarios(id)',
    previewType: 'database-table',
    previewMeta: {
      componentTitle: 'Relacionamento 1:N',
      previewSnippet: 'usuarios.id (1) ───◄ pedidos.usuario_id (Múltiplos pedidos)',
      successBadge: 'Integridade Relacional',
    },
    validate: (rawCode) => {
      const hasTable = /CREATE\s+TABLE\s+pedidos\b/i.test(rawCode);
      const hasFk = /FOREIGN\s+KEY\s*\(\s*usuario_id\s*\)\s*REFERENCES\s+usuarios\s*\(\s*id\s*\)/i.test(rawCode);
      if (hasTable && hasFk) {
        return {
          success: true,
          doorState: true,
          message: 'Relacionamento 1 para N estabelecido com integridade referencial!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Declare FOREIGN KEY (usuario_id) REFERENCES usuarios(id).',
      };
    },
  },
  {
    id: 15,
    title: 'Fase 15: Junção Relacional (INNER JOIN)',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Junte usuarios e pedidos com INNER JOIN pedidos ON usuarios.id = pedidos.usuario_id',
    puzzleDescription: 'INNER JOIN une tabelas diferentes para exibir na tela o nome do comprador ao lado do valor da compra.',
    initialCode: `-- Consulte o nome do cliente e o total do pedido juntos:
SELECT usuarios.nome, pedidos.total
FROM usuarios
INNER JOIN pedidos ON usuarios.id = pedidos.usuario_id;
`,
    hints: [
      'INNER JOIN pedidos traz as linhas associadas.',
      'ON usuarios.id = pedidos.usuario_id define o critério de junção.',
    ],
    expectedConditionText: 'INNER JOIN pedidos ON usuarios.id = pedidos.usuario_id',
    previewType: 'database-table',
    previewMeta: {
      componentTitle: 'Relatório de Compras',
      previewSnippet: 'Cliente: Carlos Silva | Total: R$ 450,00\nCliente: Ana Souza    | Total: R$ 1.200,00',
      successBadge: 'INNER JOIN OK',
    },
    validate: (rawCode) => {
      const hasJoin = /INNER\s+JOIN\s+pedidos\s+ON\s+usuarios\.id\s*=\s*pedidos\.usuario_id/i.test(rawCode);
      if (hasJoin) {
        return {
          success: true,
          doorState: true,
          message: 'Junção de tabelas executada com sucesso! Dados de clientes e compras unificados!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Utilize INNER JOIN pedidos ON usuarios.id = pedidos.usuario_id.',
      };
    },
  },
  {
    id: 16,
    title: 'Fase 16: Agrupamento de Vendas (GROUP BY & COUNT)',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Descubra a quantidade de produtos por categoria usando COUNT(*) e GROUP BY categoria',
    puzzleDescription: 'Dashboards administrativos usam GROUP BY para gerar gráficos de barras e relatórios por departamento.',
    initialCode: `-- Agrupe e conte quantos produtos existem em cada categoria:
SELECT categoria, COUNT(*) AS quantidade
FROM produtos
GROUP BY categoria;
`,
    hints: [
      'COUNT(*) conta os itens dentro de cada grupo.',
      'GROUP BY categoria agrupa os resultados pelo departamento.',
    ],
    expectedConditionText: 'SELECT categoria, COUNT(*) FROM produtos GROUP BY categoria',
    previewType: 'database-table',
    previewMeta: {
      componentTitle: 'Contagem por Categoria',
      previewSnippet: 'Eletrônicos: 42 produtos\nPeriféricos: 18 produtos\nAcessórios:  12 produtos',
      successBadge: 'GROUP BY OK',
    },
    validate: (rawCode) => {
      const hasCount = /COUNT\s*\(\s*\*\s*\)/i.test(rawCode);
      const hasGroup = /GROUP\s+BY\s+categoria\b/i.test(rawCode);
      if (hasCount && hasGroup) {
        return {
          success: true,
          doorState: true,
          message: 'Agrupamento analítico de dados gerado com precisão!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Utilize COUNT(*) e GROUP BY categoria.',
      };
    },
  },
  {
    id: 17,
    title: 'Fase 17: Faturamento com Filtro (SUM & HAVING)',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Calcule a soma de vendas por categoria e filtre categorias com faturamento > 5000 usando HAVING SUM(total) > 5000',
    puzzleDescription: 'A cláusula HAVING filtra os resultados após a agregação, identificando apenas as categorias mais lucrativas.',
    initialCode: `-- Encontre as categorias com vendas totais superiores a R$ 5000:
SELECT categoria, SUM(total) AS faturamento
FROM pedidos
GROUP BY categoria
HAVING SUM(total) > 5000.00;
`,
    hints: [
      'SUM(total) soma os valores monetários.',
      'HAVING SUM(total) > 5000 filtra grupos que superaram a meta.',
    ],
    expectedConditionText: 'SUM(total) ... GROUP BY categoria HAVING SUM(total) > 5000',
    previewType: 'database-table',
    previewMeta: {
      componentTitle: 'Categorias de Alta Receita',
      previewSnippet: 'Eletrônicos: R$ 45.890,00 (Meta Batida ✓)\nSmartphones: R$ 32.400,00 (Meta Batida ✓)',
      successBadge: 'HAVING Filter OK',
    },
    validate: (rawCode) => {
      const hasSum = /SUM\s*\(\s*total\s*\)/i.test(rawCode);
      const hasHaving = /HAVING\s+SUM\s*\(\s*total\s*\)\s*>\s*5000/i.test(rawCode);
      if (hasSum && hasHaving) {
        return {
          success: true,
          doorState: true,
          message: 'Métrica financeira de faturamento e filtro de metas executados!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Inclua SUM(total), GROUP BY categoria e HAVING SUM(total) > 5000.',
      };
    },
  },
  {
    id: 18,
    title: 'Fase 18: Atualização Segura de Status (UPDATE & WHERE)',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Atualize o pedido para status = "entregue" garantindo a cláusula WHERE id = 42',
    puzzleDescription: 'Regra de ouro de bancos de dados: NUNCA execute um UPDATE sem a cláusula WHERE para evitar alterar a tabela inteira!',
    initialCode: `-- Atualize com segurança o status da entrega:
UPDATE pedidos
SET status = 'entregue'
WHERE id = 42;
`,
    hints: [
      'SET status = \'entregue\' define o novo estado.',
      'WHERE id = 42 garante que apenas aquele pedido específico seja alterado.',
    ],
    expectedConditionText: "UPDATE pedidos SET status = 'entregue' WHERE id = 42",
    previewType: 'database-table',
    previewMeta: {
      componentTitle: 'Atualização Transacional',
      previewSnippet: 'UPDATE 1 linha afetada.\nPedido #42: status = "entregue"',
      successBadge: 'UPDATE Seguro',
    },
    validate: (rawCode) => {
      const hasUpdate = /UPDATE\s+pedidos\b/i.test(rawCode);
      const hasSet = /SET\s+status\s*=\s*['"]entregue['"]/i.test(rawCode);
      const hasWhere = /WHERE\s+id\s*=\s*42\b/i.test(rawCode);
      if (hasUpdate && hasSet && hasWhere) {
        return {
          success: true,
          doorState: true,
          message: 'Atualização segura realizada com sucesso sem riscos aos demais registros!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Execute UPDATE pedidos SET status = \'entregue\' WHERE id = 42.',
      };
    },
  },
  {
    id: 19,
    title: 'Fase 19: Transações Atômicas (BEGIN & COMMIT)',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Envolva as operações de débito e crédito no bloco BEGIN e COMMIT',
    puzzleDescription: 'Transações bancárias e de compras garantem que o dinheiro só saia de uma conta se entrar na outra (propriedade ACID).',
    initialCode: `-- Bloco atômico de transação segura:
BEGIN TRANSACTION;

UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;

COMMIT;
`,
    hints: [
      'BEGIN TRANSACTION inicia a transação segura.',
      'COMMIT confirma as alterações no disco se tudo deu certo.',
    ],
    expectedConditionText: 'BEGIN TRANSACTION com COMMIT',
    previewType: 'database-table',
    previewMeta: {
      componentTitle: 'Transação Atômica ACID',
      previewSnippet: 'BEGIN → Débito R$ 100 → Crédito R$ 100 → COMMIT (Operação 100% segura)',
      successBadge: 'Transação ACID OK',
    },
    validate: (rawCode) => {
      const hasBegin = /BEGIN\s+(TRANSACTION)?/i.test(rawCode);
      const hasCommit = /COMMIT\b/i.test(rawCode);
      if (hasBegin && hasCommit) {
        return {
          success: true,
          doorState: true,
          message: 'Transação ACID atômica implementada para operações de alta confiabilidade!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Envolva as operações com BEGIN TRANSACTION e finalize com COMMIT.',
      };
    },
  },
  {
    id: 20,
    title: 'Fase 20: Visão de Dashboard Administrativo (CREATE VIEW)',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Crie uma visão permanente com CREATE VIEW relatorio_vendas AS SELECT ...',
    puzzleDescription: 'Views funcionam como tabelas virtuais prontas que fornecem dados mastigados para painéis e relatórios da diretoria.',
    initialCode: `-- Crie a view consolidada para alimentar o dashboard do site:
CREATE VIEW relatorio_vendas AS
SELECT usuarios.nome, pedidos.total, pedidos.status
FROM usuarios
INNER JOIN pedidos ON usuarios.id = pedidos.usuario_id;
`,
    hints: [
      'CREATE VIEW nome_da_view AS cria a tabela virtual.',
      'A query SELECT define os dados que estarão sempre atualizados na visão.',
    ],
    expectedConditionText: 'CREATE VIEW relatorio_vendas AS SELECT ...',
    previewType: 'database-table',
    previewMeta: {
      componentTitle: 'View de Painel Administrativo',
      previewSnippet: 'VIEW: relatorio_vendas\n(Disponível para gráficos e relatórios do frontend em tempo real)',
      successBadge: 'Mestre em SQL & Bancos',
    },
    validate: (rawCode) => {
      const hasView = /CREATE\s+VIEW\s+relatorio_vendas\s+AS\s+SELECT\b/i.test(rawCode);
      if (hasView) {
        return {
          success: true,
          doorState: true,
          message: '🏆 EXTRAORDINÁRIO! Você dominou o SQL e agora cria arquiteturas completas de banco de dados para qualquer aplicação web!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Crie a view com CREATE VIEW relatorio_vendas AS SELECT ....',
      };
    },
  },
];

export const SQL_LEVELS: GameLevel[] = [...SQL_BASE_LEVELS, ...SQL_EXTRA_LEVELS];
