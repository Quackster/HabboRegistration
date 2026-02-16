import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config';

const TOTAL_FRAMES = 14;
const FRAME_INTERVAL = 83; // ~12fps, matching original Flash frame rate

let frames: HTMLImageElement[] = [];
let currentFrame = 0;
let timerId: number | null = null;

export function loadFrames(assetsPath: string): Promise<void> {
  const promises: Promise<void>[] = [];

  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    promises.push(
      new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // don't block on missing frames
      })
    );
    img.src = `${assetsPath}frames/${i}.png`;
    frames[i - 1] = img;
  }

  return Promise.all(promises).then(() => {});
}

export function startLoadingAnimation(ctx: CanvasRenderingContext2D): void {
  currentFrame = 0;
  drawFrame(ctx);
  timerId = window.setInterval(() => {
    currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
    drawFrame(ctx);
  }, FRAME_INTERVAL);
}

export function stopLoadingAnimation(): void {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function drawFrame(ctx: CanvasRenderingContext2D): void {
  const img = frames[currentFrame];
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(img, 0, 0);
  }
}
