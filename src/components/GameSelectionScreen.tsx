import React from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Gamepad2, 
  Keyboard, 
  Timer, 
  Swords, 
  Flag, 
  Trophy, 
  Shield, 
  LogOut, 
  Sparkles, 
  ChevronRight, 
  User, 
  Flame, 
  Zap, 
  ArrowRight,
  Sparkle,
  Cpu,
  Compass,
  Boxes
} from 'lucide-react';
import { GameState, CurricularTrackId } from '../types';
import { RPG_CLASSES } from '../types/rpgClass';
import { ClassroomRace } from '../types/race';
import { ClassroomRaid } from '../types/raid';
import { HubConfig } from '../services/firebaseService';
import { calculatePlayerRank, formatBytes } from '../utils/formatting';
import { getCurricularTrack } from '../data/tracks';
import { getOverallAchievementsStats } from '../services/achievementEngine';
import { sound } from '../utils/audio';
import { LeaderboardMetric } from './LeaderboardModal';

export interface GameSelectionScreenProps {
  user: any;
  state: GameState;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
  activeTurma: string | null;
  activeTrack: CurricularTrackId | null;
  activeRace: ClassroomRace | null;
  activeRaid: ClassroomRaid | null;
  /** Configuração docente do hub: jogos desativados, jogo em destaque */
  hubConfig?: HubConfig | null;
  onSelectGame: (gameId: 'typeclicker' | 'type_radar' | 'time_attack' | 'dungeon') => void;
  onOpenStudentModal: () => void;
  onOpenAdmin: () => void;
  onOpenLeaderboard: () => void;
  onOpenLeaderboardTab?: (metric: LeaderboardMetric) => void;
  onOpenCosmetics?: () => void;
  onOpenRaceArena: () => void;
  onOpenRaidArena: () => void;
  onLogout: () => void;
}

