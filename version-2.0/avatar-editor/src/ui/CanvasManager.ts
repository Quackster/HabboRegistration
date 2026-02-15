import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config';
import { HitRegionManager } from './HitRegion';

export class CanvasManager {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  private hitRegions: HitRegionManager;
  private drawCallback: (() => void) | null = null;
  private animationFrameId: number | null = null;
  private needsRedraw = true;

  constructor(container: HTMLElement, hitRegions: HitRegionManager) {
    this.hitRegions = hitRegions;

    this.canvas = document.createElement('canvas');
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.canvas.style.display = 'block';
    this.ctx = this.canvas.getContext('2d')!;

    container.appendChild(this.canvas);
    this.setupEventListeners();
  }

  setDrawCallback(callback: () => void): void {
    this.drawCallback = callback;
  }

  requestRedraw(): void {
    this.needsRedraw = true;
  }

  startRenderLoop(): void {
    const loop = () => {
      if (this.needsRedraw) {
        this.needsRedraw = false;
        this.clear();
        this.drawCallback?.();
      }
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  /** Force continuous rendering (for animations) */
  startContinuousRender(): void {
    const loop = () => {
      this.clear();
      this.drawCallback?.();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  stopRenderLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private clear(): void {
    // Flash stage background is white
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  private getCanvasCoords(e: MouseEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  private setupEventListeners(): void {
    this.canvas.addEventListener('click', (e) => {
      const { x, y } = this.getCanvasCoords(e);
      if (this.hitRegions.handleClick(x, y)) {
        this.requestRedraw();
      }
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const { x, y } = this.getCanvasCoords(e);
      const cursor = this.hitRegions.getCursorAt(x, y);
      this.canvas.style.cursor = cursor;
    });
  }
}
