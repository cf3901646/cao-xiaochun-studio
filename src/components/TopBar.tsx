import React from 'react';
import { STUDIO_INFO } from '../data/artworks';

interface TopBarProps {
  activeAccentHex?: string;
  activeAccentName?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeAccentHex = '#8B3A2B',
  activeAccentName = '星夜钴蓝 · 晨曦暖金'
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-14 px-4 sm:px-8 flex items-center justify-between bg-[#FAF7F0] border-b border-[#1A1917]/8 transition-colors duration-500">
      {/* Left: Artist Portrait Miniature & Name */}
      <a
        href="#cover-section"
        className="flex items-center gap-2.5 group focus:outline-none"
      >
        <span className="relative w-7 h-7 rounded-full overflow-hidden border border-[#1A1917]/20 shadow-xs shrink-0">
          <img
            src={STUDIO_INFO.avatarUrl}
            alt={STUDIO_INFO.artistNameCn}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
          />
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-sm sm:text-[15px] font-medium tracking-[0.18em] text-[#1A1917]">
            {STUDIO_INFO.artistNameCn}
          </span>
          <span className="font-editorial text-[10px] sm:text-[11px] tracking-[0.22em] text-[#1A1917]/50 uppercase">
            Cao Xiaochun
          </span>
        </div>
      </a>

      {/* Right: Quiet Monograph Chapter Navigation + Living Pigment Indicator */}
      <nav aria-label="画册章节导航" className="flex items-center gap-4 sm:gap-6">
        <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-[#1A1917]/10">
          <span
            className="w-2 h-2 rounded-full transition-colors duration-700"
            style={{ backgroundColor: activeAccentHex }}
          />
          <span className="text-[11px] tracking-[0.14em] text-[#1A1917]/55 transition-opacity duration-500">
            {activeAccentName}
          </span>
        </div>

        <div className="flex items-center gap-3.5 sm:gap-5 text-xs tracking-[0.16em] text-[#1A1917]/70">
          <a
            href="#statement-section"
            className="hover:text-[#1A1917] transition-colors py-1"
          >
            自述
          </a>
          <a
            href="#works-section"
            className="hover:text-[#1A1917] transition-colors py-1"
          >
            画作
          </a>
          <a
            href="#commission-section"
            className="hover:text-[#1A1917] transition-colors py-1"
          >
            尺素
          </a>
        </div>
      </nav>
    </header>
  );
};
