import React from 'react';
import { BaseLayoutProps } from './TerminalLayout';
import { LayoutSkinId } from '../../types/cosmetics';
import {
  MessageSquare,
  Lock,
  Phone,
  Video,
  Search,
  CheckCheck,
  Instagram,
  Heart,
  Send,
  Bookmark,
  Share2,
  Play,
  Bell,
  ThumbsUp,
  Volume2,
  Music,
  Disc,
  Boxes,
  Sliders,
  Sparkles
} from 'lucide-react';

export interface SocialAppLayoutProps extends BaseLayoutProps {
  layoutId: LayoutSkinId;
}

export const SocialAppLayout: React.FC<SocialAppLayoutProps> = ({
  layoutId,
  header,
  sidebar,
  arena,
  shop,
  footer,
  overlays,
  appBgClass = 'bg-[#0a0d0a]',
}) => {
  // 1. WhatsApp Web Chat Layout
  if (layoutId === 'whatsapp_chat_layout') {
    return (
      <div className={`min-h-screen bg-[#0b141a] text-[#e9edef] flex flex-col font-sans select-none overflow-x-hidden p-1 sm:p-2 md:p-3`}>
        {overlays}

        {/* WhatsApp App Container */}
        <div className="w-full max-w-[1520px] mx-auto flex-1 min-h-0 flex flex-col rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.85)] border border-[#202c33] overflow-hidden bg-[#111b21]">
          {/* Header da Barra de Ferramentas WhatsApp */}
          <div className="bg-[#202c33] px-3 sm:px-5 py-2.5 flex items-center justify-between border-b border-[#2a3942] flex-shrink-0 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white text-lg font-bold shadow">
                  💬
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25d366] border-2 border-[#202c33] rounded-full" />
              </div>

              <div className="min-w-0 truncate">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white truncate">Leopoldina Dev Chat // Turma Online</h3>
                  <span className="bg-[#005c4b]/60 text-[#25d366] text-[10px] px-2 py-0.5 rounded-full font-mono border border-[#25d366]/40 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Seguro
                  </span>
                </div>
                <p className="text-[11px] text-[#8696a0] truncate">
                  online • visto por último hoje às 14:30
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-[#aebac1]">
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-[#25d366] font-mono bg-[#111b21] px-2.5 py-1 rounded-lg border border-[#202c33]">
                <CheckCheck className="w-4 h-4 text-[#53bdeb]" /> Entregue
              </span>
              <button type="button" className="p-1.5 hover:bg-[#374248] rounded-full transition" title="Pesquisar">
                <Search className="w-4 h-4" />
              </button>
              <button type="button" className="p-1.5 hover:bg-[#374248] rounded-full transition" title="Chamada">
                <Phone className="w-4 h-4" />
              </button>
              <button type="button" className="p-1.5 hover:bg-[#374248] rounded-full transition" title="Vídeo">
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Jogo Header */}
          <div className="flex-shrink-0 bg-[#111b21]/90">
            {header}
          </div>

          {/* 3 Colunas WhatsApp */}
          <main className="flex-1 min-h-0 flex flex-col lg:flex-row w-full items-stretch divide-y lg:divide-y-0 lg:divide-x divide-[#202c33] bg-[#0b141a]">
            {/* Sidebar: Lista de Conversas / Stats */}
            <div className="w-full lg:w-68 xl:w-76 flex-shrink-0 flex flex-col min-w-0 bg-[#111b21]">
              <div className="bg-[#202c33]/70 px-3.5 py-2 border-b border-[#2a3942] text-[11px] font-bold text-[#00a884] uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Conversas & Turma
                </span>
                <span className="text-[10px] bg-[#25d366] text-black font-black px-1.5 py-0.2 rounded-full">NOVO</span>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">{sidebar}</div>
            </div>

            {/* Arena Central: Balão de Chat */}
            <div className="flex-1 min-w-0 flex flex-col bg-[#0b141a] relative overflow-hidden">
              <div className="bg-[#111b21]/80 px-4 py-1.5 border-b border-[#202c33] text-[11px] text-[#8696a0] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#25d366]" /> Mensagens criptografadas de ponta a ponta
                </span>
                <span className="font-mono text-[10px] text-[#25d366]">Status: Ativo</span>
              </div>
              <div className="flex-1 min-h-0 flex flex-col justify-center overflow-y-auto">{arena}</div>
              <div className="bg-[#202c33] px-4 py-2 border-t border-[#2a3942] flex items-center justify-between text-xs text-[#8696a0]">
                <span>💬 Digite a palavra acima para enviar...</span>
                <span className="text-[#25d366] font-mono text-[10px]">Pressione ENTER</span>
              </div>
            </div>

            {/* Loja: Anexos e Upgrades */}
            <div className="w-full lg:w-76 xl:w-84 flex-shrink-0 flex flex-col min-w-0 bg-[#111b21]">
              <div className="bg-[#202c33]/70 px-3.5 py-2 border-b border-[#2a3942] text-[11px] font-bold text-[#53bdeb] uppercase tracking-wider flex items-center justify-between">
                <span>📎 Anexos & Upgrades</span>
                <span className="text-zinc-400 text-[10px]">Loja Zap</span>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">{shop}</div>
            </div>
          </main>

          {footer}
        </div>
      </div>
    );
  }

  // 2. Instagram Feed / Stories Layout
  if (layoutId === 'instagram_feed_layout') {
    return (
      <div className={`min-h-screen bg-[#0c0614] text-zinc-100 flex flex-col font-sans select-none overflow-x-hidden p-1 sm:p-2 md:p-3`}>
        {overlays}

        <div className="w-full max-w-[1520px] mx-auto flex-1 min-h-0 flex flex-col rounded-2xl shadow-[0_12px_45px_rgba(225,48,108,0.25)] border border-[#301646] overflow-hidden bg-[#170d24]">
          {/* Top Bar Instagram */}
          <div className="bg-[#170d24] px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-[#301646] flex-shrink-0 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] via-[#d62976] to-[#962fbf] p-0.5 shadow-md flex items-center justify-center">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-[#f77737] via-[#e1306c] to-[#c13584] bg-clip-text text-transparent font-serif italic">
                InstaType
              </span>
            </div>

            {/* Stories Avatares no Topo */}
            <div className="hidden md:flex items-center gap-3 overflow-x-auto py-0.5 px-2">
              {['🔥 Alta', '⚡ Turbo', '🏆 Ranking', '💎 Upgrades', '👑 MVP'].map((label, i) => (
                <div key={label} className="flex items-center gap-1.5 bg-[#25123d] px-2.5 py-1 rounded-full border border-pink-500/30 text-[11px] text-pink-200">
                  <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#feda75] to-[#d62976] animate-spin" style={{ animationDuration: `${4 + i}s` }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 text-pink-200">
              <Heart className="w-4 sm:w-5 h-4 sm:h-5 hover:text-[#e1306c] cursor-pointer transition" />
              <Send className="w-4 sm:w-5 h-4 sm:h-5 hover:text-[#f77737] cursor-pointer transition" />
              <Bookmark className="w-4 sm:w-5 h-4 sm:h-5 hover:text-amber-400 cursor-pointer transition" />
            </div>
          </div>

          {header}

          <main className="flex-1 min-h-0 flex flex-col lg:flex-row w-full items-stretch divide-y lg:divide-y-0 lg:divide-x divide-[#301646] bg-[#0f0718]">
            <div className="w-full lg:w-68 xl:w-76 flex-shrink-0 flex flex-col min-w-0 bg-[#170d24]/90">
              <div className="bg-[#24123a] px-3.5 py-2 border-b border-[#301646] text-[11px] font-bold text-pink-300 uppercase tracking-wider flex items-center justify-between">
                <span>✦ Perfil & Seguidos</span>
                <span className="text-[10px] text-pink-400 font-mono">Stories Ativos</span>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">{sidebar}</div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col bg-[#0c0614] overflow-hidden">
              <div className="bg-[#170d24]/80 px-4 py-1.5 border-b border-[#301646] text-[11px] text-pink-300/80 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#e1306c]" /> Publicação Principal do Feed
                </span>
                <span className="text-[10px] text-[#f77737] font-bold">❤️ 2.4k Curtidas</span>
              </div>
              <div className="flex-1 min-h-0 flex flex-col justify-center overflow-y-auto">{arena}</div>
              <div className="bg-[#170d24] px-4 py-2 border-t border-[#301646] flex items-center justify-between text-xs text-pink-200/70">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 hover:text-[#e1306c] cursor-pointer"><Heart className="w-3.5 h-3.5" /> Curtir</span>
                  <span className="flex items-center gap-1 hover:text-sky-400 cursor-pointer"><MessageSquare className="w-3.5 h-3.5" /> Comentar</span>
                  <span className="flex items-center gap-1 hover:text-[#f77737] cursor-pointer"><Share2 className="w-3.5 h-3.5" /> Compartilhar</span>
                </div>
                <span className="text-[10px] font-mono text-pink-400">#TypeClicker #Leopoldina</span>
              </div>
            </div>

            <div className="w-full lg:w-76 xl:w-84 flex-shrink-0 flex flex-col min-w-0 bg-[#170d24]/90">
              <div className="bg-[#24123a] px-3.5 py-2 border-b border-[#301646] text-[11px] font-bold text-orange-300 uppercase tracking-wider flex items-center justify-between">
                <span>🛍️ Loja de Cosméticos</span>
                <span className="text-[10px] text-pink-400">Destaques</span>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">{shop}</div>
            </div>
          </main>

          {footer}
        </div>
      </div>
    );
  }

  // 3. YouTube Theater Layout
  if (layoutId === 'youtube_theater_layout') {
    return (
      <div className={`min-h-screen bg-[#0f0f0f] text-zinc-100 flex flex-col font-sans select-none overflow-x-hidden p-1 sm:p-2 md:p-3`}>
        {overlays}

        <div className="w-full max-w-[1520px] mx-auto flex-1 min-h-0 flex flex-col rounded-2xl shadow-[0_12px_45px_rgba(255,0,0,0.2)] border border-[#2b2b2b] overflow-hidden bg-[#181818]">
          {/* Top Bar YouTube */}
          <div className="bg-[#0f0f0f] px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-[#2b2b2b] flex-shrink-0 min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-5 rounded-md bg-[#ff0000] flex items-center justify-center text-white shadow">
                  <Play className="w-3 h-3 fill-white" />
                </div>
                <span className="text-base font-black tracking-tighter text-white">
                  You<span className="bg-[#ff0000] px-1 py-0.2 rounded text-white text-xs ml-0.5">TYPE</span>
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">BR // Criador</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="bg-[#ff0000] hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow transition"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>INSCREVER-SE</span>
              </button>
              <div className="hidden sm:flex items-center gap-1 bg-[#272727] px-2.5 py-1 rounded-full text-xs text-zinc-300">
                <ThumbsUp className="w-3 h-3 text-[#ff0000]" />
                <span className="font-bold">128K</span>
              </div>
            </div>
          </div>

          {header}

          <main className="flex-1 min-h-0 flex flex-col lg:flex-row w-full items-stretch divide-y lg:divide-y-0 lg:divide-x divide-[#2b2b2b] bg-[#0f0f0f]">
            <div className="w-full lg:w-68 xl:w-76 flex-shrink-0 flex flex-col min-w-0 bg-[#181818]">
              <div className="bg-[#212121] px-3.5 py-2 border-b border-[#2b2b2b] text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                <span>▶ Painel do Canal</span>
                <span className="text-[10px] text-red-400 font-mono">AO VIVO</span>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">{sidebar}</div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col bg-[#050505] overflow-hidden relative">
              {/* Moldura de Vídeo */}
              <div className="bg-[#181818] px-4 py-1.5 border-b border-[#2b2b2b] text-[11px] text-zinc-400 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <strong className="text-zinc-200">Digitação ao Vivo: Sala 104</strong>
                </span>
                <span className="font-mono text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">1080p60 HD</span>
              </div>
              <div className="flex-1 min-h-0 flex flex-col justify-center overflow-y-auto">{arena}</div>
              
              {/* Scrubber de Vídeo do YouTube */}
              <div className="bg-[#121212] px-4 py-2 border-t border-[#2b2b2b] flex flex-col gap-1.5">
                <div className="w-full bg-zinc-800 h-1 rounded-full relative overflow-hidden group cursor-pointer">
                  <div className="bg-[#ff0000] h-full w-2/3 shadow-[0_0_8px_#ff0000]" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-mono">🔴 AO VIVO // 24:15</span>
                  <div className="flex items-center gap-3">
                    <span className="hover:text-white cursor-pointer"><Volume2 className="w-3.5 h-3.5" /></span>
                    <span className="hover:text-white cursor-pointer text-[10px] font-bold">TEATRO</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-76 xl:w-84 flex-shrink-0 flex flex-col min-w-0 bg-[#181818]">
              <div className="bg-[#212121] px-3.5 py-2 border-b border-[#2b2b2b] text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center justify-between">
                <span>🛒 Upgrades & Patrocínios</span>
                <span className="text-[10px] text-zinc-400">Loja Tube</span>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">{shop}</div>
            </div>
          </main>

          {footer}
        </div>
      </div>
    );
  }

  // 4. TikTok Stream Layout
  if (layoutId === 'tiktok_stream_layout') {
    return (
      <div className={`min-h-screen bg-[#010101] text-white flex flex-col font-sans select-none overflow-x-hidden p-1 sm:p-2 md:p-3`}>
        {overlays}

        <div className="w-full max-w-[1520px] mx-auto flex-1 min-h-0 flex flex-col rounded-2xl shadow-[0_0_40px_rgba(0,242,254,0.25)] border-2 border-[#1a1a1a] overflow-hidden bg-[#0d0d0d]">
          {/* Top Bar TikTok */}
          <div className="bg-[#080808] px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-[#222222] flex-shrink-0 min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-black tracking-wider text-white flex items-center gap-1">
                <span className="text-[#fe2c55]">Tok</span>
                <span className="text-[#00f2fe]">Type</span>
              </span>
              <span className="text-[10px] font-mono text-[#00f2fe] bg-[#00f2fe]/10 px-2 py-0.5 rounded-full border border-[#00f2fe]/30">
                LIVE
              </span>
            </div>

            {/* Abas Centrais: Seguindo / Para Você */}
            <div className="flex items-center gap-6 text-sm font-bold">
              <span className="text-zinc-400 hover:text-white cursor-pointer transition">Seguindo</span>
              <span className="text-white relative cursor-pointer font-black border-b-2 border-[#fe2c55] pb-0.5 shadow-[0_2px_10px_#fe2c55]">
                Para Você
              </span>
            </div>

            {/* Disco de Música Giratório */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-[#00f2fe] font-mono hidden sm:flex">
                <Music className="w-3.5 h-3.5 animate-bounce" />
                <span>som original - Leopoldina</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-zinc-900 border-2 border-zinc-700 p-1 flex items-center justify-center animate-spin" style={{ animationDuration: '3s' }}>
                <Disc className="w-4 h-4 text-[#fe2c55]" />
              </div>
            </div>
          </div>

          {header}

          <main className="flex-1 min-h-0 flex flex-col lg:flex-row w-full items-stretch divide-y lg:divide-y-0 lg:divide-x divide-[#222222] bg-[#050505]">
            <div className="w-full lg:w-68 xl:w-76 flex-shrink-0 flex flex-col min-w-0 bg-[#0d0d0d]">
              <div className="bg-[#141414] px-3.5 py-2 border-b border-[#222222] text-[11px] font-bold text-[#00f2fe] uppercase tracking-wider flex items-center justify-between">
                <span>🔥 Criadores & Ranking</span>
                <span className="text-[10px] text-[#fe2c55] font-mono">Trending</span>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">{sidebar}</div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col bg-black overflow-hidden relative border-x border-[#fe2c55]/20">
              <div className="bg-[#0f0f0f] px-4 py-1.5 border-b border-[#222222] text-[11px] text-zinc-300 flex items-center justify-between">
                <span className="text-[#00f2fe] font-mono text-[10px]">#teclado #gameplay #desafio</span>
                <span className="text-[#fe2c55] font-bold text-[10px]">❤️ 98.4K</span>
              </div>
              <div className="flex-1 min-h-0 flex flex-col justify-center overflow-y-auto">{arena}</div>
              <div className="bg-[#0a0a0a] px-4 py-2 border-t border-[#222222] flex items-center justify-between text-xs">
                <span className="text-zinc-400 text-[11px]">🎵 Digite em ritmo para manter o combo</span>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#00f2fe]">
                  <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-ping" />
                  <span>BEAT SYNCHRONIZED</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-76 xl:w-84 flex-shrink-0 flex flex-col min-w-0 bg-[#0d0d0d]">
              <div className="bg-[#141414] px-3.5 py-2 border-b border-[#222222] text-[11px] font-bold text-[#fe2c55] uppercase tracking-wider flex items-center justify-between">
                <span>💎 Live Shop & Upgrades</span>
                <span className="text-[10px] text-[#00f2fe]">Tok Store</span>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">{shop}</div>
            </div>
          </main>

          {footer}
        </div>
      </div>
    );
  }

  // 5. Roblox Studio 3D Blocks Layout
  if (layoutId === 'roblox_studio_layout') {
    return (
      <div className={`min-h-screen bg-[#111216] text-zinc-100 flex flex-col font-sans select-none overflow-x-hidden p-1 sm:p-2 md:p-3`}>
        {overlays}

        <div className="w-full max-w-[1520px] mx-auto flex-1 min-h-0 flex flex-col rounded-xl shadow-[0_12px_45px_rgba(0,0,0,0.9)] border-4 border-[#292c37] overflow-hidden bg-[#1b1d24]">
          {/* Top Bar Roblox Studio */}
          <div className="bg-[#171920] px-4 sm:px-6 py-2.5 flex items-center justify-between border-b-2 border-[#292c37] flex-shrink-0 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#e2231a] rounded-sm flex items-center justify-center text-white font-black text-sm rotate-6 shadow-md border border-white/20">
                ⛶
              </div>
              <div className="min-w-0">
                <span className="text-sm font-black tracking-wide text-white uppercase">
                  ROBLOX STUDIO // TYPEPLACE
                </span>
                <p className="text-[10px] text-[#00a2ff] font-mono">Workspace • 60 FPS • Physics Engine</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-[#111216] px-3 py-1 rounded-md border border-[#2e323f] text-xs font-mono">
                <span className="text-amber-400 font-bold">🪙 R$</span>
                <span className="text-white font-black">999.999</span>
              </div>
              <button
                type="button"
                className="bg-[#00a2ff] hover:bg-sky-600 text-white font-black text-xs px-3 py-1 rounded shadow transition flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>PLAY TEST</span>
              </button>
            </div>
          </div>

          {header}

          <main className="flex-1 min-h-0 flex flex-col lg:flex-row w-full items-stretch divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-[#292c37] bg-[#111216]">
            {/* Explorer / Hierarchy */}
            <div className="w-full lg:w-68 xl:w-76 flex-shrink-0 flex flex-col min-w-0 bg-[#171920]">
              <div className="bg-[#1e2029] px-3.5 py-1.5 border-b border-[#292c37] text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Boxes className="w-3.5 h-3.5 text-[#00a2ff]" /> Explorer // Aluno</span>
                <span className="text-[10px] text-zinc-500">v2.4</span>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">{sidebar}</div>
            </div>

            {/* Viewport 3D da Arena */}
            <div className="flex-1 min-w-0 flex flex-col bg-[#111216] overflow-hidden relative">
              <div className="bg-[#171920] px-4 py-1.5 border-b border-[#292c37] text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                <span>VIEWPORT 3D [X: 120, Y: 45, Z: 890]</span>
                <span className="text-[#00a2ff] font-bold">GRID SNAP: 1 STUD</span>
              </div>
              <div className="flex-1 min-h-0 flex flex-col justify-center overflow-y-auto">{arena}</div>
              <div className="bg-[#171920] px-4 py-1.5 border-t border-[#292c37] flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>[ 🧱 MODEL // TYPE_CORE ]</span>
                <span className="text-emerald-400">READY TO BUILD</span>
              </div>
            </div>

            {/* Toolbox & Loja */}
            <div className="w-full lg:w-76 xl:w-84 flex-shrink-0 flex flex-col min-w-0 bg-[#171920]">
              <div className="bg-[#1e2029] px-3.5 py-1.5 border-b border-[#292c37] text-[11px] font-mono font-bold text-[#e2231a] uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5" /> Toolbox & Upgrades</span>
                <span className="text-[10px] text-zinc-400">Loja</span>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">{shop}</div>
            </div>
          </main>

          {footer}
        </div>
      </div>
    );
  }

  // Fallback para qualquer outro caso
  return (
    <div className={`min-h-screen ${appBgClass} text-zinc-100 flex flex-col font-sans select-none overflow-x-hidden`}>
      {overlays}
      {header}
      <main className="flex-1 min-h-0 flex flex-col lg:flex-row w-full max-w-7xl mx-auto items-stretch min-w-0">
        <div className="w-full lg:w-64 xl:w-72 flex-shrink-0 flex flex-col min-w-0 border-r border-zinc-800 bg-zinc-900/90">
          {sidebar}
        </div>
        <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
          {arena}
        </div>
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col min-w-0 border-l border-zinc-800 bg-zinc-900/95">
          {shop}
        </div>
      </main>
      {footer}
    </div>
  );
};
