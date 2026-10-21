import { ArtworkItem } from '../data/artworks';

export interface Point2D {
  x: number;
  y: number;
}

export interface CanvasTransform {
  x: number;
  y: number;
  scale: number;
}

export const CANVAS_BOUNDS = {
  minX: -1250,
  maxX: 1250,
  minY: -1050,
  maxY: 1050,
  minScale: 0.55,
  maxScale: 1.65
};

/**
 * Clamps canvas translation and zoom within comfortable spatial gallery bounds.
 */
export function clampCanvasTransform(transform: CanvasTransform): CanvasTransform {
  const scale = Math.min(
    CANVAS_BOUNDS.maxScale,
    Math.max(CANVAS_BOUNDS.minScale, Number.isFinite(transform.scale) ? transform.scale : 1)
  );
  const x = Math.min(
    CANVAS_BOUNDS.maxX,
    Math.max(CANVAS_BOUNDS.minX, Number.isFinite(transform.x) ? transform.x : 0)
  );
  const y = Math.min(
    CANVAS_BOUNDS.maxY,
    Math.max(CANVAS_BOUNDS.minY, Number.isFinite(transform.y) ? transform.y : 0)
  );
  return { x, y, scale };
}

/**
 * Computes the target canvas transform to center a given artwork on the viewport.
 */
export function computeFocusTransformForArtwork(
  artwork: Pick<ArtworkItem, 'spatialPos'>,
  targetScale = 1.05
): CanvasTransform {
  const raw: CanvasTransform = {
    x: -artwork.spatialPos.x * targetScale,
    y: -artwork.spatialPos.y * targetScale,
    scale: targetScale
  };
  return clampCanvasTransform(raw);
}

/**
 * Computes parallax offset for an element based on its depth factor.
 */
export function computeParallaxOffset(
  canvasOffset: Point2D,
  parallaxDepth: number
): Point2D {
  const deltaFactor = parallaxDepth - 1;
  return {
    x: Math.round(canvasOffset.x * deltaFactor * 100) / 100,
    y: Math.round(canvasOffset.y * deltaFactor * 100) / 100
  };
}

/**
 * Calculates CSS backgroundPosition and backgroundSize percentages for the 2.5x Macro Zoom loupe.
 */
export function computeMacroLoupeStyle(
  cursorRatioX: number,
  cursorRatioY: number,
  zoomFactor = 2.5
): {
  clampedXPercent: number;
  clampedYPercent: number;
  backgroundSizePercent: number;
} {
  const clampedX = Math.min(1, Math.max(0, Number.isFinite(cursorRatioX) ? cursorRatioX : 0.5));
  const clampedY = Math.min(1, Math.max(0, Number.isFinite(cursorRatioY) ? cursorRatioY : 0.5));
  return {
    clampedXPercent: Math.round(clampedX * 1000) / 10,
    clampedYPercent: Math.round(clampedY * 1000) / 10,
    backgroundSizePercent: zoomFactor * 100
  };
}

/**
 * Returns the next or previous artwork in circular order.
 */
export function getAdjacentArtwork(
  artworks: ArtworkItem[],
  currentId: string,
  direction: 'next' | 'prev'
): ArtworkItem {
  if (artworks.length === 0) {
    throw new Error('Artworks list cannot be empty');
  }
  const idx = artworks.findIndex((item) => item.id === currentId);
  if (idx === -1) {
    return artworks[0];
  }
  const offset = direction === 'next' ? 1 : -1;
  const nextIdx = (idx + offset + artworks.length) % artworks.length;
  return artworks[nextIdx];
}

/**
 * Formats numeric artwork count into Chinese character representation (e.g., 8 -> "八", 12 -> "十二").
 */
export function formatChineseArtworkCount(count: number): string {
  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  if (count <= 10) return digits[count] || String(count);
  if (count < 20) return `十${digits[count % 10] === '零' ? '' : digits[count % 10]}`;
  const tens = Math.floor(count / 10);
  const ones = count % 10;
  return `${digits[tens]}十${ones === 0 ? '' : digits[ones]}`;
}

