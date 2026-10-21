import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Copy, Check, ArrowDown, Sparkles, ZoomIn } from 'lucide-react';
import { ARTWORKS, ArtworkItem, STUDIO_INFO } from './data/artworks';
import { getAdjacentArtwork, formatChineseArtworkCount } from './utils/canvasMath';
import { TopBar } from './components/TopBar';
import { ArtistSignature } from './components/ArtistSignature';
import { ArtworkArchiveModal } from './components/ArtworkArchiveModal';

interface AtmosphereState {
  primaryHex: string;
  secondaryHex: string;
  beamHex: string;
  surfaceTint: string;
  accentName: string;
}

const COVER_ATMOSPHERE: AtmosphereState = {
  primaryHex: '#3A5F8C',
  secondaryHex: '#D99B38',
  beamHex: '#E8B86D',
  surfaceTint: '#E8E4DC',
  accentName: '星夜钴蓝 · 晨曦暖金'
};

// Warm pigment-tinted museum paper backgrounds per artwork for visible, silky transitions
const ARTWORK_SURFACE_TINTS: Record<string, string> = {
  'work-01': '#EFE5DC', // 朱砂暖褐宣亚麻
  'work-02': '#EAE5EC', // 晨雾藕荷灰亚麻
  'work-03': '#E3EAE1', // 翠谷青苔绿亚麻
  'work-04': '#E2EAE5', // 碧水浅滩青亚麻
  'work-05': '#E3E8F0', // 高原群青冷暖亚麻
  'work-06': '#EFE9DC', // 云海暖帆暮色亚麻
  'work-07': '#EFE4E7', // 陶罐粉蔷薇暖亚麻
  'work-08': '#F0E6D8'  // 焦香麦皮暖金亚麻
};

