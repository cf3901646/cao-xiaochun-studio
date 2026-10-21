import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  ZoomIn,
  Sun,
  Moon,
  Download,
  Frame
} from 'lucide-react';
import { ArtworkItem, STUDIO_INFO } from '../data/artworks';
import { ArtistSignature } from './ArtistSignature';
import { ActiveSection } from './TopBar';

interface EditorialSectionsViewProps {
  activeSection: Exclude<ActiveSection, 'canvas'>;
  onNavigateSection: (section: ActiveSection) => void;
  artworks: ArtworkItem[];
  onOpenArtworkModal: (artwork: ArtworkItem) => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  copiedWechat: boolean;
  onCopyWechat: () => void;
}

type WallFinish = 'microcement' | 'walnut' | 'gallery-dark';
type LightTemp = 'warm-3000k' | 'daylight-4800k' | 'candle-2700k';

export const EditorialSectionsView: React.FC<EditorialSectionsViewProps> = ({
  activeSection,
  onNavigateSection,
  artworks,
  onOpenArtworkModal,
  isDarkTheme,
  onToggleTheme,
  copiedWechat,
  onCopyWechat
}) => {
  const [selectedPreviewWorkId, setSelectedPreviewWorkId] = useState<string>(
    artworks[0].id
  );
  const [wallFinish, setWallFinish] = useState<WallFinish>('microcement');
  const [lightTemp, setLightTemp] = useState<LightTemp>('warm-3000k');
  const [sigPreviewVariant, setSigPreviewVariant] = useState<
    'default' | 'ochre' | 'light'
  >('default');

  const previewArtwork =
    artworks.find((a) => a.id === selectedPreviewWorkId) || artworks[0];

  const handleDownloadSignatureSvg = () => {
    const svgContent = `<svg viewBox="0 0 320 110" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>曹晓春 Cao Xiaochun Artistic Signature</title>
  <path d="M22 34 C42 31, 68 26, 86 24 C62 29, 44 38, 34 49 C30 54, 34 62, 46 60 C60 58, 76 47, 82 38 C85 33, 76 28, 66 32 C56 36, 54 50, 55 66 C56 76, 52 86, 44 82 C38 79, 46 70, 62 67 C74 65, 84 66, 92 71" stroke="#1C1A17" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M48 16 C51 28, 52 44, 51 58 M68 14 C67 27, 65 42, 62 56" stroke="#1C1A17" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M88 69 C100 66, 110 52, 116 42" stroke="#1C1A17" stroke-width="1.6" stroke-linecap="round" opacity="0.75"/>
  <path d="M114 36 C114 48, 113 60, 114 68 C115 70, 124 64, 127 54 C130 44, 126 34, 118 36 Z" stroke="#1C1A17" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M134 33 C148 31, 164 26, 176 23 C164 31, 150 42, 138 53 C150 49, 166 45, 178 44 C164 52, 150 64, 136 74 M156 17 C155 34, 154 54, 158 70 C162 82, 176 83, 184 74 C188 69, 187 61, 185 56" stroke="#1C1A17" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M202 28 C218 26, 236 23, 250 21 M206 39 C220 37, 234 35, 246 33 M196 51 C218 48, 244 44, 266 42" stroke="#1C1A17" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M228 13 C225 32, 214 56, 192 78 M224 46 C238 58, 258 72, 286 80 C294 82, 302 81, 308 77" stroke="#1C1A17" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M218 62 C218 72, 219 82, 221 87 C226 86, 238 82, 240 73 C242 64, 232 59, 220 62" stroke="#1C1A17" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="24" y="103" fill="#4A453E" font-family="Georgia, serif" font-style="italic" font-weight="600" font-size="16" letter-spacing="0.14em">Cao Xiaochun · Oil on Linen</text>
</svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cao-xiaochun-art-signature.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main
      className={`min-h-screen pt-24 pb-24 px-5 md:px-12 ${
        isDarkTheme
          ? 'canvas-linen-dark text-[#EAE6DF]'
          : 'canvas-linen-light text-[#1C1A17]'
      }`}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Top Utility Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-current/15">
          <button
            type="button"
            onClick={() => onNavigateSection('canvas')}
            className="inline-flex items-center gap-2 text-xs md:text-sm font-song hover:text-[#8C3F2B] cursor-pointer ui-transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回「无界漫游画布」空间</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-song border border-current/20 hover:bg-current/10 cursor-pointer whitespace-nowrap"
            >
              {isDarkTheme ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>切换暖亚麻灰底色</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#8C3F2B]" />
                  <span>切换暗调画廊底色</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* =================================================================
            TAB 1: 艺术家核心创作自述 (Artist Statement + Custom Signature Design)
        ================================================================= */}
        {activeSection === 'statement' && (
          <div className="space-y-16">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div className="text-xs font-editorial uppercase tracking-[0.22em] text-[#8C3F2B] font-semibold">
                  ARTIST STATEMENT · 艺术家核心创作自述
                </div>
                <h1 className="text-3xl md:text-4xl font-song font-semibold leading-tight text-balance">
                  {STUDIO_INFO.statement.headline}
                </h1>
                <p className="text-base md:text-lg font-editorial italic opacity-80">
                  {STUDIO_INFO.statement.subheadlineEn}
                </p>

                <div className="pt-4 border-t border-current/12 space-y-5 text-base font-song leading-[1.9] max-w-[68ch] text-justify">
                  {STUDIO_INFO.statement.paragraphs.map((para, index) => (
                    <p
                      key={index}
                      className={
                        index === 0
                          ? 'first-letter:text-4xl first-letter:font-song first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#8C3F2B]'
                          : ''
                      }
                    >
                      {para}
                    </p>
                  ))}
                </div>

                <div className="pt-6 border-t border-current/12 flex flex-wrap items-center justify-between gap-6">
                  <ArtistSignature
                    variant={isDarkTheme ? 'light' : 'default'}
                    size="md"
                  />

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onNavigateSection('archive')}
                      className="px-5 py-2.5 text-xs font-song bg-[#8C3F2B] text-[#F7F4EE] hover:bg-[#733221] cursor-pointer whitespace-nowrap"
                    >
                      阅读六幅作品手记 →
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Featured Diptych Comparison (Glazing vs Impasto) */}
              <div
                className={`lg:col-span-5 p-6 border space-y-5 ${
                  isDarkTheme
                    ? 'bg-[#1C1B19] border-[#33302B]'
                    : 'bg-[#F7F4EE] border-[#D5CFC4]'
                }`}
              >
                <div className="text-xs font-editorial uppercase tracking-[0.18em] opacity-70">
                  DIALOGUE OF TECHNIQUE · 薄涂罩染与刮刀厚堆
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => onOpenArtworkModal(artworks[0])}
                    className="cursor-pointer group"
                  >
                    <div className="aspect-[3/4] overflow-hidden border border-current/10">
                      <img
                        src={artworks[0].imageUrl}
                        alt={artworks[0].title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="mt-2 text-xs font-song font-semibold">
                      {artworks[0].title}
                    </div>
                    <div className="text-[11px] font-song opacity-70">
                      古典暗部压重 · 透明罩染
                    </div>
                  </div>

                  <div
                    onClick={() => onOpenArtworkModal(artworks[3])}
                    className="cursor-pointer group"
                  >
                    <div className="aspect-[3/4] overflow-hidden border border-current/10">
                      <img
                        src={artworks[3].imageUrl}
                        alt={artworks[3].title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="mt-2 text-xs font-song font-semibold">
                      {artworks[3].title}
                    </div>
                    <div className="text-[11px] font-song opacity-70">
                      调色刀背挑色 · 厚涂塑石
                    </div>
                  </div>
                </div>
                <p className="text-xs font-song leading-relaxed opacity-80 pt-3 border-t border-current/10">
                  点击上方任意画作，即可开启 2.5x 微距放大镜，对比检视「透明薄染」与「刮刀厚堆」在亚麻布上的真实痕迹。
                </p>
              </div>
            </section>

            {/* Custom Artistic Signature Showcase Card */}
            <section
              className={`p-8 border ${
                isDarkTheme
                  ? 'bg-[#1C1B19] border-[#33302B]'
                  : 'bg-[#F7F4EE] border-[#D5CFC4]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-current/12">
                <div>
                  <div className="text-xs font-editorial uppercase tracking-[0.2em] text-[#8C3F2B] font-semibold">
                    BESPOKE ARTIST MONOGRAM & SEAL · 专属艺术签名设计
                  </div>
                  <h2 className="mt-1 text-xl font-song font-semibold">
                    曹晓春 (Cao Xiaochun) 刀笔连绵体签名与朱砂画印
                  </h2>
                  <p className="mt-1 text-xs font-song opacity-75">
                    融合油画刮刀的利落切面与行草连绵气韵，「曹」字横起如调色刀抹色，「春」字末笔长捺舒展收束，配「晓春画印」朱文方印。
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSigPreviewVariant('default')}
                    className={`px-3 py-1.5 text-xs font-song border cursor-pointer whitespace-nowrap ${
                      sigPreviewVariant === 'default'
                        ? 'bg-[#1C1A17] text-[#F7F4EE] border-[#1C1A17]'
                        : 'border-current/20'
                    }`}
                  >
                    象牙黑油彩款
                  </button>
                  <button
                    type="button"
                    onClick={() => setSigPreviewVariant('ochre')}
                    className={`px-3 py-1.5 text-xs font-song border cursor-pointer whitespace-nowrap ${
                      sigPreviewVariant === 'ochre'
                        ? 'bg-[#8C3F2B] text-[#F7F4EE] border-[#8C3F2B]'
                        : 'border-current/20'
                    }`}
                  >
                    熟褐茜素红款
                  </button>
                  <button
                    type="button"
                    onClick={() => setSigPreviewVariant('light')}
                    className={`px-3 py-1.5 text-xs font-song border cursor-pointer whitespace-nowrap ${
                      sigPreviewVariant === 'light'
                        ? 'bg-[#33302B] text-[#EAE6DF] border-[#33302B]'
                        : 'border-current/20'
                    }`}
                  >
                    暗底钛白款
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadSignatureSvg}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-song border border-[#8C3F2B] text-[#8C3F2B] hover:bg-[#8C3F2B] hover:text-white cursor-pointer whitespace-nowrap ui-transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>下载矢量签名 SVG</span>
                  </button>
                </div>
              </div>

              <div
                className={`mt-6 p-10 flex flex-col items-center justify-center border transition-colors ${
                  sigPreviewVariant === 'light'
                    ? 'bg-[#141413] border-[#2E2C29]'
                    : 'bg-[#EAE6DF] border-[#D5CFC4]'
                }`}
              >
                <ArtistSignature
                  variant={sigPreviewVariant}
                  size="lg"
                  showSeal={true}
                />
                <div
                  className={`mt-4 text-xs font-editorial tracking-widest ${
                    sigPreviewVariant === 'light'
                      ? 'text-[#A6A096]'
                      : 'text-[#5C564E]'
                  }`}
                >
                  SIGNATURE SPECIMEN · 曹晓春个人油画原作落款与画室印鉴
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =================================================================
            TAB 2: 六幅画作独立档案与详细手记全览 (Archive 06)
        ================================================================= */}
        {activeSection === 'archive' && (
          <div className="space-y-12">
            <div className="border-b border-current/15 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-editorial uppercase tracking-[0.22em] text-[#8C3F2B] font-semibold">
                  COMPLETE STUDIO ARCHIVE · 01 — 06
                </div>
                <h1 className="mt-1 text-3xl font-song font-semibold">
                  六幅油画原作 · 创作缘起与刀笔手记全集
                </h1>
              </div>
              <p className="text-xs font-song opacity-75">
                不按题材生硬分类 · 点击任意画作可进入全屏 2.5x 微距放大镜检视亚麻布纹与刀触
              </p>
            </div>

            <div className="space-y-16">
              {artworks.map((artwork, index) => {
                const isEven = index % 2 === 1;
                return (
                  <article
                    key={artwork.id}
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 md:p-10 border items-stretch ${
                      isDarkTheme
                        ? 'bg-[#1C1B19] border-[#33302B]'
                        : 'bg-[#F7F4EE] border-[#D5CFC4]'
                    }`}
                  >
                    {/* Painting Column */}
                    <div
                      className={`lg:col-span-5 flex flex-col justify-between ${
                        isEven ? 'lg:order-2' : ''
                      }`}
                    >
                      <div
                        onClick={() => onOpenArtworkModal(artwork)}
                        className="group relative overflow-hidden border border-current/15 bg-black/5 cursor-zoom-in"
                      >
                        <img
                          src={artwork.imageUrl}
                          alt={`${artwork.title} — ${artwork.mediumAndAttributes}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-auto max-h-[520px] object-contain mx-auto group-hover:scale-[1.02] transition-transform duration-500"
                        />
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0 bg-black/55 flex items-center justify-center p-4">
                          <span className="px-4 py-2 bg-[#F7F4EE] text-[#1C1A17] text-xs font-song inline-flex items-center gap-2 shadow-lg">
                            <ZoomIn className="w-4 h-4 text-[#8C3F2B]" />
                            <span>开启全屏 2.5x 微距放大镜检视</span>
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2 text-xs font-song">
                        <span className="opacity-65 font-mono">
                          档案编号：{artwork.indexNumber} / {artwork.originalFilename}
                        </span>
                        <button
                          type="button"
                          onClick={() => onOpenArtworkModal(artwork)}
                          className="inline-flex items-center gap-1.5 text-[#8C3F2B] font-semibold hover:underline cursor-pointer whitespace-nowrap"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span>2.5x 微距放大镜</span>
                        </button>
                      </div>
                    </div>

                    {/* Complete Verbatim Notes Column */}
                    <div
                      className={`lg:col-span-7 flex flex-col justify-between space-y-6 ${
                        isEven ? 'lg:order-1' : ''
                      }`}
                    >
                      <div className="space-y-6">
                        <div className="border-b border-current/12 pb-4">
                          <div className="text-xs font-editorial uppercase tracking-[0.2em] text-[#8C3F2B] font-semibold">
                            【作品 {artwork.indexNumber}】 · {artwork.ambientColor.accentName}
                          </div>
                          <h2 className="mt-1 text-2xl md:text-3xl font-song font-semibold">
                            {artwork.title}
                          </h2>
                          <div className="mt-2 text-xs md:text-sm font-song opacity-80">
                            <span>{artwork.mediumAndAttributes}</span>
                            <span aria-hidden="true" className="mx-2">·</span>
                            <span>{artwork.dimensionsEstimate}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-xs font-song uppercase tracking-widest text-[#8C3F2B] font-semibold">
                            创作理念与缘起
                          </h3>
                          <p className="text-[15px] font-song leading-[1.85] opacity-92 text-justify max-w-[68ch]">
                            {artwork.originStory}
                          </p>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-current/10">
                          <h3 className="text-xs font-song uppercase tracking-widest text-[#8C3F2B] font-semibold">
                            用光与刀笔手记
                          </h3>
                          <p className="text-[15px] font-song leading-[1.85] opacity-92 text-justify max-w-[68ch]">
                            {artwork.techniqueNotes}
                          </p>
                        </div>
                      </div>

                      <div className="pt-5 border-t border-current/12 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {artwork.macroSpots.map((spot, idx) => (
                            <button
                              key={spot.id}
                              type="button"
                              onClick={() => onOpenArtworkModal(artwork)}
                              className="px-3 py-1.5 text-xs font-song border border-current/20 hover:border-[#8C3F2B] cursor-pointer whitespace-nowrap ui-transition"
                            >
                              微距看点 0{idx + 1}：{spot.label}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => onOpenArtworkModal(artwork)}
                          className="px-4 py-2 text-xs font-song bg-[#1C1A17] text-[#F7F4EE] hover:bg-[#8C3F2B] cursor-pointer whitespace-nowrap ui-transition"
                        >
                          进入微距检视与档案抽屉 →
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================
            TAB 3: 私人定制与约稿板块 (Bespoke Commissions + Interactive Wall Previewer)
        ================================================================= */}
        {activeSection === 'commissions' && (
          <div className="space-y-14">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Left Column: Verbatim Bespoke Commissions Copy & WeChat Contact Card */}
              <div
                className={`lg:col-span-6 p-8 md:p-10 border flex flex-col justify-between ${
                  isDarkTheme
                    ? 'bg-[#1C1B19] border-[#33302B]'
                    : 'bg-[#F7F4EE] border-[#D5CFC4]'
                }`}
              >
                <div className="space-y-6">
                  <div className="text-xs font-editorial uppercase tracking-[0.22em] text-[#8C3F2B] font-semibold">
                    BESPOKE COMMISSIONS · 私人定制与约稿通道
                  </div>
                  <h1 className="text-2xl md:text-3xl font-song font-semibold leading-snug text-balance">
                    {STUDIO_INFO.commissions.title}
                  </h1>

                  <div className="pt-4 border-t border-current/12 space-y-4 text-[15px] font-song leading-[1.9] text-justify">
                    {STUDIO_INFO.commissions.paragraphs.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  {/* Curatorial Process Notes (Unboxed Clean List) */}
                  <div className="pt-6 border-t border-current/12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-song">
                    <div>
                      <div className="font-editorial text-sm font-semibold text-[#8C3F2B]">
                        01. 空间与光线沟通
                      </div>
                      <p className="mt-1 opacity-80 leading-relaxed">
                        根据您的墙面尺寸、空间采光与偏爱色调，由画家本人直接沟通构想。
                      </p>
                    </div>
                    <div>
                      <div className="font-editorial text-sm font-semibold text-[#8C3F2B]">
                        02. 亚麻布刀笔创作
                      </div>
                      <p className="mt-1 opacity-80 leading-relaxed">
                        选用专业亚麻油画布与艺术家级油彩，实时分享画室创作进度与肌理细节。
                      </p>
                    </div>
                    <div>
                      <div className="font-editorial text-sm font-semibold text-[#8C3F2B]">
                        03. 干透养护与装裱交付
                      </div>
                      <p className="mt-1 opacity-80 leading-relaxed">
                        油彩自然干透并完成画面保护层处理后，附亲笔签名与创作手记档案交付。
                      </p>
                    </div>
                  </div>
                </div>

                {/* Persistent Contact Card */}
                <div
                  className={`mt-8 p-6 border ${
                    isDarkTheme
                      ? 'bg-[#141413] border-[#2E2C29]'
                      : 'bg-[#EAE6DF] border-[#CFC8BC]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-editorial uppercase tracking-widest opacity-65">
                        DIRECT ARTIST CONTACT · 唯一指定联系方式
                      </div>
                      <div className="mt-1 text-lg font-song font-semibold">
                        {STUDIO_INFO.commissions.contactCardLabel}
                      </div>
                      <div className="mt-1 text-xs font-song opacity-75">
                        添加微信时可备注「油画收藏」或「空间定制」，由曹晓春本人直接回复
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onCopyWechat}
                      className={`px-5 py-3 text-xs md:text-sm font-song border cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-2 ui-transition ${
                        copiedWechat
                          ? 'bg-[#2D5A3C] border-[#2D5A3C] text-white'
                          : 'bg-[#8C3F2B] border-[#8C3F2B] text-[#F7F4EE] hover:bg-[#733221]'
                      }`}
                    >
                      {copiedWechat ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>已复制微信号：cxc750209</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>一键复制微信号</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-5 pt-4 border-t border-current/12 flex items-center justify-between">
                    <span className="text-xs font-song opacity-70">
                      纯艺术馆藏级标准 · 不设商业购物车与标价签
                    </span>
                    <ArtistSignature
                      variant={isDarkTheme ? 'light' : 'default'}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Space & Wall Lighting Previewer */}
              <div
                className={`lg:col-span-6 p-8 border flex flex-col justify-between ${
                  isDarkTheme
                    ? 'bg-[#1C1B19] border-[#33302B]'
                    : 'bg-[#F7F4EE] border-[#D5CFC4]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-4 border-b border-current/12">
                    <div>
                      <div className="text-xs font-editorial uppercase tracking-[0.2em] text-[#8C3F2B] font-semibold">
                        SPACE & LIGHTING SIMULATOR · 空间墙面与光线预览
                      </div>
                      <h2 className="mt-1 text-lg font-song font-semibold">
                        预览六幅原作在不同墙面肌理与色温下的悬挂效果
                      </h2>
                    </div>
                    <Frame className="w-5 h-5 text-[#8C3F2B] shrink-0" />
                  </div>

                  {/* Controls for Wall & Lighting */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-song">
                    <div>
                      <div className="opacity-70 mb-1.5">选择墙面材质：</div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setWallFinish('microcement')}
                          className={`px-2.5 py-1.5 border cursor-pointer whitespace-nowrap ${
                            wallFinish === 'microcement'
                              ? 'bg-[#8C3F2B] text-white border-[#8C3F2B]'
                              : 'border-current/20'
                          }`}
                        >
                          微水泥暖灰
                        </button>
                        <button
                          type="button"
                          onClick={() => setWallFinish('walnut')}
                          className={`px-2.5 py-1.5 border cursor-pointer whitespace-nowrap ${
                            wallFinish === 'walnut'
                              ? 'bg-[#8C3F2B] text-white border-[#8C3F2B]'
                              : 'border-current/20'
                          }`}
                        >
                          胡桃木书房
                        </button>
                        <button
                          type="button"
                          onClick={() => setWallFinish('gallery-dark')}
                          className={`px-2.5 py-1.5 border cursor-pointer whitespace-nowrap ${
                            wallFinish === 'gallery-dark'
                              ? 'bg-[#8C3F2B] text-white border-[#8C3F2B]'
                              : 'border-current/20'
                          }`}
                        >
                          暗调画廊墙
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="opacity-70 mb-1.5">选择环境色温：</div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setLightTemp('warm-3000k')}
                          className={`px-2.5 py-1.5 border cursor-pointer whitespace-nowrap ${
                            lightTemp === 'warm-3000k'
                              ? 'bg-[#8C3F2B] text-white border-[#8C3F2B]'
                              : 'border-current/20'
                          }`}
                        >
                          3000K 暖射灯
                        </button>
                        <button
                          type="button"
                          onClick={() => setLightTemp('daylight-4800k')}
                          className={`px-2.5 py-1.5 border cursor-pointer whitespace-nowrap ${
                            lightTemp === 'daylight-4800k'
                              ? 'bg-[#8C3F2B] text-white border-[#8C3F2B]'
                              : 'border-current/20'
                          }`}
                        >
                          4800K 自然光
                        </button>
                        <button
                          type="button"
                          onClick={() => setLightTemp('candle-2700k')}
                          className={`px-2.5 py-1.5 border cursor-pointer whitespace-nowrap ${
                            lightTemp === 'candle-2700k'
                              ? 'bg-[#8C3F2B] text-white border-[#8C3F2B]'
                              : 'border-current/20'
                          }`}
                        >
                          2700K 静谧暗室
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Simulated Wall Stage */}
                  <div
                    className={`relative mt-5 h-[340px] flex flex-col items-center justify-center p-6 border overflow-hidden transition-colors duration-500 ${
                      wallFinish === 'microcement'
                        ? 'bg-[#E5E0D7] border-[#CFC8BC] text-[#1C1A17]'
                        : wallFinish === 'walnut'
                        ? 'bg-[#3B2D23] border-[#523F31] text-[#EAE6DF]'
                        : 'bg-[#151514] border-[#2E2C29] text-[#EAE6DF]'
                    }`}
                  >
                    {/* Simulated gallery track spotlight cone */}
                    <div
                      className="pointer-events-none absolute inset-0 transition-opacity duration-500"
                      style={{
                        background:
                          lightTemp === 'warm-3000k'
                            ? 'radial-gradient(circle at 50% 25%, rgba(255, 224, 178, 0.32), transparent 68%)'
                            : lightTemp === 'daylight-4800k'
                            ? 'radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.28), transparent 72%)'
                            : 'radial-gradient(circle at 50% 30%, rgba(235, 168, 92, 0.25), rgba(0,0,0,0.45) 75%)'
                      }}
                    />

                    {/* Framed Painting on the Wall */}
                    <div
                      onClick={() => onOpenArtworkModal(previewArtwork)}
                      className="relative z-10 p-3 bg-[#FBF9F5] border-4 border-[#2B2622] shadow-[0_22px_45px_rgba(0,0,0,0.45)] cursor-pointer group"
                    >
                      <img
                        src={previewArtwork.imageUrl}
                        alt={previewArtwork.title}
                        referrerPolicy="no-referrer"
                        className="max-h-[215px] w-auto object-contain"
                      />
                    </div>

                    <div className="relative z-10 mt-3 text-xs font-song opacity-80">
                      正在试挂：{previewArtwork.indexNumber} {previewArtwork.title}（{previewArtwork.dimensionsEstimate}）
                    </div>
                  </div>
                </div>

                {/* Painting Selector Thumbnail Strip */}
                <div className="mt-5 pt-4 border-t border-current/12">
                  <div className="text-xs font-song opacity-70 mb-2">
                    点击切换试挂画作（或作为定制风格参考）：
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {artworks.map((work) => {
                      const active = work.id === previewArtwork.id;
                      return (
                        <button
                          key={work.id}
                          type="button"
                          onClick={() => setSelectedPreviewWorkId(work.id)}
                          className={`p-1 border text-left cursor-pointer ui-transition ${
                            active
                              ? 'border-[#8C3F2B] bg-[#8C3F2B]/10'
                              : 'border-current/15 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={work.imageUrl}
                            alt={work.title}
                            referrerPolicy="no-referrer"
                            className="w-full aspect-square object-cover"
                          />
                          <div className="mt-1 text-[10px] font-song truncate">
                            {work.indexNumber} {work.title.replace(/[《》]/g, '')}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
};
