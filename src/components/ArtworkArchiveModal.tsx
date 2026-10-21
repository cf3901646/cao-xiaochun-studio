import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import { ARTWORKS, ArtworkItem, STUDIO_INFO } from '../data/artworks';

interface ArtworkArchiveModalProps {
  artwork: ArtworkItem | null;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  copiedWechat: boolean;
  onCopyWechat: () => void;
}

const ZOOM_FACTOR = 2.5;

export const ArtworkArchiveModal: React.FC<ArtworkArchiveModalProps> = ({
  artwork,
  onClose,
  onNavigate,
  copiedWechat,
  onCopyWechat
}) => {
  const [macroEnabled, setMacroEnabled] = useState<boolean>(true);
  const [cursorRel, setCursorRel] = useState<{ x: number; y: number }>({
    x: 0.38,
    y: 0.64
  });
  const [imgSize, setImgSize] = useState<{ width: number; height: number }>({
    width: 340,
    height: 450
  });

  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const measureImage = () => {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setImgSize({ width: rect.width, height: rect.height });
      }
    }
  };

  useEffect(() => {
    if (artwork) {
      if (artwork.macroSpots.length > 0) {
        setCursorRel({
          x: artwork.macroSpots[0].xPercent / 100,
          y: artwork.macroSpots[0].yPercent / 100
        });
      } else {
        setCursorRel({ x: 0.5, y: 0.5 });
      }
      setMacroEnabled(true);
      window.setTimeout(measureImage, 50);
    }
  }, [artwork]);

  useEffect(() => {
    if (!artwork) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', measureImage);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', measureImage);
    };
  }, [artwork, onClose, onNavigate]);

  if (!artwork) return null;

  const updatePointerPosition = (clientX: number, clientY: number) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    setImgSize({ width: rect.width, height: rect.height });
    const relX = (clientX - rect.left) / rect.width;
    const relY = (clientY - rect.top) / rect.height;
    setCursorRel({
      x: Math.max(0.05, Math.min(0.95, relX)),
      y: Math.max(0.05, Math.min(0.95, relY))
    });
  };

  return (
    <div
      data-testid="artwork-archive-modal"
      className="fixed inset-0 z-50 flex flex-col bg-[#F3EFE6]/97 backdrop-blur-xl text-[#1C1A17] overflow-y-auto"
    >
      {/* Dynamic Ambient Pigment Glow inside Modal (Smooth CSS backgroundColor interpolation) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-[10%] left-[8%] w-[65vw] h-[65vw] rounded-full opacity-[0.20] blur-[120px] animate-aura-primary"
          style={{
            backgroundColor: artwork.ambientColor.hex,
            transition: 'background-color 2000ms cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        />
      </div>

      {/* Refined Warm Linen Modal Header */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 h-14 bg-[#F3EFE6]/88 backdrop-blur-md border-b border-[#1A1917]/10 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: artwork.ambientColor.hex }}
          />
          <span className="font-editorial text-xs tracking-[0.2em] text-[#8B3A2B] shrink-0">
            PLATE {artwork.indexNumber} / {String(ARTWORKS.length).padStart(2, '0')}
          </span>
          <span className="text-sm sm:text-base font-medium tracking-wide truncate text-[#1A1917]">
            {artwork.title}
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            data-testid="toggle-macro-zoom"
            onClick={() => setMacroEnabled((prev) => !prev)}
            className={`px-3 py-1.5 text-xs flex items-center gap-1.5 border transition-colors cursor-pointer ${
              macroEnabled
                ? 'bg-[#1C1A17] border-[#1C1A17] text-[#F7F4EE]'
                : 'border-[#1A1917]/20 text-[#1A1917]/75 hover:bg-[#1A1917]/5'
            }`}
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>{macroEnabled ? '2.5× 微距已开启' : '开启 2.5× 微距'}</span>
          </button>

          <button
            type="button"
            data-testid="close-modal-btn"
            onClick={onClose}
            aria-label="关闭详情"
            className="p-2 border border-[#1A1917]/15 text-[#1A1917]/70 hover:text-[#1A1917] hover:bg-[#1A1917]/5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area: Zero Black Bars, Intrinsic Canvas Fit */}
      <div className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-10 items-start">
        {/* Left: Interactive Painting Mounted on Warm Cotton Mat (Zero Black Bars) */}
        <div className="lg:col-span-7 flex flex-col items-center w-full">
          <div className="p-2.5 sm:p-4 bg-[#FAF7F0] border border-[#1A1917]/12 shadow-[0_24px_60px_rgba(26,25,23,0.12)] max-w-full">
            <div
              ref={imageContainerRef}
              data-testid="macro-image-stage"
              onMouseMove={(e) => updatePointerPosition(e.clientX, e.clientY)}
              onTouchMove={(e) => {
                if (e.touches[0]) {
                  updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              onClick={(e) => updatePointerPosition(e.clientX, e.clientY)}
              className={`relative block w-full overflow-hidden select-none ${
                macroEnabled ? 'cursor-crosshair touch-none' : 'cursor-zoom-in'
              }`}
            >
              <img
                ref={imgRef}
                src={artwork.imageUrl}
                alt={artwork.title}
                onLoad={measureImage}
                className="block w-full h-auto"
                draggable={false}
              />

              {/* True 2.5x Optical Magnifier Loupe */}
              {macroEnabled && (
                <div
                  data-testid="macro-loupe-lens"
                  style={{
                    left: `${cursorRel.x * 100}%`,
                    top: `${cursorRel.y * 100}%`
                  }}
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-[#FAF7F0] shadow-[0_18px_45px_rgba(26,25,23,0.45)] overflow-hidden bg-[#FAF7F0] z-20"
                >
                  <img
                    src={artwork.imageUrl}
                    alt=""
                    draggable={false}
                    style={{
                      position: 'absolute',
                      maxWidth: 'none',
                      width: `${imgSize.width * ZOOM_FACTOR}px`,
                      height: `${imgSize.height * ZOOM_FACTOR}px`,
                      left: `calc(50% - ${cursorRel.x * imgSize.width * ZOOM_FACTOR}px)`,
                      top: `calc(50% - ${cursorRel.y * imgSize.height * ZOOM_FACTOR}px)`
                    }}
                  />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#1C1A17]/80 backdrop-blur-xs text-[10px] font-editorial tracking-widest text-[#F7F4EE] whitespace-nowrap">
                    2.5× 刀笔微距
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Brushstroke Focal Spots */}
          {artwork.macroSpots.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] tracking-wider text-[#1A1917]/50 mr-1">
                刀笔看点：
              </span>
              {artwork.macroSpots.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => {
                    setMacroEnabled(true);
                    measureImage();
                    setCursorRel({
                      x: spot.xPercent / 100,
                      y: spot.yPercent / 100
                    });
                  }}
                  className="px-2.5 py-1 text-xs border border-[#1A1917]/15 bg-[#FAF7F0]/80 hover:border-[#8B3A2B] hover:text-[#8B3A2B] transition-colors cursor-pointer"
                >
                  {spot.label}
                </button>
              ))}
            </div>
          )}

          <p className="mt-2.5 text-xs text-[#1A1917]/55 text-center">
            {macroEnabled
              ? '手指在画布滑动或轻触上方「刀笔看点」，可 2.5 倍放大检视亚麻布纹与刮刀肌理'
              : '点击右上角「开启 2.5× 微距」可检视局部刀笔细节'}
          </p>
        </div>

        {/* Right: Curatorial Notes & Navigation */}
        <div className="lg:col-span-5 space-y-5 bg-[#FAF7F0]/90 p-6 sm:p-8 border border-[#1A1917]/10 shadow-[0_14px_36px_rgba(26,25,23,0.05)]">
          <div className="border-b border-[#1A1917]/10 pb-4">
            <p className="font-editorial text-xs tracking-[0.2em] text-[#8B3A2B] uppercase mb-1">
              {artwork.accessionCode} · {artwork.ambientColor.accentName}
            </p>
            <h2 className="text-xl sm:text-2xl font-medium tracking-wide text-[#1A1917] mb-1">
              {artwork.title}
            </h2>
            <p className="font-editorial italic text-xs text-[#1A1917]/55 mb-1.5">
              {artwork.enTitle}
            </p>
            <p className="text-xs text-[#1A1917]/65">
              {artwork.mediumAndAttributes} · {artwork.dimensionsEstimate}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-medium tracking-[0.18em] text-[#8B3A2B] uppercase">
              01 / 创作缘起 · Conception
            </h3>
            <p className="text-sm leading-[1.9] text-[#2C2A27]">
              {artwork.originStory}
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#1A1917]/10">
            <h3 className="text-xs font-medium tracking-[0.18em] text-[#8B3A2B] uppercase">
              02 / 刀笔手记 · Technique
            </h3>
            <p className="text-sm leading-[1.9] text-[#2C2A27]">
              {artwork.techniqueNotes}
            </p>
          </div>

          {/* Subtle Inquiry Link + Prev/Next */}
          <div className="pt-4 border-t border-[#1A1917]/10 space-y-3">
            <button
              type="button"
              onClick={onCopyWechat}
              className="w-full py-2.5 px-4 border border-[#8B3A2B]/35 bg-[#8B3A2B]/6 hover:bg-[#8B3A2B] hover:text-[#FAF7F0] text-[#8B3A2B] text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copiedWechat ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>已复制画室微信：{STUDIO_INFO.wechatId}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>询问此作典藏 · 复制画室微信</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('prev')}
                className="flex-1 py-2 border border-[#1A1917]/15 hover:bg-[#1A1917]/5 text-xs tracking-wider flex items-center justify-center gap-1 cursor-pointer text-[#1A1917]/80"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>上一幅</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('next')}
                className="flex-1 py-2 border border-[#1A1917]/15 hover:bg-[#1A1917]/5 text-xs tracking-wider flex items-center justify-center gap-1 cursor-pointer text-[#1A1917]/80"
              >
                <span>下一幅</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
