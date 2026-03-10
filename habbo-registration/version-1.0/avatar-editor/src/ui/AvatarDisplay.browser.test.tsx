import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-solid';
import AvatarDisplay from './AvatarDisplay';
import type { PartInfo } from '../rendering/AvatarRenderer';

vi.mock('../config', () => ({
  RENDER_ORDER: ['bd', 'ch', 'hd', 'ey', 'hr'],
  FLIP_LIST: [0, 1, 2, 3, 2, 1, 0, 7],
  ANIMATION_INTERVAL: 150,
  ACTION_PARTS: { wlk: ['bd', 'lg'], wav: ['ls', 'lh'] },
  PART_LABELS: { bd: 'Body', ch: 'Chest', hd: 'Head', ey: 'Eyes', hr: 'Hair' },
}));

vi.mock('../data/Layout', () => ({
  coord: (key: string) => {
    const coords: Record<string, number> = {
      avatar_x: 50, avatar_y: 80,
      avatar_scale: 2, flip_width: 64,
    };
    return coords[key] ?? 0;
  },
}));

vi.mock('../data/SymbolMap', () => ({
  getSpriteInfo: (name: string) => {
    // Return info for any sprite name that matches our test parts
    if (name.includes('_bd_') || name.includes('_ch_') || name.includes('_hd_') || name.includes('_ey_') || name.includes('_hr_')) {
      return { imageId: 1, offsetX: 10, offsetY: 20 };
    }
    return null;
  },
}));

// Mock atlas-sprites.css — generated at build time, not available in test environment.
vi.mock('../data/atlas-sprites.css', () => ({}));

vi.mock('../rendering/Atlas', () => ({
  // getSvgBlobUrl returns null (no SVG in test — raster div fallback). CSS class rendering
  // via getAtlasPageClass, getRegionClass, getSpriteOffsetClass, getSpriteOffsetFlippedClass.
  getSvgBlobUrl: () => null,
  getAtlasPageClass: () => 'ae-ap-0',
  getRegionClass: (key: string) => `ae-r-${key}`,
  getSpriteOffsetClass: (id: number) => `ae-so-${id}`,
  getSpriteOffsetFlippedClass: (id: number) => `ae-sof-${id}`,
  addNeededKey: () => {},
  removeNeededKey: () => {},
}));

vi.mock('../rendering/ColorTint', () => ({
  // getRasterTintClass returns ae-tr-HEX for non-white, '' for white.
  // getVectorTintClass returns ae-tv-HEX for non-white, '' for white.
  getRasterTintClass: (hex: string) => hex.toUpperCase() === 'FFFFFF' ? '' : `ae-tr-${hex}`,
  getVectorTintClass: (hex: string) => hex.toUpperCase() === 'FFFFFF' ? '' : `ae-tv-${hex}`,
}));

describe('AvatarDisplay', () => {
  function makeParts(): Map<string, PartInfo> {
    const parts = new Map<string, PartInfo>();
    parts.set('bd', { partName: 'bd', modelNum: '001', mainPart: 'hd', color: 'E8B137' });
    parts.set('ch', { partName: 'ch', modelNum: '021', mainPart: 'ch', color: 'FF0000' });
    parts.set('hd', { partName: 'hd', modelNum: '001', mainPart: 'hd', color: 'E8B137' });
    parts.set('ey', { partName: 'ey', modelNum: '001', mainPart: 'hd', color: 'FFFFFF' });
    parts.set('hr', { partName: 'hr', modelNum: '175', mainPart: 'hr', color: '333333' });
    return parts;
  }

  // Renders <div role="img"> for raster (getSvgBlobUrl returns null in test), <img> for SVG.
  // Test queries div[role="img"] since no SVGs are available in the test environment.
  it('renders correct number of div elements for raster fallback', () => {
    const screen = render(() => (
      <AvatarDisplay parts={makeParts()} direction={2} action="std" />
    ));
    const divs = screen.container.querySelectorAll('div[role="img"]');
    expect(divs.length).toBe(5);
  });

  it('each part div has correct z-index from RENDER_ORDER', () => {
    const screen = render(() => (
      <AvatarDisplay parts={makeParts()} direction={2} action="std" />
    ));
    const divs = screen.container.querySelectorAll('div[role="img"]');
    // Computed z-index from CSS module classes .z0-.z13
    const zIndices = Array.from(divs).map(div => parseInt(getComputedStyle(div).zIndex));
    expect(zIndices).toEqual([0, 1, 2, 3, 4]);
  });

  it('applies scaleX(-1) transform for flipped directions', () => {
    const screen = render(() => (
      <AvatarDisplay parts={makeParts()} direction={4} action="std" />
    ));
    const divs = screen.container.querySelectorAll('div[role="img"]');
    // Computed transform from CSS module class .flipped
    const flipped = Array.from(divs).filter(div => {
      const t = getComputedStyle(div).transform;
      return t === 'scaleX(-1)' || t === 'matrix(-1, 0, 0, 1, 0, 0)';
    });
    expect(flipped.length).toBe(5); // All parts flipped
  });

  it('does not apply raster tint class to eye parts', () => {
    const screen = render(() => (
      <AvatarDisplay parts={makeParts()} direction={2} action="std" />
    ));
    const divs = screen.container.querySelectorAll('div[role="img"]');
    // ey is index 3 in RENDER_ORDER ['bd', 'ch', 'hd', 'ey', 'hr']
    // Eye part div should NOT have ae-tr-* class (no raster tint on eyes)
    const eyeDiv = divs[3];
    const classes = eyeDiv.className;
    expect(classes).not.toMatch(/ae-tr-/);
  });

  it('applies raster tint class to non-eye parts', () => {
    const screen = render(() => (
      <AvatarDisplay parts={makeParts()} direction={2} action="std" />
    ));
    const divs = screen.container.querySelectorAll('div[role="img"]');
    // bd is index 0, has color E8B137 — raster div should have ae-tr-E8B137 tint class
    expect(divs[0].className).toContain('ae-tr-E8B137');
  });
});
