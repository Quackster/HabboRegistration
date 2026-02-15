import { UIAssets } from './UIAssets';
import { HitRegionManager } from './HitRegion';
import { EventBus } from '../model/EditorState';
import { LocalizationConfig, RANDOMIZE_X, RANDOMIZE_Y, CLOUD_AREA_X, CLOUD_AREA_WIDTH, CLOUD_AREA_Y, CLOUD_AREA_HEIGHT } from '../config';

const COOLDOWN_MS = 1000;

// Cloud animation — matches original Flash AvatarEditorUi.as
const CLOUD_DURATION_MS = 700;
const CLOUD_SPAWN_WINDOW_MS = 350;
const CLOUD_SPAWN_INTERVAL_MS = 40;
const CLOUD_FRAME_INTERVAL_MS = 40;
const CLOUD_FRAME_COUNT = 13;

interface Cloud {
  x: number;
  y: number;
  startTime: number;
}

export class RandomizeButton {
  private uiAssets: UIAssets;
  private hitRegions: HitRegionManager;
  private eventBus: EventBus;
  private localization: LocalizationConfig;
  private displayX: number;

  private enabled = true;
  private cooldownTimer: number | null = null;

  // Cloud animation state
  private clouds: Cloud[] = [];
  private cloudAnimationStart = 0;
  private cloudAnimationEnd = 0;
  private animating = false;
  private cloudFrames: HTMLImageElement[] = [];
  private nextSpawnIndex = 0;

  constructor(
    uiAssets: UIAssets,
    hitRegions: HitRegionManager,
    eventBus: EventBus,
    localization: LocalizationConfig,
    displayX: number
  ) {
    this.uiAssets = uiAssets;
    this.hitRegions = hitRegions;
    this.eventBus = eventBus;
    this.localization = localization;
    this.displayX = displayX;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.hitRegions.removeByPrefix('randomize_');

    const bg = this.uiAssets.get('randomizeButtonBg');
    if (bg) {
      ctx.drawImage(bg, RANDOMIZE_X, RANDOMIZE_Y);

      // Draw "Randomize" text centered on button
      ctx.save();
      ctx.font = 'bold 11px Verdana';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        this.localization.randomize,
        RANDOMIZE_X + bg.width / 2,
        RANDOMIZE_Y + bg.height / 2
      );
      ctx.restore();

      this.hitRegions.add({
        id: 'randomize_btn',
        x: RANDOMIZE_X,
        y: RANDOMIZE_Y,
        width: bg.width,
        height: bg.height,
        cursor: this.enabled ? 'pointer' : 'default',
        onClick: () => this.handleClick(),
      });
    }
  }

  drawClouds(ctx: CanvasRenderingContext2D): void {
    if (!this.animating) return;

    const now = Date.now();

    // End animation
    if (now >= this.cloudAnimationEnd) {
      this.animating = false;
      this.clouds = [];
      return;
    }

    // Spawn clouds deterministically: one per CLOUD_SPAWN_INTERVAL_MS during spawn window
    const elapsed = now - this.cloudAnimationStart;
    if (elapsed < CLOUD_SPAWN_WINDOW_MS) {
      const expectedCount = Math.floor(elapsed / CLOUD_SPAWN_INTERVAL_MS) + 1;
      while (this.nextSpawnIndex < expectedCount) {
        this.clouds.push({
          x: CLOUD_AREA_X + Math.random() * CLOUD_AREA_WIDTH,
          y: CLOUD_AREA_Y + Math.random() * CLOUD_AREA_HEIGHT,
          startTime: now,
        });
        this.nextSpawnIndex++;
      }
    }

    // Draw each cloud at its current frame
    if (this.cloudFrames.length === 0) return;

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    for (const cloud of this.clouds) {
      const frameIndex = Math.floor((now - cloud.startTime) / CLOUD_FRAME_INTERVAL_MS);
      if (frameIndex >= CLOUD_FRAME_COUNT) continue;
      const frame = this.cloudFrames[frameIndex];
      if (frame) {
        ctx.drawImage(frame, cloud.x, cloud.y);
      }
    }
    ctx.restore();
  }

  isAnimating(): boolean {
    return this.animating;
  }

  private handleClick(): void {
    if (!this.enabled) return;

    this.enabled = false;
    this.cooldownTimer = window.setTimeout(() => {
      this.enabled = true;
      this.cooldownTimer = null;
    }, COOLDOWN_MS);

    // Cache cloud frames
    this.cloudFrames = this.uiAssets.getCloudFrames();

    // Start cloud animation
    this.animating = true;
    this.cloudAnimationStart = Date.now();
    this.cloudAnimationEnd = this.cloudAnimationStart + CLOUD_DURATION_MS;
    this.clouds = [];
    this.nextSpawnIndex = 0;

    this.eventBus.emit('randomizeAvatar');
  }
}
