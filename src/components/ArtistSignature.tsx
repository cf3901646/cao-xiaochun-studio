import React from 'react';

interface ArtistSignatureProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSeal?: boolean;
}

/**
 * Authentic bespoke handwritten signature for 曹晓春 (Cao Xiaochun),
 * cut out from the artist's original calligraphy design with full alpha transparency,
 * paired with a traditional carved vermilion seal (晓春画印) and italic Roman script.
 */
export const ArtistSignature: React.FC<ArtistSignatureProps> = ({
  className = '',
  size = 'md',
  showSeal = true
}) => {
  const sizeConfig = {
    sm: {
      imgHeight: 'h-14',
      sealSize: 'w-7 h-7 text-[8px]',
      subText: 'text-[11.5px]'
    },
    md: {
      imgHeight: 'h-20 sm:h-24',
      sealSize: 'w-9 h-9 text-[10px]',
      subText: 'text-[13px] sm:text-[14px]'
    },
    lg: {
      imgHeight: 'h-28 sm:h-32',
      sealSize: 'w-11 h-11 text-xs',
      subText: 'text-sm'
    }
  }[size];

  return (
    <div
      className={`inline-flex items-center gap-3 sm:gap-4 select-none ${className}`}
      aria-label="曹晓春 艺术签名 (Cao Xiaochun Authentic Signature)"
    >
      {/* Hand-Designed Transparent Signature Cutout */}
      <div className="relative shrink-0 flex items-center">
        <img
          src="/assets/cao_xiaochun_signature.png"
          alt="曹晓春 亲笔签名"
          className={`${sizeConfig.imgHeight} w-auto object-contain filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)]`}
          draggable={false}
        />
      </div>

      {/* Signature Lockup: Latin Script + Vermilion Seal */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="flex flex-col">
          <span
            className={`font-editorial italic font-medium tracking-[0.16em] text-[#3D3833] ${sizeConfig.subText}`}
          >
            Cao Xiaochun
          </span>
          <span className="text-[9.5px] font-editorial tracking-[0.22em] uppercase text-[#736B63] opacity-75">
            Studio Autograph
          </span>
        </div>

        {/* Traditional Weathered Vermilion Stone Seal (朱文篆刻闲章: 晓春画印) */}
        {showSeal && (
          <div
            className={`relative shrink-0 ${sizeConfig.sealSize} bg-[#9E2A22] rounded-[1.5px] p-[1.5px] shadow-[0_2px_6px_rgba(158,42,34,0.22)] rotate-1`}
            title="曹晓春 · 晓春画印"
          >
            <div className="w-full h-full border border-[#F5F0E6]/85 border-dashed rounded-[0.8px] flex flex-col justify-between p-[1px]">
              <div className="flex justify-between items-center text-[#F5F0E6] font-serif-cn font-medium leading-none px-[1.5px]">
                <span>画</span>
                <span>晓</span>
              </div>
              <div className="flex justify-between items-center text-[#F5F0E6] font-serif-cn font-medium leading-none px-[1.5px]">
                <span>印</span>
                <span>春</span>
              </div>
            </div>
            {/* Organic seal stone specks */}
            <div className="absolute top-0.5 left-0.5 w-[2px] h-[2px] bg-[#EAE6DF] rounded-full opacity-60" />
            <div className="absolute bottom-0.5 right-0.5 w-[2px] h-[2px] bg-[#EAE6DF] rounded-full opacity-60" />
          </div>
        )}
      </div>
    </div>
  );
};
