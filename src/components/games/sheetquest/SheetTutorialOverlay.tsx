import React from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Target,
  MousePointer,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export interface SheetTutorialStep {
  stepNumber: number;
  title: string;
  badge: string;
  description: string;
  instruction: string;
  highlightCoord?: string;
  isCompleted: boolean;
}

export interface SheetTutorialOverlayProps {
  currentStep: number;
  onNextStep: () => void;
  onSkipTutorial: () => void;
  selectedCoord: string;
  formulaInput: string;
  isCurrentStepCompleted: boolean;
}

export const TUTORIAL_STEPS_DEF = [
  {
    stepNumber: 1,
    title: 'Anatomia da Célula: Coluna + Linha',
    badge: 'Passo 1/5 • Navegação',
    description:
      'Bem-vindo à ByteCorp Data Studio! Toda planilha é uma matriz onde cada célula possui um endereço único formado pela Letra da Coluna e o Número da Linha.',
    instruction:
      '👉 Clique na célula B2 na planilha branca abaixo para ver o endereço B2 ser selecionado na caixa de coordenadas.',
    highlightCoord: 'B2'
  },
  {
    stepNumber: 2,
    title: 'O Sinal de Igual (=) Ativa Fórmulas',
    badge: 'Passo 2/5 • Início da Fórmula',
    description:
      'Se você digitar números normais, a planilha apenas armazena texto estático. Para fazer cálculos automáticos dinâmicos, você SEMPRE deve iniciar com o sinal de igual (=).',
    instruction:
      '👉 Selecione a célula-alvo amarela B4 e digite o sinal = na barra de fórmulas fx no topo.',
    highlightCoord: 'B4'
  },
  {
    stepNumber: 3,
    title: 'Point & Click: Injetando Células com o Mouse',
    badge: 'Passo 3/5 • Truque Profissional',
    description:
      'Você não precisa digitar coordenadas no teclado! Com o sinal = ativo na barra fx, basta clicar nas células da grade para inseri-las automaticamente.',
    instruction:
      '👉 Na célula B4 com =, clique com o mouse em B2, digite + no teclado, clique em B3 e aperte o botão Calcular (ou Enter).',
    highlightCoord: 'B4'
  },
  {
    stepNumber: 4,
    title: 'Arrastando Intervalos com a Função =SOMA',
    badge: 'Passo 4/5 • O Poder dos Intervalos',
    description:
      'Para somar muitas linhas, usamos intervalos com dois-pontos (:). B2:B6 significa "de B2 até B6"!',
    instruction:
      '👉 Na meta B7, digite =SOMA( e depois clique e arraste com o mouse de B2 até B6. Feche o parêntese e aperte Calcular!',
    highlightCoord: 'B7'
  },
  {
    stepNumber: 5,
    title: 'Regra de Ouro Brasileira: Ponto e Vírgula (;)',
    badge: 'Passo 5/5 • Padrão PT-BR',
    description:
      'No Brasil, a vírgula (,) é usada para decimais (ex: 15,50). Por isso, no Google Planilhas em português, os argumentos de funções como =SE e =SOMASE são separados obrigatoriamente por PONTO E VÍRGULA (;)!',
    instruction:
      '👉 Parabéns pelo treinamento de integração! Você recebeu seu crachá de Analista Júnior na ByteCorp.',
    highlightCoord: undefined
  }
];

export const SheetTutorialOverlay: React.FC<SheetTutorialOverlayProps> = ({
  currentStep,
  onNextStep,
  onSkipTutorial,
  selectedCoord,
  formulaInput,
  isCurrentStepCompleted
}) => {
  const step = TUTORIAL_STEPS_DEF[currentStep - 1] || TUTORIAL_STEPS_DEF[0];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Background glow decorativo */}
      <div className="absolute top-0 right-0 w-80 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Mentor Gerente Marco + Bytezinho */}
        <div className="flex items-start gap-3.5 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border-2 border-emerald-500/40 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
            👔
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-sm text-white">
                Gerente Marco "SheetMaster"
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                {step.badge}
              </span>
            </div>

            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              {step.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {step.description}
            </p>

            <div className="mt-2 p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-xs font-semibold text-emerald-200 flex items-center gap-2">
              <MousePointer className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-bounce" />
              <span>{step.instruction}</span>
            </div>
          </div>
        </div>

        {/* Ações de Navegação do Tutorial */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          {isCurrentStepCompleted ? (
            <button
              onClick={onNextStep}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all animate-pulse active:scale-95 cursor-pointer"
            >
              <span>{currentStep === 5 ? 'Concluir Treinamento' : 'Próximo Passo'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-300 font-mono flex items-center gap-1 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-800/40">
                <Target className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                Aguardando ação...
              </span>
            </div>
          )}

          <button
            onClick={onSkipTutorial}
            className="w-full sm:w-auto px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs transition-colors flex items-center justify-center gap-1"
            title="Ir direto para a Campanha de Demandas"
          >
            <span>Pular Tutorial</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
