import { UIAssets } from './UIAssets';
import { HitRegionManager } from './HitRegion';
import { EventBus } from '../model/EditorState';
import { Figure } from '../model/Figure';
import { AvatarRenderer } from '../rendering/AvatarRenderer';
import { AVATAR_DISPLAY_X, AVATAR_DISPLAY_Y, AVATAR_SCALE } from '../config';

export class AvatarDisplay {
  private uiAssets: UIAssets;
  private hitRegions: HitRegionManager;
  private eventBus: EventBus;
  private avatarRenderer: AvatarRenderer;

  private direction: number;
  private figure: Figure;

  constructor(
    uiAssets: UIAssets,
    hitRegions: HitRegionManager,
    eventBus: EventBus,
    avatarRenderer: AvatarRenderer,
    figure: Figure,
    direction: number
  ) {
    this.uiAssets = uiAssets;
    this.hitRegions = hitRegions;
    this.eventBus = eventBus;
    this.avatarRenderer = avatarRenderer;
    this.figure = figure;
    this.direction = direction;
  }

  setFigure(figure: Figure): void {
    this.figure = figure;
  }

  setDirection(direction: number): void {
    this.direction = direction;
  }

  getDirection(): number {
    return this.direction;
  }

  rotateNext(): void {
    this.direction--;
    if (this.direction < 0) this.direction = 7;
  }

  rotatePrev(): void {
    this.direction++;
    if (this.direction > 7) this.direction = 0;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.hitRegions.removeByPrefix('avatar_');

    // Draw floor tile
    const floorTile = this.uiAssets.get('floorTile');
    if (floorTile) {
      ctx.drawImage(floorTile, AVATAR_DISPLAY_X + 5, AVATAR_DISPLAY_Y + 165);
    }

    // Draw avatar
    this.avatarRenderer.drawAvatarToCanvas(
      ctx,
      this.figure,
      this.direction,
      AVATAR_DISPLAY_X,
      AVATAR_DISPLAY_Y,
      AVATAR_SCALE
    );

    // Draw rotation arrows
    const leftArrow = this.uiAssets.get('rotateArrowLeft');
    const rightArrow = this.uiAssets.get('rotateArrowRight');

    const arrowY = AVATAR_DISPLAY_Y + 100;

    if (leftArrow) {
      const lx = AVATAR_DISPLAY_X - 20;
      ctx.drawImage(leftArrow, lx, arrowY);
      this.hitRegions.add({
        id: 'avatar_rotateLeft',
        x: lx,
        y: arrowY,
        width: leftArrow.width,
        height: leftArrow.height,
        cursor: 'pointer',
        onClick: () => {
          this.rotateNext();
          this.eventBus.emit('stateChanged');
        },
      });
    }

    if (rightArrow) {
      const rx = AVATAR_DISPLAY_X + 128 + 10;
      ctx.drawImage(rightArrow, rx, arrowY);
      this.hitRegions.add({
        id: 'avatar_rotateRight',
        x: rx,
        y: arrowY,
        width: rightArrow.width,
        height: rightArrow.height,
        cursor: 'pointer',
        onClick: () => {
          this.rotatePrev();
          this.eventBus.emit('stateChanged');
        },
      });
    }
  }
}
