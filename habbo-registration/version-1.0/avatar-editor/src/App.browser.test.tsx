import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-solid';
import AvatarEditor from './App';

// Mock all heavy dependencies for integration test
vi.mock('./data/Layout', () => ({
  coord: (key: string) => {
    const coords: Record<string, number> = {
      canvas_width: 406, canvas_height: 327,
      background_y: 30, avatar_x: 50, avatar_y: 80, avatar_scale: 2,
      flip_width: 64,
      gender_boy_x: 20, gender_girl_x: 80, gender_y: 10,
      gender_hit_pad_x: 5, gender_hit_pad_y: 5,
      gender_hit_w: 50, gender_hit_h: 30,
      gender_label_offset_x: 15, gender_label_offset_y: 0,
      gender_label_y: 30, font_size: 11,
      preview_x: 320, preview_start_y: 50, preview_spacing: 40,
      preview_bg_offset_x: 0, preview_bg_offset_y: 0,
      preview_clip_offset_x: 5, preview_clip_offset_y: 5,
      preview_clip_w: 33, preview_clip_h: 33,
      preview_offset_hr: -10, preview_offset_hd: -10,
      preview_offset_ch: 0, preview_offset_lg: 10, preview_offset_sh: 20,
      part_arrow_start_y: 50, part_arrow_spacing: 40,
      part_arrow_left_x: 280, part_arrow_right_x: 370,
      part_arrow_hit_w: 20, part_arrow_hit_h: 20,
      color_palette_x: 200, color_palette_start_y: 250,
      color_palette_spacing: 30, colors_per_page: 16,
      color_cols: 8, color_cell_size: 15, color_cell_inset: 2,
      color_selector_offset: 1,
      color_arrow_left_offset: -20, color_arrow_right_offset: 130,
      color_arrow_w: 15, color_arrow_h: 15,
      rotate_prev_x: 50, rotate_next_x: 130, rotate_y: 300,
      rotate_hit_w: 20, rotate_hit_h: 20,
      randomize_x: 170, randomize_y: 300, randomize_w: 70, randomize_h: 22,
      continue_x: 300, continue_y: 300, continue_w: 90, continue_h: 25,
      letter_spacing: 0,
    };
    return coords[key] ?? 0;
  },
}));

vi.mock('./config', () => ({
  PART_TYPES: ['hr', 'hd', 'ch', 'lg', 'sh'] as const,
  RENDER_ORDER: ['li', 'lh', 'ls', 'bd', 'sh', 'lg', 'ch', 'hd', 'fc', 'ey', 'hr', 'ri', 'rh', 'rs'],
  FLIP_LIST: [0, 1, 2, 3, 2, 1, 0, 7],
  ANIMATION_INTERVAL: 150,
  CONTINUE_DELAY: 100,
  RANDOMIZE_COOLDOWN: 100,
  GENDER_COOLDOWN: 100,
  CLICK_THROTTLE: 100,
  ACTION_PARTS: { wlk: ['bd', 'lg', 'lh', 'rh', 'ls', 'rs', 'sh'] },
  PART_LABELS: { li: 'Left item', lh: 'Left hand', ls: 'Left sleeve', bd: 'Body', sh: 'Shoes', lg: 'Legs', ch: 'Chest', hd: 'Head', fc: 'Face', ey: 'Eyes', hr: 'Hair', ri: 'Right item', rh: 'Right hand', rs: 'Right sleeve' },
}));

vi.mock('./data/Localization', () => ({
  loadLocalizationFromUrl: async () => {},
  getText: (key: string) => key,
}));

vi.mock('./data/SymbolMap', () => ({
  getSpriteInfo: () => null,
}));

vi.mock('./data/FigureData', () => ({
  getPartAndColor: () => null,
  getPartsAndIndexes: () => ({
    setIndex: 0, color: 'E8B137', colorIndex: 0,
    subParts: [['bd', '001']] as [string, string][],
  }),
  getAllPartColors: () => ['E8B137', 'FF0000', '333333'],
  getPartNumber: () => '001',
  getPartIndexByNumber: () => [0, 'hr'] as [number, string],
}));

