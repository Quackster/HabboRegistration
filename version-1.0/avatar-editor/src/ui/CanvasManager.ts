import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config';
import { handleClick, getCursorAt } from './HitRegion';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let renderCallback: (() => void) | null = null;
let animationId: number | null = null;

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

export function startRenderLoop(): void {
  function frame() {
    if (renderCallback) renderCallback();
    animationId = requestAnimationFrame(frame);
  }
  frame();
}

export function requestRedraw(): void {
  if (renderCallback) renderCallback();
}
