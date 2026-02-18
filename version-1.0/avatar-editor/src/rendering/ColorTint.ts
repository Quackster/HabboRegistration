import type { AtlasRegion } from './Atlas';

export function applyColorTint(
  ctx: CanvasRenderingContext2D,
  region: AtlasRegion,
  r: number,
  g: number,
  b: number,
  x: number,
  y: number
): void {
  const w = region.w;
  const h = region.h;

  if (r === 255 && g === 255 && b === 255) {
    ctx.drawImage(region.img, region.x, region.y, w, h, x, y, w, h);
    return;
  }

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = w;
  tempCanvas.height = h;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.drawImage(region.img, region.x, region.y, w, h, 0, 0, w, h);

  const imageData = tempCtx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const rF = r / 255;
  const gF = g / 255;
  const bF = b / 255;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(data[i] * rF);
    data[i + 1] = Math.round(data[i + 1] * gF);
    data[i + 2] = Math.round(data[i + 2] * bF);
  }

  tempCtx.putImageData(imageData, 0, 0);
  ctx.drawImage(tempCanvas, x, y);
}

export function parseColor(hex: string): [number, number, number] {
  hex = hex.replace('#', '');
  return [
    parseInt(hex.substring(0, 2), 16) || 0,
    parseInt(hex.substring(2, 4), 16) || 0,
    parseInt(hex.substring(4, 6), 16) || 0,
  ];
}
