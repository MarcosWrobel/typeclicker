import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { BytezinhoSkinId } from '../types/cosmetics';
import { BytezinhoAvatar } from './BytezinhoAvatar';

interface BytezinhoMascotProps {
  comboStreak: number;
  multiplier: number;
  isError: boolean;
  recentWordComplete: boolean;
  recentUpgradeBought?: string | null;
  consecutiveErrors?: number;
  isDraining?: boolean;
  isOverloaded?: boolean;
  isOverheating?: boolean;
  skin?: BytezinhoSkinId;
  weakKeys?: string[];
  onMascotClick?: () => void;
}

const IDLE_MESSAGES = [
  "Bora digitar! Seus dedos estão na fileira guia?",
  "Aqui no Colégio Leopoldina Pedroso nossos teclados voam! 🚀",
  "Clique no seu Nível no topo para ver todos os 100 níveis que você pode alcançar! 🏆",
  "Dúvidas ou dificuldades? Chame o Prof. Marcos Wrobel! 👨‍🏫",
  "Dica de ouro: Use os dois polegares para a barra de espaço! 👍",
  "Você está digitando no laboratório do colégio! Que demais! 🚀",
  "Lembre de salvar em Documentos/TypeClicker como ensinou o Prof. Marcos!",
  "Mantenha a postura reta! Menos cansaço, mais velocidade!",
  "Qual nível você quer alcançar hoje? Dá pra chegar até o Nível 100! 🎯",
  "Sabia que cada acerto aumenta seu multiplicador de Bytes?",
  "Compre upgrades na loja para turbinar seu teclado!",
  "Pratique com calma para virar um Mestre da Digitação no Leopoldina!"
];

