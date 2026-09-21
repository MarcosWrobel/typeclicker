import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ShieldCheck, 
  Smile, 
  LogOut, 
  Download, 
  Upload, 
  ArrowRight, 
  Check, 
  User as UserIcon, 
  GraduationCap, 
  Tag, 
  LogIn,
  Shield
} from 'lucide-react';
import { sound } from '../utils/audio';
import { GameState } from '../types';
import { RPG_CLASSES, RpgClassType } from '../types/rpgClass';
import { logoutUser, loginWithGoogle, isDevAdminModeActive, toggleDevAdminMode } from '../services/firebaseService';

export interface AvatarOption {
  id: string;
  emoji: string;
  name: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'tux', emoji: '🐧', name: 'Tux Linux' },
  { id: 'robot', emoji: '🤖', name: 'Robô Byte' },
  { id: 'ninja', emoji: '🥷', name: 'Ninja' },
  { id: 'gamer', emoji: '🎮', name: 'Gamer Pro' },
  { id: 'lightning', emoji: '⚡', name: 'Raio Turbo' },
  { id: 'cat', emoji: '🐱', name: 'Gato Coder' },
  { id: 'fox', emoji: '🦊', name: 'Raposa' },
  { id: 'rocket', emoji: '🚀', name: 'Foguete' },
  { id: 'wizard', emoji: '🧙', name: 'Mago Geek' },
  { id: 'lion', emoji: '🦁', name: 'Leão Tech' },
  { id: 'pixel', emoji: '👾', name: 'Pixel Alien' },
  { id: 'dragon', emoji: '🐉', name: 'Dragão' },
  { id: 'panda', emoji: '🐼', name: 'Panda' },
  { id: 'tiger', emoji: '🐯', name: 'Tigre' },
  { id: 'trex', emoji: '🦖', name: 'T-Rex' },
  { id: 'unicorn', emoji: '🦄', name: 'Unicórnio' }
];

import { SchoolGradeGroup, SCHOOL_CLASSES_CONFIG, ALL_STANDARD_CLASSES } from '../constants/school';
export type { SchoolGradeGroup };
export { SCHOOL_CLASSES_CONFIG };


