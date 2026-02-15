let assetsBase = './';

const cache = new Map<string, HTMLImageElement>();
const pending = new Map<string, Promise<HTMLImageElement>>();

export const UI_ASSET_NAMES = [
  'background', 'prevIconBg', 'prevIconMask',
  'arrowRight', 'arrowLeft', 'rotateLeft', 'rotateRight',
  'paletteArrowLeft', 'paletteArrowRight',
  'radioOn', 'radioOff',
  'colorSwatch', 'colorButtonBg', 'inactiveColorButton', 'paletteSelector',
  'continueBtn', 'backBtn', 'randomizeBtn', 'nameBg',
] as const;

export type UIAssetName = typeof UI_ASSET_NAMES[number];

function loadImage(name: string): Promise<HTMLImageElement> {
  const existing = pending.get(name);
  if (existing) return existing;

  const cached = cache.get(name);
  if (cached) return Promise.resolve(cached);

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      cache.set(name, img);
      pending.delete(name);
      resolve(img);
    };
    img.onerror = () => {
      pending.delete(name);
      reject(new Error(`Failed to load UI asset: ${name}`));
    };
    img.src = `${assetsBase}ui/${name}.png`;
  });

  pending.set(name, promise);
  return promise;
}

export function getUIAsset(name: UIAssetName): HTMLImageElement | undefined {
  return cache.get(name);
}

export async function preloadUIAssets(basePath: string): Promise<void> {
  assetsBase = basePath;
  await Promise.allSettled(UI_ASSET_NAMES.map(name => loadImage(name)));
}
