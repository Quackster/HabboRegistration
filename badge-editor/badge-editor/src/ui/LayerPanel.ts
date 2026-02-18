import { BadgeLayer } from '../model/BadgeLayer';
import { getSymbol, getBase, getUI, getSymbolBounds } from '../rendering/SpriteLoader';
import { getPositionOffset } from '../rendering/BadgeRenderer';
import { tintImage } from '../rendering/ColorTint';
import { getColorHex } from '../data/ExternalData';
import { addRegion } from './CanvasManager';
import {
  SYMBOL_COUNT, BASE_COUNT, SPRITE_SIZE,
  PSET_CENTER_X, PSET_CENTER_Y,
  PSET_ARROW_L_X, PSET_ARROW_L_Y,
  PSET_ARROW_R_X, PSET_ARROW_R_Y,
  PSET_CANVAS_X, PSET_CANVAS_Y,
  PSET_TICK_X, PSET_TICK_Y,
  REG_PREVIEW_CENTER, REG_ARROW_LEFT, REG_ARROW_RIGHT,
  REG_TICK, REG_SYMBOL, REG_BASE,
} from '../config';
import { emit, EVT_GRAPHIC_CHANGE, EVT_REDRAW } from '../model/EventBus';

/**
 * Draws a preview_set (sprite 365) at the given parent origin (ox, oy).
 *
 * PNG top-left = parentOrigin + childOriginOffset - childRegPt
 */
export function drawLayerPanel(
  ctx: CanvasRenderingContext2D,
  layer: BadgeLayer,
  layerIndex: number,
  ox: number,
  oy: number
): void {
  const maxNum = layer.type === 'base' ? BASE_COUNT : SYMBOL_COUNT;

  // preview_center (354, 49x49, regPt 24,26)
  const pcImg = getUI('preview_center');
  ctx.drawImage(pcImg,
    ox + PSET_CENTER_X - REG_PREVIEW_CENTER.x,
    oy + PSET_CENTER_Y - REG_PREVIEW_CENTER.y
  );

  // The symbol/base sprite is attached at canvasRect position with its own regPt
  // In the SWF, the symbol_selection movie is placed at (11, -1) with regPt (20, 20)
  const spriteReg = layer.type === 'base' ? REG_BASE : REG_SYMBOL;
  if (layer.visible && layer.symbolNum > 0) {
    const sprite = layer.type === 'base'
      ? getBase(layer.symbolNum)
      : getSymbol(layer.symbolNum);
    if (sprite) {
      const hex = getColorHex(layer.colorIndex);
      const tinted = tintImage(sprite, hex);

      // Compute position offset for symbols
      let dx = 0;
      let dy = 0;
      if (layer.type === 'symbol') {
        const bounds = getSymbolBounds(layer.symbolNum);
        if (bounds) {
          const offset = getPositionOffset(layer.position, bounds, SPRITE_SIZE);
          dx = offset.dx;
          dy = offset.dy;
        }
      }

      // Clip to the canvas_rect area (39x39) to prevent overflow
      const clipX = ox + PSET_CANVAS_X - spriteReg.x;
      const clipY = oy + PSET_CANVAS_Y - spriteReg.y;
      ctx.save();
      ctx.beginPath();
      ctx.rect(clipX, clipY, SPRITE_SIZE, SPRITE_SIZE);
      ctx.clip();

      ctx.drawImage(tinted, clipX + dx, clipY + dy);

      ctx.restore();
    }
  }

  // Left arrow (357, 18x21, regPt 9,11)
  const alImg = getUI('arrow_left');
  const alX = ox + PSET_ARROW_L_X - REG_ARROW_LEFT.x;
  const alY = oy + PSET_ARROW_L_Y - REG_ARROW_LEFT.y;
  ctx.globalAlpha = layer.visible ? 1.0 : 0.4;
  ctx.drawImage(alImg, alX, alY);
  ctx.globalAlpha = 1.0;
  addRegion({
    x: alX, y: alY, w: alImg.width, h: alImg.height,
    onClick: () => {
      if (!layer.visible) return;
      layer.symbolNum--;
      if (layer.symbolNum < 1) layer.symbolNum = maxNum;
      emit(EVT_GRAPHIC_CHANGE, layerIndex);
      emit(EVT_REDRAW);
    },
  });

  // Right arrow (359, 18x21, regPt 9,11)
  const arImg = getUI('arrow_right');
  const arX = ox + PSET_ARROW_R_X - REG_ARROW_RIGHT.x;
  const arY = oy + PSET_ARROW_R_Y - REG_ARROW_RIGHT.y;
  ctx.globalAlpha = layer.visible ? 1.0 : 0.4;
  ctx.drawImage(arImg, arX, arY);
  ctx.globalAlpha = 1.0;
  addRegion({
    x: arX, y: arY, w: arImg.width, h: arImg.height,
    onClick: () => {
      if (!layer.visible) return;
      layer.symbolNum++;
      if (layer.symbolNum > maxNum) layer.symbolNum = 1;
      emit(EVT_GRAPHIC_CHANGE, layerIndex);
      emit(EVT_REDRAW);
    },
  });

  // Tick box / checkbox (364, 12x13, regPt 6,7)
  const tickImg = layer.visible ? getUI('tick_on') : getUI('tick_off');
  const tbX = ox + PSET_TICK_X - REG_TICK.x;
  const tbY = oy + PSET_TICK_Y - REG_TICK.y;
  ctx.drawImage(tickImg, tbX, tbY);
  addRegion({
    x: tbX, y: tbY, w: tickImg.width, h: tickImg.height,
    onClick: () => {
      layer.visible = !layer.visible;
      if (layer.visible && layer.symbolNum <= 0) {
        layer.symbolNum = 1;
      }
      emit(EVT_GRAPHIC_CHANGE, layerIndex);
      emit(EVT_REDRAW);
    },
  });
}
