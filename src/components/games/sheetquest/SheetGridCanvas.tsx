import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Check,
  X,
  Target,
  FileSpreadsheet,
  Plus
} from 'lucide-react';
import { SheetGridData } from '../../../types/sheetQuest';
import {
  colIndexToLetter,
  parseCellCoord,
  extractReferencedRanges,
  formatCellValue
} from './formulaEngine';
import { sheetAudio } from './sheetAudio';

export interface SheetGridCanvasProps {
  grid: SheetGridData;
  numColumns: number;
  numRows: number;
  selectedCoord: string;
  onSelectCoord: (coord: string) => void;
  formulaInput: string;
  onFormulaInputChange: (val: string) => void;
  onFormulaSubmit: () => void;
  targetCoords: string[];
  solvedCoords?: string[];
  readOnly?: boolean;
  disabled?: boolean;
  tutorialHighlightCoord?: string;
  sheetTabTitle?: string;
}

// Dicionário de auxílio de sintaxe em tempo real para a barra fx
const FORMULA_SYNTAX_GUIDES: Record<string, { signature: string; desc: string }> = {
  SOMA: {
    signature: 'SOMA(valor1; [valor2]; ...)',
    desc: 'Retorna a soma de uma série de números ou intervalo de células (ex: =SOMA(B2:B6)).'
  },
  MEDIA: {
    signature: 'MÉDIA(valor1; [valor2]; ...)',
    desc: 'Calcula a média aritmética dos valores no intervalo (ex: =MÉDIA(C2:C5)).'
  },
  MÉDIA: {
    signature: 'MÉDIA(valor1; [valor2]; ...)',
    desc: 'Calcula a média aritmética dos valores no intervalo (ex: =MÉDIA(C2:C5)).'
  },
  MAXIMO: {
    signature: 'MÁXIMO(valor1; [valor2]; ...)',
    desc: 'Retorna o maior valor numérico em um conjunto de dados.'
  },
  MÁXIMO: {
    signature: 'MÁXIMO(valor1; [valor2]; ...)',
    desc: 'Retorna o maior valor numérico em um conjunto de dados.'
  },
  MINIMO: {
    signature: 'MÍNIMO(valor1; [valor2]; ...)',
    desc: 'Retorna o menor valor numérico em um conjunto de dados.'
  },
  MÍNIMO: {
    signature: 'MÍNIMO(valor1; [valor2]; ...)',
    desc: 'Retorna o menor valor numérico em um conjunto de dados.'
  },
  CONTNUM: {
    signature: 'CONT.NÚM(valor1; [valor2]; ...)',
    desc: 'Conta a quantidade de células com valores numéricos no intervalo.'
  },
  'CONT.NÚM': {
    signature: 'CONT.NÚM(valor1; [valor2]; ...)',
    desc: 'Conta a quantidade de células com valores numéricos no intervalo.'
  },
  'CONT.NUM': {
    signature: 'CONT.NÚM(valor1; [valor2]; ...)',
    desc: 'Conta a quantidade de células com valores numéricos no intervalo.'
  },
  'CONT.VALORES': {
    signature: 'CONT.VALORES(valor1; [valor2]; ...)',
    desc: 'Conta a quantidade de células não vazias em um intervalo.'
  },
  CONTSE: {
    signature: 'CONT.SE(intervalo; critério)',
    desc: 'Conta células que atendem a um critério (ex: =CONT.SE(C2:C10; ">=70")).'
  },
  'CONT.SE': {
    signature: 'CONT.SE(intervalo; critério)',
    desc: 'Conta células que atendem a um critério (ex: =CONT.SE(C2:C10; ">=70")).'
  },
  SE: {
    signature: 'SE(teste_lógico; valor_se_verdadeiro; [valor_se_falso])',
    desc: 'Executa um teste lógico condicional (ex: =SE(B2>=70; "Aprovado"; "Exame")).'
  },
  SOMASE: {
    signature: 'SOMASE(intervalo; critério; [intervalo_soma])',
    desc: 'Soma valores com base em critério (ex: =SOMASE(A2:A8; "Teclado"; B2:B8)).'
  },
  PROCV: {
    signature: 'PROCV(chave_pesquisa; intervalo; índice; [classificado])',
    desc: 'Pesquisa vertical (ex: =PROCV("RAM-32GB"; A2:C6; 3; FALSO)).'
  }
};

