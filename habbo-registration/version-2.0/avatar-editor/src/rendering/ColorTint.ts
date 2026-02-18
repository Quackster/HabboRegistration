/**
 * Apply RGB multiply tint to an image, matching Flash Color.setTransform({ra, ga, ba}).
 * Eyes (partType 'ey') are NEVER tinted.
 * Non-colorable parts use FFFFFF (no tint).
 */
export function applyColorTint(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  r: number,
  g: number,
  b: number,
  x: number,
  y: number,
  width?: number,
  height?: number
): void {
  const w = width ?? img.width;
  const h = height ?? img.height;

  // No tint needed for white
  if (r === 255 && g === 255 && b === 255) {
    ctx.drawImage(img, x, y, w, h);
    return;
  }

  // Draw to temp canvas for pixel manipulation
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = w;
  tempCanvas.height = h;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.drawImage(img, 0, 0, w, h);

  const imageData = tempCtx.getImageData(0, 0, w, h);
  const data = imageData.data;

  const rFactor = r / 255;
  const gFactor = g / 255;
  const bFactor = b / 255;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(data[i] * rFactor);
    data[i + 1] = Math.round(data[i + 1] * gFactor);
    data[i + 2] = Math.round(data[i + 2] * bFactor);
    // Alpha channel unchanged
  }

  tempCtx.putImageData(imageData, 0, 0);
  ctx.drawImage(tempCanvas, x, y);
}

/**
 * Parse hex color string to RGB values.
 */
export function parseColor(colorStr: string): [number, number, number] {
  const hex = colorStr.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  return [r, g, b];
}

/**
 * Create a tinted copy of an image as a canvas.
 */
export function createTintedCanvas(
  img: HTMLImageElement,
  r: number,
  g: number,
  b: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  applyColorTint(ctx, img, r, g, b, 0, 0);
  return canvas;
}
