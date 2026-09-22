import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  Zap,
  Clock,
  Target,
  FileText,
  Copy,
  Check,
  User,
  School
} from 'lucide-react';
import { GameState } from '../types';
import {
  calculatePPM,
  calculateAccuracy,
  formatBytes,
  formatNumber,
  formatTime,
  calculatePlayerRank
} from '../utils/formatting';
import { exportSaveToFile } from '../utils/storage';
import { WORD_CATEGORIES } from '../data/words';
import { identificarTeclasFracas } from '../services/adaptiveDrillEngine';

interface MetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GameState;
  onStartDrill?: (keys?: string[]) => void;
}

export const MetricsModal: React.FC<MetricsModalProps> = ({
  isOpen,
  onClose,
  state,
  onStartDrill
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const ppm = calculatePPM(state.correctKeys, state.totalActiveSeconds);
  const accuracy = calculateAccuracy(state.correctKeys, state.wrongKeys);
  const totalKeys = state.correctKeys + state.wrongKeys;
  const weakKeys = identificarTeclasFracas(state.keyTelemetry, 4);

  const generateReportText = () => {
    const activeCat = WORD_CATEGORIES.find(c => c.id === state.selectedCategory) || WORD_CATEGORIES[0];
    const playerRank = calculatePlayerRank(state.totalBytesEarned);

    return `=== RELATÓRIO DE DESEMPENHO PEDAGÓGICO ===
TypeClicker - Leopoldina
Colégio Estadual Leopoldina Bittencourt Pedroso
Professor Responsável: Marcos Wrobel
Data/Hora: ${new Date().toLocaleString('pt-BR')}

Aluno: ${state.studentAvatar || '🐧'} ${state.studentName || 'Aluno'} ${state.studentNickname ? `(Apelido: "${state.studentNickname}")` : ''}
Turma: ${state.studentClass || 'Não informada'}

Nível do Aluno: Nv. ${playerRank.level} de 100 • "${playerRank.title}" (${playerRank.progressPercent}% XP)
Dificuldade Ativa: ${activeCat.name} (Nível ${activeCat.levelNumber}) • Bônus de ${activeCat.bonusMultiplier}x Bytes

--- MÉTRICAS DE DIGITAÇÃO ---
• Velocidade (PPM): ${ppm} Palavras por Minuto
• Taxa de Precisão / Acurácia: ${accuracy}%
• Total de Teclas Digitadas: ${formatNumber(totalKeys)} (${formatNumber(state.correctKeys)} acertos / ${formatNumber(state.wrongKeys)} erros)
• Palavras Concluídas: ${formatNumber(state.wordsCompleted)} palavras
• Maior Sequência de Combo: ${state.maxCombo} acertos seguidos
• Tempo Ativo de Prática: ${formatTime(state.totalActiveSeconds)}

--- DIAGNÓSTICO MOTOR DE TECLAS (IDT) ---
${weakKeys.length > 0 
  ? weakKeys.map(k => `• Tecla [${k.char.toUpperCase()}]: ${Math.round(k.errorRate * 100)}% erros (${k.misses}/${k.total}) | Latência: ${k.avgTimeMs}ms | IDT: ${k.idt}`).join('\n')
  : '• Nenhuma deficiência motora crítica detectada. Telemetria equilibrada.'}

--- PROGRESSO NO JOGO INCREMENTAL ---
• Nível Atual: Nv. ${playerRank.level} / 100 (${playerRank.badge} ${playerRank.title})
• Total Histórico de Bytes: ${formatBytes(state.totalBytesEarned)}
• Núcleos de Overclock Quântico: ${state.prestigeCores}
==========================================`;
  };

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(generateReportText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#13161e] border border-[#2b3240] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col scrollbar-thin">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#2b3240] bg-[#161922] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">Métricas de Desempenho</h2>
              <p className="text-[11px] font-mono text-zinc-400">Acompanhamento Pedagógico</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-5">

          <div className="bg-[#161922] border border-[#2b3240] p-4 rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono border-b border-[#2b3240] pb-2">
              Perfil do Aluno
            </h3>
            <div className="flex items-center gap-3 text-sm font-medium text-white">
               <span className="text-2xl">{state.studentAvatar || '🐧'}</span>
               <span>{state.studentName || 'Aluno'}</span>
            </div>
          </div>

          {/* Key Pedagogical Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            {/* PPM */}
            <div className="bg-[#161922] border border-[#262c3a] p-3.5 rounded-xl text-center">
              <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <div className="text-2xl font-black text-amber-300">{ppm}</div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-sans mt-0.5">PPM (Velocidade)</div>
            </div>

            {/* Accuracy */}
            <div className="bg-[#161922] border border-[#262c3a] p-3.5 rounded-xl text-center">
              <Target className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-2xl font-black text-emerald-300">{accuracy}%</div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-sans mt-0.5">Taxa de Precisão</div>
            </div>

            {/* Words Completed */}
            <div className="bg-[#161922] border border-[#262c3a] p-3.5 rounded-xl text-center">
              <Award className="w-4 h-4 text-sky-400 mx-auto mb-1" />
              <div className="text-2xl font-black text-sky-300">{formatNumber(state.wordsCompleted)}</div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-sans mt-0.5">Palavras Concluídas</div>
            </div>

            {/* Time Spent */}
            <div className="bg-[#161922] border border-[#262c3a] p-3.5 rounded-xl text-center">
              <Clock className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
              <div className="text-lg font-black text-indigo-300 mt-1">{formatTime(state.totalActiveSeconds)}</div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-sans mt-0.5">Tempo Ativo</div>
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="bg-[#161922] border border-[#2b3240] rounded-xl overflow-hidden text-sm">
            <div className="bg-[#1b1f2b] px-4 py-2 border-b border-[#2b3240] font-bold text-xs text-zinc-300 uppercase tracking-wider font-mono">
              Estatísticas Detalhadas
            </div>
            
            <div className="divide-y divide-[#2b3240]">
              <div className="flex justify-between p-3 px-4 hover:bg-[#1a1e2a] transition">
                <span className="text-zinc-400">Teclas Corretas / Total</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatNumber(state.correctKeys)} / {formatNumber(totalKeys)}
                </span>
              </div>
              
              <div className="flex justify-between p-3 px-4 hover:bg-[#1a1e2a] transition">
                <span className="text-zinc-400">Erros (Misses)</span>
                <span className="font-mono font-bold text-rose-400">{formatNumber(state.wrongKeys)}</span>
              </div>

              <div className="flex justify-between p-3 px-4 hover:bg-[#1a1e2a] transition">
                <span className="text-zinc-400">Maior Combo Sem Erros</span>
                <span className="font-mono font-bold text-amber-400">{state.maxCombo} acertos seguidos</span>
              </div>

              <div className="flex justify-between p-3 px-4 hover:bg-[#1a1e2a] transition">
                <span className="text-zinc-400">Total Histórico de Bytes</span>
                <span className="font-mono font-bold text-cyan-400">{formatBytes(state.totalBytesEarned)}</span>
              </div>
            </div>
          </div>

          {/* Diagnóstico Motor & Reabilitação (Teclas Críticas) */}
          <div className="bg-[#161922] border border-[#2b3240] rounded-xl overflow-hidden text-sm">
            <div className="bg-[#1b1f2b] px-4 py-2.5 border-b border-[#2b3240] flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-zinc-300 uppercase tracking-wider font-mono">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>Diagnóstico Motor & Teclas Críticas (IDT)</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                {weakKeys.length > 0 ? `${weakKeys.length} tecla(s) identificada(s)` : 'Calibrado'}
              </span>
            </div>

            <div className="p-4 space-y-3">
              {weakKeys.length > 0 ? (
                <>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    O motor pedagógico identificou teclas com taxa de erro elevada ou hesitação motora. O treino corretivo gera sequências personalizadas para reabilitação muscular:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {weakKeys.map((k) => (
                      <div
                        key={k.char}
                        className="bg-[#10131a] border border-[#232836] p-3 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-mono font-black text-base shadow-sm">
                            {k.char.toUpperCase()}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                              <span>{Math.round(k.errorRate * 100)}% de erros</span>
                              <span className="text-[10px] text-zinc-400 font-normal">({k.misses} em {k.total})</span>
                            </div>
                            <div className="text-[11px] text-zinc-400 font-mono">
                              Latência média: <strong className="text-zinc-300">{k.avgTimeMs}ms</strong>
                            </div>
                          </div>
                        </div>

                        <div className="text-right font-mono">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            k.idt >= 0.4
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            IDT: {k.idt}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {onStartDrill && (
                    <button
                      type="button"
                      onClick={() => {
                        onStartDrill(weakKeys.map(k => k.char));
                        onClose();
                      }}
                      className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-mono font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-400 hover:via-indigo-500 hover:to-purple-500 text-white shadow-[0_0_18px_rgba(99,102,241,0.35)] transition cursor-pointer"
                    >
                      <Target className="w-4 h-4" />
                      <span>Iniciar Treino Corretivo Adaptativo ({weakKeys.map(k => k.char.toUpperCase()).join(', ')})</span>
                    </button>
                  )}
                </>
              ) : (
                <div className="text-xs text-zinc-400 flex items-center gap-2.5 py-1">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="text-emerald-300 font-bold">Telemetria Balanceada: </span>
                    Nenhuma anomalia motora crítica detectada. Sua precisão e velocidade estão homogêneas entre as teclas.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#161922] p-4 border-t border-[#2b3240] flex flex-col sm:flex-row items-center gap-3 justify-end sticky bottom-0">
          <button
            onClick={handleCopyReport}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado para Área de Transferência!' : 'Copiar Relatório Completo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
