import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, Lock, Volume2, Palette, Bot, Coins, LayoutGrid, Flame, Swords, Play } from 'lucide-react';
import { PlayerCosmetics, TerminalThemeId, BytezinhoSkinId, KeySoundThemeId, LayoutSkinId, AnimationEffectId, CosmeticCurrency } from '../types/cosmetics';
import { TERMINAL_THEMES, BYTEZINHO_SKINS, KEY_SOUNDS } from '../constants/themes';
import { LAYOUT_CONFIGS, ANIMATION_CONFIGS, getAllUnlockedCosmetics } from '../constants/cosmeticsCatalog';
import { audioSynthesizer } from '../services/audioSynthesizer';
import { triggerUpgradePurchaseVfx, getLetterVfxClasses } from '../services/fxEngine';
import { BytezinhoAvatar } from './BytezinhoAvatar';

interface CosmeticsShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  cosmetics: PlayerCosmetics;
  onUpdateCosmetics: (updated: PlayerCosmetics) => void;
  isAdmin?: boolean;
}

type ShopTab = 'layouts' | 'themes' | 'skins' | 'sounds' | 'animations';

export const CosmeticsShopModal: React.FC<CosmeticsShopModalProps> = ({
  isOpen,
  onClose,
  cosmetics,
  onUpdateCosmetics,
  isAdmin = false
}) => {
  const [activeTab, setActiveTab] = useState<ShopTab>('themes');
  const [playingPreview, setPlayingPreview] = useState<KeySoundThemeId | null>(null);
  const [testingAnimationId, setTestingAnimationId] = useState<AnimationEffectId | null>(null);
  const [currencyFilter, setCurrencyFilter] = useState<'all' | 'tokens' | 'duel_coins' | 'quantum_fragments'>('all');

  if (!isOpen) return null;

  const currentTokens = cosmetics.levelTokens ?? 0;
  const currentDuelTokens = cosmetics.duelTokens ?? 0;
  const currentQuantumFragments = cosmetics.quantumFragments ?? 0;

  // Ações Exclusivas de Administrador (Marcos Wrobel)
  const handleAdminUnlockAll = () => {
    const all = getAllUnlockedCosmetics(cosmetics);
    onUpdateCosmetics(all);
    audioSynthesizer.playUnlockJingle();
  };

  const handleAdminAddTokens = () => {
    onUpdateCosmetics({
      ...cosmetics,
      levelTokens: (cosmetics.levelTokens ?? 0) + 5000,
      duelTokens: (cosmetics.duelTokens ?? 0) + 5000,
      quantumFragments: (cosmetics.quantumFragments ?? 0) + 500,
    });
    audioSynthesizer.playUnlockJingle();
  };

  // Desbloqueio e Equipamento de Layouts
  const handleUnlockOrEquipLayout = (layoutId: LayoutSkinId, price: number, currency: CosmeticCurrency = 'tokens') => {
    const isUnlocked = cosmetics.unlockedLayouts?.includes(layoutId) ?? (layoutId === 'default_terminal');

    if (isUnlocked) {
      onUpdateCosmetics({
        ...cosmetics,
        equippedLayout: layoutId
      });
      return;
    }

    if (currency === 'quantum_fragments') {
      if (!isAdmin && currentQuantumFragments < price) return;
      audioSynthesizer.playUnlockJingle();
      onUpdateCosmetics({
        ...cosmetics,
        quantumFragments: isAdmin ? currentQuantumFragments : Math.max(0, currentQuantumFragments - price),
        unlockedLayouts: [...(cosmetics.unlockedLayouts || ['default_terminal']), layoutId],
        equippedLayout: layoutId
      });
    } else if (currency === 'duel_coins') {
      if (!isAdmin && currentDuelTokens < price) return;
      audioSynthesizer.playUnlockJingle();
      onUpdateCosmetics({
        ...cosmetics,
        duelTokens: isAdmin ? currentDuelTokens : Math.max(0, currentDuelTokens - price),
        unlockedLayouts: [...(cosmetics.unlockedLayouts || ['default_terminal']), layoutId],
        equippedLayout: layoutId
      });
    } else {
      if (!isAdmin && currentTokens < price) return;
      audioSynthesizer.playUnlockJingle();
      onUpdateCosmetics({
        ...cosmetics,
        levelTokens: isAdmin ? currentTokens : Math.max(0, currentTokens - price),
        unlockedLayouts: [...(cosmetics.unlockedLayouts || ['default_terminal']), layoutId],
        equippedLayout: layoutId
      });
    }
  };

  // Desbloqueio e Equipamento de Temas
  const handleUnlockOrEquipTheme = (themeId: TerminalThemeId, price: number, currency: CosmeticCurrency = 'tokens') => {
    const isUnlocked = cosmetics.unlockedThemes.includes(themeId);

    if (isUnlocked) {
      onUpdateCosmetics({
        ...cosmetics,
        equippedTheme: themeId
      });
      return;
    }

    if (currency === 'quantum_fragments') {
      if (!isAdmin && currentQuantumFragments < price) return;
      audioSynthesizer.playUnlockJingle();
      onUpdateCosmetics({
        ...cosmetics,
        quantumFragments: isAdmin ? currentQuantumFragments : Math.max(0, currentQuantumFragments - price),
        unlockedThemes: [...cosmetics.unlockedThemes, themeId],
        equippedTheme: themeId
      });
    } else if (currency === 'duel_coins') {
      if (!isAdmin && currentDuelTokens < price) return;
      audioSynthesizer.playUnlockJingle();
      onUpdateCosmetics({
        ...cosmetics,
        duelTokens: isAdmin ? currentDuelTokens : Math.max(0, currentDuelTokens - price),
        unlockedThemes: [...cosmetics.unlockedThemes, themeId],
        equippedTheme: themeId
      });
    } else {
      if (!isAdmin && currentTokens < price) return;
      audioSynthesizer.playUnlockJingle();
      onUpdateCosmetics({
        ...cosmetics,
        levelTokens: isAdmin ? currentTokens : Math.max(0, currentTokens - price),
        unlockedThemes: [...cosmetics.unlockedThemes, themeId],
        equippedTheme: themeId
      });
    }
  };

  const handleUnlockOrEquipSkin = (skinId: BytezinhoSkinId, price: number, currency: CosmeticCurrency = 'tokens') => {
    const isUnlocked = cosmetics.unlockedSkins.includes(skinId);

    if (isUnlocked) {
      onUpdateCosmetics({
        ...cosmetics,
        equippedSkin: skinId
      });
      return;
    }

    if (currency === 'quantum_fragments') {
      if (!isAdmin && currentQuantumFragments < price) return;
      audioSynthesizer.playUnlockJingle();
      onUpdateCosmetics({
        ...cosmetics,
        quantumFragments: isAdmin ? currentQuantumFragments : Math.max(0, currentQuantumFragments - price),
        unlockedSkins: [...cosmetics.unlockedSkins, skinId],
        equippedSkin: skinId
      });
    } else if (currency === 'duel_coins') {
      if (!isAdmin && currentDuelTokens < price) return;
      audioSynthesizer.playUnlockJingle();
      onUpdateCosmetics({
        ...cosmetics,
        duelTokens: isAdmin ? currentDuelTokens : Math.max(0, currentDuelTokens - price),
        unlockedSkins: [...cosmetics.unlockedSkins, skinId],
        equippedSkin: skinId
      });
    } else {
      if (!isAdmin && currentTokens < price) return;
      audioSynthesizer.playUnlockJingle();
      onUpdateCosmetics({
        ...cosmetics,
        levelTokens: isAdmin ? currentTokens : Math.max(0, currentTokens - price),
        unlockedSkins: [...cosmetics.unlockedSkins, skinId],
        equippedSkin: skinId
      });
    }
  };

  const handleUnlockOrEquipSound = (soundId: KeySoundThemeId, price: number, currency: CosmeticCurrency = 'tokens') => {
    const isUnlocked = cosmetics.unlockedSounds.includes(soundId);

    if (isUnlocked) {
      onUpdateCosmetics({
        ...cosmetics,
        equippedSound: soundId
      });
      audioSynthesizer.previewSound(soundId);
      return;
    }

    if (currency === 'quantum_fragments') {
      if (!isAdmin && currentQuantumFragments < price) return;
      audioSynthesizer.playUnlockJingle();
      onUpdateCosmetics({
        ...cosmetics,
        quantumFragments: isAdmin ? currentQuantumFragments : Math.max(0, currentQuantumFragments - price),
        unlockedSounds: [...cosmetics.unlockedSounds, soundId],
        equippedSound: soundId
      });
    } else if (currency === 'duel_coins') {
      if (!isAdmin && currentDuelTokens < price) return;
      audioSynthesizer.playUnlockJingle();
      onUpdateCosmetics({
        ...cosmetics,
        duelTokens: isAdmin ? currentDuelTokens : Math.max(0, currentDuelTokens - price),
        unlockedSounds: [...cosmetics.unlockedSounds, soundId],
        equippedSound: soundId
      });
    } else {
      if (!isAdmin && currentTokens < price) return;
      audioSynthesizer.playUnlockJingle();
      onUpdateCosmetics({
        ...cosmetics,
        levelTokens: isAdmin ? currentTokens : Math.max(0, currentTokens - price),
        unlockedSounds: [...cosmetics.unlockedSounds, soundId],
        equippedSound: soundId
      });
    }
  };

  const handlePlayPreview = (soundId: KeySoundThemeId) => {
    setPlayingPreview(soundId);
    audioSynthesizer.previewSound(soundId);
    setTimeout(() => {
      setPlayingPreview(prev => prev === soundId ? null : prev);
    }, 400);
  };

  // Desbloqueio e Equipamento de Efeitos de Animação
  const handleUnlockOrEquipAnimation = (animationId: AnimationEffectId, price: number, currency: CosmeticCurrency = 'tokens') => {
    const isUnlocked = cosmetics.unlockedAnimations?.includes(animationId) ?? (animationId === 'confetti_classic');

    if (isUnlocked) {
      onUpdateCosmetics({
        ...cosmetics,
        equippedAnimation: animationId
      });
      return;
    }

    if (currency === 'quantum_fragments') {
      if (!isAdmin && currentQuantumFragments < price) return;
      audioSynthesizer.playUnlockJingle();
      onUpdateCosmetics({
        ...cosmetics,
        quantumFragments: isAdmin ? currentQuantumFragments : Math.max(0, currentQuantumFragments - price),
        unlockedAnimations: [...(cosmetics.unlockedAnimations || ['confetti_classic']), animationId],
        equippedAnimation: animationId
      });
    } else if (currency === 'duel_coins') {
      if (!isAdmin && currentDuelTokens < price) return;
      audioSynthesizer.playUnlockJingle();
      onUpdateCosmetics({
        ...cosmetics,
        duelTokens: isAdmin ? currentDuelTokens : Math.max(0, currentDuelTokens - price),
        unlockedAnimations: [...(cosmetics.unlockedAnimations || ['confetti_classic']), animationId],
        equippedAnimation: animationId
      });
    } else {
      if (!isAdmin && currentTokens < price) return;
      audioSynthesizer.playUnlockJingle();
      onUpdateCosmetics({
        ...cosmetics,
        levelTokens: isAdmin ? currentTokens : Math.max(0, currentTokens - price),
        unlockedAnimations: [...(cosmetics.unlockedAnimations || ['confetti_classic']), animationId],
        equippedAnimation: animationId
      });
    }
  };

  // Prévia interativa: testa a animação na hora para o aluno visualizar o efeito
  const handleTestAnimation = (animationId: AnimationEffectId, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    triggerUpgradePurchaseVfx(animationId, rect, true);
    setTestingAnimationId(animationId);
    setTimeout(() => {
      setTestingAnimationId(curr => (curr === animationId ? null : curr));
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-[#10131a] border border-[#262c3d] rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col h-[92vh] sm:h-[86vh]"
        >
          {/* Top Bar / Header do Modal */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#232838] bg-[#141822]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>Loja de Cosméticos</span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Terminal Custom
                  </span>
                </h2>
                <p className="text-[11px] text-zinc-400">
                  Personalize layouts, temas, o mascote Bytezinho, sons e animações!
                </p>
              </div>
            </div>

            {/* Saldos Triplos (Tokens de Nível, Moedas de Duelo e Fragmentos Quânticos) e Botão Fechar */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
              {/* Saldo de Level Tokens */}
              <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs sm:text-sm shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>{currentTokens}</span>
                <span className="text-[10px] text-amber-400/80 hidden sm:inline">Level Tokens</span>
              </div>

              {/* Saldo de Moedas de Duelo */}
              <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 font-mono font-bold text-xs sm:text-sm shadow-[0_0_12px_rgba(244,63,94,0.2)]">
                <Swords className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>{currentDuelTokens}</span>
                <span className="text-[10px] text-rose-400/80 hidden sm:inline">Moedas de Duelo</span>
              </div>

              {/* Saldo de Fragmentos Quânticos */}
              <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs sm:text-sm shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span>{currentQuantumFragments}</span>
                <span className="text-[10px] text-cyan-300/80 hidden sm:inline">Quânticos</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                title="Fechar Loja"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Barra Especial de Administrador (Marcos Wrobel) */}
          {isAdmin && (
            <div className="flex-shrink-0 px-4 sm:px-6 py-2 bg-gradient-to-r from-amber-950/60 via-purple-950/70 to-amber-950/60 border-b border-amber-500/40 flex items-center justify-between gap-2.5 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/25 border border-amber-500/50 font-bold flex items-center gap-1">
                  👑 ADM: wrobel.marcos@gmail.com
                </span>
                <span className="hidden md:inline text-zinc-300 text-[11px]">
                  Modo de Testes irrestrito: desbloqueio livre de cosméticos.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAdminUnlockAll}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 text-xs font-black transition shadow-[0_0_12px_rgba(245,158,11,0.4)] flex items-center gap-1.5 cursor-pointer"
                  title="Desbloquear todos os cosméticos (incluindo Quânticos)"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Desbloquear Tudo (ADM)</span>
                </button>
                <button
                  type="button"
                  onClick={handleAdminAddTokens}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold transition border border-amber-500/40 flex items-center gap-1.5 cursor-pointer"
                  title="Adicionar +5.000 Tokens, +5.000 Moedas e +500 Fragmentos Quânticos"
                >
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>+5k Moedas / +500 🌌</span>
                </button>
              </div>
            </div>
          )}

          {/* Dica Pedagógica e Filtro de Moedas */}
          <div className="flex-shrink-0 px-4 sm:px-6 py-2 bg-purple-950/30 border-b border-purple-900/30 flex flex-wrap items-center justify-between gap-2 text-[11px] text-purple-200/90 font-mono">
            <span className="flex items-center gap-1.5 min-w-0 truncate">
              <span>💡</span>
              <span className="truncate">
                <strong>🪙 Tokens:</strong> nível escolar | <strong>⚔️ Moedas:</strong> Arena 1x1 | <strong>🌌 Fragmentos:</strong> Endgame Quântico
              </span>
            </span>

            {/* Filtros de Moeda */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => setCurrencyFilter('all')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition ${
                  currencyFilter === 'all'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setCurrencyFilter('tokens')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition flex items-center gap-1 ${
                  currencyFilter === 'tokens'
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                🪙 Nível Escolar
              </button>
              <button
                type="button"
                onClick={() => setCurrencyFilter('duel_coins')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition flex items-center gap-1 ${
                  currencyFilter === 'duel_coins'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                ⚔️ Arena 1x1
              </button>
              <button
                type="button"
                onClick={() => setCurrencyFilter('quantum_fragments')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition flex items-center gap-1 ${
                  currencyFilter === 'quantum_fragments'
                    ? 'bg-cyan-500 text-black font-bold shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                🌌 Quântico
              </button>
            </div>
          </div>

          {/* Abas de Navegação - 5 colunas responsivas sem sobreposição */}
          <div className="flex-shrink-0 grid grid-cols-5 border-b border-[#232838] bg-[#12151e] px-1 sm:px-6 gap-1 sm:gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('layouts')}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-1 sm:px-3 rounded-t-xl text-xs sm:text-sm font-bold transition cursor-pointer border-b-2 min-w-0 ${
                activeTab === 'layouts'
                  ? 'bg-[#181c28] text-purple-300 border-purple-400'
                  : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-zinc-800/40'
              }`}
              title="Layouts Globais da Interface"
            >
              <LayoutGrid className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Layouts</span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 flex-shrink-0">
                {Object.keys(LAYOUT_CONFIGS).length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('themes')}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-1 sm:px-3 rounded-t-xl text-xs sm:text-sm font-bold transition cursor-pointer border-b-2 min-w-0 ${
                activeTab === 'themes'
                  ? 'bg-[#181c28] text-purple-300 border-purple-400'
                  : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-zinc-800/40'
              }`}
              title="Cores e Temas do Terminal"
            >
              <Palette className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Cores</span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 flex-shrink-0">
                {Object.keys(TERMINAL_THEMES).length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('skins')}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-1 sm:px-3 rounded-t-xl text-xs sm:text-sm font-bold transition cursor-pointer border-b-2 min-w-0 ${
                activeTab === 'skins'
                  ? 'bg-[#181c28] text-purple-300 border-purple-400'
                  : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-zinc-800/40'
              }`}
              title="Skins do Mascote Bytezinho"
            >
              <Bot className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Skins</span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 flex-shrink-0">
                {Object.keys(BYTEZINHO_SKINS).length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sounds')}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-1 sm:px-3 rounded-t-xl text-xs sm:text-sm font-bold transition cursor-pointer border-b-2 min-w-0 ${
                activeTab === 'sounds'
                  ? 'bg-[#181c28] text-purple-300 border-purple-400'
                  : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-zinc-800/40'
              }`}
              title="Sons de Digitação das Teclas"
            >
              <Volume2 className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Sons</span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 flex-shrink-0">
                {Object.keys(KEY_SOUNDS).length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('animations')}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-1 sm:px-3 rounded-t-xl text-xs sm:text-sm font-bold transition cursor-pointer border-b-2 min-w-0 ${
                activeTab === 'animations'
                  ? 'bg-[#181c28] text-purple-300 border-purple-400'
                  : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-zinc-800/40'
              }`}
              title="Animações de Compra, Teclas e Level Up"
            >
              <Flame className="w-4 h-4 flex-shrink-0 text-amber-400" />
              <span className="truncate">Animações</span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 flex-shrink-0">
                {Object.keys(ANIMATION_CONFIGS).length}
              </span>
            </button>
          </div>

          {/* Conteúdo das Abas (Scrollável Internamente Sem Afetar os Menus) */}
          <div className="p-3 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-4">
            {/* ABA 0: LAYOUTS GLOBAIS */}
            {activeTab === 'layouts' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {Object.values(LAYOUT_CONFIGS)
                  .filter(layout => {
                    const itemCurrency = layout.currency || 'tokens';
                    if (currencyFilter === 'tokens') return itemCurrency === 'tokens';
                    if (currencyFilter === 'duel_coins') return itemCurrency === 'duel_coins';
                    if (currencyFilter === 'quantum_fragments') return itemCurrency === 'quantum_fragments';
                    return true;
                  })
                  .map(layout => {
                    const isUnlocked = cosmetics.unlockedLayouts?.includes(layout.id) ?? (layout.id === 'default_terminal');
                    const isEquipped = (cosmetics.equippedLayout || 'default_terminal') === layout.id;
                    const isQuantumCurrency = layout.currency === 'quantum_fragments';
                    const isDuelCurrency = layout.currency === 'duel_coins';
                    const canAfford = isAdmin || (
                      isQuantumCurrency ? currentQuantumFragments >= layout.price :
                      isDuelCurrency ? currentDuelTokens >= layout.price :
                      currentTokens >= layout.price
                    );

                    return (
                      <div
                        key={layout.id}
                        className={`relative p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                          isEquipped
                            ? 'bg-[#161a26] border-purple-500/70 shadow-[0_0_18px_rgba(168,85,247,0.25)] ring-1 ring-purple-500/40'
                            : isUnlocked
                            ? 'bg-[#131620] border-zinc-700/60 hover:border-zinc-600'
                            : 'bg-[#0f1118]/80 border-zinc-800/70'
                        }`}
                      >
                        {/* Topo do Card */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl select-none">{layout.icon}</span>
                              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                                {layout.name}
                              </h3>
                              {isEquipped && (
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Ativo
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{layout.subtitle}</p>
                          </div>

                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                            isQuantumCurrency
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold shadow-[0_0_8px_rgba(6,182,212,0.25)]'
                              : isDuelCurrency
                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/40 font-bold'
                              : 'bg-zinc-800 text-zinc-300 border-zinc-700/60'
                          }`}>
                            {isQuantumCurrency && <Sparkles className="w-3 h-3 text-cyan-400" />}
                            {isDuelCurrency && <Swords className="w-3 h-3 text-rose-400" />}
                            {layout.badge}
                          </span>
                        </div>

                        {/* Prévia Estilizada do Layout em Miniatura */}
                        <div className="w-full h-20 rounded-lg p-2 flex items-center justify-center relative overflow-hidden border border-zinc-800 bg-zinc-950/60">
                          {layout.id === 'default_terminal' && (
                            <div className="w-full h-full flex gap-1 items-stretch p-1 bg-[#0a0d0a] rounded border border-emerald-500/30">
                              <div className="w-1/4 bg-emerald-950/40 rounded border border-emerald-500/20" />
                              <div className="w-2/4 bg-emerald-950/60 rounded border border-emerald-500/40 flex items-center justify-center">
                                <span className="text-[9px] font-mono text-emerald-300 font-bold">ARENA</span>
                              </div>
                              <div className="w-1/4 bg-emerald-950/40 rounded border border-emerald-500/20" />
                            </div>
                          )}

                          {layout.id === 'arcade_cabinet' && (
                            <div className="w-full h-full bg-[#181312] rounded-lg border-2 border-[#b45309] p-1 flex flex-col justify-between shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] relative">
                              <div className="h-3 bg-red-950/80 rounded flex items-center justify-center text-[8px] font-mono font-bold text-amber-300">
                                ★ ARCADE ★
                              </div>
                              <div className="flex-1 my-0.5 bg-black/60 rounded border border-amber-500/30 flex items-center justify-center">
                                <span className="text-[9px] font-mono text-amber-400 font-bold">CRT SCREEN</span>
                              </div>
                              <div className="h-2 bg-[#251713] rounded flex items-center justify-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              </div>
                            </div>
                          )}

                          {layout.id === 'zen_focus' && (
                            <div className="w-full h-full bg-[#080c14] rounded border border-cyan-500/30 flex items-center justify-center p-2">
                              <div className="w-3/4 h-full bg-cyan-950/50 rounded border border-cyan-400/50 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                                <span className="text-[10px] font-mono text-cyan-300 font-bold">100% FOCO</span>
                              </div>
                            </div>
                          )}

                          {layout.id === 'bios_dos' && (
                            <div className="w-full h-full bg-[#0000aa] rounded border border-[#ffff55] p-1 flex flex-col justify-between text-[#ffff55] font-mono text-[8px]">
                              <div className="bg-[#000088] px-1 truncate font-bold text-center">╔═ ROM BIOS SETUP ═╗</div>
                              <div className="flex justify-around text-white font-bold">
                                <span>DIAG</span>
                                <span className="text-[#ffff55]">CPU CORE</span>
                                <span>RAM</span>
                              </div>
                              <div className="text-[7px] text-center text-[#55ffff]">[F10] SAVE CMOS</div>
                            </div>
                          )}

                          {layout.id === 'cyber_deck' && (
                            <div className="w-full h-full bg-[#070a14] rounded border border-cyan-500/50 p-1 flex flex-col justify-between text-cyan-300 font-mono text-[8px] relative overflow-hidden">
                              <div className="bg-cyan-950/60 px-1 py-0.5 rounded border border-cyan-500/30 flex items-center justify-between text-[7px]">
                                <span className="text-cyan-400 font-bold">CYBERDECK v4.9</span>
                                <span className="text-pink-400">ICE 99%</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-cyan-950/40 rounded border border-cyan-500/20" />
                                <div className="w-2/4 bg-black/60 rounded border border-cyan-400/40 flex items-center justify-center">
                                  <span className="text-[8px] font-bold text-cyan-300">NET BUFFER</span>
                                </div>
                                <div className="w-1/4 bg-pink-950/40 rounded border border-pink-500/20" />
                              </div>
                            </div>
                          )}

                          {layout.id === 'ide_developer' && (
                            <div className="w-full h-full bg-[#181a1f] rounded border border-[#2d3139] p-1 flex flex-col justify-between text-zinc-300 font-mono text-[8px]">
                              <div className="flex items-center gap-1 bg-[#131518] px-1 py-0.5 rounded text-[7px] text-zinc-400">
                                <div className="flex gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f56]" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffbd2e]" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#27c93f]" />
                                </div>
                                <span className="text-blue-400 ml-1">TypeClicker.tsx</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-[#14171d] rounded border border-[#282c34]" />
                                <div className="w-2/4 bg-[#1e222b] rounded border border-blue-500/30 flex items-center justify-center text-[7px] text-blue-300">
                                  CODE ARENA
                                </div>
                                <div className="w-1/4 bg-[#14171d] rounded border border-[#282c34]" />
                              </div>
                              <div className="bg-[#007acc] text-white text-[6px] px-1 rounded flex justify-between font-bold">
                                <span>main*</span>
                                <span>TS 5.8</span>
                              </div>
                            </div>
                          )}

                          {layout.id === 'space_station' && (
                            <div className="w-full h-full bg-[#060913] rounded border border-indigo-500/40 p-1 flex flex-col justify-between text-indigo-300 font-mono text-[8px] relative">
                              <div className="bg-[#0b1124] px-1 py-0.5 rounded border border-indigo-500/30 flex items-center justify-between text-[7px]">
                                <span className="text-indigo-300 font-bold">ORBITAL A-07</span>
                                <span className="text-emerald-400">O2: 99%</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-indigo-950/40 rounded border border-indigo-500/20" />
                                <div className="w-2/4 bg-slate-950/70 rounded border border-cyan-400/30 flex items-center justify-center">
                                  <span className="text-[8px] font-bold text-cyan-300">FLIGHT COMP</span>
                                </div>
                                <div className="w-1/4 bg-indigo-950/40 rounded border border-indigo-500/20" />
                              </div>
                            </div>
                          )}

                          {layout.id === 'steampunk_lab' && (
                            <div className="w-full h-full bg-[#150e0a] rounded border-2 border-amber-700/70 p-1 flex flex-col justify-between text-amber-200 font-serif text-[8px]">
                              <div className="bg-[#24150b] px-1 py-0.5 rounded border border-amber-700/50 flex items-center justify-between text-[7px] font-mono">
                                <span className="text-amber-300 font-bold">⚙ PATENTE 1889</span>
                                <span className="text-orange-400">142 PSI</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch font-mono">
                                <div className="w-1/4 bg-amber-950/30 rounded border border-amber-800/30" />
                                <div className="w-2/4 bg-[#1d120a] rounded border border-amber-600/40 flex items-center justify-center">
                                  <span className="text-[7px] font-bold text-amber-200">PISTÕES A VAPOR</span>
                                </div>
                                <div className="w-1/4 bg-amber-950/30 rounded border border-amber-800/30" />
                              </div>
                            </div>
                          )}

                          {layout.id === 'retro_mac_classic' && (
                            <div className="w-full h-full bg-[#e6e2d8] rounded border-2 border-[#59554d] p-1 flex flex-col justify-between text-black font-mono text-[8px]">
                              <div className="bg-white border-b border-black px-1 flex items-center justify-between text-[7px] font-bold">
                                <span> File Edit View</span>
                                <span>128K</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-[#f5f2ea] border border-black" />
                                <div className="w-2/4 bg-white border border-black flex items-center justify-center">
                                  <span className="text-[7px] font-bold">Arena.app</span>
                                </div>
                                <div className="w-1/4 bg-[#f5f2ea] border border-black" />
                              </div>
                            </div>
                          )}

                          {layout.id === 'speedrun_arena' && (
                            <div className="w-full h-full bg-[#0e0709] rounded border-2 border-red-500/50 p-1 flex flex-col justify-between text-red-300 font-mono text-[8px]">
                              <div className="bg-[#1c080d] px-1 py-0.5 rounded border border-red-500/40 flex items-center justify-between text-[7px]">
                                <span className="text-white font-bold">ESPORTS ARENA</span>
                                <span className="text-yellow-400 font-bold">-0.48s</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-red-950/40 rounded border border-red-500/20" />
                                <div className="w-2/4 bg-black/80 rounded border border-yellow-500/40 flex items-center justify-center">
                                  <span className="text-[8px] font-bold text-yellow-300">STAGE 1</span>
                                </div>
                                <div className="w-1/4 bg-red-950/40 rounded border border-red-500/20" />
                              </div>
                            </div>
                          )}

                          {layout.id === 'school_chalkboard' && (
                            <div className="w-full h-full bg-[#142920] rounded border-2 border-[#854d0e] p-1 flex flex-col justify-between text-emerald-100 font-mono text-[8px]">
                              <div className="bg-[#0f221a] px-1 py-0.5 rounded border-b border-dashed border-emerald-500/30 flex items-center justify-between text-[7px]">
                                <span className="text-yellow-200 font-bold">LOUSA ESCOLAR</span>
                                <span className="text-emerald-300">SALA 104</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-[#0f221a]/80 border-r border-dashed border-emerald-500/20" />
                                <div className="w-2/4 bg-[#142920] flex items-center justify-center">
                                  <span className="text-[8px] text-yellow-100 font-bold">✎ LIÇÃO</span>
                                </div>
                                <div className="w-1/4 bg-[#0f221a]/80 border-l border-dashed border-emerald-500/20" />
                              </div>
                              <div className="bg-[#713f12] text-[6px] px-1 py-0.2 rounded text-amber-200 flex justify-between">
                                <span>Porta-Gizes</span>
                                <div className="flex gap-1">
                                  <span className="w-2 h-1 bg-white inline-block" />
                                  <span className="w-2 h-1 bg-yellow-300 inline-block" />
                                </div>
                              </div>
                            </div>
                          )}

                          {layout.id === 'star_wars_cockpit' && (
                            <div className="w-full h-full bg-[#030712] rounded border border-amber-500/50 p-1 flex flex-col justify-between text-amber-300 font-mono text-[8px] relative overflow-hidden">
                              <div className="bg-[#0e121e] px-1 py-0.5 rounded border border-amber-500/30 flex items-center justify-between text-[7px]">
                                <span className="text-amber-400 font-bold">COCKPIT T-65</span>
                                <span className="text-cyan-300">LOCK 100%</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-amber-950/40 rounded border border-amber-500/20" />
                                <div className="w-2/4 bg-black/60 rounded border border-amber-500/40 flex items-center justify-center">
                                  <span className="text-[8px] font-bold text-amber-300">+ TARGET +</span>
                                </div>
                                <div className="w-1/4 bg-amber-950/40 rounded border border-amber-500/20" />
                              </div>
                              <div className="text-[6px] text-amber-400/80 text-center font-bold">HYPERDRIVE ARMED</div>
                            </div>
                          )}

                          {layout.id === 'minecraft_block' && (
                            <div className="w-full h-full bg-[#181412] rounded border-2 border-[#4a423a] p-1 flex flex-col justify-between text-stone-300 font-mono text-[8px]">
                              <div className="bg-[#1b1815] px-1 py-0.5 border border-[#332c26] flex items-center justify-between text-[7px]">
                                <span className="text-emerald-400 font-bold">MINECRAFT GUI</span>
                                <span className="text-red-400">❤❤❤❤❤</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-[#24201c] border border-[#332c26]" />
                                <div className="w-2/4 bg-[#1c1916] border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-[8px] font-bold">
                                  CRAFT 3x3
                                </div>
                                <div className="w-1/4 bg-[#24201c] border border-[#332c26]" />
                              </div>
                              <div className="h-1 bg-gradient-to-r from-lime-500 to-emerald-400 w-full" />
                            </div>
                          )}

                          {layout.id === 'shonen_combat' && (
                            <div className="w-full h-full bg-[#0a0502] rounded border border-orange-500/60 p-1 flex flex-col justify-between text-amber-200 font-mono text-[8px]">
                              <div className="bg-[#180a03] px-1 py-0.5 rounded border border-orange-500/40 flex items-center justify-between text-[7px]">
                                <span className="text-orange-400 font-bold">TORNEIO KI</span>
                                <span className="text-amber-300 font-bold">&gt;9000!</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-orange-950/40 rounded border border-orange-500/20" />
                                <div className="w-2/4 bg-black/70 rounded border border-orange-500/50 flex items-center justify-center text-orange-400 text-[8px] font-black animate-pulse">
                                  AURA MAX
                                </div>
                                <div className="w-1/4 bg-orange-950/40 rounded border border-orange-500/20" />
                              </div>
                              <div className="text-[6px] text-orange-400 text-center font-bold">SALA DO TEMPO</div>
                            </div>
                          )}

                          {layout.id === 'mushroom_kingdom' && (
                            <div className="w-full h-full bg-[#100d1c] rounded border border-emerald-500/50 p-1 flex flex-col justify-between text-yellow-200 font-mono text-[8px]">
                              <div className="bg-[#1b152b] px-1 py-0.5 rounded border border-emerald-500/40 flex items-center justify-between text-[7px]">
                                <span className="text-yellow-400 font-bold">WORLD 8-4</span>
                                <span className="text-emerald-400 font-bold">🪙 999</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-purple-950/40 rounded border border-purple-500/20" />
                                <div className="w-2/4 bg-black/60 rounded border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-[8px] font-bold">
                                  WARP PIPE
                                </div>
                                <div className="w-1/4 bg-purple-950/40 rounded border border-purple-500/20" />
                              </div>
                              <div className="text-[6px] text-yellow-300 text-center font-bold">THANK YOU MARIO!</div>
                            </div>
                          )}

                          {layout.id === 'infinite_void_realm' && (
                            <div className="w-full h-full bg-[#02040d] rounded border border-sky-400/60 p-1 flex flex-col justify-between text-sky-200 font-mono text-[8px] relative overflow-hidden shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                              <div className="bg-[#050c20] px-1 py-0.5 rounded border border-sky-500/40 flex items-center justify-between text-[7px]">
                                <span className="text-sky-300 font-bold truncate">VAZIO INFINITO 領域</span>
                                <span className="text-cyan-300 font-bold">100% ILIMITADO</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-sky-950/40 rounded border border-sky-500/30" />
                                <div className="w-2/4 bg-black/80 rounded border border-sky-400/50 flex items-center justify-center text-sky-200 text-[8px] font-black shadow-[0_0_12px_rgba(56,189,248,0.4)]">
                                  SINGULARIDADE
                                </div>
                                <div className="w-1/4 bg-indigo-950/40 rounded border border-indigo-500/30" />
                              </div>
                              <div className="text-[6px] text-sky-400 text-center font-bold">HORIZONTE DE EVENTOS</div>
                            </div>
                          )}

                          {layout.id === 'pirate_deck' && (
                            <div className="w-full h-full bg-[#120306] rounded border border-rose-500/60 p-1 flex flex-col justify-between text-rose-200 font-mono text-[8px] relative overflow-hidden shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                              <div className="bg-[#1c0508] px-1 py-0.5 rounded border border-rose-500/40 flex items-center justify-between text-[7px]">
                                <span className="text-amber-400 font-bold truncate">CONVÉS PIRATA</span>
                                <span className="text-rose-400 font-bold">MARCHA 2</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-rose-950/40 rounded border border-rose-500/30" />
                                <div className="w-2/4 bg-[#1e0509] rounded border border-rose-400/50 flex items-center justify-center text-rose-300 text-[8px] font-black shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                                  VAPOR OVERDRIVE
                                </div>
                                <div className="w-1/4 bg-amber-950/40 rounded border border-amber-500/30" />
                              </div>
                              <div className="text-[6px] text-amber-400 text-center font-bold">ROTA: GRAND LINE</div>
                            </div>
                          )}

                          {layout.id === 'judgment_hall' && (
                            <div className="w-full h-full bg-[#030a10] rounded border border-cyan-400/60 p-1 flex flex-col justify-between text-cyan-200 font-mono text-[8px] relative overflow-hidden shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                              <div className="bg-[#020e18] px-1 py-0.5 rounded border border-cyan-500/40 flex items-center justify-between text-[7px]">
                                <span className="text-white font-bold truncate">SALÃO DO JULGAMENTO</span>
                                <span className="text-cyan-400 font-bold">BAD TIME</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-cyan-950/40 rounded border border-cyan-500/30" />
                                <div className="w-2/4 bg-black rounded border border-cyan-400/60 flex items-center justify-center text-cyan-300 text-[8px] font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                                  💀 GASTER BLASTER
                                </div>
                                <div className="w-1/4 bg-cyan-950/40 rounded border border-cyan-500/30" />
                              </div>
                              <div className="text-[6px] text-cyan-400 text-center font-bold">RETRIBUIÇÃO KÁRMICA</div>
                            </div>
                          )}

                          {layout.id === 'edgerunner_rig' && (
                            <div className="w-full h-full bg-[#0d0f04] rounded border border-yellow-400/70 p-1 flex flex-col justify-between text-yellow-200 font-mono text-[8px] relative overflow-hidden shadow-[0_0_10px_rgba(234,179,8,0.25)]">
                              <div className="bg-[#191c04] px-1 py-0.5 rounded border border-yellow-400/40 flex items-center justify-between text-[7px]">
                                <span className="text-yellow-400 font-bold truncate">SANDEVISTAN 2077</span>
                                <span className="text-cyan-400 font-bold">-85% SLOW</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-yellow-950/40 rounded border border-yellow-400/30" />
                                <div className="w-2/4 bg-black/80 rounded border border-cyan-400/50 flex items-center justify-center text-yellow-300 text-[8px] font-black">
                                  120+ PPM WARP
                                </div>
                                <div className="w-1/4 bg-cyan-950/40 rounded border border-cyan-400/30" />
                              </div>
                              <div className="text-[6px] text-yellow-400 text-center font-bold">EDGERUNNER PROTOCOL</div>
                            </div>
                          )}

                          {layout.id === 'slayer_dojo' && (
                            <div className="w-full h-full bg-[#140602] rounded border border-orange-500/70 p-1 flex flex-col justify-between text-orange-200 font-mono text-[8px] relative overflow-hidden shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                              <div className="bg-[#1c0803] px-1 py-0.5 rounded border border-orange-500/40 flex items-center justify-between text-[7px]">
                                <span className="text-amber-400 font-bold truncate">DOJO SOLAR</span>
                                <span className="text-orange-400 font-bold">HINOKAMI</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-orange-950/40 rounded border border-orange-500/30" />
                                <div className="w-2/4 bg-[#1f0903] rounded border border-amber-500/50 flex items-center justify-center text-amber-300 text-[8px] font-bold">
                                  DRAGÃO SOLAR
                                </div>
                                <div className="w-1/4 bg-sky-950/40 rounded border border-sky-500/30" />
                              </div>
                              <div className="text-[6px] text-orange-400 text-center font-bold">RESPIRAÇÃO DA ÁGUA</div>
                            </div>
                          )}

                          {layout.id === 'pocket_console' && (
                            <div className="w-full h-full bg-[#141203] rounded border border-yellow-300/70 p-1 flex flex-col justify-between text-yellow-200 font-mono text-[8px] relative overflow-hidden shadow-[0_0_10px_rgba(253,224,71,0.2)]">
                              <div className="bg-[#1c1904] px-1 py-0.5 rounded border border-yellow-400/40 flex items-center justify-between text-[7px]">
                                <span className="text-yellow-300 font-bold truncate">CONSOLE 1996</span>
                                <span className="text-emerald-400 font-bold">BAT 99%</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-yellow-950/40 rounded border border-yellow-400/30 flex items-center justify-center text-[7px] text-yellow-300 font-black">+</div>
                                <div className="w-2/4 bg-[#8b956d]/30 rounded border border-[#8b956d] flex items-center justify-center text-yellow-200 text-[8px] font-bold">
                                  100.000 VOLTS
                                </div>
                                <div className="w-1/4 bg-yellow-950/40 rounded border border-yellow-400/30 flex items-center justify-center gap-0.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                </div>
                              </div>
                              <div className="text-[6px] text-yellow-400 text-center font-bold">CHOQUE DO TROVÃO</div>
                            </div>
                          )}

                          {layout.id === 'manga_action' && (
                            <div className="w-full h-full bg-[#120303] rounded border-2 border-red-500/80 p-1 flex flex-col justify-between text-red-200 font-mono text-[8px] relative overflow-hidden shadow-[0_0_10px_rgba(239,68,68,0.25)]">
                              <div className="bg-[#1c0404] px-1 py-0.5 rounded border border-red-500/50 flex items-center justify-between text-[7px]">
                                <span className="text-yellow-300 font-black truncate">MANGÁ HEROICO</span>
                                <span className="text-red-400 font-bold">POW!!</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-red-950/40 rounded border border-red-500/30" />
                                <div className="w-2/4 bg-white/10 rounded border-2 border-white/60 flex items-center justify-center text-white text-[8px] font-black tracking-wider">
                                  SOCO SÉRIO
                                </div>
                                <div className="w-1/4 bg-red-950/40 rounded border border-red-500/30" />
                              </div>
                              <div className="text-[6px] text-yellow-300 text-center font-bold">ONDA DE CHOQUE SÍSMICA</div>
                            </div>
                          )}

                          {layout.id === 'hollow_ruins' && (
                            <div className="w-full h-full bg-[#030912] rounded border border-sky-300/60 p-1 flex flex-col justify-between text-sky-200 font-mono text-[8px] relative overflow-hidden shadow-[0_0_10px_rgba(125,211,252,0.2)]">
                              <div className="bg-[#040e1b] px-1 py-0.5 rounded border border-sky-400/40 flex items-center justify-between text-[7px]">
                                <span className="text-sky-200 font-bold truncate">HALLOWNEST</span>
                                <span className="text-teal-300 font-bold">ALMA CHEIA</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-sky-950/40 rounded border border-sky-400/30" />
                                <div className="w-2/4 bg-black/70 rounded border border-sky-300/50 flex items-center justify-center text-sky-100 text-[8px] font-bold shadow-[0_0_8px_rgba(125,211,252,0.3)]">
                                  AGULHA PURA
                                </div>
                                <div className="w-1/4 bg-sky-950/40 rounded border border-sky-400/30" />
                              </div>
                              <div className="text-[6px] text-sky-300 text-center font-bold">CIDADE DAS LÁGRIMAS</div>
                            </div>
                          )}

                          {layout.id === 'green_hills_zone' && (
                            <div className="w-full h-full bg-[#030e1c] rounded border border-sky-400/70 p-1 flex flex-col justify-between text-sky-200 font-mono text-[8px] relative overflow-hidden shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                              <div className="bg-[#04152a] px-1 py-0.5 rounded border border-sky-400/40 flex items-center justify-between text-[7px]">
                                <span className="text-emerald-400 font-bold truncate">COLINAS TROPICAIS</span>
                                <span className="text-yellow-300 font-bold">🪙 999</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-emerald-950/40 rounded border border-emerald-500/30" />
                                <div className="w-2/4 bg-[#081b36] rounded border border-yellow-400/50 flex items-center justify-center text-yellow-300 text-[8px] font-black">
                                  MACH 3 SPEED
                                </div>
                                <div className="w-1/4 bg-amber-950/40 rounded border border-amber-500/30" />
                              </div>
                              <div className="text-[6px] text-yellow-400 text-center font-bold">LOOP-DE-LOOP 16-BIT</div>
                            </div>
                          )}

                          {layout.id === 'bat_cave_tactical' && (
                            <div className="w-full h-full bg-[#090703] rounded border border-amber-500/60 p-1 flex flex-col justify-between text-amber-200 font-mono text-[8px] relative overflow-hidden shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                              <div className="bg-[#140e04] px-1 py-0.5 rounded border border-amber-500/40 flex items-center justify-between text-[7px]">
                                <span className="text-amber-400 font-bold truncate">BATCOMPUTADOR</span>
                                <span className="text-yellow-300 font-bold">SONAR 360°</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-amber-950/40 rounded border border-amber-500/30" />
                                <div className="w-2/4 bg-black/90 rounded border border-amber-500/50 flex items-center justify-center text-amber-300 text-[8px] font-bold">
                                  🦇 TÁTICO NOTURNO
                                </div>
                                <div className="w-1/4 bg-amber-950/40 rounded border border-amber-500/30" />
                              </div>
                              <div className="text-[6px] text-amber-400 text-center font-bold">VIGILÂNCIA DE GOTHAM</div>
                            </div>
                          )}

                          {layout.id === 'whatsapp_chat_layout' && (
                            <div className="w-full h-full bg-[#0b141a] rounded border border-[#25d366]/40 p-1 flex flex-col justify-between text-[#e9edef] font-sans text-[8px] relative overflow-hidden shadow-[0_0_10px_rgba(37,211,102,0.15)]">
                              <div className="bg-[#202c33] px-1.5 py-0.5 rounded flex items-center justify-between text-[7px] border-b border-[#2a3942]">
                                <div className="flex items-center gap-1 min-w-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#25d366] flex-shrink-0" />
                                  <span className="text-white font-bold truncate text-[7px]">WhatsApp Web</span>
                                </div>
                                <span className="text-[#25d366] font-mono text-[6px]">🔒 Seguro</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-[#111b21] rounded border border-[#202c33] flex items-center justify-center text-[7px]">💬</div>
                                <div className="w-2/4 bg-[#0b141a] rounded border border-[#25d366]/30 flex flex-col justify-center items-center px-1">
                                  <div className="bg-[#005c4b] text-[#25d366] rounded px-1.5 py-0.5 text-[6px] font-bold flex items-center gap-0.5 shadow">
                                    <span>✓✓</span> <span>Mensagem</span>
                                  </div>
                                </div>
                                <div className="w-1/4 bg-[#111b21] rounded border border-[#202c33] flex items-center justify-center text-[7px]">📎</div>
                              </div>
                              <div className="text-[6px] text-[#25d366] text-center font-mono">STATUS ONLINE // CHAT ZAP</div>
                            </div>
                          )}

                          {layout.id === 'instagram_feed_layout' && (
                            <div className="w-full h-full bg-[#0c0614] rounded border border-[#e1306c]/40 p-1 flex flex-col justify-between text-pink-200 font-sans text-[8px] relative overflow-hidden shadow-[0_0_10px_rgba(225,48,108,0.2)]">
                              <div className="bg-[#170d24] px-1.5 py-0.5 rounded flex items-center justify-between text-[7px] border-b border-[#301646]">
                                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f77737] to-[#e1306c] text-[7px]">InstaType</span>
                                <div className="flex gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-[#feda75] to-[#d62976]" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-[#feda75] to-[#d62976]" />
                                </div>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-[#170d24] rounded border border-pink-500/20 flex items-center justify-center text-[7px]">✦ Perfil</div>
                                <div className="w-2/4 bg-[#12071f] rounded border border-[#e1306c]/40 flex flex-col justify-center items-center">
                                  <span className="text-[#e1306c] font-black text-[7px]">❤️ STORIES</span>
                                  <span className="text-[6px] text-zinc-400">@typeclicker</span>
                                </div>
                                <div className="w-1/4 bg-[#170d24] rounded border border-pink-500/20 flex items-center justify-center text-[7px]">🛍️ Loja</div>
                              </div>
                              <div className="text-[6px] text-pink-400 text-center font-bold">REELS & STORIES // SUNSET</div>
                            </div>
                          )}

                          {layout.id === 'youtube_theater_layout' && (
                            <div className="w-full h-full bg-[#0f0f0f] rounded border border-red-500/40 p-1 flex flex-col justify-between text-zinc-300 font-sans text-[8px] relative overflow-hidden shadow-[0_0_10px_rgba(255,0,0,0.2)]">
                              <div className="bg-[#181818] px-1.5 py-0.5 rounded flex items-center justify-between text-[7px] border-b border-[#2b2b2b]">
                                <div className="flex items-center gap-1">
                                  <span className="bg-[#ff0000] text-white px-1 rounded text-[5px] font-black">▶ PLAY</span>
                                  <span className="text-white font-bold text-[7px]">YouTube</span>
                                </div>
                                <span className="bg-[#ff0000] text-white px-1 rounded text-[5px] font-bold">INSCREVER</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-[#181818] rounded border border-zinc-800 flex items-center justify-center text-[6px]">Painel</div>
                                <div className="w-2/4 bg-black rounded border border-red-500/30 flex flex-col justify-center items-center relative overflow-hidden">
                                  <span className="text-red-500 font-black text-[7px]">1080p60 HD</span>
                                  <div className="w-full bg-zinc-800 h-1 absolute bottom-0">
                                    <div className="w-2/3 bg-red-600 h-full" />
                                  </div>
                                </div>
                                <div className="w-1/4 bg-[#181818] rounded border border-zinc-800 flex items-center justify-center text-[6px]">Loja</div>
                              </div>
                              <div className="text-[6px] text-zinc-400 text-center font-mono">SALA DO CRIADOR // THEATER</div>
                            </div>
                          )}

                          {layout.id === 'tiktok_stream_layout' && (
                            <div className="w-full h-full bg-[#010101] rounded border border-[#fe2c55]/40 p-1 flex flex-col justify-between text-white font-sans text-[8px] relative overflow-hidden shadow-[0_0_10px_rgba(0,242,254,0.2)]">
                              <div className="bg-[#080808] px-1.5 py-0.5 rounded flex items-center justify-between text-[7px] border-b border-[#222]">
                                <span className="font-black text-[#fe2c55] text-[7px]">Tok<span className="text-[#00f2fe]">Type</span></span>
                                <span className="text-white font-bold border-b border-[#fe2c55] text-[6px]">Para Você</span>
                                <span className="text-[7px]">💿</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-[#0d0d0d] rounded border border-[#222] flex items-center justify-center text-[6px]">🔥 FYP</div>
                                <div className="w-2/4 bg-black rounded border border-[#00f2fe]/40 flex flex-col justify-center items-center">
                                  <span className="text-[#00f2fe] font-mono text-[7px] font-bold">🎵 BEAT SYNC</span>
                                  <span className="text-[#fe2c55] text-[5px]">❤️ 98.4K</span>
                                </div>
                                <div className="w-1/4 bg-[#0d0d0d] rounded border border-[#222] flex items-center justify-center text-[6px]">Loja</div>
                              </div>
                              <div className="text-[6px] text-[#00f2fe] text-center font-mono">GLITCH NEON // VERTICAL LIVE</div>
                            </div>
                          )}

                          {layout.id === 'roblox_studio_layout' && (
                            <div className="w-full h-full bg-[#111216] rounded border-2 border-[#292c37] p-1 flex flex-col justify-between text-zinc-200 font-mono text-[8px] relative overflow-hidden shadow-[0_0_10px_rgba(226,35,26,0.2)]">
                              <div className="bg-[#171920] px-1.5 py-0.5 rounded flex items-center justify-between text-[7px] border-b border-[#292c37]">
                                <div className="flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-[#e2231a] rounded-sm" />
                                  <span className="text-white font-black text-[6px]">ROBLOX STUDIO</span>
                                </div>
                                <span className="text-amber-400 font-bold text-[5px]">🪙 R$ 999K</span>
                              </div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 bg-[#1b1d24] rounded border border-[#292c37] flex items-center justify-center text-[6px]">Explorer</div>
                                <div className="w-2/4 bg-[#111216] rounded border border-[#00a2ff]/40 flex flex-col justify-center items-center">
                                  <span className="text-[#00a2ff] font-bold text-[7px]">VIEWPORT 3D</span>
                                  <span className="text-[5px] text-zinc-400">1 STUD GRID</span>
                                </div>
                                <div className="w-1/4 bg-[#1b1d24] rounded border border-[#292c37] flex items-center justify-center text-[6px]">Toolbox</div>
                              </div>
                              <div className="text-[6px] text-[#00a2ff] text-center font-bold">BLOCKS 3D // PHYSICS</div>
                            </div>
                          )}

                          {/* Fallback genérico para layouts sem preview explícito */}
                          {![
                            'default_terminal', 'arcade_cabinet', 'zen_focus', 'bios_dos', 'cyber_deck',
                            'ide_developer', 'space_station', 'steampunk_lab', 'retro_mac_classic',
                            'speedrun_arena', 'school_chalkboard', 'star_wars_cockpit', 'minecraft_block',
                            'shonen_combat', 'mushroom_kingdom', 'infinite_void_realm', 'pirate_deck',
                            'judgment_hall', 'edgerunner_rig', 'slayer_dojo', 'pocket_console',
                            'manga_action', 'hollow_ruins', 'green_hills_zone', 'bat_cave_tactical',
                            'whatsapp_chat_layout', 'instagram_feed_layout', 'youtube_theater_layout',
                            'tiktok_stream_layout', 'roblox_studio_layout'
                          ].includes(layout.id) && (
                            <div
                              className="w-full h-full rounded border p-1 flex flex-col justify-between font-mono text-[8px]"
                              style={{
                                backgroundColor: layout.previewColors?.bg || '#111',
                                borderColor: layout.previewColors?.border || '#444',
                                color: layout.previewColors?.accent || '#fff'
                              }}
                            >
                              <div className="px-1 text-[7px] font-bold truncate">{layout.name}</div>
                              <div className="flex gap-1 flex-1 my-0.5 items-stretch">
                                <div className="w-1/4 rounded bg-white/10" />
                                <div className="w-2/4 rounded bg-white/15 flex items-center justify-center text-[8px] font-bold">ARENA</div>
                                <div className="w-1/4 rounded bg-white/10" />
                              </div>
                              <div className="text-[6px] text-center opacity-80 truncate">{layout.subtitle}</div>
                            </div>
                          )}
                        </div>

                        {/* Descrição */}
                        <p className="text-xs text-zinc-300/85 leading-relaxed">
                          {layout.description}
                        </p>

                        {/* Lista de Recursos */}
                        <div className="flex flex-wrap gap-1.5">
                          {layout.features.map((feat, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/50"
                            >
                              ✓ {feat}
                            </span>
                          ))}
                        </div>

                        {/* Ação: Equipado / Equipar / Desbloquear */}
                        <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-semibold flex items-center gap-1">
                            {layout.price === 0 ? (
                              <span className="text-emerald-400 font-bold">Grátis</span>
                            ) : isQuantumCurrency ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                                <span className="text-cyan-300 font-bold">{layout.price} Fragmentos</span>
                              </>
                            ) : isDuelCurrency ? (
                              <>
                                <Swords className="w-3.5 h-3.5 text-rose-400" />
                                <span className="text-rose-300 font-bold">{layout.price} Moedas</span>
                              </>
                            ) : (
                              <>
                                <Coins className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-amber-300 font-bold">{layout.price} Tokens</span>
                              </>
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleUnlockOrEquipLayout(layout.id, layout.price, layout.currency)}
                            disabled={isEquipped || (!isUnlocked && !canAfford)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed ${
                              isEquipped
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 opacity-90'
                                : isUnlocked
                                ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600'
                                : canAfford
                                ? isQuantumCurrency
                                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                                  : isDuelCurrency
                                  ? 'bg-rose-600 hover:bg-rose-500 text-white font-black shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                                : 'bg-zinc-900 text-zinc-500 border border-zinc-800 opacity-60'
                            }`}
                          >
                            {isEquipped ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-purple-400" />
                                <span>Equipado</span>
                              </>
                            ) : isUnlocked ? (
                              <span>Equipar</span>
                            ) : canAfford ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5 fill-current" />
                                <span>
                                  {isAdmin
                                    ? 'Desbloquear (ADM)'
                                    : `Desbloquear (${layout.price} ${
                                        isQuantumCurrency ? 'Fragmentos' : isDuelCurrency ? 'Moedas' : 'Tks'
                                      })`}
                                </span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3 text-zinc-500" />
                                <span>
                                  {isQuantumCurrency
                                    ? 'Faltam Fragmentos'
                                    : isDuelCurrency
                                    ? 'Faltam Moedas'
                                    : 'Faltam Tokens'}
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* ABA 1: TEMAS DE TERMINAL */}
            {activeTab === 'themes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {Object.values(TERMINAL_THEMES)
                  .filter(theme => {
                    const itemCurrency = theme.currency || 'tokens';
                    if (currencyFilter === 'tokens') return itemCurrency === 'tokens';
                    if (currencyFilter === 'duel_coins') return itemCurrency === 'duel_coins';
                    if (currencyFilter === 'quantum_fragments') return itemCurrency === 'quantum_fragments';
                    return true;
                  })
                  .map(theme => {
                    const isUnlocked = cosmetics.unlockedThemes.includes(theme.id);
                    const isEquipped = cosmetics.equippedTheme === theme.id;
                    const isQuantumCurrency = theme.currency === 'quantum_fragments';
                    const isDuelCurrency = theme.currency === 'duel_coins';
                    const canAfford = isAdmin || (
                      isQuantumCurrency ? currentQuantumFragments >= theme.price :
                      isDuelCurrency ? currentDuelTokens >= theme.price :
                      currentTokens >= theme.price
                    );

                    return (
                      <div
                        key={theme.id}
                        className={`relative p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                          isEquipped
                            ? 'bg-[#161a26] border-purple-500/70 shadow-[0_0_18px_rgba(168,85,247,0.25)] ring-1 ring-purple-500/40'
                            : isUnlocked
                            ? 'bg-[#131620] border-zinc-700/60 hover:border-zinc-600'
                            : 'bg-[#0f1118]/80 border-zinc-800/70'
                        }`}
                      >
                        {/* Topo do Card */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                                {theme.name}
                              </h3>
                              {isEquipped && (
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Ativo
                                </span>
                              )}
                              {isQuantumCurrency && (
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 shadow-[0_0_8px_rgba(6,182,212,0.25)]">
                                  <Sparkles className="w-3 h-3 text-cyan-400" /> Quântico 🌌
                                </span>
                              )}
                              {isDuelCurrency && (
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                                  <Swords className="w-3 h-3 text-rose-400" /> Arena 1x1
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{theme.subtitle}</p>
                          </div>

                          {/* Paleta de Cores em Bolinhas */}
                          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-zinc-800">
                            <span className="w-3.5 h-3.5 rounded-full border border-black/50" style={{ backgroundColor: theme.previewColors.bg }} title="Fundo" />
                            <span className="w-3.5 h-3.5 rounded-full border border-black/50" style={{ backgroundColor: theme.previewColors.card }} title="Cartões" />
                            <span className="w-3.5 h-3.5 rounded-full border border-black/50" style={{ backgroundColor: theme.previewColors.accent }} title="Realce" />
                            <span className="w-3.5 h-3.5 rounded-full border border-black/50" style={{ backgroundColor: theme.previewColors.text }} title="Texto" />
                          </div>
                        </div>

                        {/* Descrição */}
                        <p className="text-xs text-zinc-300/85 leading-relaxed line-clamp-2">
                          {theme.description}
                        </p>

                        {/* Efeito Visual Animado no Terminal */}
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-purple-300 bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-900/40">
                          <Sparkles className="w-3 h-3 text-purple-400 flex-shrink-0" />
                          <span className="truncate">Efeito: <strong>{theme.effectType.replace(/_/g, ' ').toUpperCase()}</strong></span>
                        </div>

                        {/* Ação: Equipado / Equipar / Desbloquear */}
                        <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-semibold flex items-center gap-1">
                            {theme.price === 0 ? (
                              <span className="text-emerald-400 font-bold">Grátis</span>
                            ) : isQuantumCurrency ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                                <span className="text-cyan-300 font-bold">{theme.price} Fragmentos</span>
                              </>
                            ) : isDuelCurrency ? (
                              <>
                                <Swords className="w-3.5 h-3.5 text-rose-400" />
                                <span className="text-rose-300 font-bold">{theme.price} Moedas</span>
                              </>
                            ) : (
                              <>
                                <Coins className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-amber-300 font-bold">{theme.price} Tokens</span>
                              </>
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleUnlockOrEquipTheme(theme.id, theme.price, theme.currency)}
                            disabled={isEquipped || (!isUnlocked && !canAfford)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed ${
                              isEquipped
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 opacity-90'
                                : isUnlocked
                                ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600'
                                : canAfford
                                ? isQuantumCurrency
                                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                                  : isDuelCurrency
                                  ? 'bg-rose-600 hover:bg-rose-500 text-white font-black shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                                : 'bg-zinc-900 text-zinc-500 border border-zinc-800 opacity-60'
                            }`}
                          >
                            {isEquipped ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-purple-400" />
                                <span>Equipado</span>
                              </>
                            ) : isUnlocked ? (
                              <span>Equipar</span>
                            ) : canAfford ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5 fill-current" />
                                <span>
                                  {isAdmin
                                    ? 'Desbloquear (ADM)'
                                    : `Desbloquear (${theme.price} ${
                                        isQuantumCurrency ? 'Fragmentos' : isDuelCurrency ? 'Moedas' : 'Tks'
                                      })`}
                                </span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3 text-zinc-500" />
                                <span>
                                  {isQuantumCurrency
                                    ? 'Faltam Fragmentos'
                                    : isDuelCurrency
                                    ? 'Faltam Moedas'
                                    : 'Faltam Tokens'}
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* ABA 2: SKINS DO BYTEZINHO */}
            {activeTab === 'skins' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {Object.values(BYTEZINHO_SKINS)
                  .filter(skin => {
                    const itemCurrency = skin.currency || 'tokens';
                    if (currencyFilter === 'tokens') return itemCurrency === 'tokens';
                    if (currencyFilter === 'duel_coins') return itemCurrency === 'duel_coins';
                    if (currencyFilter === 'quantum_fragments') return itemCurrency === 'quantum_fragments';
                    return true;
                  })
                  .map(skin => {
                    const isUnlocked = cosmetics.unlockedSkins.includes(skin.id);
                    const isEquipped = cosmetics.equippedSkin === skin.id;
                    const isQuantumCurrency = skin.currency === 'quantum_fragments';
                    const isDuelCurrency = skin.currency === 'duel_coins';
                    const canAfford = isAdmin || (
                      isQuantumCurrency ? currentQuantumFragments >= skin.price :
                      isDuelCurrency ? currentDuelTokens >= skin.price :
                      currentTokens >= skin.price
                    );

                    return (
                      <div
                        key={skin.id}
                        className={`relative p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                          isEquipped
                            ? 'bg-[#161a26] border-purple-500/70 shadow-[0_0_18px_rgba(168,85,247,0.25)] ring-1 ring-purple-500/40'
                            : isUnlocked
                            ? 'bg-[#131620] border-zinc-700/60 hover:border-zinc-600'
                            : 'bg-[#0f1118]/80 border-zinc-800/70'
                        }`}
                      >
                        {/* Visualizador da Skin */}
                        <div className="relative w-full h-28 bg-[#090b10] rounded-lg border border-zinc-800/80 flex items-center justify-center overflow-hidden">
                          <BytezinhoAvatar skin={skin.id} size="lg" interactive />
                          <span className={`absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                            isQuantumCurrency
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold shadow-[0_0_8px_rgba(6,182,212,0.25)]'
                              : isDuelCurrency
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                              : 'bg-zinc-800/90 text-zinc-300 border-zinc-700/60'
                          }`}>
                            {isQuantumCurrency && <Sparkles className="w-3 h-3 text-cyan-400" />}
                            {isDuelCurrency && <Swords className="w-3 h-3 text-rose-400" />}
                            {skin.tag}
                          </span>
                        </div>

                        {/* Título & Descrição */}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-base select-none">{skin.icon}</span>
                            <h3 className="text-sm font-bold text-white">{skin.name}</h3>
                          </div>
                          <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{skin.subtitle}</p>
                          <p className="text-xs text-zinc-300/85 mt-1.5 line-clamp-2 leading-relaxed">
                            {skin.description}
                          </p>

                          {/* Animação Específica da Skin */}
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono text-emerald-300/90 bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-900/30">
                            <span className="text-xs select-none">🎬</span>
                            <span className="truncate">{skin.animationDescription}</span>
                          </div>
                        </div>

                        {/* Botão de Ação */}
                        <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-semibold flex items-center gap-1">
                            {skin.price === 0 ? (
                              <span className="text-emerald-400 font-bold">Padrão</span>
                            ) : isQuantumCurrency ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                                <span className="text-cyan-300 font-bold">{skin.price} Fragmentos</span>
                              </>
                            ) : isDuelCurrency ? (
                              <>
                                <Swords className="w-3.5 h-3.5 text-rose-400" />
                                <span className="text-rose-300 font-bold">{skin.price} Moedas</span>
                              </>
                            ) : (
                              <>
                                <Coins className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-amber-300 font-bold">{skin.price} Tokens</span>
                              </>
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleUnlockOrEquipSkin(skin.id, skin.price, skin.currency)}
                            disabled={isEquipped || (!isUnlocked && !canAfford)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed ${
                              isEquipped
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 opacity-90'
                                : isUnlocked
                                ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600'
                                : canAfford
                                ? isQuantumCurrency
                                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                                  : isDuelCurrency
                                  ? 'bg-rose-600 hover:bg-rose-500 text-white font-black shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                                : 'bg-zinc-900 text-zinc-500 border border-zinc-800 opacity-60'
                            }`}
                          >
                            {isEquipped ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-purple-400" />
                                <span>Equipado</span>
                              </>
                            ) : isUnlocked ? (
                              <span>Equipar</span>
                            ) : canAfford ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5 fill-current" />
                                <span>
                                  {isAdmin
                                    ? 'Desbloquear (ADM)'
                                    : `Desbloquear (${skin.price} ${
                                        isQuantumCurrency ? 'Fragmentos' : isDuelCurrency ? 'Moedas' : 'Tks'
                                      })`}
                                </span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3 text-zinc-500" />
                                <span>
                                  {isQuantumCurrency
                                    ? 'Faltam Fragmentos'
                                    : isDuelCurrency
                                    ? 'Faltam Moedas'
                                    : 'Faltam Tokens'}
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* ABA 3: SONS DE TECLADO */}
            {activeTab === 'sounds' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {Object.values(KEY_SOUNDS)
                  .filter(sound => {
                    const itemCurrency = sound.currency || 'tokens';
                    if (currencyFilter === 'tokens') return itemCurrency === 'tokens';
                    if (currencyFilter === 'duel_coins') return itemCurrency === 'duel_coins';
                    if (currencyFilter === 'quantum_fragments') return itemCurrency === 'quantum_fragments';
                    return true;
                  })
                  .map(sound => {
                    const isUnlocked = cosmetics.unlockedSounds.includes(sound.id);
                    const isEquipped = cosmetics.equippedSound === sound.id;
                    const isQuantumCurrency = sound.currency === 'quantum_fragments';
                    const isDuelCurrency = sound.currency === 'duel_coins';
                    const canAfford = isAdmin || (
                      isQuantumCurrency ? currentQuantumFragments >= sound.price :
                      isDuelCurrency ? currentDuelTokens >= sound.price :
                      currentTokens >= sound.price
                    );
                    const isTesting = playingPreview === sound.id;

                    return (
                      <div
                        key={sound.id}
                        className={`relative p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                          isEquipped
                            ? 'bg-[#161a26] border-purple-500/70 shadow-[0_0_18px_rgba(168,85,247,0.25)] ring-1 ring-purple-500/40'
                            : isUnlocked
                            ? 'bg-[#131620] border-zinc-700/60 hover:border-zinc-600'
                            : 'bg-[#0f1118]/80 border-zinc-800/70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg select-none">{sound.icon}</span>
                              <h3 className="text-sm font-bold text-white">{sound.name}</h3>
                              {isEquipped && (
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                  Ativo
                                </span>
                              )}
                              {isQuantumCurrency && (
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 shadow-[0_0_8px_rgba(6,182,212,0.25)]">
                                  <Sparkles className="w-3 h-3 text-cyan-400" /> Quântico 🌌
                                </span>
                              )}
                              {isDuelCurrency && (
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                                  <Swords className="w-3 h-3 text-rose-400" /> Arena 1x1
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{sound.subtitle}</p>
                          </div>

                          {/* Botão de Prévia Sonora */}
                          <button
                            type="button"
                            onClick={() => handlePlayPreview(sound.id)}
                            className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                              isTesting
                                ? 'bg-amber-500 text-black border-amber-400 scale-105'
                                : 'bg-zinc-800/90 text-zinc-200 border-zinc-700 hover:bg-zinc-700 hover:text-white'
                            }`}
                            title="Clique para escutar uma prévia do clique"
                          >
                            <Volume2 className={`w-3.5 h-3.5 ${isTesting ? 'animate-bounce' : 'text-emerald-400'}`} />
                            <span className="text-[11px]">Ouvir</span>
                          </button>
                        </div>

                        <p className="text-xs text-zinc-300/85 leading-relaxed">
                          {sound.description}
                        </p>

                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 bg-black/30 px-2.5 py-1.5 rounded-lg border border-zinc-800/60">
                          <span>Sintetizador:</span>
                          <span className="text-purple-300 font-bold">{sound.type}</span>
                        </div>

                        <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-semibold flex items-center gap-1">
                            {sound.price === 0 ? (
                              <span className="text-emerald-400 font-bold">Padrão</span>
                            ) : isQuantumCurrency ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                                <span className="text-cyan-300 font-bold">{sound.price} Fragmentos</span>
                              </>
                            ) : isDuelCurrency ? (
                              <>
                                <Swords className="w-3.5 h-3.5 text-rose-400" />
                                <span className="text-rose-300 font-bold">{sound.price} Moedas</span>
                              </>
                            ) : (
                              <>
                                <Coins className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-amber-300 font-bold">{sound.price} Tokens</span>
                              </>
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleUnlockOrEquipSound(sound.id, sound.price, sound.currency)}
                            disabled={isEquipped || (!isUnlocked && !canAfford)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed ${
                              isEquipped
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 opacity-90'
                                : isUnlocked
                                ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600'
                                : canAfford
                                ? isQuantumCurrency
                                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                                  : isDuelCurrency
                                  ? 'bg-rose-600 hover:bg-rose-500 text-white font-black shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                                : 'bg-zinc-900 text-zinc-500 border border-zinc-800 opacity-60'
                            }`}
                          >
                            {isEquipped ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-purple-400" />
                                <span>Equipado</span>
                              </>
                            ) : isUnlocked ? (
                              <span>Equipar</span>
                            ) : canAfford ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5 fill-current" />
                                <span>
                                  {isAdmin
                                    ? 'Desbloquear (ADM)'
                                    : `Desbloquear (${sound.price} ${
                                        isQuantumCurrency ? 'Fragmentos' : isDuelCurrency ? 'Moedas' : 'Tks'
                                      })`}
                                </span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3 text-zinc-500" />
                                <span>
                                  {isQuantumCurrency
                                    ? 'Faltam Fragmentos'
                                    : isDuelCurrency
                                    ? 'Faltam Moedas'
                                    : 'Faltam Tokens'}
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* ABA 4: EFEITOS E ANIMAÇÕES (COMPRA, LETRAS E LEVEL UP) */}
            {activeTab === 'animations' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {Object.values(ANIMATION_CONFIGS)
                  .filter(anim => {
                    const itemCurrency = anim.currency || 'tokens';
                    if (currencyFilter === 'tokens') return itemCurrency === 'tokens';
                    if (currencyFilter === 'duel_coins') return itemCurrency === 'duel_coins';
                    if (currencyFilter === 'quantum_fragments') return itemCurrency === 'quantum_fragments';
                    return true;
                  })
                  .map((anim) => {
                    const isUnlocked = cosmetics.unlockedAnimations?.includes(anim.id) ?? (anim.id === 'confetti_classic');
                    const isEquipped = (cosmetics.equippedAnimation || 'confetti_classic') === anim.id;
                    const isQuantumCurrency = anim.currency === 'quantum_fragments';
                    const isDuelCurrency = anim.currency === 'duel_coins';
                    const canAfford = isAdmin || (
                      isQuantumCurrency ? currentQuantumFragments >= anim.price :
                      isDuelCurrency ? currentDuelTokens >= anim.price :
                      currentTokens >= anim.price
                    );
                    const isTesting = testingAnimationId === anim.id;

                    return (
                      <div
                        key={anim.id}
                        className={`relative p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                          isEquipped
                            ? 'bg-[#161a26] border-purple-500/70 shadow-[0_0_18px_rgba(168,85,247,0.25)] ring-1 ring-purple-500/40'
                            : isUnlocked
                            ? 'bg-[#131620] border-zinc-700/60 hover:border-zinc-600'
                            : 'bg-[#0f1118]/80 border-zinc-800/70'
                        }`}
                      >
                        {/* Topo do Card */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl select-none">{anim.icon}</span>
                              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                                {anim.name}
                              </h3>
                              {isEquipped && (
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Ativo
                                </span>
                              )}
                              {isQuantumCurrency && (
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 shadow-[0_0_8px_rgba(6,182,212,0.25)]">
                                  <Sparkles className="w-3 h-3 text-cyan-400" /> Quântico 🌌
                                </span>
                              )}
                              {isDuelCurrency && (
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                                  <Swords className="w-3 h-3 text-rose-400" /> Arena 1x1
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{anim.subtitle}</p>
                          </div>

                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${anim.badgeClass}`}>
                            {anim.badge}
                          </span>
                        </div>

                        {/* Descrição geral */}
                        <p className="text-xs text-zinc-300 leading-relaxed">
                          {anim.description}
                        </p>

                        {/* As 3 Áreas de Aplicação */}
                        <div className="space-y-1.5 bg-black/40 p-2.5 rounded-lg border border-zinc-800 text-[11px] font-mono">
                          <div className="flex items-center gap-1.5 text-zinc-300">
                            <span className="text-amber-400 font-bold">🛒 Compra:</span>
                            <span className="text-zinc-400 truncate">{anim.previewSummary.purchase}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-300">
                            <span className="text-sky-400 font-bold">⌨️ Teclas:</span>
                            <span className="text-zinc-400 truncate">{anim.previewSummary.terminal}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-300">
                            <span className="text-purple-400 font-bold">🏆 Level Up:</span>
                            <span className="text-zinc-400 truncate">{anim.previewSummary.levelUp}</span>
                          </div>
                        </div>

                        {/* Prévia Interativa e Botão Testar */}
                        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Prévia Letras:</span>
                            <div className="flex items-center gap-1 font-mono text-xs font-bold">
                              <span className={getLetterVfxClasses(anim.id, true, false, false)}>T</span>
                              <span className={getLetterVfxClasses(anim.id, true, false, false)}>Y</span>
                              <span className={isTesting ? getLetterVfxClasses(anim.id, false, false, true) : getLetterVfxClasses(anim.id, false, true, false)}>P</span>
                              <span className="text-zinc-600">E</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleTestAnimation(anim.id, e)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold flex items-center gap-1 transition cursor-pointer border ${
                              isTesting
                                ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700 hover:text-white'
                            }`}
                            title="Disparar prévia visual agora"
                          >
                            <Play className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                            <span>{isTesting ? 'Disparando!' : 'Testar Efeito'}</span>
                          </button>
                        </div>

                        {/* Rodapé com Preço e Ação */}
                        <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-semibold flex items-center gap-1">
                            {anim.price === 0 ? (
                              <span className="text-emerald-400 font-bold">Padrão Grátis</span>
                            ) : isQuantumCurrency ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                                <span className="text-cyan-300 font-bold">{anim.price} Fragmentos</span>
                              </>
                            ) : isDuelCurrency ? (
                              <>
                                <Swords className="w-3.5 h-3.5 text-rose-400" />
                                <span className="text-rose-300 font-bold">{anim.price} Moedas</span>
                              </>
                            ) : (
                              <>
                                <Coins className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-amber-300 font-bold">{anim.price} Tokens</span>
                              </>
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleUnlockOrEquipAnimation(anim.id, anim.price, anim.currency)}
                            disabled={isEquipped || (!isUnlocked && !canAfford)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed ${
                              isEquipped
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 opacity-90'
                                : isUnlocked
                                ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600'
                                : canAfford
                                ? isQuantumCurrency
                                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                                  : isDuelCurrency
                                  ? 'bg-rose-600 hover:bg-rose-500 text-white font-black shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                                : 'bg-zinc-900 text-zinc-500 border border-zinc-800 opacity-60'
                            }`}
                          >
                            {isEquipped ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-purple-400" />
                                <span>Equipado</span>
                              </>
                            ) : isUnlocked ? (
                              <span>Equipar</span>
                            ) : canAfford ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5 fill-current" />
                                <span>
                                  {isAdmin
                                    ? 'Desbloquear (ADM)'
                                    : `Desbloquear (${anim.price} ${
                                        isQuantumCurrency ? 'Fragmentos' : isDuelCurrency ? 'Moedas' : 'Tks'
                                      })`}
                                </span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3 text-zinc-500" />
                                <span>
                                  {isQuantumCurrency
                                    ? 'Faltam Fragmentos'
                                    : isDuelCurrency
                                    ? 'Faltam Moedas'
                                    : 'Faltam Tokens'}
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Footer do Modal */}
          <div className="flex-shrink-0 px-4 sm:px-6 py-3 border-t border-[#232838] bg-[#141822] flex items-center justify-between gap-3 text-xs text-zinc-400">
            <span className="font-mono text-[11px]">
              Tokens acumulados: <strong className="text-amber-300">{currentTokens}</strong>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition cursor-pointer"
            >
              Concluir & Fechar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
