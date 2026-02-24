// SWF stage dimensions
export const CANVAS_W = 520;
export const CANVAS_H = 353;

// Original SWF frame rate
export const SWF_FPS = 36;

// DefineSprite_102 animation loop range
// DoAction in frame_1195 calls gotoAndPlay(1)
export const LOOP_START = 1;
export const LOOP_END = 1195;
export const TOTAL_SPRITE_FRAMES = 1636;

// DefineSprite_102 PNG bounding box offset in stage coordinates.
// The exported PNGs are 1066×1228. The sprite is placed at (0,0) on the
// 520×353 stage. The PNG's top-left maps to stage position (SPRITE_OFFSET_X,
// SPRITE_OFFSET_Y), derived from the minimum x/y of all content across all
// 1636 frames:
//   min_x = -110  → sprite 75 (charId 74, bounds x[0,520]) placed at x=-110
//   min_y = -537  → sprite 51 (charId 50, bounds y[0,51]) placed at y=-536.55
// Verified: max_x = 956, max_y = 691, PNG size = 1066×1228 ✓
export const SPRITE_OFFSET_X = -285;
export const SPRITE_OFFSET_Y = -537;
export const SPRITE_PNG_W = 1066;
export const SPRITE_PNG_H = 1228;

// Background fill color (shape 1 / shape 3 in the SWF = #69a8dc)
export const BG_COLOR = '#69a8dc';

// How many frames to load before starting playback
export const INITIAL_BATCH = 36;

// Inner transparent window of the frame overlay (decompiled/images/2.png)
// Gold border is 29px on all sides; inner area is 462×295 at (29, 29)
export const FRAME_BORDER = 29;
export const FRAME_INNER_X = FRAME_BORDER;
export const FRAME_INNER_Y = FRAME_BORDER;
export const FRAME_INNER_W = CANVAS_W - FRAME_BORDER * 2; // 462
export const FRAME_INNER_H = CANVAS_H - FRAME_BORDER * 2; // 295

// Atlas packing constants (build-time crop: left=314, top=566, w=462, h=295)
export const FRAMES_PER_ATLAS = 100;
export const ATLAS_COLS = 10;
export const ATLAS_FRAME_W = FRAME_INNER_W; // 462
export const ATLAS_FRAME_H = FRAME_INNER_H; // 295
export const ATLAS_COUNT = Math.ceil((LOOP_END - LOOP_START + 1) / FRAMES_PER_ATLAS); // 12

// Default widget config
export const DEFAULT_CONTAINER = 'home-landingpage-container';
export const DEFAULT_ASSETS_PATH = './';
