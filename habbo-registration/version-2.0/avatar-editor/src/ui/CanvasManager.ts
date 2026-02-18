import { CANVAS_HEIGHT } from '../config';
import { HitRegionManager } from './HitRegion';

export class CanvasManager {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly FRAMES_PER_SECOND: number = 24;
  readonly ANIMATION_INTERVAL: number = 1000 / this.FRAMES_PER_SECOND;
  readonly CALLEE_TIMING_ERROR_TOLERANCE: number = 0.04;
  readonly GARBAGE_COLLECT_TIMEOUT_MILLISECONDS: number = 1000;
  readonly GARBAGE_COLLECT_SWEEP_SECONDS = 2;
  private hitRegions: HitRegionManager;
  private drawCallback: (() => void) | null = null;
  private animationFrameIds: Map<number, Temporal.Instant>;
  private animationActive: boolean;
  private lastAnimationTimestamp: Temporal.Duration;
  private canvasWidth: number;
  private garbageCollectTimer: number;

  constructor(container: HTMLElement, hitRegions: HitRegionManager, width: number) {
    this.hitRegions = hitRegions;
    this.canvasWidth = width;

    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = CANVAS_HEIGHT;
    this.canvas.style.display = 'block';
    this.ctx = this.canvas.getContext('2d')!;

    this.animationFrameIds = new Map<number, Temporal.Instant>();
    this.animationActive = false;
    this.lastAnimationTimestamp = Temporal.Duration.from({ milliseconds: 0 });
    this.garbageCollectTimer = this.startAnimationFramesGarbageCollector();

    container.appendChild(this.canvas);
    this.setupEventListeners();
  }

  setDrawCallback(callback: () => void): void {
    this.drawCallback = callback;
  }

  requestRedraw(): void {
    this.redraw();
  }

  startAnimationLoop(): void {
    this.animationActive = true;
    this.redraw();
  }

  stopAnimationLoop(): void {
    this.animationActive = false;
    this.redraw();
  }

  private redraw(): void {
    const cb = (now: DOMHighResTimeStamp) => {
      // Only render once if no animation in-progress
      if (this.animationActive === false) {
        this.renderFrame();
        return;
      }

      // Continuous throttled loop if animation is being shown
      const nowAsDuration = Temporal.Duration.from({ milliseconds: Math.trunc(now) });
      const delta = nowAsDuration.subtract(this.lastAnimationTimestamp);

      if (delta.milliseconds >= this.ANIMATION_INTERVAL - this.CALLEE_TIMING_ERROR_TOLERANCE) {
        const nextTimepoint = now - delta.milliseconds % this.ANIMATION_INTERVAL;
        this.lastAnimationTimestamp = Temporal.Duration.from({ milliseconds: Math.trunc(nextTimepoint) });
        this.renderFrame();
      }

      const innerId = requestAnimationFrame(cb);
      const innerTimestamp = Temporal.Now.instant();
      this.animationFrameIds.set(innerId, innerTimestamp);
    };

    const outerId = requestAnimationFrame(cb);
    const outerTimestamp = Temporal.Now.instant();
    this.animationFrameIds.set(outerId, outerTimestamp);
  }

  private startAnimationFramesGarbageCollector(): number {
    return setInterval(() => { this.garbageCollectAnimationFrames() }, this.GARBAGE_COLLECT_TIMEOUT_MILLISECONDS);
  }

  private garbageCollectAnimationFrames() {
    let markedFrameIds: Set<number> = new Set<number>();

    // Mark animation frames that have a lifetime >= GARBAGE_COLLECT_SWEEP_SECONDS for garbage collection
    this.animationFrameIds.forEach((created: Temporal.Instant, frameId: number) => {
      const now = Temporal.Now.instant();
      const duration = now.since(created, { smallestUnit: "second" });
      if (duration.seconds >= this.GARBAGE_COLLECT_SWEEP_SECONDS) {
        markedFrameIds.add(frameId);
      }
    });

    const numInFlight: number = this.animationFrameIds.size;
    const numSweepCandidates: number = markedFrameIds.size;

    if (numInFlight > 0 || numSweepCandidates > 0) {
      console.info(`[CanvasManager] Garbage collecting animation frames! In-flight: ${numInFlight}, candidates to sweep: ${numSweepCandidates}`);
    }

    // Sweep the animation frames from browser/GPU memory
    markedFrameIds.forEach((frameId) => {
      cancelAnimationFrame(frameId);
      this.animationFrameIds.delete(frameId);
    });

    if (numSweepCandidates > 0) {
      // const sweptAsStr = markedFrameIds.keys().toArray().join(",");
      console.info(`[CanvasManager] Swept ${numSweepCandidates} candidate(s) from browser/GPU memory!`);
      // console.debug(`[CanvasManager] These are the candidates that have been swept: ${sweptAsStr}`);
    }
  }

  private renderFrame(): void {
    this.clear();
    this.drawCallback?.();
  }

  private clear(): void {
    // Flash stage background is white
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.canvasWidth, CANVAS_HEIGHT);
  }

  private getCanvasCoords(e: MouseEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvasWidth / rect.width;
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
