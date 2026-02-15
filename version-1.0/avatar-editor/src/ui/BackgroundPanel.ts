import { CANVAS_WIDTH, CANVAS_HEIGHT, BACKGROUND_Y } from '../config';
import { getUIAsset } from '../rendering/UIAssets';

export function drawBackground(ctx: CanvasRenderingContext2D): void {
  // Clear entire canvas
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw original background panel image
  const bg = getUIAsset('background');
  if (bg) {
    ctx.drawImage(bg, 0, BACKGROUND_Y);
  }
}
