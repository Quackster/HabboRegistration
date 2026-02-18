import { CANVAS_WIDTH, CANVAS_HEIGHT, BACKGROUND_Y } from "../config";
import { getUIAsset } from "../rendering/UIAssets";
import { drawRegion } from "../rendering/Atlas";

export function drawBackground(ctx: CanvasRenderingContext2D): void {
  // Clear entire canvas (transparent, so container background shows through)
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw original background panel image
  const bg = getUIAsset("background");
  if (bg) {
    drawRegion(ctx, bg, 0, BACKGROUND_Y);
  }
}
