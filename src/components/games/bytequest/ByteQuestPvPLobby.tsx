// ─────────────────────────────────────────────────────────────
// Lobby de Matchmaking — ByteQuest 1v1 Battle Royale (PvP)
// Criação e Entrada por Código de Sala, Sorteio de Classe Espelho e Confirmação
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Users, Copy, Check, ArrowLeft, Shield, Sparkles, AlertCircle, Play, Flame, Zap } from 'lucide-react';
import { ByteQuestPvPRoom, ByteQuestPvPPlayer } from '../../../types/byteQuestPvP';
import { RpgClassType } from '../../../types/rpgClass';
import {
  createByteQuestPvPRoom,
  joinByteQuestPvPRoomByCode,
  setByteQuestPvPPlayerReady,
  startByteQuestPvPGame,
  leaveByteQuestPvPRoom,
  subscribeToByteQuestPvPRoom
} from '../../../services/byteQuestPvPService';
import { StudentAvatarRenderer } from '../../vectors/StudentAvatarRenderer';

interface ByteQuestPvPLobbyProps {
  currentUser: {
    uid: string;
    name: string;
    nickname?: string;
    turma?: string;
    avatar: string;
  };
  onBackToMenu: () => void;
  onStartMatch: (room: ByteQuestPvPRoom, playerNum: 1 | 2) => void;
}

