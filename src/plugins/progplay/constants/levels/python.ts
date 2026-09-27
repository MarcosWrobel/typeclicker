import { GameLevel } from './types';
import { PYTHON_EXTRA_LEVELS } from './python_extra';

const PYTHON_BASE_LEVELS: GameLevel[] = [
  // ==========================================
  // CAPÍTULO 1: O ENIGMA DA PORTA (FASES 1 A 10)
  // ==========================================
  {
    id: 1,
    title: 'Fase 1: O Booleano de Python',
    themeStyle: 'wooden',
    themeCategory: 'door',
    targetObjective: 'Mude porta_aberta para True',
    puzzleDescription: 'Em Python, valores booleanos começam com letra Maiúscula (True e False).',
    initialCode: `# Em Python, o sinal lógico da porta precisa ser afirmativo:
porta_aberta = False
`,
    hints: [
      'Em Python, verdadeiro é escrito com T maiúsculo: "True".',
      'Substitua "False" por "True".',
      'Execute o código para transmitir o sinal.',
    ],
    expectedConditionText: 'porta_aberta = True',
    validate: (rawCode) => {
      if (/porta_aberta\s*=\s*(True|true)\b/.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Excelente! Em Python, porta_aberta = True destrancou a porta de madeira!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A porta continua fechada. Altere porta_aberta para True.',
      };
    },
  },
  {
    id: 2,
    title: 'Fase 2: A Chave Dourada',
    themeStyle: 'iron',
    themeCategory: 'door',
    targetObjective: 'Defina tem_chave = True',
    puzzleDescription: 'A fechadura de ferro rústica exige a posse da chave mestra.',
    initialCode: `# Para girar o mecanismo de ferro, pegue a chave:
tem_chave = False
porta_aberta = tem_chave
`,
    hints: [
      'A variável porta_aberta recebe o mesmo valor de tem_chave.',
      'Mude tem_chave para True.',
    ],
    expectedConditionText: 'tem_chave = True',
    validate: (rawCode) => {
      if (/tem_chave\s*=\s*(True|true)\b/.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Chave obtida! O mecanismo de ferro destrancou a porta!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Você ainda não possui a chave. Defina tem_chave = True.',
      };
    },
  },
  {
    id: 3,
    title: 'Fase 3: O Código Secreto de Python',
    themeStyle: 'vault',
    themeCategory: 'door',
    targetObjective: 'Defina senha_digitada = 777',
    puzzleDescription: 'O teclado do cofre requer o número correto para retrair os pinos de segurança.',
    initialCode: `# O cofre reforçado abre apenas com o número 777:
senha_correta = 777
senha_digitada = 0

porta_aberta = (senha_digitada == senha_correta)
`,
    hints: [
      'Altere o valor de senha_digitada para 777.',
      'O operador == compara se ambos os valores são iguais.',
    ],
    expectedConditionText: 'senha_digitada = 777',
    validate: (rawCode) => {
      if (/senha_digitada\s*=\s*777\b/.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Senha 777 aceita! Os pinos pesados do cofre se retraíram!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Senha incorreta. Defina senha_digitada = 777.',
      };
    },
  },
  {
    id: 4,
    title: 'Fase 4: O Operador "and" de Python',
    themeStyle: 'scifi',
    themeCategory: 'door',
    targetObjective: 'Ligue ambos os circuitos usando o operador and',
    puzzleDescription: 'Diferente de C/JS que usam &&, Python usa a palavra legível "and".',
    initialCode: `# Ative ambos os interruptores para energizar o portal sci-fi:
interruptor_A = True
interruptor_B = False

porta_aberta = interruptor_A and interruptor_B
`,
    hints: [
      'Em Python usamos a palavra "and" minúscula.',
      'Mude interruptor_B para True.',
    ],
    expectedConditionText: 'interruptor_A = True e interruptor_B = True',
    validate: (rawCode) => {
      const a = /interruptor_A\s*=\s*(True|true)\b/.test(rawCode);
      const b = /interruptor_B\s*=\s*(True|true)\b/.test(rawCode);
      if (a && b) {
        return {
          success: true,
          doorState: true,
          message: 'Ambos os interruptores ligados! O portal sci-fi se abriu com Python!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Ligue também o interruptor_B definindo como True.',
      };
    },
  },
  {
    id: 5,
    title: 'Fase 5: A Palavra Mágica',
    themeStyle: 'portal',
    themeCategory: 'door',
    targetObjective: 'Defina o encantamento como "abracadabra"',
    puzzleDescription: 'O vórtice dimensional requer o texto místico exato.',
    initialCode: `# Pronuncie o encantamento correto:
encantamento = "silencio"

porta_aberta = (encantamento == "abracadabra")
`,
    hints: [
      'Em Python textos (strings) podem usar aspas simples ou duplas.',
      'Substitua "silencio" por "abracadabra".',
    ],
    expectedConditionText: 'encantamento = "abracadabra"',
    validate: (rawCode) => {
      if (/encantamento\s*=\s*["']abracadabra["']/.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'O feitiço ressoou em Python! O portal místico abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Defina encantamento = "abracadabra".',
      };
    },
  },
  {
    id: 6,
    title: 'Fase 6: A Lista de Cristais (len)',
    themeStyle: 'portal',
    themeCategory: 'door',
    targetObjective: 'Insira 3 cristais na lista em Python',
    puzzleDescription: 'A função len(cristais) verifica a contagem de elementos na lista.',
    initialCode: `# O pedestal exige uma lista com exatamente 3 cristais:
cristais = ["rubi"]

porta_aberta = (len(cristais) == 3)
`,
    hints: [
      'Adicione mais 2 elementos à lista, separados por vírgula.',
      'Exemplo: cristais = ["rubi", "safira", "esmeralda"].',
    ],
    expectedConditionText: 'len(cristais) == 3',
    validate: (rawCode) => {
      const match = rawCode.match(/cristais\s*=\s*\[(.*?)\]/s);
      if (match) {
        const items = match[1].split(',').filter(x => x.trim().length > 0);
        if (items.length === 3) {
          return {
            success: true,
            doorState: true,
            message: '3 cristais alinhados! len(cristais) == 3 abriu o portal!',
          };
        }
      }
      return {
        success: false,
        doorState: false,
        message: 'A lista precisa de exatamente 3 cristais para ter tamanho 3.',
      };
    },
  },
  {
    id: 7,
    title: 'Fase 7: Potência Mínima',
    themeStyle: 'scifi',
    themeCategory: 'door',
    targetObjective: 'Ajuste a voltagem para pelo menos 100',
    puzzleDescription: 'O circuito da comporta necessita de 100 ou mais volts.',
    initialCode: `# Aumente a voltagem para liberar o eletroímã:
voltagem = 50

porta_aberta = (voltagem >= 100)
`,
    hints: [
      'Altere o número 50 para 100 ou maior.',
    ],
    expectedConditionText: 'voltagem >= 100',
    validate: (rawCode) => {
      const match = rawCode.match(/voltagem\s*=\s*(\d+)/);
      if (match && parseInt(match[1], 10) >= 100) {
        return {
          success: true,
          doorState: true,
          message: 'Tensão nominal atingida! Os eletroímãs liberaram a comporta!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A voltagem precisa ser igual ou superior a 100.',
      };
    },
  },
  {
    id: 8,
    title: 'Fase 8: O Operador "not"',
    themeStyle: 'vault',
    themeCategory: 'door',
    targetObjective: 'Desative a trava com trava_ativa = False',
    puzzleDescription: 'O operador "not" inverte o valor em Python: not False resulta em True.',
    initialCode: `# Desligue a trava de bloqueio para que not trava_ativa abra a porta:
trava_ativa = True

porta_aberta = not trava_ativa
`,
    hints: [
      'Altere trava_ativa para False.',
      'O operador not inverterá False para True.',
    ],
    expectedConditionText: 'trava_ativa = False',
    validate: (rawCode) => {
      if (/trava_ativa\s*=\s*(False|false)\b/.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Trava desativada! not False resultou em True e o cofre abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Mude trava_ativa para False.',
      };
    },
  },
  {
    id: 9,
    title: 'Fase 9: Dicionário de Configuração',
    themeStyle: 'iron',
    themeCategory: 'door',
    targetObjective: 'Defina o dicionário portal com "aberto": True',
    puzzleDescription: 'Dicionários em Python usam chaves e valores: {"chave": valor}.',
    initialCode: `# Configure o dicionário da porta com a chave "aberto":
portal = {
    "nome": "Principal",
    "aberto": False
}

porta_aberta = portal["aberto"]
`,
    hints: [
      'Localize "aberto": False dentro do dicionário portal.',
      'Troque para "aberto": True.',
    ],
    expectedConditionText: 'portal["aberto"] == True',
    validate: (rawCode) => {
      if (/["']aberto["']\s*:\s*(True|true)\b/.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Dicionário Python configurado com "aberto": True! Porta de ferro liberada!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Altere a chave "aberto" para True dentro do dicionário.',
      };
    },
  },
  {
    id: 10,
    title: 'Fase 10: A Função "def destravar()"',
    themeStyle: 'wooden',
    themeCategory: 'door',
    targetObjective: 'Complete a função em Python para retornar True',
    puzzleDescription: 'Funções em Python são declaradas com a palavra-chave def.',
    initialCode: `# Faça a função destravar retornar True:
def destravar():
    return False

porta_aberta = destravar()
`,
    hints: [
      'Em Python a indentação (espaços) dentro da função é fundamental.',
      'Mude "return False" para "return True".',
    ],
    expectedConditionText: 'def destravar(): return True',
    validate: (rawCode) => {
      if (/def\s+destravar\s*\(\s*\)\s*:[\s\S]*return\s+(True|true)\b/.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Função Python executada com sucesso! Você completou o Capítulo 1 das Portas em Python!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Altere o retorno da função para "return True".',
      };
    },
  },

  // =======================================================
  // CAPÍTULO 2: CONSTRUÇÃO DE SITES REAIS (FASES 11 A 20)
  // =======================================================
  {
    id: 11,
    title: 'Fase 11: Catálogo de Produtos Web (Dicts & Listas)',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Estruture um produto como dicionário contendo "id", "nome" e "preco"',
    puzzleDescription: 'Servidores backend em Python (como FastAPI e Flask) processam e respondem dados estruturados em dicionários.',
    initialCode: `# ============================================================
# MISSÃO: Estruture o dicionário do produto para a API web.
# INSTRUÇÕES:
# 1. Adicione a chave "id" com o número identificador (ex: 1)
# 2. Adicione a chave "nome" com o nome do produto (ex: "Notebook Gamer")
# 3. Adicione a chave "preco" com o valor numérico (ex: 4500.0)
# 4. Adicione a chave "disponivel" com o valor True
# ============================================================

produto = {
    # TODO: Digite as chaves e valores abaixo conforme as instruções:
    
}
`,
    hints: [
      'Dicionários associam chaves e valores com sintaxe "chave": valor.',
      'Garanta que as chaves "id", "nome", "preco" e "disponivel" estejam presentes.',
    ],
    expectedConditionText: 'dicionário com "id", "nome", "preco" e "disponivel"',
    previewType: 'terminal',
    previewMeta: {
      componentTitle: 'JSON de Resposta da API',
      previewSnippet: '{\n  "id": 1,\n  "nome": "Notebook Gamer",\n  "preco": 4500.0\n}',
      successBadge: 'Modelo de Dados OK',
    },
    validate: (rawCode) => {
      const hasId = /["']id["']\s*:\s*\d+/.test(rawCode);
      const hasNome = /["']nome["']\s*:\s*["'][^"']+["']/.test(rawCode);
      const hasPreco = /["']preco["']\s*:\s*\d+(\.\d+)?/.test(rawCode);
      if (hasId && hasNome && hasPreco) {
        return {
          success: true,
          doorState: true,
          message: 'Dicionário estruturado conforme o padrão de APIs REST modernas!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Inclua as chaves "id", "nome" e "preco" no dicionário.',
      };
    },
  },
  {
    id: 12,
    title: 'Fase 12: Serialização JSON (json.dumps)',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Converta o dicionário em string JSON usando import json e json.dumps()',
    puzzleDescription: 'Antes de enviar dados pela internet para o frontend React, o servidor Python converte objetos em texto JSON.',
    initialCode: `# ============================================================
# MISSÃO: Serializar dados de Python para texto JSON da Web.
# INSTRUÇÕES:
# 1. Importe o módulo nativo do Python digitando: import json
# 2. Converta o dicionário dados_usuario em JSON usando:
#    json.dumps(dados_usuario)
# 3. Guarde o resultado na variável payload_json.
# ============================================================

# PASSO 1: Faça o import do módulo json na linha abaixo:


dados_usuario = {"nome": "Maria", "email": "maria@site.com", "ativo": True}

# PASSO 2: Use json.dumps(dados_usuario) e atribua a payload_json:
payload_json = ""
`,
    hints: [
      'import json importa o módulo nativo do Python.',
      'json.dumps(objeto) serializa dados para o formato de texto JSON.',
    ],
    expectedConditionText: 'import json com json.dumps(dados_usuario)',
    previewType: 'terminal',
    previewMeta: {
      componentTitle: 'Payload HTTP JSON',
      previewSnippet: 'Content-Type: application/json\n{"nome": "Maria", "email": "maria@site.com", "ativo": true}',
      successBadge: 'Serialização JSON OK',
    },
    validate: (rawCode) => {
      const hasImport = /import\s+json\b/.test(rawCode);
      const hasDumps = /json\.dumps\s*\(\s*dados_usuario\s*\)/.test(rawCode);
      if (hasImport && hasDumps) {
        return {
          success: true,
          doorState: true,
          message: 'Dados serializados em JSON prontos para transmissão web!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Importe json e utilize json.dumps(dados_usuario).',
      };
    },
  },
  {
    id: 13,
    title: 'Fase 13: Roteador HTTP de API',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Crie a função rotear(caminho) que responde dados quando caminho == "/api/produtos"',
    puzzleDescription: 'Roteadores direcionam as URLs digitadas no navegador para as funções corretas no backend.',
    initialCode: `# ============================================================
# MISSÃO: Construir o despachante de rotas (Router) da API.
# INSTRUÇÕES:
# 1. Complete a função rotear(caminho):
# 2. Se caminho for igual a "/api/produtos", retorne:
#    {"status": 200, "dados": ["Item 1", "Item 2"]}
# 3. Caso contrário (else), retorne erro 404:
#    {"status": 404, "erro": "Rota não encontrada"}
# ============================================================

def rotear(caminho):
    # PASSO 1: Verifique se caminho == "/api/produtos":
    
    # PASSO 2: Caso a rota não seja reconhecida, retorne o erro com status 404:
    return {"status": 0}
`,
    hints: [
      'A função compara o caminho com "/api/produtos" usando if caminho == "/api/produtos":',
      'Caso a rota não exista, retorne {"status": 404, "erro": "Rota não encontrada"}.',
    ],
    expectedConditionText: 'def rotear(caminho) com rota "/api/produtos" e fallback 404',
    previewType: 'terminal',
    previewMeta: {
      componentTitle: 'API Gateway Router',
      previewSnippet: 'GET /api/produtos → 200 OK (2 itens)\nGET /desconhecido → 404 Not Found',
      successBadge: 'Roteamento Web OK',
    },
    validate: (rawCode) => {
      const hasRoute = /caminho\s*==\s*["']\/api\/produtos["']/.test(rawCode);
      const has404 = /404/.test(rawCode);
      if (hasRoute && has404) {
        return {
          success: true,
          doorState: true,
          message: 'Roteador web funcional com tratamento de rotas e status 404!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Implemente a rota "/api/produtos" e o retorno 404 no roteador.',
      };
    },
  },
  {
    id: 14,
    title: 'Fase 14: Validador de Payload de Cadastro',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Valide se "email" e "senha" existem no dicionário e se len(payload["senha"]) >= 6',
    puzzleDescription: 'Backends seguros nunca confiam nos dados enviados pelo cliente: validam cada campo antes de salvar no banco.',
    initialCode: `# ============================================================
# MISSÃO: Criar o middleware de validação de dados de cadastro.
# INSTRUÇÕES:
# 1. Verifique se as chaves "email" e "senha" existem no payload com:
#    "email" in payload and "senha" in payload
# 2. Verifique se o tamanho da senha é seguro:
#    len(payload["senha"]) >= 6
# 3. Se tudo for válido, retorne True. Caso contrário, retorne False.
# ============================================================

def validar_cadastro(payload):
    # PASSO 1: Verifique se "email" in payload and "senha" in payload
    # PASSO 2: Verifique se len(payload["senha"]) >= 6 e retorne True
    
    return False
`,
    hints: [
      '"email" in payload verifica a existência da chave no dicionário.',
      'len(payload["senha"]) >= 6 assegura a política mínima de segurança.',
    ],
    expectedConditionText: '"email" in payload, "senha" in payload e len(senha) >= 6',
    previewType: 'terminal',
    previewMeta: {
      componentTitle: 'Middleware de Validação',
      previewSnippet: 'POST /api/cadastro {"email":"dev@site.com","senha":"******"}\nStatus: Válido (201 Created)',
      successBadge: 'Payload Validado',
    },
    validate: (rawCode) => {
      const hasEmail = /["']email["']\s+in\s+payload/.test(rawCode);
      const hasPass = /["']senha["']\s+in\s+payload/.test(rawCode);
      const hasLen = /len\s*\(\s*payload\[["']senha["']\]\s*\)\s*>=\s*6/.test(rawCode);
      if (hasEmail && hasPass && hasLen) {
        return {
          success: true,
          doorState: true,
          message: 'Middleware de validação aprovado! Protege a base contra dados inválidos!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Verifique se "email" e "senha" estão no payload e len(payload["senha"]) >= 6.',
      };
    },
  },
  {
    id: 15,
    title: 'Fase 15: Autenticação com Bearer Token',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Crie autenticar(header) que valida se o header começa com "Bearer " e confere o token',
    puzzleDescription: 'Rotas protegidas de administração e dashboards exigem tokens de autorização no cabeçalho HTTP.',
    initialCode: `# ============================================================
# MISSÃO: Proteger endpoints da API com cabeçalho de autenticação.
# INSTRUÇÕES:
# 1. No protocolo HTTP, o token é enviado como "Bearer <token>".
# 2. Verifique se o header começa com "Bearer ":
#    header_autorizacao.startswith("Bearer ")
# 3. Extraia o token: token = header_autorizacao.split(" ")[1]
# 4. Compare o token extraído com TOKEN_SECRETO e retorne True se igual.
# ============================================================

TOKEN_SECRETO = "token-admin-2026"

def autenticar(header_autorizacao):
    # PASSO 1: Verifique se header_autorizacao.startswith("Bearer "):
    # PASSO 2: Compare o token extraído com TOKEN_SECRETO:
    
    return False
`,
    hints: [
      'header_autorizacao.startswith("Bearer ") valida o protocolo padrão OAuth/JWT.',
      'split(" ")[1] extrai a sequência do token.',
      'Compare token == TOKEN_SECRETO.',
    ],
    expectedConditionText: 'startswith("Bearer ") e comparação com TOKEN_SECRETO',
    previewType: 'terminal',
    previewMeta: {
      componentTitle: 'Segurança & Auth Guard',
      previewSnippet: 'Authorization: Bearer token-admin-2026\nStatus: 200 Acesso Autorizado',
      successBadge: 'Auth Guard OK',
    },
    validate: (rawCode) => {
      const hasBearer = /startswith\s*\(\s*["']Bearer\s*["']\s*\)/.test(rawCode);
      const hasSecret = /TOKEN_SECRETO/.test(rawCode);
      if (hasBearer && hasSecret) {
        return {
          success: true,
          doorState: true,
          message: 'Autenticação de API implementada! Protege endpoints restritos do site!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Implemente startswith("Bearer ") e valide o token contra TOKEN_SECRETO.',
      };
    },
  },
  {
    id: 16,
    title: 'Fase 16: Banco de Dados em Memória (CRUD)',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Crie adicionar_produto(banco, item) que adiciona com .append() e retorna o banco atualizado',
    puzzleDescription: 'CRUD (Create, Read, Update, Delete) é a base de funcionamento de blogs, lojas e redes sociais.',
    initialCode: `# ============================================================
# MISSÃO: Operação CREATE (Inserção) no banco em memória da API.
# INSTRUÇÕES:
# 1. Dentro da função adicionar_produto, insira o item na lista usando:
#    banco.append(novo_item)
# 2. Abaixo da função, faça a chamada para cadastrar o segundo produto:
#    adicionar_produto(catalogo, {"id": 2, "nome": "Mouse Sem Fio"})
# ============================================================

catalogo = [
    {"id": 1, "nome": "Teclado Mecânico"}
]

def adicionar_produto(banco, novo_item):
    # PASSO 1: Adicione novo_item na lista banco usando .append():
    
    return len(banco)

# PASSO 2: Chame a função adicionar_produto(catalogo, {"id": 2, "nome": "Mouse Sem Fio"}):

`,
    hints: [
      'banco.append(novo_item) adiciona o elemento ao fim da lista.',
      'Chame a função passando catalogo e o novo produto.',
    ],
    expectedConditionText: 'banco.append(novo_item) e chamada com novo produto',
    previewType: 'terminal',
    previewMeta: {
      componentTitle: 'Operação de Criação (CRUD)',
      previewSnippet: 'POST /api/produtos → 201 Created (Total: 2 produtos cadastrados)',
      successBadge: 'CRUD Create OK',
    },
    validate: (rawCode) => {
      const hasAppend = /banco\.append\s*\(\s*novo_item\s*\)/.test(rawCode);
      const hasCall = /adicionar_produto\s*\(\s*catalogo/.test(rawCode);
      if (hasAppend && hasCall) {
        return {
          success: true,
          doorState: true,
          message: 'Operação de criação em banco de dados em memória bem-sucedida!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Use banco.append(novo_item) e chame adicionar_produto(catalogo, ...).',
      };
    },
  },
  {
    id: 17,
    title: 'Fase 17: Paginação de Resultados (Limit & Offset)',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Fatie a lista de dados usando itens[offset : offset + limit]',
    puzzleDescription: 'Nenhum site carrega 100.000 produtos de uma vez: o servidor fatia os dados página a página com paginação.',
    initialCode: `# ============================================================
# MISSÃO: Paginar grandes listas da API para não sobrecarregar a web.
# INSTRUÇÕES:
# 1. O offset calcula de onde começar: offset = (pagina - 1) * limite
# 2. Retorne a fatia da lista usando fatiamento (slice):
#    return itens[offset : offset + limite]
# 3. Na chamada abaixo, busque a página 1 com limite de 3 itens:
#    paginar_resultados(produtos_loja, 1, 3)
# ============================================================

produtos_loja = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"]

def paginar_resultados(itens, pagina, limite):
    offset = (pagina - 1) * limite
    # PASSO 1: Retorne itens[offset : offset + limite] abaixo:
    return []

# PASSO 2: Chame paginar_resultados(produtos_loja, 1, 3) e guarde em pagina_1:
pagina_1 = []
`,
    hints: [
      'O operador de fatia de listas em Python é [inicio : fim].',
      'offset = (pagina - 1) * limite calcula onde iniciar.',
      'itens[offset : offset + limite] pega exatamente a quantidade do limite.',
    ],
    expectedConditionText: 'itens[offset : offset + limite]',
    previewType: 'terminal',
    previewMeta: {
      componentTitle: 'Paginação de API',
      previewSnippet: 'GET /api/produtos?pagina=1&limite=3 → ["P1", "P2", "P3"]\nTotal Páginas: 3',
      successBadge: 'Paginação Concluída',
    },
    validate: (rawCode) => {
      const hasSlice = /\[\s*offset\s*:\s*offset\s*\+\s*limite\s*\]/.test(rawCode);
      const hasCall = /paginar_resultados\s*\(/.test(rawCode);
      if (hasSlice && hasCall) {
        return {
          success: true,
          doorState: true,
          message: 'Paginação de alta eficiência implementada com fatiamento nativo de Python!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Utilize o fatiamento itens[offset : offset + limite] e chame a função.',
      };
    },
  },
  {
    id: 18,
    title: 'Fase 18: Calculadora de Checkout com Cupom',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Calcule o total final aplicando percentual de desconto e somando taxa de frete',
    puzzleDescription: 'O motor de checkout do servidor calcula os valores oficiais antes de cobrar o cartão do cliente.',
    initialCode: `# ============================================================
# MISSÃO: Calcular o total oficial de uma compra de e-commerce.
# INSTRUÇÕES:
# 1. O desconto é calculado com: subtotal * (cupom_percentual / 100.0)
# 2. Calcule o total_final com a fórmula:
#    total_final = (subtotal - desconto) + frete
# 3. Chame a função com subtotal 200.0, cupom 10% e frete 15.0:
#    calcular_pedido(200.0, 10, 15.0)
# ============================================================

def calcular_pedido(subtotal, cupom_percentual, frete):
    desconto = subtotal * (cupom_percentual / 100.0)
    # PASSO 1: Calcule total_final = (subtotal - desconto) + frete:
    total_final = 0.0
    return round(total_final, 2)

# PASSO 2: Chame calcular_pedido(200.0, 10, 15.0) e guarde em total:
total = 0.0
`,
    hints: [
      'desconto = subtotal * (cupom_percentual / 100.0).',
      'total_final = (subtotal - desconto) + frete.',
      'round(total_final, 2) arredonda para duas casas decimais.',
    ],
    expectedConditionText: 'cálculo do total com desconto e frete',
    previewType: 'terminal',
    previewMeta: {
      componentTitle: 'Motor de Checkout',
      previewSnippet: 'Subtotal: R$ 200,00\nDesconto (10%): -R$ 20,00\nFrete: +R$ 15,00\nTotal Oficial: R$ 195,00',
      successBadge: 'Checkout Aprovado',
    },
    validate: (rawCode) => {
      const hasFormula = /(subtotal\s*-\s*desconto\s*\+\s*frete|\(subtotal\s*-\s*desconto\)\s*\+\s*frete)/.test(rawCode);
      const hasCall = /calcular_pedido\s*\(/.test(rawCode);
      if (hasFormula && hasCall) {
        return {
          success: true,
          doorState: true,
          message: 'Motor financeiro de checkout aprovado com precisão decimal!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Implemente a fórmula (subtotal - desconto) + frete e chame calcular_pedido.',
      };
    },
  },
  {
    id: 19,
    title: 'Fase 19: Tratamento de Exceções HTTP (Try/Except)',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Capture erros com bloco try/except e retorne {"status": 500, "erro": str(e)}',
    puzzleDescription: 'Servidores robustos nunca travam: capturam erros com try/except e respondem mensagens amigáveis.',
    initialCode: `# ============================================================
# MISSÃO: Blindar a API contra erros inesperados com Try / Except.
# INSTRUÇÕES:
# 1. No bloco 'try:', execute a operação arriscada e retorne sucesso:
#    try:
#        resultado = operacao()
#        return {"status": 200, "sucesso": True, "resultado": resultado}
# 2. No bloco 'except Exception as erro:', capture a falha e retorne erro 500:
#    except Exception as erro:
#        return {"status": 500, "sucesso": False, "mensagem": str(erro)}
# ============================================================

def executar_transacao_segura(operacao):
    # PASSO 1: Abra o bloco try:
    
    # PASSO 2: Abra o bloco except Exception as erro: com retorno 500
    pass
`,
    hints: [
      'O bloco try executa a ação arriscada.',
      'except Exception as erro captura qualquer falha sem derrubar o servidor.',
      'Retorne status 500 caso ocorra falha.',
    ],
    expectedConditionText: 'try/except retornando status 500 no erro',
    previewType: 'terminal',
    previewMeta: {
      componentTitle: 'Tratamento de Erros de API',
      previewSnippet: 'STATUS: 500 Internal Server Error\n{"sucesso": false, "mensagem": "Erro capturado com segurança"}',
      successBadge: 'Resiliência Web OK',
    },
    validate: (rawCode) => {
      const hasTry = /try\s*:/.test(rawCode);
      const hasExcept = /except\s+(Exception\s+as\s+\w+|\w+)\s*:/.test(rawCode);
      const has500 = /500/.test(rawCode);
      if (hasTry && hasExcept && has500) {
        return {
          success: true,
          doorState: true,
          message: 'Tratamento de exceções profissional com respostas padronizadas!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Implemente o bloco try/except com retorno de erro status 500.',
      };
    },
  },
  {
    id: 20,
    title: 'Fase 20: Servidor Web RESTful Completo em Python',
    themeStyle: 'web-api',
    themeCategory: 'web-builder',
    targetObjective: 'Monte a classe AppServer com métodos get e post simulando a API central do site',
    puzzleDescription: 'O ápice do desenvolvedor backend: criar a espinha dorsal que conecta o banco de dados com a interface do usuário.',
    initialCode: `# ============================================================
# MISSÃO: Construir o servidor web RESTful central em Python.
# INSTRUÇÕES:
# 1. Complete a classe AppServer.
# 2. Defina o método registrar_rota:
#    def registrar_rota(self, caminho, manipulador):
#        self.rotas[caminho] = manipulador
# 3. Defina o método processar:
#    def processar(self, caminho):
#        if caminho in self.rotas:
#            return {"status": 200, "resposta": self.rotas[caminho]()}
#        return {"status": 404, "resposta": "Não encontrado"}
# 4. Registre o endpoint /api/produtos:
#    app.registrar_rota("/api/produtos", lambda: ["Laptop", "Monitor"])
# ============================================================

class AppServer:
    def __init__(self):
        self.rotas = {}

    # PASSO 1: Implemente o método registrar_rota(self, caminho, manipulador):
    

    # PASSO 2: Implemente o método processar(self, caminho):
    

app = AppServer()
# PASSO 3: Registre a rota "/api/produtos" usando app.registrar_rota:

`,
    hints: [
      'AppServer gerencia o mapeamento de rotas e manipuladores.',
      'registrar_rota cadastra novos endpoints.',
      'processar despacha a requisição para a função correspondente.',
    ],
    expectedConditionText: 'class AppServer com registrar_rota e processar',
    previewType: 'terminal',
    previewMeta: {
      componentTitle: 'Servidor RESTful em Produção',
      previewSnippet: 'INFO: Uvicorn running on http://127.0.0.1:8000\nEndpoints ativos: /api/produtos [GET], /api/checkout [POST]',
      successBadge: 'Mestre em Python Web',
    },
    validate: (rawCode) => {
      const hasClass = /class\s+AppServer\b/.test(rawCode);
      const hasRegister = /registrar_rota\b/.test(rawCode);
      const hasProcess = /processar\b/.test(rawCode);
      if (hasClass && hasRegister && hasProcess) {
        return {
          success: true,
          doorState: true,
          message: '🏆 BRILHANTE! Você dominou o desenvolvimento backend em Python e está preparado para criar APIs robustas para qualquer site!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Estruture a classe AppServer com registrar_rota e processar.',
      };
    },
  },
];

export const PYTHON_LEVELS: GameLevel[] = [...PYTHON_BASE_LEVELS, ...PYTHON_EXTRA_LEVELS];
