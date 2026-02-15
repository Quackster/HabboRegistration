export interface SpriteInfo {
  imageId: number;
  offsetX: number;
  offsetY: number;
}

let nameToInfo: Map<string, SpriteInfo> | null = null;

export async function loadSymbolMap(assetsPath: string): Promise<void> {
  nameToInfo = new Map();

  // Load symbols.csv: spriteId;spriteName
  const symbolsResp = await fetch(`${assetsPath}data/symbols.csv`);
  const symbolsText = await symbolsResp.text();
  const idToName = new Map<number, string>();
  for (const line of symbolsText.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const [idStr, name] = trimmed.split(';');
    if (idStr && name) {
      idToName.set(parseInt(idStr, 10), name);
    }
  }

  // Load spriteoffsets.csv: imageId;offsetX;offsetY
  const offsetsResp = await fetch(`${assetsPath}data/spriteoffsets.csv`);
  const offsetsText = await offsetsResp.text();
  const offsets = new Map<number, { offsetX: number; offsetY: number }>();
  for (const line of offsetsText.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split(';');
    if (parts.length >= 3) {
      offsets.set(parseInt(parts[0], 10), {
        offsetX: parseFloat(parts[1]),
        offsetY: parseFloat(parts[2]),
      });
    }
  }

  // Build name → info map
  for (const [spriteId, name] of idToName) {
    const imageId = spriteId - 2;
    const offset = offsets.get(imageId);
    if (offset) {
      nameToInfo.set(name, {
        imageId,
        offsetX: offset.offsetX,
        offsetY: offset.offsetY,
      });
    }
  }
}

export function getSpriteInfo(name: string): SpriteInfo | undefined {
  return nameToInfo?.get(name);
}

export function hasSpriteInfo(name: string): boolean {
  return nameToInfo?.has(name) ?? false;
}
