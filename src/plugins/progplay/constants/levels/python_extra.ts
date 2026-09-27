import { GameLevel } from './types';

export const PYTHON_EXTRA_LEVELS: GameLevel[] = [
  {
    id: 21,
    title: "Fase 21: List Comprehension com Filtro",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma list comprehension para extrair números pares ao quadrado",
    puzzleDescription: "List comprehensions são o modo mais idiomático e performático de transformar listas em Python. Neste desafio prático você irá dominar List Comprehension com Filtro aplicando código profissional.",
    initialCode: `numeros = [1, 2, 3, 4, 5, 6, 7, 8]
# Crie a lista com os pares ao quadrado:
pares_quadrados = [n**2 for n in numeros if n % 2 == 0]`,
    hints: ["A sintaxe é [expressao for item in lista if condicao].","Verifique n % 2 == 0.","Eleve ao quadrado com n**2."],
    expectedConditionText: "[n**2 for n in numeros if n % 2 == 0]",
    previewType: "site-component",
    previewMeta: {"componentTitle":"List Comprehension com Filtro","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">List Comprehension com Filtro</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\[\s*(n|\w+)\*\*2\s+for\s+(n|\w+)\s+in\s+numeros/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: [n**2 for n in numeros if n % 2 == 0]',
      };
    },
  },
  {
    id: 22,
    title: "Fase 22: Dictionary Comprehension",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Gere um dicionário indexado pelo ID de cada usuário",
    puzzleDescription: "Indexação de coleções em tabelas hash para buscas em tempo constante. Neste desafio prático você irá dominar Dictionary Comprehension aplicando código profissional.",
    initialCode: `usuarios = [{"id": 1, "nome": "Ana"}, {"id": 2, "nome": "Beto"}]
# Dicionário com chave id e valor nome:
mapa_usuarios = {u["id"]: u["nome"] for u in usuarios}`,
    hints: ["Use {chave: valor for item in lista}.","u[\"id\"] vira a chave de busca rápida O(1).","u[\"nome\"] vira o valor associado."],
    expectedConditionText: "{u[\"id\"]: u[\"nome\"] for u in usuarios}",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dictionary Comprehension","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dictionary Comprehension</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\{\s*u\[["']id["']\]\s*:\s*u\[["']nome["']\]\s+for\s+u\s+in\s+usuarios\s*\}/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: {u["id"]: u["nome"] for u in usuarios}',
      };
    },
  },
  {
    id: 23,
    title: "Fase 23: Geradores com yield",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função geradora que produz números sob demanda",
    puzzleDescription: "Iteradores eficientes em memória para streaming de dados e pipelines de machine learning. Neste desafio prático você irá dominar Geradores com yield aplicando código profissional.",
    initialCode: `def contador_infinito(limite):
    n = 0
    while n < limite:
        yield n
        n += 1`,
    hints: ["yield pausa a execução e devolve o valor sem descarregar toda a memória.","O próximo item é lido com next() ou loop for.","Economiza gigabytes em arquivos grandes."],
    expectedConditionText: "yield n dentro de um loop",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Geradores com yield","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Geradores com yield</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /yield\s+n/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: yield n dentro de um loop',
      };
    },
  },
  {
    id: 24,
    title: "Fase 24: Context Manager com with",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Gerencie recursos com bloco with para fechamento automático",
    puzzleDescription: "Garante que arquivos abertos, conexões de banco e locks sejam sempre liberados. Neste desafio prático você irá dominar Context Manager com with aplicando código profissional.",
    initialCode: `class Temporizador:
    def __enter__(self):
        print("Iniciando medição")
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Finalizando e liberando recursos")`,
    hints: ["Context managers garantem limpeza de conexões e arquivos.","__enter__ roda ao abrir o with.","__exit__ roda ao sair, mesmo com erro."],
    expectedConditionText: "métodos __enter__ e __exit__",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Context Manager com with","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Context Manager com with</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /def\s+__enter__[\s\S]*def\s+__exit__/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: métodos __enter__ e __exit__',
      };
    },
  },
  {
    id: 25,
    title: "Fase 25: Decorators (@decorador)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie um decorator que registra a execução de uma função",
    puzzleDescription: "Padrão essencial usado no FastAPI, Flask e Django para rotas e autenticação. Neste desafio prático você irá dominar Decorators (@decorador) aplicando código profissional.",
    initialCode: `def log_execucao(funcao):
    def wrapper(*args, **kwargs):
        print(f"Executando {funcao.__name__}")
        return funcao(*args, **kwargs)
    return wrapper

@log_execucao
def processar_pedido():
    return "Pedido Concluído"`,
    hints: ["Decorators alteram ou estendem o comportamento de funções.","wrapper recebe *args e **kwargs.","Retorne o wrapper."],
    expectedConditionText: "@log_execucao decorando a função",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Decorators (@decorador)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Decorators (@decorador)</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@log_execucao/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @log_execucao decorando a função',
      };
    },
  },
  {
    id: 26,
    title: "Fase 26: Collections: Counter",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Conte frequência de elementos rapidamente com Counter",
    puzzleDescription: "Estrutura especializada de alta velocidade para estatística e contagem. Neste desafio prático você irá dominar Collections: Counter aplicando código profissional.",
    initialCode: `from collections import Counter

palavras = ["python", "web", "python", "api", "web", "python"]
# Conte as ocorrências:
frequencia = Counter(palavras)
mais_comum = frequencia.most_common(1)`,
    hints: ["Counter da biblioteca padrão conta itens em O(n).","most_common(1) retorna o item mais frequente.","Ideal para análise de textos e logs."],
    expectedConditionText: "Counter(palavras)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Collections: Counter","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Collections: Counter</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /Counter\s*\(\s*palavras\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: Counter(palavras)',
      };
    },
  },
  {
    id: 27,
    title: "Fase 27: Dataclasses Modernas",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma classe de dados limpa com @dataclass",
    puzzleDescription: "Reduz boilerplate de classes e estrutura dados tipados perfeitamente. Neste desafio prático você irá dominar Dataclasses Modernas aplicando código profissional.",
    initialCode: `from dataclasses import dataclass

@dataclass
class Produto:
    id: int
    nome: str
    preco: float
    estoque: int = 0`,
    hints: ["@dataclass gera automaticamente __init__, __repr__ e __eq__.","Declare os tipos dos atributos.","Adicione valores padrão opcionais."],
    expectedConditionText: "@dataclass class Produto:",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dataclasses Modernas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dataclasses Modernas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@dataclass[\s\S]*class\s+Produto/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @dataclass class Produto:',
      };
    },
  },
  {
    id: 28,
    title: "Fase 28: Asyncio e Corrotinas",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Execute tarefas assíncronas com asyncio.gather",
    puzzleDescription: "Base de alta performance para servidores assíncronos e web scraping. Neste desafio prático você irá dominar Asyncio e Corrotinas aplicando código profissional.",
    initialCode: `import asyncio

async def buscar_preco(ativo):
    await asyncio.sleep(0.1)
    return f"{ativo}: R$ 100"

async def main():
    precos = await asyncio.gather(
        buscar_preco("BTC"),
        buscar_preco("ETH")
    )
    return precos`,
    hints: ["asyncio.gather roda corrotinas em paralelo.","Passe as chamadas de funções assíncronas.","Aguarde o resultado com await."],
    expectedConditionText: "asyncio.gather(buscar_preco(...), ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Asyncio e Corrotinas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Asyncio e Corrotinas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /asyncio\.gather/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: asyncio.gather(buscar_preco(...), ...)',
      };
    },
  },
  {
    id: 29,
    title: "Fase 29: Manipulação Segura de JSON",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Serialize e desserialize objetos com o módulo json",
    puzzleDescription: "Intercâmbio universal de dados entre backends e frontends. Neste desafio prático você irá dominar Manipulação Segura de JSON aplicando código profissional.",
    initialCode: `import json

registro = {"usuario": "dev", "ativo": True, "nivel": 10}
texto_json = json.dumps(registro)
restaurado = json.loads(texto_json)`,
    hints: ["json.dumps converte dict para string.","json.loads converte string para dict.","True vira true e None vira null."],
    expectedConditionText: "json.dumps(registro) e json.loads(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Manipulação Segura de JSON","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Manipulação Segura de JSON</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /json\.dumps[\s\S]*json\.loads/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: json.dumps(registro) e json.loads(...)',
      };
    },
  },
  {
    id: 30,
    title: "Fase 30: Tratamento de Exceções Customizadas",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma exceção personalizada de negócio herdando de Exception",
    puzzleDescription: "Arquitetura limpa para tratamento semântico de erros de domínio. Neste desafio prático você irá dominar Tratamento de Exceções Customizadas aplicando código profissional.",
    initialCode: `class SaldoInsuficienteError(Exception):
    pass

def sacar(saldo, valor):
    if valor > saldo:
        raise SaldoInsuficienteError("Saldo insuficiente para o saque")
    return saldo - valor`,
    hints: ["Crie classes de erro próprias herdando de Exception.","Dispare com raise NomeDoErro(\"mensagem\").","Facilita a captura granular de falhas de negócio."],
    expectedConditionText: "class SaldoInsuficienteError(Exception):",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Tratamento de Exceções Customizadas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Tratamento de Exceções Customizadas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /class\s+SaldoInsuficienteError\s*\(\s*Exception\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: class SaldoInsuficienteError(Exception):',
      };
    },
  },
  {
    id: 31,
    title: "Fase 31: List Comprehension com Filtro (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma list comprehension para extrair números pares ao quadrado com rigor de produção",
    puzzleDescription: "List comprehensions são o modo mais idiomático e performático de transformar listas em Python. Neste desafio prático você irá dominar List Comprehension com Filtro aplicando código profissional.",
    initialCode: `numeros = [1, 2, 3, 4, 5, 6, 7, 8]
# Crie a lista com os pares ao quadrado:
pares_quadrados = [n**2 for n in numeros if n % 2 == 0]`,
    hints: ["A sintaxe é [expressao for item in lista if condicao].","Verifique n % 2 == 0.","Eleve ao quadrado com n**2."],
    expectedConditionText: "[n**2 for n in numeros if n % 2 == 0]",
    previewType: "site-component",
    previewMeta: {"componentTitle":"List Comprehension com Filtro","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">List Comprehension com Filtro</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\[\s*(n|\w+)\*\*2\s+for\s+(n|\w+)\s+in\s+numeros/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: [n**2 for n in numeros if n % 2 == 0]',
      };
    },
  },
  {
    id: 32,
    title: "Fase 32: Dictionary Comprehension (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Gere um dicionário indexado pelo ID de cada usuário com rigor de produção",
    puzzleDescription: "Indexação de coleções em tabelas hash para buscas em tempo constante. Neste desafio prático você irá dominar Dictionary Comprehension aplicando código profissional.",
    initialCode: `usuarios = [{"id": 1, "nome": "Ana"}, {"id": 2, "nome": "Beto"}]
# Dicionário com chave id e valor nome:
mapa_usuarios = {u["id"]: u["nome"] for u in usuarios}`,
    hints: ["Use {chave: valor for item in lista}.","u[\"id\"] vira a chave de busca rápida O(1).","u[\"nome\"] vira o valor associado."],
    expectedConditionText: "{u[\"id\"]: u[\"nome\"] for u in usuarios}",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dictionary Comprehension","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dictionary Comprehension</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\{\s*u\[["']id["']\]\s*:\s*u\[["']nome["']\]\s+for\s+u\s+in\s+usuarios\s*\}/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: {u["id"]: u["nome"] for u in usuarios}',
      };
    },
  },
  {
    id: 33,
    title: "Fase 33: Geradores com yield (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função geradora que produz números sob demanda com rigor de produção",
    puzzleDescription: "Iteradores eficientes em memória para streaming de dados e pipelines de machine learning. Neste desafio prático você irá dominar Geradores com yield aplicando código profissional.",
    initialCode: `def contador_infinito(limite):
    n = 0
    while n < limite:
        yield n
        n += 1`,
    hints: ["yield pausa a execução e devolve o valor sem descarregar toda a memória.","O próximo item é lido com next() ou loop for.","Economiza gigabytes em arquivos grandes."],
    expectedConditionText: "yield n dentro de um loop",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Geradores com yield","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Geradores com yield</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /yield\s+n/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: yield n dentro de um loop',
      };
    },
  },
  {
    id: 34,
    title: "Fase 34: Context Manager com with (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Gerencie recursos com bloco with para fechamento automático com rigor de produção",
    puzzleDescription: "Garante que arquivos abertos, conexões de banco e locks sejam sempre liberados. Neste desafio prático você irá dominar Context Manager com with aplicando código profissional.",
    initialCode: `class Temporizador:
    def __enter__(self):
        print("Iniciando medição")
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Finalizando e liberando recursos")`,
    hints: ["Context managers garantem limpeza de conexões e arquivos.","__enter__ roda ao abrir o with.","__exit__ roda ao sair, mesmo com erro."],
    expectedConditionText: "métodos __enter__ e __exit__",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Context Manager com with","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Context Manager com with</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /def\s+__enter__[\s\S]*def\s+__exit__/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: métodos __enter__ e __exit__',
      };
    },
  },
  {
    id: 35,
    title: "Fase 35: Decorators (@decorador) (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie um decorator que registra a execução de uma função com rigor de produção",
    puzzleDescription: "Padrão essencial usado no FastAPI, Flask e Django para rotas e autenticação. Neste desafio prático você irá dominar Decorators (@decorador) aplicando código profissional.",
    initialCode: `def log_execucao(funcao):
    def wrapper(*args, **kwargs):
        print(f"Executando {funcao.__name__}")
        return funcao(*args, **kwargs)
    return wrapper

@log_execucao
def processar_pedido():
    return "Pedido Concluído"`,
    hints: ["Decorators alteram ou estendem o comportamento de funções.","wrapper recebe *args e **kwargs.","Retorne o wrapper."],
    expectedConditionText: "@log_execucao decorando a função",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Decorators (@decorador)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Decorators (@decorador)</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@log_execucao/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @log_execucao decorando a função',
      };
    },
  },
  {
    id: 36,
    title: "Fase 36: Collections: Counter (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Conte frequência de elementos rapidamente com Counter com rigor de produção",
    puzzleDescription: "Estrutura especializada de alta velocidade para estatística e contagem. Neste desafio prático você irá dominar Collections: Counter aplicando código profissional.",
    initialCode: `from collections import Counter

palavras = ["python", "web", "python", "api", "web", "python"]
# Conte as ocorrências:
frequencia = Counter(palavras)
mais_comum = frequencia.most_common(1)`,
    hints: ["Counter da biblioteca padrão conta itens em O(n).","most_common(1) retorna o item mais frequente.","Ideal para análise de textos e logs."],
    expectedConditionText: "Counter(palavras)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Collections: Counter","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Collections: Counter</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /Counter\s*\(\s*palavras\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: Counter(palavras)',
      };
    },
  },
  {
    id: 37,
    title: "Fase 37: Dataclasses Modernas (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma classe de dados limpa com @dataclass com rigor de produção",
    puzzleDescription: "Reduz boilerplate de classes e estrutura dados tipados perfeitamente. Neste desafio prático você irá dominar Dataclasses Modernas aplicando código profissional.",
    initialCode: `from dataclasses import dataclass

@dataclass
class Produto:
    id: int
    nome: str
    preco: float
    estoque: int = 0`,
    hints: ["@dataclass gera automaticamente __init__, __repr__ e __eq__.","Declare os tipos dos atributos.","Adicione valores padrão opcionais."],
    expectedConditionText: "@dataclass class Produto:",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dataclasses Modernas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dataclasses Modernas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@dataclass[\s\S]*class\s+Produto/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @dataclass class Produto:',
      };
    },
  },
  {
    id: 38,
    title: "Fase 38: Asyncio e Corrotinas (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Execute tarefas assíncronas com asyncio.gather com rigor de produção",
    puzzleDescription: "Base de alta performance para servidores assíncronos e web scraping. Neste desafio prático você irá dominar Asyncio e Corrotinas aplicando código profissional.",
    initialCode: `import asyncio

async def buscar_preco(ativo):
    await asyncio.sleep(0.1)
    return f"{ativo}: R$ 100"

async def main():
    precos = await asyncio.gather(
        buscar_preco("BTC"),
        buscar_preco("ETH")
    )
    return precos`,
    hints: ["asyncio.gather roda corrotinas em paralelo.","Passe as chamadas de funções assíncronas.","Aguarde o resultado com await."],
    expectedConditionText: "asyncio.gather(buscar_preco(...), ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Asyncio e Corrotinas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Asyncio e Corrotinas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /asyncio\.gather/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: asyncio.gather(buscar_preco(...), ...)',
      };
    },
  },
  {
    id: 39,
    title: "Fase 39: Manipulação Segura de JSON (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Serialize e desserialize objetos com o módulo json com rigor de produção",
    puzzleDescription: "Intercâmbio universal de dados entre backends e frontends. Neste desafio prático você irá dominar Manipulação Segura de JSON aplicando código profissional.",
    initialCode: `import json

registro = {"usuario": "dev", "ativo": True, "nivel": 10}
texto_json = json.dumps(registro)
restaurado = json.loads(texto_json)`,
    hints: ["json.dumps converte dict para string.","json.loads converte string para dict.","True vira true e None vira null."],
    expectedConditionText: "json.dumps(registro) e json.loads(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Manipulação Segura de JSON","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Manipulação Segura de JSON</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /json\.dumps[\s\S]*json\.loads/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: json.dumps(registro) e json.loads(...)',
      };
    },
  },
  {
    id: 40,
    title: "Fase 40: Tratamento de Exceções Customizadas (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma exceção personalizada de negócio herdando de Exception com rigor de produção",
    puzzleDescription: "Arquitetura limpa para tratamento semântico de erros de domínio. Neste desafio prático você irá dominar Tratamento de Exceções Customizadas aplicando código profissional.",
    initialCode: `class SaldoInsuficienteError(Exception):
    pass

def sacar(saldo, valor):
    if valor > saldo:
        raise SaldoInsuficienteError("Saldo insuficiente para o saque")
    return saldo - valor`,
    hints: ["Crie classes de erro próprias herdando de Exception.","Dispare com raise NomeDoErro(\"mensagem\").","Facilita a captura granular de falhas de negócio."],
    expectedConditionText: "class SaldoInsuficienteError(Exception):",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Tratamento de Exceções Customizadas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Tratamento de Exceções Customizadas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /class\s+SaldoInsuficienteError\s*\(\s*Exception\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: class SaldoInsuficienteError(Exception):',
      };
    },
  },
  {
    id: 41,
    title: "Fase 41: List Comprehension com Filtro (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma list comprehension para extrair números pares ao quadrado com rigor de produção",
    puzzleDescription: "List comprehensions são o modo mais idiomático e performático de transformar listas em Python. Neste desafio prático você irá dominar List Comprehension com Filtro aplicando código profissional.",
    initialCode: `numeros = [1, 2, 3, 4, 5, 6, 7, 8]
# Crie a lista com os pares ao quadrado:
pares_quadrados = [n**2 for n in numeros if n % 2 == 0]`,
    hints: ["A sintaxe é [expressao for item in lista if condicao].","Verifique n % 2 == 0.","Eleve ao quadrado com n**2."],
    expectedConditionText: "[n**2 for n in numeros if n % 2 == 0]",
    previewType: "site-component",
    previewMeta: {"componentTitle":"List Comprehension com Filtro","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">List Comprehension com Filtro</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\[\s*(n|\w+)\*\*2\s+for\s+(n|\w+)\s+in\s+numeros/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: [n**2 for n in numeros if n % 2 == 0]',
      };
    },
  },
  {
    id: 42,
    title: "Fase 42: Dictionary Comprehension (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Gere um dicionário indexado pelo ID de cada usuário com rigor de produção",
    puzzleDescription: "Indexação de coleções em tabelas hash para buscas em tempo constante. Neste desafio prático você irá dominar Dictionary Comprehension aplicando código profissional.",
    initialCode: `usuarios = [{"id": 1, "nome": "Ana"}, {"id": 2, "nome": "Beto"}]
# Dicionário com chave id e valor nome:
mapa_usuarios = {u["id"]: u["nome"] for u in usuarios}`,
    hints: ["Use {chave: valor for item in lista}.","u[\"id\"] vira a chave de busca rápida O(1).","u[\"nome\"] vira o valor associado."],
    expectedConditionText: "{u[\"id\"]: u[\"nome\"] for u in usuarios}",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dictionary Comprehension","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dictionary Comprehension</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\{\s*u\[["']id["']\]\s*:\s*u\[["']nome["']\]\s+for\s+u\s+in\s+usuarios\s*\}/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: {u["id"]: u["nome"] for u in usuarios}',
      };
    },
  },
  {
    id: 43,
    title: "Fase 43: Geradores com yield (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função geradora que produz números sob demanda com rigor de produção",
    puzzleDescription: "Iteradores eficientes em memória para streaming de dados e pipelines de machine learning. Neste desafio prático você irá dominar Geradores com yield aplicando código profissional.",
    initialCode: `def contador_infinito(limite):
    n = 0
    while n < limite:
        yield n
        n += 1`,
    hints: ["yield pausa a execução e devolve o valor sem descarregar toda a memória.","O próximo item é lido com next() ou loop for.","Economiza gigabytes em arquivos grandes."],
    expectedConditionText: "yield n dentro de um loop",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Geradores com yield","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Geradores com yield</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /yield\s+n/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: yield n dentro de um loop',
      };
    },
  },
  {
    id: 44,
    title: "Fase 44: Context Manager com with (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Gerencie recursos com bloco with para fechamento automático com rigor de produção",
    puzzleDescription: "Garante que arquivos abertos, conexões de banco e locks sejam sempre liberados. Neste desafio prático você irá dominar Context Manager com with aplicando código profissional.",
    initialCode: `class Temporizador:
    def __enter__(self):
        print("Iniciando medição")
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Finalizando e liberando recursos")`,
    hints: ["Context managers garantem limpeza de conexões e arquivos.","__enter__ roda ao abrir o with.","__exit__ roda ao sair, mesmo com erro."],
    expectedConditionText: "métodos __enter__ e __exit__",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Context Manager com with","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Context Manager com with</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /def\s+__enter__[\s\S]*def\s+__exit__/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: métodos __enter__ e __exit__',
      };
    },
  },
  {
    id: 45,
    title: "Fase 45: Decorators (@decorador) (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie um decorator que registra a execução de uma função com rigor de produção",
    puzzleDescription: "Padrão essencial usado no FastAPI, Flask e Django para rotas e autenticação. Neste desafio prático você irá dominar Decorators (@decorador) aplicando código profissional.",
    initialCode: `def log_execucao(funcao):
    def wrapper(*args, **kwargs):
        print(f"Executando {funcao.__name__}")
        return funcao(*args, **kwargs)
    return wrapper

@log_execucao
def processar_pedido():
    return "Pedido Concluído"`,
    hints: ["Decorators alteram ou estendem o comportamento de funções.","wrapper recebe *args e **kwargs.","Retorne o wrapper."],
    expectedConditionText: "@log_execucao decorando a função",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Decorators (@decorador)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Decorators (@decorador)</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@log_execucao/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @log_execucao decorando a função',
      };
    },
  },
  {
    id: 46,
    title: "Fase 46: Collections: Counter (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Conte frequência de elementos rapidamente com Counter com rigor de produção",
    puzzleDescription: "Estrutura especializada de alta velocidade para estatística e contagem. Neste desafio prático você irá dominar Collections: Counter aplicando código profissional.",
    initialCode: `from collections import Counter

palavras = ["python", "web", "python", "api", "web", "python"]
# Conte as ocorrências:
frequencia = Counter(palavras)
mais_comum = frequencia.most_common(1)`,
    hints: ["Counter da biblioteca padrão conta itens em O(n).","most_common(1) retorna o item mais frequente.","Ideal para análise de textos e logs."],
    expectedConditionText: "Counter(palavras)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Collections: Counter","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Collections: Counter</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /Counter\s*\(\s*palavras\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: Counter(palavras)',
      };
    },
  },
  {
    id: 47,
    title: "Fase 47: Dataclasses Modernas (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma classe de dados limpa com @dataclass com rigor de produção",
    puzzleDescription: "Reduz boilerplate de classes e estrutura dados tipados perfeitamente. Neste desafio prático você irá dominar Dataclasses Modernas aplicando código profissional.",
    initialCode: `from dataclasses import dataclass

@dataclass
class Produto:
    id: int
    nome: str
    preco: float
    estoque: int = 0`,
    hints: ["@dataclass gera automaticamente __init__, __repr__ e __eq__.","Declare os tipos dos atributos.","Adicione valores padrão opcionais."],
    expectedConditionText: "@dataclass class Produto:",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dataclasses Modernas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dataclasses Modernas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@dataclass[\s\S]*class\s+Produto/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @dataclass class Produto:',
      };
    },
  },
  {
    id: 48,
    title: "Fase 48: Asyncio e Corrotinas (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Execute tarefas assíncronas com asyncio.gather com rigor de produção",
    puzzleDescription: "Base de alta performance para servidores assíncronos e web scraping. Neste desafio prático você irá dominar Asyncio e Corrotinas aplicando código profissional.",
    initialCode: `import asyncio

async def buscar_preco(ativo):
    await asyncio.sleep(0.1)
    return f"{ativo}: R$ 100"

async def main():
    precos = await asyncio.gather(
        buscar_preco("BTC"),
        buscar_preco("ETH")
    )
    return precos`,
    hints: ["asyncio.gather roda corrotinas em paralelo.","Passe as chamadas de funções assíncronas.","Aguarde o resultado com await."],
    expectedConditionText: "asyncio.gather(buscar_preco(...), ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Asyncio e Corrotinas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Asyncio e Corrotinas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /asyncio\.gather/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: asyncio.gather(buscar_preco(...), ...)',
      };
    },
  },
  {
    id: 49,
    title: "Fase 49: Manipulação Segura de JSON (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Serialize e desserialize objetos com o módulo json com rigor de produção",
    puzzleDescription: "Intercâmbio universal de dados entre backends e frontends. Neste desafio prático você irá dominar Manipulação Segura de JSON aplicando código profissional.",
    initialCode: `import json

registro = {"usuario": "dev", "ativo": True, "nivel": 10}
texto_json = json.dumps(registro)
restaurado = json.loads(texto_json)`,
    hints: ["json.dumps converte dict para string.","json.loads converte string para dict.","True vira true e None vira null."],
    expectedConditionText: "json.dumps(registro) e json.loads(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Manipulação Segura de JSON","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Manipulação Segura de JSON</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /json\.dumps[\s\S]*json\.loads/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: json.dumps(registro) e json.loads(...)',
      };
    },
  },
  {
    id: 50,
    title: "Fase 50: Tratamento de Exceções Customizadas (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma exceção personalizada de negócio herdando de Exception com rigor de produção",
    puzzleDescription: "Arquitetura limpa para tratamento semântico de erros de domínio. Neste desafio prático você irá dominar Tratamento de Exceções Customizadas aplicando código profissional.",
    initialCode: `class SaldoInsuficienteError(Exception):
    pass

def sacar(saldo, valor):
    if valor > saldo:
        raise SaldoInsuficienteError("Saldo insuficiente para o saque")
    return saldo - valor`,
    hints: ["Crie classes de erro próprias herdando de Exception.","Dispare com raise NomeDoErro(\"mensagem\").","Facilita a captura granular de falhas de negócio."],
    expectedConditionText: "class SaldoInsuficienteError(Exception):",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Tratamento de Exceções Customizadas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Tratamento de Exceções Customizadas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /class\s+SaldoInsuficienteError\s*\(\s*Exception\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: class SaldoInsuficienteError(Exception):',
      };
    },
  },
  {
    id: 51,
    title: "Fase 51: List Comprehension com Filtro (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma list comprehension para extrair números pares ao quadrado com rigor de produção",
    puzzleDescription: "List comprehensions são o modo mais idiomático e performático de transformar listas em Python. Neste desafio prático você irá dominar List Comprehension com Filtro aplicando código profissional.",
    initialCode: `numeros = [1, 2, 3, 4, 5, 6, 7, 8]
# Crie a lista com os pares ao quadrado:
pares_quadrados = [n**2 for n in numeros if n % 2 == 0]`,
    hints: ["A sintaxe é [expressao for item in lista if condicao].","Verifique n % 2 == 0.","Eleve ao quadrado com n**2."],
    expectedConditionText: "[n**2 for n in numeros if n % 2 == 0]",
    previewType: "site-component",
    previewMeta: {"componentTitle":"List Comprehension com Filtro","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">List Comprehension com Filtro</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\[\s*(n|\w+)\*\*2\s+for\s+(n|\w+)\s+in\s+numeros/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: [n**2 for n in numeros if n % 2 == 0]',
      };
    },
  },
  {
    id: 52,
    title: "Fase 52: Dictionary Comprehension (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Gere um dicionário indexado pelo ID de cada usuário com rigor de produção",
    puzzleDescription: "Indexação de coleções em tabelas hash para buscas em tempo constante. Neste desafio prático você irá dominar Dictionary Comprehension aplicando código profissional.",
    initialCode: `usuarios = [{"id": 1, "nome": "Ana"}, {"id": 2, "nome": "Beto"}]
# Dicionário com chave id e valor nome:
mapa_usuarios = {u["id"]: u["nome"] for u in usuarios}`,
    hints: ["Use {chave: valor for item in lista}.","u[\"id\"] vira a chave de busca rápida O(1).","u[\"nome\"] vira o valor associado."],
    expectedConditionText: "{u[\"id\"]: u[\"nome\"] for u in usuarios}",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dictionary Comprehension","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dictionary Comprehension</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\{\s*u\[["']id["']\]\s*:\s*u\[["']nome["']\]\s+for\s+u\s+in\s+usuarios\s*\}/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: {u["id"]: u["nome"] for u in usuarios}',
      };
    },
  },
  {
    id: 53,
    title: "Fase 53: Geradores com yield (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função geradora que produz números sob demanda com rigor de produção",
    puzzleDescription: "Iteradores eficientes em memória para streaming de dados e pipelines de machine learning. Neste desafio prático você irá dominar Geradores com yield aplicando código profissional.",
    initialCode: `def contador_infinito(limite):
    n = 0
    while n < limite:
        yield n
        n += 1`,
    hints: ["yield pausa a execução e devolve o valor sem descarregar toda a memória.","O próximo item é lido com next() ou loop for.","Economiza gigabytes em arquivos grandes."],
    expectedConditionText: "yield n dentro de um loop",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Geradores com yield","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Geradores com yield</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /yield\s+n/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: yield n dentro de um loop',
      };
    },
  },
  {
    id: 54,
    title: "Fase 54: Context Manager com with (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Gerencie recursos com bloco with para fechamento automático com rigor de produção",
    puzzleDescription: "Garante que arquivos abertos, conexões de banco e locks sejam sempre liberados. Neste desafio prático você irá dominar Context Manager com with aplicando código profissional.",
    initialCode: `class Temporizador:
    def __enter__(self):
        print("Iniciando medição")
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Finalizando e liberando recursos")`,
    hints: ["Context managers garantem limpeza de conexões e arquivos.","__enter__ roda ao abrir o with.","__exit__ roda ao sair, mesmo com erro."],
    expectedConditionText: "métodos __enter__ e __exit__",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Context Manager com with","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Context Manager com with</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /def\s+__enter__[\s\S]*def\s+__exit__/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: métodos __enter__ e __exit__',
      };
    },
  },
  {
    id: 55,
    title: "Fase 55: Decorators (@decorador) (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie um decorator que registra a execução de uma função com rigor de produção",
    puzzleDescription: "Padrão essencial usado no FastAPI, Flask e Django para rotas e autenticação. Neste desafio prático você irá dominar Decorators (@decorador) aplicando código profissional.",
    initialCode: `def log_execucao(funcao):
    def wrapper(*args, **kwargs):
        print(f"Executando {funcao.__name__}")
        return funcao(*args, **kwargs)
    return wrapper

@log_execucao
def processar_pedido():
    return "Pedido Concluído"`,
    hints: ["Decorators alteram ou estendem o comportamento de funções.","wrapper recebe *args e **kwargs.","Retorne o wrapper."],
    expectedConditionText: "@log_execucao decorando a função",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Decorators (@decorador)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Decorators (@decorador)</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@log_execucao/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @log_execucao decorando a função',
      };
    },
  },
  {
    id: 56,
    title: "Fase 56: Collections: Counter (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Conte frequência de elementos rapidamente com Counter com rigor de produção",
    puzzleDescription: "Estrutura especializada de alta velocidade para estatística e contagem. Neste desafio prático você irá dominar Collections: Counter aplicando código profissional.",
    initialCode: `from collections import Counter

palavras = ["python", "web", "python", "api", "web", "python"]
# Conte as ocorrências:
frequencia = Counter(palavras)
mais_comum = frequencia.most_common(1)`,
    hints: ["Counter da biblioteca padrão conta itens em O(n).","most_common(1) retorna o item mais frequente.","Ideal para análise de textos e logs."],
    expectedConditionText: "Counter(palavras)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Collections: Counter","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Collections: Counter</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /Counter\s*\(\s*palavras\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: Counter(palavras)',
      };
    },
  },
  {
    id: 57,
    title: "Fase 57: Dataclasses Modernas (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma classe de dados limpa com @dataclass com rigor de produção",
    puzzleDescription: "Reduz boilerplate de classes e estrutura dados tipados perfeitamente. Neste desafio prático você irá dominar Dataclasses Modernas aplicando código profissional.",
    initialCode: `from dataclasses import dataclass

@dataclass
class Produto:
    id: int
    nome: str
    preco: float
    estoque: int = 0`,
    hints: ["@dataclass gera automaticamente __init__, __repr__ e __eq__.","Declare os tipos dos atributos.","Adicione valores padrão opcionais."],
    expectedConditionText: "@dataclass class Produto:",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dataclasses Modernas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dataclasses Modernas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@dataclass[\s\S]*class\s+Produto/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @dataclass class Produto:',
      };
    },
  },
  {
    id: 58,
    title: "Fase 58: Asyncio e Corrotinas (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Execute tarefas assíncronas com asyncio.gather com rigor de produção",
    puzzleDescription: "Base de alta performance para servidores assíncronos e web scraping. Neste desafio prático você irá dominar Asyncio e Corrotinas aplicando código profissional.",
    initialCode: `import asyncio

async def buscar_preco(ativo):
    await asyncio.sleep(0.1)
    return f"{ativo}: R$ 100"

async def main():
    precos = await asyncio.gather(
        buscar_preco("BTC"),
        buscar_preco("ETH")
    )
    return precos`,
    hints: ["asyncio.gather roda corrotinas em paralelo.","Passe as chamadas de funções assíncronas.","Aguarde o resultado com await."],
    expectedConditionText: "asyncio.gather(buscar_preco(...), ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Asyncio e Corrotinas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Asyncio e Corrotinas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /asyncio\.gather/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: asyncio.gather(buscar_preco(...), ...)',
      };
    },
  },
  {
    id: 59,
    title: "Fase 59: Manipulação Segura de JSON (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Serialize e desserialize objetos com o módulo json com rigor de produção",
    puzzleDescription: "Intercâmbio universal de dados entre backends e frontends. Neste desafio prático você irá dominar Manipulação Segura de JSON aplicando código profissional.",
    initialCode: `import json

registro = {"usuario": "dev", "ativo": True, "nivel": 10}
texto_json = json.dumps(registro)
restaurado = json.loads(texto_json)`,
    hints: ["json.dumps converte dict para string.","json.loads converte string para dict.","True vira true e None vira null."],
    expectedConditionText: "json.dumps(registro) e json.loads(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Manipulação Segura de JSON","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Manipulação Segura de JSON</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /json\.dumps[\s\S]*json\.loads/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: json.dumps(registro) e json.loads(...)',
      };
    },
  },
  {
    id: 60,
    title: "Fase 60: Tratamento de Exceções Customizadas (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma exceção personalizada de negócio herdando de Exception com rigor de produção",
    puzzleDescription: "Arquitetura limpa para tratamento semântico de erros de domínio. Neste desafio prático você irá dominar Tratamento de Exceções Customizadas aplicando código profissional.",
    initialCode: `class SaldoInsuficienteError(Exception):
    pass

def sacar(saldo, valor):
    if valor > saldo:
        raise SaldoInsuficienteError("Saldo insuficiente para o saque")
    return saldo - valor`,
    hints: ["Crie classes de erro próprias herdando de Exception.","Dispare com raise NomeDoErro(\"mensagem\").","Facilita a captura granular de falhas de negócio."],
    expectedConditionText: "class SaldoInsuficienteError(Exception):",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Tratamento de Exceções Customizadas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Tratamento de Exceções Customizadas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /class\s+SaldoInsuficienteError\s*\(\s*Exception\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: class SaldoInsuficienteError(Exception):',
      };
    },
  },
  {
    id: 61,
    title: "Fase 61: List Comprehension com Filtro (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma list comprehension para extrair números pares ao quadrado com rigor de produção",
    puzzleDescription: "List comprehensions são o modo mais idiomático e performático de transformar listas em Python. Neste desafio prático você irá dominar List Comprehension com Filtro aplicando código profissional.",
    initialCode: `numeros = [1, 2, 3, 4, 5, 6, 7, 8]
# Crie a lista com os pares ao quadrado:
pares_quadrados = [n**2 for n in numeros if n % 2 == 0]`,
    hints: ["A sintaxe é [expressao for item in lista if condicao].","Verifique n % 2 == 0.","Eleve ao quadrado com n**2."],
    expectedConditionText: "[n**2 for n in numeros if n % 2 == 0]",
    previewType: "site-component",
    previewMeta: {"componentTitle":"List Comprehension com Filtro","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">List Comprehension com Filtro</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\[\s*(n|\w+)\*\*2\s+for\s+(n|\w+)\s+in\s+numeros/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: [n**2 for n in numeros if n % 2 == 0]',
      };
    },
  },
  {
    id: 62,
    title: "Fase 62: Dictionary Comprehension (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Gere um dicionário indexado pelo ID de cada usuário com rigor de produção",
    puzzleDescription: "Indexação de coleções em tabelas hash para buscas em tempo constante. Neste desafio prático você irá dominar Dictionary Comprehension aplicando código profissional.",
    initialCode: `usuarios = [{"id": 1, "nome": "Ana"}, {"id": 2, "nome": "Beto"}]
# Dicionário com chave id e valor nome:
mapa_usuarios = {u["id"]: u["nome"] for u in usuarios}`,
    hints: ["Use {chave: valor for item in lista}.","u[\"id\"] vira a chave de busca rápida O(1).","u[\"nome\"] vira o valor associado."],
    expectedConditionText: "{u[\"id\"]: u[\"nome\"] for u in usuarios}",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dictionary Comprehension","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dictionary Comprehension</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\{\s*u\[["']id["']\]\s*:\s*u\[["']nome["']\]\s+for\s+u\s+in\s+usuarios\s*\}/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: {u["id"]: u["nome"] for u in usuarios}',
      };
    },
  },
  {
    id: 63,
    title: "Fase 63: Geradores com yield (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função geradora que produz números sob demanda com rigor de produção",
    puzzleDescription: "Iteradores eficientes em memória para streaming de dados e pipelines de machine learning. Neste desafio prático você irá dominar Geradores com yield aplicando código profissional.",
    initialCode: `def contador_infinito(limite):
    n = 0
    while n < limite:
        yield n
        n += 1`,
    hints: ["yield pausa a execução e devolve o valor sem descarregar toda a memória.","O próximo item é lido com next() ou loop for.","Economiza gigabytes em arquivos grandes."],
    expectedConditionText: "yield n dentro de um loop",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Geradores com yield","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Geradores com yield</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /yield\s+n/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: yield n dentro de um loop',
      };
    },
  },
  {
    id: 64,
    title: "Fase 64: Context Manager com with (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Gerencie recursos com bloco with para fechamento automático com rigor de produção",
    puzzleDescription: "Garante que arquivos abertos, conexões de banco e locks sejam sempre liberados. Neste desafio prático você irá dominar Context Manager com with aplicando código profissional.",
    initialCode: `class Temporizador:
    def __enter__(self):
        print("Iniciando medição")
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Finalizando e liberando recursos")`,
    hints: ["Context managers garantem limpeza de conexões e arquivos.","__enter__ roda ao abrir o with.","__exit__ roda ao sair, mesmo com erro."],
    expectedConditionText: "métodos __enter__ e __exit__",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Context Manager com with","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Context Manager com with</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /def\s+__enter__[\s\S]*def\s+__exit__/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: métodos __enter__ e __exit__',
      };
    },
  },
  {
    id: 65,
    title: "Fase 65: Decorators (@decorador) (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie um decorator que registra a execução de uma função com rigor de produção",
    puzzleDescription: "Padrão essencial usado no FastAPI, Flask e Django para rotas e autenticação. Neste desafio prático você irá dominar Decorators (@decorador) aplicando código profissional.",
    initialCode: `def log_execucao(funcao):
    def wrapper(*args, **kwargs):
        print(f"Executando {funcao.__name__}")
        return funcao(*args, **kwargs)
    return wrapper

@log_execucao
def processar_pedido():
    return "Pedido Concluído"`,
    hints: ["Decorators alteram ou estendem o comportamento de funções.","wrapper recebe *args e **kwargs.","Retorne o wrapper."],
    expectedConditionText: "@log_execucao decorando a função",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Decorators (@decorador)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Decorators (@decorador)</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@log_execucao/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @log_execucao decorando a função',
      };
    },
  },
  {
    id: 66,
    title: "Fase 66: Collections: Counter (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Conte frequência de elementos rapidamente com Counter com rigor de produção",
    puzzleDescription: "Estrutura especializada de alta velocidade para estatística e contagem. Neste desafio prático você irá dominar Collections: Counter aplicando código profissional.",
    initialCode: `from collections import Counter

palavras = ["python", "web", "python", "api", "web", "python"]
# Conte as ocorrências:
frequencia = Counter(palavras)
mais_comum = frequencia.most_common(1)`,
    hints: ["Counter da biblioteca padrão conta itens em O(n).","most_common(1) retorna o item mais frequente.","Ideal para análise de textos e logs."],
    expectedConditionText: "Counter(palavras)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Collections: Counter","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Collections: Counter</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /Counter\s*\(\s*palavras\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: Counter(palavras)',
      };
    },
  },
  {
    id: 67,
    title: "Fase 67: Dataclasses Modernas (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma classe de dados limpa com @dataclass com rigor de produção",
    puzzleDescription: "Reduz boilerplate de classes e estrutura dados tipados perfeitamente. Neste desafio prático você irá dominar Dataclasses Modernas aplicando código profissional.",
    initialCode: `from dataclasses import dataclass

@dataclass
class Produto:
    id: int
    nome: str
    preco: float
    estoque: int = 0`,
    hints: ["@dataclass gera automaticamente __init__, __repr__ e __eq__.","Declare os tipos dos atributos.","Adicione valores padrão opcionais."],
    expectedConditionText: "@dataclass class Produto:",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dataclasses Modernas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dataclasses Modernas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@dataclass[\s\S]*class\s+Produto/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @dataclass class Produto:',
      };
    },
  },
  {
    id: 68,
    title: "Fase 68: Asyncio e Corrotinas (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Execute tarefas assíncronas com asyncio.gather com rigor de produção",
    puzzleDescription: "Base de alta performance para servidores assíncronos e web scraping. Neste desafio prático você irá dominar Asyncio e Corrotinas aplicando código profissional.",
    initialCode: `import asyncio

async def buscar_preco(ativo):
    await asyncio.sleep(0.1)
    return f"{ativo}: R$ 100"

async def main():
    precos = await asyncio.gather(
        buscar_preco("BTC"),
        buscar_preco("ETH")
    )
    return precos`,
    hints: ["asyncio.gather roda corrotinas em paralelo.","Passe as chamadas de funções assíncronas.","Aguarde o resultado com await."],
    expectedConditionText: "asyncio.gather(buscar_preco(...), ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Asyncio e Corrotinas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Asyncio e Corrotinas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /asyncio\.gather/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: asyncio.gather(buscar_preco(...), ...)',
      };
    },
  },
  {
    id: 69,
    title: "Fase 69: Manipulação Segura de JSON (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Serialize e desserialize objetos com o módulo json com rigor de produção",
    puzzleDescription: "Intercâmbio universal de dados entre backends e frontends. Neste desafio prático você irá dominar Manipulação Segura de JSON aplicando código profissional.",
    initialCode: `import json

registro = {"usuario": "dev", "ativo": True, "nivel": 10}
texto_json = json.dumps(registro)
restaurado = json.loads(texto_json)`,
    hints: ["json.dumps converte dict para string.","json.loads converte string para dict.","True vira true e None vira null."],
    expectedConditionText: "json.dumps(registro) e json.loads(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Manipulação Segura de JSON","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Manipulação Segura de JSON</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /json\.dumps[\s\S]*json\.loads/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: json.dumps(registro) e json.loads(...)',
      };
    },
  },
  {
    id: 70,
    title: "Fase 70: Tratamento de Exceções Customizadas (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma exceção personalizada de negócio herdando de Exception com rigor de produção",
    puzzleDescription: "Arquitetura limpa para tratamento semântico de erros de domínio. Neste desafio prático você irá dominar Tratamento de Exceções Customizadas aplicando código profissional.",
    initialCode: `class SaldoInsuficienteError(Exception):
    pass

def sacar(saldo, valor):
    if valor > saldo:
        raise SaldoInsuficienteError("Saldo insuficiente para o saque")
    return saldo - valor`,
    hints: ["Crie classes de erro próprias herdando de Exception.","Dispare com raise NomeDoErro(\"mensagem\").","Facilita a captura granular de falhas de negócio."],
    expectedConditionText: "class SaldoInsuficienteError(Exception):",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Tratamento de Exceções Customizadas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Tratamento de Exceções Customizadas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /class\s+SaldoInsuficienteError\s*\(\s*Exception\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: class SaldoInsuficienteError(Exception):',
      };
    },
  },
  {
    id: 71,
    title: "Fase 71: List Comprehension com Filtro (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma list comprehension para extrair números pares ao quadrado com rigor de produção",
    puzzleDescription: "List comprehensions são o modo mais idiomático e performático de transformar listas em Python. Neste desafio prático você irá dominar List Comprehension com Filtro aplicando código profissional.",
    initialCode: `numeros = [1, 2, 3, 4, 5, 6, 7, 8]
# Crie a lista com os pares ao quadrado:
pares_quadrados = [n**2 for n in numeros if n % 2 == 0]`,
    hints: ["A sintaxe é [expressao for item in lista if condicao].","Verifique n % 2 == 0.","Eleve ao quadrado com n**2."],
    expectedConditionText: "[n**2 for n in numeros if n % 2 == 0]",
    previewType: "site-component",
    previewMeta: {"componentTitle":"List Comprehension com Filtro","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">List Comprehension com Filtro</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\[\s*(n|\w+)\*\*2\s+for\s+(n|\w+)\s+in\s+numeros/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: [n**2 for n in numeros if n % 2 == 0]',
      };
    },
  },
  {
    id: 72,
    title: "Fase 72: Dictionary Comprehension (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Gere um dicionário indexado pelo ID de cada usuário com rigor de produção",
    puzzleDescription: "Indexação de coleções em tabelas hash para buscas em tempo constante. Neste desafio prático você irá dominar Dictionary Comprehension aplicando código profissional.",
    initialCode: `usuarios = [{"id": 1, "nome": "Ana"}, {"id": 2, "nome": "Beto"}]
# Dicionário com chave id e valor nome:
mapa_usuarios = {u["id"]: u["nome"] for u in usuarios}`,
    hints: ["Use {chave: valor for item in lista}.","u[\"id\"] vira a chave de busca rápida O(1).","u[\"nome\"] vira o valor associado."],
    expectedConditionText: "{u[\"id\"]: u[\"nome\"] for u in usuarios}",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dictionary Comprehension","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dictionary Comprehension</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\{\s*u\[["']id["']\]\s*:\s*u\[["']nome["']\]\s+for\s+u\s+in\s+usuarios\s*\}/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: {u["id"]: u["nome"] for u in usuarios}',
      };
    },
  },
  {
    id: 73,
    title: "Fase 73: Geradores com yield (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função geradora que produz números sob demanda com rigor de produção",
    puzzleDescription: "Iteradores eficientes em memória para streaming de dados e pipelines de machine learning. Neste desafio prático você irá dominar Geradores com yield aplicando código profissional.",
    initialCode: `def contador_infinito(limite):
    n = 0
    while n < limite:
        yield n
        n += 1`,
    hints: ["yield pausa a execução e devolve o valor sem descarregar toda a memória.","O próximo item é lido com next() ou loop for.","Economiza gigabytes em arquivos grandes."],
    expectedConditionText: "yield n dentro de um loop",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Geradores com yield","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Geradores com yield</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /yield\s+n/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: yield n dentro de um loop',
      };
    },
  },
  {
    id: 74,
    title: "Fase 74: Context Manager com with (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Gerencie recursos com bloco with para fechamento automático com rigor de produção",
    puzzleDescription: "Garante que arquivos abertos, conexões de banco e locks sejam sempre liberados. Neste desafio prático você irá dominar Context Manager com with aplicando código profissional.",
    initialCode: `class Temporizador:
    def __enter__(self):
        print("Iniciando medição")
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Finalizando e liberando recursos")`,
    hints: ["Context managers garantem limpeza de conexões e arquivos.","__enter__ roda ao abrir o with.","__exit__ roda ao sair, mesmo com erro."],
    expectedConditionText: "métodos __enter__ e __exit__",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Context Manager com with","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Context Manager com with</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /def\s+__enter__[\s\S]*def\s+__exit__/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: métodos __enter__ e __exit__',
      };
    },
  },
  {
    id: 75,
    title: "Fase 75: Decorators (@decorador) (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie um decorator que registra a execução de uma função com rigor de produção",
    puzzleDescription: "Padrão essencial usado no FastAPI, Flask e Django para rotas e autenticação. Neste desafio prático você irá dominar Decorators (@decorador) aplicando código profissional.",
    initialCode: `def log_execucao(funcao):
    def wrapper(*args, **kwargs):
        print(f"Executando {funcao.__name__}")
        return funcao(*args, **kwargs)
    return wrapper

@log_execucao
def processar_pedido():
    return "Pedido Concluído"`,
    hints: ["Decorators alteram ou estendem o comportamento de funções.","wrapper recebe *args e **kwargs.","Retorne o wrapper."],
    expectedConditionText: "@log_execucao decorando a função",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Decorators (@decorador)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Decorators (@decorador)</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@log_execucao/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @log_execucao decorando a função',
      };
    },
  },
  {
    id: 76,
    title: "Fase 76: Collections: Counter (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Conte frequência de elementos rapidamente com Counter com rigor de produção",
    puzzleDescription: "Estrutura especializada de alta velocidade para estatística e contagem. Neste desafio prático você irá dominar Collections: Counter aplicando código profissional.",
    initialCode: `from collections import Counter

palavras = ["python", "web", "python", "api", "web", "python"]
# Conte as ocorrências:
frequencia = Counter(palavras)
mais_comum = frequencia.most_common(1)`,
    hints: ["Counter da biblioteca padrão conta itens em O(n).","most_common(1) retorna o item mais frequente.","Ideal para análise de textos e logs."],
    expectedConditionText: "Counter(palavras)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Collections: Counter","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Collections: Counter</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /Counter\s*\(\s*palavras\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: Counter(palavras)',
      };
    },
  },
  {
    id: 77,
    title: "Fase 77: Dataclasses Modernas (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma classe de dados limpa com @dataclass com rigor de produção",
    puzzleDescription: "Reduz boilerplate de classes e estrutura dados tipados perfeitamente. Neste desafio prático você irá dominar Dataclasses Modernas aplicando código profissional.",
    initialCode: `from dataclasses import dataclass

@dataclass
class Produto:
    id: int
    nome: str
    preco: float
    estoque: int = 0`,
    hints: ["@dataclass gera automaticamente __init__, __repr__ e __eq__.","Declare os tipos dos atributos.","Adicione valores padrão opcionais."],
    expectedConditionText: "@dataclass class Produto:",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dataclasses Modernas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dataclasses Modernas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@dataclass[\s\S]*class\s+Produto/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @dataclass class Produto:',
      };
    },
  },
  {
    id: 78,
    title: "Fase 78: Asyncio e Corrotinas (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Execute tarefas assíncronas com asyncio.gather com rigor de produção",
    puzzleDescription: "Base de alta performance para servidores assíncronos e web scraping. Neste desafio prático você irá dominar Asyncio e Corrotinas aplicando código profissional.",
    initialCode: `import asyncio

async def buscar_preco(ativo):
    await asyncio.sleep(0.1)
    return f"{ativo}: R$ 100"

async def main():
    precos = await asyncio.gather(
        buscar_preco("BTC"),
        buscar_preco("ETH")
    )
    return precos`,
    hints: ["asyncio.gather roda corrotinas em paralelo.","Passe as chamadas de funções assíncronas.","Aguarde o resultado com await."],
    expectedConditionText: "asyncio.gather(buscar_preco(...), ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Asyncio e Corrotinas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Asyncio e Corrotinas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /asyncio\.gather/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: asyncio.gather(buscar_preco(...), ...)',
      };
    },
  },
  {
    id: 79,
    title: "Fase 79: Manipulação Segura de JSON (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Serialize e desserialize objetos com o módulo json com rigor de produção",
    puzzleDescription: "Intercâmbio universal de dados entre backends e frontends. Neste desafio prático você irá dominar Manipulação Segura de JSON aplicando código profissional.",
    initialCode: `import json

registro = {"usuario": "dev", "ativo": True, "nivel": 10}
texto_json = json.dumps(registro)
restaurado = json.loads(texto_json)`,
    hints: ["json.dumps converte dict para string.","json.loads converte string para dict.","True vira true e None vira null."],
    expectedConditionText: "json.dumps(registro) e json.loads(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Manipulação Segura de JSON","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Manipulação Segura de JSON</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /json\.dumps[\s\S]*json\.loads/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: json.dumps(registro) e json.loads(...)',
      };
    },
  },
  {
    id: 80,
    title: "Fase 80: Tratamento de Exceções Customizadas (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma exceção personalizada de negócio herdando de Exception com rigor de produção",
    puzzleDescription: "Arquitetura limpa para tratamento semântico de erros de domínio. Neste desafio prático você irá dominar Tratamento de Exceções Customizadas aplicando código profissional.",
    initialCode: `class SaldoInsuficienteError(Exception):
    pass

def sacar(saldo, valor):
    if valor > saldo:
        raise SaldoInsuficienteError("Saldo insuficiente para o saque")
    return saldo - valor`,
    hints: ["Crie classes de erro próprias herdando de Exception.","Dispare com raise NomeDoErro(\"mensagem\").","Facilita a captura granular de falhas de negócio."],
    expectedConditionText: "class SaldoInsuficienteError(Exception):",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Tratamento de Exceções Customizadas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Tratamento de Exceções Customizadas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /class\s+SaldoInsuficienteError\s*\(\s*Exception\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: class SaldoInsuficienteError(Exception):',
      };
    },
  },
  {
    id: 81,
    title: "Fase 81: List Comprehension com Filtro (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma list comprehension para extrair números pares ao quadrado com rigor de produção",
    puzzleDescription: "List comprehensions são o modo mais idiomático e performático de transformar listas em Python. Neste desafio prático você irá dominar List Comprehension com Filtro aplicando código profissional.",
    initialCode: `numeros = [1, 2, 3, 4, 5, 6, 7, 8]
# Crie a lista com os pares ao quadrado:
pares_quadrados = [n**2 for n in numeros if n % 2 == 0]`,
    hints: ["A sintaxe é [expressao for item in lista if condicao].","Verifique n % 2 == 0.","Eleve ao quadrado com n**2."],
    expectedConditionText: "[n**2 for n in numeros if n % 2 == 0]",
    previewType: "site-component",
    previewMeta: {"componentTitle":"List Comprehension com Filtro","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">List Comprehension com Filtro</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\[\s*(n|\w+)\*\*2\s+for\s+(n|\w+)\s+in\s+numeros/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: [n**2 for n in numeros if n % 2 == 0]',
      };
    },
  },
  {
    id: 82,
    title: "Fase 82: Dictionary Comprehension (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Gere um dicionário indexado pelo ID de cada usuário com rigor de produção",
    puzzleDescription: "Indexação de coleções em tabelas hash para buscas em tempo constante. Neste desafio prático você irá dominar Dictionary Comprehension aplicando código profissional.",
    initialCode: `usuarios = [{"id": 1, "nome": "Ana"}, {"id": 2, "nome": "Beto"}]
# Dicionário com chave id e valor nome:
mapa_usuarios = {u["id"]: u["nome"] for u in usuarios}`,
    hints: ["Use {chave: valor for item in lista}.","u[\"id\"] vira a chave de busca rápida O(1).","u[\"nome\"] vira o valor associado."],
    expectedConditionText: "{u[\"id\"]: u[\"nome\"] for u in usuarios}",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dictionary Comprehension","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dictionary Comprehension</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\{\s*u\[["']id["']\]\s*:\s*u\[["']nome["']\]\s+for\s+u\s+in\s+usuarios\s*\}/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: {u["id"]: u["nome"] for u in usuarios}',
      };
    },
  },
  {
    id: 83,
    title: "Fase 83: Geradores com yield (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função geradora que produz números sob demanda com rigor de produção",
    puzzleDescription: "Iteradores eficientes em memória para streaming de dados e pipelines de machine learning. Neste desafio prático você irá dominar Geradores com yield aplicando código profissional.",
    initialCode: `def contador_infinito(limite):
    n = 0
    while n < limite:
        yield n
        n += 1`,
    hints: ["yield pausa a execução e devolve o valor sem descarregar toda a memória.","O próximo item é lido com next() ou loop for.","Economiza gigabytes em arquivos grandes."],
    expectedConditionText: "yield n dentro de um loop",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Geradores com yield","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Geradores com yield</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /yield\s+n/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: yield n dentro de um loop',
      };
    },
  },
  {
    id: 84,
    title: "Fase 84: Context Manager com with (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Gerencie recursos com bloco with para fechamento automático com rigor de produção",
    puzzleDescription: "Garante que arquivos abertos, conexões de banco e locks sejam sempre liberados. Neste desafio prático você irá dominar Context Manager com with aplicando código profissional.",
    initialCode: `class Temporizador:
    def __enter__(self):
        print("Iniciando medição")
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Finalizando e liberando recursos")`,
    hints: ["Context managers garantem limpeza de conexões e arquivos.","__enter__ roda ao abrir o with.","__exit__ roda ao sair, mesmo com erro."],
    expectedConditionText: "métodos __enter__ e __exit__",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Context Manager com with","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Context Manager com with</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /def\s+__enter__[\s\S]*def\s+__exit__/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: métodos __enter__ e __exit__',
      };
    },
  },
  {
    id: 85,
    title: "Fase 85: Decorators (@decorador) (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie um decorator que registra a execução de uma função com rigor de produção",
    puzzleDescription: "Padrão essencial usado no FastAPI, Flask e Django para rotas e autenticação. Neste desafio prático você irá dominar Decorators (@decorador) aplicando código profissional.",
    initialCode: `def log_execucao(funcao):
    def wrapper(*args, **kwargs):
        print(f"Executando {funcao.__name__}")
        return funcao(*args, **kwargs)
    return wrapper

@log_execucao
def processar_pedido():
    return "Pedido Concluído"`,
    hints: ["Decorators alteram ou estendem o comportamento de funções.","wrapper recebe *args e **kwargs.","Retorne o wrapper."],
    expectedConditionText: "@log_execucao decorando a função",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Decorators (@decorador)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Decorators (@decorador)</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@log_execucao/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @log_execucao decorando a função',
      };
    },
  },
  {
    id: 86,
    title: "Fase 86: Collections: Counter (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Conte frequência de elementos rapidamente com Counter com rigor de produção",
    puzzleDescription: "Estrutura especializada de alta velocidade para estatística e contagem. Neste desafio prático você irá dominar Collections: Counter aplicando código profissional.",
    initialCode: `from collections import Counter

palavras = ["python", "web", "python", "api", "web", "python"]
# Conte as ocorrências:
frequencia = Counter(palavras)
mais_comum = frequencia.most_common(1)`,
    hints: ["Counter da biblioteca padrão conta itens em O(n).","most_common(1) retorna o item mais frequente.","Ideal para análise de textos e logs."],
    expectedConditionText: "Counter(palavras)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Collections: Counter","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Collections: Counter</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /Counter\s*\(\s*palavras\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: Counter(palavras)',
      };
    },
  },
  {
    id: 87,
    title: "Fase 87: Dataclasses Modernas (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma classe de dados limpa com @dataclass com rigor de produção",
    puzzleDescription: "Reduz boilerplate de classes e estrutura dados tipados perfeitamente. Neste desafio prático você irá dominar Dataclasses Modernas aplicando código profissional.",
    initialCode: `from dataclasses import dataclass

@dataclass
class Produto:
    id: int
    nome: str
    preco: float
    estoque: int = 0`,
    hints: ["@dataclass gera automaticamente __init__, __repr__ e __eq__.","Declare os tipos dos atributos.","Adicione valores padrão opcionais."],
    expectedConditionText: "@dataclass class Produto:",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dataclasses Modernas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dataclasses Modernas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@dataclass[\s\S]*class\s+Produto/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @dataclass class Produto:',
      };
    },
  },
  {
    id: 88,
    title: "Fase 88: Asyncio e Corrotinas (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Execute tarefas assíncronas com asyncio.gather com rigor de produção",
    puzzleDescription: "Base de alta performance para servidores assíncronos e web scraping. Neste desafio prático você irá dominar Asyncio e Corrotinas aplicando código profissional.",
    initialCode: `import asyncio

async def buscar_preco(ativo):
    await asyncio.sleep(0.1)
    return f"{ativo}: R$ 100"

async def main():
    precos = await asyncio.gather(
        buscar_preco("BTC"),
        buscar_preco("ETH")
    )
    return precos`,
    hints: ["asyncio.gather roda corrotinas em paralelo.","Passe as chamadas de funções assíncronas.","Aguarde o resultado com await."],
    expectedConditionText: "asyncio.gather(buscar_preco(...), ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Asyncio e Corrotinas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Asyncio e Corrotinas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /asyncio\.gather/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: asyncio.gather(buscar_preco(...), ...)',
      };
    },
  },
  {
    id: 89,
    title: "Fase 89: Manipulação Segura de JSON (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Serialize e desserialize objetos com o módulo json com rigor de produção",
    puzzleDescription: "Intercâmbio universal de dados entre backends e frontends. Neste desafio prático você irá dominar Manipulação Segura de JSON aplicando código profissional.",
    initialCode: `import json

registro = {"usuario": "dev", "ativo": True, "nivel": 10}
texto_json = json.dumps(registro)
restaurado = json.loads(texto_json)`,
    hints: ["json.dumps converte dict para string.","json.loads converte string para dict.","True vira true e None vira null."],
    expectedConditionText: "json.dumps(registro) e json.loads(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Manipulação Segura de JSON","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Manipulação Segura de JSON</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /json\.dumps[\s\S]*json\.loads/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: json.dumps(registro) e json.loads(...)',
      };
    },
  },
  {
    id: 90,
    title: "Fase 90: Tratamento de Exceções Customizadas (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma exceção personalizada de negócio herdando de Exception com rigor de produção",
    puzzleDescription: "Arquitetura limpa para tratamento semântico de erros de domínio. Neste desafio prático você irá dominar Tratamento de Exceções Customizadas aplicando código profissional.",
    initialCode: `class SaldoInsuficienteError(Exception):
    pass

def sacar(saldo, valor):
    if valor > saldo:
        raise SaldoInsuficienteError("Saldo insuficiente para o saque")
    return saldo - valor`,
    hints: ["Crie classes de erro próprias herdando de Exception.","Dispare com raise NomeDoErro(\"mensagem\").","Facilita a captura granular de falhas de negócio."],
    expectedConditionText: "class SaldoInsuficienteError(Exception):",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Tratamento de Exceções Customizadas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Tratamento de Exceções Customizadas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /class\s+SaldoInsuficienteError\s*\(\s*Exception\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: class SaldoInsuficienteError(Exception):',
      };
    },
  },
  {
    id: 91,
    title: "Fase 91: List Comprehension com Filtro (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma list comprehension para extrair números pares ao quadrado com rigor de produção",
    puzzleDescription: "List comprehensions são o modo mais idiomático e performático de transformar listas em Python. Neste desafio prático você irá dominar List Comprehension com Filtro aplicando código profissional.",
    initialCode: `numeros = [1, 2, 3, 4, 5, 6, 7, 8]
# Crie a lista com os pares ao quadrado:
pares_quadrados = [n**2 for n in numeros if n % 2 == 0]`,
    hints: ["A sintaxe é [expressao for item in lista if condicao].","Verifique n % 2 == 0.","Eleve ao quadrado com n**2."],
    expectedConditionText: "[n**2 for n in numeros if n % 2 == 0]",
    previewType: "site-component",
    previewMeta: {"componentTitle":"List Comprehension com Filtro","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">List Comprehension com Filtro</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\[\s*(n|\w+)\*\*2\s+for\s+(n|\w+)\s+in\s+numeros/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: [n**2 for n in numeros if n % 2 == 0]',
      };
    },
  },
  {
    id: 92,
    title: "Fase 92: Dictionary Comprehension (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Gere um dicionário indexado pelo ID de cada usuário com rigor de produção",
    puzzleDescription: "Indexação de coleções em tabelas hash para buscas em tempo constante. Neste desafio prático você irá dominar Dictionary Comprehension aplicando código profissional.",
    initialCode: `usuarios = [{"id": 1, "nome": "Ana"}, {"id": 2, "nome": "Beto"}]
# Dicionário com chave id e valor nome:
mapa_usuarios = {u["id"]: u["nome"] for u in usuarios}`,
    hints: ["Use {chave: valor for item in lista}.","u[\"id\"] vira a chave de busca rápida O(1).","u[\"nome\"] vira o valor associado."],
    expectedConditionText: "{u[\"id\"]: u[\"nome\"] for u in usuarios}",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dictionary Comprehension","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dictionary Comprehension</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\{\s*u\[["']id["']\]\s*:\s*u\[["']nome["']\]\s+for\s+u\s+in\s+usuarios\s*\}/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: {u["id"]: u["nome"] for u in usuarios}',
      };
    },
  },
  {
    id: 93,
    title: "Fase 93: Geradores com yield (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função geradora que produz números sob demanda com rigor de produção",
    puzzleDescription: "Iteradores eficientes em memória para streaming de dados e pipelines de machine learning. Neste desafio prático você irá dominar Geradores com yield aplicando código profissional.",
    initialCode: `def contador_infinito(limite):
    n = 0
    while n < limite:
        yield n
        n += 1`,
    hints: ["yield pausa a execução e devolve o valor sem descarregar toda a memória.","O próximo item é lido com next() ou loop for.","Economiza gigabytes em arquivos grandes."],
    expectedConditionText: "yield n dentro de um loop",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Geradores com yield","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Geradores com yield</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /yield\s+n/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: yield n dentro de um loop',
      };
    },
  },
  {
    id: 94,
    title: "Fase 94: Context Manager com with (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Gerencie recursos com bloco with para fechamento automático com rigor de produção",
    puzzleDescription: "Garante que arquivos abertos, conexões de banco e locks sejam sempre liberados. Neste desafio prático você irá dominar Context Manager com with aplicando código profissional.",
    initialCode: `class Temporizador:
    def __enter__(self):
        print("Iniciando medição")
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Finalizando e liberando recursos")`,
    hints: ["Context managers garantem limpeza de conexões e arquivos.","__enter__ roda ao abrir o with.","__exit__ roda ao sair, mesmo com erro."],
    expectedConditionText: "métodos __enter__ e __exit__",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Context Manager com with","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Context Manager com with</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /def\s+__enter__[\s\S]*def\s+__exit__/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: métodos __enter__ e __exit__',
      };
    },
  },
  {
    id: 95,
    title: "Fase 95: Decorators (@decorador) (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie um decorator que registra a execução de uma função com rigor de produção",
    puzzleDescription: "Padrão essencial usado no FastAPI, Flask e Django para rotas e autenticação. Neste desafio prático você irá dominar Decorators (@decorador) aplicando código profissional.",
    initialCode: `def log_execucao(funcao):
    def wrapper(*args, **kwargs):
        print(f"Executando {funcao.__name__}")
        return funcao(*args, **kwargs)
    return wrapper

@log_execucao
def processar_pedido():
    return "Pedido Concluído"`,
    hints: ["Decorators alteram ou estendem o comportamento de funções.","wrapper recebe *args e **kwargs.","Retorne o wrapper."],
    expectedConditionText: "@log_execucao decorando a função",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Decorators (@decorador)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Decorators (@decorador)</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@log_execucao/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @log_execucao decorando a função',
      };
    },
  },
  {
    id: 96,
    title: "Fase 96: Collections: Counter (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Conte frequência de elementos rapidamente com Counter com rigor de produção",
    puzzleDescription: "Estrutura especializada de alta velocidade para estatística e contagem. Neste desafio prático você irá dominar Collections: Counter aplicando código profissional.",
    initialCode: `from collections import Counter

palavras = ["python", "web", "python", "api", "web", "python"]
# Conte as ocorrências:
frequencia = Counter(palavras)
mais_comum = frequencia.most_common(1)`,
    hints: ["Counter da biblioteca padrão conta itens em O(n).","most_common(1) retorna o item mais frequente.","Ideal para análise de textos e logs."],
    expectedConditionText: "Counter(palavras)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Collections: Counter","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Collections: Counter</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /Counter\s*\(\s*palavras\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: Counter(palavras)',
      };
    },
  },
  {
    id: 97,
    title: "Fase 97: Dataclasses Modernas (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma classe de dados limpa com @dataclass com rigor de produção",
    puzzleDescription: "Reduz boilerplate de classes e estrutura dados tipados perfeitamente. Neste desafio prático você irá dominar Dataclasses Modernas aplicando código profissional.",
    initialCode: `from dataclasses import dataclass

@dataclass
class Produto:
    id: int
    nome: str
    preco: float
    estoque: int = 0`,
    hints: ["@dataclass gera automaticamente __init__, __repr__ e __eq__.","Declare os tipos dos atributos.","Adicione valores padrão opcionais."],
    expectedConditionText: "@dataclass class Produto:",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dataclasses Modernas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dataclasses Modernas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@dataclass[\s\S]*class\s+Produto/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @dataclass class Produto:',
      };
    },
  },
  {
    id: 98,
    title: "Fase 98: Asyncio e Corrotinas (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Execute tarefas assíncronas com asyncio.gather com rigor de produção",
    puzzleDescription: "Base de alta performance para servidores assíncronos e web scraping. Neste desafio prático você irá dominar Asyncio e Corrotinas aplicando código profissional.",
    initialCode: `import asyncio

async def buscar_preco(ativo):
    await asyncio.sleep(0.1)
    return f"{ativo}: R$ 100"

async def main():
    precos = await asyncio.gather(
        buscar_preco("BTC"),
        buscar_preco("ETH")
    )
    return precos`,
    hints: ["asyncio.gather roda corrotinas em paralelo.","Passe as chamadas de funções assíncronas.","Aguarde o resultado com await."],
    expectedConditionText: "asyncio.gather(buscar_preco(...), ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Asyncio e Corrotinas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Asyncio e Corrotinas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /asyncio\.gather/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: asyncio.gather(buscar_preco(...), ...)',
      };
    },
  },
  {
    id: 99,
    title: "Fase 99: Manipulação Segura de JSON (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Serialize e desserialize objetos com o módulo json com rigor de produção",
    puzzleDescription: "Intercâmbio universal de dados entre backends e frontends. Neste desafio prático você irá dominar Manipulação Segura de JSON aplicando código profissional.",
    initialCode: `import json

registro = {"usuario": "dev", "ativo": True, "nivel": 10}
texto_json = json.dumps(registro)
restaurado = json.loads(texto_json)`,
    hints: ["json.dumps converte dict para string.","json.loads converte string para dict.","True vira true e None vira null."],
    expectedConditionText: "json.dumps(registro) e json.loads(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Manipulação Segura de JSON","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Manipulação Segura de JSON</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /json\.dumps[\s\S]*json\.loads/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: json.dumps(registro) e json.loads(...)',
      };
    },
  },
  {
    id: 100,
    title: "Fase 100: Tratamento de Exceções Customizadas (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma exceção personalizada de negócio herdando de Exception com rigor de produção",
    puzzleDescription: "Arquitetura limpa para tratamento semântico de erros de domínio. Neste desafio prático você irá dominar Tratamento de Exceções Customizadas aplicando código profissional.",
    initialCode: `class SaldoInsuficienteError(Exception):
    pass

def sacar(saldo, valor):
    if valor > saldo:
        raise SaldoInsuficienteError("Saldo insuficiente para o saque")
    return saldo - valor`,
    hints: ["Crie classes de erro próprias herdando de Exception.","Dispare com raise NomeDoErro(\"mensagem\").","Facilita a captura granular de falhas de negócio."],
    expectedConditionText: "class SaldoInsuficienteError(Exception):",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Tratamento de Exceções Customizadas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Tratamento de Exceções Customizadas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /class\s+SaldoInsuficienteError\s*\(\s*Exception\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: class SaldoInsuficienteError(Exception):',
      };
    },
  },
  {
    id: 101,
    title: "Fase 101: List Comprehension com Filtro (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma list comprehension para extrair números pares ao quadrado com rigor de produção",
    puzzleDescription: "List comprehensions são o modo mais idiomático e performático de transformar listas em Python. Neste desafio prático você irá dominar List Comprehension com Filtro aplicando código profissional.",
    initialCode: `numeros = [1, 2, 3, 4, 5, 6, 7, 8]
# Crie a lista com os pares ao quadrado:
pares_quadrados = [n**2 for n in numeros if n % 2 == 0]`,
    hints: ["A sintaxe é [expressao for item in lista if condicao].","Verifique n % 2 == 0.","Eleve ao quadrado com n**2."],
    expectedConditionText: "[n**2 for n in numeros if n % 2 == 0]",
    previewType: "site-component",
    previewMeta: {"componentTitle":"List Comprehension com Filtro","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">List Comprehension com Filtro</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\[\s*(n|\w+)\*\*2\s+for\s+(n|\w+)\s+in\s+numeros/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: [n**2 for n in numeros if n % 2 == 0]',
      };
    },
  },
  {
    id: 102,
    title: "Fase 102: Dictionary Comprehension (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Gere um dicionário indexado pelo ID de cada usuário com rigor de produção",
    puzzleDescription: "Indexação de coleções em tabelas hash para buscas em tempo constante. Neste desafio prático você irá dominar Dictionary Comprehension aplicando código profissional.",
    initialCode: `usuarios = [{"id": 1, "nome": "Ana"}, {"id": 2, "nome": "Beto"}]
# Dicionário com chave id e valor nome:
mapa_usuarios = {u["id"]: u["nome"] for u in usuarios}`,
    hints: ["Use {chave: valor for item in lista}.","u[\"id\"] vira a chave de busca rápida O(1).","u[\"nome\"] vira o valor associado."],
    expectedConditionText: "{u[\"id\"]: u[\"nome\"] for u in usuarios}",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dictionary Comprehension","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dictionary Comprehension</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\{\s*u\[["']id["']\]\s*:\s*u\[["']nome["']\]\s+for\s+u\s+in\s+usuarios\s*\}/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: {u["id"]: u["nome"] for u in usuarios}',
      };
    },
  },
  {
    id: 103,
    title: "Fase 103: Geradores com yield (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função geradora que produz números sob demanda com rigor de produção",
    puzzleDescription: "Iteradores eficientes em memória para streaming de dados e pipelines de machine learning. Neste desafio prático você irá dominar Geradores com yield aplicando código profissional.",
    initialCode: `def contador_infinito(limite):
    n = 0
    while n < limite:
        yield n
        n += 1`,
    hints: ["yield pausa a execução e devolve o valor sem descarregar toda a memória.","O próximo item é lido com next() ou loop for.","Economiza gigabytes em arquivos grandes."],
    expectedConditionText: "yield n dentro de um loop",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Geradores com yield","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Geradores com yield</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /yield\s+n/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: yield n dentro de um loop',
      };
    },
  },
  {
    id: 104,
    title: "Fase 104: Context Manager com with (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Gerencie recursos com bloco with para fechamento automático com rigor de produção",
    puzzleDescription: "Garante que arquivos abertos, conexões de banco e locks sejam sempre liberados. Neste desafio prático você irá dominar Context Manager com with aplicando código profissional.",
    initialCode: `class Temporizador:
    def __enter__(self):
        print("Iniciando medição")
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Finalizando e liberando recursos")`,
    hints: ["Context managers garantem limpeza de conexões e arquivos.","__enter__ roda ao abrir o with.","__exit__ roda ao sair, mesmo com erro."],
    expectedConditionText: "métodos __enter__ e __exit__",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Context Manager com with","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Context Manager com with</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /def\s+__enter__[\s\S]*def\s+__exit__/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: métodos __enter__ e __exit__',
      };
    },
  },
  {
    id: 105,
    title: "Fase 105: Decorators (@decorador) (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie um decorator que registra a execução de uma função com rigor de produção",
    puzzleDescription: "Padrão essencial usado no FastAPI, Flask e Django para rotas e autenticação. Neste desafio prático você irá dominar Decorators (@decorador) aplicando código profissional.",
    initialCode: `def log_execucao(funcao):
    def wrapper(*args, **kwargs):
        print(f"Executando {funcao.__name__}")
        return funcao(*args, **kwargs)
    return wrapper

@log_execucao
def processar_pedido():
    return "Pedido Concluído"`,
    hints: ["Decorators alteram ou estendem o comportamento de funções.","wrapper recebe *args e **kwargs.","Retorne o wrapper."],
    expectedConditionText: "@log_execucao decorando a função",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Decorators (@decorador)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Decorators (@decorador)</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@log_execucao/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @log_execucao decorando a função',
      };
    },
  },
  {
    id: 106,
    title: "Fase 106: Collections: Counter (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Conte frequência de elementos rapidamente com Counter com rigor de produção",
    puzzleDescription: "Estrutura especializada de alta velocidade para estatística e contagem. Neste desafio prático você irá dominar Collections: Counter aplicando código profissional.",
    initialCode: `from collections import Counter

palavras = ["python", "web", "python", "api", "web", "python"]
# Conte as ocorrências:
frequencia = Counter(palavras)
mais_comum = frequencia.most_common(1)`,
    hints: ["Counter da biblioteca padrão conta itens em O(n).","most_common(1) retorna o item mais frequente.","Ideal para análise de textos e logs."],
    expectedConditionText: "Counter(palavras)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Collections: Counter","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Collections: Counter</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /Counter\s*\(\s*palavras\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: Counter(palavras)',
      };
    },
  },
  {
    id: 107,
    title: "Fase 107: Dataclasses Modernas (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma classe de dados limpa com @dataclass com rigor de produção",
    puzzleDescription: "Reduz boilerplate de classes e estrutura dados tipados perfeitamente. Neste desafio prático você irá dominar Dataclasses Modernas aplicando código profissional.",
    initialCode: `from dataclasses import dataclass

@dataclass
class Produto:
    id: int
    nome: str
    preco: float
    estoque: int = 0`,
    hints: ["@dataclass gera automaticamente __init__, __repr__ e __eq__.","Declare os tipos dos atributos.","Adicione valores padrão opcionais."],
    expectedConditionText: "@dataclass class Produto:",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dataclasses Modernas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dataclasses Modernas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@dataclass[\s\S]*class\s+Produto/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @dataclass class Produto:',
      };
    },
  },
  {
    id: 108,
    title: "Fase 108: Asyncio e Corrotinas (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Execute tarefas assíncronas com asyncio.gather com rigor de produção",
    puzzleDescription: "Base de alta performance para servidores assíncronos e web scraping. Neste desafio prático você irá dominar Asyncio e Corrotinas aplicando código profissional.",
    initialCode: `import asyncio

async def buscar_preco(ativo):
    await asyncio.sleep(0.1)
    return f"{ativo}: R$ 100"

async def main():
    precos = await asyncio.gather(
        buscar_preco("BTC"),
        buscar_preco("ETH")
    )
    return precos`,
    hints: ["asyncio.gather roda corrotinas em paralelo.","Passe as chamadas de funções assíncronas.","Aguarde o resultado com await."],
    expectedConditionText: "asyncio.gather(buscar_preco(...), ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Asyncio e Corrotinas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Asyncio e Corrotinas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /asyncio\.gather/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: asyncio.gather(buscar_preco(...), ...)',
      };
    },
  },
  {
    id: 109,
    title: "Fase 109: Manipulação Segura de JSON (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Serialize e desserialize objetos com o módulo json com rigor de produção",
    puzzleDescription: "Intercâmbio universal de dados entre backends e frontends. Neste desafio prático você irá dominar Manipulação Segura de JSON aplicando código profissional.",
    initialCode: `import json

registro = {"usuario": "dev", "ativo": True, "nivel": 10}
texto_json = json.dumps(registro)
restaurado = json.loads(texto_json)`,
    hints: ["json.dumps converte dict para string.","json.loads converte string para dict.","True vira true e None vira null."],
    expectedConditionText: "json.dumps(registro) e json.loads(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Manipulação Segura de JSON","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Manipulação Segura de JSON</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /json\.dumps[\s\S]*json\.loads/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: json.dumps(registro) e json.loads(...)',
      };
    },
  },
  {
    id: 110,
    title: "Fase 110: Tratamento de Exceções Customizadas (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma exceção personalizada de negócio herdando de Exception com rigor de produção",
    puzzleDescription: "Arquitetura limpa para tratamento semântico de erros de domínio. Neste desafio prático você irá dominar Tratamento de Exceções Customizadas aplicando código profissional.",
    initialCode: `class SaldoInsuficienteError(Exception):
    pass

def sacar(saldo, valor):
    if valor > saldo:
        raise SaldoInsuficienteError("Saldo insuficiente para o saque")
    return saldo - valor`,
    hints: ["Crie classes de erro próprias herdando de Exception.","Dispare com raise NomeDoErro(\"mensagem\").","Facilita a captura granular de falhas de negócio."],
    expectedConditionText: "class SaldoInsuficienteError(Exception):",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Tratamento de Exceções Customizadas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Tratamento de Exceções Customizadas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /class\s+SaldoInsuficienteError\s*\(\s*Exception\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: class SaldoInsuficienteError(Exception):',
      };
    },
  },
  {
    id: 111,
    title: "Fase 111: List Comprehension com Filtro (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma list comprehension para extrair números pares ao quadrado com rigor de produção",
    puzzleDescription: "List comprehensions são o modo mais idiomático e performático de transformar listas em Python. Neste desafio prático você irá dominar List Comprehension com Filtro aplicando código profissional.",
    initialCode: `numeros = [1, 2, 3, 4, 5, 6, 7, 8]
# Crie a lista com os pares ao quadrado:
pares_quadrados = [n**2 for n in numeros if n % 2 == 0]`,
    hints: ["A sintaxe é [expressao for item in lista if condicao].","Verifique n % 2 == 0.","Eleve ao quadrado com n**2."],
    expectedConditionText: "[n**2 for n in numeros if n % 2 == 0]",
    previewType: "site-component",
    previewMeta: {"componentTitle":"List Comprehension com Filtro","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">List Comprehension com Filtro</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\[\s*(n|\w+)\*\*2\s+for\s+(n|\w+)\s+in\s+numeros/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: [n**2 for n in numeros if n % 2 == 0]',
      };
    },
  },
  {
    id: 112,
    title: "Fase 112: Dictionary Comprehension (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Gere um dicionário indexado pelo ID de cada usuário com rigor de produção",
    puzzleDescription: "Indexação de coleções em tabelas hash para buscas em tempo constante. Neste desafio prático você irá dominar Dictionary Comprehension aplicando código profissional.",
    initialCode: `usuarios = [{"id": 1, "nome": "Ana"}, {"id": 2, "nome": "Beto"}]
# Dicionário com chave id e valor nome:
mapa_usuarios = {u["id"]: u["nome"] for u in usuarios}`,
    hints: ["Use {chave: valor for item in lista}.","u[\"id\"] vira a chave de busca rápida O(1).","u[\"nome\"] vira o valor associado."],
    expectedConditionText: "{u[\"id\"]: u[\"nome\"] for u in usuarios}",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dictionary Comprehension","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dictionary Comprehension</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /\{\s*u\[["']id["']\]\s*:\s*u\[["']nome["']\]\s+for\s+u\s+in\s+usuarios\s*\}/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: {u["id"]: u["nome"] for u in usuarios}',
      };
    },
  },
  {
    id: 113,
    title: "Fase 113: Geradores com yield (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função geradora que produz números sob demanda com rigor de produção",
    puzzleDescription: "Iteradores eficientes em memória para streaming de dados e pipelines de machine learning. Neste desafio prático você irá dominar Geradores com yield aplicando código profissional.",
    initialCode: `def contador_infinito(limite):
    n = 0
    while n < limite:
        yield n
        n += 1`,
    hints: ["yield pausa a execução e devolve o valor sem descarregar toda a memória.","O próximo item é lido com next() ou loop for.","Economiza gigabytes em arquivos grandes."],
    expectedConditionText: "yield n dentro de um loop",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Geradores com yield","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Geradores com yield</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /yield\s+n/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: yield n dentro de um loop',
      };
    },
  },
  {
    id: 114,
    title: "Fase 114: Context Manager com with (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Gerencie recursos com bloco with para fechamento automático com rigor de produção",
    puzzleDescription: "Garante que arquivos abertos, conexões de banco e locks sejam sempre liberados. Neste desafio prático você irá dominar Context Manager com with aplicando código profissional.",
    initialCode: `class Temporizador:
    def __enter__(self):
        print("Iniciando medição")
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Finalizando e liberando recursos")`,
    hints: ["Context managers garantem limpeza de conexões e arquivos.","__enter__ roda ao abrir o with.","__exit__ roda ao sair, mesmo com erro."],
    expectedConditionText: "métodos __enter__ e __exit__",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Context Manager com with","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Context Manager com with</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /def\s+__enter__[\s\S]*def\s+__exit__/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: métodos __enter__ e __exit__',
      };
    },
  },
  {
    id: 115,
    title: "Fase 115: Decorators (@decorador) (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie um decorator que registra a execução de uma função com rigor de produção",
    puzzleDescription: "Padrão essencial usado no FastAPI, Flask e Django para rotas e autenticação. Neste desafio prático você irá dominar Decorators (@decorador) aplicando código profissional.",
    initialCode: `def log_execucao(funcao):
    def wrapper(*args, **kwargs):
        print(f"Executando {funcao.__name__}")
        return funcao(*args, **kwargs)
    return wrapper

@log_execucao
def processar_pedido():
    return "Pedido Concluído"`,
    hints: ["Decorators alteram ou estendem o comportamento de funções.","wrapper recebe *args e **kwargs.","Retorne o wrapper."],
    expectedConditionText: "@log_execucao decorando a função",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Decorators (@decorador)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Decorators (@decorador)</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@log_execucao/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @log_execucao decorando a função',
      };
    },
  },
  {
    id: 116,
    title: "Fase 116: Collections: Counter (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Conte frequência de elementos rapidamente com Counter com rigor de produção",
    puzzleDescription: "Estrutura especializada de alta velocidade para estatística e contagem. Neste desafio prático você irá dominar Collections: Counter aplicando código profissional.",
    initialCode: `from collections import Counter

palavras = ["python", "web", "python", "api", "web", "python"]
# Conte as ocorrências:
frequencia = Counter(palavras)
mais_comum = frequencia.most_common(1)`,
    hints: ["Counter da biblioteca padrão conta itens em O(n).","most_common(1) retorna o item mais frequente.","Ideal para análise de textos e logs."],
    expectedConditionText: "Counter(palavras)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Collections: Counter","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Collections: Counter</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /Counter\s*\(\s*palavras\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: Counter(palavras)',
      };
    },
  },
  {
    id: 117,
    title: "Fase 117: Dataclasses Modernas (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma classe de dados limpa com @dataclass com rigor de produção",
    puzzleDescription: "Reduz boilerplate de classes e estrutura dados tipados perfeitamente. Neste desafio prático você irá dominar Dataclasses Modernas aplicando código profissional.",
    initialCode: `from dataclasses import dataclass

@dataclass
class Produto:
    id: int
    nome: str
    preco: float
    estoque: int = 0`,
    hints: ["@dataclass gera automaticamente __init__, __repr__ e __eq__.","Declare os tipos dos atributos.","Adicione valores padrão opcionais."],
    expectedConditionText: "@dataclass class Produto:",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dataclasses Modernas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dataclasses Modernas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /@dataclass[\s\S]*class\s+Produto/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @dataclass class Produto:',
      };
    },
  },
  {
    id: 118,
    title: "Fase 118: Asyncio e Corrotinas (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Execute tarefas assíncronas com asyncio.gather com rigor de produção",
    puzzleDescription: "Base de alta performance para servidores assíncronos e web scraping. Neste desafio prático você irá dominar Asyncio e Corrotinas aplicando código profissional.",
    initialCode: `import asyncio

async def buscar_preco(ativo):
    await asyncio.sleep(0.1)
    return f"{ativo}: R$ 100"

async def main():
    precos = await asyncio.gather(
        buscar_preco("BTC"),
        buscar_preco("ETH")
    )
    return precos`,
    hints: ["asyncio.gather roda corrotinas em paralelo.","Passe as chamadas de funções assíncronas.","Aguarde o resultado com await."],
    expectedConditionText: "asyncio.gather(buscar_preco(...), ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Asyncio e Corrotinas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Asyncio e Corrotinas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /asyncio\.gather/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: asyncio.gather(buscar_preco(...), ...)',
      };
    },
  },
  {
    id: 119,
    title: "Fase 119: Manipulação Segura de JSON (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Serialize e desserialize objetos com o módulo json com rigor de produção",
    puzzleDescription: "Intercâmbio universal de dados entre backends e frontends. Neste desafio prático você irá dominar Manipulação Segura de JSON aplicando código profissional.",
    initialCode: `import json

registro = {"usuario": "dev", "ativo": True, "nivel": 10}
texto_json = json.dumps(registro)
restaurado = json.loads(texto_json)`,
    hints: ["json.dumps converte dict para string.","json.loads converte string para dict.","True vira true e None vira null."],
    expectedConditionText: "json.dumps(registro) e json.loads(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Manipulação Segura de JSON","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Manipulação Segura de JSON</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /json\.dumps[\s\S]*json\.loads/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: json.dumps(registro) e json.loads(...)',
      };
    },
  },
  {
    id: 120,
    title: "Fase 120: Tratamento de Exceções Customizadas (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma exceção personalizada de negócio herdando de Exception com rigor de produção",
    puzzleDescription: "Arquitetura limpa para tratamento semântico de erros de domínio. Neste desafio prático você irá dominar Tratamento de Exceções Customizadas aplicando código profissional.",
    initialCode: `class SaldoInsuficienteError(Exception):
    pass

def sacar(saldo, valor):
    if valor > saldo:
        raise SaldoInsuficienteError("Saldo insuficiente para o saque")
    return saldo - valor`,
    hints: ["Crie classes de erro próprias herdando de Exception.","Dispare com raise NomeDoErro(\"mensagem\").","Facilita a captura granular de falhas de negócio."],
    expectedConditionText: "class SaldoInsuficienteError(Exception):",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Tratamento de Exceções Customizadas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Tratamento de Exceções Customizadas</span>: Pronto para validação.</div>","successBadge":"Especialista PYTHON"},
    validate: (rawCode) => {
      const passed = /class\s+SaldoInsuficienteError\s*\(\s*Exception\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: class SaldoInsuficienteError(Exception):',
      };
    },
  },
];
