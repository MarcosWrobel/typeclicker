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
  Shield,
  Settings,
  Sword,
  Lock,
  AlertCircle
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
  onSwitchRpgClass?: (newClass: RpgClassType) => Promise<boolean> | boolean;
  onImportState: (state: GameState) => void;
  state: GameState;
  onClose?: () => void;
  onLogout?: () => Promise<void> | void;
}

type StudentModalTab = 'identity' | 'rpg' | 'account';

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  user,
  currentAvatar = '🐧',
  currentNickname = '',
  currentClass = '',
  currentRpgClass,
  onSave,
  onSwitchRpgClass,
  onImportState,
  state,
  onClose,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<StudentModalTab>('identity');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar || '🐧');
  const [nickname, setNickname] = useState<string>(currentNickname || state.studentNickname || '');
  
  const hasAssignedClass = Boolean(state.rpgClass);
  const [selectedInitialRpg, setSelectedInitialRpg] = useState<RpgClassType>(state.rpgClass || 'warrior');
  const [switchConfirmClass, setSwitchConfirmClass] = useState<RpgClassType | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const fragmentsBalance = state.cosmetics?.quantumFragments || 0;
  const canCancel = Boolean(state.studentClass && state.studentClass.trim() !== '');

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincroniza estado quando modal abre
  useEffect(() => {
    if (isOpen) {
      setSelectedAvatar(state.studentAvatar || '🐧');
      setNickname(state.studentNickname || '');
      setSelectedInitialRpg(state.rpgClass || 'warrior');
      setSwitchConfirmClass(null);
    }
  }, [isOpen, state.studentAvatar, state.studentNickname, state.studentClass, state.rpgClass]);

  if (!isOpen) return null;

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleConfirmSwitch = async () => {
    if (!switchConfirmClass || !onSwitchRpgClass) return;
    setIsSwitching(true);
    try {
      const ok = await onSwitchRpgClass(switchConfirmClass);
      if (ok) {
        showToast('Especialização alterada com sucesso! ⚔️', 'success');
        setSwitchConfirmClass(null);
      } else {
        showToast('Fragmentos Quânticos insuficientes (10 necessários)!', 'error');
      }
    } catch {
      showToast('Erro ao trocar especialização.', 'error');
    } finally {
      setIsSwitching(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sound.playUpgrade();
    const finalRpg = hasAssignedClass ? state.rpgClass : selectedInitialRpg;
    onSave(selectedAvatar, nickname.trim(), state.studentClass || '', finalRpg);
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

  const effectiveTurma = state.studentClass || '';
  const canSubmit = Boolean(nickname.trim().length > 0);
  const currentAvatarObj = AVATAR_OPTIONS.find((a) => a.emoji === selectedAvatar) || AVATAR_OPTIONS[0];
  const activeClassDisplay = effectiveTurma;
  const currentRpgObj = state.rpgClass ? RPG_CLASSES[state.rpgClass] : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="bg-[#12151d] border-2 border-emerald-500/50 rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-[0_0_40px_rgba(16,185,129,0.25)] overflow-hidden flex flex-col h-[90vh] sm:h-auto sm:max-h-[86vh] relative"
        >
          {/* Toast Notification */}
          <AnimatePresence>
            {toastMsg && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`absolute top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full shadow-lg text-xs font-bold flex items-center gap-2 ${
                  toastMsg.type === 'success' ? 'bg-emerald-500 text-emerald-950' : 'bg-red-500 text-red-950'
                }`}
              >
                {toastMsg.type === 'success' ? <Check className="w-4 h-4" /> : null}
                {toastMsg.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header Compacto & Informativo */}
          <div className="bg-gradient-to-r from-emerald-950/90 via-[#161c28] to-teal-950/90 px-4 py-3 sm:px-5 sm:py-3.5 border-b border-[#242c3d] flex-shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/10 border-2 border-emerald-400 p-0.5 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.35)] flex-shrink-0">
                  <span className="text-2xl sm:text-3xl select-none animate-bounce" style={{ animationDuration: '3s' }}>
                    {selectedAvatar}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.2 rounded-full border border-emerald-500/40">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400 inline mr-1" />
                      Perfil do Aluno
                    </span>
                    {activeClassDisplay && (
                      <span className="text-[10px] font-mono font-bold text-sky-300 bg-sky-950/80 px-2 py-0.2 rounded-full border border-sky-500/40 truncate">
                        {activeClassDisplay}
                      </span>
                    )}
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-white leading-tight truncate mt-0.5">
                    {nickname ? nickname : (user?.displayName || 'Aluno(a) Leopoldina')}
                  </h2>
                </div>
              </div>

              {/* Badge de Classe RPG no Topo */}
              <div className="hidden sm:flex items-center gap-2 bg-[#0d1017] px-3 py-1.5 rounded-xl border border-zinc-700/60 flex-shrink-0">
                <span className="text-xl">{currentRpgObj ? currentRpgObj.icon : '⏳'}</span>
                <div className="text-left">
                  <span className="block text-[10px] text-zinc-400 uppercase font-mono font-bold">Classe</span>
                  <span className="block text-xs font-black text-amber-300">{currentRpgObj ? currentRpgObj.name : 'Aguardando Prof.'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de Abas Compacta */}
          <div className="flex items-center px-4 sm:px-6 bg-[#0e1118] border-b border-[#242c3d] flex-shrink-0 gap-2 sm:gap-4 overflow-x-auto py-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('identity');
                sound.playKeyStroke();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'identity'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>1. Identidade & Turma</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('rpg');
                sound.playKeyStroke();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'rpg'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Sword className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Classe RPG {currentRpgObj ? `(${currentRpgObj.name})` : ''}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('account');
                sound.playKeyStroke();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'account'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-[0_0_10px_rgba(56,189,248,0.25)]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-sky-400" />
              <span>3. Conta & Backup</span>
            </button>
          </div>

          {/* Formulário com Área com Rolagem Independente */}
          <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col">
            <div className="p-3.5 sm:p-5 overflow-y-auto flex-1 space-y-3.5 sm:space-y-4">

              {/* ABA 1: IDENTIDADE & TURMA */}
              {activeTab === 'identity' && (
                <div className="space-y-3.5">
                  {/* Apelido do Aluno */}
                  <div className="space-y-1">
                    <label htmlFor="student-nickname-input" className="block text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Seu Apelido no Jogo:</span>
                    </label>
                    <div className="relative">
                      <input
                        id="student-nickname-input"
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="Ex: Jhow, Biel, Aninha, CyberDev..."
                        maxLength={24}
                        className="w-full bg-[#090b10] border border-zinc-700 focus:border-emerald-400 rounded-xl px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 transition font-medium"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-500">
                        {nickname.length}/24
                      </span>
                    </div>
                  </div>

                  {/* Informações da Turma Escolar (Vinculada por Sessão) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
                        <span>Turma da Sessão Escolar:</span>
                      </label>
                      {state.studentClass ? (
                        <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
                          {state.studentClass}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-amber-400/90 font-bold">*Aguardando Código</span>
                      )}
                    </div>

                    {state.studentClass ? (
                      <div className="bg-[#090b10] p-3 rounded-2xl border border-emerald-500/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
                              <Lock className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 block tracking-wider">
                                Turma Vinculada pela Aula
                              </span>
                              <span className="text-sm font-black text-white font-mono">
                                {state.studentClass}
                              </span>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" /> Sincronizada
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-snug border-t border-zinc-800/80 pt-2 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                          <span>Sua turma é vinculada automaticamente pelo código de aula iniciado pelo <strong>Professor Marcos</strong>.</span>
                        </p>
                      </div>
                    ) : (
                      <div className="bg-[#090b10] p-3 rounded-2xl border border-amber-500/30 space-y-2">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block tracking-wider">
                              Aguardando Código da Aula
                            </span>
                            <span className="text-xs text-zinc-300">
                              Sua turma será vinculada automaticamente assim que você digitar o código da aula no laboratório.
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Escolha do Avatar em Grade Compacta */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Smile className="w-3.5 h-3.5 text-amber-400" />
                        <span>Escolha seu Avatar:</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-normal">
                        {currentAvatarObj.name}
                      </span>
                    </label>

                    <div className="grid grid-cols-8 gap-1.5 bg-[#090b10] p-2 rounded-2xl border border-zinc-800">
                      {AVATAR_OPTIONS.map((av) => {
                        const isSelected = selectedAvatar === av.emoji;
                        return (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => handleSelectAvatar(av.emoji)}
                            title={av.name}
                            className={`h-9 sm:h-10 rounded-xl flex items-center justify-center transition cursor-pointer relative ${
                              isSelected
                                ? 'bg-emerald-500/25 border-2 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)] scale-105'
                                : 'bg-[#141822] hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-500'
                            }`}
                          >
                            <span className="text-xl select-none leading-none">{av.emoji}</span>
                            {isSelected && (
                              <span className="absolute -top-1 -right-1 bg-emerald-500 text-zinc-950 p-0.5 rounded-full">
                                <Check className="w-2 h-2" strokeWidth={4} />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 2: CLASSE RPG */}
              {activeTab === 'rpg' && (
                <div className="space-y-3">
                  <div className="bg-[#090b10] p-3 rounded-2xl border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Sword className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                          Especializações de Combate da Turma
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>{fragmentsBalance} Fragmentos ✨</span>
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {!hasAssignedClass
                        ? 'Escolha sua especialização inicial gratuita para a Raid Coletiva. Cada classe possui bônus passivos e estilo único de combate!'
                        : 'Sua especialização de combate está ativa. Você pode trocar de classe na Forja Quântica gastando 10 Fragmentos Quânticos ✨.'}
                    </p>
                  </div>

                  {!hasAssignedClass ? (
                    /* Escolha Inicial Gratuita */
                    <div className="space-y-2">
                      <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
                        <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span><strong>1ª Escolha Gratuita:</strong> Selecione sua classe de combate inicial:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {(Object.values(RPG_CLASSES)).map((rpg) => {
                          const isSelected = selectedInitialRpg === rpg.id;
                          return (
                            <button
                              key={rpg.id}
                              type="button"
                              onClick={() => {
                                setSelectedInitialRpg(rpg.id);
                                sound.playKeyStroke();
                              }}
                              className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between relative ${
                                isSelected
                                  ? `${rpg.badgeBg} ${rpg.badgeBorder} shadow-lg ring-2 ring-emerald-400/60 scale-[1.02]`
                                  : 'bg-[#090b10] border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="text-2xl">{rpg.icon}</span>
                                  <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full border ${
                                    isSelected ? `${rpg.badgeBorder} ${rpg.badgeText} bg-black/50` : 'text-zinc-500 border-zinc-800'
                                  }`}>
                                    {isSelected ? 'Selecionada' : rpg.title}
                                  </span>
                                </div>
                                <h4 className="text-sm font-black text-white">{rpg.name}</h4>
                                <p className="text-[11px] text-zinc-400 mt-0.5 leading-tight">{rpg.tagline}</p>
                              </div>

                              <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1">
                                {rpg.passives.map((p) => (
                                  <div key={p.title} className="text-[10px] text-zinc-300 flex items-start gap-1">
                                    <span className="flex-shrink-0">{p.icon}</span>
                                    <span className="font-semibold text-white leading-tight">{p.title}</span>
                                  </div>
                                ))}
                              </div>

                              {isSelected && (
                                <span className="absolute -top-1.5 -right-1.5 bg-emerald-400 text-black p-0.5 rounded-full shadow-md">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Já possui classe: Exibe ativa e botão de troca por 10 fragmentos */
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {(Object.values(RPG_CLASSES)).map((rpg) => {
                        const isAssigned = state.rpgClass === rpg.id;
                        const canAfford = fragmentsBalance >= 10;
                        return (
                          <div
                            key={rpg.id}
                            className={`p-3 rounded-2xl border text-left flex flex-col justify-between relative transition-all ${
                              isAssigned
                                ? `${rpg.badgeBg} ${rpg.badgeBorder} shadow-lg ring-2 ring-amber-400/50 scale-[1.02]`
                                : 'bg-[#090b10]/90 border-zinc-800/80'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-2xl">{rpg.icon}</span>
                                <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full border ${
                                  isAssigned ? `${rpg.badgeBorder} ${rpg.badgeText} bg-black/50 shadow-sm` : 'text-zinc-500 border-zinc-800'
                                }`}>
                                  {isAssigned ? '🛡️ Sua Classe' : rpg.title}
                                </span>
                              </div>
                              <h4 className={`text-sm font-black ${isAssigned ? 'text-white' : 'text-zinc-300'}`}>{rpg.name}</h4>
                              <p className="text-[11px] text-zinc-400 mt-0.5 leading-tight">{rpg.tagline}</p>
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1">
                              {rpg.passives.map((p) => (
                                <div key={p.title} className="text-[10px] text-zinc-300 flex items-start gap-1">
                                  <span className="flex-shrink-0">{p.icon}</span>
                                  <span className="font-semibold text-white leading-tight">{p.title}</span>
                                </div>
                              ))}
                            </div>

                            {/* Botão de Troca ou Badge Ativa */}
                            <div className="mt-3 pt-2.5 border-t border-zinc-800/80">
                              {isAssigned ? (
                                <div className="text-center py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-xl text-[11px] font-bold text-amber-300 flex items-center justify-center gap-1.5">
                                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Classe Ativa</span>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  disabled={!canAfford}
                                  onClick={() => setSwitchConfirmClass(rpg.id)}
                                  className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-mono font-bold transition flex items-center justify-center gap-1.5 ${
                                    canAfford
                                      ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md cursor-pointer'
                                      : 'bg-zinc-800/80 text-zinc-500 border border-zinc-700/50 cursor-not-allowed'
                                  }`}
                                >
                                  <Sparkles className="w-3 h-3 text-amber-900" />
                                  <span>{canAfford ? `Trocar (10 ✨)` : `Faltam ${10 - fragmentsBalance} ✨`}</span>
                                </button>
                              )}
                            </div>

                            {isAssigned && (
                              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-black p-0.5 rounded-full shadow-md">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ABA 3: CONTA & BACKUP */}
              {activeTab === 'account' && (
                <div className="space-y-3">
                  {/* Google Account */}
                  {user ? (
                    <div className="bg-[#0b0e14] border border-emerald-900/50 p-3 rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="Foto Aluno" className="w-10 h-10 rounded-full border-2 border-emerald-500/50 flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400 font-bold border-2 border-emerald-500/50 flex-shrink-0">
                            {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Conta Google Vinculada:</span>
                          <span className="text-xs font-bold text-white truncate block">{user.displayName || 'Aluno(a)'}</span>
                          <span className="text-[11px] text-emerald-400/90 font-mono truncate block">{user.email}</span>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {!showLogoutConfirm ? (
                          <button
                            type="button"
                            onClick={() => setShowLogoutConfirm(true)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-red-950/50 text-zinc-400 hover:text-red-400 text-xs font-bold transition border border-transparent hover:border-red-900/50 cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sair</span>
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
                              className="px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold transition cursor-pointer"
                            >
                              Sair
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowLogoutConfirm(false)}
                              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold transition cursor-pointer"
                            >
                              Não
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#0b0e14] border border-amber-500/30 p-3 rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <UserIcon className="w-5 h-5 text-amber-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="block text-xs font-bold text-amber-300">Faça login com seu @escola</span>
                          <span className="block text-[11px] text-zinc-400 truncate">Vincule sua conta Google para salvar seu progresso na nuvem.</span>
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

                  {/* Backup Manual em Arquivo JSON */}
                  <div className="bg-[#090b10] p-3 rounded-2xl border border-zinc-800 space-y-2">
                    <span className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      Backup Manual em Arquivo (Laboratório)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleExport}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" /> Exportar Save
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition cursor-pointer"
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

                  {/* Informações do Colégio e Professor */}
                  <div className="space-y-1.5 bg-[#090b10] p-3 rounded-2xl border border-zinc-800 text-[11px]">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>Salvo com segurança na nuvem do Google vinculado ao seu e-mail escolar.</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-300/90 font-medium">
                      <span className="text-sm">👨‍🏫</span>
                      <span>Dúvidas ou dificuldades? Chame o <strong>Professor Marcos Wrobel</strong>!</span>
                    </div>
                  </div>

                  {/* Simulação ADM (quando deslogado) */}
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
                        className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-amber-300 border border-amber-500/30 font-bold transition cursor-pointer flex-shrink-0"
                      >
                        {isDevAdminModeActive() ? 'Desativar ADM Local' : 'Simular ADM Local'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Rodapé Fixo com Botão Sempre Visível */}
            <div className="p-3 sm:p-4 border-t border-[#242c3d] bg-[#0e1118] flex items-center justify-end gap-2.5 flex-shrink-0">
              {canCancel && onClose && (
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
                disabled={!canSubmit}
                whileHover={canSubmit ? { scale: 1.02 } : {}}
                whileTap={canSubmit ? { scale: 0.97 } : {}}
                className={`flex-1 py-2.5 sm:py-3 px-5 rounded-xl font-mono text-sm font-black flex items-center justify-center gap-2 transition shadow-lg ${
                  canSubmit
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60 border border-zinc-700/50'
                }`}
              >
                <span>{canSubmit ? `${selectedAvatar} Salvar Perfil e Jogar` : '⚠️ Digite seu Apelido para Continuar'}</span>
                {canSubmit && <ArrowRight className="w-4 h-4" />}
              </motion.button>
            </div>
          </form>

          {/* Modal de Confirmação de Troca de Classe */}
          <AnimatePresence>
            {switchConfirmClass && (
              <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-[#151922] border-2 border-amber-500/60 rounded-2xl p-5 max-w-md w-full shadow-[0_0_30px_rgba(245,158,11,0.3)] space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl flex-shrink-0">
                      {RPG_CLASSES[switchConfirmClass]?.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">
                        Trocar para {RPG_CLASSES[switchConfirmClass]?.name}?
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Esta alteração consome <strong>10 Fragmentos Quânticos ✨</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#090b10] p-3 rounded-xl border border-zinc-800 text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between text-zinc-400">
                      <span>Saldo Atual:</span>
                      <span className="text-amber-300 font-bold">{fragmentsBalance} ✨</span>
                    </div>
                    <div className="flex justify-between text-red-400">
                      <span>Custo da Troca:</span>
                      <span className="font-bold">-10 ✨</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 border-t border-zinc-800 pt-1.5">
                      <span>Saldo Restante:</span>
                      <span className="font-bold">{fragmentsBalance - 10} ✨</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      disabled={isSwitching}
                      onClick={() => setSwitchConfirmClass(null)}
                      className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      disabled={isSwitching}
                      onClick={handleConfirmSwitch}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-xs font-black text-zinc-950 transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                    >
                      {isSwitching ? (
                        <span>Trocando...</span>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Confirmar (10 ✨)</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
