import { ROTATE_PREV_X, ROTATE_NEXT_X, ROTATE_Y } from '../config';
import { getUIAsset } from '../rendering/UIAssets';
import { drawRegion } from '../rendering/Atlas';
import { addHitRegion } from './HitRegion';

export function setupRotationControls(onRotate: (dir: 'prev' | 'next') => void): void {
  addHitRegion({
    x: ROTATE_PREV_X,
    y: ROTATE_Y,
    width: 28,
    height: 28,
    id: 'rotate',
    onClick: () => onRotate('prev'),
  });

  addHitRegion({
    x: ROTATE_NEXT_X,
    y: ROTATE_Y,
    width: 28,
    height: 28,
    id: 'rotate',
    onClick: () => onRotate('next'),
  });
}

export function drawRotationControls(ctx: CanvasRenderingContext2D): void {
  const rotateLeft = getUIAsset('rotateLeft');
  const rotateRight = getUIAsset('rotateRight');

  if (rotateLeft) drawRegion(ctx, rotateLeft, ROTATE_PREV_X, ROTATE_Y);
  if (rotateRight) drawRegion(ctx, rotateRight, ROTATE_NEXT_X, ROTATE_Y);
}
