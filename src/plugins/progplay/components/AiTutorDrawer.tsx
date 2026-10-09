import React,{ useState, useRef, useEffect } from 'react';
import {
Bot,
Send,
Sparkles,
ChevronRight,
ChevronLeft,
CheckCircle2,
HelpCircle,
Lightbulb,
X,
BookOpen,
Loader2
} from 'lucide-react';
import { AiGeneratedCourse, AiGeneratedModule } from './AiCourseModal';
import { sounds } from '../utils/sound';

interface Message {
  id: string;
  role: 'tutor' | 'user';
  text: string;
  time: string;
}

interface AiTutorDrawerProps {
  course: AiGeneratedCourse | null;
  currentCode: string;
  language: string;
  onApplyStarterCode?: (code: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AiTutorDrawer: React.FC<AiTutorDrawerProps> = ({
  course,
  currentCode,
  language,
  onApplyStarterCode,
  isOpen,
  onClose,
}) => {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'tutor',
      text: 'Olá! Sou seu Mentor IA Socrático. Estou acompanhando o que você digita no editor. Não vou te entregar o código pronto, mas vou te guiar com dicas, perguntas e analogias para você aprender a programar sozinho! Como posso te ajudar agora?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  if (!isOpen) return null;

  const activeModule: AiGeneratedModule | undefined = course?.modules[currentModuleIndex];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isThinking) return;

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      role: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsThinking(true);
    sounds.playClick();

    const courseContext = course && activeModule
      ? `Curso: "${course.title}". Módulo atual (${currentModuleIndex + 1}/${course.modules.length}): "${activeModule.title}". Objetivo: "${activeModule.instructions}". Conceito: "${activeModule.concept}".`
      : 'Aluno explorando livremente no Playground.';

    try {
      const response = await fetch('/api/ai/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          currentCode,
          language,
          courseContext,
          chatHistory: messages.map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: m.text,
          })),
        }),
      });

      const data = await response.json();
      const tutorReply = data.reply || 'Observe a ordem das linhas de código. O que você gostaria que acontecesse primeiro?';

      setMessages((prev) => [
        ...prev,
        {
          id: 'tutor-' + Date.now(),
          role: 'tutor',
          text: tutorReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'tutor-err-' + Date.now(),
          role: 'tutor',
          text: 'Pense no fluxo de dados: onde a informação é criada e para onde ela deve ir? Tente imprimir ou inspecionar o valor das variáveis.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleToggleModuleComplete = (idx: number) => {
    sounds.playClick();
    setCompletedModules((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleLoadStarterCode = () => {
    if (activeModule?.starterCode && onApplyStarterCode) {
      sounds.playSuccess();
      onApplyStarterCode(activeModule.starterCode);
    }
  };

  return (
    <div className="w-full lg:w-96 h-full flex flex-col bg-[#11131f] border-l border-[#272b3d] shadow-2xl select-none z-20 shrink-0">
      
      {/* Header */}
      <div className="h-12 px-3 bg-[#161928] border-b border-[#272b3d] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Tutor IA Socrático</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[10px] text-neutral-400">Ajuda com raciocínio sem dar código pronto</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-neutral-400 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Course Context Header (if active) */}
      {course && activeModule && (
        <div className="p-3 bg-[#151827] border-b border-[#24283b] shrink-0">
          <div className="flex items-center justify-between text-[11px] font-bold text-neutral-300 mb-1.5">
            <span className="flex items-center gap-1 text-blue-400 truncate max-w-[200px]">
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              {course.title}
            </span>
            <span className="font-mono text-neutral-400">
              Passo {currentModuleIndex + 1}/{course.modules.length}
            </span>
          </div>

          <div className="bg-[#1b1f33] p-2.5 rounded-xl border border-[#2e3450]">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white text-xs">
                {activeModule.title}
              </span>
              <button
                onClick={() => handleToggleModuleComplete(currentModuleIndex)}
                className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  completedModules.includes(currentModuleIndex)
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>{completedModules.includes(currentModuleIndex) ? 'Concluído' : 'Marcar Feito'}</span>
              </button>
            </div>

            <p className="text-[11px] text-neutral-300 leading-relaxed mb-2">
              {activeModule.instructions}
            </p>

            {/* Module Controls */}
            <div className="flex items-center justify-between pt-1 border-t border-[#2a304a] text-[11px]">
              <div className="flex items-center gap-1">
                <button
                  disabled={currentModuleIndex === 0}
                  onClick={() => setCurrentModuleIndex((prev) => Math.max(0, prev - 1))}
                  className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Passo anterior"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={currentModuleIndex === course.modules.length - 1}
                  onClick={() => setCurrentModuleIndex((prev) => Math.min(course.modules.length - 1, prev + 1))}
                  className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Próximo passo"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {activeModule.starterCode && (
                <button
                  onClick={handleLoadStarterCode}
                  className="text-[10px] text-blue-400 hover:text-blue-300 underline font-mono cursor-pointer"
                >
                  Carregar esqueleto base
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Prompt Chips */}
      <div className="px-3 py-2 bg-[#131522] border-b border-[#24283b] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-[10px]">
        <button
          onClick={() => handleSendMessage('Dê uma dica sobre o que fazer agora sem me dar a resposta pronta')}
          className="px-2 py-1 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/50 whitespace-nowrap cursor-pointer flex items-center gap-1"
        >
          <Lightbulb className="w-3 h-3 text-yellow-400" />
          <span>Pedir dica</span>
        </button>

        <button
          onClick={() => handleSendMessage('Onde pode estar o erro ou o que está faltando no meu código atual?')}
          className="px-2 py-1 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/50 whitespace-nowrap cursor-pointer flex items-center gap-1"
        >
          <HelpCircle className="w-3 h-3 text-blue-400" />
          <span>Analisar erro</span>
        </button>

        <button
          onClick={() => handleSendMessage('Explique o conceito deste passo de forma didática com uma analogia')}
          className="px-2 py-1 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/50 whitespace-nowrap cursor-pointer flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Explicar conceito</span>
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 select-text font-sans text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1 text-[10px] text-neutral-500 mb-0.5 px-1 select-none">
              <span>{msg.role === 'user' ? 'Você' : 'Tutor IA'}</span>
              <span>•</span>
              <span>{msg.time}</span>
            </div>

            <div
              className={`p-3 rounded-2xl max-w-[90%] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-xs'
                  : 'bg-[#181c2e] text-neutral-200 border border-[#2b314d] rounded-tl-xs shadow-md'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-neutral-400 text-xs py-2 px-1">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span className="italic text-[11px]">Tutor refletindo sobre seu código...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-2.5 bg-[#141624] border-t border-[#272b3d] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Diga sua dúvida ou peça uma orientação..."
            className="flex-1 bg-[#1c2035] border border-neutral-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isThinking}
            className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
