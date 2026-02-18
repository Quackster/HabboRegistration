export interface AtlasRegion {
  img: HTMLImageElement;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface AtlasData {
  image: HTMLImageElement;
  regions: Record<string, { x: number; y: number; w: number; h: number }>;
}

let atlas: AtlasData | null = null;

function parseAtlasCsv(
  text: string,
): Record<string, { x: number; y: number; w: number; h: number }> {
  const regions: Record<string, { x: number; y: number; w: number; h: number }> = {};
  for (const line of text.split("\n")) {
    if (!line) continue;
    const [key, x, y, w, h] = line.split(",");
    regions[key] = { x: +x, y: +y, w: +w, h: +h };
  }
  return regions;
}

export async function loadAtlas(basePath: string): Promise<void> {
  const [image, regions] = await Promise.all([
    loadImage(`${basePath}atlas.webp`),
    fetch(`${basePath}atlas.csv`).then((r) => r.text()).then(parseAtlasCsv),
  ]);
  atlas = { image, regions };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load atlas: ${src}`));
    img.src = src;
  });
}

export function getRegion(key: string): AtlasRegion | undefined {
  if (!atlas) return undefined;
  const r = atlas.regions[key];
  if (!r) return undefined;
  return { img: atlas.image, x: r.x, y: r.y, w: r.w, h: r.h };
}

export function drawRegion(
  ctx: CanvasRenderingContext2D,
  region: AtlasRegion,
  dx: number,
  dy: number,
): void {
  ctx.drawImage(region.img, region.x, region.y, region.w, region.h, dx, dy, region.w, region.h);
}
