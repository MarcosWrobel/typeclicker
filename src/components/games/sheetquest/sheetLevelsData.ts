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
    "briefing": "O PROCV é uma das funções mais valiosas do mercado para cruzamento de dados! Um cliente solicitou uma consulta no terminal: a partir do código ID informado em nosso sistema, localize o Nome da Skin correspondente no inventário. Analise a tabela e realize a busca exata!",
    "tipTitle": "Cruzamento de Dados com Busca",
    "tipContent": "Identifique o código a pesquisar, o intervalo da tabela de dados e o índice da coluna que contém o nome desejado.",
    "cheatSheetFormula": "",
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
        "hint": "Consulte o ID do cliente e recupere o nome da skin no inventário.",
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
    "briefing": "A equipe de vendas precisa automatizar a emissão do valor de cada skin. Localize o Preço em Bytes do item consultado buscando no catálogo geral da loja. Conte atentamente as colunas do intervalo para extrair o valor correto!",
    "tipTitle": "Índice de Coluna na Tabela",
    "tipContent": "A primeira coluna do intervalo é o índice 1. Avance até a coluna onde o preço está registrado.",
    "cheatSheetFormula": "",
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
        "hint": "Recupere o preço do item pesquisado consultando a base da loja.",
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
    "briefing": "Bem-vindo ao grande teste do Dashboard Executivo da Startup! A diretoria solicitou três indicadores vitais: o Faturamento Anual Total, o Ticket Médio por Trimestre e o Status da Meta (se a receita anual for de pelo menos R$ 5.000, indique 'Meta Atingida'; caso contrário, 'Revisar Estratégia'). Analise a planilha e entregue os resultados!",
    "tipTitle": "Visão Geral de Dashboard",
    "tipContent": "Combine totalização, média aritmética e uma condicional de negócio para avaliar o desempenho da empresa.",
    "cheatSheetFormula": "",
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
        "hint": "Calcule o faturamento total acumulado no ano.",
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
        "hint": "Calcule a média de receita por trimestre.",
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
        "hint": "Avalie se a receita anual atingiu a meta mínima de 5000.",
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
  },
  {
    "id": 19,
    "world": 7,
    "worldName": "Fábrica de Robótica & Automação",
    "title": "Eficiência de Produção & Peças Válidas",
    "scenario": "Auditar a produtividade dos braços robóticos descontando as peças defeituosas.",
    "clientName": "Eng. Théo Meireles",
    "clientRole": "Supervisor de Automação Fabril",
    "clientAvatar": "🤖",
    "briefing": "Bem-vindo à planta automatizada da ByteCorp! Na linha de montagem, cada robô produz centenas de componentes por turno, mas alguns sofrem microfalhas. Calcule a quantidade de peças válidas nas esteiras da célula A e B subtraindo as defeituosas do total produzido.",
    "tipTitle": "Subtração Direta entre Células",
    "tipContent": "Localize a coluna de produção bruta e subtraia a coluna de peças defeituosas.",
    "cheatSheetFormula": "",
    "numColumns": 4,
    "numRows": 5,
    "initialGrid": {
      "A1": {
        "raw": "Linha",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Produção Bruta",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "C1": {
        "raw": "Defeituosas",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "D1": {
        "raw": "Peças Aprovadas",
        "align": "right",
        "format": "number",
        "readOnly": true,
        "badgeColor": "emerald"
      },
      "A2": {
        "raw": "Esteira Alpha",
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
        "raw": 25,
        "display": 25,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "D2": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      },
      "A3": {
        "raw": "Esteira Beta",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 600,
        "display": 600,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C3": {
        "raw": 40,
        "display": 40,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "D3": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "D2",
        "label": "Aprovadas Linha Alpha",
        "hint": "Calcule a quantidade de peças aprovadas na Linha Alpha.",
        "explanation": "450 produzidas menos 25 com defeito = 425 peças válidas.",
        "expectedValue": 425,
        "solutionFormula": "=B2-C2",
        "expectedReferences": [
          "B2",
          "C2"
        ],
        "allowArithmetic": true
      },
      {
        "coord": "D3",
        "label": "Aprovadas Linha Beta",
        "hint": "Calcule a quantidade de peças aprovadas na Linha Beta.",
        "explanation": "600 produzidas menos 40 com defeito = 560 peças válidas.",
        "expectedValue": 560,
        "solutionFormula": "=B3-C3",
        "expectedReferences": [
          "B3",
          "C3"
        ],
        "allowArithmetic": true
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 500,
        "C2": 50,
        "B3": 700,
        "C3": 100
      },
      "expectedRecalculations": {
        "D2": 450,
        "D3": 600
      }
    }
  },
  {
    "id": 20,
    "world": 7,
    "worldName": "Fábrica de Robótica & Automação",
    "title": "Alerta Térmico com Decisão Lógica",
    "scenario": "Monitorar telemetria de temperatura dos motores para prevenir sobreaquecimento.",
    "clientName": "Eng. Théo Meireles",
    "clientRole": "Supervisor de Automação Fabril",
    "clientAvatar": "🤖",
    "briefing": "Os servomotores das esteiras operam sob calor intenso. Se a temperatura registrada for igual ou superior a 85 graus (>=85), o status deve ser 'Superaquecido', caso contrário, deve exibir 'Normal'. Avalie os atuadores M1 e M2.",
    "tipTitle": "Critério de Decisão Condicional",
    "tipContent": "Compare o valor térmico com o patamar de segurança e defina as duas saídas de texto.",
    "cheatSheetFormula": "",
    "numColumns": 3,
    "numRows": 4,
    "initialGrid": {
      "A1": {
        "raw": "Motor",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Temperatura (°C)",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "C1": {
        "raw": "Diagnóstico",
        "align": "center",
        "format": "text",
        "readOnly": true,
        "badgeColor": "purple"
      },
      "A2": {
        "raw": "Motor Primário (M1)",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 89,
        "display": 89,
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
        "raw": "Motor Secundário (M2)",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 74,
        "display": 74,
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
        "label": "Status Térmico Motor 1",
        "hint": "Gere o diagnóstico de segurança térmica para o Motor 1.",
        "explanation": "89 >= 85 é verdadeiro -> 'Superaquecido'.",
        "expectedValue": "Superaquecido",
        "solutionFormula": "=SE(B2>=85; \"Superaquecido\"; \"Normal\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B2"
        ]
      },
      {
        "coord": "C3",
        "label": "Status Térmico Motor 2",
        "hint": "Gere o diagnóstico de segurança térmica para o Motor 2.",
        "explanation": "74 >= 85 é falso -> 'Normal'.",
        "expectedValue": "Normal",
        "solutionFormula": "=SE(B3>=85; \"Superaquecido\"; \"Normal\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B3"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 80,
        "B3": 95
      },
      "expectedRecalculations": {
        "C2": "Normal",
        "C3": "Superaquecido"
      }
    }
  },
  {
    "id": 21,
    "world": 7,
    "worldName": "Fábrica de Robótica & Automação",
    "title": "Consumo Energético dos Robôs Ativos",
    "scenario": "Totalizar a energia consumida exclusivamente pelas máquinas que estão operando.",
    "clientName": "Eng. Théo Meireles",
    "clientRole": "Supervisor de Automação Fabril",
    "clientAvatar": "🤖",
    "briefing": "A fábrica monitora o consumo em quilowatts-hora (kWh) de cada robô industrial. O diretor financeiro precisa saber o total de energia gasto apenas pelas unidades com status 'Ativo', ignorando as em manutenção.",
    "tipTitle": "Soma com Filtro por Critério",
    "tipContent": "Avalie qual função permite verificar o status dos equipamentos e somar os valores correspondentes de outra coluna.",
    "cheatSheetFormula": "",
    "numColumns": 3,
    "numRows": 7,
    "initialGrid": {
      "A1": {
        "raw": "Robô",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Status",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C1": {
        "raw": "Consumo (kWh)",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "A2": {
        "raw": "Soldador K-1",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": "Ativo",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C2": {
        "raw": 150,
        "display": 150,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "Pintor R-4",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": "Parado",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C3": {
        "raw": 30,
        "display": 30,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "Montador M-8",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": "Ativo",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C4": {
        "raw": 220,
        "display": 220,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A5": {
        "raw": "Empacotador P-2",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": "Ativo",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C5": {
        "raw": 180,
        "display": 180,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A6": {
        "raw": "Energia Robôs Ativos",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "amber"
      },
      "B6": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B6",
        "label": "Consumo Total Robôs Ativos",
        "hint": "Some o consumo energético apenas dos robôs com status 'Ativo'.",
        "explanation": "150 + 220 + 180 = 550 kWh.",
        "expectedValue": 550,
        "solutionFormula": "=SOMASE(B2:B5; \"Ativo\"; C2:C5)",
        "requiredFunction": "SOMASE",
        "expectedReferences": [
          "B2:B5",
          "C2:C5"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "C2": 200,
        "C4": 300
      },
      "expectedRecalculations": {
        "B6": 680
      }
    }
  },
  {
    "id": 22,
    "world": 7,
    "worldName": "Fábrica de Robótica & Automação",
    "title": "Auditoria de Sensores Reprovados",
    "scenario": "Contar quantas peças falharam nos testes de inspeção por visão computacional.",
    "clientName": "Eng. Théo Meireles",
    "clientRole": "Supervisor de Automação Fabril",
    "clientAvatar": "🤖",
    "briefing": "Na estação de qualidade, cada sensor óptico é inspecionado e rotulado como 'Aprovado' ou 'Reprovado'. Calcule na célula B6 a quantidade exata de sensores que foram 'Reprovado'.",
    "tipTitle": "Contagem Baseada em Texto",
    "tipContent": "Selecione o intervalo onde constam os resultados dos testes e defina a condição textual exata.",
    "cheatSheetFormula": "",
    "numColumns": 3,
    "numRows": 7,
    "initialGrid": {
      "A1": {
        "raw": "Sensor ID",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Inspeção",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A2": {
        "raw": "LIDAR-01",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": "Aprovado",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A3": {
        "raw": "LIDAR-02",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": "Reprovado",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A4": {
        "raw": "LIDAR-03",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": "Reprovado",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A5": {
        "raw": "LIDAR-04",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": "Aprovado",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A6": {
        "raw": "Total Reprovados",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "rose"
      },
      "B6": {
        "raw": "",
        "format": "number",
        "align": "center",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B6",
        "label": "Total de Sensores Reprovados",
        "hint": "Conte quantas vezes o status 'Reprovado' aparece na lista.",
        "explanation": "Existem 2 sensores reprovados (LIDAR-02 e LIDAR-03).",
        "expectedValue": 2,
        "solutionFormula": "=CONT.SE(B2:B5; \"Reprovado\")",
        "requiredFunction": "CONT.SE",
        "expectedReferences": [
          "B2:B5"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": "Reprovado"
      },
      "expectedRecalculations": {
        "B6": 3
      }
    }
  },
  {
    "id": 23,
    "world": 8,
    "worldName": "Logística & Frota Interplanetária",
    "title": "Cálculo de Frete & Seguro de Carga",
    "scenario": "Precificar o envio interplanetário multiplicando distância por tarifa e somando seguro.",
    "clientName": "Comandante Drake",
    "clientRole": "Diretor de Operações de Carga",
    "clientAvatar": "🛸",
    "briefing": "A frota calcula o valor do frete multiplicando os milhares de quilômetros pela tarifa unitária e adicionando a taxa fixa de seguro espacial. Calcule o custo total do transporte para a Rota de Marte na célula E2.",
    "tipTitle": "Ordem das Operações Matemáticas",
    "tipContent": "Multiplique a distância pela tarifa e some o valor do seguro fixo.",
    "cheatSheetFormula": "",
    "numColumns": 5,
    "numRows": 4,
    "initialGrid": {
      "A1": {
        "raw": "Destino",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Distância (k km)",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "C1": {
        "raw": "Tarifa / k km",
        "align": "right",
        "format": "currency",
        "readOnly": true
      },
      "D1": {
        "raw": "Seguro Fixo",
        "align": "right",
        "format": "currency",
        "readOnly": true
      },
      "E1": {
        "raw": "Frete Total",
        "align": "right",
        "format": "currency",
        "readOnly": true,
        "badgeColor": "emerald"
      },
      "A2": {
        "raw": "Base Marte Norte",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 120,
        "display": 120,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C2": {
        "raw": 15,
        "display": 15,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "D2": {
        "raw": 200,
        "display": 200,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "E2": {
        "raw": "",
        "format": "currency",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "E2",
        "label": "Frete Total Marte",
        "hint": "Calcule a tarifa multiplicada pela distância e somada ao seguro.",
        "explanation": "120 * 15 + 200 = R$ 2.000.",
        "expectedValue": 2000,
        "solutionFormula": "=B2*C2+D2",
        "expectedReferences": [
          "B2",
          "C2",
          "D2"
        ],
        "allowArithmetic": true
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 100,
        "C2": 20,
        "D2": 300
      },
      "expectedRecalculations": {
        "E2": 2300
      }
    }
  },
  {
    "id": 24,
    "world": 8,
    "worldName": "Logística & Frota Interplanetária",
    "title": "Menor Tempo de Rota com =MÍNIMO",
    "scenario": "Encontrar a rota de navegação mais rápida para entregas prioritárias.",
    "clientName": "Comandante Drake",
    "clientRole": "Diretor de Operações de Carga",
    "clientAvatar": "🛸",
    "briefing": "Em despachos médicos de emergência, cada hora conta! Analise a tabela de tempos de voo mapeados pelos cargueiros e informe na célula B6 qual é o menor tempo de percurso.",
    "tipTitle": "Busca de Valor Extremo Inferior",
    "tipContent": "Selecione todo o intervalo de horas e encontre o menor registro.",
    "cheatSheetFormula": "",
    "numColumns": 3,
    "numRows": 7,
    "initialGrid": {
      "A1": {
        "raw": "Rota Espacial",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Tempo de Voo (h)",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "A2": {
        "raw": "Corredor Lunar",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 48,
        "display": 48,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "Fenda de Júpiter",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 36,
        "display": 36,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "Anel de Saturno",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": 52,
        "display": 52,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A5": {
        "raw": "Órbita Vênus",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": 29,
        "display": 29,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A6": {
        "raw": "Rota Mais Rápida (h)",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "sky"
      },
      "B6": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B6",
        "label": "Menor Tempo de Voo",
        "hint": "Descubra a menor duração em horas entre as rotas disponíveis.",
        "explanation": "O menor tempo entre 48, 36, 52 e 29 é 29 horas.",
        "expectedValue": 29,
        "solutionFormula": "=MÍNIMO(B2:B5)",
        "requiredFunction": "MÍNIMO",
        "expectedReferences": [
          "B2:B5"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B5": 60
      },
      "expectedRecalculations": {
        "B6": 36
      }
    }
  },
  {
    "id": 25,
    "world": 8,
    "worldName": "Logística & Frota Interplanetária",
    "title": "Consulta de Carga com =PROCV",
    "scenario": "Localizar a capacidade em toneladas de uma nave a partir do seu prefixo.",
    "clientName": "Comandante Drake",
    "clientRole": "Diretor de Operações de Carga",
    "clientAvatar": "🛸",
    "briefing": "A equipe da doca recebeu uma solicitação de carregamento para a nave cujo código está na célula E2. Use busca vertical para encontrar a Capacidade em Toneladas dessa nave consultando nossa tabela de frota.",
    "tipTitle": "Identificação da Coluna Alvo",
    "tipContent": "Verifique quantas colunas existem do código até a capacidade na tabela e defina a busca exata.",
    "cheatSheetFormula": "",
    "numColumns": 6,
    "numRows": 6,
    "initialGrid": {
      "A1": {
        "raw": "Prefixo",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Modelo Nave",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C1": {
        "raw": "Capacidade (t)",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "A2": {
        "raw": "NAV-01",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": "Falcão Carga",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C2": {
        "raw": 50,
        "display": 50,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "NAV-02",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": "Titã Pesado",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C3": {
        "raw": 180,
        "display": 180,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "NAV-03",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": "Cometa Express",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C4": {
        "raw": 35,
        "display": 35,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "E1": {
        "raw": "Código Solicitado",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "E2": {
        "raw": "NAV-02",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "F1": {
        "raw": "Capacidade Localizada",
        "align": "right",
        "format": "number",
        "readOnly": true,
        "badgeColor": "purple"
      },
      "F2": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "F2",
        "label": "Capacidade em Toneladas",
        "hint": "Consulte o prefixo informado e recupere a capacidade em toneladas.",
        "explanation": "NAV-02 corresponde à nave Titã Pesado com 180 toneladas de capacidade.",
        "expectedValue": 180,
        "solutionFormula": "=PROCV(E2; A2:C4; 3; FALSO)",
        "requiredFunction": "PROCV",
        "expectedReferences": [
          "E2",
          "A2:C4"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "E2": "NAV-01"
      },
      "expectedRecalculations": {
        "F2": 50
      }
    }
  },
  {
    "id": 26,
    "world": 8,
    "worldName": "Logística & Frota Interplanetária",
    "title": "Bônus de Pontualidade Estrita com =SE",
    "scenario": "Verificar se o piloto cumpriu a viagem sem nenhum minuto de atraso.",
    "clientName": "Comandante Drake",
    "clientRole": "Diretor de Operações de Carga",
    "clientAvatar": "🛸",
    "briefing": "A política da transportadora premia os pilotos que atingiram pontualidade perfeita: se o atraso for igual a 0 (=0), conceda 'Bônus Liberado', caso contrário, exiba 'Sem Bônus'. Avalie os dois capitães.",
    "tipTitle": "Comparação de Igualdade em Decisão",
    "tipContent": "Utilize o operador de igualdade para checar se a célula de atraso é exatamente zero.",
    "cheatSheetFormula": "",
    "numColumns": 3,
    "numRows": 4,
    "initialGrid": {
      "A1": {
        "raw": "Piloto",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Atraso (min)",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "C1": {
        "raw": "Status Bônus",
        "align": "center",
        "format": "text",
        "readOnly": true,
        "badgeColor": "emerald"
      },
      "A2": {
        "raw": "Capitã Sarah",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 0,
        "display": 0,
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
        "raw": "Capitão Leon",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 15,
        "display": 15,
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
        "label": "Bônus Capitã Sarah",
        "hint": "Avalie se Sarah cumpriu pontualidade perfeita (0 min de atraso).",
        "explanation": "0 = 0 é verdadeiro -> 'Bônus Liberado'.",
        "expectedValue": "Bônus Liberado",
        "solutionFormula": "=SE(B2=0; \"Bônus Liberado\"; \"Sem Bônus\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B2"
        ]
      },
      {
        "coord": "C3",
        "label": "Bônus Capitão Leon",
        "hint": "Avalie se Leon cumpriu pontualidade perfeita.",
        "explanation": "15 = 0 é falso -> 'Sem Bônus'.",
        "expectedValue": "Sem Bônus",
        "solutionFormula": "=SE(B3=0; \"Bônus Liberado\"; \"Sem Bônus\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B3"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 10,
        "B3": 0
      },
      "expectedRecalculations": {
        "C2": "Sem Bônus",
        "C3": "Bônus Liberado"
      }
    }
  },
  {
    "id": 27,
    "world": 9,
    "worldName": "Academia de E-Sports & Scouting",
    "title": "Média de Eliminações por Partida",
    "scenario": "Calcular o desempenho médio de abates de uma line-up profissional.",
    "clientName": "Coach Marcus 'Sniper'",
    "clientRole": "Head Coach de FPS",
    "clientAvatar": "🎯",
    "briefing": "Para escalar o quinteto titular no campeonato regional, preciso da média de eliminações dos atletas nos treinos classificatórios. Calcule a média na célula B6 a partir do histórico de partidas.",
    "tipTitle": "Média Aritmética de Desempenho",
    "tipContent": "Selecione o intervalo de pontuações de todos os atletas analisados.",
    "cheatSheetFormula": "",
    "numColumns": 3,
    "numRows": 7,
    "initialGrid": {
      "A1": {
        "raw": "Jogador",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Eliminações",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "A2": {
        "raw": "CyberGhost",
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
        "raw": "Valkyrie",
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
        "raw": "ShadowPulse",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": 16,
        "display": 16,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A5": {
        "raw": "ApexRider",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": 22,
        "display": 22,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A6": {
        "raw": "Média do Time",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "sky"
      },
      "B6": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B6",
        "label": "Média de Eliminações",
        "hint": "Calcule a média aritmética de abates de todos os jogadores.",
        "explanation": "(18 + 24 + 16 + 22) / 4 = 20.",
        "expectedValue": 20,
        "solutionFormula": "=MÉDIA(B2:B5)",
        "requiredFunction": "MÉDIA",
        "expectedReferences": [
          "B2:B5"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 20,
        "B3": 30,
        "B4": 20,
        "B5": 30
      },
      "expectedRecalculations": {
        "B6": 25
      }
    }
  },
  {
    "id": 28,
    "world": 9,
    "worldName": "Academia de E-Sports & Scouting",
    "title": "Maior Taxa de Precisão com =MÁXIMO",
    "scenario": "Encontrar o atleta com a maior taxa de acerto de mira do campeonato.",
    "clientName": "Coach Marcus 'Sniper'",
    "clientRole": "Head Coach de FPS",
    "clientAvatar": "🎯",
    "briefing": "O prêmio de MVP da semana vai para o atleta que atingiu o pico de precisão de tiro. Analise as porcentagens de acerto e identifique o valor recorde na célula B6.",
    "tipTitle": "Busca de Valor Extremo Superior",
    "tipContent": "Use a função de teto estatístico sobre o intervalo de acertos.",
    "cheatSheetFormula": "",
    "numColumns": 3,
    "numRows": 7,
    "initialGrid": {
      "A1": {
        "raw": "Atleta",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Precisão (%)",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "A2": {
        "raw": "Falcon",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 62,
        "display": 62,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "Glitch",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 78,
        "display": 78,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "Kira",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": 71,
        "display": 71,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A5": {
        "raw": "Specter",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": 84,
        "display": 84,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A6": {
        "raw": "Recorde de Precisão",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "amber"
      },
      "B6": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B6",
        "label": "Precisão Máxima",
        "hint": "Identifique a maior taxa percentual registrada.",
        "explanation": "O maior valor entre 62, 78, 71 e 84 é 84%.",
        "expectedValue": 84,
        "solutionFormula": "=MÁXIMO(B2:B5)",
        "requiredFunction": "MÁXIMO",
        "expectedReferences": [
          "B2:B5"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B5": 70
      },
      "expectedRecalculations": {
        "B6": 78
      }
    }
  },
  {
    "id": 29,
    "world": 9,
    "worldName": "Academia de E-Sports & Scouting",
    "title": "Peneira Classificatória com =SE",
    "scenario": "Definir se o aspirante atingiu a pontuação mínima de corte para a liga pro.",
    "clientName": "Coach Marcus 'Sniper'",
    "clientRole": "Head Coach de FPS",
    "clientAvatar": "🎯",
    "briefing": "Na seletiva da academia, a linha de corte é rigorosa: se a pontuação for igual ou maior que 1500 (>=1500), o candidato é 'Classificado', senão é 'Eliminado'. Defina o resultado dos aspirantes.",
    "tipTitle": "Linha de Corte Competitiva",
    "tipContent": "Avalie a pontuação de cada jogador em relação à meta de 1500 pontos.",
    "cheatSheetFormula": "",
    "numColumns": 3,
    "numRows": 4,
    "initialGrid": {
      "A1": {
        "raw": "Candidato",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Pontos Rank",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "C1": {
        "raw": "Parecer Seletiva",
        "align": "center",
        "format": "text",
        "readOnly": true,
        "badgeColor": "purple"
      },
      "A2": {
        "raw": "Rookie Zero",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 1650,
        "display": 1650,
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
        "raw": "NoobMaster",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 1320,
        "display": 1320,
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
        "label": "Parecer Rookie Zero",
        "hint": "Avalie se a pontuação atende ao critério de corte de 1500.",
        "explanation": "1650 >= 1500 é verdadeiro -> 'Classificado'.",
        "expectedValue": "Classificado",
        "solutionFormula": "=SE(B2>=1500; \"Classificado\"; \"Eliminado\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B2"
        ]
      },
      {
        "coord": "C3",
        "label": "Parecer NoobMaster",
        "hint": "Avalie se a pontuação atende ao critério de corte.",
        "explanation": "1320 >= 1500 é falso -> 'Eliminado'.",
        "expectedValue": "Eliminado",
        "solutionFormula": "=SE(B3>=1500; \"Classificado\"; \"Eliminado\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B3"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 1200,
        "B3": 1800
      },
      "expectedRecalculations": {
        "C2": "Eliminado",
        "C3": "Classificado"
      }
    }
  },
  {
    "id": 30,
    "world": 9,
    "worldName": "Academia de E-Sports & Scouting",
    "title": "Pontuação por Clã com =SOMASE",
    "scenario": "Somar os pontos conquistados exclusivamente pelos atletas do clã Titans.",
    "clientName": "Coach Marcus 'Sniper'",
    "clientRole": "Head Coach de FPS",
    "clientAvatar": "🎯",
    "briefing": "Na tabela de resultados da arena mista, os atletas pertencem a clãs diferentes. Calcule na célula B7 a pontuação combinada somando apenas os competidores do clã 'Titans'.",
    "tipTitle": "Filtro Condicional por Equipe",
    "tipContent": "Selecione a coluna com os nomes dos clãs, defina o filtro e some a coluna de pontos.",
    "cheatSheetFormula": "",
    "numColumns": 3,
    "numRows": 8,
    "initialGrid": {
      "A1": {
        "raw": "Atleta",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Clã",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C1": {
        "raw": "Pontos",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "A2": {
        "raw": "Titan-Alpha",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": "Titans",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C2": {
        "raw": 450,
        "display": 450,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "Lion-Rex",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": "Lions",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C3": {
        "raw": 380,
        "display": 380,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "Titan-Prime",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": "Titans",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C4": {
        "raw": 520,
        "display": 520,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A5": {
        "raw": "Viper-Strike",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": "Vipers",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C5": {
        "raw": 410,
        "display": 410,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A6": {
        "raw": "Pontos Totais Titans",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "emerald"
      },
      "B6": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B6",
        "label": "Total Pontos Titans",
        "hint": "Some os pontos apenas dos atletas que pertencem aos 'Titans'.",
        "explanation": "450 + 520 = 970 pontos.",
        "expectedValue": 970,
        "solutionFormula": "=SOMASE(B2:B5; \"Titans\"; C2:C5)",
        "requiredFunction": "SOMASE",
        "expectedReferences": [
          "B2:B5",
          "C2:C5"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "C2": 500,
        "C4": 600
      },
      "expectedRecalculations": {
        "B6": 1100
      }
    }
  },
  {
    "id": 31,
    "world": 10,
    "worldName": "Desenvolvimento de Jogos & Game Engine",
    "title": "Cálculo de Dano Crítico de Ataque",
    "scenario": "Calcular o dano final desferido multiplicando o dano base pelo fator crítico.",
    "clientName": "Renata Vianna",
    "clientRole": "Lead Combat Game Designer",
    "clientAvatar": "⚔️",
    "briefing": "Na engine de combate do RPG, o ataque especial calcula o dano multiplicando o Dano Base pelo Fator Crítico. Calcule o Dano Final na célula D2.",
    "tipTitle": "Multiplicação de Atributos",
    "tipContent": "Multiplique o poder base pelo multiplicador de golpe crítico.",
    "cheatSheetFormula": "",
    "numColumns": 4,
    "numRows": 4,
    "initialGrid": {
      "A1": {
        "raw": "Habilidade",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Dano Base",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "C1": {
        "raw": "Multiplicador",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "D1": {
        "raw": "Dano Final",
        "align": "right",
        "format": "number",
        "readOnly": true,
        "badgeColor": "rose"
      },
      "A2": {
        "raw": "Lâmina Fantasma",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 80,
        "display": 80,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C2": {
        "raw": 2.5,
        "display": 2.5,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "D2": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "D2",
        "label": "Dano Crítico Final",
        "hint": "Multiplique o dano base pelo multiplicador crítico.",
        "explanation": "80 * 2.5 = 200 de dano.",
        "expectedValue": 200,
        "solutionFormula": "=B2*C2",
        "expectedReferences": [
          "B2",
          "C2"
        ],
        "allowArithmetic": true
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 100,
        "C2": 3
      },
      "expectedRecalculations": {
        "D2": 300
      }
    }
  },
  {
    "id": 32,
    "world": 10,
    "worldName": "Desenvolvimento de Jogos & Game Engine",
    "title": "Contagem de Bugs Bloqueantes com =CONT.SE",
    "scenario": "Contar quantos erros com severidade 'Crítico' estão impedindo o lançamento do patch.",
    "clientName": "Renata Vianna",
    "clientRole": "Lead Combat Game Designer",
    "clientAvatar": "⚔️",
    "briefing": "A equipe de QA registrou uma série de bugs na versão beta. Para autorizar o build de produção, precisamos saber quantos chamados possuem severidade 'Crítico'. Calcule na célula B7.",
    "tipTitle": "Filtro de Severidade de Bugs",
    "tipContent": "Selecione o intervalo de severidades e conte as ocorrências da palavra 'Crítico'.",
    "cheatSheetFormula": "",
    "numColumns": 3,
    "numRows": 8,
    "initialGrid": {
      "A1": {
        "raw": "ID Bug",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Severidade",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A2": {
        "raw": "BUG-101",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": "Crítico",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A3": {
        "raw": "BUG-102",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": "Baixo",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A4": {
        "raw": "BUG-103",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": "Crítico",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A5": {
        "raw": "BUG-104",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": "Médio",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A6": {
        "raw": "BUG-105",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B6": {
        "raw": "Crítico",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A7": {
        "raw": "Total Bugs Críticos",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "rose"
      },
      "B7": {
        "raw": "",
        "format": "number",
        "align": "center",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B7",
        "label": "Total de Bugs Críticos",
        "hint": "Conte quantas ocorrências de 'Crítico' existem na lista.",
        "explanation": "Existem 3 bugs críticos (101, 103 e 105).",
        "expectedValue": 3,
        "solutionFormula": "=CONT.SE(B2:B6; \"Crítico\")",
        "requiredFunction": "CONT.SE",
        "expectedReferences": [
          "B2:B6"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B3": "Crítico"
      },
      "expectedRecalculations": {
        "B7": 4
      }
    }
  },
  {
    "id": 33,
    "world": 10,
    "worldName": "Desenvolvimento de Jogos & Game Engine",
    "title": "PROCV de Atributos de Classes RPG",
    "scenario": "Consultar os pontos de Mana Máxima de uma classe a partir do seu código numérico.",
    "clientName": "Renata Vianna",
    "clientRole": "Lead Combat Game Designer",
    "clientAvatar": "⚔️",
    "briefing": "Na tela de seleção de personagens, o jogo consulta o ID numérico da classe para carregar os atributos. Na célula F2, utilize busca vertical para trazer a Mana Máxima da classe selecionada em E2.",
    "tipTitle": "Recuperação de Atributos via Índice",
    "tipContent": "Localize a coluna de Mana na tabela de classes e informe seu número como índice de retorno.",
    "cheatSheetFormula": "",
    "numColumns": 6,
    "numRows": 6,
    "initialGrid": {
      "A1": {
        "raw": "ID",
        "align": "center",
        "format": "number",
        "readOnly": true
      },
      "B1": {
        "raw": "Classe",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C1": {
        "raw": "Mana Máxima",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "A2": {
        "raw": 1,
        "display": 1,
        "format": "number",
        "align": "center",
        "readOnly": true
      },
      "B2": {
        "raw": "Guerreiro",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C2": {
        "raw": 100,
        "display": 100,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": 2,
        "display": 2,
        "format": "number",
        "align": "center",
        "readOnly": true
      },
      "B3": {
        "raw": "Mago Astral",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C3": {
        "raw": 450,
        "display": 450,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": 3,
        "display": 3,
        "format": "number",
        "align": "center",
        "readOnly": true
      },
      "B4": {
        "raw": "Arqueira Élfica",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C4": {
        "raw": 200,
        "display": 200,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "E1": {
        "raw": "ID Selecionado",
        "align": "center",
        "format": "number",
        "readOnly": true
      },
      "E2": {
        "raw": 2,
        "display": 2,
        "format": "number",
        "align": "center",
        "readOnly": true
      },
      "F1": {
        "raw": "Mana Carregada",
        "align": "right",
        "format": "number",
        "readOnly": true,
        "badgeColor": "sky"
      },
      "F2": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "F2",
        "label": "Mana da Classe",
        "hint": "Consulte o ID informado e traga a Mana correspondente.",
        "explanation": "ID 2 corresponde ao Mago Astral com 450 de Mana.",
        "expectedValue": 450,
        "solutionFormula": "=PROCV(E2; A2:C4; 3; FALSO)",
        "requiredFunction": "PROCV",
        "expectedReferences": [
          "E2",
          "A2:C4"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "E2": 1
      },
      "expectedRecalculations": {
        "F2": 100
      }
    }
  },
  {
    "id": 34,
    "world": 10,
    "worldName": "Desenvolvimento de Jogos & Game Engine",
    "title": "Alerta de Vida Baixa com =SE",
    "scenario": "Acionar aviso na interface gráfica quando os pontos de vida (HP) ficarem críticos.",
    "clientName": "Renata Vianna",
    "clientRole": "Lead Combat Game Designer",
    "clientAvatar": "⚔️",
    "briefing": "A HUD do jogador deve exibir um alerta quando o perigo for iminente: se o HP atual for menor ou igual a 30 (<=30), o status é 'Crítico', senão é 'Seguro'. Avalie os dois jogadores na arena.",
    "tipTitle": "Operador Menor ou Igual",
    "tipContent": "Verifique se a saúde do avatar está abaixo ou no limite de 30 pontos de vida.",
    "cheatSheetFormula": "",
    "numColumns": 3,
    "numRows": 4,
    "initialGrid": {
      "A1": {
        "raw": "Avatar",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Vida Atual (HP)",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "C1": {
        "raw": "Alerta HUD",
        "align": "center",
        "format": "text",
        "readOnly": true,
        "badgeColor": "rose"
      },
      "A2": {
        "raw": "Player 1",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 24,
        "display": 24,
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
        "raw": "Player 2",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 85,
        "display": 85,
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
        "label": "Alerta Player 1",
        "hint": "Avalie se o Player 1 está com vida crítica (<=30).",
        "explanation": "24 <= 30 é verdadeiro -> 'Crítico'.",
        "expectedValue": "Crítico",
        "solutionFormula": "=SE(B2<=30; \"Crítico\"; \"Seguro\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B2"
        ]
      },
      {
        "coord": "C3",
        "label": "Alerta Player 2",
        "hint": "Avalie se o Player 2 está com vida crítica.",
        "explanation": "85 <= 30 é falso -> 'Seguro'.",
        "expectedValue": "Seguro",
        "solutionFormula": "=SE(B3<=30; \"Crítico\"; \"Seguro\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B3"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 50,
        "B3": 20
      },
      "expectedRecalculations": {
        "C2": "Seguro",
        "C3": "Crítico"
      }
    }
  },
  {
    "id": 35,
    "world": 11,
    "worldName": "Finanças Corporativas & ByteCorp",
    "title": "Lucro Líquido Operacional",
    "scenario": "Calcular o lucro real do mês subtraindo as despesas da receita bruta.",
    "clientName": "Sofia Alencar",
    "clientRole": "CFO da ByteCorp",
    "clientAvatar": "💼",
    "briefing": "Bem-vindo à diretoria financeira da ByteCorp! Para o fechamento mensal, calcule o Lucro Líquido do departamento de IA na célula D2 subtraindo as despesas totais da receita realizada.",
    "tipTitle": "Margem Operacional Direta",
    "tipContent": "Subtraia os custos operacionais da receita faturada no período.",
    "cheatSheetFormula": "",
    "numColumns": 4,
    "numRows": 4,
    "initialGrid": {
      "A1": {
        "raw": "Departamento",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Receita (R$)",
        "align": "right",
        "format": "currency",
        "readOnly": true
      },
      "C1": {
        "raw": "Despesas (R$)",
        "align": "right",
        "format": "currency",
        "readOnly": true
      },
      "D1": {
        "raw": "Lucro Líquido",
        "align": "right",
        "format": "currency",
        "readOnly": true,
        "badgeColor": "emerald"
      },
      "A2": {
        "raw": "Produtos de IA",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 15000,
        "display": 15000,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "C2": {
        "raw": 9500,
        "display": 9500,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "D2": {
        "raw": "",
        "format": "currency",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "D2",
        "label": "Lucro Líquido IA",
        "hint": "Subtraia as despesas da receita faturada.",
        "explanation": "15.000 menos 9.500 = R$ 5.500 de lucro.",
        "expectedValue": 5500,
        "solutionFormula": "=B2-C2",
        "expectedReferences": [
          "B2",
          "C2"
        ],
        "allowArithmetic": true
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 20000,
        "C2": 12000
      },
      "expectedRecalculations": {
        "D2": 8000
      }
    }
  },
  {
    "id": 36,
    "world": 11,
    "worldName": "Finanças Corporativas & ByteCorp",
    "title": "Faturamento Regional com =SOMASE",
    "scenario": "Totalizar as vendas realizadas exclusivamente na filial da região Sul.",
    "clientName": "Sofia Alencar",
    "clientRole": "CFO da ByteCorp",
    "clientAvatar": "💼",
    "briefing": "A ByteCorp opera em múltiplas macrorregiões. A diretoria quer uma análise focada no mercado 'Sul'. Na célula B6, totalize o faturamento das vendas onde a região seja igual a 'Sul'.",
    "tipTitle": "Totalização Condicional de Vendas",
    "tipContent": "Selecione o intervalo de regiões e some as receitas correspondentes.",
    "cheatSheetFormula": "",
    "numColumns": 3,
    "numRows": 7,
    "initialGrid": {
      "A1": {
        "raw": "Contrato",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Região",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C1": {
        "raw": "Valor (R$)",
        "align": "right",
        "format": "currency",
        "readOnly": true
      },
      "A2": {
        "raw": "Licença Alpha",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": "Sul",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C2": {
        "raw": 3200,
        "display": 3200,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "Licença Beta",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": "Norte",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C3": {
        "raw": 1800,
        "display": 1800,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "Licença Gama",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": "Sul",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C4": {
        "raw": 4500,
        "display": 4500,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A5": {
        "raw": "Licença Delta",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": "Sudeste",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C5": {
        "raw": 6000,
        "display": 6000,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A6": {
        "raw": "Faturamento Sul",
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
      }
    },
    "targets": [
      {
        "coord": "B6",
        "label": "Total Faturamento Sul",
        "hint": "Some os valores das vendas da região 'Sul'.",
        "explanation": "3200 + 4500 = R$ 7.700.",
        "expectedValue": 7700,
        "solutionFormula": "=SOMASE(B2:B5; \"Sul\"; C2:C5)",
        "requiredFunction": "SOMASE",
        "expectedReferences": [
          "B2:B5",
          "C2:C5"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "C2": 4000,
        "C4": 5000
      },
      "expectedRecalculations": {
        "B6": 9000
      }
    }
  },
  {
    "id": 37,
    "world": 11,
    "worldName": "Finanças Corporativas & ByteCorp",
    "title": "Auditoria de Runway com =SE",
    "scenario": "Avaliar os meses de sobrevivência financeira de duas subsidiárias da startup.",
    "clientName": "Sofia Alencar",
    "clientRole": "CFO da ByteCorp",
    "clientAvatar": "💼",
    "briefing": "Runway é o tempo que uma empresa sobrevive com o caixa atual. Se os meses de caixa forem estritamente menores que 6 (<6), a situação é crítica e deve exibir 'Alerta Vermelho', caso contrário, 'Saudável'. Avalie as duas filiais.",
    "tipTitle": "Gatilho de Saúde Financeira",
    "tipContent": "Utilize o operador de menor (<) para identificar caixas abaixo de 6 meses.",
    "cheatSheetFormula": "",
    "numColumns": 3,
    "numRows": 4,
    "initialGrid": {
      "A1": {
        "raw": "Subsidiária",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Caixa (meses)",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "C1": {
        "raw": "Diagnóstico",
        "align": "center",
        "format": "text",
        "readOnly": true,
        "badgeColor": "purple"
      },
      "A2": {
        "raw": "ByteGaming",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 4,
        "display": 4,
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
        "raw": "ByteCloud",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 12,
        "display": 12,
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
        "label": "Status ByteGaming",
        "hint": "Avalie se o caixa é menor que 6 meses.",
        "explanation": "4 < 6 é verdadeiro -> 'Alerta Vermelho'.",
        "expectedValue": "Alerta Vermelho",
        "solutionFormula": "=SE(B2<6; \"Alerta Vermelho\"; \"Saudável\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B2"
        ]
      },
      {
        "coord": "C3",
        "label": "Status ByteCloud",
        "hint": "Avalie se o caixa é menor que 6 meses.",
        "explanation": "12 < 6 é falso -> 'Saudável'.",
        "expectedValue": "Saudável",
        "solutionFormula": "=SE(B3<6; \"Alerta Vermelho\"; \"Saudável\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B3"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 8,
        "B3": 3
      },
      "expectedRecalculations": {
        "C2": "Saudável",
        "C3": "Alerta Vermelho"
      }
    }
  },
  {
    "id": 38,
    "world": 11,
    "worldName": "Finanças Corporativas & ByteCorp",
    "title": "Consulta de Folha Salarial com =PROCV",
    "scenario": "Localizar o salário do colaborador a partir do seu código funcional no RH.",
    "clientName": "Sofia Alencar",
    "clientRole": "CFO da ByteCorp",
    "clientAvatar": "💼",
    "briefing": "O setor de RH precisa emitir o contracheque do colaborador informado na célula E2. Busque na tabela de funcionários e exiba na célula F2 o Salário correspondente.",
    "tipTitle": "Busca na Folha de Pagamento",
    "tipContent": "Selecione o intervalo de dados e aponte para a coluna que contém os valores salariais.",
    "cheatSheetFormula": "",
    "numColumns": 6,
    "numRows": 6,
    "initialGrid": {
      "A1": {
        "raw": "Matrícula",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Cargo",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C1": {
        "raw": "Salário (R$)",
        "align": "right",
        "format": "currency",
        "readOnly": true
      },
      "A2": {
        "raw": "EMP-10",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": "Dev Fullstack",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C2": {
        "raw": 7500,
        "display": 7500,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "EMP-20",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": "UI/UX Designer",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C3": {
        "raw": 5800,
        "display": 5800,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "EMP-30",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": "Tech Lead",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C4": {
        "raw": 9200,
        "display": 9200,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "E1": {
        "raw": "Matrícula Buscada",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "E2": {
        "raw": "EMP-20",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "F1": {
        "raw": "Salário Base",
        "align": "right",
        "format": "currency",
        "readOnly": true,
        "badgeColor": "emerald"
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
        "coord": "F2",
        "label": "Salário Localizado",
        "hint": "Consulte a matrícula informada e traga o salário correspondente.",
        "explanation": "EMP-20 corresponde ao designer com salário de R$ 5.800.",
        "expectedValue": 5800,
        "solutionFormula": "=PROCV(E2; A2:C4; 3; FALSO)",
        "requiredFunction": "PROCV",
        "expectedReferences": [
          "E2",
          "A2:C4"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "E2": "EMP-10"
      },
      "expectedRecalculations": {
        "F2": 7500
      }
    }
  },
  {
    "id": 39,
    "world": 12,
    "worldName": "Hospital Inteligente & Triagem",
    "title": "Média de Pressão Sistólica da Enfermaria",
    "scenario": "Monitorar a média da pressão arterial de pacientes internados.",
    "clientName": "Dra. Helena Vasconcelos",
    "clientRole": "Médica-Chefe da UTI",
    "clientAvatar": "🩺",
    "briefing": "Na enfermaria geral, a equipe monitora os sinais vitais a cada hora. Calcule na célula B6 a média da pressão sistólica (mmHg) dos pacientes monitorados.",
    "tipTitle": "Média dos Sinais Vitais",
    "tipContent": "Calcule a média aritmética dos valores de pressão da enfermaria.",
    "cheatSheetFormula": "",
    "numColumns": 3,
    "numRows": 7,
    "initialGrid": {
      "A1": {
        "raw": "Leito / Paciente",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Pressão (mmHg)",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "A2": {
        "raw": "Leito 01",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 120,
        "display": 120,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "Leito 02",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 135,
        "display": 135,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "Leito 03",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": 115,
        "display": 115,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A5": {
        "raw": "Leito 04",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": 130,
        "display": 130,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A6": {
        "raw": "Média Geral",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "sky"
      },
      "B6": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B6",
        "label": "Pressão Média Geral",
        "hint": "Calcule a média aritmética da pressão arterial.",
        "explanation": "(120 + 135 + 115 + 130) / 4 = 125 mmHg.",
        "expectedValue": 125,
        "solutionFormula": "=MÉDIA(B2:B5)",
        "requiredFunction": "MÉDIA",
        "expectedReferences": [
          "B2:B5"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 130,
        "B3": 130,
        "B4": 130,
        "B5": 130
      },
      "expectedRecalculations": {
        "B6": 130
      }
    }
  },
  {
    "id": 40,
    "world": 12,
    "worldName": "Hospital Inteligente & Triagem",
    "title": "Triagem Térmica de Febre com =SE",
    "scenario": "Classificar a temperatura corporal dos pacientes na triagem de emergência.",
    "clientName": "Dra. Helena Vasconcelos",
    "clientRole": "Médica-Chefe da UTI",
    "clientAvatar": "🩺",
    "briefing": "No pronto-atendimento, o protocolo clínico define febre quando a temperatura é igual ou maior a 37.8 graus (>=37.8). Gere o parecer médico: se atender ao critério exiba 'Febre', caso contrário exiba 'Normal'.",
    "tipTitle": "Critério Clínico Condicional",
    "tipContent": "Verifique se a temperatura atinge o limiar febril estipulado.",
    "cheatSheetFormula": "",
    "numColumns": 3,
    "numRows": 4,
    "initialGrid": {
      "A1": {
        "raw": "Paciente",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Temperatura (°C)",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "C1": {
        "raw": "Parecer Clínico",
        "align": "center",
        "format": "text",
        "readOnly": true,
        "badgeColor": "rose"
      },
      "A2": {
        "raw": "Paciente A",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 38.6,
        "display": 38.6,
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
        "raw": "Paciente B",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 36.8,
        "display": 36.8,
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
        "label": "Parecer Paciente A",
        "hint": "Avalie se o paciente está febril (>=37.8).",
        "explanation": "38.6 >= 37.8 é verdadeiro -> 'Febre'.",
        "expectedValue": "Febre",
        "solutionFormula": "=SE(B2>=37.8; \"Febre\"; \"Normal\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B2"
        ]
      },
      {
        "coord": "C3",
        "label": "Parecer Paciente B",
        "hint": "Avalie se o paciente B está febril.",
        "explanation": "36.8 >= 37.8 é falso -> 'Normal'.",
        "expectedValue": "Normal",
        "solutionFormula": "=SE(B3>=37.8; \"Febre\"; \"Normal\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B3"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 36.5,
        "B3": 39
      },
      "expectedRecalculations": {
        "C2": "Normal",
        "C3": "Febre"
      }
    }
  },
  {
    "id": 41,
    "world": 12,
    "worldName": "Hospital Inteligente & Triagem",
    "title": "Leitos Livres na UTI com =CONT.SE",
    "scenario": "Contar a quantidade exata de leitos disponíveis para novas internações.",
    "clientName": "Dra. Helena Vasconcelos",
    "clientRole": "Médica-Chefe da UTI",
    "clientAvatar": "🩺",
    "briefing": "A regulação médica precisa saber quantos leitos de UTI estão desocupados e prontos para admissão. Na célula B7, conte quantas ocorrências do status 'Livre' constam na planilha.",
    "tipTitle": "Contagem de Disponibilidade",
    "tipContent": "Selecione a coluna de status dos leitos e conte o termo 'Livre'.",
    "cheatSheetFormula": "",
    "numColumns": 3,
    "numRows": 8,
    "initialGrid": {
      "A1": {
        "raw": "Leito UTI",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Ocupação",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A2": {
        "raw": "UTI-01",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": "Ocupado",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A3": {
        "raw": "UTI-02",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": "Livre",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A4": {
        "raw": "UTI-03",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": "Livre",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A5": {
        "raw": "UTI-04",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": "Higienização",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A6": {
        "raw": "UTI-05",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B6": {
        "raw": "Livre",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A7": {
        "raw": "Total Leitos Livres",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "emerald"
      },
      "B7": {
        "raw": "",
        "format": "number",
        "align": "center",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B7",
        "label": "Total Leitos Livres",
        "hint": "Conte quantas vezes o status 'Livre' aparece na coluna.",
        "explanation": "Existem 3 leitos livres (UTI-02, UTI-03 e UTI-05).",
        "expectedValue": 3,
        "solutionFormula": "=CONT.SE(B2:B6; \"Livre\")",
        "requiredFunction": "CONT.SE",
        "expectedReferences": [
          "B2:B6"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B3": "Ocupado"
      },
      "expectedRecalculations": {
        "B7": 2
      }
    }
  },
  {
    "id": 42,
    "world": 12,
    "worldName": "Hospital Inteligente & Triagem",
    "title": "Custo de Medicamentos com SOMA",
    "scenario": "Calcular subtotais por item e totalizar a fatura da farmácia hospitalar.",
    "clientName": "Dra. Helena Vasconcelos",
    "clientRole": "Médica-Chefe da UTI",
    "clientAvatar": "🩺",
    "briefing": "A farmácia hospitalar necessita do custo total dos suprimentos aplicados. Primeiro, multiplique Quantidade por Preço Unitário para cada medicamento em D2 e D3; em seguida, calcule o Custo Geral na célula D4 somando ambos os itens.",
    "tipTitle": "Subtotais e Fechamento Geral",
    "tipContent": "Calcule a multiplicação linha a linha e depois totalize os subtotais.",
    "cheatSheetFormula": "",
    "numColumns": 4,
    "numRows": 5,
    "initialGrid": {
      "A1": {
        "raw": "Medicamento",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Qtd",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "C1": {
        "raw": "Preço Un.",
        "align": "right",
        "format": "currency",
        "readOnly": true
      },
      "D1": {
        "raw": "Subtotal",
        "align": "right",
        "format": "currency",
        "readOnly": true,
        "badgeColor": "emerald"
      },
      "A2": {
        "raw": "Antibiótico Ampla",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 10,
        "display": 10,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C2": {
        "raw": 45,
        "display": 45,
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
      "A3": {
        "raw": "Soro Fisiológico",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 20,
        "display": 20,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "C3": {
        "raw": 15,
        "display": 15,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "D3": {
        "raw": "",
        "format": "currency",
        "align": "right",
        "isTarget": true
      },
      "A4": {
        "raw": "Total da Fatura",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "amber"
      },
      "D4": {
        "raw": "",
        "format": "currency",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "D2",
        "label": "Subtotal Antibiótico",
        "hint": "Multiplique quantidade por preço unitário do antibiótico.",
        "explanation": "10 * 45 = R$ 450.",
        "expectedValue": 450,
        "solutionFormula": "=B2*C2",
        "expectedReferences": [
          "B2",
          "C2"
        ],
        "allowArithmetic": true
      },
      {
        "coord": "D3",
        "label": "Subtotal Soro",
        "hint": "Multiplique quantidade por preço unitário do soro.",
        "explanation": "20 * 15 = R$ 300.",
        "expectedValue": 300,
        "solutionFormula": "=B3*C3",
        "expectedReferences": [
          "B3",
          "C3"
        ],
        "allowArithmetic": true
      },
      {
        "coord": "D4",
        "label": "Custo Total Farmácia",
        "hint": "Some os dois subtotais calculados.",
        "explanation": "450 + 300 = R$ 750.",
        "expectedValue": 750,
        "solutionFormula": "=SOMA(D2:D3)",
        "requiredFunction": "SOMA",
        "expectedReferences": [
          "D2:D3"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 20,
        "B3": 20
      },
      "expectedRecalculations": {
        "D2": 900,
        "D3": 300,
        "D4": 1200
      }
    }
  },
  {
    "id": 43,
    "world": 13,
    "worldName": "Cibersegurança & Central SOC",
    "title": "Detecção de Força Bruta com =CONT.SE",
    "scenario": "Identificar quantos ataques do tipo 'Brute Force' atingiram o firewall da rede.",
    "clientName": "Capitão Alex 'Cipher'",
    "clientRole": "Analista Sênior do SOC",
    "clientAvatar": "🛡️",
    "briefing": "Alerta vermelho na segurança cibernética! Os sensores de intrusão registraram múltiplos incidentes no log de firewall. Conte na célula B7 quantos incidentes foram categorizados como 'Brute Force'.",
    "tipTitle": "Contagem de Incidentes Críticos",
    "tipContent": "Selecione a coluna de categorias e busque o padrão exato de ataque.",
    "cheatSheetFormula": "",
    "numColumns": 3,
    "numRows": 8,
    "initialGrid": {
      "A1": {
        "raw": "Origem IP",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Tipo de Ataque",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A2": {
        "raw": "192.168.1.50",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": "Brute Force",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A3": {
        "raw": "10.0.0.12",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": "DDoS",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A4": {
        "raw": "172.16.0.4",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": "Brute Force",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A5": {
        "raw": "200.18.5.99",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B5": {
        "raw": "Port Scan",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A6": {
        "raw": "198.51.100.2",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B6": {
        "raw": "Brute Force",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A7": {
        "raw": "Total Brute Force",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "rose"
      },
      "B7": {
        "raw": "",
        "format": "number",
        "align": "center",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B7",
        "label": "Total Ataques Brute Force",
        "hint": "Conte quantas vezes 'Brute Force' aparece no log.",
        "explanation": "Existem 3 ataques de força bruta registrados.",
        "expectedValue": 3,
        "solutionFormula": "=CONT.SE(B2:B6; \"Brute Force\")",
        "requiredFunction": "CONT.SE",
        "expectedReferences": [
          "B2:B6"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B5": "Brute Force"
      },
      "expectedRecalculations": {
        "B7": 4
      }
    }
  },
  {
    "id": 44,
    "world": 13,
    "worldName": "Cibersegurança & Central SOC",
    "title": "Alerta de Firewall Automatizado com =SE",
    "scenario": "Decidir bloqueio de IPs com taxa excessiva de requisições por segundo.",
    "clientName": "Capitão Alex 'Cipher'",
    "clientRole": "Analista Sênior do SOC",
    "clientAvatar": "🛡️",
    "briefing": "A regra de proteção contra flooding do firewall é rígida: se a quantidade de requisições por segundo for estritamente maior que 50 (>50), o status é 'Bloquear IP', caso contrário é 'Liberado'. Avalie as duas conexões.",
    "tipTitle": "Regra de Bloqueio por Limite",
    "tipContent": "Utilize o operador maior que (>) para comparar as requisições com o teto de 50.",
    "cheatSheetFormula": "",
    "numColumns": 3,
    "numRows": 4,
    "initialGrid": {
      "A1": {
        "raw": "IP Remoto",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Req / seg",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "C1": {
        "raw": "Ação Firewall",
        "align": "center",
        "format": "text",
        "readOnly": true,
        "badgeColor": "purple"
      },
      "A2": {
        "raw": "185.220.101.5",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 72,
        "display": 72,
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
        "raw": "200.147.3.15",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": 18,
        "display": 18,
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
        "label": "Ação IP 1",
        "hint": "Avalie se as requisições excedem 50 por segundo.",
        "explanation": "72 > 50 é verdadeiro -> 'Bloquear IP'.",
        "expectedValue": "Bloquear IP",
        "solutionFormula": "=SE(B2>50; \"Bloquear IP\"; \"Liberado\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B2"
        ]
      },
      {
        "coord": "C3",
        "label": "Ação IP 2",
        "hint": "Avalie se as requisições excedem 50 por segundo.",
        "explanation": "18 > 50 é falso -> 'Liberado'.",
        "expectedValue": "Liberado",
        "solutionFormula": "=SE(B3>50; \"Bloquear IP\"; \"Liberado\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B3"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 30,
        "B3": 80
      },
      "expectedRecalculations": {
        "C2": "Liberado",
        "C3": "Bloquear IP"
      }
    }
  },
  {
    "id": 45,
    "world": 13,
    "worldName": "Cibersegurança & Central SOC",
    "title": "Volume de Tráfego Suspeito com =SOMASE",
    "scenario": "Somar os megabytes transferidos exclusivamente por fluxos classificados como 'Suspeito'.",
    "clientName": "Capitão Alex 'Cipher'",
    "clientRole": "Analista Sênior do SOC",
    "clientAvatar": "🛡️",
    "briefing": "Os analistas de tráfego de rede identificaram anomalias em portas altas. Calcule na célula B5 o total de Megabytes (MB) transferidos somando apenas os pacotes cujo parecer seja 'Suspeito'.",
    "tipTitle": "Soma de Megabytes Maliciosos",
    "tipContent": "Filtre a coluna de parecer pelo termo 'Suspeito' e some os dados em MB.",
    "cheatSheetFormula": "",
    "numColumns": 3,
    "numRows": 6,
    "initialGrid": {
      "A1": {
        "raw": "Fluxo / Porta",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Classificação",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C1": {
        "raw": "Volume (MB)",
        "align": "right",
        "format": "number",
        "readOnly": true
      },
      "A2": {
        "raw": "Porta 4444",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": "Suspeito",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C2": {
        "raw": 850,
        "display": 850,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "Porta 443",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": "Confiável",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C3": {
        "raw": 3200,
        "display": 3200,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "Porta 8080",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": "Suspeito",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "C4": {
        "raw": 1450,
        "display": 1450,
        "format": "number",
        "align": "right",
        "readOnly": true
      },
      "A5": {
        "raw": "Tráfego Suspeito Total",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "rose"
      },
      "B5": {
        "raw": "",
        "format": "number",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B5",
        "label": "Total Tráfego Suspeito",
        "hint": "Some o volume em MB apenas dos fluxos com classificação 'Suspeito'.",
        "explanation": "850 + 1450 = 2.300 MB.",
        "expectedValue": 2300,
        "solutionFormula": "=SOMASE(B2:B4; \"Suspeito\"; C2:C4)",
        "requiredFunction": "SOMASE",
        "expectedReferences": [
          "B2:B4",
          "C2:C4"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "C2": 1000,
        "C4": 2000
      },
      "expectedRecalculations": {
        "B5": 3000
      }
    }
  },
  {
    "id": 46,
    "world": 13,
    "worldName": "Cibersegurança & Central SOC",
    "title": "Consulta de Gravidade CVE com =PROCV",
    "scenario": "Encontrar o nível de gravidade de uma falha de segurança a partir do código CVE.",
    "clientName": "Capitão Alex 'Cipher'",
    "clientRole": "Analista Sênior do SOC",
    "clientAvatar": "🛡️",
    "briefing": "Durante a varredura de vulnerabilidades, o scanner detectou o identificador informado na célula E2. Localize na tabela do banco de dados nacional e exiba na célula F2 o Nível de Gravidade da falha.",
    "tipTitle": "Busca na Base CVE",
    "tipContent": "Selecione o catálogo de CVEs e recupere o texto da coluna de gravidade.",
    "cheatSheetFormula": "",
    "numColumns": 6,
    "numRows": 6,
    "initialGrid": {
      "A1": {
        "raw": "CVE ID",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Vulnerabilidade",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C1": {
        "raw": "Gravidade",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A2": {
        "raw": "CVE-2026-01",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": "SSH Remote Exploit",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C2": {
        "raw": "Crítica",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A3": {
        "raw": "CVE-2026-02",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": "SQL Injection",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C3": {
        "raw": "Alta",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "A4": {
        "raw": "CVE-2026-03",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": "XSS Stored Minor",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C4": {
        "raw": "Média",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "E1": {
        "raw": "CVE Auditado",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "E2": {
        "raw": "CVE-2026-01",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "F1": {
        "raw": "Gravidade Detectada",
        "align": "center",
        "format": "text",
        "readOnly": true,
        "badgeColor": "rose"
      },
      "F2": {
        "raw": "",
        "format": "text",
        "align": "center",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "F2",
        "label": "Gravidade da CVE",
        "hint": "Consulte o código CVE informado e recupere a gravidade correspondente.",
        "explanation": "CVE-2026-01 corresponde à falha de gravidade 'Crítica'.",
        "expectedValue": "Crítica",
        "solutionFormula": "=PROCV(E2; A2:C4; 3; FALSO)",
        "requiredFunction": "PROCV",
        "expectedReferences": [
          "E2",
          "A2:C4"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "E2": "CVE-2026-02"
      },
      "expectedRecalculations": {
        "F2": "Alta"
      }
    }
  },
  {
    "id": 47,
    "world": 14,
    "worldName": "Olimpíada de Ciência de Dados",
    "title": "Dashboard Multi-Métricas Supremo",
    "scenario": "Construir um dashboard completo sem nenhuma fórmula pré-definida em texto.",
    "clientName": "Diretor Geral Marco Silva",
    "clientRole": "CEO & Fundador da ByteCorp",
    "clientAvatar": "🏆",
    "briefing": "Chegamos à grande prova executiva! A diretoria colocou nas suas mãos a análise anual de receita: calcule a Receita Total (B6), a Média Trimestral (B7), o Pico Máximo de Receita (B8) e o Status da Meta (B9): se o total for maior ou igual a 15000 (>=15000) exiba 'Meta Superada', caso contrário 'Meta Não Atingida'. Prove sua maestria!",
    "tipTitle": "Domínio Completo de BI",
    "tipContent": "Una as quatro funções fundamentais da análise executiva de dados.",
    "cheatSheetFormula": "",
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
        "raw": "Faturamento (R$)",
        "align": "right",
        "format": "currency",
        "readOnly": true
      },
      "A2": {
        "raw": "1º Trimestre",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": 3400,
        "display": 3400,
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
        "raw": 4200,
        "display": 4200,
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
        "raw": 2800,
        "display": 2800,
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
        "raw": 5600,
        "display": 5600,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A6": {
        "raw": "Faturamento Anual",
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
        "raw": "Pico de Receita",
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
      },
      "A9": {
        "raw": "Status Executivo",
        "align": "left",
        "format": "text",
        "readOnly": true,
        "badgeColor": "purple"
      },
      "B9": {
        "raw": "",
        "format": "text",
        "align": "right",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "B6",
        "label": "Receita Anual Total",
        "hint": "Some o faturamento de todos os trimestres.",
        "explanation": "3400 + 4200 + 2800 + 5600 = R$ 16.000.",
        "expectedValue": 16000,
        "solutionFormula": "=SOMA(B2:B5)",
        "requiredFunction": "SOMA",
        "expectedReferences": [
          "B2:B5"
        ]
      },
      {
        "coord": "B7",
        "label": "Média por Trimestre",
        "hint": "Calcule a média aritmética dos 4 trimestres.",
        "explanation": "R$ 16.000 / 4 = R$ 4.000.",
        "expectedValue": 4000,
        "solutionFormula": "=MÉDIA(B2:B5)",
        "requiredFunction": "MÉDIA",
        "expectedReferences": [
          "B2:B5"
        ]
      },
      {
        "coord": "B8",
        "label": "Pico Máximo de Receita",
        "hint": "Identifique o maior faturamento entre os trimestres.",
        "explanation": "O maior trimestre foi o 4º com R$ 5.600.",
        "expectedValue": 5600,
        "solutionFormula": "=MÁXIMO(B2:B5)",
        "requiredFunction": "MÁXIMO",
        "expectedReferences": [
          "B2:B5"
        ]
      },
      {
        "coord": "B9",
        "label": "Status Meta Anual",
        "hint": "Avalie se o faturamento anual atingiu ou superou 15000.",
        "explanation": "16000 >= 15000 é verdadeiro -> 'Meta Superada'.",
        "expectedValue": "Meta Superada",
        "solutionFormula": "=SE(B6>=15000; \"Meta Superada\"; \"Meta Não Atingida\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "B6"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "B2": 2000,
        "B3": 2000,
        "B4": 2000,
        "B5": 2000,
        "B6": 8000
      },
      "expectedRecalculations": {
        "B6": 8000,
        "B7": 2000,
        "B8": 2000,
        "B9": "Meta Não Atingida"
      }
    }
  },
  {
    "id": 48,
    "world": 14,
    "worldName": "Olimpíada de Ciência de Dados",
    "title": "O Grande Mestre das Planilhas (Desafio Final)",
    "scenario": "Resolver um ecossistema cruzado com busca vertical, soma condicional e tomada de decisão estratégica.",
    "clientName": "Diretor Geral Marco Silva",
    "clientRole": "CEO & Fundador da ByteCorp",
    "clientAvatar": "🏆",
    "briefing": "Parabéns por alcançar o ápice do SheetQuest! Este é o desafio final que consagra o Mestre das Planilhas: na célula F2, recupere o Nome do Plano referente ao SKU em E2 usando busca vertical; na célula F3, calcule o total faturado somando apenas os contratos da categoria 'Enterprise Cloud'; e em F4, avalie se a receita Enterprise atingiu pelo menos R$ 10.000 (>=10000) exibindo 'Mestre das Planilhas', senão 'Reavaliar'. Boa sorte!",
    "tipTitle": "O Ápice da Autonomia em Dados",
    "tipContent": "Cruze tabelas, aplique filtros condicionais e tome decisões estratégicas baseadas em dados.",
    "cheatSheetFormula": "",
    "numColumns": 6,
    "numRows": 7,
    "initialGrid": {
      "A1": {
        "raw": "SKU",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "B1": {
        "raw": "Categoria / Plano",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C1": {
        "raw": "Faturamento (R$)",
        "align": "right",
        "format": "currency",
        "readOnly": true
      },
      "A2": {
        "raw": "SKU-99",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "B2": {
        "raw": "Enterprise Cloud",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C2": {
        "raw": 8500,
        "display": 8500,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A3": {
        "raw": "SKU-88",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "B3": {
        "raw": "Pro Analytics",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C3": {
        "raw": 4200,
        "display": 4200,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "A4": {
        "raw": "SKU-77",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "B4": {
        "raw": "Enterprise Cloud",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "C4": {
        "raw": 6500,
        "display": 6500,
        "format": "currency",
        "align": "right",
        "readOnly": true
      },
      "E1": {
        "raw": "Consulta SKU",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "E2": {
        "raw": "SKU-88",
        "align": "center",
        "format": "text",
        "readOnly": true
      },
      "E3": {
        "raw": "Total Enterprise",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "E4": {
        "raw": "Parecer Diretoria",
        "align": "left",
        "format": "text",
        "readOnly": true
      },
      "F1": {
        "raw": "Painel de Decisão",
        "align": "center",
        "format": "text",
        "readOnly": true,
        "badgeColor": "purple"
      },
      "F2": {
        "raw": "",
        "format": "text",
        "align": "left",
        "isTarget": true
      },
      "F3": {
        "raw": "",
        "format": "currency",
        "align": "right",
        "isTarget": true
      },
      "F4": {
        "raw": "",
        "format": "text",
        "align": "center",
        "isTarget": true
      }
    },
    "targets": [
      {
        "coord": "F2",
        "label": "Plano do SKU Consultado",
        "hint": "Consulte o código SKU informado e recupere o nome do plano.",
        "explanation": "SKU-88 corresponde ao plano Pro Analytics.",
        "expectedValue": "Pro Analytics",
        "solutionFormula": "=PROCV(E2; A2:C4; 2; FALSO)",
        "requiredFunction": "PROCV",
        "expectedReferences": [
          "E2",
          "A2:C4"
        ]
      },
      {
        "coord": "F3",
        "label": "Faturamento Enterprise Cloud",
        "hint": "Some o faturamento apenas dos contratos da categoria 'Enterprise Cloud'.",
        "explanation": "8500 + 6500 = R$ 15.000.",
        "expectedValue": 15000,
        "solutionFormula": "=SOMASE(B2:B4; \"Enterprise Cloud\"; C2:C4)",
        "requiredFunction": "SOMASE",
        "expectedReferences": [
          "B2:B4",
          "C2:C4"
        ]
      },
      {
        "coord": "F4",
        "label": "Parecer da Diretoria",
        "hint": "Avalie se o faturamento de Enterprise Cloud atingiu a meta mínima de 10000.",
        "explanation": "15000 >= 10000 é verdadeiro -> 'Mestre das Planilhas'.",
        "expectedValue": "Mestre das Planilhas",
        "solutionFormula": "=SE(F3>=10000; \"Mestre das Planilhas\"; \"Reavaliar\")",
        "requiredFunction": "SE",
        "expectedReferences": [
          "F3"
        ]
      }
    ],
    "mutationTest": {
      "mutations": {
        "E2": "SKU-99",
        "C2": 3000,
        "C4": 3000,
        "F3": 6000
      },
      "expectedRecalculations": {
        "F2": "Enterprise Cloud",
        "F3": 6000,
        "F4": "Reavaliar"
      }
    }
  }
];
