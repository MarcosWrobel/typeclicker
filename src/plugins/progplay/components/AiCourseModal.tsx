import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Lightbulb, 
  CheckCircle,
  Code2,
  Loader2,
  Calendar,
  Layers,
  ShoppingBag,
  ListTodo
} from 'lucide-react';
import { sounds } from '../utils/sound';

export interface AiGeneratedModule {
  id: number;
  title: string;
  concept: string;
  instructions: string;
  starterCode: string;
  goalCheck: string;
  hints: string[];
}

export interface AiGeneratedCourse {
  title: string;
  summary: string;
  language: string;
  estimatedTime: string;
  targetProject: string;
  modules: AiGeneratedModule[];
}

interface AiCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCourseInPlayground: (course: AiGeneratedCourse) => void;
}

export const AiCourseModal: React.FC<AiCourseModalProps> = ({
  isOpen,
  onClose,
  onStartCourseInPlayground,
}) => {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState<'html' | 'python' | 'javascript' | 'css' | 'sql'>('html');
  const [level, setLevel] = useState<'iniciante' | 'intermediario' | 'avancado'>('iniciante');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<AiGeneratedCourse | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const quickIdeas = [
    { label: 'Calendário Interativo', icon: <Calendar className="w-3.5 h-3.5" />, lang: 'html', prompt: 'Quero aprender a fazer um calendário interativo com mudança de mês e marcação de dias' },
    { label: 'Lista de Tarefas (To-Do)', icon: <ListTodo className="w-3.5 h-3.5" />, lang: 'javascript', prompt: 'Criar um aplicativo de Lista de Tarefas (To-Do List) com adicionar, concluir e filtros' },
    { label: 'API de E-commerce', icon: <ShoppingBag className="w-3.5 h-3.5" />, lang: 'python', prompt: 'Construir uma API backend de catálogo de produtos e cálculo de frete em Python' },
    { label: 'Cartões Glassmorphism', icon: <Layers className="w-3.5 h-3.5" />, lang: 'css', prompt: 'Criar uma galeria de cartões responsivos modernos com efeito de vidro (Glassmorphism)' },
  ];

  const handleSelectQuickIdea = (idea: typeof quickIdeas[0]) => {
    sounds.playClick();
    setTopic(idea.prompt);
    setLanguage(idea.lang as any);
  };

  const handleGenerateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    sounds.playClick();
    setIsLoading(true);
    setErrorMsg('');
    setGeneratedCourse(null);

    try {
      const response = await fetch('/api/ai/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          language,
          level,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar o curso. Tente novamente.');
      }

      const data: AiGeneratedCourse = await response.json();
      setGeneratedCourse(data);
      sounds.playSuccess();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao conectar à IA para gerar o curso.');
      sounds.playError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptCourse = () => {
    if (!generatedCourse) return;
    sounds.playSuccess();
    onStartCourseInPlayground(generatedCourse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-[#0f111a] border border-[#2b2f45] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="h-14 px-5 bg-[#161826] border-b border-[#2b2f45] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Criador de Cursos com IA</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-mono border border-blue-500/30">
                  Gemini 3.8
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400">
                Digite o que você sonha em construir e a IA monta seu treinamento sob medida.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!generatedCourse ? (
            <form onSubmit={handleGenerateCourse} className="space-y-4">
              {/* Prompt Input */}
              <div>
                <label className="block text-xs font-semibold text-neutral-200 mb-1.5">
                  O que você quer aprender a programar hoje?
                </label>
                <div className="relative">
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: Quero aprender a fazer um calendário interativo completo com marcação de compromissos..."
                    rows={3}
                    className="w-full bg-[#161824] border border-neutral-700/80 rounded-xl p-3 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                    required
                  />
                </div>
              </div>

              {/* Quick suggestions chips */}
              <div>
                <span className="text-[11px] font-medium text-neutral-400 flex items-center gap-1 mb-2">
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                  Sugestões populares para se inspirar:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickIdeas.map((idea, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectQuickIdea(idea)}
                      className="flex items-center gap-2 p-2 bg-[#171924] hover:bg-[#202336] border border-neutral-800 hover:border-neutral-600 rounded-lg text-left text-neutral-300 transition-all cursor-pointer group"
                    >
                      <div className="text-blue-400 group-hover:scale-110 transition-transform">
                        {idea.icon}
                      </div>
                      <span className="text-xs font-medium">{idea.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-neutral-200 mb-1.5">
                    Linguagem / Ambiente:
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full bg-[#161824] border border-neutral-700/80 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="html">🌐 HTML5 + CSS + JavaScript (Web Completa)</option>
                    <option value="python">🐍 Python (Backend, Algoritmos, APIs)</option>
                    <option value="javascript">⚡ JavaScript Moderno (ES6+, DOM, Async)</option>
                    <option value="css">🎨 CSS3 (Flexbox, Grid, Animações)</option>
                    <option value="sql">🗄️ SQL (Consultas e Banco Relacional)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-200 mb-1.5">
                    Seu Nível Atual:
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full bg-[#161824] border border-neutral-700/80 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="iniciante">🌱 Iniciante (Passo a passo bem didático)</option>
                    <option value="intermediario">🚀 Intermediário (Lógica e arquitetura)</option>
                    <option value="avancado">🔥 Avançado (Otimização e boas práticas)</option>
                  </select>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !topic.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Criando seu curso personalizado com IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Gerar Meu Curso Personalizado</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Generated Course Syllabus View */
            <div className="space-y-4 animate-fade-in">
              {/* Course Hero Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900/30 to-purple-900/20 border border-blue-500/30">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span>CURSO PERSONALIZADO GERADO</span>
                  <span className="text-neutral-500">•</span>
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-neutral-300">{generatedCourse.estimatedTime}</span>
                </div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  {generatedCourse.title}
                </h3>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  {generatedCourse.summary}
                </p>
              </div>

              {/* Modules list */}
              <div>
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  Grade de Módulos Práticos ({generatedCourse.modules.length} passos)
                </h4>

                <div className="space-y-2.5">
                  {generatedCourse.modules.map((mod, index) => (
                    <div
                      key={mod.id || index}
                      className="p-3 bg-[#161824] border border-[#2b2f45] rounded-xl hover:border-blue-500/50 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                            {index + 1}
                          </span>
                          <span className="font-bold text-white text-xs">
                            {mod.title}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium shrink-0 border border-emerald-500/20">
                          {mod.goalCheck ? 'Meta Clara' : 'Módulo'}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-300 mt-2 pl-8 leading-relaxed">
                        {mod.concept}
                      </p>

                      <div className="mt-2.5 pl-8 text-[11px] text-blue-300/90 font-mono bg-blue-950/20 p-2 rounded-lg border border-blue-900/30">
                        <strong>Instrução:</strong> {mod.instructions}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setGeneratedCourse(null)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-700 hover:bg-white/5 text-neutral-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  ← Alterar Ideia / Gerar Outro
                </button>

                <button
                  onClick={handleAcceptCourse}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Abrir no Playground com Tutor IA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
