import { PART_TYPES, PART_ARROW_LEFT_X, PART_ARROW_RIGHT_X, PART_ARROW_START_Y, PART_ARROW_SPACING } from '../config';
import { getUIAsset } from '../rendering/UIAssets';
import { drawRegion } from '../rendering/Atlas';
import { addHitRegion } from './HitRegion';

export function setupPartNavigator(onNavigate: (partType: string, dir: 'prev' | 'next') => void): void {
  for (let i = 0; i < PART_TYPES.length; i++) {
    const y = PART_ARROW_START_Y + i * PART_ARROW_SPACING;
    const part = PART_TYPES[i];

    // Left arrow (prev)
    addHitRegion({
      x: PART_ARROW_LEFT_X,
      y,
      width: 25,
      height: 29,
      id: 'partNav',
      onClick: () => onNavigate(part, 'prev'),
    });

    // Right arrow (next)
    addHitRegion({
      x: PART_ARROW_RIGHT_X,
      y,
      width: 25,
      height: 29,
      id: 'partNav',
      onClick: () => onNavigate(part, 'next'),
    });
  }
}

export function drawPartNavigator(ctx: CanvasRenderingContext2D): void {
  const arrowLeft = getUIAsset('arrowLeft');
  const arrowRight = getUIAsset('arrowRight');

  for (let i = 0; i < PART_TYPES.length; i++) {
    const y = PART_ARROW_START_Y + i * PART_ARROW_SPACING;

    if (arrowLeft) drawRegion(ctx, arrowLeft, PART_ARROW_LEFT_X, y);
    if (arrowRight) drawRegion(ctx, arrowRight, PART_ARROW_RIGHT_X, y);
  }
}