export const ByteQuestPvPLobby: React.FC<ByteQuestPvPLobbyProps> = ({
  currentUser,
  onBackToMenu,
  onStartMatch
}) => {
  const [viewState, setViewState] = useState<'selection' | 'room'>('selection');
  const [room, setRoom] = useState<ByteQuestPvPRoom | null>(null);
  const [playerNum, setPlayerNum] = useState<1 | 2>(1);
  const [codeInputValue, setCodeInputValue] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const roomRef = useRef<ByteQuestPvPRoom | null>(null);
  roomRef.current = room;

  // Inscrição Realtime na Sala
  useEffect(() => {
    if (!room?.id) return;

    const unsubscribe = subscribeToByteQuestPvPRoom(room.id, (updatedRoom) => {
      if (!updatedRoom || updatedRoom.status === 'abandoned') {
        setErrorMessage('A sala foi encerrada pelo anfitrião.');
        setViewState('selection');
        setRoom(null);
        return;
      }

      setRoom(updatedRoom);

      // Gatilho de Contagem Regressiva
      if (updatedRoom.status === 'countdown' && updatedRoom.countdownStartedAt) {
        const elapsed = Math.floor((Date.now() - updatedRoom.countdownStartedAt) / 1000);
        const remaining = Math.max(0, 3 - elapsed);
        setCountdown(remaining);
      } else if (updatedRoom.status === 'in_progress') {
        onStartMatch(updatedRoom, playerNum);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [room?.id, playerNum, onStartMatch]);

  // Cronômetro da contagem regressiva
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      if (playerNum === 1 && roomRef.current?.id) {
        startByteQuestPvPGame(roomRef.current.id);
      }
    }
  }, [countdown, playerNum]);

  const handleCreateRoom = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    const initialPlayer: ByteQuestPvPPlayer = {
      uid: currentUser.uid,
      name: currentUser.name,
      nickname: currentUser.nickname,
      turma: currentUser.turma,
      avatar: currentUser.avatar || '🤖',
      ready: false,
      level: 1,
      hp: 100,
      maxHp: 100,
      shieldHp: 0,
      isDead: false
    };

    const res = await createByteQuestPvPRoom(initialPlayer);
    setIsProcessing(false);

    if (res && res.room) {
      setRoom(res.room);
      setPlayerNum(1);
      setViewState('room');
    } else {
      setErrorMessage('Não foi possível conectar ao servidor. Tente novamente.');
    }
  };

  const handleJoinByCode = async () => {
    if (!codeInputValue.trim()) {
      setErrorMessage('Digite o código de 5 caracteres da sala.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const joiningPlayer: ByteQuestPvPPlayer = {
      uid: currentUser.uid,
      name: currentUser.name,
      nickname: currentUser.nickname,
      turma: currentUser.turma,
      avatar: currentUser.avatar || '🦾',
      ready: false,
      level: 1,
      hp: 100,
      maxHp: 100,
      shieldHp: 0,
      isDead: false
    };

    const joinedRoom = await joinByteQuestPvPRoomByCode(codeInputValue, joiningPlayer);
    setIsProcessing(false);

    if (joinedRoom) {
      setRoom(joinedRoom);
      setPlayerNum(2);
      setViewState('room');
    } else {
      setErrorMessage('Código não encontrado ou a sala já está cheia.');
    }
  };

  const handleToggleReady = async () => {
    if (!room) return;
    const isCurrentlyReady = playerNum === 1 ? room.player1.ready : room.player2?.ready;
    await setByteQuestPvPPlayerReady(room.id, playerNum, !isCurrentlyReady);
  };

  const handleLeave = async () => {
    if (room) {
      await leaveByteQuestPvPRoom(room.id, playerNum);
    }
    setRoom(null);
    setViewState('selection');
    setCountdown(null);
  };

  const copyCodeToClipboard = () => {
    if (!room?.roomCode) return;
    navigator.clipboard.writeText(room.roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const renderClassBadge = (cls: RpgClassType) => {
    if (cls === 'warrior') {
      return (
        <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold font-mono text-xs flex items-center gap-1.5 shadow-sm">
          ⚔️ GUERREIRO (Lâmina Melee)
        </span>
      );
    }
    if (cls === 'archer') {
      return (
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold font-mono text-xs flex items-center gap-1.5 shadow-sm">
          🏹 ARQUEIRO (Flechas Perfurantes)
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-300 font-bold font-mono text-xs flex items-center gap-1.5 shadow-sm">
        🔮 MAGO (Magia Elemental)
      </span>
    );
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex items-center justify-center p-4 sm:p-6 bg-[#0a0d14] text-zinc-100 font-sans select-none overflow-hidden">
      {/* Luzes de Fundo Cibernéticas */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* MODAL DE CONTAGEM REGRESSIVA OVERLAY */}
      <AnimatePresence>
        {countdown !== null && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <span className="text-zinc-400 font-mono text-sm tracking-widest uppercase mb-2">
              A Partida Iniciará em
            </span>
            <span className="text-8xl sm:text-9xl font-black font-mono text-amber-400 drop-shadow-[0_0_35px_rgba(251,191,36,0.6)] animate-pulse">
              {countdown}
            </span>
            <span className="mt-4 text-xs font-mono text-cyan-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              120s de Farm Competitivo ➔ Lockdown Central PvP!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-2xl bg-zinc-950/90 border border-violet-900/40 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col">
        {/* TOPO: Título & Botão Voltar */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-900/40 border border-violet-500/40 flex items-center justify-center text-violet-300 shadow-md">
              <Swords className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                ByteQuest <span className="text-amber-400 text-sm font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">1v1 Battle Royale</span>
              </h1>
              <p className="text-xs text-zinc-400">
                Disputa de recursos por 120s com arena encolhendo e duelo final PvP
              </p>
            </div>
          </div>

          <button
            onClick={viewState === 'room' ? handleLeave : onBackToMenu}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors cursor-pointer"
            title="Voltar ao menu"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ─── TELA 1: SELEÇÃO (CRIAR OU ENTRAR POR CÓDIGO) ─── */}
        {viewState === 'selection' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card Criar Sala */}
              <div className="p-5 rounded-2xl bg-zinc-900/50 border border-violet-900/30 flex flex-col justify-between hover:border-violet-600/50 transition-all shadow-md group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-300 mb-3 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-100">Criar Nova Sala</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Gere um código de 5 dígitos para convidar um colega de turma.
                  </p>
                </div>
                <button
                  onClick={handleCreateRoom}
                  disabled={isProcessing}
                  className="mt-6 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-950/40 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {isProcessing ? 'Criando Sala...' : 'Criar Sala 1v1'}
                </button>
              </div>

              {/* Card Entrar com Código */}
              <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col justify-between hover:border-cyan-500/50 transition-all shadow-md">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-100">Entrar com Código</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Cole o código de 5 letras fornecido pelo seu adversário.
                  </p>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="EX: CYB42"
                    value={codeInputValue}
                    onChange={(e) => setCodeInputValue(e.target.value.toUpperCase())}
                    className="mt-3 w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-cyan-400 text-center text-base font-mono font-black text-cyan-300 uppercase tracking-widest placeholder:text-zinc-600 focus:outline-hidden"
                  />
                </div>
                <button
                  onClick={handleJoinByCode}
                  disabled={isProcessing || !codeInputValue.trim()}
                  className="mt-4 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-950/40 cursor-pointer disabled:opacity-50"
                >
                  <Users className="w-4 h-4" />
                  {isProcessing ? 'Conectando...' : 'Entrar na Sala'}
                </button>
              </div>
            </div>

            {/* Dica de Isonomia Competitiva */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-zinc-200">Isonomia Competitiva Total:</span> Nenhum item, relíquia ou talento externo é levado para a partida. Ambos iniciam no Nível 1 com a mesma classe espelho sorteada aleatoriamente.
              </div>
            </div>
          </div>
        )}

        {/* ─── TELA 2: SALA DE ESPERA (2 JOGADORES + READY) ─── */}
        {viewState === 'room' && room && (
          <div className="flex flex-col gap-6">
            {/* Header da Sala: Código e Classe Espelho */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-zinc-900/80 border border-violet-900/40 gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400 uppercase font-mono">Código da Sala:</span>
                <span className="font-mono text-2xl font-black text-cyan-300 tracking-wider">
                  {room.roomCode}
                </span>
                <button
                  onClick={copyCodeToClipboard}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Copiar código da sala"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-mono">Classe Espelho Sorteada:</span>
                {renderClassBadge(room.sharedClass)}
              </div>
            </div>

            {/* Grid dos 2 Competidores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Jogador 1 (Host) */}
              <div
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  room.player1.ready
                    ? 'bg-emerald-950/20 border-emerald-500/60 shadow-lg shadow-emerald-950/30'
                    : 'bg-zinc-900/50 border-zinc-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-violet-950/60 border border-violet-500/40 flex items-center justify-center text-xl shrink-0">
                    <StudentAvatarRenderer avatar={room.player1.avatar} size={36} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm truncate text-zinc-100">
                        {room.player1.nickname || room.player1.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                        P1 HOST
                      </span>
                    </div>
                    {room.player1.turma && (
                      <span className="text-[10px] text-zinc-400 font-mono block">
                        Turma: {room.player1.turma}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-mono">Status:</span>
                  <span
                    className={`font-mono text-xs font-bold uppercase tracking-wider ${
                      room.player1.ready ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {room.player1.ready ? '✓ Pronto para Combate' : 'Aguardando...'}
                  </span>
                </div>
              </div>

              {/* Jogador 2 (Convidado) */}
              <div
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  room.player2
                    ? room.player2.ready
                      ? 'bg-emerald-950/20 border-emerald-500/60 shadow-lg shadow-emerald-950/30'
                      : 'bg-zinc-900/50 border-zinc-800'
                    : 'bg-zinc-950/60 border-dashed border-zinc-800/80 items-center justify-center py-8'
                }`}
              >
                {room.player2 ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-xl shrink-0">
                        <StudentAvatarRenderer avatar={room.player2.avatar} size={36} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm truncate text-zinc-100">
                            {room.player2.nickname || room.player2.name}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                            P2 DESAFIANTE
                          </span>
                        </div>
                        {room.player2.turma && (
                          <span className="text-[10px] text-zinc-400 font-mono block">
                            Turma: {room.player2.turma}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                      <span className="text-xs text-zinc-400 font-mono">Status:</span>
                      <span
                        className={`font-mono text-xs font-bold uppercase tracking-wider ${
                          room.player2.ready ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {room.player2.ready ? '✓ Pronto para Combate' : 'Aguardando...'}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <Users className="w-8 h-8 text-zinc-600 mx-auto mb-2 animate-pulse" />
                    <span className="text-xs font-mono text-zinc-400 block font-bold">
                      Aguardando adversário conectar...
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono block mt-1">
                      Compartilhe o código <strong className="text-cyan-400">{room.roomCode}</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Botão de Ação: Pronto / Desmarcar */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleLeave}
                className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-rose-950/50 text-zinc-400 hover:text-rose-300 border border-zinc-800 hover:border-rose-800/50 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                Sair da Sala
              </button>

              <button
                onClick={handleToggleReady}
                disabled={!room.player2}
                className={`py-3 px-8 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                  (playerNum === 1 ? room.player1.ready : room.player2?.ready)
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-950/50'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <Check className="w-4 h-4" />
                {(playerNum === 1 ? room.player1.ready : room.player2?.ready)
                  ? 'Cancelar Confirmação'
                  : 'Confirmar "Pronto"'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
