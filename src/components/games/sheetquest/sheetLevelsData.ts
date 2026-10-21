import { SheetLevel } from '../../../types/sheetQuest';

export const SHEET_CAMPAIGN_LEVELS: SheetLevel[] = [
  {
    "id": 1,
    "world": 1,
    "worldName": "Setup Gamer & Loja de Hardware",
    "title": "Coordenadas & Total Simples",
    "scenario": "A ByteTech precisa calcular o custo inicial de dois upgrades para o PC gamer da equipe.",
    "clientName": "Lucas \"Pixel\" Rocha",
    "clientRole": "Gerente da Loja ByteTech",
    "clientAvatar": "💻",
    "briefing": "Olá! Toda fórmula em planilhas começa obrigatoriamente com o sinal de igual (=). Na célula B4, some o Mouse Gamer (B2) com o Teclado Mecânico (B3) usando as coordenadas das células!",
    "tipTitle": "Como referenciar células",
    "tipContent": "Digite =B2+B3 na célula B4. Não digite os números (120+280); use sempre as coordenadas da coluna e linha!",
    "cheatSheetFormula": "=B2+B3",
    "numColumns": 3,
    "numRows": 5,
    "initialGrid": {
      "A1": {
        "raw": "Periférico",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Preço (R$)",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "A2": {
        "raw": "Mouse Gamer RGB",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 120,
        "display": 120,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "Teclado Mecânico",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 280,
        "display": 280,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "Total Periféricos",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "emerald"
      },
      "B4": {
        "raw": "",
        "format": "currency",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B4",
        "label": "Total dos Periféricos",
        "hint": "Some B2 com B3 digitando =B2+B3",
        "explanation": "Fórmulas dinâmicas recalculam sozinhas se o preço do teclado ou mouse mudar.",
        "expectedValue": 400,
        "solutionFormula": "=B2+B3",
        "expectedReferences": [
          "B2",
          "B3"
        ],
        "allowArithmetic": true
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 150,
        "B3": 300
      },
      "expectedRecalculations": {
        "B4": 450
      }
    }
  },
  {
    "id": 2,
    "world": 1,
    "worldName": "Setup Gamer & Loja de Hardware",
    "title": "Multiplicação & Desconto",
    "scenario": "Vamos calcular o subtotal dos cabos e aplicar o cupom de desconto de lançamento.",
    "clientName": "Lucas \"Pixel\" Rocha",
    "clientRole": "Gerente da Loja ByteTech",
    "clientAvatar": "💻",
    "briefing": "Em planilhas, a multiplicação usa o asterisco (*) e a subtração usa o traço (-). Calcule o Subtotal na célula D2 multiplicando Quantidade (B2) pelo Preço Unitário (C2). Depois, calcule o Total Líquido na célula F2 subtraindo o Desconto (E2)!",
    "tipTitle": "Operadores Matemáticos (* e -)",
    "tipContent": "Para multiplicar duas células use =B2*C2. Para subtrair o desconto use =D2-E2.",
    "cheatSheetFormula": "=B2*C2  e  =D2-E2",
    "numColumns": 6,
    "numRows": 4,
    "initialGrid": {
      "A1": {
        "raw": "Item",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Qtd",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C1": {
        "raw": "Preço Un.",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "D1": {
        "raw": "Subtotal",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "E1": {
        "raw": "Desconto",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "F1": {
        "raw": "Líquido",
        "align": "right",
        "format": "text",
        "readOnly": true,
        "badgeColor": "emerald"
      },
      "A2": {
        "raw": "Cabo Sleeved Pro",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 4,
        "display": 4,
        "format": "number",
        "align": "center",
        "readOnly": true
      },
      "C2": {
        "raw": 50,
        "display": 50,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "D2": {
        "raw": "",
        "format": "currency",
        "align": "right",
        "isTarget": true
      },
      "E2": {
        "raw": 30,
        "display": 30,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "F2": {
        "raw": "",
        "format": "currency",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "D2",
        "label": "Subtotal dos Cabos",
        "hint": "Multiplique quantidade por preço unitário: =B2*C2",
        "explanation": "4 cabos a R$ 50 cada totalizam R$ 200.",
        "expectedValue": 200,
        "solutionFormula": "=B2*C2",
        "expectedReferences": [
          "B2",
          "C2"
        ],
        "allowArithmetic": true
      },
      {
        "coord": "F2",
        "label": "Total Líquido com Desconto",
        "hint": "Subtraia o desconto do subtotal: =D2-E2",
        "explanation": "Subtotal (R$ 200) menos Desconto (R$ 30) = R$ 170.",
        "expectedValue": 170,
        "solutionFormula": "=D2-E2",
        "expectedReferences": [
          "D2",
          "E2"
        ],
        "allowArithmetic": true
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 5,
        "C2": 60,
        "D2": 300,
        "E2": 50
      },
      "expectedRecalculations": {
        "D2": 300,
        "F2": 250
      }
    }
  },
  {
    "id": 3,
    "world": 1,
    "worldName": "Setup Gamer & Loja de Hardware",
    "title": "Divisão de Parcelas & Parênteses",
    "scenario": "Um cliente comprou um monitor e um headset e quer parcelar em 6 vezes sem juros.",
    "clientName": "Lucas \"Pixel\" Rocha",
    "clientRole": "Gerente da Loja ByteTech",
    "clientAvatar": "💻",
    "briefing": "Em expressões complexas, o que está dentro dos parênteses ( ) é calculado primeiro! Calcule na célula B5 a soma dos dois produtos dividida pelas 6 parcelas.",
    "tipTitle": "Precedência de Parênteses e Barra (/)",
    "tipContent": "A divisão usa a barra /. Digite =(B2+B3)/B4 para somar primeiro e depois dividir.",
    "cheatSheetFormula": "=(B2+B3)/B4",
    "numColumns": 3,
    "numRows": 6,
    "initialGrid": {
      "A1": {
        "raw": "Descrição",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Valor",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "A2": {
        "raw": "Monitor 165Hz",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 900,
        "display": 900,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "Headset Surround",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 300,
        "display": 300,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "Número de Parcelas",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": 6,
        "display": 6,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A5": {
        "raw": "Valor da Parcela",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "amber"
      },
      "B5": {
        "raw": "",
        "format": "currency",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B5",
        "label": "Valor de Cada Parcela",
        "hint": "Some B2 e B3 entre parênteses e divida por B4: =(B2+B3)/B4",
        "explanation": "Sem os parênteses, a divisão seria feita antes da adição!",
        "expectedValue": 200,
        "solutionFormula": "=(B2+B3)/B4",
        "expectedReferences": [
          "B2",
          "B3",
          "B4"
        ],
        "allowArithmetic": true
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 1200,
        "B3": 600,
        "B4": 6
      },
      "expectedRecalculations": {
        "B5": 300
      }
    }
  },
  {
    "id": 4,
    "world": 2,
    "worldName": "Copa Escolar de E-Sports",
    "title": "A Função =SOMA e Intervalos (:)",
    "scenario": "Chega de somar célula a célula! Vamos somar a pontuação de todos os jogadores da equipe com um intervalo.",
    "clientName": "Capitã Clara \"Valkíria\"",
    "clientRole": "Líder do Time Alfa de E-Sports",
    "clientAvatar": "🏆",
    "briefing": "Usar B2+B3+B4+B5+B6 dá muito trabalho quando a lista tem centenas de linhas. A função =SOMA com dois-pontos (:) resolve tudo em segundos! Calcule a pontuação total da equipe na célula B7.",
    "tipTitle": "A Função =SOMA(início:fim)",
    "tipContent": "Digite =SOMA(B2:B6). Os dois-pontos significam \"até\" (da célula B2 até a célula B6).",
    "cheatSheetFormula": "=SOMA(B2:B6)",
    "numColumns": 3,
    "numRows": 8,
    "initialGrid": {
      "A1": {
        "raw": "Jogador",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Pontos",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "A2": {
        "raw": "Shadow",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 450,
        "display": 450,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "Valkíria",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 620,
        "display": 620,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "CyberFox",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": 380,
        "display": 380,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A5": {
        "raw": "NeonKnight",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": 510,
        "display": 510,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A6": {
        "raw": "BitStorm",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B6": {
        "raw": 440,
        "display": 440,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A7": {
        "raw": "Total da Equipe",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "emerald"
      },
      "B7": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B7",
        "label": "Pontuação Total do Time",
        "hint": "Use a função =SOMA(B2:B6) para somar todo o intervalo",
        "explanation": "A função SOMA ignora células vazias e recalcula com eficiência máxima.",
        "expectedValue": 2400,
        "solutionFormula": "=SOMA(B2:B6)",
        "requiredFunction": "SOMA",
        "expectedReferences": [
          "B2:B6"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 500,
        "B6": 500
      },
      "expectedRecalculations": {
        "B7": 2510
      }
    }
  },
  {
    "id": 5,
    "world": 2,
    "worldName": "Copa Escolar de E-Sports",
    "title": "Média de Pontos da Rodada",
    "scenario": "Para classificar o time para os playoffs, a comissão exige a média aritmética de pontuação.",
    "clientName": "Capitã Clara \"Valkíria\"",
    "clientRole": "Líder do Time Alfa de E-Sports",
    "clientAvatar": "🏆",
    "briefing": "A função =MÉDIA soma todos os valores do intervalo e divide pela quantidade de participantes automaticamente! Na célula B7, calcule a média de pontos da rodada.",
    "tipTitle": "A Função =MÉDIA(início:fim)",
    "tipContent": "Digite =MÉDIA(B2:B6) (você também pode digitar =MEDIA sem acento, o Sheets aceita ambos).",
    "cheatSheetFormula": "=MÉDIA(B2:B6)",
    "numColumns": 3,
    "numRows": 8,
    "initialGrid": {
      "A1": {
        "raw": "Partida",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Eliminações",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "A2": {
        "raw": "Rodada 1",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 18,
        "display": 18,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "Rodada 2",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 24,
        "display": 24,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "Rodada 3",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": 14,
        "display": 14,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A5": {
        "raw": "Rodada 4",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": 32,
        "display": 32,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A6": {
        "raw": "Rodada 5",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B6": {
        "raw": 22,
        "display": 22,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A7": {
        "raw": "Média por Rodada",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "sky"
      },
      "B7": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B7",
        "label": "Média de Eliminações",
        "hint": "Calcule a média do intervalo: =MÉDIA(B2:B6)",
        "explanation": "(18 + 24 + 14 + 32 + 22) / 5 = 22 eliminações por rodada.",
        "expectedValue": 22,
        "solutionFormula": "=MÉDIA(B2:B6)",
        "requiredFunction": "MÉDIA",
        "expectedReferences": [
          "B2:B6"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 20,
        "B3": 30,
        "B4": 20,
        "B5": 40,
        "B6": 40
      },
      "expectedRecalculations": {
        "B7": 30
      }
    }
  },
  {
    "id": 6,
    "world": 2,
    "worldName": "Copa Escolar de E-Sports",
    "title": "Recorde Máximo e Menor Ping (MÁXIMO e MÍNIMO)",
    "scenario": "Precisamos descobrir o pico máximo de pontuação e o menor ping (latência) dos servidores.",
    "clientName": "Capitã Clara \"Valkíria\"",
    "clientRole": "Líder do Time Alfa de E-Sports",
    "clientAvatar": "🏆",
    "briefing": "Duas funções estatísticas essenciais: =MÁXIMO encontra o maior valor numérico de uma coluna, e =MÍNIMO encontra o menor. Preencha B7 com o maior score e C7 com o menor ping!",
    "tipTitle": "=MÁXIMO e =MÍNIMO",
    "tipContent": "Na célula B7 digite =MÁXIMO(B2:B6). Na célula C7 digite =MÍNIMO(C2:C6).",
    "cheatSheetFormula": "=MÁXIMO(B2:B6)  e  =MÍNIMO(C2:C6)",
    "numColumns": 4,
    "numRows": 8,
    "initialGrid": {
      "A1": {
        "raw": "Servidor",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Score",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "C1": {
        "raw": "Ping (ms)",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "A2": {
        "raw": "São Paulo",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 850,
        "display": 850,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C2": {
        "raw": 12,
        "display": 12,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "Santiago",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 720,
        "display": 720,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C3": {
        "raw": 45,
        "display": 45,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "Miami",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": 980,
        "display": 980,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C4": {
        "raw": 110,
        "display": 110,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A5": {
        "raw": "Bogotá",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": 610,
        "display": 610,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C5": {
        "raw": 65,
        "display": 65,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A6": {
        "raw": "Curitiba",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B6": {
        "raw": 920,
        "display": 920,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C6": {
        "raw": 8,
        "display": 8,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A7": {
        "raw": "Destaques",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "purple"
      },
      "B7": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      },
      "C7": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B7",
        "label": "Maior Pontuação (Recorde)",
        "hint": "Encontre o maior score: =MÁXIMO(B2:B6)",
        "explanation": "O maior score do servidor foi 980 em Miami.",
        "expectedValue": 980,
        "solutionFormula": "=MÁXIMO(B2:B6)",
        "requiredFunction": "MÁXIMO",
        "expectedReferences": [
          "B2:B6"
        ]
      },
      {
        "coord": "C7",
        "label": "Menor Ping (Mais Rápido)",
        "hint": "Encontre a menor latência: =MÍNIMO(C2:C6)",
        "explanation": "O menor ping foi 8ms em Curitiba.",
        "expectedValue": 8,
        "solutionFormula": "=MÍNIMO(C2:C6)",
        "requiredFunction": "MÍNIMO",
        "expectedReferences": [
          "C2:C6"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B4": 1200,
        "C6": 15,
        "C2": 5
      },
      "expectedRecalculations": {
        "B7": 1200,
        "C7": 5
      }
    }
  },
  {
    "id": 7,
    "world": 3,
    "worldName": "Canal de Streaming & Criadores",
    "title": "CONT.VALORES vs CONT.NÚM",
    "scenario": "Auditoria do canal de gameplay: quantos vídeos foram gravados e quantos já tiveram visualizações numéricas registradas?",
    "clientName": "Gabi \"StreamStar\"",
    "clientRole": "Criadora de Conteúdo e Host",
    "clientAvatar": "🎥",
    "briefing": "Atenção à diferença crucial: =CONT.VALORES conta qualquer célula preenchida (texto ou número). Já =CONT.NÚM conta EXCLUSIVAMENTE células que contêm números! Na célula B7, conte os títulos de vídeos existentes na coluna A. Na célula B8, conte quantos vídeos já possuem número de visualizações na coluna B.",
    "tipTitle": "Contagem de Texto vs Números",
    "tipContent": "Em B7 use =CONT.VALORES(A2:A6). Em B8 use =CONT.NÚM(B2:B6). Note que células com \"Pendente\" não são números!",
    "cheatSheetFormula": "=CONT.VALORES(A2:A6)  e  =CONT.NÚM(B2:B6)",
    "numColumns": 3,
    "numRows": 9,
    "initialGrid": {
      "A1": {
        "raw": "Título do Vídeo",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Visualizações",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "A2": {
        "raw": "Speedrun Ep. 1",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 14500,
        "display": 14500,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "Review Teclado",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": "Em Breve",
        "display": "Em Breve",
        "format": "text",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "Torneio Final",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": 28900,
        "display": 28900,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A5": {
        "raw": "Setup Tour 2026",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": 42100,
        "display": 42100,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A6": {
        "raw": "Dicas de FPS",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B6": {
        "raw": "Pendente",
        "display": "Pendente",
        "format": "text",
        "align": "right",
        "readOnly": true
      },
      "A7": {
        "raw": "Total de Vídeos Listados",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "sky"
      },
      "B7": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      },
      "A8": {
        "raw": "Vídeos com Dados Numéricos",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "emerald"
      },
      "B8": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B7",
        "label": "Total de Vídeos (Textos)",
        "hint": "Conte células preenchidas: =CONT.VALORES(A2:A6)",
        "explanation": "Há 5 títulos de vídeos na coluna A.",
        "expectedValue": 5,
        "solutionFormula": "=CONT.VALORES(A2:A6)",
        "requiredFunction": "CONT.VALORES",
        "expectedReferences": [
          "A2:A6"
        ]
      },
      {
        "coord": "B8",
        "label": "Vídeos com Views (Apenas Números)",
        "hint": "Conte apenas células com números: =CONT.NÚM(B2:B6)",
        "explanation": "Apenas 3 vídeos possuem visualizações numéricas (os outros são textos de status).",
        "expectedValue": 3,
        "solutionFormula": "=CONT.NÚM(B2:B6)",
        "requiredFunction": "CONT.NÚM",
        "expectedReferences": [
          "B2:B6"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B3": 10000
      },
      "expectedRecalculations": {
        "B7": 5,
        "B8": 4
      }
    }
  },
  {
    "id": 8,
    "world": 3,
    "worldName": "Canal de Streaming & Criadores",
    "title": "Contagem Condicional de Texto (=CONT.SE)",
    "scenario": "O patrocinador quer saber quantos vídeos atingiram o status de \"Viral\" no último mês.",
    "clientName": "Gabi \"StreamStar\"",
    "clientRole": "Criadora de Conteúdo e Host",
    "clientAvatar": "🎥",
    "briefing": "A função =CONT.SE conta células que cumprem um critério específico! Ela recebe dois argumentos separados por ponto-e-vírgula (;): o intervalo e o texto a procurar entre aspas. Na célula B8, conte quantos vídeos estão com status \"Viral\" na coluna C.",
    "tipTitle": "Sintaxe do =CONT.SE(intervalo; \"critério\")",
    "tipContent": "Digite =CONT.SE(C2:C7; \"Viral\"). Não esqueça das aspas ao redor da palavra Viral e do ponto-e-vírgula!",
    "cheatSheetFormula": "=CONT.SE(C2:C7; \"Viral\")",
    "numColumns": 4,
    "numRows": 9,
    "initialGrid": {
      "A1": {
        "raw": "Vídeo",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Views",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "C1": {
        "raw": "Classificação",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A2": {
        "raw": "Vídeo 1",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 12000,
        "display": 12000,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C2": {
        "raw": "Regular",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A3": {
        "raw": "Vídeo 2",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 85000,
        "display": 85000,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C3": {
        "raw": "Viral",
        "align": "center",
        "format": "text",
        "readOnly": true,
        "badgeColor": "purple"
      },
      "A4": {
        "raw": "Vídeo 3",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": 9500,
        "display": 9500,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C4": {
        "raw": "Regular",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A5": {
        "raw": "Vídeo 4",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": 104000,
        "display": 104000,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C5": {
        "raw": "Viral",
        "align": "center",
        "format": "text",
        "readOnly": true,
        "badgeColor": "purple"
      },
      "A6": {
        "raw": "Vídeo 5",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B6": {
        "raw": 62000,
        "display": 62000,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C6": {
        "raw": "Viral",
        "align": "center",
        "format": "text",
        "readOnly": true,
        "badgeColor": "purple"
      },
      "A7": {
        "raw": "Vídeo 6",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B7": {
        "raw": 15000,
        "display": 15000,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C7": {
        "raw": "Regular",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A8": {
        "raw": "Qtd de Vídeos Virais",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "purple"
      },
      "B8": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B8",
        "label": "Quantidade de Virais",
        "hint": "Use =CONT.SE(C2:C7; \"Viral\")",
        "explanation": "Há 3 vídeos marcados como Viral na lista.",
        "expectedValue": 3,
        "solutionFormula": "=CONT.SE(C2:C7; \"Viral\")",
        "requiredFunction": "CONT.SE",
        "expectedReferences": [
          "C2:C7"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "C2": "Viral"
      },
      "expectedRecalculations": {
        "B8": 4
      }
    }
  },
  {
    "id": 9,
    "world": 3,
    "worldName": "Canal de Streaming & Criadores",
    "title": "Critérios Numéricos no =CONT.SE",
    "scenario": "Queremos contabilizar quantos inscritos novos entraram com meta igual ou superior a 500 em um dia.",
    "clientName": "Gabi \"StreamStar\"",
    "clientRole": "Criadora de Conteúdo e Host",
    "clientAvatar": "🎥",
    "briefing": "O =CONT.SE também aceita operadores de comparação entre aspas, como \">=500\", \"<100\" ou \"<>0\". Na célula B8, conte quantos dias bateram a meta de pelo menos 500 novos inscritos (>=500).",
    "tipTitle": "Critérios de Comparação no CONT.SE",
    "tipContent": "Digite =CONT.SE(B2:B7; \">=500\"). O operador de maior ou igual (>=) fica dentro das aspas junto com o número!",
    "cheatSheetFormula": "=CONT.SE(B2:B7; \">=500\")",
    "numColumns": 3,
    "numRows": 9,
    "initialGrid": {
      "A1": {
        "raw": "Dia da Semana",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Novos Inscritos",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "A2": {
        "raw": "Segunda",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 620,
        "display": 620,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "Terça",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 410,
        "display": 410,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "Quarta",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": 780,
        "display": 780,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A5": {
        "raw": "Quinta",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": 500,
        "display": 500,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A6": {
        "raw": "Sexta",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B6": {
        "raw": 950,
        "display": 950,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A7": {
        "raw": "Sábado",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B7": {
        "raw": 320,
        "display": 320,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A8": {
        "raw": "Dias na Meta (>=500)",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "emerald"
      },
      "B8": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B8",
        "label": "Dias com >= 500 Inscritos",
        "hint": "Use =CONT.SE(B2:B7; \">=500\")",
        "explanation": "Segunda (620), Quarta (780), Quinta (500) e Sexta (950) = 4 dias na meta.",
        "expectedValue": 4,
        "solutionFormula": "=CONT.SE(B2:B7; \">=500\")",
        "requiredFunction": "CONT.SE",
        "expectedReferences": [
          "B2:B7"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B3": 550,
        "B7": 600
      },
      "expectedRecalculations": {
        "B8": 6
      }
    }
  },
  {
    "id": 10,
    "world": 4,
    "worldName": "Estação Orbital & Missão Marte",
    "title": "A Condicional =SE Simples",
    "scenario": "Telemetria do Módulo de Suporte de Vida: alertar se o oxigênio está Estável ou Crítico.",
    "clientName": "Comandante Yuri",
    "clientRole": "Oficial de Voo da Estação Orbital",
    "clientAvatar": "🚀",
    "briefing": "A função =SE toma decisões automáticas! A sintaxe oficial é: =SE(teste; \"se_verdadeiro\"; \"se_falso\"). Se a porcentagem de O2 na célula B2 for maior ou igual a 80 (>=80), exiba \"Estável\", senão exiba \"Crítico\". Faça o mesmo em C3 para o Módulo 2!",
    "tipTitle": "Sintaxe da Função =SE",
    "tipContent": "Na célula C2 digite =SE(B2>=80; \"Estável\"; \"Crítico\"). Use ponto-e-vírgula para separar as três partes!",
    "cheatSheetFormula": "=SE(B2>=80; \"Estável\"; \"Crítico\")",
    "numColumns": 4,
    "numRows": 4,
    "initialGrid": {
      "A1": {
        "raw": "Módulo",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Nível O2 (%)",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "C1": {
        "raw": "Diagnóstico",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A2": {
        "raw": "Módulo Alpha",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 85,
        "display": 85,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C2": {
        "raw": "",
        "format": "text",
        "align": "center",
        "isTarget": true
      },
      "A3": {
        "raw": "Módulo Beta",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 64,
        "display": 64,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C3": {
        "raw": "",
        "format": "text",
        "align": "center",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "C2",
        "label": "Status Módulo Alpha",
        "hint": "=SE(B2>=80; \"Estável\"; \"Crítico\")",
        "explanation": "85 >= 80 é verdadeiro, logo o resultado é Estável.",
        "expectedValue": "Estável",
        "solutionFormula": "=SE(B2>=80; \"Estável\"; \"Crítico\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B2"
        ]
      },
      {
        "coord": "C3",
        "label": "Status Módulo Beta",
        "hint": "=SE(B3>=80; \"Estável\"; \"Crítico\")",
        "explanation": "64 >= 80 é falso, logo o resultado é Crítico.",
        "expectedValue": "Crítico",
        "solutionFormula": "=SE(B3>=80; \"Estável\"; \"Crítico\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B3"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 70,
        "B3": 95
      },
      "expectedRecalculations": {
        "C2": "Crítico",
        "C3": "Estável"
      }
    }
  },
  {
    "id": 11,
    "world": 4,
    "worldName": "Estação Orbital & Missão Marte",
    "title": "Comparando Duas Células com =SE",
    "scenario": "Comparar o consumo de energia atual com o limite seguro de reserva.",
    "clientName": "Comandante Yuri",
    "clientRole": "Oficial de Voo da Estação Orbital",
    "clientAvatar": "🚀",
    "briefing": "O teste lógico pode comparar duas células diretamente (ex: B2>C2). Na célula D2, se o Consumo (B2) for maior que o Limite (C2), emita \"Sobrecarga\", senão exiba \"Normal\".",
    "tipTitle": "Comparando Célula com Célula",
    "tipContent": "Digite =SE(B2>C2; \"Sobrecarga\"; \"Normal\"). Se o consumo ultrapassar o limite, a planilha avisa imediatamente!",
    "cheatSheetFormula": "=SE(B2>C2; \"Sobrecarga\"; \"Normal\")",
    "numColumns": 5,
    "numRows": 4,
    "initialGrid": {
      "A1": {
        "raw": "Setor",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Consumo (kW)",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "C1": {
        "raw": "Limite (kW)",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "D1": {
        "raw": "Alerta",
        "align": "center",
        "format": "text",
        "readOnly": true,
        "badgeColor": "rose"
      },
      "A2": {
        "raw": "Propulsão Iônica",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 450,
        "display": 450,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C2": {
        "raw": 400,
        "display": 400,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "D2": {
        "raw": "",
        "format": "text",
        "align": "center",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "D2",
        "label": "Alerta de Energia",
        "hint": "=SE(B2>C2; \"Sobrecarga\"; \"Normal\")",
        "explanation": "450 > 400 é verdadeiro, emitindo alerta de Sobrecarga.",
        "expectedValue": "Sobrecarga",
        "solutionFormula": "=SE(B2>C2; \"Sobrecarga\"; \"Normal\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B2",
          "C2"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 350,
        "C2": 400
      },
      "expectedRecalculations": {
        "D2": "Normal"
      }
    }
  },
  {
    "id": 12,
    "world": 4,
    "worldName": "Estação Orbital & Missão Marte",
    "title": "Funções Aninhadas: =SE com =MÉDIA",
    "scenario": "Aprovação final do teste de simulação dos astronautas com média de 3 simuladores.",
    "clientName": "Comandante Yuri",
    "clientRole": "Oficial de Voo da Estação Orbital",
    "clientAvatar": "🚀",
    "briefing": "Poder supremo das planilhas: você pode colocar uma função dentro de outra! Na célula E2, se a MÉDIA das notas de B2 até D2 for maior ou igual a 70, aprove o astronauta com \"Aprovado\", senão exiba \"Treinar\".",
    "tipTitle": "Aninhando =SE com =MÉDIA",
    "tipContent": "Digite =SE(MÉDIA(B2:D2)>=70; \"Aprovado\"; \"Treinar\"). Lembre-se de fechar os parênteses da MÉDIA antes do >=70!",
    "cheatSheetFormula": "=SE(MÉDIA(B2:D2)>=70; \"Aprovado\"; \"Treinar\")",
    "numColumns": 6,
    "numRows": 4,
    "initialGrid": {
      "A1": {
        "raw": "Astronauta",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Sim. 1",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "C1": {
        "raw": "Sim. 2",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "D1": {
        "raw": "Sim. 3",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "E1": {
        "raw": "Resultado",
        "align": "center",
        "format": "text",
        "readOnly": true,
        "badgeColor": "emerald"
      },
      "A2": {
        "raw": "Cadete Alex",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 75,
        "display": 75,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C2": {
        "raw": 80,
        "display": 80,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "D2": {
        "raw": 70,
        "display": 70,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "E2": {
        "raw": "",
        "format": "text",
        "align": "center",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "E2",
        "label": "Aprovação por Média",
        "hint": "=SE(MÉDIA(B2:D2)>=70; \"Aprovado\"; \"Treinar\")",
        "explanation": "A média (75+80+70)/3 = 75 >= 70, resultando em Aprovado.",
        "expectedValue": "Aprovado",
        "solutionFormula": "=SE(MÉDIA(B2:D2)>=70; \"Aprovado\"; \"Treinar\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B2:D2"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 50,
        "C2": 60,
        "D2": 55
      },
      "expectedRecalculations": {
        "E2": "Treinar"
      }
    }
  },
  {
    "id": 13,
    "world": 5,
    "worldName": "Festival de Música & Bilheteria",
    "title": "A Função =SOMASE",
    "scenario": "O festival vendeu ingressos de Pista e VIP. Precisamos calcular o faturamento exclusivo do setor VIP.",
    "clientName": "DJ Maya",
    "clientRole": "Produtora Executiva do Festival Neon Beats",
    "clientAvatar": "🎸",
    "briefing": "A função =SOMASE soma apenas as linhas que atendem a um critério! Sintaxe: =SOMASE(coluna_critério; \"critério\"; coluna_dos_valores). Na célula B8, some apenas os valores dos ingressos com tipo \"VIP\".",
    "tipTitle": "Sintaxe do =SOMASE",
    "tipContent": "Digite =SOMASE(B2:B6; \"VIP\"; C2:C6). A planilha analisa cada linha de B2:B6 e, quando for \"VIP\", soma o respectivo valor em C2:C6!",
    "cheatSheetFormula": "=SOMASE(B2:B6; \"VIP\"; C2:C6)",
    "numColumns": 4,
    "numRows": 9,
    "initialGrid": {
      "A1": {
        "raw": "Ingresso",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Tipo",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C1": {
        "raw": "Valor (R$)",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "A2": {
        "raw": "Lote 01",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": "Pista",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C2": {
        "raw": 150,
        "display": 150,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "Lote 02",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": "VIP",
        "align": "center",
        "format": "text",
        "readOnly": true,
        "badgeColor": "amber"
      },
      "C3": {
        "raw": 350,
        "display": 350,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "Lote 03",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": "Pista",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C4": {
        "raw": 180,
        "display": 180,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A5": {
        "raw": "Lote 04",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": "VIP",
        "align": "center",
        "format": "text",
        "readOnly": true,
        "badgeColor": "amber"
      },
      "C5": {
        "raw": 400,
        "display": 400,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A6": {
        "raw": "Lote 05",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B6": {
        "raw": "Pista",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C6": {
        "raw": 200,
        "display": 200,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A8": {
        "raw": "Faturamento VIP",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "amber"
      },
      "B8": {
        "raw": "",
        "format": "currency",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B8",
        "label": "Total Faturamento VIP",
        "hint": "=SOMASE(B2:B6; \"VIP\"; C2:C6)",
        "explanation": "Os dois lotes VIP somam 350 + 400 = R$ 750.",
        "expectedValue": 750,
        "solutionFormula": "=SOMASE(B2:B6; \"VIP\"; C2:C6)",
        "requiredFunction": "SOMASE",
        "expectedReferences": [
          "B2:B6",
          "C2:C6"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "C3": 500
      },
      "expectedRecalculations": {
        "B8": 900
      }
    }
  },
  {
    "id": 14,
    "world": 5,
    "worldName": "Festival de Música & Bilheteria",
    "title": "SOMASE com Critério Numérico",
    "scenario": "Identificar o faturamento de todos os pedidos corporativos que custaram mais de R$ 300.",
    "clientName": "DJ Maya",
    "clientRole": "Produtora Executiva do Festival Neon Beats",
    "clientAvatar": "🎸",
    "briefing": "Quando o intervalo de critério é o mesmo intervalo da soma, o terceiro argumento é opcional! Na célula B7, use =SOMASE para somar apenas os valores maiores que 300 (>300).",
    "tipTitle": "SOMASE de Valores Maiores Que",
    "tipContent": "Digite =SOMASE(B2:B5; \">300\"). A função somará apenas os pedidos acima de 300.",
    "cheatSheetFormula": "=SOMASE(B2:B5; \">300\")",
    "numColumns": 3,
    "numRows": 8,
    "initialGrid": {
      "A1": {
        "raw": "Pedido",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Valor Pedido (R$)",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "A2": {
        "raw": "Pedido #101",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 150,
        "display": 150,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "Pedido #102",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 450,
        "display": 450,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "Pedido #103",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": 200,
        "display": 200,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A5": {
        "raw": "Pedido #104",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": 600,
        "display": 600,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A7": {
        "raw": "Soma Pedidos > 300",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "emerald"
      },
      "B7": {
        "raw": "",
        "format": "currency",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B7",
        "label": "Soma dos Pedidos Altos",
        "hint": "=SOMASE(B2:B5; \">300\")",
        "explanation": "450 + 600 = R$ 1.050.",
        "expectedValue": 1050,
        "solutionFormula": "=SOMASE(B2:B5; \">300\")",
        "requiredFunction": "SOMASE",
        "expectedReferences": [
          "B2:B5"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 400
      },
      "expectedRecalculations": {
        "B7": 1450
      }
    }
  },
  {
    "id": 15,
    "world": 5,
    "worldName": "Festival de Música & Bilheteria",
    "title": "Referência Absoluta e o Cifrão ($)",
    "scenario": "Calcular a taxa fixa de conveniência da bilheteria travando a célula da alíquota com $!",
    "clientName": "DJ Maya",
    "clientRole": "Produtora Executiva do Festival Neon Beats",
    "clientAvatar": "🎸",
    "briefing": "Ao copiar ou arrastar fórmulas no Google Planilhas, as células se movem. Para \"travar\" uma célula fixa (como a taxa em E2), usamos o cifrão: $E$2! Na célula C2, multiplique o Ingresso (B2) pela taxa fixa travada em $E$2.",
    "tipTitle": "O Cifrão ($) Trava a Coordenada",
    "tipContent": "Digite =B2*$E$2 na célula C2. Assim, B2 varia conforme a linha, mas $E$2 fica sempre congelada!",
    "cheatSheetFormula": "=B2*$E$2",
    "numColumns": 6,
    "numRows": 4,
    "initialGrid": {
      "A1": {
        "raw": "Ingresso",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Preço Base",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "C1": {
        "raw": "Valor Taxa",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "D1": {
        "raw": "",
        "format": "text",
        "readOnly": true
      },
      "E1": {
        "raw": "Alíquota Fixa",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A2": {
        "raw": "Pista Lote 1",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 200,
        "display": 200,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "C2": {
        "raw": "",
        "format": "currency",
        "align": "right",
        "isTarget": true
      },
      "D2": {
        "raw": "",
        "format": "text",
        "readOnly": true
      },
      "E2": {
        "raw": 0.1,
        "display": 0.1,
        "format": "percent",
        "align": "center",
        "readOnly": true,
        "badgeColor": "amber"
      }
    },
    "targets": [
      {
        "coord": "C2",
        "label": "Cálculo com Taxa Travada",
        "hint": "=B2*$E$2 (trave E2 com cifrões)",
        "explanation": "R$ 200 * 10% = R$ 20.",
        "expectedValue": 20,
        "solutionFormula": "=B2*$E$2",
        "expectedReferences": [
          "B2",
          "$E$2"
        ],
        "allowArithmetic": true
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 300
      },
      "expectedRecalculations": {
        "C2": 30
      }
    }
  },
  {
    "id": 16,
    "world": 6,
    "worldName": "Marketplace de Skins & Dados",
    "title": "A Lenda do =PROCV (Busca Vertical)",
    "scenario": "Busque automaticamente o nome da skin no inventário a partir do seu código ID!",
    "clientName": "Dra. Beatriz Santos",
    "clientRole": "Cientista-Chefe de Dados",
    "clientAvatar": "💎",
    "briefing": "O PROCV é a função mais requisitada no mercado de trabalho! Sintaxe: =PROCV(chave_pesquisa; tabela; coluna_retorno; FALSO). Na célula F2, busque o Nome da Skin correspondente ao ID informado em E2 na tabela A2:C6, retornando a coluna 2!",
    "tipTitle": "Sintaxe do =PROCV",
    "tipContent": "Digite =PROCV(E2; A2:C6; 2; FALSO). O 2 indica que queremos o Nome (2ª coluna da tabela) e FALSO garante busca exata!",
    "cheatSheetFormula": "=PROCV(E2; A2:C6; 2; FALSO)",
    "numColumns": 7,
    "numRows": 8,
    "initialGrid": {
      "A1": {
        "raw": "ID",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Nome da Skin",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C1": {
        "raw": "Raridade",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "D1": {
        "raw": "",
        "format": "text",
        "readOnly": true
      },
      "E1": {
        "raw": "ID Consulta",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "F1": {
        "raw": "Skin Encontrada",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "purple"
      },
      "A2": {
        "raw": 101,
        "display": 101,
        "format": "number",
        "align": "center",
        "readOnly": true
      },
      "B2": {
        "raw": "Dragonfire Vandal",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C2": {
        "raw": "Lendária",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A3": {
        "raw": 102,
        "display": 102,
        "format": "number",
        "align": "center",
        "readOnly": true
      },
      "B3": {
        "raw": "Cyberpunk Blade",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C3": {
        "raw": "Épica",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A4": {
        "raw": 103,
        "display": 103,
        "format": "number",
        "align": "center",
        "readOnly": true
      },
      "B4": {
        "raw": "Nebula Operator",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C4": {
        "raw": "Mítica",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A5": {
        "raw": 104,
        "display": 104,
        "format": "number",
        "align": "center",
        "readOnly": true
      },
      "B5": {
        "raw": "Steampunk Ghost",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C5": {
        "raw": "Rara",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "E2": {
        "raw": 103,
        "display": 103,
        "format": "number",
        "align": "center",
        "readOnly": true
      },
      "F2": {
        "raw": "",
        "format": "text",
        "align": "left",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "F2",
        "label": "Nome da Skin Buscada",
        "hint": "=PROCV(E2; A2:C5; 2; FALSO)",
        "explanation": "O ID 103 corresponde à skin Nebula Operator.",
        "expectedValue": "Nebula Operator",
        "solutionFormula": "=PROCV(E2; A2:C5; 2; FALSO)",
        "requiredFunction": "PROCV",
        "expectedReferences": [
          "E2",
          "A2:C5"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "E2": 101
      },
      "expectedRecalculations": {
        "F2": "Dragonfire Vandal"
      }
    }
  },
  {
    "id": 17,
    "world": 6,
    "worldName": "Marketplace de Skins & Dados",
    "title": "PROCV Buscando Preço na Coluna 4",
    "scenario": "Agora consulte o valor em moeda do item buscando a 4ª coluna da tabela.",
    "clientName": "Dra. Beatriz Santos",
    "clientRole": "Cientista-Chefe de Dados",
    "clientAvatar": "💎",
    "briefing": "Basta alterar o número da coluna no PROCV para pegar dados de qualquer campo da tabela! Na célula G2, consulte o Preço em Bytes do ID digitado em F2 buscando na 4ª coluna da tabela A2:D5.",
    "tipTitle": "Índice de Coluna no PROCV",
    "tipContent": "Digite =PROCV(F2; A2:D5; 4; FALSO). Como Preço está na coluna D (4ª coluna da tabela A..D), usamos o índice 4.",
    "cheatSheetFormula": "=PROCV(F2; A2:D5; 4; FALSO)",
    "numColumns": 8,
    "numRows": 7,
    "initialGrid": {
      "A1": {
        "raw": "Cod",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Item",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C1": {
        "raw": "Raridade",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "D1": {
        "raw": "Preço (Bytes)",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "E1": {
        "raw": "",
        "format": "text",
        "readOnly": true
      },
      "F1": {
        "raw": "Buscar Cod",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "G1": {
        "raw": "Preço Encontrado",
        "align": "right",
        "format": "text",
        "readOnly": true,
        "badgeColor": "emerald"
      },
      "A2": {
        "raw": 501,
        "display": 501,
        "format": "number",
        "align": "center",
        "readOnly": true
      },
      "B2": {
        "raw": "Glove Fade",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C2": {
        "raw": "Lendária",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "D2": {
        "raw": 2400,
        "display": 2400,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": 502,
        "display": 502,
        "format": "number",
        "align": "center",
        "readOnly": true
      },
      "B3": {
        "raw": "Karambit Doppler",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C3": {
        "raw": "Mítica",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "D3": {
        "raw": 4800,
        "display": 4800,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": 503,
        "display": 503,
        "format": "number",
        "align": "center",
        "readOnly": true
      },
      "B4": {
        "raw": "AK-47 Asiimov",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C4": {
        "raw": "Épica",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "D4": {
        "raw": 1600,
        "display": 1600,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "F2": {
        "raw": 502,
        "display": 502,
        "format": "number",
        "align": "center",
        "readOnly": true
      },
      "G2": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "G2",
        "label": "Preço do Item Buscado",
        "hint": "=PROCV(F2; A2:D4; 4; FALSO)",
        "explanation": "O item 502 custa 4800 Bytes.",
        "expectedValue": 4800,
        "solutionFormula": "=PROCV(F2; A2:D4; 4; FALSO)",
        "requiredFunction": "PROCV",
        "expectedReferences": [
          "F2",
          "A2:D4"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "F2": 503
      },
      "expectedRecalculations": {
        "G2": 1600
      }
    }
  },
  {
    "id": 18,
    "world": 6,
    "worldName": "Marketplace de Skins & Dados",
    "title": "O Grande Dashboard Executivo (Desafio Mestre)",
    "scenario": "Missão Final: consolide um dashboard executivo completo combinando SOMA, MÉDIA e SE!",
    "clientName": "Dra. Beatriz Santos",
    "clientRole": "Cientista-Chefe de Dados",
    "clientAvatar": "👑",
    "briefing": "Parabéns por chegar ao teste final! Preencha as três métricas do Dashboard Executivo da Startup: em B6 calcule o Faturamento Total com =SOMA; em B7 calcule o Ticket Médio com =MÉDIA; e em B8 use =SE para exibir \"Meta Atingida\" se o total for maior ou igual a 5000 (B6>=5000), senão exiba \"Revisar Estratégia\".",
    "tipTitle": "A Tríade de Ouro das Planilhas",
    "tipContent": "B6: =SOMA(B2:B5) | B7: =MÉDIA(B2:B5) | B8: =SE(B6>=5000; \"Meta Atingida\"; \"Revisar Estratégia\")",
    "cheatSheetFormula": "=SOMA(B2:B5) | =MÉDIA(B2:B5) | =SE(B6>=5000; \"Meta Atingida\"; \"Revisar Estratégia\")",
    "numColumns": 3,
    "numRows": 10,
    "initialGrid": {
      "A1": {
        "raw": "Trimestre",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Receita (R$)",
        "align": "right",
        "format": "text",
        "readOnly": true
      },
      "A2": {
        "raw": "1º Trimestre",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 1400,
        "display": 1400,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "2º Trimestre",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 1800,
        "display": 1800,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "3º Trimestre",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": 1200,
        "display": 1200,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A5": {
        "raw": "4º Trimestre",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": 1600,
        "display": 1600,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A6": {
        "raw": "Receita Total",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "emerald"
      },
      "B6": {
        "raw": "",
        "format": "currency",
        "align": "right",
        "isTarget": true
      },
      "A7": {
        "raw": "Média Trimestral",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "sky"
      },
      "B7": {
        "raw": "",
        "format": "currency",
        "align": "right",
        "isTarget": true
      },
      "A8": {
        "raw": "Status Executivo",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "purple"
      },
      "B8": {
        "raw": "",
        "format": "text",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B6",
        "label": "Receita Total Anual",
        "hint": "=SOMA(B2:B5)",
        "explanation": "1400 + 1800 + 1200 + 1600 = R$ 6.000.",
        "expectedValue": 6000,
        "solutionFormula": "=SOMA(B2:B5)",
        "requiredFunction": "SOMA",
        "expectedReferences": [
          "B2:B5"
        ]
      },
      {
        "coord": "B7",
        "label": "Média Trimestral",
        "hint": "=MÉDIA(B2:B5)",
        "explanation": "R$ 6.000 / 4 trimestres = R$ 1.500.",
        "expectedValue": 1500,
        "solutionFormula": "=MÉDIA(B2:B5)",
        "requiredFunction": "MÉDIA",
        "expectedReferences": [
          "B2:B5"
        ]
      },
      {
        "coord": "B8",
        "label": "Status da Meta Anual",
        "hint": "=SE(B6>=5000; \"Meta Atingida\"; \"Revisar Estratégia\")",
        "explanation": "6000 >= 5000 é verdadeiro -> \"Meta Atingida\".",
        "expectedValue": "Meta Atingida",
        "solutionFormula": "=SE(B6>=5000; \"Meta Atingida\"; \"Revisar Estratégia\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B6"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 1000,
        "B3": 1000,
        "B4": 1000,
        "B5": 1000,
        "B6": 4000
      },
      "expectedRecalculations": {
        "B6": 4000,
        "B7": 1000,
        "B8": "Revisar Estratégia"
      }
    }
  }
];
