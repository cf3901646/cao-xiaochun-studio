import test from 'node:test';
import assert from 'node:assert/strict';
import { ARTWORKS, STUDIO_INFO } from '../data/artworks';
import {
  clampCanvasTransform,
  computeFocusTransformForArtwork,
  computeParallaxOffset,
  computeMacroLoupeStyle,
  getAdjacentArtwork,
  formatChineseArtworkCount
} from './canvasMath';

test('STUDIO_INFO contains exact WeChat ID and artist statement with 8 artworks', () => {
  assert.equal(STUDIO_INFO.wechatId, 'cxc750209');
  assert.equal(STUDIO_INFO.statement.headline, '看光怎么落下来，看颜料怎么留住它。');
  assert.equal(STUDIO_INFO.statement.paragraphs.length, 3);
  assert.ok(STUDIO_INFO.statement.paragraphs[2].includes('八幅原作'));
});

test('formatChineseArtworkCount converts numbers to Chinese numerals correctly', () => {
  assert.equal(formatChineseArtworkCount(6), '六');
  assert.equal(formatChineseArtworkCount(8), '八');
  assert.equal(formatChineseArtworkCount(10), '十');
  assert.equal(formatChineseArtworkCount(12), '十二');
  assert.equal(formatChineseArtworkCount(20), '二十');
});

test('All 8 artworks have complete notes and valid attributes', () => {
  assert.equal(ARTWORKS.length, 8);

  for (const work of ARTWORKS) {
    assert.ok(work.title.length > 0, `Missing title for ${work.id}`);
    assert.ok(work.originStory.length > 40, `Origin story too short for ${work.id}`);
    assert.ok(work.techniqueNotes.length > 40, `Technique notes too short for ${work.id}`);
    assert.ok(work.imageUrl.startsWith('/assets/aistudio/'), `Invalid image path for ${work.id}`);
    assert.ok(work.macroSpots.length >= 2, `Expected at least 2 macro spots for ${work.id}`);
  }
});

test('clampCanvasTransform keeps pan and scale within allowed bounds', () => {
  const clamped = clampCanvasTransform({ x: 5000, y: -4000, scale: 3.5 });
  assert.equal(clamped.x, 1250);
  assert.equal(clamped.y, -1050);
  assert.equal(clamped.scale, 1.65);

  const minClamped = clampCanvasTransform({ x: -3000, y: 2000, scale: 0.1 });
  assert.equal(minClamped.x, -1250);
  assert.equal(minClamped.y, 1050);
  assert.equal(minClamped.scale, 0.55);
});

test('computeFocusTransformForArtwork centers target painting with scale', () => {
  const focus = computeFocusTransformForArtwork(ARTWORKS[0], 1.0);
  assert.equal(focus.x, 735);
  assert.equal(focus.y, 200);
  assert.equal(focus.scale, 1.0);
});

test('computeParallaxOffset calculates depth-proportional displacement', () => {
  const offset = computeParallaxOffset({ x: 200, y: -100 }, 1.1);
  assert.equal(offset.x, 20);
  assert.equal(offset.y, -10);
});

test('computeMacroLoupeStyle returns 2.5x magnification (250%) and clamped percentages', () => {
  const loupe = computeMacroLoupeStyle(0.42, 0.53, 2.5);
  assert.equal(loupe.clampedXPercent, 42);
  assert.equal(loupe.clampedYPercent, 53);
  assert.equal(loupe.backgroundSizePercent, 250);

  const outOfBounds = computeMacroLoupeStyle(-0.2, 1.4, 2.5);
  assert.equal(outOfBounds.clampedXPercent, 0);
  assert.equal(outOfBounds.clampedYPercent, 100);
});

test('getAdjacentArtwork cycles through 01 to 08 seamlessly', () => {
  const nextFromLast = getAdjacentArtwork(ARTWORKS, 'work-08', 'next');
  assert.equal(nextFromLast.id, 'work-01');

  const prevFromFirst = getAdjacentArtwork(ARTWORKS, 'work-01', 'prev');
  assert.equal(prevFromFirst.id, 'work-08');
});
