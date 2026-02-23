import { BG_COLOR, FRAME_INNER_X, FRAME_INNER_Y, FRAME_INNER_W, FRAME_INNER_H } from './config';

const MIN_DURATION_MS = 500;

// images/6.png dimensions
const LOADER_W = 173;
const LOADER_H = 140;

// Progress bar fill area within images/6.png (inside the hollow bar outline)
const BAR_X = 27;  // 25 interior start + 2px padding
const BAR_Y = 77;  // 75 interior start + 2px padding
const BAR_W = 123; // 127 full - 4px (2px each side)
const BAR_H = 10;  // 14 full - 4px (2px each side)

export class LoadingScreen {
  private loader: HTMLImageElement | null = null;
  private startTime = 0;

  constructor(assetsPath: string) {
    const base = assetsPath.replace(/\/?$/, '/');

    const li = new Image();
    li.onload = () => { this.loader = li; };
    li.src = `${base}images/6.webp`;
  }

  isDone(time: number, loadProgress: number): boolean {
    return this.startTime > 0 &&
      loadProgress >= 1 &&
      (time - this.startTime) >= MIN_DURATION_MS;
  }

  draw(ctx: CanvasRenderingContext2D, time: number, loadProgress: number): void {
    if (!this.startTime) this.startTime = time;

    // Bar fills at whichever is slower: actual loading or the minimum timer
    const progress = Math.min(loadProgress, (time - this.startTime) / MIN_DURATION_MS);

    ctx.fillRect(FRAME_INNER_X, FRAME_INNER_Y, FRAME_INNER_W, FRAME_INNER_H);

    if (this.loader) {
      const lx = Math.round(FRAME_INNER_X + (FRAME_INNER_W - LOADER_W) / 2);
      const ly = Math.round(FRAME_INNER_Y + (FRAME_INNER_H - LOADER_H) / 2);

      ctx.drawImage(this.loader, lx, ly);

      const fillW = progress >= 1 ? BAR_W : Math.round(BAR_W * progress);
      if (fillW > 0) {
        ctx.fillStyle = '#666666';
        ctx.fillRect(lx + BAR_X, ly + BAR_Y, fillW, BAR_H);
        ctx.fillStyle = BG_COLOR;
      }
    }
  }
}
