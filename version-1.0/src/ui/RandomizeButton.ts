import { RANDOMIZE_X, RANDOMIZE_Y } from '../config';
import { getText } from '../data/Localization';
import { getUIAsset } from '../rendering/UIAssets';
import { addHitRegion } from './HitRegion';

export function setupRandomizeButton(onRandomize: () => void): void {
  // Use actual image dimensions: 95x17
  addHitRegion({
    x: RANDOMIZE_X,
    y: RANDOMIZE_Y,
    width: 95,
    height: 17,
    id: 'randomize',
    onClick: onRandomize,
  });
}

export function drawRandomizeButton(ctx: CanvasRenderingContext2D): void {
  const btnImg = getUIAsset('randomizeBtn');
  if (btnImg) {
    ctx.drawImage(btnImg, RANDOMIZE_X, RANDOMIZE_Y);
  }

  // Draw text label on top
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 11px Verdana';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(getText('randomize'), RANDOMIZE_X + 95 / 2, RANDOMIZE_Y + 17 / 2);
}
