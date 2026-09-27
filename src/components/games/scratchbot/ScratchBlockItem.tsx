import React from 'react';
import { 
  Flag, 
  ArrowUp, 
  RotateCcw, 
  RotateCw, 
  Repeat, 
  Diamond, 
  Trash2,
  Plus
} from 'lucide-react';
import { ScratchBlock, BlockType } from '../../../types/scratchBot';

interface ScratchBlockItemProps {
  block: ScratchBlock;
  isActive?: boolean;
  onRemove?: (id: string) => void;
  onUpdateParam?: (id: string, value: number) => void;
  onAddChild?: (parentId: string, type: BlockType) => void;
  onRemoveChild?: (parentId: string, childId: string) => void;
  activeBlockId?: string | null;
  readOnly?: boolean;
  onDragStart?: (e: React.DragEvent, block: ScratchBlock) => void;
  onClickBlock?: (block: ScratchBlock) => void;
}

export const ScratchBlockItem: React.FC<ScratchBlockItemProps> = ({
  block,
  isActive = false,
  onRemove,
  onUpdateParam,
  onAddChild,
  onRemoveChild,
  activeBlockId,
  readOnly = false,
  onDragStart,
  onClickBlock,
}) => {
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

  const isCurrentActive = isActive || activeBlockId === block.id;

  return (
    <div
      draggable={!readOnly && block.type !== 'when_flag_clicked'}
      onDragStart={(e) => onDragStart && onDragStart(e, block)}
      onClick={() => onClickBlock && onClickBlock(block)}
      className={`relative select-none transition-all duration-150 rounded-xl border-2 p-2.5 font-mono text-xs font-bold shadow-md cursor-grab active:cursor-grabbing ${getBlockStyle()} ${
        isCurrentActive
          ? 'ring-4 ring-yellow-300 scale-[1.02] shadow-[0_0_20px_rgba(253,224,71,0.6)] z-10'
          : 'hover:brightness-105'
      }`}
    >
      {/* Recorte visual superior estilo Scratch (entalhe) */}
      {block.type !== 'when_flag_clicked' && (
        <div className="absolute -top-1.5 left-4 w-5 h-1.5 bg-inherit rounded-t-sm border-t border-l border-r border-inherit opacity-90" />
      )}

      {/* Conteúdo do Bloco */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {block.type === 'when_flag_clicked' && (
            <>
              <div className="p-1 rounded-full bg-emerald-600 text-white shadow-xs">
                <Flag className="w-3.5 h-3.5 fill-current" />
              </div>
              <span>quando</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-600 text-white text-[10px] font-black">
                ⚑ bandeira verde
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
              <span className="px-1.5 py-0.5 rounded bg-purple-700 text-purple-100">gema 💎</span>
            </>
          )}
        </div>

        {/* Botão de Excluir Bloco (exceto no bloco inicial) */}
        {!readOnly && block.type !== 'when_flag_clicked' && onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(block.id);
            }}
            className="p-1 text-white/70 hover:text-white hover:bg-black/20 rounded transition cursor-pointer"
            title="Excluir este bloco"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Área Interna para Blocos Filhos do Repita N Vezes */}
      {block.type === 'repeat' && (
        <div className="mt-2 pl-3 border-l-4 border-orange-700/80 space-y-2 pt-1">
          {block.children && block.children.length > 0 ? (
            block.children.map((child) => (
              <ScratchBlockItem
                key={child.id}
                block={child}
                activeBlockId={activeBlockId}
                readOnly={readOnly}
                onRemove={(cId) => onRemoveChild && onRemoveChild(block.id, cId)}
                onUpdateParam={onUpdateParam}
                onDragStart={onDragStart}
              />
            ))
          ) : (
            <div className="py-2.5 px-3 rounded-lg border border-dashed border-orange-300/40 bg-orange-950/20 text-orange-200/80 text-[11px] font-normal text-center">
              Solte blocos aqui dentro para repetir
            </div>
          )}
        </div>
      )}

      {/* Recorte visual inferior (encaixe para o próximo bloco) */}
      <div className="absolute -bottom-1.5 left-4 w-5 h-1.5 bg-inherit rounded-b-sm border-b border-l border-r border-inherit opacity-90" />
    </div>
  );
};
