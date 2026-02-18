const cache: Map<string, HTMLCanvasElement> = new Map();

export function tintImage(
  source: HTMLImageElement,
  hexColor: string
): HTMLCanvasElement {
  const key = source.src + '|' + hexColor;
  const cached = cache.get(key);
  if (cached) return cached;

  const w = source.width;
  const h = source.height;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // 1. Draw original sprite
  ctx.drawImage(source, 0, 0);

  // 2. Multiply with tint color
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = hexColor;
  ctx.fillRect(0, 0, w, h);

  // 3. Restore alpha from original
  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(source, 0, 0);

  // Reset
  ctx.globalCompositeOperation = 'source-over';

  cache.set(key, canvas);
  return canvas;
}

export function clearTintCache(): void {
  cache.clear();
}