interface StudentModalProps {
  isOpen: boolean;
  user: any; // Firebase user
  currentAvatar?: string;
  currentNickname?: string;
  currentClass?: string;
  currentRpgClass?: RpgClassType;
  onSave: (avatar: string, nickname: string, studentClass: string, rpgClass?: RpgClassType) => void;
  onImportState: (state: GameState) => void;
  state: GameState;
  onClose?: () => void;
  onLogout?: () => Promise<void> | void;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  user,
  currentAvatar = '🐧',
  currentNickname = '',
  currentClass = '',
  currentRpgClass,
  onSave,
  onImportState,
  state,
  onClose,
  onLogout
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar || '🐧');
  const [nickname, setNickname] = useState<string>(currentNickname || state.studentNickname || '');
  const [selectedRpgClass, setSelectedRpgClass] = useState<RpgClassType>(currentRpgClass || state.rpgClass || 'warrior');
  
  // Turma selecionada
  const initialTurma = currentClass || state.studentClass || '';
  const isCustomInitial = initialTurma !== '' && !ALL_STANDARD_CLASSES.includes(initialTurma);
  
  const [selectedTurma, setSelectedTurma] = useState<string>(initialTurma);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(isCustomInitial);
  const [customTurma, setCustomTurma] = useState<string>(isCustomInitial ? initialTurma : '');

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincroniza estado quando modal abre
  useEffect(() => {
    if (isOpen) {
      setSelectedAvatar(state.studentAvatar || '🐧');
      setNickname(state.studentNickname || '');
      setSelectedRpgClass(state.rpgClass || 'warrior');
      const cls = state.studentClass || '';
      if (cls && !ALL_STANDARD_CLASSES.includes(cls)) {
        setSelectedTurma('');
        setIsCustomMode(true);
        setCustomTurma(cls);
      } else {
        setSelectedTurma(cls);
        setIsCustomMode(false);
        setCustomTurma('');
      }
    }
  }, [isOpen, state.studentAvatar, state.studentNickname, state.studentClass, state.rpgClass]);

  if (!isOpen) return null;

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSelectClass = (cls: string) => {
    setSelectedTurma(cls);
    setIsCustomMode(false);
    sound.playKeyStroke();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playUpgrade();
    
    // Determina a turma final
    const finalTurma = isCustomMode ? customTurma.trim() : selectedTurma;

    onSave(selectedAvatar, nickname.trim(), finalTurma, selectedRpgClass);
  };

  const handleSelectAvatar = (emoji: string) => {
    setSelectedAvatar(emoji);
    sound.playKeyStroke();
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
      showToast('Login com Google realizado com sucesso!', 'success');
    } catch {
      showToast('Não foi possível conectar com o Google.', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(state, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const cleanNick = (nickname || state.studentName || 'aluno').replace(/[^a-zA-Z0-9_-]/g, '_');
      const exportFileDefaultName = `typeclicker_backup_${cleanNick}_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      sound.playUpgrade();
      showToast('Save exportado com sucesso!', 'success');
    } catch {
      showToast('Erro ao exportar o save.', 'error');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && typeof json === 'object') {
          onImportState(json);
          sound.playUpgrade();
          showToast('Save importado com sucesso!', 'success');
        }
      } catch {
        showToast('Arquivo inválido ou corrompido.', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const currentAvatarObj = AVATAR_OPTIONS.find((a) => a.emoji === selectedAvatar) || AVATAR_OPTIONS[0];
  const activeClassDisplay = isCustomMode ? customTurma : selectedTurma;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-[#12151d] border-2 border-emerald-500/50 rounded-3xl max-w-xl w-full shadow-[0_0_40px_rgba(16,185,129,0.25)] overflow-hidden flex flex-col my-auto max-h-[92vh] relative"
        >
          {/* Toast Notification */}
          <AnimatePresence>
            {toastMsg && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg text-xs font-bold flex items-center gap-2 ${
                  toastMsg.type === 'success' ? 'bg-emerald-500 text-emerald-950' : 'bg-red-500 text-red-950'
                }`}
              >
                {toastMsg.type === 'success' ? <Check className="w-4 h-4" /> : null}
                {toastMsg.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-950/80 via-[#161c28] to-teal-950/80 p-4 sm:p-5 border-b border-[#242c3d] relative flex-shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-500/25 to-teal-500/10 border-2 border-emerald-400 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] flex-shrink-0">
                <span className="text-3xl sm:text-4xl select-none animate-bounce" style={{ animationDuration: '2.8s' }}>
                  {selectedAvatar}
                </span>
              </div>

              <div className="min-w-0">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 mb-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Perfil do Aluno
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white leading-tight truncate">
                  {nickname ? nickname : (user?.displayName || 'TypeClicker - Leopoldina')}
                </h2>
                <p className="text-xs text-emerald-300 font-medium mt-0.5 truncate">
                  Colégio Estadual Leopoldina Bittencourt Pedroso
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
            
            {/* Google Account Display */}
            {user ? (
              <div className="bg-[#0b0e14] border border-emerald-900/50 p-3.5 rounded-2xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Foto Aluno" className="w-10 h-10 rounded-full border-2 border-emerald-500/50 flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400 font-bold border-2 border-emerald-500/50 flex-shrink-0">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Conta @escola:</span>
                        <span className="text-xs font-bold text-white truncate">{user.displayName || 'Aluno(a)'}</span>
                      </div>
                      <span className="block text-[11px] text-emerald-400/90 font-mono truncate">{user.email}</span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {!showLogoutConfirm ? (
                      <button
                        type="button"
                        onClick={() => setShowLogoutConfirm(true)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-red-950/50 text-zinc-400 hover:text-red-400 text-[11px] font-bold transition border border-transparent hover:border-red-900/50 cursor-pointer"
                        title="Desconectar do Google"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Sair</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-red-950/40 p-1 rounded-lg border border-red-900/60">
                        <button
                          type="button"
                          onClick={async () => {
                            if (onLogout) {
                              await onLogout();
                            } else {
                              await logoutUser();
                            }
                          }}
                          className="px-2 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold transition cursor-pointer"
                        >
                          Sair
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowLogoutConfirm(false)}
                          className="px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold transition cursor-pointer"
                        >
                          Não
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#0b0e14] border border-amber-500/30 p-3.5 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <UserIcon className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="block text-xs font-bold text-amber-300">Faça login com seu @escola</span>
                    <span className="block text-[11px] text-zinc-400">Vincule sua conta Google para salvar seu progresso na nuvem.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer flex-shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Conectar</span>
                </button>
              </div>
            )}

            {/* Acesso de Administrador: Marcos Wrobel */}
            {!user && (
              <div className="bg-purple-950/20 border border-purple-500/30 p-2.5 rounded-xl flex items-center justify-between gap-2 text-xs font-mono">
                <div className="text-zinc-300">
                  <span className="font-bold text-amber-300">👑 Administrador: </span>
                  <span className="text-zinc-400">Conecte com <strong className="text-white">wrobel.marcos@gmail.com</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleDevAdminMode();
                    window.location.reload();
                  }}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-amber-300 border border-amber-500/30 font-bold transition cursor-pointer"
                  title="Alternar Modo de Teste ADM localmente"
                >
                  {isDevAdminModeActive() ? 'Desativar ADM Local' : 'Simular ADM Local'}
                </button>
              </div>
            )}

            {/* SEÇÃO: Apelido do Aluno */}
            <div className="space-y-1.5">
              <label htmlFor="student-nickname-input" className="block text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Seu Apelido no TypeClicker:</span>
              </label>
              <div className="relative">
                <input
                  id="student-nickname-input"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Ex: Jhow, Biel, Aninha, CyberDev..."
                  maxLength={24}
                  className="w-full bg-[#090b10] border border-zinc-700 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 transition font-medium"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-500">
                  {nickname.length}/24
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight">
                Seu nome completo do Google é mantido nos registros do colégio, e esse apelido aparecerá no jogo e nas conquistas!
              </p>
            </div>

            {/* SEÇÃO: Seleção da Turma (Formato de Botões/Cards sem Dropdown) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
                  <span>Selecione sua Turma:</span>
                </label>
                {activeClassDisplay ? (
                  <span className="text-[11px] font-mono text-sky-300 font-bold bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-500/40 flex items-center gap-1">
                    <Check className="w-3 h-3 text-sky-400 stroke-[3]" />
                    Turma: {activeClassDisplay}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-amber-400/80">
                    *Clique na sua turma abaixo
                  </span>
                )}
              </div>

              {/* Grid de Botões por Série do Colégio */}
              <div className="bg-[#090b10] p-3 sm:p-3.5 rounded-2xl border border-zinc-800 space-y-2.5">
                {SCHOOL_CLASSES_CONFIG.map((group) => (
                  <div key={group.grade} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                    <span className="text-[11px] font-mono font-bold text-zinc-400 w-16 sm:w-18 flex-shrink-0">
                      {group.grade}:
                    </span>
                    <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-1.5 flex-1">
                      {group.classes.map((cls) => {
                        const isSelected = !isCustomMode && selectedTurma === cls;
                        return (
                          <button
                            key={cls}
                            type="button"
                            onClick={() => handleSelectClass(cls)}
                            className={`h-9 sm:h-10 px-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none ${
                              isSelected
                                ? 'bg-sky-500/25 text-sky-200 border-2 border-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.45)] scale-102'
                                : 'bg-[#141822] hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 hover:border-zinc-500'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 stroke-[3]" />}
                            <span>{cls}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Opção para outra turma caso necessário */}
                <div className="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomMode((prev) => !prev);
                      if (!isCustomMode) {
                        setSelectedTurma('');
                      }
                      sound.playKeyStroke();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left sm:text-center inline-flex items-center gap-1.5 w-fit ${
                      isCustomMode
                        ? 'bg-sky-950 text-sky-300 border border-sky-500/60'
                        : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    <span>✏️ Outra turma</span>
                  </button>

                  {isCustomMode && (
                    <motion.div 
                      initial={{ opacity: 0, x: -5 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      className="flex-1"
                    >
                      <input
                        type="text"
                        value={customTurma}
                        onChange={(e) => setCustomTurma(e.target.value)}
                        placeholder="Digite sua turma (ex: Robótica, Sala de Recursos...)"
                        maxLength={25}
                        autoFocus
                        className="w-full bg-[#12151d] border border-sky-500/80 rounded-xl px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
                      />
                    </motion.div>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight">
                Importante para o <strong>Prof. Marcos Wrobel</strong> acompanhar o desempenho da sua sala nas aulas de digitação!
              </p>
            </div>

            {/* Seção: Escolha do Avatar */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-amber-400" />
                  <span>Escolha seu Avatar:</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-normal">
                  {currentAvatarObj.name}
                </span>
              </label>
              
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 bg-[#090b10] p-2.5 rounded-2xl border border-zinc-800">
                {AVATAR_OPTIONS.map((av) => {
                  const isSelected = selectedAvatar === av.emoji;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => handleSelectAvatar(av.emoji)}
                      title={av.name}
                      className={`h-11 sm:h-12 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-emerald-500/25 border-2 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-105'
                          : 'bg-[#141822] hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-500'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl select-none leading-none">{av.emoji}</span>
                      {isSelected && (
                        <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-zinc-950 p-0.5 rounded-full border-2 border-[#12151d]">
                          <Check className="w-2.5 h-2.5" strokeWidth={4} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seção: Especialização de Classe RPG */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Classe de Especialização RPG:</span>
                </span>
                <span className="text-[11px] font-mono text-amber-400 font-normal">
                  Passivas Únicas
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(Object.values(RPG_CLASSES)).map((rpg) => {
                  const isSelected = selectedRpgClass === rpg.id;
                  return (
                    <button
                      key={rpg.id}
                      type="button"
                      onClick={() => {
                        setSelectedRpgClass(rpg.id);
                        sound.playKeyStroke();
                      }}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between relative ${
                        isSelected
                          ? `${rpg.badgeBg} ${rpg.badgeBorder} shadow-lg ring-1 ring-white/10 scale-[1.02]`
                          : 'bg-[#0b0e14] border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-2xl">{rpg.icon}</span>
                          <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full border ${
                            isSelected ? `${rpg.badgeBorder} ${rpg.badgeText} bg-black/40` : 'text-zinc-500 border-zinc-800'
                          }`}>
                            {rpg.title}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-white">{rpg.name}</h4>
                        <p className="text-[10px] text-zinc-400 mt-1 leading-snug">{rpg.tagline}</p>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-white/5 space-y-1">
                        {rpg.passives.map((p) => (
                          <div key={p.title} className="text-[10px] text-zinc-300 flex items-start gap-1">
                            <span>{p.icon}</span>
                            <span className="font-semibold text-white truncate">{p.title}</span>
                          </div>
                        ))}
                      </div>

                      {isSelected && (
                        <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-black p-0.5 rounded-full shadow-md">
                          <Check className="w-3 h-3" strokeWidth={4} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seção Extra: Backup Manual */}
            <div className="bg-[#090b10] p-3 rounded-2xl border border-zinc-800 space-y-2">
              <span className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Backup Manual em Arquivo (Laboratório)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleExport}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" /> Exportar Save
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-sky-400" /> Importar Save
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept=".json" 
                  onChange={handleImport} 
                  className="hidden" 
                />
              </div>
            </div>

            {/* Aviso de Privacidade e Professor */}
            <div className="space-y-1 bg-[#090b10] p-3 rounded-2xl border border-zinc-800 text-[11px]">
              <div className="flex items-center gap-2 text-zinc-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Salvo com segurança na nuvem do Google vinculado ao seu e-mail escolar.</span>
              </div>
              <div className="flex items-center gap-2 text-amber-300/90 font-medium">
                <span className="text-sm">👨‍🏫</span>
                <span>Dúvidas ou dificuldades? Chame o <strong>Professor Marcos Wrobel</strong>!</span>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition cursor-pointer"
                >
                  Cancelar
                </button>
              )}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="flex-1 py-3 px-5 rounded-2xl font-mono text-sm font-black flex items-center justify-center gap-2 transition shadow-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              >
                <span>{selectedAvatar} Salvar Perfil e Jogar</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
