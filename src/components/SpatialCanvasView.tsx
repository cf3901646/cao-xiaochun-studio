import React, { useState, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Sun,
  Moon,
  BookOpen,
  Copy,
  Check,
  Maximize2,
  Move
} from 'lucide-react';
import { ArtworkItem, STUDIO_INFO } from '../data/artworks';
import {
  CanvasTransform,
  clampCanvasTransform,
  computeFocusTransformForArtwork,
  computeParallaxOffset
} from '../utils/canvasMath';
import { ArtistSignature } from './ArtistSignature';
import { ActiveSection } from './TopBar';

interface SpatialCanvasViewProps {
  artworks: ArtworkItem[];
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  onOpenArtworkModal: (artwork: ArtworkItem) => void;
  onNavigateSection: (section: ActiveSection) => void;
  copiedWechat: boolean;
  onCopyWechat: () => void;
}

export const SpatialCanvasView: React.FC<SpatialCanvasViewProps> = ({
  artworks,
  isDarkTheme,
  onToggleTheme,
  onOpenArtworkModal,
  onNavigateSection,
  copiedWechat,
  onCopyWechat
}) => {
  // Default initial scale 0.78 on desktop so both the central hub and all 6 surrounding paintings are visible with generous whitespace
  const [transform, setTransform] = useState<CanvasTransform>({
    x: 0,
    y: -5,
    scale: 0.78
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hoveredArtworkId, setHoveredArtworkId] = useState<string | null>(null);
  const [focusedNodeId, setFocusedNodeId] = useState<string>('hub');

  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);

  const activeAmbientArtwork =
    artworks.find((a) => a.id === hoveredArtworkId) ||
    artworks.find((a) => a.id === focusedNodeId) ||
    null;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Do not start canvas drag if clicking a button or link
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;

    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: transform.x,
      startY: transform.y,
      moved: false
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.clientX;
    const dy = e.clientY - dragStartRef.current.clientY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragStartRef.current.moved = true;
    }
    setTransform((prev) =>
      clampCanvasTransform({
        x: dragStartRef.current!.startX + dx,
        y: dragStartRef.current!.startY + dy,
        scale: prev.scale
      })
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const zoomDelta = -e.deltaY * 0.0015;
      setTransform((prev) =>
        clampCanvasTransform({
          ...prev,
          scale: prev.scale + zoomDelta
        })
      );
    } else {
      setTransform((prev) =>
        clampCanvasTransform({
          ...prev,
          x: prev.x - e.deltaX * 0.85,
          y: prev.y - e.deltaY * 0.85
        })
      );
    }
  };

  const handleFocusHub = () => {
    setFocusedNodeId('hub');
    setTransform({ x: 0, y: -5, scale: 0.78 });
  };

  const handleFocusArtwork = (artwork: ArtworkItem) => {
    setFocusedNodeId(artwork.id);
    setTransform(computeFocusTransformForArtwork(artwork, 0.96));
  };

  const handleAdjustZoom = (delta: number) => {
    setTransform((prev) =>
      clampCanvasTransform({
        ...prev,
        scale: Math.round((prev.scale + delta) * 100) / 100
      })
    );
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* =====================================================================
          DESKTOP INFINITE SPATIAL CANVAS (md and up)
      ===================================================================== */}
      <div
        data-testid="spatial-canvas-viewport"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`hidden md:block relative w-screen h-screen overflow-hidden select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${isDarkTheme ? 'canvas-linen-dark text-[#EAE6DF]' : 'canvas-linen-light text-[#1C1A17]'}`}
      >
        {/* Ambient Aura Layer (环境氛围过渡) */}
        <div
          className="pointer-events-none fixed inset-0 transition-all duration-700"
          style={{
            background: activeAmbientArtwork
              ? `radial-gradient(circle at 50% 50%, ${
                  isDarkTheme
                    ? activeAmbientArtwork.ambientColor.darkAura
                    : activeAmbientArtwork.ambientColor.lightAura
                } 0%, transparent 68%)`
              : 'none'
          }}
        />

        {/* Subtle Studio Coordinate Crosshairs */}
        <div
          className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-20"
        >
          <div className="w-full h-[1px] bg-current/20" />
          <div className="h-full w-[1px] bg-current/20 absolute" />
        </div>

        {/* Transformed Spatial Plane */}
        <div
          data-testid="spatial-canvas-plane"
          style={{
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`
          }}
          className={`absolute left-1/2 top-1/2 w-0 h-0 ${
            isDragging ? '' : 'spatial-transition'
          }`}
        >
          {/* Decorative Studio Compass / Orbit Rings */}
          <div
            className={`pointer-events-none absolute -left-[460px] -top-[460px] w-[920px] h-[920px] rounded-full border border-dashed ${
              isDarkTheme ? 'border-[#EAE6DF]/10' : 'border-[#1C1A17]/10'
            }`}
          />
          <div
            className={`pointer-events-none absolute -left-[820px] -top-[820px] w-[1640px] h-[1640px] rounded-full border ${
              isDarkTheme ? 'border-[#EAE6DF]/6' : 'border-[#1C1A17]/6'
            }`}
          />

          {/* -----------------------------------------------------------------
              CENTRAL SPATIAL HUB (中心艺术家名片岛) at (0, 0)
          ----------------------------------------------------------------- */}
          <article
            data-testid="spatial-central-hub"
            style={{
              transform: 'translate3d(-50%, -50%, 0)'
            }}
            className={`absolute left-0 top-0 w-[460px] p-6 border shadow-2xl cursor-default ${
              isDarkTheme
                ? 'bg-[#1C1B19]/95 border-[#36332E] text-[#EAE6DF]'
                : 'bg-[#F7F4EE]/95 border-[#CFC8BC] text-[#1C1A17]'
            }`}
          >
            <div className="flex items-center justify-between border-b border-current/12 pb-2.5 mb-3.5 text-[11px] font-editorial tracking-[0.18em] uppercase opacity-70">
              <span>SPATIAL HUB · 00, 00</span>
              <span>CAO XIAOCHUN STUDIO</span>
            </div>

            <h1 className="text-xl lg:text-2xl font-song font-semibold leading-snug tracking-tight text-balance">
              {STUDIO_INFO.statement.headline}
            </h1>
            <p className="mt-1 text-xs font-editorial italic opacity-75">
              {STUDIO_INFO.statement.subheadlineEn}
            </p>

            <div className="mt-3.5 space-y-2 text-[12.5px] font-song leading-[1.72] opacity-90 text-justify">
              {STUDIO_INFO.statement.paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Artist Signature & Direct Controls */}
            <div className="mt-4 pt-3.5 border-t border-current/12 flex items-center justify-between gap-3">
              <ArtistSignature
                variant={isDarkTheme ? 'light' : 'default'}
                size="sm"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigateSection('archive')}
                  className={`px-3 py-1.5 text-xs font-song border cursor-pointer whitespace-nowrap shrink-0 ui-transition ${
                    isDarkTheme
                      ? 'border-[#4A463F] hover:bg-[#2A2825]'
                      : 'border-[#C5BEB2] hover:bg-[#EAE5DC]'
                  }`}
                >
                  画册手记全览
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateSection('commissions')}
                  className="px-3 py-1.5 text-xs font-song bg-[#8C3F2B] text-[#F7F4EE] border border-[#8C3F2B] hover:bg-[#733221] cursor-pointer whitespace-nowrap shrink-0 ui-transition"
                >
                  私人定制与约稿
                </button>
              </div>
            </div>
          </article>

          {/* -----------------------------------------------------------------
              6 SURROUNDING ARTWORK NODES WITH MULTI-RATE PARALLAX
          ----------------------------------------------------------------- */}
          {artworks.map((artwork) => {
            const parallax = computeParallaxOffset(
              { x: transform.x, y: transform.y },
              artwork.spatialPos.parallaxDepth
            );
            const isFocused = focusedNodeId === artwork.id;

            return (
              <article
                key={artwork.id}
                data-testid={`spatial-artwork-card-${artwork.indexNumber}`}
                onMouseEnter={() => setHoveredArtworkId(artwork.id)}
                onMouseLeave={() => setHoveredArtworkId(null)}
                style={{
                  width: `${artwork.spatialPos.width}px`,
                  transform: `translate3d(calc(${artwork.spatialPos.x}px - 50% + ${parallax.x}px), calc(${artwork.spatialPos.y}px - 50% + ${parallax.y}px), 0)`
                }}
                className={`group absolute left-0 top-0 p-3.5 border shadow-xl cursor-pointer ui-transition ${
                  isFocused
                    ? 'ring-2 ring-[#8C3F2B]'
                    : ''
                } ${
                  isDarkTheme
                    ? 'bg-[#1D1C1A] border-[#35322D] hover:border-[#8C3F2B]'
                    : 'bg-[#F9F6F0] border-[#D2C9BC] hover:border-[#8C3F2B]'
                }`}
                onClick={() => {
                  if (dragStartRef.current?.moved) return;
                  onOpenArtworkModal(artwork);
                }}
              >
                {/* Top Index & Coordinate Meta (Unboxed Zero-Pill) */}
                <div className="flex items-center justify-between text-[10.5px] font-editorial tracking-wider opacity-65 mb-2">
                  <span>NO. {artwork.indexNumber}</span>
                  <span>{artwork.ambientColor.accentName}</span>
                </div>

                {/* Framed Painting Image */}
                <div className="relative overflow-hidden bg-black/10 border border-current/10">
                  <img
                    src={artwork.imageUrl}
                    alt={`${artwork.title} — ${artwork.mediumAndAttributes}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-[185px] object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end justify-between p-2.5 text-[#F7F4EE]">
                    <span className="text-[11px] font-song">
                      点击展开 2.5x 微距与手记
                    </span>
                    <Maximize2 className="w-3.5 h-3.5 shrink-0" />
                  </div>
                </div>

                {/* Painting Title & Unboxed Medium Metadata */}
                <div className="mt-2.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-[15px] font-song font-semibold tracking-tight">
                      {artwork.title}
                    </h2>
                    <span className="text-[10.5px] font-editorial italic opacity-65 shrink-0">
                      {artwork.dimensionsEstimate.split('·')[0]}
                    </span>
                  </div>

                  <p className="mt-0.5 text-[11px] font-song opacity-75 truncate">
                    {artwork.mediumAndAttributes}
                  </p>

                  <p className="mt-2 pt-2 border-t border-current/10 text-[11.5px] font-song leading-relaxed opacity-85 line-clamp-2">
                    {artwork.originStory}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px] font-song text-[#8C3F2B] font-medium">
                    <span>检视刀笔手记与 2.5x 微距</span>
                    <span aria-hidden="true">→</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* -----------------------------------------------------------------
            FLOATING SPATIAL CONTROL DOCK (悬浮控制坞 - Bottom Center)
        ----------------------------------------------------------------- */}
        <div
          role="toolbar"
          aria-label="画布漫游与视角控制坞"
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2.5 border shadow-xl backdrop-blur-md ${
            isDarkTheme
              ? 'bg-[#1A1917]/92 border-[#35322D] text-[#EAE6DF]'
              : 'bg-[#F7F4EE]/92 border-[#CFC8BC] text-[#1C1A17]'
          }`}
        >
          <span className="hidden xl:inline-flex items-center gap-1.5 text-xs font-song opacity-70 pr-2 border-r border-current/15 whitespace-nowrap">
            <Move className="w-3.5 h-3.5 text-[#8C3F2B]" />
            <span>拖拽漫游 · 滚轮平移</span>
          </span>

          {/* Quick Spatial Focus Index Buttons */}
          <button
            type="button"
            onClick={handleFocusHub}
            className={`px-2.5 py-1 text-xs font-song cursor-pointer whitespace-nowrap shrink-0 ui-transition ${
              focusedNodeId === 'hub'
                ? 'bg-[#8C3F2B] text-[#F7F4EE]'
                : 'hover:bg-current/10'
            }`}
          >
            中心自述
          </button>

          {artworks.map((work) => (
            <button
              key={work.id}
              type="button"
              onClick={() => handleFocusArtwork(work)}
              aria-label={`聚焦作品 ${work.indexNumber} ${work.title}`}
              className={`px-2.5 py-1 text-xs font-song cursor-pointer whitespace-nowrap shrink-0 ui-transition ${
                focusedNodeId === work.id
                  ? 'bg-[#8C3F2B] text-[#F7F4EE]'
                  : 'hover:bg-current/10'
              }`}
            >
              {work.indexNumber} {work.title.replace(/[《》]/g, '').slice(-2)}
            </button>
          ))}

          {/* Zoom & Reset Controls */}
          <div className="flex items-center gap-1 pl-2 border-l border-current/15">
            <button
              type="button"
              onClick={() => handleAdjustZoom(-0.12)}
              aria-label="缩小画布"
              className="p-1.5 hover:bg-current/10 cursor-pointer"
              title="缩小画布"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleFocusHub}
              aria-label="复位画布视角"
              className="px-2 py-1 text-[11px] font-editorial tabular-nums hover:bg-current/10 cursor-pointer whitespace-nowrap"
              title="复位中心视角"
            >
              {Math.round(transform.scale * 100)}%
            </button>
            <button
              type="button"
              onClick={() => handleAdjustZoom(0.12)}
              aria-label="放大画布"
              className="p-1.5 hover:bg-current/10 cursor-pointer"
              title="放大画布"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleFocusHub}
              aria-label="归中画布"
              className="p-1.5 hover:bg-current/10 cursor-pointer"
              title="归中视角"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Theme Ambience & Reading View Switch */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-current/15">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDarkTheme ? '切换为暖亚麻灰背景' : '切换为暗调画廊灰背景'}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-song border border-current/20 hover:bg-current/10 cursor-pointer whitespace-nowrap shrink-0"
            >
              {isDarkTheme ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>暖亚麻灰</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#8C3F2B]" />
                  <span>暗调画廊</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onNavigateSection('archive')}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-song border border-current/20 hover:bg-current/10 cursor-pointer whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>手记长卷模式</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MOBILE CURATED SPATIAL GALLERY VIEW (< 768px)
          Ensures zero horizontal scroll, generous touch targets, and <15% sticky height
      ===================================================================== */}
      <div
        className={`md:hidden pt-20 pb-16 px-4 space-y-8 ${
          isDarkTheme ? 'canvas-linen-dark text-[#EAE6DF]' : 'canvas-linen-light text-[#1C1A17]'
        }`}
      >
        {/* Mobile Section Switcher Pill-Free Segmented Bar */}
        <div
          className={`grid grid-cols-4 border p-1 text-xs font-song ${
            isDarkTheme ? 'bg-[#1C1B19] border-[#33302B]' : 'bg-[#F7F4EE] border-[#D5CFC4]'
          }`}
        >
          <button
            type="button"
            onClick={() => onNavigateSection('canvas')}
            className="py-2 font-semibold bg-[#8C3F2B] text-[#F7F4EE] whitespace-nowrap"
          >
            漫游展厅
          </button>
          <button
            type="button"
            onClick={() => onNavigateSection('statement')}
            className="py-2 opacity-80 whitespace-nowrap"
          >
            创作自述
          </button>
          <button
            type="button"
            onClick={() => onNavigateSection('archive')}
            className="py-2 opacity-80 whitespace-nowrap"
          >
            作品手记
          </button>
          <button
            type="button"
            onClick={() => onNavigateSection('commissions')}
            className="py-2 opacity-80 whitespace-nowrap"
          >
            私人定制
          </button>
        </div>

        {/* Mobile Central Artist Hub Card */}
        <section
          className={`p-6 border shadow-lg ${
            isDarkTheme ? 'bg-[#1C1B19] border-[#33302B]' : 'bg-[#F7F4EE] border-[#D5CFC4]'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-editorial tracking-widest uppercase opacity-70 pb-3 mb-4 border-b border-current/10">
            <span>CAO XIAOCHUN STUDIO</span>
            <button
              type="button"
              onClick={onToggleTheme}
              className="underline cursor-pointer"
            >
              {isDarkTheme ? '切换暖亚麻底色' : '切换暗调画廊'}
            </button>
          </div>
          <h1 className="text-xl font-song font-semibold leading-snug">
            {STUDIO_INFO.statement.headline}
          </h1>
          <p className="mt-1 text-xs font-editorial italic opacity-75">
            {STUDIO_INFO.statement.subheadlineEn}
          </p>
          <div className="mt-4 space-y-3 text-sm font-song leading-relaxed opacity-90">
            {STUDIO_INFO.statement.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-current/12 flex items-center justify-between">
            <ArtistSignature
              variant={isDarkTheme ? 'light' : 'default'}
              size="sm"
            />
          </div>
        </section>

        {/* Mobile 6 Artworks Stream */}
        <div className="space-y-6">
          {artworks.map((artwork) => (
            <article
              key={artwork.id}
              onClick={() => onOpenArtworkModal(artwork)}
              className={`p-4 border shadow-md cursor-pointer ${
                isDarkTheme ? 'bg-[#1C1B19] border-[#33302B]' : 'bg-[#F9F6F0] border-[#D5CFC4]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-editorial tracking-widest opacity-65 mb-2">
                <span>ARCHIVE {artwork.indexNumber} / 06</span>
                <span>{artwork.ambientColor.accentName}</span>
              </div>
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover border border-current/10"
              />
              <h2 className="mt-3 text-lg font-song font-semibold">
                {artwork.title}
              </h2>
              <p className="mt-1 text-xs font-song opacity-75">
                {artwork.mediumAndAttributes}
              </p>
              <p className="mt-2.5 text-sm font-song leading-relaxed opacity-90 line-clamp-3">
                {artwork.originStory}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenArtworkModal(artwork);
                }}
                className="mt-3 w-full py-2.5 text-xs font-song border border-[#8C3F2B] text-[#8C3F2B] font-medium"
              >
                点击开启 2.5x 微距放大镜与完整刀笔手记 →
              </button>
            </article>
          ))}
        </div>

        {/* Mobile Bottom Bespoke Card */}
        <section
          className={`p-6 border ${
            isDarkTheme ? 'bg-[#1C1B19] border-[#33302B]' : 'bg-[#F7F4EE] border-[#D5CFC4]'
          }`}
        >
          <h2 className="text-lg font-song font-semibold">
            {STUDIO_INFO.commissions.title}
          </h2>
          <p className="mt-2 text-sm font-song leading-relaxed opacity-85">
            {STUDIO_INFO.commissions.paragraphs[0]}
          </p>
          <button
            type="button"
            onClick={onCopyWechat}
            className="mt-4 w-full py-3 bg-[#8C3F2B] text-[#F7F4EE] text-xs font-song flex items-center justify-center gap-2"
          >
            {copiedWechat ? (
              <>
                <Check className="w-4 h-4" />
                <span>已复制微信号：cxc750209</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{STUDIO_INFO.commissions.contactCardLabel}（点击复制）</span>
              </>
            )}
          </button>
        </section>
      </div>
    </div>
  );
};
