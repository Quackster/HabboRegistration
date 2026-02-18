import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config';

const TOTAL_FRAMES = 18;
const FRAME_INTERVAL = 83; // ~12fps, matching original Flash frame rate

let frames: HTMLCanvasElement[] = [];
let currentFrame = 0;
let timerId: number | null = null;

export function loadFrames(assetsPath: string): Promise<void> {
  const promises: Promise<HTMLImageElement | null>[] = [];

  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    promises.push(
      new Promise<HTMLImageElement | null>((resolve) => {
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
      })
    );
    img.src = `${assetsPath}frames/${i}.png`;
  }

  return Promise.all(promises).then((images) => {
    frames = images.map((img) => {
      const canvas = document.createElement('canvas');
      if (!img) return canvas;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let j = 0; j < data.length; j += 4) {
        data[j] = 255 - data[j];
        data[j + 1] = 255 - data[j + 1];
        data[j + 2] = 255 - data[j + 2];
      }
      ctx.putImageData(imageData, 0, 0);
      return canvas;
    });
  });
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
  const frame = frames[currentFrame];
  if (frame && frame.width > 0) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const x = Math.floor((CANVAS_WIDTH - frame.width) / 2);
    const y = Math.floor((CANVAS_HEIGHT - frame.height) / 2);
    ctx.drawImage(frame, x, y);
  }
}
