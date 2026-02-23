import { FRAMES_PER_ATLAS, ATLAS_COLS, ATLAS_FRAME_W, ATLAS_FRAME_H } from './config';

export interface AtlasEntry {
  img: HTMLImageElement;
  sx: number;
  sy: number;
}

/**
 * Loads and caches WebP sprite atlases.
 * Each atlas packs FRAMES_PER_ATLAS frames in a grid of ATLAS_COLS columns.
 */
export class AtlasLoader {
  private cache: Map<number, HTMLImageElement | null> = new Map();
  private pending: Map<number, Promise<HTMLImageElement | null>> = new Map();
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/?$/, '/');
  }

  /** Returns the atlas entry for frame n, or null if not yet loaded. */
  get(n: number): AtlasEntry | null {
    const atlasIdx = Math.floor((n - 1) / FRAMES_PER_ATLAS);
    const entry = this.cache.get(atlasIdx);
    if (!entry || !entry.complete || entry.naturalWidth === 0) return null;

    const localIdx = (n - 1) % FRAMES_PER_ATLAS;
    const col = localIdx % ATLAS_COLS;
    const row = Math.floor(localIdx / ATLAS_COLS);

    return { img: entry, sx: col * ATLAS_FRAME_W, sy: row * ATLAS_FRAME_H };
  }

  /** Loads a single atlas by index, resolving when the image is ready. */
  load(atlasIdx: number): Promise<HTMLImageElement | null> {
    if (this.cache.has(atlasIdx)) {
      const entry = this.cache.get(atlasIdx)!;
      return Promise.resolve(entry?.complete && entry.naturalWidth > 0 ? entry : null);
    }
    const existing = this.pending.get(atlasIdx);
    if (existing) return existing;

    const p = new Promise<HTMLImageElement | null>((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.cache.set(atlasIdx, img);
        this.pending.delete(atlasIdx);
        resolve(img);
      };
      img.onerror = () => {
        this.cache.set(atlasIdx, null);
        this.pending.delete(atlasIdx);
        resolve(null);
      };
      img.src = `${this.baseUrl}atlas-${atlasIdx}.webp`;
    });

    this.pending.set(atlasIdx, p);
    return p;
  }

  /** Fire-and-forget preload of a range of atlases. */
  preload(fromAtlas: number, toAtlas: number): void {
    for (let i = fromAtlas; i <= toAtlas; i++) {
      if (!this.cache.has(i) && !this.pending.has(i)) {
        this.load(i);
      }
    }
  }

  get loadedCount(): number {
    return this.cache.size;
  }

  dispose(): void {
    this.cache.clear();
    this.pending.clear();
  }
}
