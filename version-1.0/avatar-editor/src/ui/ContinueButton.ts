import { CONTINUE_X, CONTINUE_Y, CONTINUE_DELAY } from "../config";
import { getText } from "../data/Localization";
import { getUIAsset } from "../rendering/UIAssets";
import { addHitRegion } from "./HitRegion";

let isActive = false;

export function setupContinueButton(onContinue: () => void): void {
  isActive = false;

  // Activate after delay
  setTimeout(() => {
    isActive = true;
    // Use actual image dimensions: 108x19
    addHitRegion({
      x: CONTINUE_X,
      y: CONTINUE_Y,
      width: 108,
      height: 19,
      id: "continue",
      onClick: () => {
        if (isActive) {
          onContinue();
          isActive = false;
          setTimeout(() => {
            isActive = true;
          }, CONTINUE_DELAY);
        }
      },
    });
  }, CONTINUE_DELAY);
}

export function drawContinueButton(ctx: CanvasRenderingContext2D): void {
  ctx.save();
  ctx.globalAlpha = isActive ? 1.0 : 0.5;

  const btnImg = getUIAsset("continueBtn");
  if (btnImg) {
    ctx.drawImage(btnImg, CONTINUE_X, CONTINUE_Y);
  }

  // Draw text label on top (double-draw to match Flash's bold rendering)
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "normal 12px Verdana";
  ctx.letterSpacing = "0.6px";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const label = getText("continue");
  const tx = CONTINUE_X + 108 / 2;
  const ty = CONTINUE_Y + 21 / 2;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(label, tx, ty);
  ctx.globalAlpha = 0.7;
  ctx.fillText(label, tx, ty);
  ctx.restore();
}

export function isButtonActive(): boolean {
  return isActive;
}
