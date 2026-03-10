// Avatar rendering
export const FLIP_LIST = [0, 1, 2, 3, 2, 1, 0, 7];

// Depth-ordered sub-parts for rendering
export const RENDER_ORDER = ['li', 'lh', 'ls', 'bd', 'sh', 'lg', 'ch', 'hd', 'fc', 'ey', 'hr', 'ri', 'rh', 'rs'];

// Main editable part types (figure string order)
export const PART_TYPES = ['hr', 'hd', 'ch', 'lg', 'sh'] as const;

// Human-readable labels for avatar body part codes (used in alt text for accessibility).
export const PART_LABELS: Record<string, string> = {
  li: 'Left item', lh: 'Left hand', ls: 'Left sleeve',
  bd: 'Body', sh: 'Shoes', lg: 'Legs', ch: 'Chest',
  hd: 'Head', fc: 'Face', ey: 'Eyes', hr: 'Hair',
  ri: 'Right item', rh: 'Right hand', rs: 'Right sleeve',
};

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

// Continue button delay
export const CONTINUE_DELAY = 3000; // ms before activation

// Randomize button cooldown — 3s with visual grey-out (opacity 0.5) to prevent rapid-fire clicks.
export const RANDOMIZE_COOLDOWN = 3000; // ms between allowed clicks

// Gender selector cooldown — 3s with visual grey-out (opacity 0.5) to prevent rapid gender toggling.
export const GENDER_COOLDOWN = 3000; // ms between allowed clicks

// Global click throttle — any button click disables ALL buttons for 1s with opacity 0.5.
// All buttons participate: gender, part nav, color palette, rotation, randomize, continue.
export const CLICK_THROTTLE = 1000; // ms global cooldown after any button click

// Default figure
export const DEFAULT_FIGURE = '1750118022210132810129003';
export const DEFAULT_GENDER = 'M';
