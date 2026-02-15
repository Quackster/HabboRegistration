import { UIAssets } from './UIAssets';
import { HitRegionManager } from './HitRegion';
import { EventBus } from '../model/EditorState';
import { LocalizationConfig, AVATAR_DISPLAY_X, AVATAR_SCALE, AVATAR_CANVAS_WIDTH } from '../config';

const RANDOMIZE_Y = 46;
const COOLDOWN_MS = 1000;

export class RandomizeButton {
  private uiAssets: UIAssets;
  private hitRegions: HitRegionManager;
  private eventBus: EventBus;
  private localization: LocalizationConfig;

  private enabled = true;
  private cooldownTimer: number | null = null;

  // Cloud animation state
  private clouds: Array<{ x: number; y: number; alpha: number; startTime: number; scale: number }> = [];
  private cloudAnimationEnd = 0;
  private animating = false;

  constructor(
    uiAssets: UIAssets,
    hitRegions: HitRegionManager,
    eventBus: EventBus,
    localization: LocalizationConfig
  ) {
    this.uiAssets = uiAssets;
    this.hitRegions = hitRegions;
    this.eventBus = eventBus;
    this.localization = localization;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.hitRegions.removeByPrefix('randomize_');

    const bg = this.uiAssets.get('randomizeButtonBg');
    if (bg) {
      const avatarCenterX = AVATAR_DISPLAY_X + (AVATAR_CANVAS_WIDTH * AVATAR_SCALE) / 2;
      const RANDOMIZE_X = Math.round(avatarCenterX - bg.width / 2);
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
    if (now >= this.cloudAnimationEnd) {
      this.animating = false;
      this.clouds = [];
      return;
    }

    // Spawn new clouds in the first half of animation
    const elapsed = now - (this.cloudAnimationEnd - 700);
    if (elapsed < 350 && Math.random() < 0.3) {
      this.clouds.push({
        x: 325 + Math.random() * 80,
        y: 85 + Math.random() * 180,
        alpha: 1,
        startTime: now,
        scale: 0.5 + Math.random() * 1.5,
      });
    }

    // Draw clouds with fading and random sizes
    const cloudImg = this.uiAssets.get('cloudAnimation');
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    for (const cloud of this.clouds) {
      const age = now - cloud.startTime;
      const alpha = Math.max(0, 1 - age / 500);
      if (alpha <= 0) continue;

      ctx.globalAlpha = alpha;
      if (cloudImg) {
        const w = cloudImg.width * cloud.scale;
        const h = cloudImg.height * cloud.scale;
        ctx.drawImage(cloudImg, cloud.x, cloud.y, w, h);
      } else {
        // Fallback cloud
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(cloud.x + 10, cloud.y + 10, 10 * cloud.scale, 0, Math.PI * 2);
        ctx.fill();
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

    // Start cloud animation
    this.animating = true;
    this.cloudAnimationEnd = Date.now() + 700;
    this.clouds = [];

    this.eventBus.emit('randomizeAvatar');
  }
}
