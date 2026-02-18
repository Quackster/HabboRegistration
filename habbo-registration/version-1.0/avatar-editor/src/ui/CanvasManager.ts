import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config';
import { handleClick, getCursorAt } from './HitRegion';

const FRAMES_PER_SECOND = 24;
const ANIMATION_INTERVAL = 1000 / FRAMES_PER_SECOND;
const CALLEE_TIMING_ERROR_TOLERANCE = 0.04;
const GARBAGE_COLLECT_TIMEOUT_MILLISECONDS: number = 1000;
const GARBAGE_COLLECT_SWEEP_SECONDS = 2;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let renderCallback: (() => void) | null = null;
let animationFrameIds: Map<number, Temporal.Instant> = new Map<number, Temporal.Instant>();
let lastAnimationTimestamp: Temporal.Duration = Temporal.Duration.from({ milliseconds: 0 });

export function createCanvas(container: HTMLElement): void {
  canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  canvas.style.display = 'block';
  canvas.style.imageRendering = 'pixelated';
  container.appendChild(canvas);
  ctx = canvas.getContext('2d')!;

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    handleClick(x, y);
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    canvas.style.cursor = getCursorAt(x, y);
  });
}

export function getCtx(): CanvasRenderingContext2D {
  return ctx;
}

export function getCanvas(): HTMLCanvasElement {
  return canvas;
}

export function setRenderCallback(cb: () => void): void {
  renderCallback = cb;
}

export function onRedraw() {
  redrawFrame();
}

export function startAnimationFramesGarbageCollector(): number {
  return setInterval(() => { garbageCollectAnimationFrames() }, GARBAGE_COLLECT_TIMEOUT_MILLISECONDS);
}

function garbageCollectAnimationFrames() {
  let markedFrameIds: Set<number> = new Set<number>();

  // Mark animation frames that have a lifetime >= GARBAGE_COLLECT_SWEEP_SECONDS for garbage collection
  animationFrameIds.forEach((created: Temporal.Instant, frameId: number) => {
    const now = Temporal.Now.instant();
    const duration = now.since(created, { smallestUnit: "second" });
    if (duration.seconds >= GARBAGE_COLLECT_SWEEP_SECONDS) {
      markedFrameIds.add(frameId);
    }
  });

  const numInFlight: number = animationFrameIds.size;
  const numSweepCandidates: number = markedFrameIds.size;

  if (numInFlight > 0 || numSweepCandidates > 0) {
    console.info(`[CanvasManager] Garbage collecting animation frames! In-flight: ${numInFlight}, candidates to sweep: ${numSweepCandidates}`);
  }

  // Sweep the animation frames from browser/GPU memory
  markedFrameIds.forEach((frameId) => {
    cancelAnimationFrame(frameId);
    animationFrameIds.delete(frameId);
  });

  if (numSweepCandidates > 0) {
    // const sweptAsStr = markedFrameIds.keys().toArray().join(",");
    console.info(`[CanvasManager] Swept ${numSweepCandidates} animation frames from browser/GPU memory!`);
    // console.debug(`[CanvasManager] These are the candidates that have been swept: ${sweptAsStr}`);
  }
}

function redrawFrame() {
  const id = requestAnimationFrame(renderFrame);
  const timestamp = Temporal.Now.instant();
  animationFrameIds.set(id, timestamp);
}

function renderFrame(now: number) {
  const nowAsDuration = Temporal.Duration.from({ milliseconds: Math.trunc(now) });
  const delta = nowAsDuration.subtract(lastAnimationTimestamp);

  // Throttle rendering to 24 FPS
  if (delta.milliseconds >= ANIMATION_INTERVAL - CALLEE_TIMING_ERROR_TOLERANCE) {
    const nextTimepoint = now - (delta.milliseconds % ANIMATION_INTERVAL);
    lastAnimationTimestamp = Temporal.Duration.from({ milliseconds: Math.trunc(nextTimepoint) });
    renderCallback?.();
  }
}