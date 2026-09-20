import React from 'react';

export interface BaseLayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  arena: React.ReactNode;
  shop: React.ReactNode;
  footer?: React.ReactNode;
  overlays?: React.ReactNode;
  appBgClass?: string;
}

export const TerminalLayout: React.FC<BaseLayoutProps> = ({
  header,
  sidebar,
  arena,
  shop,
  footer,
  overlays,
  appBgClass = 'bg-[#0a0d0a]'
}) => {
  return (
    <div className={`min-h-screen ${appBgClass} text-zinc-100 flex flex-col font-sans select-none overflow-x-hidden transition-colors duration-300`}>
      {overlays}
      {header}

      {/* Grid Clássico de 3 Colunas: Sidebar + Arena Central + Loja */}
      <main className="flex-1 min-h-0 flex flex-col lg:flex-row w-full max-w-7xl mx-auto items-stretch min-w-0">
        <div className="w-full lg:w-64 xl:w-72 flex-shrink-0 flex flex-col min-w-0 border-b lg:border-b-0 lg:border-r border-[#232833] bg-[#12151c]/90">
          {sidebar}
        </div>
        <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
          {arena}
        </div>
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col min-w-0 border-t lg:border-t-0 lg:border-l border-[#232833] bg-[#11141a]/95">
          {shop}
        </div>
      </main>

      {footer}
    </div>
  );
};
