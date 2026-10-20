import React, { useState } from 'react';
import {
  Flag,
  ArrowUp,
  RotateCcw,
  RotateCw,
  Repeat,
  Diamond,
  Trash2,
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Compass
} from 'lucide-react';
import { ScratchBlock, BlockType } from '../../../types/scratchBot';

export interface ScratchBlockItemProps {
  block: ScratchBlock;
  parentId?: string;
  index?: number;
  totalInGroup?: number;
  isActive?: boolean;
  activeBlockId?: string | null;
  errorBlockId?: string | null;
  readOnly?: boolean;
  availableBlockTypes?: BlockType[];
  onRemove?: (id: string) => void;
  onUpdateParam?: (id: string, value: number) => void;
  onAddChild?: (parentId: string, type: BlockType) => void;
  onRemoveChild?: (parentId: string, childId: string) => void;
  onMoveRelative?: (id: string, direction: -1 | 1, parentId?: string) => void;
  onDragStartBlock?: (e: React.DragEvent, blockId: string, parentId?: string) => void;
  onDropOnBlock?: (
    e: React.DragEvent,
    targetId: string,
    position: 'before' | 'after' | 'inside',
    targetParentId?: string
  ) => void;
  onClickBlock?: (block: ScratchBlock) => void;
}

export const ScratchBlockItem: React.FC<ScratchBlockItemProps> = ({
  block,
  parentId,
  index = 0,
  totalInGroup = 1,
  isActive = false,
  activeBlockId,
  errorBlockId,
  readOnly = false,
  availableBlockTypes = ['move_forward', 'turn_left', 'turn_right', 'collect_gem'],
  onRemove,
  onUpdateParam,
  onAddChild,
  onRemoveChild,
  onMoveRelative,
  onDragStartBlock,
  onDropOnBlock,
  onClickBlock,
}) => {
  const [showChildPicker, setShowChildPicker] = useState(false);
  const [dropHoverPos, setDropHoverPos] = useState<'before' | 'after' | 'inside' | null>(null);

  const isFlag = block.type === 'when_flag_clicked';
  const isError = errorBlockId === block.id;
  const isCurrentActive = isActive || activeBlockId === block.id;

  const getBlockStyle = () => {
    switch (block.category) {
      case 'events':
        return 'bg-amber-500 border-amber-600 text-white shadow-amber-900/40';
      case 'motion':
        return 'bg-sky-500 border-sky-600 text-white shadow-sky-900/40';
      case 'control':
        return 'bg-orange-500 border-orange-600 text-white shadow-orange-900/40';
      case 'actions':
        return 'bg-purple-500 border-purple-600 text-white shadow-purple-900/40';
      default:
        return 'bg-zinc-600 border-zinc-700 text-white shadow-zinc-900/40';
    }
  };

  const isContainerBlock =
    block.type === 'repeat' || block.type === 'if_path_ahead' || block.type === 'if_on_gem';

  const computeDropPosition = (clientY: number, el: HTMLElement): 'before' | 'after' | 'inside' => {
    if (isFlag) return 'after';
    const rect = el.getBoundingClientRect();
    const relY = clientY - rect.top;
    const height = rect.height;

    if (isContainerBlock) {
      const edgeZone = Math.min(18, Math.max(10, height * 0.18));
      if (relY < edgeZone) {
        return 'before';
      } else if (relY > height - edgeZone) {
        return 'after';
      } else {
        return 'inside';
      }
    } else {
      return relY < height / 2 ? 'before' : 'after';
    }
  };

  // Cálculo da posição de encaixe (antes, depois ou dentro)
  const handleDragOver = (e: React.DragEvent) => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();

    const pos = computeDropPosition(e.clientY, e.currentTarget as HTMLElement);
    setDropHoverPos(pos);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setDropHoverPos(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();

    const computedPos = computeDropPosition(e.clientY, e.currentTarget as HTMLElement);
    const finalPos = isFlag ? 'after' : (dropHoverPos || computedPos);
    setDropHoverPos(null);

    if (onDropOnBlock) {
      onDropOnBlock(e, block.id, finalPos, parentId);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (readOnly || isFlag) return;
    e.stopPropagation();

    // Empacota o ID e o parentId
    const payload = JSON.stringify({
      source: 'workspace',
      blockId: block.id,
      parentId,
    });
    e.dataTransfer.setData('text/plain', payload);
    e.dataTransfer.effectAllowed = 'move';

    if (onDragStartBlock) {
      onDragStartBlock(e, block.id, parentId);
    }
  };

  // Permissões para botões de subir e descer
  const canMoveUp = !readOnly && !isFlag && (parentId ? index > 0 : index > 1);
  const canMoveDown = !readOnly && !isFlag && index < totalInGroup - 1;

  return (
    <div className="relative group/block my-1">
      {/* ── Indicador Visual de Inserção Superior (Antes) ── */}
      {dropHoverPos === 'before' && (
        <div className="absolute -top-1.5 left-0 right-0 h-1 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15] z-30 pointer-events-none animate-pulse">
          <div className="absolute left-6 -top-1 w-4 h-3 bg-yellow-400 rounded-t-sm" />
        </div>
      )}

      {/* ── Bloco Principal ── */}
      <div
        draggable={!readOnly && !isFlag}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => onClickBlock && onClickBlock(block)}
        className={`relative select-none transition-all duration-150 rounded-xl border-2 p-2.5 font-mono text-xs font-bold shadow-md cursor-grab active:cursor-grabbing ${getBlockStyle()} ${
          isError
            ? 'ring-4 ring-rose-500 scale-[1.03] shadow-[0_0_25px_rgba(244,63,94,0.9)] z-20 animate-pulse'
            : isCurrentActive
            ? 'ring-4 ring-yellow-300 scale-[1.02] shadow-[0_0_20px_rgba(253,224,71,0.6)] z-10'
            : 'hover:brightness-105'
        } ${dropHoverPos === 'inside' ? 'ring-2 ring-yellow-400 bg-orange-600/40' : ''}`}
      >
        {/* Recorte visual superior estilo Scratch (entalhe macho) */}
        {!isFlag && (
          <div className="absolute -top-1.5 left-4 w-5 h-1.5 bg-inherit rounded-t-sm border-t border-l border-r border-inherit opacity-90" />
        )}

        {/* Linha Superior do Bloco */}
        <div className="flex items-center justify-between gap-2">
          {/* Alça e Ícone + Textos de Ação */}
          <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
            {!isFlag && !readOnly && (
              <span className="text-white/40 group-hover/block:text-white/80 transition-colors cursor-grab">
                <GripVertical className="w-3.5 h-3.5" />
              </span>
            )}

            {isFlag && (
              <>
                <div className="p-1 rounded-full bg-emerald-600 text-white shadow-xs">
                  <Flag className="w-3.5 h-3.5 fill-current" />
                </div>
                <span>quando</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-600 text-white text-[10px] font-black flex items-center gap-1">
                  <Flag className="w-2.5 h-2.5 fill-current" />
                  <span>bandeira verde</span>
                </span>
                <span>for clicada</span>
              </>
            )}

            {block.type === 'move_forward' && (
              <>
                <div className="p-1 rounded bg-sky-600 text-white">
                  <ArrowUp className="w-3.5 h-3.5" />
                </div>
                <span>mova</span>
                <span className="px-1.5 py-0.5 rounded bg-sky-700 text-sky-100 font-bold">1</span>
                <span>passo</span>
              </>
            )}

            {block.type === 'turn_left' && (
              <>
                <div className="p-1 rounded bg-sky-600 text-white">
                  <RotateCcw className="w-3.5 h-3.5" />
                </div>
                <span>gire ↺ para a</span>
                <span className="px-1.5 py-0.5 rounded bg-sky-700 text-sky-100">esquerda</span>
              </>
            )}

            {block.type === 'turn_right' && (
              <>
                <div className="p-1 rounded bg-sky-600 text-white">
                  <RotateCw className="w-3.5 h-3.5" />
                </div>
                <span>gire ↻ para a</span>
                <span className="px-1.5 py-0.5 rounded bg-sky-700 text-sky-100">direita</span>
              </>
            )}

            {block.type === 'repeat' && (
              <>
                <div className="p-1 rounded bg-orange-600 text-white">
                  <Repeat className="w-3.5 h-3.5" />
                </div>
                <span>repita</span>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={block.paramValue ?? 2}
                  onChange={(e) => {
                    e.stopPropagation();
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && onUpdateParam) {
                      onUpdateParam(block.id, Math.max(1, Math.min(15, val)));
                    }
                  }}
                  disabled={readOnly}
                  className="w-11 px-1 py-0.5 rounded bg-orange-700 border border-orange-400 text-center text-white font-black text-xs outline-none focus:ring-2 focus:ring-yellow-300"
                />
                <span>vezes</span>
              </>
            )}

            {block.type === 'collect_gem' && (
              <>
                <div className="p-1 rounded bg-purple-600 text-white animate-pulse">
                  <Diamond className="w-3.5 h-3.5 fill-current" />
                </div>
                <span>coletar</span>
                <span className="px-1.5 py-0.5 rounded bg-purple-700 text-purple-100">gema</span>
              </>
            )}

            {block.type === 'if_path_ahead' && (
              <>
                <div className="p-1 rounded bg-amber-600 text-white">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <span>se</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-700 text-amber-100 font-bold border border-amber-400/40">
                  caminho à frente
                </span>
                <span>então</span>
              </>
            )}

            {block.type === 'if_on_gem' && (
              <>
                <div className="p-1 rounded bg-amber-600 text-white">
                  <Diamond className="w-3.5 h-3.5" />
                </div>
                <span>se</span>
                <span className="px-1.5 py-0.5 rounded bg-purple-700 text-purple-100 font-bold border border-purple-400/40">
                  sobre gema
                </span>
                <span>então</span>
              </>
            )}
          </div>

          {/* Botões de Ação na Direita: Reordenar (▲/▼) e Excluir (Lixeira) */}
          {!readOnly && !isFlag && (
            <div className="flex items-center gap-0.5 shrink-0">
              {/* Botão Mover para Cima */}
              <button
                type="button"
                disabled={!canMoveUp}
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveRelative && onMoveRelative(block.id, -1, parentId);
                }}
                className={`p-1 rounded transition ${
                  canMoveUp
                    ? 'text-white/70 hover:text-white hover:bg-black/25 cursor-pointer'
                    : 'text-white/20 cursor-not-allowed'
                }`}
                title="Mover este bloco para cima"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>

              {/* Botão Mover para Baixo */}
              <button
                type="button"
                disabled={!canMoveDown}
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveRelative && onMoveRelative(block.id, 1, parentId);
                }}
                className={`p-1 rounded transition ${
                  canMoveDown
                    ? 'text-white/70 hover:text-white hover:bg-black/25 cursor-pointer'
                    : 'text-white/20 cursor-not-allowed'
                }`}
                title="Mover este bloco para baixo"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Botão de Excluir Bloco */}
              {onRemove && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(block.id);
                  }}
                  className="p-1 text-white/70 hover:text-rose-200 hover:bg-rose-900/40 rounded transition cursor-pointer ml-0.5"
                  title="Excluir este bloco"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Área Interna para Blocos Filhos de Estruturas (Repita / Condicionais Se) ── */}
        {(block.type === 'repeat' || block.type === 'if_path_ahead' || block.type === 'if_on_gem') && (
          <div
            onDragOver={(e) => {
              if (readOnly) return;
              e.preventDefault();
              e.stopPropagation();
              setDropHoverPos('inside');
            }}
            onDrop={(e) => {
              if (readOnly) return;
              e.preventDefault();
              e.stopPropagation();
              setDropHoverPos(null);
              if (onDropOnBlock) {
                onDropOnBlock(e, block.id, 'inside', parentId);
              }
            }}
            className={`mt-2 pl-3 border-l-4 space-y-1.5 pt-1.5 pb-1 rounded-r-lg transition-colors ${
              block.type === 'repeat' ? 'border-orange-700/90' : 'border-amber-700/90'
            } ${
              dropHoverPos === 'inside'
                ? block.type === 'repeat'
                  ? 'bg-orange-600/40 ring-2 ring-yellow-400'
                  : 'bg-amber-600/40 ring-2 ring-yellow-400'
                : 'bg-black/15'
            }`}
          >
            {block.children && block.children.length > 0 ? (
              block.children.map((child, childIdx) => (
                <ScratchBlockItem
                  key={child.id}
                  block={child}
                  parentId={block.id}
                  index={childIdx}
                  totalInGroup={block.children?.length || 0}
                  activeBlockId={activeBlockId}
                  errorBlockId={errorBlockId}
                  readOnly={readOnly}
                  availableBlockTypes={availableBlockTypes}
                  onRemove={(cId) => (onRemoveChild ? onRemoveChild(block.id, cId) : onRemove && onRemove(cId))}
                  onAddChild={onAddChild}
                  onRemoveChild={onRemoveChild}
                  onUpdateParam={onUpdateParam}
                  onMoveRelative={onMoveRelative}
                  onDragStartBlock={onDragStartBlock}
                  onDropOnBlock={onDropOnBlock}
                />
              ))
            ) : (
              <div
                onDragOver={(e) => {
                  if (readOnly) return;
                  e.preventDefault();
                  e.stopPropagation();
                  setDropHoverPos('inside');
                }}
                onDrop={(e) => {
                  if (readOnly) return;
                  e.preventDefault();
                  e.stopPropagation();
                  setDropHoverPos(null);
                  if (onDropOnBlock) {
                    onDropOnBlock(e, block.id, 'inside', parentId);
                  }
                }}
                className={`py-2.5 px-3 rounded-lg border border-dashed text-[11px] font-normal text-center transition-all ${
                  dropHoverPos === 'inside'
                    ? 'border-yellow-400 bg-yellow-400/20 text-yellow-200 ring-2 ring-yellow-400/80 scale-[1.01]'
                    : block.type === 'repeat'
                    ? 'border-orange-300/40 bg-orange-950/30 text-orange-200/90'
                    : 'border-amber-300/40 bg-amber-950/30 text-amber-200/90'
                }`}
              >
                Solte o bloco aqui para encaixar dentro deste bloco
              </div>
            )}

            {/* Botão e seletor rápido para adicionar bloco dentro deste bloco contêiner */}
            {!readOnly && onAddChild && (
              <div className="pt-1">
                {!showChildPicker ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowChildPicker(true);
                    }}
                    className={`w-full py-1 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition border cursor-pointer ${
                      block.type === 'repeat'
                        ? 'bg-orange-700/60 hover:bg-orange-700 text-orange-100 border-orange-400/30'
                        : 'bg-amber-700/60 hover:bg-amber-700 text-amber-100 border-amber-400/30'
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>{block.type === 'repeat' ? 'Inserir ação dentro do loop' : 'Inserir ação interna'}</span>
                  </button>
                ) : (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`p-1.5 rounded-lg bg-black/60 border flex flex-wrap gap-1 items-center justify-center shadow-lg ${
                      block.type === 'repeat' ? 'border-orange-400/40' : 'border-amber-400/40'
                    }`}
                  >
                    {availableBlockTypes.includes('move_forward') && (
                      <button
                        type="button"
                        onClick={() => {
                          onAddChild(block.id, 'move_forward');
                          setShowChildPicker(false);
                        }}
                        className="px-2 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold transition cursor-pointer"
                      >
                        ⬆ Mover
                      </button>
                    )}
                    {availableBlockTypes.includes('turn_left') && (
                      <button
                        type="button"
                        onClick={() => {
                          onAddChild(block.id, 'turn_left');
                          setShowChildPicker(false);
                        }}
                        className="px-2 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold transition cursor-pointer"
                      >
                        ↺ Esquerda
                      </button>
                    )}
                    {availableBlockTypes.includes('turn_right') && (
                      <button
                        type="button"
                        onClick={() => {
                          onAddChild(block.id, 'turn_right');
                          setShowChildPicker(false);
                        }}
                        className="px-2 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold transition cursor-pointer"
                      >
                        ↻ Direita
                      </button>
                    )}
                    {availableBlockTypes.includes('collect_gem') && (
                      <button
                        type="button"
                        onClick={() => {
                          onAddChild(block.id, 'collect_gem');
                          setShowChildPicker(false);
                        }}
                        className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <Diamond className="w-2.5 h-2.5" />
                        <span>Gema</span>
                      </button>
                    )}
                    {availableBlockTypes.includes('if_path_ahead') && (
                      <button
                        type="button"
                        onClick={() => {
                          onAddChild(block.id, 'if_path_ahead');
                          setShowChildPicker(false);
                        }}
                        className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <Compass className="w-2.5 h-2.5" />
                        <span>Se caminho</span>
                      </button>
                    )}
                    {availableBlockTypes.includes('if_on_gem') && (
                      <button
                        type="button"
                        onClick={() => {
                          onAddChild(block.id, 'if_on_gem');
                          setShowChildPicker(false);
                        }}
                        className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <Diamond className="w-2.5 h-2.5" />
                        <span>Se gema</span>
                      </button>
                    )}
                    {availableBlockTypes.includes('repeat') && block.type === 'repeat' && (
                      <button
                        type="button"
                        onClick={() => {
                          onAddChild(block.id, 'repeat');
                          setShowChildPicker(false);
                        }}
                        className="px-2 py-1 rounded bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <Repeat className="w-2.5 h-2.5" />
                        <span>Repita</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowChildPicker(false)}
                      className="px-1.5 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-[10px] transition cursor-pointer flex items-center justify-center"
                      title="Fechar"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Recorte visual inferior (fêmea: encaixe para o próximo bloco) */}
        <div className="absolute -bottom-1.5 left-4 w-5 h-1.5 bg-inherit rounded-b-sm border-b border-l border-r border-inherit opacity-90" />
      </div>

      {/* ── Indicador Visual de Inserção Inferior (Depois) ── */}
      {dropHoverPos === 'after' && (
        <div className="absolute -bottom-1.5 left-0 right-0 h-1 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15] z-30 pointer-events-none animate-pulse">
          <div className="absolute left-6 -top-1 w-4 h-3 bg-yellow-400 rounded-t-sm" />
        </div>
      )}
    </div>
  );
};
