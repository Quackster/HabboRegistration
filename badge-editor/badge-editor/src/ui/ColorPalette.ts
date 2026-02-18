import { BadgeLayer } from '../model/BadgeLayer';
import { getAllColors } from '../data/ExternalData';
import { getUI } from '../rendering/SpriteLoader';
import { tintImage } from '../rendering/ColorTint';
import { addRegion } from './CanvasManager';
import {
  CSET_SPACING, CSET_ROW1_Y, CSET_ROW2_Y, CSET_FIRST_X,
  REG_COLOR_SINGLE, REG_COLOR_MASK, REG_COLOR_POINTER,
} from '../config';
import { emit, EVT_COLOR_CHANGE, EVT_REDRAW } from '../model/EventBus';

/**
 * Draws a color_selector_set (sprite 378) at the given parent origin (ox, oy).
 *
 * The 378 sprite contains 18 color_selector_single (374) children arranged in
 * 2 rows of 9, and a pointerMc (377) overlay on the selected color.
 *
 * Each child origin is positioned relative to the 378 origin. We apply
 * PNG top-left = parentOrigin + childOriginOffset - childRegPt
 */
export function drawColorPalette(
  ctx: CanvasRenderingContext2D,
  layer: BadgeLayer,
  layerIndex: number,
  ox: number,
  oy: number
): void {
  const colors = getAllColors();
  const singleImg = getUI('color_selector_single');
  const maskImg = getUI('color_mask');
  const pointerImg = getUI('color_pointer');

  for (let i = 0; i < colors.length; i++) {
    const colorIndex = i + 1; // 1-based
    const row = Math.floor(i / 9);
    const col = i % 9;

    // Child origin offset within the 378 sprite (from SWF placements)
    const childOX = CSET_FIRST_X + col * CSET_SPACING;
    const childOY = row === 0 ? CSET_ROW1_Y : CSET_ROW2_Y;

    // PNG top-left for the color_selector_single (374, 15x15, regPt 7,7)
    const cellX = ox + childOX - REG_COLOR_SINGLE.x;
    const cellY = oy + childOY - REG_COLOR_SINGLE.y;

    ctx.globalAlpha = layer.visible ? 1.0 : 0.4;

    // Draw the frame (15x15)
    ctx.drawImage(singleImg, cellX, cellY);

    // Draw the tinted color_mask (11x11, regPt 6,6) at offset (1,1) inside the single
    // In the SWF, maskMc is at (1,1) within the 374 sprite, so its origin is at
    // childOrigin + (1,1). PNG top-left = ... + (1,1) - REG_COLOR_MASK
    const maskX = ox + childOX + 1 - REG_COLOR_MASK.x;
    const maskY = oy + childOY + 1 - REG_COLOR_MASK.y;
    const tinted = tintImage(maskImg, colors[i]);
    ctx.drawImage(tinted, maskX, maskY);

    ctx.globalAlpha = 1.0;

    // Draw pointer on selected color
    if (layer.colorIndex === colorIndex) {
      // pointerMc is positioned at the same origin as the clicked color cell
      // PNG top-left = parentOrigin + childOrigin - pointerRegPt
      const ptrX = ox + childOX - REG_COLOR_POINTER.x;
      const ptrY = oy + childOY - REG_COLOR_POINTER.y;
      ctx.drawImage(pointerImg, ptrX, ptrY);
    }

    // Hit region
    addRegion({
      x: cellX, y: cellY, w: singleImg.width, h: singleImg.height,
      onClick: () => {
        if (!layer.visible) return;
        layer.colorIndex = colorIndex;
        emit(EVT_COLOR_CHANGE, layerIndex, colorIndex);
        emit(EVT_REDRAW);
      },
    });
  }
}