export const BytezinhoMascot: React.FC<BytezinhoMascotProps> = ({
  comboStreak,
  multiplier,
  isError,
  recentWordComplete,
  recentUpgradeBought,
  consecutiveErrors = 0,
  isDraining = false,
  isOverloaded = false,
  isOverheating = false,
  skin = 'classic',
  weakKeys = [],
  onMascotClick
}) => {
  const [currentMessage, setCurrentMessage] = useState<string>(IDLE_MESSAGES[0]);
  const [mood, setMood] = useState<'normal' | 'happy' | 'fire' | 'oops' | 'upgrade' | 'glitch' | 'warning' | 'leak'>('normal');
  const [clickCount, setClickCount] = useState(0);

  // Efeito reativo para mudar o humor e a fala do mascote
  useEffect(() => {
    if (isOverloaded || consecutiveErrors >= 3) {
      setMood('glitch');
      if (weakKeys.length > 0) {
        setCurrentMessage(`⚡ SOBRECARGA! A tecla [${weakKeys[0].toUpperCase()}] travou o circuito! Clique em Calibrar para reabilitar!`);
      } else {
        setCurrentMessage("⚡ SOBRECARGA DE ERROS! Pare, respire e posicione os dedos na fileira base!");
      }
      return;
    }

    if (consecutiveErrors === 2) {
      setMood('warning');
      if (weakKeys.length > 0) {
        setCurrentMessage(`⚠️ A tecla [${weakKeys[0].toUpperCase()}] escorregou de novo! Que tal fazer um treino rápido de reabilitação?`);
      } else {
        setCurrentMessage("⚠️ 2 erros seguidos! Cuidado, errar em sequência consome seus Bytes!");
      }
      return;
    }

    if (isDraining) {
      setMood('leak');
      setCurrentMessage("⏱️ Vazamento de Bytes ativo! Digite a próxima letra para conter o dreno!");
      return;
    }

    if (recentUpgradeBought) {
      setMood('upgrade');
      setCurrentMessage(`Upgrade ${recentUpgradeBought} ativado! Máquina turbinada! 🚀`);
      const timer = setTimeout(() => setMood('normal'), 2500);
      return () => clearTimeout(timer);
    }

    if (isError) {
      setMood('oops');
      setCurrentMessage("Sem estresse! Respira fundo e tenta de novo! 💪");
      const timer = setTimeout(() => setMood('normal'), 1800);
      return () => clearTimeout(timer);
    }

    if (comboStreak >= 15) {
      setMood('fire');
      setCurrentMessage(`COMBO DE ${comboStreak}! SEUS DEDOS ESTÃO VOANDO! 🔥⚡`);
    } else if (comboStreak >= 8) {
      setMood('happy');
      setCurrentMessage(`Ótimo ritmo! Multiplicador ${multiplier.toFixed(1)}x ativo! ⭐`);
    } else if (recentWordComplete) {
      setMood('happy');
      setCurrentMessage("Palavra perfeita! Mandou super bem! ✨");
      const timer = setTimeout(() => setMood('normal'), 1600);
      return () => clearTimeout(timer);
    } else {
      setMood('normal');
    }
  }, [comboStreak, multiplier, isError, recentWordComplete, recentUpgradeBought, consecutiveErrors, isDraining, isOverloaded, weakKeys]);

  // Rotação periódica de mensagens aleatórias quando estiver ocioso
  useEffect(() => {
    const interval = setInterval(() => {
      if (mood === 'normal') {
        if (weakKeys.length > 0 && Math.random() > 0.5) {
          setCurrentMessage(`🎯 Dica do Bytezinho: Notei hesitação na tecla [${weakKeys[0].toUpperCase()}]. O Treino Corretivo tá pronto pra calibrar!`);
        } else {
          const next = IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)];
          setCurrentMessage(next);
        }
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [mood, weakKeys]);

  const handleMascotClick = () => {
    setClickCount(prev => prev + 1);
    onMascotClick?.();
    setMood('happy');
    const funResponses = [
      "Bip-bup! Hehe, você clicou em mim! 🤖",
      "Estou aqui torcendo por você! Bora bater o recorde!",
      "Sabia que o mascote oficial do Linux é um pinguim chamado Tux? 🐧",
      "Energia máxima! Vamos digitar a próxima palavra!"
    ];
    setCurrentMessage(funResponses[clickCount % funResponses.length]);
    setTimeout(() => setMood('normal'), 2200);
  };

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 max-w-2xl w-full mx-auto px-2 py-1 my-0.5 flex-shrink-0">
      {/* Mascote Bytezinho animado com Skin equipada */}
      <motion.button
        type="button"
        onClick={handleMascotClick}
        whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
        whileTap={{ scale: 0.9, rotate: -6 }}
        className="relative group cursor-pointer focus:outline-none flex-shrink-0"
        title="Clique no Bytezinho para uma dica!"
      >
        <BytezinhoAvatar
          skin={skin}
          mood={mood}
          state={isOverloaded ? 'overload' : mood === 'oops' ? 'error' : comboStreak >= 8 ? 'combo' : comboStreak > 0 ? 'typing' : 'idle'}
          size="md"
          isOverloaded={isOverloaded}
          isOverheating={isOverheating || isOverloaded || isDraining}
          isTyping={comboStreak > 0}
          comboCount={comboStreak}
        />

        {/* Badge do Nome */}
        <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[10px] sm:text-[11px] font-mono font-bold bg-[#141720] text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full whitespace-nowrap shadow-md z-10">
          Bytezinho
        </span>
      </motion.button>

      {/* Balão de Fala estilo HQ / Game */}
      <div className="flex-1 bg-[#131620]/95 border border-emerald-500/40 rounded-3xl p-3 sm:p-4 relative shadow-lg flex items-center justify-between gap-3 min-w-0 min-h-[64px] sm:min-h-[72px]">
        {/* Setinha do balão apontando para o robô */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#131620] border-l border-b border-emerald-500/40 rotate-45" />
        
        <div className="flex items-center gap-2.5 sm:gap-3 text-zinc-200 min-w-0 flex-1">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 flex-shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-[13px] sm:text-sm md:text-base text-zinc-100 font-medium sm:font-semibold leading-snug break-words whitespace-normal"
            >
              {currentMessage}
            </motion.p>
          </AnimatePresence>
        </div>
        
        <span className="text-[11px] text-zinc-400 font-mono hidden md:inline flex-shrink-0 bg-zinc-800/80 px-2 py-1 rounded border border-zinc-700/60 shadow-inner">
          Dica do Mascote
        </span>
      </div>
    </div>
  );
};
