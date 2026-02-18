export const CANVAS_WIDTH = 280;
export const CANVAS_HEIGHT = 366;
export const SYMBOL_COUNT = 67;
export const BASE_COUNT = 24;
export const SPRITE_SIZE = 39;
export const NUM_SYMBOL_LAYERS = 4;
export const NUM_LAYERS = 5; // 4 symbols + 1 base
export const DEFAULT_BADGE = 'b0502Xs13181s01014';

// Background color from SWF SetBackgroundColor tag (r=226, g=226, b=226)
export const BG_COLOR = '#e2e2e2';

/**
 * All positions are extracted from the SWF PlaceObject2 tags (twips/20 = pixels).
 *
 * CRITICAL: Flash places sprites by their registration point (origin), NOT the
 * PNG top-left corner. Every sprite has a regPt that must be subtracted to get
 * the PNG's top-left position.
 *
 * Registration points (where 0,0 falls within the PNG):
 *   346 savebutton      100x18  regPt=(50.0, 9.0)
 *   348 canvas_rect      39x39  regPt=(20.0, 20.0) -- masking rect, NOT displayed
 *   350 preview_layer    40x40  regPt=(20.0, 20.0)
 *   351 preview_screen   40x40  regPt=(20.0, 20.0)
 *   354 preview_center   49x49  regPt=(24.0, 26.0)
 *   357 arrow_left       18x21  regPt=( 9.0, 11.0)
 *   359 arrow_right      18x21  regPt=( 9.0, 11.0)
 *   364 tick_on/off       12x13  regPt=( 6.0,  7.0)
 *   365 preview_set      87x50  regPt=(33.0, 26.5)
 *   370 color_mask        11x11  regPt=( 6.0,  6.0)
 *   373 color_dot          3x3  regPt=( 2.0,  2.0)
 *   374 color_single      15x15  regPt=( 7.0,  7.0)
 *   377 color_pointer     17x17  regPt=( 9.0,  9.0)
 *   378 color_set        129x32  regPt=(65.0, 17.0)
 *   381 position_slot     16x16  regPt=( 8.0,  8.0)
 *   386 position_selector 48x48  regPt=(24.0, 24.0)
 *   406 cancelbutton     100x18  regPt=(50.0, 9.0)
 *   418 background       300x375 regPt=( 0.0,  0.0)
 *   254 symbol_selection  39x39  regPt=(20.0, 20.0)
 *   343 base_selection    39x39  regPt=(20.0, 20.0)
 */

// ── Main timeline positions (sprite ORIGIN, not PNG top-left) ──

// Preview sets: origin pos for preview_set (365) instances
export const PREVIEW_SET_ORIGIN_X = 33;
export const PREVIEW_SET_ORIGIN_Y = [92, 143, 194, 245, 311]; // 0-3=symbols, 4=base

// Color sets: origin pos for color_selector_set (378) instances
export const COLOR_SET_ORIGIN_X = 215;
export const COLOR_SET_ORIGIN_Y = [91, 142, 193, 244, 310];

// Position sets: origin pos for position_selector (386) instances
export const POS_SET_ORIGIN_X = 119;
export const POS_SET_ORIGIN_Y = [90, 140.95, 192, 243]; // symbols only

// Combined preview screen (351): origin at (32, 22)
export const PREVIEW_SCREEN_ORIGIN_X = 44;
export const PREVIEW_SCREEN_ORIGIN_Y = 22;

// Buttons: origin positions
export const SAVE_BUTTON_ORIGIN_X = 50;
export const SAVE_BUTTON_ORIGIN_Y = 354;
export const CANCEL_BUTTON_ORIGIN_X = 230;
export const CANCEL_BUTTON_ORIGIN_Y = 354;

// Background (418): origin at (-1, 0.5)
export const BG_ORIGIN_X = -1;
export const BG_ORIGIN_Y = 0.5;

// Text label positions (origin pos from SWF text fields)
export const DESCRIPTION_TXT_X = 95;
export const DESCRIPTION_TXT_Y = 2;
export const SYMBOLS_HEADER_X = 20.4;
export const SYMBOLS_HEADER_Y = 50;
export const POSITION_HEADER_X = 96;
export const POSITION_HEADER_Y = 50;
export const COLOURS_HEADER_X = 152.2;
export const COLOURS_HEADER_Y = 50;
export const BASE_HEADER_X = 21.2;
export const BASE_HEADER_Y = 269.95;
export const BASE_COLOURS_HEADER_X = 152.2;
export const BASE_COLOURS_HEADER_Y = 269.95;
export const SAVE_BTN_TEXT_X = 2;
export const SAVE_BTN_TEXT_Y = 346.95;
export const CANCEL_BTN_TEXT_X = 182;
export const CANCEL_BTN_TEXT_Y = 346.95;

// ── Registration points (origin within PNG) ──

export const REG_SAVEBUTTON = { x: 50, y: 9 };
export const REG_CANCELBUTTON = { x: 50, y: 9 };
export const REG_PREVIEW_LAYER = { x: 20, y: 20 };
export const REG_PREVIEW_SCREEN = { x: 20, y: 20 };
export const REG_PREVIEW_CENTER = { x: 24, y: 26 };
export const REG_ARROW_LEFT = { x: 9, y: 11 };
export const REG_ARROW_RIGHT = { x: 9, y: 11 };
export const REG_TICK = { x: 6, y: 7 };
export const REG_COLOR_SINGLE = { x: 7, y: 7 };
export const REG_COLOR_MASK = { x: 6, y: 6 };
export const REG_COLOR_POINTER = { x: 9, y: 9 };
export const REG_COLOR_SET = { x: 65, y: 17 };
export const REG_POS_SLOT = { x: 8, y: 8 };
export const REG_POS_SELECTOR = { x: 24, y: 24 };
export const REG_SYMBOL = { x: 20, y: 20 };
export const REG_BASE = { x: 20, y: 20 };

// ── preview_set (365) child origin offsets from parent origin ──
export const PSET_CENTER_X = 10;
export const PSET_CENTER_Y = 0;
export const PSET_ARROW_L_X = -24;
export const PSET_ARROW_L_Y = -1;
export const PSET_ARROW_R_X = 45;
export const PSET_ARROW_R_Y = -1;
export const PSET_CANVAS_X = 11;   // where the symbol/base sprite origin goes
export const PSET_CANVAS_Y = -1;
export const PSET_TICK_X = -23;
export const PSET_TICK_Y = -19.5;

// ── color_selector_set (378) child origin offsets ──
// 18 color cells in 2 rows of 9, each color_selector_single (374) is 15x15
export const CSET_SPACING = 14;
export const CSET_ROW1_Y = -7;   // y origin for colors 1-9
export const CSET_ROW2_Y = 7;    // y origin for colors 10-18
export const CSET_FIRST_X = -56; // x origin for s1/s10

// ── position_selector (386) child origin offsets ──
// 9 slots (381) in 3x3 grid, 15px spacing
export const PSEL_SLOT_SPACING = 15;
// slot origins: slot1=(-15,-15), slot5=(0,0), slot9=(15,15)
