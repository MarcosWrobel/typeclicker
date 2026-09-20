import React from 'react';
import { GraduationCap, X, Laptop, Keyboard, Save, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#12151d] border-2 border-amber-500/50 rounded-3xl max-w-xl w-full shadow-[0_0_40px_rgba(245,158,11,0.25)] overflow-hidden text-zinc-100 p-5 sm:p-6 my-auto">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 flex-shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                Suporte &amp; Orientações Pedagógicas
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                Professor Marcos Wrobel
              </h3>
              <p className="text-xs text-zinc-400">
                Colégio Estadual Leopoldina Bittencourt Pedroso
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
            title="Fechar Ajuda"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dicas Pedagógicas */}
        <div className="my-4 space-y-3 text-xs sm:text-sm text-zinc-300">
          <div className="bg-[#090b10] p-3.5 rounded-2xl border border-zinc-800 space-y-2">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-xs sm:text-sm font-mono">
              <Keyboard className="w-4 h-4 text-amber-400" />
              <span>1. Como digitar e pontuar no TypeClicker</span>
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Digite cada letra da palavra exibida. O jogo tem suporte total ao padrão <strong>ABNT2</strong> dos teclados do nosso laboratório (incluindo acentos como <em>á, é, í, ó, ú, ç, ã</em>). Ao terminar a palavra, aperte a barra de espaço para avançar!
            </p>
          </div>

          <div className="bg-[#090b10] p-3.5 rounded-2xl border border-zinc-800 space-y-2">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs sm:text-sm font-mono">
              <Laptop className="w-4 h-4 text-emerald-400" />
              <span>2. Salvamento no Laboratório (Computadores da Escola)</span>
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Antes do sinal do recreio ou do final da aula, clique no botão <strong>"💾 SALVAR PROGRESSO"</strong>. O arquivo será guardado na pasta <strong>Documentos &gt; TypeClicker</strong>. Na próxima aula, basta clicar em <strong>"📂 Carregar Salvo"</strong> para continuar seus Bytes!
            </p>
          </div>

          <div className="bg-amber-950/40 border border-amber-500/40 p-3.5 rounded-2xl space-y-1.5">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs sm:text-sm font-mono">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>3. Travou em alguma tecla ou precisa de ajuda?</span>
            </h4>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              Não se preocupe! Levante a mão na sala e chame o <strong>Professor Marcos Wrobel</strong>. Ele ajudará a ajustar o teclado, resolver qualquer dúvida no laboratório ou verificar seu relatório de digitação.
            </p>
          </div>
        </div>

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black font-mono text-sm transition cursor-pointer shadow-md"
        >
          Entendido! Voltar ao Jogo 👍
        </button>
      </div>
    </div>
  );
};