export const SheetGridCanvas: React.FC<SheetGridCanvasProps> = ({
  grid,
  numColumns,
  numRows,
  selectedCoord,
  onSelectCoord,
  formulaInput,
  onFormulaInputChange,
  onFormulaSubmit,
  targetCoords,
  solvedCoords = [],
  readOnly = false,
  disabled = false,
  tutorialHighlightCoord,
  sheetTabTitle = 'Demanda_Ativa'
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartCoord, setDragStartCoord] = useState<string | null>(null);

  // Estados de redimensionamento de colunas e linhas
  const [colWidths, setColWidths] = useState<Record<string, number>>({});
  const [rowHeights, setRowHeights] = useState<Record<number, number>>({});
  const resizingColRef = useRef<{ colLetter: string; startX: number; startWidth: number } | null>(null);
  const resizingRowRef = useRef<{ rowNum: number; startY: number; startHeight: number } | null>(null);

  // Garante uma grade com dimensões generosas para simular uma folha real de Google Sheets
  const effectiveColumns = Math.max(numColumns, 8);
  const effectiveRows = Math.max(numRows, 12);

  // Intervalos coloridos extraídos da fórmula ativa
  const highlightedRanges = useMemo(() => {
    if (!formulaInput.startsWith('=')) return [];
    return extractReferencedRanges(formulaInput);
  }, [formulaInput]);

  // Mapa de cor por coordenada para bordas no grid
  const coordColorMap = useMemo(() => {
    const map = new Map<string, string>();
    highlightedRanges.forEach((range) => {
      range.coords.forEach((coord) => {
        map.set(coord, range.color);
      });
    });
    return map;
  }, [highlightedRanges]);

  // Detector de função ativa para a tooltip de sintaxe
  const activeSyntaxGuide = useMemo(() => {
    if (!formulaInput.startsWith('=')) return null;
    const clean = formulaInput.substring(1).toUpperCase();
    const match = clean.match(/([A-ZÁÉÍÓÚÇ.]+)\s*\(/);
    if (!match) return null;
    const fnName = match[1];
    return FORMULA_SYNTAX_GUIDES[fnName] || null;
  }, [formulaInput]);

  // Detecta se a célula ativa é editável
  const isSelectedCellTarget = targetCoords.includes(selectedCoord);
  const selectedCellData = grid[selectedCoord];
  const isSelectedCellReadOnly = selectedCellData?.readOnly && !isSelectedCellTarget;

  // Finalizar drag no mouseup global
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragStartCoord(null);
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging]);

  /**
   * Redimensionamento de Coluna com o Mouse (Drag)
   */
  const handleColResizeMouseDown = (colLetter: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const currentWidth = colWidths[colLetter] || 135;
    resizingColRef.current = {
      colLetter,
      startX: e.clientX,
      startWidth: currentWidth
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizingColRef.current) return;
      const diff = moveEvent.clientX - resizingColRef.current.startX;
      const newWidth = Math.max(70, Math.min(480, resizingColRef.current.startWidth + diff));
      setColWidths((prev) => ({ ...prev, [resizingColRef.current!.colLetter]: newWidth }));
    };

    const handleMouseUp = () => {
      resizingColRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  /**
   * Redimensionamento de Linha com o Mouse (Drag)
   */
  const handleRowResizeMouseDown = (rowNum: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const currentHeight = rowHeights[rowNum] || 44;
    resizingRowRef.current = {
      rowNum,
      startY: e.clientY,
      startHeight: currentHeight
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizingRowRef.current) return;
      const diff = moveEvent.clientY - resizingRowRef.current.startY;
      const newHeight = Math.max(28, Math.min(180, resizingRowRef.current.startHeight + diff));
      setRowHeights((prev) => ({ ...prev, [resizingRowRef.current!.rowNum]: newHeight }));
    };

    const handleMouseUp = () => {
      resizingRowRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleColDoubleClick = (colLetter: string) => {
    setColWidths((prev) => {
      const copy = { ...prev };
      delete copy[colLetter];
      return copy;
    });
  };

  const handleRowDoubleClick = (rowNum: number) => {
    setRowHeights((prev) => {
      const copy = { ...prev };
      delete copy[rowNum];
      return copy;
    });
  };

  /**
   * Ponto-e-Clique / Injeção de Coordenada ou Intervalo na Barra de Fórmulas
   */
  const handleCellMouseDown = (coord: string, e: React.MouseEvent) => {
    if (formulaInput.startsWith('=') && !readOnly && !disabled) {
      e.preventDefault(); // Não perde o foco da barra de fórmulas
      setIsDragging(true);
      setDragStartCoord(coord);

      injectCoordIntoFormula(coord, coord);
      sheetAudio.playInjectRange();
    } else {
      onSelectCoord(coord);
      sheetAudio.playCellClick();
    }
  };

  const handleCellMouseEnter = (coord: string) => {
    if (!isDragging || !dragStartCoord || !formulaInput.startsWith('=')) return;
    injectCoordIntoFormula(dragStartCoord, coord);
  };

  const injectCoordIntoFormula = (startCoord: string, endCoord: string) => {
    const rangeText = startCoord === endCoord ? startCoord : `${startCoord}:${endCoord}`;
    const currentVal = formulaInput;
    const trailingRefRegex = /([$]?[A-Za-z]+[$]?[0-9]+(:[$]?[A-Za-z]+[$]?[0-9]+)?)$/;
    if (trailingRefRegex.test(currentVal)) {
      const updated = currentVal.replace(trailingRefRegex, rangeText);
      onFormulaInputChange(updated);
    } else {
      onFormulaInputChange(currentVal + rangeText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onFormulaSubmit();
    } else if (e.key === 'Escape') {
      if (selectedCellData) {
        onFormulaInputChange(String(selectedCellData.raw ?? ''));
      }
    }
  };

  return (
    <div className="flex flex-col w-full bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden select-none transition-all">
      {/* ─── TOPO DA PLANILHA: BARRA DE MENUS & TÍTULO SHEET ────────── */}
      <div className="bg-[#f8f9fa] border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <div className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold shadow-sm">
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </div>
            <span>Google Planilhas — {sheetTabTitle}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500 font-medium">
            <span className="hover:text-slate-800 cursor-pointer">Arquivo</span>
            <span className="hover:text-slate-800 cursor-pointer">Editar</span>
            <span className="hover:text-slate-800 cursor-pointer">Ver</span>
            <span className="hover:text-slate-800 cursor-pointer">Inserir</span>
            <span className="hover:text-slate-800 cursor-pointer">Formatar</span>
            <span className="hover:text-slate-800 cursor-pointer">Dados</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online (Salvamento Automático)
          </span>
        </div>
      </div>

      {/* ─── BARRA DE FÓRMULAS OFICIAL (FX BAR LIGHT) ────────────────── */}
      <div className="bg-[#f8fafc] border-b border-slate-200 px-3 py-2.5 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          {/* Caixa de Coordenada Ativa (ex: B4) */}
          <div className="flex items-center justify-center min-w-[64px] h-11 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold text-sm shadow-sm tracking-wider">
            {selectedCoord}
          </div>

          {/* Símbolo fx clássico */}
          <div className="flex items-center justify-center w-8 h-11 text-slate-400 font-serif italic font-bold text-lg select-none">
            fx
          </div>

          {/* Campo de Entrada de Fórmula com Fundo Branco de Alto Contraste */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={formulaInput}
              onChange={(e) => onFormulaInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={readOnly || disabled}
              placeholder={
                isSelectedCellTarget
                  ? 'Digite sua fórmula (ex: =SOMA(B2:B6)) ou clique nas células...'
                  : isSelectedCellReadOnly
                  ? 'Célula de visualização (somente leitura)'
                  : 'Digite um valor ou fórmula começando com ='
              }
              className={`w-full h-11 px-3.5 bg-white border rounded-lg font-mono text-sm transition-all outline-none ${
                isSelectedCellTarget
                  ? 'border-emerald-500 text-slate-900 focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 font-semibold shadow-inner'
                  : isSelectedCellReadOnly
                  ? 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed'
                  : 'border-slate-300 text-slate-800 focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20'
              }`}
            />

            {/* Atalho de Limpar barra */}
            {formulaInput && !readOnly && !disabled && (
              <button
                type="button"
                onClick={() => onFormulaInputChange('')}
                className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer"
                title="Limpar barra de fórmulas"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Botão de Calcular / Confirmar */}
          <button
            type="button"
            onClick={onFormulaSubmit}
            disabled={readOnly || disabled || !formulaInput.trim()}
            className={`flex items-center gap-1.5 px-5 h-11 rounded-lg font-bold text-xs tracking-wider transition-all shadow-md active:scale-95 cursor-pointer ${
              isSelectedCellTarget
                ? 'bg-[#107c41] hover:bg-[#0c6634] text-white shadow-emerald-700/20'
                : 'bg-[#1a73e8] hover:bg-[#1557b0] text-white shadow-blue-700/20'
            } disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none`}
            title="Calcular e validar fórmula (Enter)"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>CALCULAR</span>
          </button>
        </div>

        {/* Dica de Sintaxe Dinâmica */}
        {activeSyntaxGuide && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#e8f0fe] border border-[#d2e3fc] rounded-lg text-xs animate-in fade-in slide-in-from-top-1 duration-150">
            <span className="font-mono font-bold text-[#1a73e8] bg-white px-2 py-0.5 rounded border border-[#d2e3fc] shadow-sm">
              {activeSyntaxGuide.signature}
            </span>
            <span className="text-[#3c4043] text-xs font-medium truncate">
              {activeSyntaxGuide.desc}
            </span>
          </div>
        )}
      </div>

      {/* ─── TABELA DE CÉLULAS DA PLANILHA (LIGHT THEME EXPANDIDO) ──── */}
      <div className="overflow-x-auto overflow-y-auto min-h-[480px] max-h-[600px] bg-white p-0 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        <table className="w-full border-collapse text-sm table-fixed">
          {/* Definição de Colunas com Largura Dinâmica */}
          <colgroup>
            <col style={{ width: '48px', minWidth: '48px' }} />
            {Array.from({ length: effectiveColumns }).map((_, cIdx) => {
              const colLetter = colIndexToLetter(cIdx);
              const customW = colWidths[colLetter] || 135;
              return <col key={colLetter} style={{ width: `${customW}px`, minWidth: '70px' }} />;
            })}
          </colgroup>

          {/* Cabeçalho das Colunas (A, B, C, ...) */}
          <thead>
            <tr>
              {/* Canto superior esquerdo */}
              <th className="w-12 min-w-12 h-9 bg-[#f8f9fa] border-r border-b border-slate-300 text-slate-400 font-mono text-[11px] text-center font-bold">
                ◢
              </th>
              {Array.from({ length: effectiveColumns }).map((_, cIdx) => {
                const colLetter = colIndexToLetter(cIdx);
                const isColActive = parseCellCoord(selectedCoord)?.colLetter === colLetter;
                return (
                  <th
                    key={colLetter}
                    className={`h-9 border-r border-b border-slate-300 font-mono text-xs font-bold transition-colors select-none relative group/th ${
                      isColActive
                        ? 'bg-[#e8f0fe] text-[#1a73e8] border-b-2 border-b-[#1a73e8]'
                        : 'bg-[#f1f3f4] text-[#5f6368] hover:bg-[#e8eaed]'
                    }`}
                  >
                    <span>{colLetter}</span>

                    {/* Alça de Redimensionamento de Coluna (Drag) */}
                    <div
                      onMouseDown={(e) => handleColResizeMouseDown(colLetter, e)}
                      onDoubleClick={() => handleColDoubleClick(colLetter)}
                      className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-[#1a73e8] active:bg-[#1a73e8] transition-colors z-30 opacity-0 group-hover/th:opacity-100"
                      title="Arraste para redimensionar coluna (ou duplo-clique para resetar)"
                    />
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Corpo com Linhas e Células */}
          <tbody>
            {Array.from({ length: effectiveRows }).map((_, rIdx) => {
              const rowNum = rIdx + 1;
              const isRowActive = parseCellCoord(selectedCoord)?.row === rowNum;
              const customRowH = rowHeights[rowNum] || 44;

              return (
                <tr key={rowNum} style={{ height: `${customRowH}px` }}>
                  {/* Número da Linha (1, 2, 3...) com Alça de Redimensionamento */}
                  <th
                    className={`border-r border-b border-slate-300 font-mono text-xs font-bold transition-colors select-none relative group/tr ${
                      isRowActive
                        ? 'bg-[#e8f0fe] text-[#1a73e8] border-r-2 border-r-[#1a73e8]'
                        : 'bg-[#f1f3f4] text-[#5f6368] hover:bg-[#e8eaed]'
                    }`}
                  >
                    <span>{rowNum}</span>

                    {/* Alça de Redimensionamento de Linha (Drag) */}
                    <div
                      onMouseDown={(e) => handleRowResizeMouseDown(rowNum, e)}
                      onDoubleClick={() => handleRowDoubleClick(rowNum)}
                      className="absolute left-0 right-0 bottom-0 h-2 cursor-row-resize hover:bg-[#1a73e8] active:bg-[#1a73e8] transition-colors z-30 opacity-0 group-hover/tr:opacity-100"
                      title="Arraste para redimensionar linha (ou duplo-clique para resetar)"
                    />
                  </th>

                  {/* Células da linha */}
                  {Array.from({ length: effectiveColumns }).map((_, cIdx) => {
                    const colLetter = colIndexToLetter(cIdx);
                    const coord = `${colLetter}${rowNum}`;
                    const cellData = grid[coord];
                    const isSelected = selectedCoord === coord;
                    const isTarget = targetCoords.includes(coord);
                    const isSolved = solvedCoords.includes(coord);
                    const isTutorialTarget = tutorialHighlightCoord === coord;
                    const refColor = coordColorMap.get(coord);

                    // Formatação do conteúdo exibido
                    const displayValue = cellData?.display !== undefined
                      ? formatCellValue(cellData.display, cellData.format)
                      : cellData?.raw !== undefined
                      ? formatCellValue(cellData.raw, cellData.format)
                      : '';

                    // Erros do Sheets
                    const isSheetError =
                      typeof displayValue === 'string' &&
                      displayValue.startsWith('#') &&
                      displayValue.endsWith('!');

                    const isTableHeader = rowNum === 1 && cellData?.readOnly && !isTarget;

                    return (
                      <td
                        key={coord}
                        onMouseDown={(e) => handleCellMouseDown(coord, e)}
                        onMouseEnter={() => handleCellMouseEnter(coord)}
                        style={{
                          borderColor: refColor ? refColor : undefined,
                          backgroundColor: refColor ? `${refColor}18` : undefined
                        }}
                        className={`px-3 font-mono transition-all relative border-r border-b border-slate-200 cursor-pointer text-slate-800 ${
                          // Célula selecionada (Google Sheets azul/verde ativo)
                          isSelected
                            ? 'ring-2 ring-[#1a73e8] bg-[#e8f0fe]/40 z-20 font-bold'
                            : isSolved
                            ? 'bg-emerald-50 text-emerald-900 font-medium'
                            : isTarget
                            ? 'bg-amber-50 hover:bg-amber-100/80 text-amber-950 font-bold'
                            : isTableHeader
                            ? 'bg-slate-100 font-bold text-slate-800 border-b-2 border-b-slate-300'
                            : cellData?.readOnly
                            ? 'bg-slate-50/60 text-slate-700 hover:bg-slate-100/50'
                            : 'bg-white hover:bg-slate-50'
                        } ${
                          // Intervalo referenciado na fórmula
                          refColor ? 'border-dashed border-2' : ''
                        } ${
                          // Spotlight do tutorial
                          isTutorialTarget
                            ? 'ring-4 ring-amber-400 bg-amber-100/60 animate-bounce z-30'
                            : ''
                        } ${
                          // Alinhamento
                          cellData?.align === 'right'
                            ? 'text-right'
                            : cellData?.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                        }`}
                        title={`${coord}${cellData?.raw ? ` | Conteúdo: ${cellData.raw}` : ''}`}
                      >
                        {/* Conteúdo da Célula */}
                        <div className="flex items-center justify-between gap-1 w-full overflow-hidden">
                          <span
                            className={`truncate ${
                              isSheetError
                                ? 'text-rose-600 font-bold underline decoration-wavy decoration-rose-500'
                                : isTarget && !isSolved
                                ? 'text-amber-700 font-bold'
                                : isSolved
                                ? 'text-emerald-700 font-bold'
                                : ''
                            }`}
                          >
                            {displayValue}
                          </span>

                          {/* Ícone de Alvo / Resolvido */}
                          {isTarget && (
                            <span className="flex-shrink-0 ml-1">
                              {isSolved ? (
                                <Check className="w-4 h-4 text-emerald-600 font-bold" />
                              ) : (
                                <Target className="w-4 h-4 text-amber-600 animate-pulse" />
                              )}
                            </span>
                          )}
                        </div>

                        {/* Ponto de preenchimento (Fill Handle) da célula ativa */}
                        {isSelected && (
                          <div className="absolute bottom-[-4px] right-[-4px] w-2.5 h-2.5 bg-[#1a73e8] border border-white rounded-none z-30 shadow-sm" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ─── RODAPÉ DA GRADE (BARRA DE ABAS GOOGLE SHEETS) ──────────── */}
      <div className="bg-[#f8f9fa] px-3 py-2 border-t border-slate-300 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-2">
          {/* Aba ativa */}
          <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-t-lg border-t-2 border-t-[#107c41] border-x border-slate-300 text-slate-800 font-bold text-xs shadow-sm">
            <span>{sheetTabTitle}</span>
          </div>
          <button
            type="button"
            className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors"
            title="Adicionar página"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Legenda e Dicas de Uso */}
        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-400 hidden md:inline">
            Dica: arraste a borda das colunas/linhas para ajustar a largura
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block" />
            <span className="text-amber-800 font-semibold">Alvo</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
            <span className="text-emerald-800 font-semibold">Resolvido</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-sky-500 inline-block border border-sky-600 border-dashed" />
            <span className="text-sky-800 font-semibold">Intervalo</span>
          </span>
          <span className="text-slate-500 hidden sm:inline">
            PT-BR: <code className="text-emerald-700 font-mono font-bold">;</code>
          </span>
        </div>
      </div>
    </div>
  );
};
