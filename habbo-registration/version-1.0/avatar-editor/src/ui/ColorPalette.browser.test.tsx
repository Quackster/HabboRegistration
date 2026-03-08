import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-solid';
import ColorPalette from './ColorPalette';

vi.mock('../config', () => ({
  PART_TYPES: ['hr', 'hd', 'ch', 'lg', 'sh'] as const,
  CLICK_THROTTLE: 100,
}));

vi.mock('../data/Layout', () => ({
  coord: (key: string) => {
    const coords: Record<string, number> = {
      colors_per_page: 16,
      color_cols: 8,
      color_cell_size: 15,
      color_cell_inset: 2,
      color_palette_x: 200,
      color_palette_start_y: 50,
      color_palette_spacing: 30,
      color_selector_offset: 1,
      color_arrow_left_offset: -20,
      color_arrow_right_offset: 130,
      color_arrow_w: 15,
      color_arrow_h: 15,
    };
    return coords[key] ?? 0;
  },
}));

// Mock atlas-sprites.css — generated at build time, not available in test environment.
vi.mock('../data/atlas-sprites.css', () => ({}));

// Mock atlas: raster-only rendering via CSS class-based helpers.
vi.mock('../rendering/Atlas', () => ({
  getAtlasPageClass: () => 'ae-ap-0',
  getRegionClass: () => 'ae-r-test',
  getSwatchColorClass: (hex: string) => `ae-bg-${hex.replace('#', '').toUpperCase()}`,
}));

vi.mock('./clickThrottle', () => ({
  isThrottled: () => false,
  triggerThrottle: () => {},
}));

describe('ColorPalette', () => {
  const testColors = ['FF0000', 'FF00', '0000FF', 'FFFF00', 'FF00FF', '00FFFF', 'FFFFFF', '000000'];

  it('renders correct number of swatch elements', () => {
    const screen = render(() => (
      <ColorPalette
        partType="hr"
        palette={{ colors: testColors, selectedIndex: 0 }}
        y={50}
        onSelect={() => {}}
      />
    ));
    // Query by role="button" — swatch and arrow divs have this role
    const swatches = screen.container.querySelectorAll('[role="button"]');
    expect(swatches.length).toBe(testColors.length);
  });

  it('fires onSelect with correct color and index on click', () => {
    const onSelect = vi.fn();
    const screen = render(() => (
      <ColorPalette
        partType="hr"
        palette={{ colors: testColors, selectedIndex: 0 }}
        y={50}
        onSelect={onSelect}
      />
    ));
    const swatches = screen.container.querySelectorAll('[role="button"]');
    (swatches[2] as HTMLElement).click();
    expect(onSelect).toHaveBeenCalledWith('hr', '0000FF', 2);
  });

  it('shows page arrows when colors exceed page size', () => {
    const manyColors = Array.from({ length: 32 }, (_, i) => i.toString(16).padStart(6, '0'));
    const screen = render(() => (
      <ColorPalette
        partType="hr"
        palette={{ colors: manyColors, selectedIndex: 0 }}
        y={50}
        onSelect={() => {}}
      />
    ));
    const buttons = screen.container.querySelectorAll('[role="button"]');
    // 16 swatches on first page + 2 page arrows = 18
    expect(buttons.length).toBe(18);
  });

  it('does not show page arrows when all colors fit on one page', () => {
    const screen = render(() => (
      <ColorPalette
        partType="hr"
        palette={{ colors: testColors, selectedIndex: 0 }}
        y={50}
        onSelect={() => {}}
      />
    ));
    const buttons = screen.container.querySelectorAll('[role="button"]');
    // Only color swatches, no arrows
    expect(buttons.length).toBe(testColors.length);
  });
});