vi.mock('./model/FigureString', () => ({
  parseFigureString: () => Array(5).fill({ modelId: '001', colorIdx: '01' }),
  encodeFigureString: () => '0010100101001010010100101',
  padColorIndex: (n: number) => n < 10 ? `0${n}` : `${n}`,
}));

vi.mock('./ui/clickThrottle', () => ({
  isThrottled: () => false,
  triggerThrottle: () => {},
}));

// Mock atlas-sprites.css — generated at build time, not available in test environment.
vi.mock('./data/atlas-sprites.css', () => ({}));

// Mock atlas: getSvgBlobUrl returns null (raster fallback), with CSS class-based rendering helpers.
vi.mock('./rendering/Atlas', () => ({
  loadAtlas: async () => {},
  vectorizeSprites: async () => {},
  terminateWorkerPool: async () => {},
  getSvgBlobUrl: () => null,
  getAtlasPageClass: () => 'ae-ap-0',
  getRegionClass: (key: string) => `ae-r-${key.replace(/\//g, '-')}`,
  getSpriteOffsetClass: (id: number) => `ae-so-${id}`,
  getSpriteOffsetFlippedClass: (id: number) => `ae-sof-${id}`,
  getPreviewOffsetClass: (id: number, pt: string) => `ae-po-${id}-${pt}`,
  getSwatchColorClass: (hex: string) => `ae-bg-${hex.replace('#', '').toUpperCase()}`,
  addNeededKey: () => {},
  removeNeededKey: () => {},
}));

// Mock color tint: getRasterTintClass/getVectorTintClass return CSS class names.
vi.mock('./rendering/ColorTint', () => ({
  parseColor: () => [0, 0, 0] as [number, number, number],
  getRasterTintClass: () => '',
  getVectorTintClass: () => '',
  getTintFilterId: () => 'tint-000000',
  getFeColorMatrixValues: () => '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0',
}));

vi.mock('./api/Bridge', () => ({
  getConfig: () => ({
    figure: '', gender: '', rawFigure: undefined, rawGender: undefined,
    assetsPath: undefined, postUrl: '', postEnabled: false,
    postFigure: 'figure', postGender: 'gender',
    container: 'test-container', localizationUrl: undefined,
  }),
  sendFigure: () => {},
  sendAllowedToProceed: () => {},
  submitFormPost: () => {},
  sendSubmit: () => {},
}));

describe('AvatarEditor (App)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders the root container with correct dimensions', async () => {
    const screen = render(() => <AvatarEditor />);
    const root = screen.container.firstElementChild as HTMLElement;
    expect(root).toBeTruthy();
    // Computed styles come from CSS module + layout vars
    const computed = getComputedStyle(root);
    expect(computed.overflow).toBe('hidden');
  });

  it('shows loading screen initially', () => {
    const screen = render(() => <AvatarEditor />);
    // Query by computed style — loading screen container has display: flex + justify-content: center
    const flexDiv = Array.from(screen.container.querySelectorAll('div'))
      .find(d => getComputedStyle(d).justifyContent === 'center');
    expect(flexDiv).toBeTruthy();
  });

  it('shows editor UI after loading completes', async () => {
    vi.useRealTimers();
    const screen = render(() => <AvatarEditor />);

    // Wait for onMount async operations to complete
    // loadAtlas, vectorizeSprites, vectorizeUI are mocked to resolve immediately
    // MIN_LOADING_MS = 3000 but we need real timers for the async/await chain
    await new Promise(resolve => setTimeout(resolve, 3200));

    // After loading, gender selector labels should be visible
    const spans = screen.container.querySelectorAll('span');
    const texts = Array.from(spans).map(s => s.textContent);
    expect(texts).toContain('boy');
    expect(texts).toContain('girl');
  });
});
