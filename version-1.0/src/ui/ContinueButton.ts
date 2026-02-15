import { CONTINUE_X, CONTINUE_Y, CONTINUE_DELAY } from '../config';
import { getText } from '../data/Localization';
import { getUIAsset } from '../rendering/UIAssets';
import { addHitRegion, removeHitRegions } from './HitRegion';

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
      id: 'continue',
      onClick: () => {
        if (isActive) {
          onContinue();
          isActive = false;
          removeHitRegions('continue');
        }
      },
    });
  }, CONTINUE_DELAY);
}

export function drawContinueButton(ctx: CanvasRenderingContext2D): void {
  ctx.save();
  ctx.globalAlpha = isActive ? 1.0 : 0.5;

  const btnImg = getUIAsset('continueBtn');
  if (btnImg) {
    ctx.drawImage(btnImg, CONTINUE_X, CONTINUE_Y);
  }

  // Draw text label on top
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 11px Verdana';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(getText('continue'), CONTINUE_X + 108 / 2, CONTINUE_Y + 19 / 2);
  ctx.restore();
}

export function isButtonActive(): boolean {
  return isActive;
}