export const GameSelectionScreen: React.FC<GameSelectionScreenProps> = ({
  user,
  state,
  isAdmin,
  isSuperAdmin = false,
  activeTurma,
  activeTrack,
  activeRace,
  activeRaid,
  hubConfig,
  onSelectGame,
  onOpenStudentModal,
  onOpenAdmin,
  onOpenLeaderboard,
  onOpenLeaderboardTab,
  onOpenCosmetics,
  onOpenRaceArena,
  onOpenRaidArena,
  onLogout
}) => {
  const playerRank = calculatePlayerRank(state.totalBytesEarned);
  const achievementsStats = getOverallAchievementsStats(state);
  const studentNickname = state.studentNickname || state.studentName || user?.displayName || 'Aluno';
  const studentClass = state.studentClass || activeTurma || 'Sem turma';
  const currentRpgClass = state.rpgClass ? RPG_CLASSES[state.rpgClass] : null;

  /**
   * Determina se um jogo deve ser ocultado para alunos não-admin.
   * Admins/professores sempre vêem todos os jogos.
   */
  const isGameDisabled = (gameId: string): boolean => {
    if (isAdmin) return false; // professor vê tudo
    return Array.isArray(hubConfig?.disabledGames) && hubConfig!.disabledGames.includes(gameId);
  };

  const isRaceActive = Boolean(
    activeRace && 
    (activeRace.status === 'countdown' || activeRace.status === 'in_progress')
  );

  const isRaidActive = Boolean(
    activeRaid && 
    activeRaid.status === 'in_progress'
  );

  const handlePlayTypeClicker = () => {
    if (isGameDisabled('typeclicker')) return;
    sound.playWordComplete();
    onSelectGame('typeclicker');
  };

  const handlePlayTypeRadar = () => {
    if (isGameDisabled('type_radar')) return;
    sound.playWordComplete();
    onSelectGame('type_radar');
  };

  const handlePlayTimeAttack = () => {
    if (isGameDisabled('time_attack')) return;
    sound.playWordComplete();
    onSelectGame('time_attack');
  };

  const handlePlayDungeon = () => {
    if (isGameDisabled('dungeon')) return;
    sound.playWordComplete();
    onSelectGame('dungeon');
  };

  return (
    <div className="min-h-screen bg-[#0e1013] text-zinc-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-emerald-500 selection:text-black">
      {/* Background Decorativo Tech & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Barra de Navegação Superior */}
      <header className="border-b border-zinc-800/80 bg-[#12151c]/90 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 py-3 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          
          {/* Logo & Escola */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-sky-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono text-xl shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              🎮
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white tracking-tight">TypeClicker</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                  PLATAFORMA
                </span>
              </div>
              <p className="text-xs text-zinc-400 truncate max-w-[240px] sm:max-w-md">
                Colégio Estadual Leopoldina Bittencourt Pedroso
              </p>
            </div>
          </div>

          {/* Dados do Aluno e Ações de Cabeçalho */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            
            {/* Card Rápido de Perfil do Aluno */}
            <button
              type="button"
              onClick={onOpenStudentModal}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-700/60 hover:border-emerald-500/50 transition cursor-pointer shadow-sm group"
              title="Clique para editar seu perfil, apelido e avatar"
            >
              <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                {state.studentAvatar || '🐧'}
              </span>
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white max-w-[120px] truncate">
                    {studentNickname}
                  </span>
                  {currentRpgClass && (
                    <span title={currentRpgClass.name} className="text-xs">
                      {currentRpgClass.icon}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                  <span className="text-emerald-400 font-semibold">{studentClass}</span>
                  <span>•</span>
                  <span className="text-amber-300 font-semibold">Nv.{playerRank.level}</span>
                </div>
              </div>
            </button>

            {/* Central de Customização */}
            {onOpenCosmetics && (
              <button
                type="button"
                onClick={onOpenCosmetics}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/70 text-purple-200 border border-purple-500/50 text-xs font-bold transition cursor-pointer shadow-sm group"
                title="Central de Customização: Skins, Temas, Sons e Molduras"
              >
                <Sparkles className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">Customização</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/25 text-purple-300 font-extrabold">
                  {state.cosmetics?.levelTokens ?? 0}🪙
                </span>
              </button>
            )}

            {/* Ranking Escolar */}
            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40 text-xs font-bold transition cursor-pointer shadow-sm"
              title="Ver Ranking Escolar"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Ranking</span>
            </button>

            {/* Painel do Professor (Admin) */}
            {isAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 text-rose-200 border border-rose-500/40 text-xs font-bold transition cursor-pointer shadow-sm"
                title="Painel de Controle do Professor"
              >
                <Shield className="w-4 h-4 text-rose-400" />
                <span className="hidden md:inline">Painel Admin</span>
              </button>
            )}

            {/* Logout */}
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-semibold transition cursor-pointer"
              title="Sair da Conta"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">Sair</span>
            </button>
          </div>

        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full relative z-10 flex flex-col gap-6">
        
        {/* Banner de Sessão Ativa / Turma */}
        {(activeTurma || activeTrack) && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-zinc-900/60 to-emerald-950/40 border border-purple-500/30 flex items-center justify-between gap-3 flex-wrap shadow-lg"
          >
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xl">🎒</span>
              <span className="text-xs sm:text-sm font-medium text-zinc-300">
                Sessão em Andamento no Laboratório:
              </span>
              {activeTurma && (
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
                  Turma: {activeTurma}
                </span>
              )}
              {activeTrack && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1">
                  <span>{getCurricularTrack(activeTrack).icon}</span>
                  <span>{getCurricularTrack(activeTrack).name.split('(')[0].trim()}</span>
                </span>
              )}
            </div>

            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Computador Liberado
            </span>
          </motion.div>
        )}

        {/* Notificação de Corrida Escolar Ativa */}
        {isRaceActive && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-orange-950/80 to-amber-950/80 border-2 border-amber-500/70 shadow-[0_0_30px_rgba(245,158,11,0.35)] flex items-center justify-between gap-4 flex-wrap animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black text-2xl shadow-lg">
                🏁
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-mono text-[10px] font-black uppercase">
                    CORRIDA EM TEMPO REAL
                  </span>
                  <span className="text-xs text-amber-200 font-mono">
                    Disparada pelo Professor!
                  </span>
                </div>
                <h4 className="text-base font-black text-white font-mono mt-0.5">
                  Corrida Sincronizada da Turma Aberta
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenRaceArena}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer transition transform hover:scale-105 active:scale-95"
            >
              <Flag className="w-4 h-4 fill-current" />
              <span>Entrar na Corrida Agora</span>
            </button>
          </motion.div>
        )}

        {/* Notificação de Raid Coletiva contra Chefão */}
        {isRaidActive && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/90 via-red-900/80 to-rose-950/90 border-2 border-rose-500/70 shadow-[0_0_30px_rgba(244,63,94,0.35)] flex items-center justify-between gap-4 flex-wrap animate-pulse"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">{activeRaid?.bossIcon || '👹'}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-mono text-[10px] font-black uppercase">
                    RAID COLETIVA ATIVA
                  </span>
                  <span className="text-xs text-rose-200 font-mono">
                    {activeRaid?.currentHp.toLocaleString()} / {activeRaid?.maxHp.toLocaleString()} HP
                  </span>
                </div>
                <h4 className="text-base font-black text-white font-mono mt-0.5">
                  {activeRaid?.bossName} — Invasão ao Sistema!
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenRaidArena}
              className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-mono font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer transition transform hover:scale-105 active:scale-95"
            >
              <Swords className="w-4 h-4" />
              <span>Entrar na Batalha</span>
            </button>
          </motion.div>
        )}

        {/* Título de Boas-Vindas e Resumo do Aluno */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Hub de Aprendizagem
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Escolha seu Jogo Educacional
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Pratique velocidade de digitação, supere desafios cognitivos e ganhe recompensas no colégio.
            </p>
          </div>

          {/* Pílulas de Estatísticas Rápidas do Aluno */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono flex items-center gap-1.5 shadow-inner">
              <span className="text-amber-400 font-bold">Nv.{playerRank.level}</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-300">{playerRank.title}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono flex items-center gap-1.5 shadow-inner">
              <span className="text-emerald-400 font-bold">{formatBytes(state.totalBytesEarned)}</span>
              <span className="text-zinc-500">acumulados</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono flex items-center gap-1.5 shadow-inner">
              <span className="text-sky-400 font-bold">{achievementsStats.unlocked}</span>
              <span className="text-zinc-500">conquistas</span>
            </div>
          </div>
        </div>

        {/* Banner Vitrine da Central de Customização */}
        {onOpenCosmetics && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-950/70 via-[#141624] to-indigo-950/60 border border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.15)] flex items-center justify-between gap-4 flex-wrap"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/30 via-indigo-500/20 to-pink-500/20 border border-purple-500/50 flex items-center justify-center text-2xl shadow-inner shrink-0">
                🎨
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-black uppercase tracking-wider">
                    LOJA & CÂMBIO DE RECOMPENSAS
                  </span>
                  <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                    Disponível no Colégio Leopoldina
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white font-mono mt-0.5 truncate">
                  Central de Customização do Aluno
                </h3>
                <p className="text-xs text-zinc-300 mt-0.5 line-clamp-1">
                  Converta seus Bytes dos jogos em Fichas 🪙 e desbloqueie temas retrô, skins do mascote Bytezinho, sons mecânicos e molduras de perfil!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap ml-auto">
              <div className="flex items-center gap-2 bg-black/40 border border-zinc-800 px-3 py-1.5 rounded-xl font-mono text-xs">
                <span className="text-zinc-400">Saldo:</span>
                <span className="text-emerald-400 font-bold">{formatBytes(state.bytes)}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-amber-300 font-bold">{state.cosmetics?.levelTokens ?? 0} Fichas 🪙</span>
              </div>

              <button
                type="button"
                onClick={onOpenCosmetics}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white font-mono font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer transition transform hover:scale-105 active:scale-95 shrink-0"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>ABRIR CUSTOMIZAÇÃO</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Grid de Cards de Jogos da Plataforma */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* CARD 1: TYPECLICKER CLÁSSICO (Principal) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="group relative rounded-3xl bg-[#12151c] border-2 border-emerald-500/60 hover:border-emerald-400 p-6 flex flex-col justify-between shadow-[0_0_35px_rgba(16,185,129,0.15)] transition-all overflow-hidden"
          >
            {/* Glow decorativo de fundo */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />

            <div>
              {/* Badge Superior */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-mono text-[11px] font-black tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  DISPONÍVEL AGORA
                </span>
                <span className="text-2xl">⌨️</span>
              </div>

              {/* Título & Descrição */}
              <h2 className="text-2xl font-black text-white group-hover:text-emerald-300 transition-colors tracking-tight">
                TypeClicker Classic
              </h2>
              <p className="text-xs font-mono text-emerald-400/90 font-semibold mb-3">
                Terminal de Digitação & Evolução Incremental
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                O simulador clássico completo. Pratique digitação veloz de palavras reais, compre upgrades de hardware (CPU, RAM, Quântico), suba de nível e lidere o placar da turma!
              </p>

              {/* Tags / Recursos */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  ⚡ Idle & Digitação
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  💻 Hardware Shop
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  🏆 Conquistas
                </span>
              </div>
            </div>

            {/* Ação / Botão Jogar */}
            <div className="pt-4 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={handlePlayTypeClicker}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-sm font-mono uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all cursor-pointer transform group-hover:scale-[1.02] active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>JOGAR TYPECLICKER</span>
              </button>
            </div>
          </motion.div>

          {/* CARD 2: TYPE: RADAR (Roguelike Bullet Hell de Digitação) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="group relative rounded-3xl bg-[#12151c] border-2 border-cyan-500/50 hover:border-cyan-400 p-6 flex flex-col justify-between shadow-[0_0_35px_rgba(6,182,212,0.15)] transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-colors" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-mono text-[11px] font-black tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  NOVO JOGO STANDALONE
                </span>
                <span className="text-2xl">📡</span>
              </div>

              <h2 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                Type: Radar
              </h2>
              <p className="text-xs font-mono text-cyan-400/90 font-semibold mb-3">
                Defesa Cibernética & Roguelike de Digitação
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                Proteja a base central contra hordas de mísseis e drones que avançam no radar! Trave a mira digitando os códigos de terminal, execute comandos como /nuke e /freeze e escolha cartas de upgrades entre ondas!
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  🎯 Trava de Mira
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  💥 Comandos /NUKE
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  🃏 Cartas Roguelike
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={handlePlayTypeRadar}
                className="flex-1 w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-teal-400 text-black font-black text-sm font-mono uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer transform group-hover:scale-[1.02] active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>JOGAR TYPE: RADAR</span>
              </button>
              {onOpenLeaderboardTab && (
                <button
                  type="button"
                  onClick={() => onOpenLeaderboardTab('radar')}
                  className="w-full sm:w-auto px-4 py-4 rounded-2xl bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/50 text-cyan-300 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title="Ver Ranking do Type: Radar"
                >
                  <Trophy className="w-4 h-4 text-cyan-400" />
                  <span>Ranking</span>
                </button>
              )}
            </div>
          </motion.div>

          {/* CARD 3: SPRINT TIME ATTACK (Velocidade Pura) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="group relative rounded-3xl bg-[#12151c] border border-amber-500/40 hover:border-amber-400 p-6 flex flex-col justify-between shadow-lg transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-colors" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-black tracking-wider flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5 text-amber-400" />
                  MODALIDADE SPRINT
                </span>
                <span className="text-2xl">⚡</span>
              </div>

              <h2 className="text-2xl font-black text-white group-hover:text-amber-300 transition-colors tracking-tight">
                Sprint Time Attack
              </h2>
              <p className="text-xs font-mono text-amber-400/90 font-semibold mb-3">
                Desafio de 30s & 60s contra o Relógio
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                Foco total em velocidade pura e precisão. Teste seu WPM (Palavras Por Minuto) sem pausas ou distrações e supere o tempo limite com zero erros!
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  ⏱️ 30s e 60s
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  🔥 WPM Recorde
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  🎯 Foco Motor
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={handlePlayTimeAttack}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer transform group-hover:scale-[1.02] active:scale-95"
              >
                <Timer className="w-4 h-4" />
                <span>INICIAR SPRINT</span>
              </button>
            </div>
          </motion.div>

          {/* CARD 3: MASMORRA DOS CÓDIGOS (RPG ROGUELIKE) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="group relative rounded-3xl bg-[#12151c] border border-purple-500/40 hover:border-purple-400 p-6 flex flex-col justify-between shadow-lg transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-colors" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/40 text-purple-300 font-mono text-[11px] font-black tracking-wider flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-purple-400" />
                  RPG ROGUELIKE
                </span>
                <span className="text-2xl">🗝️</span>
              </div>

              <h2 className="text-2xl font-black text-white group-hover:text-purple-300 transition-colors tracking-tight">
                Masmorra dos Códigos
              </h2>
              <p className="text-xs font-mono text-purple-400/90 font-semibold mb-3">
                Aventura RPG & Batalhas por Digitação
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                Desça pelos andares da masmorra digital! Derrote sentinelas, gaste chaves em baús misteriosos e equipe relíquias lendárias para bônus permanentes.
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  ⚔️ Andar {state.quests?.rpgDungeonFloor ?? 1}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  🗝️ {state.quests?.dungeon?.keys ?? 3} Chaves
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  🛡️ Equipamentos
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={handlePlayDungeon}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer transform group-hover:scale-[1.02] active:scale-95"
              >
                <Swords className="w-4 h-4" />
                <span>EXPLORAR MASMORRA</span>
              </button>
            </div>
          </motion.div>

          {/* CARD 4: CORRIDA DA TURMA (Multijogador Sincronizado) */}
          <motion.div
            whileHover={{ y: -4 }}
            className={`group relative rounded-3xl bg-[#12151c] p-6 flex flex-col justify-between shadow-lg transition-all overflow-hidden ${
              isRaceActive
                ? 'border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
                : 'border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full font-mono text-[11px] font-black tracking-wider flex items-center gap-1.5 ${
                  isRaceActive 
                    ? 'bg-amber-500 text-black' 
                    : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700'
                }`}>
                  <Flag className="w-3.5 h-3.5" />
                  {isRaceActive ? 'AO VIVO NA TURMA' : 'MODO SALA DE AULA'}
                </span>
                <span className="text-2xl">🏎️</span>
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight">
                Corrida Sincronizada
              </h2>
              <p className="text-xs font-mono text-zinc-400 font-semibold mb-3">
                Disputa de Digitação em Tempo Real
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Todos os alunos do laboratório largam no mesmo instante ao comando do professor. Quem digitar o texto com mais rapidez e menos erros sobe ao pódio da turma!
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
                  👥 Turma Toda
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
                  🏁 Pódio da Aula
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex flex-col gap-2">
              {isRaceActive ? (
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={onOpenRaceArena}
                    className="flex-1 w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer animate-pulse"
                  >
                    <Flag className="w-4 h-4 fill-current" />
                    <span>ENTRAR NA CORRIDA ATIVA</span>
                  </button>
                  {onOpenLeaderboardTab && (
                    <button
                      type="button"
                      onClick={() => onOpenLeaderboardTab('races')}
                      className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/50 text-amber-300 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer hover:scale-105 active:scale-95"
                      title="Ver Ranking de Corridas da Turma"
                    >
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>Ranking</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="flex-1 py-3 px-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center text-xs font-mono text-zinc-500">
                    Aguardando início pelo professor
                  </div>
                  {onOpenLeaderboardTab && (
                    <button
                      type="button"
                      onClick={() => onOpenLeaderboardTab('races')}
                      className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/50 text-amber-300 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer hover:scale-105 active:scale-95"
                      title="Ver Ranking de Corridas em Sala"
                    >
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>Ranking Corridas</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* CARD 5: RAID COLETIVA CONTRA CHEFÃO */}
          <motion.div
            whileHover={{ y: -4 }}
            className={`group relative rounded-3xl bg-[#12151c] p-6 flex flex-col justify-between shadow-lg transition-all overflow-hidden ${
              isRaidActive
                ? 'border-2 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.25)]'
                : 'border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full font-mono text-[11px] font-black tracking-wider flex items-center gap-1.5 ${
                  isRaidActive 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700'
                }`}>
                  <Swords className="w-3.5 h-3.5" />
                  {isRaidActive ? 'CHEFE INVASOR ATIVO' : 'COOPERATIVO'}
                </span>
                <span className="text-2xl">👹</span>
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight">
                Raid Coletiva da Sala
              </h2>
              <p className="text-xs font-mono text-zinc-400 font-semibold mb-3">
                Batalha Cooperativa contra Chefão
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Uma criatura de sistema com milhares de pontos de vida ataca a rede. Todos os alunos combinam seu dano de digitação simultaneamente para salvar o laboratório!
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
                  🤝 Dano Coletivo
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
                  🎁 Recompensa Geral
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80">
              {isRaidActive ? (
                <button
                  type="button"
                  onClick={onOpenRaidArena}
                  className="w-full py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer animate-pulse"
                >
                  <Swords className="w-4 h-4" />
                  <span>ENTRAR NA BATALHA</span>
                </button>
              ) : (
                <div className="py-3 px-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center text-xs font-mono text-zinc-500">
                  Aguardando convocação pelo professor
                </div>
              )}
            </div>
          </motion.div>

          {/* CARD 6: PRÓXIMOS JOGOS (Standalone & Variedades) */}
          <motion.div
            className="group relative rounded-3xl bg-[#12151c]/50 border-2 border-dashed border-zinc-800 p-6 flex flex-col justify-between shadow-sm overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-zinc-800/60 text-zinc-500 font-mono text-[11px] font-bold tracking-wider flex items-center gap-1.5">
                  <Boxes className="w-3.5 h-3.5" />
                  EM DESENVOLVIMENTO
                </span>
                <span className="text-2xl">✨</span>
              </div>

              <h2 className="text-2xl font-black text-zinc-400 tracking-tight">
                Novos Jogos Educacionais
              </h2>
              <p className="text-xs font-mono text-zinc-500 font-semibold mb-3">
                Expansão da Plataforma Leopoldina
              </p>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                Novas mecânicas de raciocínio lógico, quebra-cabeças de algoritmos e jogos educativos standalone serão adicionados aqui em breve para sua turma.
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900/40 border border-zinc-800 text-[11px] font-mono text-zinc-500">
                  🧩 Lógica
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900/40 border border-zinc-800 text-[11px] font-mono text-zinc-500">
                  💡 Algoritmos
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900/40 border border-zinc-800 text-[11px] font-mono text-zinc-500">
                  🚀 Novidades
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/40">
              <div className="py-3 px-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 text-center text-xs font-mono text-zinc-600 font-bold">
                Em breve na plataforma
              </div>
            </div>
          </motion.div>

        </div>

      </main>

      {/* Rodapé da Plataforma */}
      <footer className="border-t border-zinc-800/80 bg-[#12151c]/90 px-4 sm:px-6 py-4 text-center text-xs text-zinc-500 font-mono">
        <p>
          TypeClicker Educational Platform • Colégio Estadual Leopoldina Bittencourt Pedroso
        </p>
      </footer>
    </div>
  );
};
