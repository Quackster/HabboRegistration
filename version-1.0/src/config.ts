// Canvas dimensions (matching original SWF)
export const CANVAS_WIDTH = 406;
export const CANVAS_HEIGHT = 327;

// Avatar rendering
export const AVATAR_X = 104;
export const AVATAR_Y = 226;
export const FLIP_WIDTH = 68;
export const FLIP_LIST = [0, 1, 2, 3, 2, 1, 0, 7];

// Depth-ordered sub-parts for rendering
export const RENDER_ORDER = ['li', 'lh', 'ls', 'bd', 'sh', 'lg', 'ch', 'hd', 'fc', 'ey', 'hr', 'ri', 'rh', 'rs'];

// Main editable part types (figure string order)
export const PART_TYPES = ['hr', 'hd', 'ch', 'lg', 'sh'] as const;

// Walk-animated elements
export const WALK_ELEMENTS = ['li', 'lh', 'ls', 'bd', 'sh', 'lg', 'ri', 'rh', 'rs'];
export const HEAD_ELEMENTS = ['hd', 'hr', 'ey', 'fc'];

// Action → affected sub-parts mapping
export const ACTION_PARTS: Record<string, string[]> = {
  wlk: ['bd', 'lg', 'lh', 'rh', 'ls', 'rs', 'sh'],
  sit: ['bd', 'lg', 'sh'],
  lay: [...RENDER_ORDER],
  wav: ['ls', 'lh'],
  spk: ['fc', 'hd', 'hr'],
  crr: ['rs', 'rh', 'ri'],
  cri: ['rs', 'rh', 'ri'],
};

// Animation frame counts
export const WALK_FRAMES = 4;
export const ANIMATION_INTERVAL = 150; // ms per walk frame

// Layout positions
export const BACKGROUND_Y = 44;

// Gender buttons
export const GENDER_BOY_X = 136;
export const GENDER_GIRL_X = 186;
export const GENDER_Y = 20;
export const GENDER_LABEL_Y = 2;

// Part navigation arrows
export const PART_ARROW_LEFT_X = 0;
export const PART_ARROW_RIGHT_X = 64;
export const PART_ARROW_START_Y = 42;
export const PART_ARROW_SPACING = 45;

// Preview icons
export const PREVIEW_X = 10;
export const PREVIEW_START_Y = 37;
export const PREVIEW_SPACING = 45;
export const PREVIEW_OFFSETS: Record<string, number> = { hr: 82, hd: 76, ch: 53, lg: 32, sh: 21 };

// Rotation arrows
export const ROTATE_PREV_X = 119;
export const ROTATE_NEXT_X = 200;
export const ROTATE_Y = 235;

// Color palette
export const COLOR_PALETTE_X = 265;
export const COLOR_PALETTE_START_Y = 44;
export const COLOR_PALETTE_SPACING = 44;
export const COLORS_PER_PAGE = 16;
export const COLOR_COLS = 8;
export const COLOR_CELL_SIZE = 15;

// Randomize button
export const RANDOMIZE_X = 124;
export const RANDOMIZE_Y = 275;

// Continue button
export const CONTINUE_X = 298;
export const CONTINUE_Y = 308;
export const CONTINUE_DELAY = 3000; // ms before activation

// Default figure
export const DEFAULT_FIGURE = '1750118022210132810129003';
export const DEFAULT_GENDER = 'M';
