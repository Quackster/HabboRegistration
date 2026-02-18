import { CANVAS_WIDTH, CANVAS_HEIGHT, BG_COLOR, BG_ORIGIN_X, BG_ORIGIN_Y } from '../config';
import { getUI } from '../rendering/SpriteLoader';

export interface HitRegion {
  x: number;
  y: number;
  w: number;
  h: number;
  onClick: () => void;
}

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let regions: HitRegion[] = [];
let drawCallback: ((ctx: CanvasRenderingContext2D) => void) | null = null;
let animFrameId = 0;
let hoverRegion: HitRegion | null = null;

export function initCanvas(container: HTMLElement): CanvasRenderingContext2D {
  canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  canvas.style.cursor = 'default';
  container.appendChild(canvas);

  ctx = canvas.getContext('2d')!;

  canvas.addEventListener('click', handleClick);
  canvas.addEventListener('mousemove', handleMouseMove);

  return ctx;
}

export function getCtx(): CanvasRenderingContext2D {
  return ctx;
}

export function setDrawCallback(fn: (ctx: CanvasRenderingContext2D) => void): void {
  drawCallback = fn;
}

export function clearRegions(): void {
  regions = [];
}

export function addRegion(region: HitRegion): void {
  regions.push(region);
}

export function requestRedraw(): void {
  if (animFrameId) return;
  animFrameId = requestAnimationFrame(() => {
    animFrameId = 0;
    redraw();
  });
}

function redraw(): void {
  // Fill with SWF background color
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Disable image smoothing for crisp pixel art (must re-set each frame)
  ctx.imageSmoothingEnabled = false;

  // Draw the main background sprite (418: 300x375, regPt 0,0) at SWF origin (-1, 0.5)
  // Background is slightly larger than canvas, cropped naturally by canvas bounds
  try {
    const bgImg = getUI('background');
    ctx.drawImage(bgImg, BG_ORIGIN_X, BG_ORIGIN_Y);
  } catch {
    // Background not yet loaded, solid fill is fine
  }

  drawCallback?.(ctx);
}

function getMousePos(e: MouseEvent): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const scaleX = CANVAS_WIDTH / rect.width;
  const scaleY = CANVAS_HEIGHT / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
}

function findRegion(x: number, y: number): HitRegion | null {
  // Search in reverse so topmost regions are hit first
  for (let i = regions.length - 1; i >= 0; i--) {
    const r = regions[i];
    if (x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) {
      return r;
    }
  }
  return null;
}

function handleClick(e: MouseEvent): void {
  const pos = getMousePos(e);
  const region = findRegion(pos.x, pos.y);
  region?.onClick();
}

function handleMouseMove(e: MouseEvent): void {
  const pos = getMousePos(e);
  const region = findRegion(pos.x, pos.y);
  if (region !== hoverRegion) {
    hoverRegion = region;
    canvas.style.cursor = region ? 'pointer' : 'default';
  }
}
