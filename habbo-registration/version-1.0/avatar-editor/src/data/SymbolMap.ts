// SymbolMap — Sprite ID to name mapping with offsets.
// Both CSVs embedded via Vite ?raw imports, parsed at module scope — no network requests.

import symbolsCsv from './symbols.csv?raw';
import spriteoffsetsCsv from './spriteoffsets.csv?raw';

export interface SpriteInfo {
  imageId: number;
  offsetX: number;
  offsetY: number;
}

let nameToInfo: Map<string, SpriteInfo> = new Map();

function parseSymbolMap(symbolsText: string, offsetsText: string): void {
  nameToInfo = new Map();

  // Parse symbols.csv: spriteId;spriteName
  const idToName = new Map<number, string>();
  for (const line of symbolsText.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const [idStr, name] = trimmed.split(';');
    if (idStr && name) {
      idToName.set(parseInt(idStr, 10), name);
    }
  }

  // Parse spriteoffsets.csv: imageId;offsetX;offsetY
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

  // Build name -> info map
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

// Parse embedded CSVs at module scope — data available immediately
parseSymbolMap(symbolsCsv, spriteoffsetsCsv);

export function getSpriteInfo(name: string): SpriteInfo | undefined {
  return nameToInfo.get(name);
}

export function hasSpriteInfo(name: string): boolean {
  return nameToInfo.has(name);
}

export function getAllImageIds(): number[] {
  const ids = new Set<number>();
  for (const info of nameToInfo.values()) {
    ids.add(info.imageId);
  }
  return Array.from(ids);
}
