import { BadgeLayer } from '../model/BadgeLayer';
import { getSymbol, getBase, getSymbolBounds } from './SpriteLoader';
import type { SpriteBounds } from './SpriteLoader';
import { tintImage } from './ColorTint';
import { getColorHex } from '../data/ExternalData';
import { SPRITE_SIZE } from '../config';

/**
 * Position mapping (1-9) using the original SWF bounds-based algorithm
 * from PreviewSetMc.setGfxPosition().
 *
 * Uses the visual bounding box of the symbol (non-transparent pixels)
 * to compute offsets that align the visible content to the edges/center
 * of the canvasSize reference area (39x39 canvas_rect).
 */
export function getPositionOffset(
  position: number,
  bounds: SpriteBounds,
  canvasSize: number
): { dx: number; dy: number } {
  const col = (position - 1) % 3; // 0=left, 1=center, 2=right
  const row = Math.floor((position - 1) / 3); // 0=top, 1=middle, 2=bottom

  let dx = 0;
  let dy = 0;

  // Horizontal: shift visible content to left edge, center, or right edge
  if (col === 0) dx = -bounds.xMin;
  else if (col === 2) dx = -(bounds.xMax - canvasSize);

  // Vertical: shift visible content to top edge, center, or bottom edge
  if (row === 0) dy = -bounds.yMin;
  else if (row === 2) dy = -(bounds.yMax - canvasSize);

  return { dx, dy };
}

/** Render a single layer's tinted sprite to a canvas context */
export function renderLayer(
  ctx: CanvasRenderingContext2D,
  layer: BadgeLayer,
  cx: number,
  cy: number,
  canvasW: number,
  canvasH: number,
  applyPosition: boolean
): void {
  if (!layer.visible || layer.symbolNum <= 0) return;

  const sprite =
    layer.type === 'base'
      ? getBase(layer.symbolNum)
      : getSymbol(layer.symbolNum);
  if (!sprite) return;

  const hex = getColorHex(layer.colorIndex);
  const tinted = tintImage(sprite, hex);

  // No centering offset needed: sprite regPt (20,20) and preview_layer regPt (20,20)
  // are identical, so PNG top-lefts align when placed at the same origin.
  let dx = 0;
  let dy = 0;
  if (applyPosition && layer.type === 'symbol') {
    const bounds = getSymbolBounds(layer.symbolNum);
    if (bounds) {
      const offset = getPositionOffset(layer.position, bounds, SPRITE_SIZE);
      dx = offset.dx;
      dy = offset.dy;
    }
  }

  ctx.drawImage(tinted, cx + dx, cy + dy);
}

/** Render all layers composited into a badge preview */
export function renderBadgePreview(
  ctx: CanvasRenderingContext2D,
  layers: BadgeLayer[],
  x: number,
  y: number,
  canvasW: number,
  canvasH: number
): void {
  // Clip to the preview area so positioned sprites don't overflow
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, canvasW, canvasH);
  ctx.clip();

  // Draw base first (layer 4)
  renderLayer(ctx, layers[4], x, y, canvasW, canvasH, false);

  // Draw symbol layers on top (0-3)
  for (let i = 0; i < 4; i++) {
    renderLayer(ctx, layers[i], x, y, canvasW, canvasH, true);
  }

  ctx.restore();
}