export default function App() {
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkItem | null>(null);
  const [copiedWechat, setCopiedWechat] = useState<boolean>(false);
  const [atmosphere, setAtmosphere] = useState<AtmosphereState>(COVER_ATMOSPHERE);
  const [visibleIds, setVisibleIds] = useState<Record<string, boolean>>({
    cover: true,
    statement: true
  });

  const coverRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const activeSectionIdRef = useRef<string>('cover');

  // Highly stabilized scroll atmosphere detection: updates ONLY when primary focus shifts
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Collect visible candidate sections
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-section-id');
          if (entry.isIntersecting && sectionId) {
            setVisibleIds((prev) =>
              prev[sectionId] ? prev : { ...prev, [sectionId]: true }
            );
          }
        });

        // Find the single section closest to center viewport
        const viewportCenter = window.innerHeight * 0.45;
        let bestId: string | null = null;
        let minDistance = Infinity;

        const checkElement = (el: HTMLElement | null, id: string) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          // Element must overlap with viewport
          if (rect.bottom > 80 && rect.top < window.innerHeight - 80) {
            const elCenter = (rect.top + rect.bottom) / 2;
            const dist = Math.abs(elCenter - viewportCenter);
            if (dist < minDistance) {
              minDistance = dist;
              bestId = id;
            }
          }
        };

        checkElement(coverRef.current, 'cover');
        checkElement(cardRefs.current['statement'], 'statement');
        ARTWORKS.forEach((w) => {
          checkElement(cardRefs.current[w.id], w.id);
        });

        if (bestId && bestId !== activeSectionIdRef.current) {
          activeSectionIdRef.current = bestId;
          if (bestId === 'cover' || bestId === 'statement') {
            setAtmosphere(COVER_ATMOSPHERE);
          } else {
            const matchedIndex = ARTWORKS.findIndex((w) => w.id === bestId);
            if (matchedIndex !== -1) {
              const currentArt = ARTWORKS[matchedIndex];
              const neighborArt =
                ARTWORKS[(matchedIndex + 1) % ARTWORKS.length] || currentArt;
              setAtmosphere({
                primaryHex: currentArt.ambientColor.hex,
                secondaryHex: neighborArt.ambientColor.hex,
                beamHex: currentArt.ambientColor.hex,
                surfaceTint: ARTWORK_SURFACE_TINTS[currentArt.id] || '#EAE5DC',
                accentName: `${currentArt.title.replace(/[《》]/g, '')} · ${currentArt.ambientColor.accentName}`
              });
            }
          }
        }
      },
      {
        threshold: [0, 0.2, 0.4, 0.6],
        rootMargin: '-5% 0px -10% 0px'
      }
    );

    if (coverRef.current) observer.observe(coverRef.current);
    Object.values(cardRefs.current).forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  const handleCopyWechat = useCallback(async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(STUDIO_INFO.wechatId);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = STUDIO_INFO.wechatId;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch {
      // Fallback handled silently
    }
    setCopiedWechat(true);
    window.setTimeout(() => {
      setCopiedWechat(false);
    }, 2600);
  }, []);

  const handleNavigateModal = useCallback(
    (direction: 'prev' | 'next') => {
      if (!selectedArtwork) return;
      const nextArt = getAdjacentArtwork(ARTWORKS, selectedArtwork.id, direction);
      setSelectedArtwork(nextArt);
    },
    [selectedArtwork]
  );

  const totalCountStr = String(ARTWORKS.length).padStart(2, '0');
  const chineseCountStr = formatChineseArtworkCount(ARTWORKS.length);

  return (
    <div
      className="min-h-screen w-full relative text-[#1C1A17]"
      style={{
        backgroundColor: atmosphere.surfaceTint,
        transition: 'background-color 800ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* ===============================================================
          PERFORMANCE-ENGINEERED CHROMATIC AMBIENT AURA
          Zero 150px Gaussian blur convolution! Uses hardware-accelerated
          pure radial gradients for smooth, 60fps/120fps stutter-free render.
          =============================================================== */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden transform-gpu">
        {/* Primary Ambient Gradient Glow */}
        <div
          className="absolute -top-[10%] -left-[10%] w-[80vw] h-[80vw] max-w-[780px] max-h-[780px] rounded-full opacity-[0.24] animate-aura-primary"
          style={{
            background: `radial-gradient(circle, ${atmosphere.primaryHex} 0%, rgba(255,255,255,0) 70%)`,
            transition: 'background 800ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
        {/* Secondary Counter Complementary Glow */}
        <div
          className="absolute top-[35%] -right-[10%] w-[80vw] h-[80vw] max-w-[760px] max-h-[760px] rounded-full opacity-[0.20] animate-aura-secondary"
          style={{
            background: `radial-gradient(circle, ${atmosphere.secondaryHex} 0%, rgba(255,255,255,0) 70%)`,
            transition: 'background 800ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
        {/* Subtle Warm Linen Texture Layer */}
        <div className="absolute inset-0 linen-grain opacity-60" />
      </div>

      {/* Minimalist Museum Header (No Top-Right WeChat Ad Button) */}
      <TopBar
        activeAccentHex={atmosphere.primaryHex}
        activeAccentName={atmosphere.accentName}
      />

      {/* Main Monograph Flow */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 pt-20 pb-24 space-y-16 sm:space-y-24">
        {/* ===============================================================
            MODULE 0: OPENING MONOGRAPH COVER (画册扉页封面 & 画家油画肖像)
            =============================================================== */}
        <section
          id="cover-section"
          ref={coverRef}
          data-section-id="cover"
          aria-label="画册开篇扉页封面"
          className="relative bg-[#F7F3EB] border border-[#1A1917]/14 p-3 sm:p-5 shadow-[0_20px_55px_rgba(26,25,23,0.07)]"
        >
          {/* Architectural Double-Hairline Inner Monograph Frame */}
          <div className="border border-[#1A1917]/10 p-4 sm:p-10 lg:p-12">
            {/* Top Monograph Folio Header */}
            <div className="flex items-center justify-between gap-2 text-[9.5px] sm:text-[11px] font-editorial tracking-[0.12em] sm:tracking-[0.24em] uppercase text-[#1A1917]/55 pb-3 sm:pb-3.5 mb-5 sm:mb-8 border-b border-[#1A1917]/10 whitespace-nowrap">
              <span className="shrink-0 whitespace-nowrap">
                <span className="hidden xs:inline">MONOGRAPH · </span>个人油画作品集
              </span>
              <span className="shrink-0 whitespace-nowrap">ARCHIVE I — {totalCountStr}</span>
            </div>

            {/* Cover Split Layout: Artist Impasto Portrait + Exhibition Title & Autograph */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 items-center">
              {/* Left Column (5 cols): Artist Oil-Painted Portrait in Museum Mat (Zero Black Bars) */}
              <div className="md:col-span-5 max-w-[270px] sm:max-w-xs md:max-w-none mx-auto w-full">
                <div className="p-2 sm:p-3 bg-[#FAF8F3] border border-[#1A1917]/12 shadow-[0_18px_40px_rgba(26,25,23,0.09)]">
                  <div className="relative w-full overflow-hidden">
                    <img
                      src={STUDIO_INFO.avatarUrl}
                      alt="曹晓春 画家油画自画像肖像"
                      className="block w-full h-auto"
                    />
                  </div>
                  <div className="pt-2 px-1 flex items-center justify-between gap-2 text-[10px] font-editorial tracking-[0.14em] text-[#1A1917]/55 whitespace-nowrap">
                    <span>PORTRAIT OF THE ARTIST</span>
                    <span className="shrink-0">曹晓春 · 迎光肖像</span>
                  </div>
                </div>
              </div>

              {/* Right Column (7 cols): Monograph Cover Typography & Signature */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-5 sm:space-y-8 md:pl-4">
                <div className="space-y-2.5 sm:space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-[#8B3A2B]">
                    <span className="w-6 h-[1px] bg-[#8B3A2B]/60" />
                    <span>曹晓春个人油画数字典藏馆</span>
                  </div>

                  <h1 className="text-[25px] sm:text-4xl lg:text-[42px] font-normal tracking-[0.06em] sm:tracking-[0.08em] leading-[1.28] text-[#1A1917] whitespace-nowrap">
                    {STUDIO_INFO.cover.title}
                  </h1>

                  <p className="font-editorial italic text-sm sm:text-lg text-[#1A1917]/65 tracking-wide">
                    {STUDIO_INFO.cover.subtitleEn}
                  </p>
                </div>

                <p className="text-[15px] sm:text-base leading-[1.95] text-[#2C2A27]/90 border-l-2 border-[#8B3A2B]/40 pl-4">
                  “远看是一口气，近看是一刀一笔的痕迹。”
                  <br />
                  本卷收录曹晓春近期创作的
                  <strong className="font-medium text-[#1A1917]">
                    {chineseCountStr}幅布面油画原作
                  </strong>
                  及每幅画作背后的用光实验与刮刀手记。
                </p>

                {/* Authentic Handwritten Cutout Signature & Seal */}
                <div className="pt-2 border-t border-[#1A1917]/10 flex flex-wrap items-end justify-between gap-6">
                  <ArtistSignature size="md" showSeal={true} />

                  <a
                    href="#works-section"
                    className="group inline-flex items-center gap-2.5 text-xs tracking-[0.2em] text-[#1A1917]/75 hover:text-[#8B3A2B] transition-colors py-1.5"
                  >
                    <span>翻阅{chineseCountStr}幅原作画册</span>
                    <span className="w-6 h-6 rounded-full border border-[#1A1917]/20 flex items-center justify-center group-hover:border-[#8B3A2B] group-hover:translate-y-0.5 transition-all">
                      <ArrowDown className="w-3 h-3" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===============================================================
            MODULE 1: ARTIST PREFACE (序言 · 画家创作自述)
            =============================================================== */}
        <section
          id="statement-section"
          ref={(el) => {
            cardRefs.current['statement'] = el;
          }}
          data-section-id="statement"
          aria-label="画家创作自述"
          className="bg-[#F7F3EB] border border-[#1A1917]/12 p-6 sm:p-11 shadow-[0_16px_40px_rgba(26,25,23,0.05)]"
        >
          <div className="flex items-center justify-between text-[11px] font-editorial tracking-[0.22em] uppercase text-[#8B3A2B] pb-3 mb-5 border-b border-[#1A1917]/10">
            <span>PREFACE · 序言与画室手记</span>
            <span>OIL ON LINEN · {totalCountStr} WORKS</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-normal tracking-wider leading-snug text-[#1A1917] mb-1.5">
            {STUDIO_INFO.statement.headline}
          </h2>
          <p className="font-editorial italic text-sm sm:text-base text-[#1A1917]/60 mb-6">
            {STUDIO_INFO.statement.subheadlineEn}
          </p>

          <div className="space-y-4 text-[15px] sm:text-base leading-[1.95] text-[#2A2825]">
            {STUDIO_INFO.statement.paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </section>

        {/* ===============================================================
            MODULE 2: ORIGINAL OIL PAINTINGS (零黑边自然画幅 · 错落画册流)
            =============================================================== */}
        <section id="works-section" aria-label="近期油画原作与刀笔手记" className="space-y-6">
          <div className="flex items-baseline justify-between px-1 pb-3 border-b border-[#1A1917]/12">
            <div>
              <p className="font-editorial text-[11px] tracking-[0.24em] uppercase text-[#8B3A2B] mb-1">
                CATALOGUE RAISONNÉ · 原作图录
              </p>
              <h2 className="text-xl sm:text-2xl font-normal tracking-wider text-[#1A1917]">
                近期油画原作与刀笔手记（全{chineseCountStr}幅）
              </h2>
            </div>
            <span className="font-editorial text-xs tracking-[0.22em] text-[#1A1917]/60 shrink-0">
              PLATE 01 — {totalCountStr}
            </span>
          </div>

          {/* Responsive Staggered Gallery Grid: Zero Black Bars on Any Device Width */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-11 pt-2 items-start">
            {ARTWORKS.map((artwork, index) => {
              const isVisible = visibleIds[artwork.id] ?? true;
              return (
                <article
                  key={artwork.id}
                  ref={(el) => {
                    cardRefs.current[artwork.id] = el;
                  }}
                  data-section-id={artwork.id}
                  data-testid={`artwork-card-${artwork.indexNumber}`}
                  onMouseEnter={() => {
                    if (activeSectionIdRef.current === artwork.id) return;
                    activeSectionIdRef.current = artwork.id;
                    const neighborArt =
                      ARTWORKS[(index + 1) % ARTWORKS.length] || artwork;
                    setAtmosphere({
                      primaryHex: artwork.ambientColor.hex,
                      secondaryHex: neighborArt.ambientColor.hex,
                      beamHex: artwork.ambientColor.hex,
                      surfaceTint: ARTWORK_SURFACE_TINTS[artwork.id] || '#EAE5DC',
                      accentName: `${artwork.title.replace(/[《》]/g, '')} · ${artwork.ambientColor.accentName}`
                    });
                  }}
                  className={`bg-[#FAF7F0] border border-[#1A1917]/12 p-5 sm:p-7 shadow-[0_12px_36px_rgba(26,25,23,0.06)] flex flex-col justify-between transition-transform duration-500 will-change-transform ${
                    index % 2 === 1 ? 'md:mt-14' : ''
                  } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-2'}`}
                >
                  <div>
                    {/* Plate Header */}
                    <div className="flex items-center justify-between text-[11px] font-editorial tracking-[0.2em] text-[#1A1917]/55 mb-3.5">
                      <span>
                        PLATE {artwork.indexNumber} / {totalCountStr}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[#8B3A2B]">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: artwork.ambientColor.hex }}
                        />
                        {artwork.ambientColor.accentName}
                      </span>
                    </div>

                    {/* Zero-Black-Bar Museum Cotton Mat Frame (Natural Canvas Aspect Ratio) */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedArtwork(artwork)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedArtwork(artwork);
                        }
                      }}
                      className="group cursor-pointer mb-4"
                    >
                      <div className="p-2 sm:p-3 bg-[#FAF8F3] border border-[#1A1917]/10 shadow-[inset_0_0_0_1px_rgba(26,25,23,0.04),0_10px_28px_rgba(26,25,23,0.07)]">
                        <div className="relative w-full overflow-hidden">
                          <img
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            className="block w-full h-auto transition-transform duration-1000 ease-out group-hover:scale-[1.018]"
                            loading={index < 2 ? 'eager' : 'lazy'}
                          />
                        </div>
                      </div>

                      {/* Prominent Micro-Inspection Action Below Frame */}
                      <div className="mt-3 px-0.5 flex items-center justify-between gap-2">
                        <span className="font-editorial italic text-xs text-[#1A1917]/60 truncate">
                          {artwork.enTitle}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8B3A2B]/10 group-hover:bg-[#8B3A2B] text-[#8B3A2B] group-hover:text-[#FAF7F0] border border-[#8B3A2B]/35 rounded-xs text-xs font-medium tracking-wide transition-all shadow-xs shrink-0 whitespace-nowrap">
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span>轻触画布 · 2.5× 微距检视</span>
                        </span>
                      </div>
                    </div>

                    {/* Artwork Title & Medium */}
                    <div className="pb-4 mb-4 border-b border-[#1A1917]/10">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-lg sm:text-xl font-normal tracking-wide text-[#1A1917]">
                          {artwork.title}
                        </h3>
                        <span className="font-editorial italic text-xs text-[#1A1917]/55 shrink-0">
                          {artwork.dimensionsEstimate.split('·')[0].trim()}
                        </span>
                      </div>
                      <p className="text-xs text-[#1A1917]/60 mt-1 tracking-wide">
                        {artwork.mediumAndAttributes}
                      </p>
                    </div>

                    {/* Refined Monograph Notes (No Clunky Square Brackets) */}
                    <div className="space-y-4 text-[14px] leading-[1.9] text-[#2C2A27]">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] font-editorial tracking-[0.18em] uppercase text-[#8B3A2B] mb-1">
                          <span>01 / 创作缘起 · Conception</span>
                        </div>
                        <p>{artwork.originStory}</p>
                      </div>

                      <div className="pt-3 border-t border-[#1A1917]/8">
                        <div className="flex items-center gap-2 text-[11px] font-editorial tracking-[0.18em] uppercase text-[#8B3A2B] mb-1">
                          <span>02 / 刀笔手记 · Technique</span>
                        </div>
                        <p>{artwork.techniqueNotes}</p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ===============================================================
            MODULE 3: EPILOGUE & STUDIO CALLING CARD (尺素 · 私人定制与联络信笺)
            =============================================================== */}
        <section
          id="commission-section"
          aria-label="私人定制与约稿通道"
          className="bg-[#F7F3EB] border border-[#1A1917]/14 p-6 sm:p-11 shadow-[0_18px_45px_rgba(26,25,23,0.06)]"
        >
          <p className="font-editorial text-[11px] tracking-[0.24em] uppercase text-[#8B3A2B] mb-1.5">
            BESPOKE COMMISSIONS · 尺素与私人定制
          </p>
          <h2 className="text-xl sm:text-2xl font-normal tracking-wider text-[#1A1917] mb-4">
            {STUDIO_INFO.commissions.title}
          </h2>

          <div className="space-y-3.5 text-[15px] leading-[1.95] text-[#2A2825] mb-8">
            {STUDIO_INFO.commissions.paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Studio Calling Card with Artist Oil Portrait Avatar */}
          <div className="p-5 sm:p-7 bg-[#FAF8F3] border border-[#1A1917]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-[#1A1917]/20 shadow-sm shrink-0">
                <img
                  src={STUDIO_INFO.avatarUrl}
                  alt="曹晓春 微信头像"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[11px] tracking-wider text-[#8B3A2B]">
                  <Sparkles className="w-3 h-3" />
                  <span>画室主理人直联（添加微信请认准左侧油画肖像头像）</span>
                </div>
                <p className="text-base sm:text-lg font-normal tracking-wider text-[#1A1917]">
                  {STUDIO_INFO.commissions.contactCardLabel}
                </p>
              </div>
            </div>

            <button
              type="button"
              data-testid="commission-copy-wechat"
              onClick={handleCopyWechat}
              className="w-full sm:w-auto px-5 py-3 bg-[#1C1A17] hover:bg-[#8B3A2B] active:scale-[0.99] text-[#F7F4EE] text-xs tracking-[0.18em] flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
            >
              {copiedWechat ? (
                <>
                  <Check className="w-4 h-4 text-[#E2B887]" />
                  <span>已复制画室微信：{STUDIO_INFO.wechatId}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>复制画室微信号</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-[#1A1917]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#1A1917]/55">
            <ArtistSignature size="sm" showSeal={true} />
            <span className="font-editorial tracking-[0.22em] uppercase">
              © CAO XIAOCHUN STUDIO · MONOGRAPH EDITION
            </span>
          </div>
        </section>
      </main>

      {/* Subtle Toast Feedback on Copy */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 ${
          copiedWechat ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        <div className="px-4 py-2.5 bg-[#1C1A17] text-[#F5F2EB] border border-[#D4A373]/40 shadow-xl text-xs tracking-wider whitespace-nowrap">
          已复制曹晓春画室微信号：<strong className="text-[#E2B887]">{STUDIO_INFO.wechatId}</strong>
        </div>
      </div>

      {/* 2.5x Macro Zoom & Fullscreen Lightbox Modal (Zero Black Bars) */}
      <ArtworkArchiveModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onNavigate={handleNavigateModal}
        copiedWechat={copiedWechat}
        onCopyWechat={handleCopyWechat}
      />
    </div>
  );
}
