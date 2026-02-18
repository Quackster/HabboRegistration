import { BadgeLayer } from '../model/BadgeLayer';
import { getUI } from '../rendering/SpriteLoader';
import { addRegion } from './CanvasManager';
import { PSEL_SLOT_SPACING, REG_POS_SELECTOR, REG_POS_SLOT } from '../config';
import { emit, EVT_POSITION_CHANGE, EVT_REDRAW } from '../model/EventBus';

/**
 * Draws a position_selector (sprite 386) at the given parent origin (ox, oy).
 *
 * Contains a 48x48 background (regPt 24,24), 9 slots (381, 16x16, regPt 8,8)
 * in a 3x3 grid at 15px spacing centered on origin, and a selectorMc overlay.
 *
 * Slot child origins: slot1=(-15,-15) slot2=(0,-15) ... slot5=(0,0) ... slot9=(15,15)
 */
export function drawPositionGrid(
  ctx: CanvasRenderingContext2D,
  layer: BadgeLayer,
  layerIndex: number,
  ox: number,
  oy: number
): void {
  if (layer.type === 'base') return;

  // Draw position_selector background (48x48, regPt 24,24)
  // The background shape (383) is placed at (0,0) within the sprite,
  // and the sprite border (385) is also at (0,0)
  const bgImg = getUI('position_selector');
  ctx.drawImage(bgImg, ox - REG_POS_SELECTOR.x, oy - REG_POS_SELECTOR.y);

  const slotImg = getUI('position_slot');

  ctx.globalAlpha = layer.visible ? 1.0 : 0.4;

  // In the SWF, slot1-slot9 all have alphaMult=0 (invisible).
  // They only serve as click targets. Only selectorMc is visible.
  for (let pos = 1; pos <= 9; pos++) {
    const col = (pos - 1) % 3; // 0, 1, 2
    const row = Math.floor((pos - 1) / 3); // 0, 1, 2

    const slotOX = (col - 1) * PSEL_SLOT_SPACING;
    const slotOY = (row - 1) * PSEL_SLOT_SPACING;

    const sx = ox + slotOX - REG_POS_SLOT.x;
    const sy = oy + slotOY - REG_POS_SLOT.y;

    // Register clickable region (slots are invisible but clickable)
    addRegion({
      x: sx, y: sy, w: slotImg.width, h: slotImg.height,
      onClick: () => {
        if (!layer.visible) return;
        layer.position = pos;
        emit(EVT_POSITION_CHANGE, layerIndex, pos);
        emit(EVT_REDRAW);
      },
    });
  }

  // Draw selectorMc: the position_slot sprite at the selected position only
  if (layer.visible && layer.symbolNum > 0) {
    const selCol = (layer.position - 1) % 3;
    const selRow = Math.floor((layer.position - 1) / 3);
    const selOX = (selCol - 1) * PSEL_SLOT_SPACING;
    const selOY = (selRow - 1) * PSEL_SLOT_SPACING;
    const selX = ox + selOX - REG_POS_SLOT.x;
    const selY = oy + selOY - REG_POS_SLOT.y;
    ctx.drawImage(slotImg, selX, selY);
  }

  ctx.globalAlpha = 1.0;
}
