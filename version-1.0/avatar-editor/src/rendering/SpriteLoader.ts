const cache = new Map<string, HTMLImageElement>();
const pending = new Map<string, Promise<HTMLImageElement>>();

let assetsPath = './';

export function setAssetsPath(path: string): void {
  assetsPath = path;
}

export function loadSprite(imageId: number): Promise<HTMLImageElement> {
  const key = String(imageId);

  const cached = cache.get(key);
  if (cached) return Promise.resolve(cached);

  const existing = pending.get(key);
  if (existing) return existing;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      cache.set(key, img);
      pending.delete(key);
      resolve(img);
    };
    img.onerror = () => {
      pending.delete(key);
      reject(new Error(`Failed to load sprite ${imageId}`));
    };
    img.src = `${assetsPath}sprites/${imageId}.webp`;
  });

  pending.set(key, promise);
  return promise;
}

export function getSpriteSync(imageId: number): HTMLImageElement | undefined {
  return cache.get(String(imageId));
}

export async function preloadSprites(imageIds: number[]): Promise<void> {
  await Promise.allSettled(imageIds.map(id => loadSprite(id)));
}
