import React,{ useState, useEffect } from 'react';
import {
Swords,
X,
Copy,
Check,
Users,Sparkles,
ArrowRight,
Flame,CheckCircle2,
XCircle,Loader2,
RefreshCw,
Zap,
Snowflake,
Shield,
CloudFog,
Split,
Crown
} from 'lucide-react';
import {
CompetitionRoom,
createCompetitionRoom,
createBotCompetitionRoom,
joinCompetitionRoom,
subscribeToCompetitionRoom,
submitCompetitionAnswer,
advancePlayerQuestion,
useCompetitionPower,
fetchOpenCompetitionRooms,
DuelUser
} from '../services/progplayDuelService';
import { sounds } from '../utils/sound';

interface CompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: DuelUser | null;
  onPromptLogin?: () => void;
}

export const CompetitionModal: React.FC<CompetitionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPromptLogin,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'html' | 'javascript' | 'python' | 'css' | 'sql'>('html');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [activeRoom, setActiveRoom] = useState<CompetitionRoom | null>(null);
  const [openRooms, setOpenRooms] = useState<CompetitionRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [powerNotification, setPowerNotification] = useState<string | null>(null);

  // Local state for currently selected answer on current question
  const [localSelectedOption, setLocalSelectedOption] = useState<number | null>(null);

  // Real-time clock tick for smooth countdowns of freeze/fog powers
  useEffect(() => {
    if (!activeRoom || activeRoom.status !== 'active') return;
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 250);
    return () => clearInterval(interval);
  }, [activeRoom?.status]);

  // Subscribe to active room in real-time
  useEffect(() => {
    if (!activeRoom?.roomCode) return;

    const unsubscribe = subscribeToCompetitionRoom(activeRoom.roomCode, (updatedRoom) => {
      if (updatedRoom) {
        // Sound on match start
        if (activeRoom.status === 'waiting' && updatedRoom.status === 'active') {
          sounds.playSuccess();
        }
        // Sound on match end
        if (activeRoom.status === 'active' && updatedRoom.status === 'finished') {
          sounds.playSuccess();
        }
        setActiveRoom(updatedRoom);
      }
    });

    return () => unsubscribe();
  }, [activeRoom?.roomCode, activeRoom?.status]);

  // Load public rooms on lobby open
  useEffect(() => {
    if (isOpen && currentUser && !activeRoom) {
      loadOpenRooms();
    }
  }, [isOpen, currentUser, activeRoom]);

  const loadOpenRooms = async () => {
    try {
      const rooms = await fetchOpenCompetitionRooms();
      setOpenRooms(rooms);
    } catch {
      // Ignore
    }
  };

  if (!isOpen) return null;

  // Login Gatekeeper
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-fade-in">
        <div className="w-full max-w-md bg-[#11131f] border border-[#2c3148] rounded-2xl p-6 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Swords className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Login Necessário para Competir</h3>
          <p className="text-xs text-neutral-300 leading-relaxed mb-6">
            Para disputar batalhas multiplayer em tempo real, usar superpoderes e pontuar contra outros desenvolvedores, faça login com sua conta.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 font-medium text-xs hover:bg-white/5 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onClose();
                onPromptLogin();
              }}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/30 cursor-pointer"
            >
              Fazer Login Agora
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Create Room
  const handleCreateRoom = async () => {
    sounds.playClick();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const room = await createCompetitionRoom(currentUser, selectedLanguage);
      setActiveRoom(room);
      sounds.playSuccess();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Falha ao criar sala. Verifique a conexão.');
      sounds.playError();
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Create Bot Match (Solo vs Bytezinho)
  const handleCreateBotMatch = async () => {
    sounds.playClick();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const room = await createBotCompetitionRoom(currentUser, selectedLanguage);
      setActiveRoom(room);
      sounds.playSuccess();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Falha ao iniciar duelo contra Bytezinho.');
      sounds.playError();
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Join Room by Code
  const handleJoinRoom = async (codeToJoin?: string) => {
    const targetCode = (codeToJoin || roomCodeInput).trim().toUpperCase();
    if (!targetCode) return;

    sounds.playClick();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const room = await joinCompetitionRoom(currentUser, targetCode);
      setActiveRoom(room);
      sounds.playSuccess();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Código de sala inválido ou sala já ocupada.');
      sounds.playError();
    } finally {
      setIsLoading(false);
    }
  };

  // Copy Room Code
  const handleCopyCode = async () => {
    if (!activeRoom?.roomCode) return;
    try {
      await navigator.clipboard.writeText(activeRoom.roomCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  // Leave active room
  const handleLeaveRoom = () => {
    sounds.playClick();
    setActiveRoom(null);
    setRoomCodeInput('');
    setLocalSelectedOption(null);
    loadOpenRooms();
  };

  // -------------------------------------------------------------------------
  // PLAYER STATE COMPUTATION
  // -------------------------------------------------------------------------
  const isCreator = activeRoom?.creatorId === currentUser.uid;
  const opponentId = isCreator ? activeRoom?.participantId : activeRoom?.creatorId;

  const myState = activeRoom?.playerStates?.[currentUser.uid];
  const myIndex = myState?.currentQuestionIndex ?? 0;
  const myScore = myState?.score ?? (activeRoom?.scores?.[currentUser.uid] || 0);
  const myStreak = myState?.streak ?? 0;
  const myFinished = myState?.finished ?? false;
  const myAnswers = myState?.answers ?? {};

  const opponentState = opponentId ? activeRoom?.playerStates?.[opponentId] : null;
  const opponentName = isCreator
    ? (activeRoom?.participantName || 'Aguardando Desafiante')
    : (activeRoom?.creatorName || 'Criador da Sala');
  const opponentPhoto = isCreator ? activeRoom?.participantPhoto : activeRoom?.creatorPhoto;
  const opponentScore = opponentState?.score ?? (opponentId ? activeRoom?.scores?.[opponentId] || 0 : 0);
  const opponentIndex = opponentState?.currentQuestionIndex ?? 0;
  const opponentFinished = opponentState?.finished ?? false;

  // Powers for current user
  const myPowers = activeRoom?.playerPowers?.[currentUser.uid] || {
    inventory: { freeze: 1, fog: 1, shield: 1, fiftyFifty: 1 },
    eliminatedOptions: {},
  };
  const myInventory = myPowers.inventory || { freeze: 0, fog: 0, shield: 0, fiftyFifty: 0 };

  const freezeUntil = myPowers.freezeUntil || 0;
  const fogUntil = myPowers.fogUntil || 0;
  const hasShield = myPowers.hasShield || false;

  const isFrozen = freezeUntil > currentTime;
  const isFogged = fogUntil > currentTime;
  const frozenSecondsLeft = Math.max(0, Math.ceil((freezeUntil - currentTime) / 1000));
  const fogSecondsLeft = Math.max(0, Math.ceil((fogUntil - currentTime) / 1000));

  // Current Question
  const totalQuestions = activeRoom?.questions?.length || 5;
  const currentQ = activeRoom?.questions?.[myIndex];

  // Selected Option for current question (from DB or local)
  const savedAnswerIndex = myAnswers[myIndex];
  const hasAnsweredCurrent = savedAnswerIndex !== undefined || localSelectedOption !== null;
  const currentSelectedOption = savedAnswerIndex !== undefined ? savedAnswerIndex : localSelectedOption;

  // Eliminated options from 50/50 power
  const eliminatedForThisQuestion = myPowers.eliminatedOptions?.[myIndex] || [];

  // Handle answering question
  const handleSelectAnswer = async (optionIndex: number) => {
    if (!activeRoom || hasAnsweredCurrent || isFrozen || !currentQ) return;

    setLocalSelectedOption(optionIndex);
    const isCorrect = optionIndex === currentQ.correctAnswer;

    if (isCorrect) {
      sounds.playSuccess();
    } else {
      sounds.playError();
    }

    await submitCompetitionAnswer(
      currentUser,
      activeRoom.roomCode,
      myIndex,
      optionIndex,
      isCorrect
    );
  };

  // Advance question (ONLY FOR CURRENT USER!)
  const handleAdvanceQuestion = async () => {
    if (!activeRoom) return;
    sounds.playClick();
    setLocalSelectedOption(null);

    const nextIndex = myIndex + 1;
    const isNowFinished = nextIndex >= totalQuestions;

    await advancePlayerQuestion(
      currentUser,
      activeRoom.roomCode,
      nextIndex,
      isNowFinished
    );
  };

  // Cast a Power
  const handleCastPower = async (powerType: 'freeze' | 'fog' | 'shield' | 'fiftyFifty') => {
    if (!activeRoom || !opponentId) return;
    if ((myInventory[powerType] || 0) <= 0) return;

    if (powerType === 'freeze') {
      sounds.playPowerZap();
      setPowerNotification('❄️ Você lançou Raio Congelante no oponente! 5s sem clique!');
    } else if (powerType === 'fog') {
      sounds.playFog();
      setPowerNotification('🌪️ Você cobriu o oponente com Névoa Cósmica!');
    } else if (powerType === 'shield') {
      sounds.playShield();
      setPowerNotification('🛡️ Escudo Protetor ativado contra o próximo ataque!');
    } else if (powerType === 'fiftyFifty') {
      sounds.playClick();
      setPowerNotification('⚡ 50/50 Usado! 2 opções erradas foram eliminadas!');
    }

    setTimeout(() => setPowerNotification(null), 3500);

    const target = powerType === 'freeze' || powerType === 'fog' ? opponentId : currentUser.uid;
    await useCompetitionPower(
      currentUser,
      activeRoom.roomCode,
      powerType,
      target,
      myIndex
    );
  };

  const isRoomFinished = activeRoom?.status === 'finished';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0f111a] border border-[#2b2f45] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="h-14 px-5 bg-[#161826] border-b border-[#2b2f45] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Arena de Competição Quiz</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-300 font-mono border border-red-500/30">
                  Com Superpoderes
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400">
                Batalhas sincronizadas 1v1 com poderes interativos e progresso individual
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (activeRoom) handleLeaveRoom();
              onClose();
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* ======================================================== */}
          {/* 1. LOBBY VIEW (NO ACTIVE ROOM) */}
          {/* ======================================================== */}
          {!activeRoom && (
            <div className="space-y-5 animate-fade-in">
              {/* Creator Profile Chip */}
              <div className="flex items-center justify-between p-3 bg-[#151825] border border-neutral-800 rounded-xl text-xs">
                <div className="flex items-center gap-2.5">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Avatar" className="w-7 h-7 rounded-full border border-blue-400" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      {currentUser.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-white">{currentUser.displayName || currentUser.email}</span>
                    <span className="block text-[10px] text-emerald-400 font-mono">Conectado para Batalhas</span>
                  </div>
                </div>
                <div className="text-[11px] text-neutral-400 font-mono">
                  1v1 Quiz Online
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Grid: Create vs Join */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* CREATE ROOM CARD */}
                <div className="p-4 bg-[#141624] border border-[#2b2f45] rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span>Criar Nova Sala</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mb-3">
                      Escolha a linguagem do desafio. Um código exclusivo será gerado para seu oponente entrar.
                    </p>

                    <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                      Linguagem do Desafio:
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value as any)}
                      className="w-full bg-[#1c2035] border border-neutral-700 rounded-lg px-2.5 py-2 text-xs text-white outline-none focus:border-blue-500 cursor-pointer mb-3"
                    >
                      <option value="html">🌐 HTML5 (Tags, Semântica & DOM)</option>
                      <option value="javascript">⚡ JavaScript (ES6, Funções & Lógica)</option>
                      <option value="python">🐍 Python (Sintaxe, Listas & Métodos)</option>
                      <option value="css">🎨 CSS3 (Flexbox, Grid & Estilos)</option>
                      <option value="sql">🗄️ SQL (Queries, Joins & Filtros)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleCreateRoom}
                      disabled={isLoading}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Swords className="w-4 h-4" />}
                      <span>Gerar Sala para Colega</span>
                    </button>

                    <button
                      onClick={handleCreateBotMatch}
                      disabled={isLoading}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>🐸 Desafiar Bytezinho (Solo)</span>}
                    </button>
                  </div>
                </div>

                {/* JOIN ROOM CARD */}
                <div className="p-4 bg-[#141624] border border-[#2b2f45] rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span>Entrar com Código</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mb-3">
                      Cole o código da sala gerado pelo seu amigo (ex: HTML4921).
                    </p>

                    <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                      Código da Sala:
                    </label>
                    <input
                      type="text"
                      maxLength={8}
                      value={roomCodeInput}
                      onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                      placeholder="EX: HTML4921"
                      className="w-full bg-[#1c2035] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-mono tracking-widest placeholder:text-neutral-500 outline-none focus:border-blue-500 uppercase mb-3"
                    />
                  </div>

                  <button
                    onClick={() => handleJoinRoom()}
                    disabled={isLoading || !roomCodeInput.trim()}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    <span>Entrar na Batalha</span>
                  </button>
                </div>

              </div>

              {/* PUBLIC ROOMS LIST */}
              {openRooms.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-yellow-400" />
                      Salas Públicas Aguardando Oponente ({openRooms.length})
                    </span>
                    <button
                      onClick={loadOpenRooms}
                      className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Atualizar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {openRooms.map((room) => (
                      <div
                        key={room.roomCode}
                        className="p-2.5 bg-[#161825] border border-neutral-800 rounded-xl flex items-center justify-between hover:border-neutral-600 transition-colors"
                      >
                        <div>
                          <span className="font-bold text-white text-xs block">
                            Sala {room.roomCode}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            {room.creatorName} • <span className="uppercase text-blue-400 font-semibold">{room.language}</span>
                          </span>
                        </div>
                        <button
                          onClick={() => handleJoinRoom(room.roomCode)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer"
                        >
                          Entrar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. WAITING FOR OPPONENT VIEW */}
          {/* ======================================================== */}
          {activeRoom && activeRoom.status === 'waiting' && (
            <div className="py-6 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center mx-auto animate-pulse">
                <Users className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  Sala Criada! Aguardando oponente...
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Compartilhe o código abaixo para seu desafiante entrar na arena:
                </p>
              </div>

              {/* Big Room Code Box */}
              <div className="max-w-xs mx-auto p-4 bg-[#181a29] border-2 border-dashed border-orange-500/50 rounded-2xl flex items-center justify-between gap-3">
                <span className="text-2xl font-black font-mono tracking-widest text-orange-400">
                  {activeRoom.roomCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-neutral-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 pt-2">
                <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                <span>A partida iniciará automaticamente com superpoderes quando o segundo jogador entrar!</span>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleLeaveRoom}
                  className="px-4 py-2 rounded-xl border border-neutral-700 hover:bg-white/5 text-neutral-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancelar e Fechar Sala
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. LIVE BATTLE ARENA (ACTIVE STATUS) */}
          {/* ======================================================== */}
          {activeRoom && activeRoom.status === 'active' && !isRoomFinished && (
            <div className="space-y-4 animate-fade-in relative">
              
              {/* Scoreboard & Player Status Bar */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#151827] border border-[#2b2f45] rounded-xl text-xs">
                {/* Current User */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="" className="w-8 h-8 rounded-full border-2 border-blue-400" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                        {currentUser.displayName?.[0] || 'V'}
                      </div>
                    )}
                    {hasShield && (
                      <div className="absolute -bottom-1 -right-1 bg-amber-500 text-neutral-950 rounded-full p-0.5 shadow">
                        <Shield className="w-3 h-3 fill-current" />
                      </div>
                    )}
                  </div>
                  <div className="truncate flex-1">
                    <span className="font-bold text-white block truncate flex items-center gap-1">
                      <span>{currentUser.displayName || 'Você'}</span>
                      {myStreak >= 2 && <span className="text-[10px] text-amber-400 font-bold">🔥 {myStreak}x</span>}
                    </span>
                    <span className="text-[11px] text-blue-400 font-mono font-bold">
                      {myScore} pts • Questão {Math.min(myIndex + 1, totalQuestions)}/{totalQuestions}
                    </span>
                  </div>
                </div>

                {/* Opponent */}
                <div className="flex items-center justify-end gap-2 text-right">
                  <div className="truncate flex-1">
                    <span className="font-bold text-white block truncate">
                      {opponentName}
                    </span>
                    <span className="text-[11px] text-orange-400 font-mono font-bold">
                      {opponentScore} pts • Questão {Math.min(opponentIndex + 1, totalQuestions)}/{totalQuestions}
                    </span>
                  </div>
                  <div className="relative">
                    {opponentPhoto ? (
                      <img src={opponentPhoto} alt="" className="w-8 h-8 rounded-full border-2 border-orange-400" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-xs">
                        {opponentName[0] || 'O'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Combat Log Ticker */}
              {activeRoom.combatLogs && activeRoom.combatLogs.length > 0 && (
                <div className="px-3 py-1.5 bg-[#121422] border border-neutral-800 rounded-lg flex items-center justify-between text-[11px] text-neutral-300">
                  <span className="truncate font-mono">
                    {activeRoom.combatLogs[0].text}
                  </span>
                  <span className="text-[9px] text-neutral-500 shrink-0 ml-2">Ao vivo</span>
                </div>
              )}

              {/* Notification Banner */}
              {powerNotification && (
                <div className="p-2.5 bg-blue-950/80 border border-blue-500/50 rounded-xl text-blue-200 text-xs font-semibold text-center animate-fade-in shadow-lg">
                  {powerNotification}
                </div>
              )}

              {/* ======================================================== */}
              {/* POWERS DECK (BARRA DE SUPERPODERES) */}
              {/* ======================================================== */}
              <div className="p-3 bg-[#131524] border border-[#2b2f45] rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-neutral-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Seus Superpoderes de Batalha:</span>
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Acertos duplos recarregam poderes!
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Freeze Power */}
                  <button
                    onClick={() => handleCastPower('freeze')}
                    disabled={isFrozen || myInventory.freeze <= 0 || !opponentId}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      myInventory.freeze > 0
                        ? 'bg-cyan-950/40 border-cyan-500/40 hover:bg-cyan-900/40 text-cyan-200 shadow-sm'
                        : 'bg-[#151722] border-neutral-800 text-neutral-500 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Snowflake className="w-4 h-4 text-cyan-400" />
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                        x{myInventory.freeze}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-bold block">❄️ Congelar</span>
                      <span className="text-[9px] text-neutral-400 leading-tight block">5s sem clique no rival</span>
                    </div>
                  </button>

                  {/* Fog / Blind Power */}
                  <button
                    onClick={() => handleCastPower('fog')}
                    disabled={isFrozen || myInventory.fog <= 0 || !opponentId}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      myInventory.fog > 0
                        ? 'bg-purple-950/40 border-purple-500/40 hover:bg-purple-900/40 text-purple-200 shadow-sm'
                        : 'bg-[#151722] border-neutral-800 text-neutral-500 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <CloudFog className="w-4 h-4 text-purple-400" />
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                        x{myInventory.fog}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-bold block">🌪️ Névoa</span>
                      <span className="text-[9px] text-neutral-400 leading-tight block">Cega rival por 4s</span>
                    </div>
                  </button>

                  {/* 50 / 50 Power */}
                  <button
                    onClick={() => handleCastPower('fiftyFifty')}
                    disabled={isFrozen || myInventory.fiftyFifty <= 0 || hasAnsweredCurrent || eliminatedForThisQuestion.length > 0}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      myInventory.fiftyFifty > 0 && !hasAnsweredCurrent && eliminatedForThisQuestion.length === 0
                        ? 'bg-amber-950/40 border-amber-500/40 hover:bg-amber-900/40 text-amber-200 shadow-sm'
                        : 'bg-[#151722] border-neutral-800 text-neutral-500 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Split className="w-4 h-4 text-amber-400" />
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                        x{myInventory.fiftyFifty}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-bold block">⚡ 50 / 50</span>
                      <span className="text-[9px] text-neutral-400 leading-tight block">Elimina 2 erradas</span>
                    </div>
                  </button>

                  {/* Shield Power */}
                  <button
                    onClick={() => handleCastPower('shield')}
                    disabled={isFrozen || myInventory.shield <= 0 || hasShield}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      myInventory.shield > 0 && !hasShield
                        ? 'bg-emerald-950/40 border-emerald-500/40 hover:bg-emerald-900/40 text-emerald-200 shadow-sm'
                        : 'bg-[#151722] border-neutral-800 text-neutral-500 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                        {hasShield ? 'Ativo' : `x${myInventory.shield}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-bold block">🛡️ Escudo</span>
                      <span className="text-[9px] text-neutral-400 leading-tight block">{hasShield ? 'Protegido' : 'Bloqueia 1 ataque'}</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* ======================================================== */}
              {/* CURRENT PLAYER'S ACTIVE QUESTION OR WAITING ON OPPONENT */}
              {/* ======================================================== */}
              {myFinished ? (
                // Player completed all questions, waiting for opponent to finish
                <div className="p-6 bg-[#141624] border border-[#2b2f45] rounded-xl text-center space-y-4 animate-fade-in">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">
                      Você concluiu todas as {totalQuestions} perguntas!
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Sua pontuação final preliminar: <strong className="text-emerald-400 font-mono">{myScore} pts</strong>
                    </p>
                  </div>

                  <div className="p-4 bg-[#1a1d2e] rounded-xl border border-neutral-800 max-w-sm mx-auto space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-semibold">{opponentName}:</span>
                      <span className="font-mono text-orange-400 font-bold">
                        Questão {Math.min(opponentIndex + 1, totalQuestions)} de {totalQuestions} ({opponentScore} pts)
                      </span>
                    </div>
                    {/* Live Progress Bar of Opponent */}
                    <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
                        style={{ width: `${(Math.min(opponentIndex, totalQuestions) / totalQuestions) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-neutral-400 italic pt-1">
                      A partida só será encerrada quando {opponentName} responder a todas as questões!
                    </p>
                  </div>
                </div>
              ) : currentQ ? (
                // Active Question View
                <div className={`relative p-4 bg-[#141624] border rounded-xl space-y-3 overflow-hidden transition-all ${
                  isFrozen ? 'border-cyan-500 shadow-2xl shadow-cyan-500/20 ring-2 ring-cyan-500/30' : 'border-[#2b2f45]'
                }`}>
                  
                  {/* FROZEN OVERLAY EFFECT (5s SEM CLIQUE) */}
                  {isFrozen && (
                    <div className="absolute inset-0 z-20 bg-cyan-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center animate-fade-in border-4 border-cyan-400/60 rounded-xl">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/30 border border-cyan-300 text-cyan-200 flex items-center justify-center mb-2 animate-bounce">
                        <Snowflake className="w-6 h-6" />
                      </div>
                      <span className="text-base font-black text-cyan-200 tracking-wide block uppercase drop-shadow">
                        🧊 VOCÊ FOI CONGELADO!
                      </span>
                      <span className="text-xs text-cyan-100 font-bold mt-1">
                        Cliques e respostas bloqueados por mais <span className="font-mono text-cyan-300 text-sm font-black">{frozenSecondsLeft}s</span>
                      </span>
                    </div>
                  )}

                  {/* FOG / BLIND OVERLAY EFFECT */}
                  {isFogged && (
                    <div className="absolute inset-0 z-10 bg-neutral-950/85 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center animate-fade-in border-2 border-purple-500/40 rounded-xl">
                      <CloudFog className="w-8 h-8 text-purple-300 mb-2 animate-pulse" />
                      <span className="text-sm font-bold text-purple-200">
                        🌪️ Névoa Cósmica Ativa!
                      </span>
                      <span className="text-xs text-neutral-400 mt-1">
                        Visão obstruída por mais {fogSecondsLeft}s...
                      </span>
                    </div>
                  )}

                  {/* Question header */}
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span>Pergunta {myIndex + 1} de {totalQuestions}</span>
                    </span>
                    <span className="uppercase text-[11px] font-mono font-bold text-blue-400">
                      {activeRoom.language} Quiz
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-relaxed">
                    {currentQ.question}
                  </h3>

                  {currentQ.codeSnippet && (
                    <pre className="p-3 bg-[#0a0c12] rounded-lg border border-neutral-800 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
                      {currentQ.codeSnippet}
                    </pre>
                  )}

                  {/* Options List */}
                  <div className={`grid grid-cols-1 gap-2 pt-1 ${isFrozen ? 'pointer-events-none opacity-40' : ''}`}>
                    {currentQ.options.map((opt, idx) => {
                      const isPicked = currentSelectedOption === idx;
                      const isCorrect = idx === currentQ.correctAnswer;
                      const isEliminated = eliminatedForThisQuestion.includes(idx);
                      const showResult = hasAnsweredCurrent;

                      let btnStyle = 'bg-[#1c2035] border-neutral-700/80 text-neutral-200 hover:border-neutral-500';
                      
                      if (isEliminated) {
                        btnStyle = 'bg-[#12131d] border-neutral-900 text-neutral-600 line-through opacity-40 cursor-not-allowed';
                      } else if (showResult) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold';
                        } else if (isPicked) {
                          btnStyle = 'bg-red-950/60 border-red-500 text-red-300 font-bold';
                        } else {
                          btnStyle = 'bg-[#141622] border-neutral-800 text-neutral-500 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={hasAnsweredCurrent || isFrozen || isEliminated}
                          onClick={() => handleSelectAnswer(idx)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span className="flex-1">{opt}</span>
                          {isEliminated && (
                            <span className="text-[10px] text-red-400 font-mono">❌ 50/50</span>
                          )}
                          {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {showResult && isPicked && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after answering */}
                  {hasAnsweredCurrent && (
                    <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/40 text-blue-200 text-xs leading-relaxed animate-fade-in">
                      <strong>Explicação:</strong> {currentQ.explanation}
                    </div>
                  )}

                  {/* Advance Question Button */}
                  {hasAnsweredCurrent && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={handleAdvanceQuestion}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                      >
                        <span>
                          {myIndex + 1 >= totalQuestions
                            ? 'Finalizar Minhas Respostas'
                            : 'Próxima Pergunta'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                </div>
              ) : null}

            </div>
          )}

          {/* ======================================================== */}
          {/* 4. FINAL RESULTS & PODIUM (WHEN BOTH FINISHED) */}
          {/* ======================================================== */}
          {activeRoom && isRoomFinished && (
            <div className="py-6 text-center space-y-5 animate-fade-in">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/10">
                <Crown className="w-10 h-10 animate-bounce text-amber-400" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  {activeRoom.winnerId === currentUser.uid
                    ? '🏆 Vitória Incrível! Você Venceu a Batalha!'
                    : activeRoom.winnerId === 'tie'
                    ? '🤝 Empate Épico!'
                    : `👑 ${opponentName} Venceu a Disputa!`}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Ambos os jogadores concluíram todas as perguntas da arena
                </p>
              </div>

              {/* Score Recap Podium */}
              <div className="max-w-md mx-auto p-4 bg-[#151825] border border-[#2b2f45] rounded-2xl grid grid-cols-2 gap-4">
                {/* Current User */}
                <div className={`p-3 rounded-xl border ${
                  activeRoom.winnerId === currentUser.uid
                    ? 'bg-blue-950/40 border-blue-500 text-blue-200 ring-2 ring-blue-500/30'
                    : 'bg-[#1a1d2e] border-neutral-800'
                }`}>
                  <span className="font-bold text-white text-xs block truncate mb-1">
                    {currentUser.displayName || 'Você'} {activeRoom.winnerId === currentUser.uid && '👑'}
                  </span>
                  <span className="text-2xl font-black text-blue-400 font-mono">
                    {myScore}
                  </span>
                  <span className="text-[10px] text-neutral-400 block">pontos</span>
                </div>

                {/* Opponent */}
                <div className={`p-3 rounded-xl border ${
                  activeRoom.winnerId === opponentId
                    ? 'bg-orange-950/40 border-orange-500 text-orange-200 ring-2 ring-orange-500/30'
                    : 'bg-[#1a1d2e] border-neutral-800'
                }`}>
                  <span className="font-bold text-white text-xs block truncate mb-1">
                    {opponentName} {activeRoom.winnerId === opponentId && '👑'}
                  </span>
                  <span className="text-2xl font-black text-orange-400 font-mono">
                    {opponentScore}
                  </span>
                  <span className="text-[10px] text-neutral-400 block">pontos</span>
                </div>
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={handleLeaveRoom}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 cursor-pointer active:scale-95 transition-all"
                >
                  Jogar Outra Batalha
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
