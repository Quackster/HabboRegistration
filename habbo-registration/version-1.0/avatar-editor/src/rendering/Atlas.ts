import { TriggerCache } from '@solid-primitives/trigger';
import atlasCsv from './atlas-data.csv?raw';

// Atlas page URLs imported via Vite with ?url&no-inline — emitted as separate hashed
// .webp files in dist/ (not inlined as base64). Default mode needs no basePath config.
// Override mode uses basePath from HabboRegistrationConfig.assetsPath for non-Vite hosts.
const atlasPageUrls: string[] = Object.entries(
  import.meta.glob('../../assets/atlas_*.webp', { eager: true, query: '?url&no-inline', import: 'default' }) as Record<string, string>
).sort(([a], [b]) => a.localeCompare(b)).map(([, url]) => url);

// AtlasRegion describes a sprite's location and dimensions within its source image.
// Regions map is never modified after loadAtlas() — always contains original raster atlas data.
// SVG data stored on disk via Cache API / IndexedDB; blob URLs managed by ref-counted sync.
export interface AtlasRegion {
  img: HTMLImageElement;
  x: number;      // source x in atlas
  y: number;      // source y in atlas
  w: number;      // logical width (1x) — used for positioning/destination
  h: number;      // logical height (1x) — used for positioning/destination
  srcW: number;   // physical source width in the image
  srcH: number;   // physical source height in the image
}

// Parse CSV entries at module init (inlined by Vite, no async fetch needed)
const entries = atlasCsv.trim().split('\n').map(line => {
  const [key, page, x, y, w, h] = line.split(',');
  return { key, page: parseInt(page), x: parseInt(x), y: parseInt(y),
    w: parseInt(w), h: parseInt(h) };
});

const regions: Record<string, AtlasRegion> = {};

// pageUrls stored during loadAtlas() for CSS sprite background-image usage.
// regionPages maps each region key to its atlas page index.
let pageUrls: string[] = [];
const regionPages = new Map<string, number>();

// Tracks which sprite keys have been vectorized (~23 KB Set on V8 heap).
// SVG data stored on disk via Cache API (secure origins) or IndexedDB (HTTP/file://).
// Blob URLs created on demand via ref-counted management, revoked when no longer needed.
const vectorizedKeys = new Set<string>();

// Ref-counted blob URL management:
// neededKeys tracks which sprite keys components currently display (key → refCount).
// activeSvgs holds loaded blob URLs (key → blobUrl).
// svgTriggers provides per-key reactive tracking with auto-cleanup of unused signals.
const neededKeys = new Map<string, number>();
const activeSvgs = new Map<string, string>();
const svgTriggers = new TriggerCache<string>();

// Whether vectorization ran this session (controls worker pool termination).
let vectorizationRan = false;

// SVG storage abstraction — Cache API (disk-backed) on secure origins, IndexedDB fallback
// on non-secure origins (HTTP, file://). Both backends keep SVG data off V8 heap.
const hasCacheApi = typeof caches !== 'undefined';
let svgCache: Cache | null = null;
let idb: IDBDatabase | null = null;
const IDB_NAME = 'avatar-svgs';
const IDB_STORE = 'svgs';

async function getSvgCache(): Promise<Cache | null> {
  if (!hasCacheApi) return null;
  if (!svgCache) svgCache = await caches.open('avatar-svgs');
  return svgCache;
}

function openIdb(): Promise<IDBDatabase> {
  if (idb) return Promise.resolve(idb);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => { req.result.createObjectStore(IDB_STORE); };
    req.onsuccess = () => { idb = req.result; resolve(idb); };
    req.onerror = () => reject(req.error);
  });
}

const SVG_CACHE_PREFIX = '/avatar-svg/';

async function storeSvg(key: string, svg: string): Promise<void> {
  if (hasCacheApi) {
    const cache = await getSvgCache();
    await cache!.put(
      SVG_CACHE_PREFIX + key,
      new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } }),
    );
  } else {
    const db = await openIdb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(svg, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

async function retrieveSvg(key: string): Promise<Blob | null> {
  if (hasCacheApi) {
    const cache = await getSvgCache();
    const response = await cache!.match(SVG_CACHE_PREFIX + key);
    if (!response) return null;
    return response.blob();
  } else {
    const db = await openIdb();
    const svg = await new Promise<string | undefined>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    if (!svg) return null;
    return new Blob([svg], { type: 'image/svg+xml' });
  }
}

// clearSvgStore — Delete all cached SVGs from disk.
// Resets svgCache reference so getSvgCache() opens a fresh cache on next call.
async function clearSvgStore(): Promise<void> {
  if (hasCacheApi) {
    svgCache = null; // Reset stale reference so getSvgCache() opens a fresh cache
    try { await caches.delete('avatar-svgs'); } catch { /* non-critical */ }
  } else {
    try {
      const db = await openIdb();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch { /* non-critical */ }
  }
}

// getStoredVersion / setStoredVersion — Read/write the build-time hash from the SVG store.
// Reuses storeSvg()/retrieveSvg() with a reserved key '__VECTORIZE_DB_HASH__'.
async function getStoredVersion(): Promise<string | null> {
  const blob = await retrieveSvg('__VECTORIZE_DB_HASH__');
  if (!blob) return null;
  return blob.text();
}

async function setStoredVersion(fingerprint: string): Promise<void> {
  await storeSvg('__VECTORIZE_DB_HASH__', fingerprint);
}

// getStoredSvgKeys — Enumerate all stored SVG keys (excluding '__VECTORIZE_DB_HASH__').
// Used by initSvgStore() to populate vectorizedKeys from a valid cache.
//
// Cache API: cache.keys() → extract key from Request URL after SVG_CACHE_PREFIX.
// IndexedDB: store.getAllKeys() → filter out reserved key.
async function getStoredSvgKeys(): Promise<Set<string>> {
  if (hasCacheApi) {
    const cache = await getSvgCache();
    if (!cache) return new Set();
    const requests = await cache.keys();
    const keys = new Set<string>();
    for (const req of requests) {
      const idx = req.url.indexOf(SVG_CACHE_PREFIX);
      if (idx !== -1) {
        const key = req.url.slice(idx + SVG_CACHE_PREFIX.length);
        if (key !== '__VECTORIZE_DB_HASH__') keys.add(key);
      }
    }
    return keys;
  } else {
    const db = await openIdb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).getAllKeys();
      req.onsuccess = () => {
        const keys = new Set<string>();
        for (const k of req.result) {
          if (typeof k === 'string' && k !== '__VECTORIZE_DB_HASH__') keys.add(k);
        }
        resolve(keys);
      };
      req.onerror = () => reject(req.error);
    });
  }
}

// initSvgStore — Validate on-disk SVG cache against build-time hash. Idempotent.
// Compares __VECTORIZE_DB_HASH__ with stored version. Match → reuse cached SVGs.
// Mismatch → clear store and start fresh. Supports partial cache recovery (browser
// closed mid-vectorization → next session vectorizes only remaining items).
let storeInitialized = false;
let cachedKeySet = new Set<string>();

async function initSvgStore(): Promise<Set<string>> {
  if (storeInitialized) return cachedKeySet;
  storeInitialized = true;

  const fingerprint = __VECTORIZE_DB_HASH__;
  const stored = await getStoredVersion();

  if (stored === fingerprint) {
    // Cache valid — enumerate stored keys, populate vectorizedKeys
    cachedKeySet = await getStoredSvgKeys();
    for (const key of cachedKeySet) vectorizedKeys.add(key);
    return cachedKeySet;
  }

  // Cache invalid — clear and start fresh
  await clearSvgStore();
  await setStoredVersion(fingerprint);
  cachedKeySet = new Set();
  return cachedKeySet;
}

// syncSvgs scheduling — batches add/remove calls within a microtask.
let syncScheduled = false;

// loadAtlas — Load atlas page images. basePath is optional: default mode uses Vite-imported
// URLs; override mode uses basePath from HabboRegistrationConfig.assetsPath.
export async function loadAtlas(basePath?: string): Promise<void> {
  const pages: HTMLImageElement[] = [];
  const pagePromises: Promise<void>[] = [];
  pageUrls = [];

  if (basePath) {
    // Override mode — construct URLs from basePath (for non-Vite host pages).
    // Resolves to absolute URL via document.baseURI so CSS url() in custom properties
    // works correctly regardless of stylesheet location.
    const maxPage = Math.max(...entries.map(e => e.page));
    for (let i = 0; i <= maxPage; i++) {
      const img = new Image();
      const url = `${basePath}atlas_${i}.webp`;
      const promise = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load atlas page: atlas_${i}.webp`));
      });
      img.src = url;
      pages.push(img);
      pageUrls.push(new URL(url, document.baseURI).href);
      pagePromises.push(promise);
    }
  } else {
    // Default mode — use Vite-imported URLs (already absolute, no baseURI needed).
    for (let i = 0; i < atlasPageUrls.length; i++) {
      const img = new Image();
      const url = atlasPageUrls[i];
      const promise = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load atlas page ${i}`));
      });
      img.src = url;
      pages.push(img);
      pageUrls.push(url);
      pagePromises.push(promise);
    }
  }

  await Promise.all(pagePromises);

  // Populate regions from pre-parsed entries.
  // Initial atlas regions have srcW === w, srcH === h (native 1x pixel-art).
  for (const entry of entries) {
    regions[entry.key] = {
      img: pages[entry.page],
      x: entry.x,
      y: entry.y,
      w: entry.w,
      h: entry.h,
      srcW: entry.w,
      srcH: entry.h,
    };
    regionPages.set(entry.key, entry.page);
  }
}

export function getRegion(key: string): AtlasRegion | undefined {
  return regions[key];
}

// getSvgBlobUrl — reactive blob URL lookup via TriggerCache per-key tracking.
// Returns SVG blob URL if the key is vectorized and actively loaded, null otherwise.
// svgTriggers.track(key) creates a reactive dependency — component re-renders when
// the key is loaded or unloaded via syncSvgs().
export function getSvgBlobUrl(key: string): string | null {
  if (!vectorizedKeys.has(key)) return null;
  svgTriggers.track(key);
  return activeSvgs.get(key) ?? null;
}

// --- CSS class name helpers (pure string functions) ---

// getAtlasPageClass — returns CSS class encoding the atlas page index for a region key.
export function getAtlasPageClass(key: string): string {
  const pageIdx = regionPages.get(key);
  return pageIdx !== undefined ? `ae-ap-${pageIdx}` : '';
}

// getRegionClass — returns CSS class encoding the region key (slashes replaced with dashes).
export function getRegionClass(key: string): string {
  return `ae-r-${key.replace(/\//g, '-')}`;
}

// getSpriteOffsetClass — returns CSS class for sprite offset positioning.
export function getSpriteOffsetClass(imageId: number): string {
  return `ae-so-${imageId}`;
}

// getSpriteOffsetFlippedClass — returns CSS class for flipped sprite offset positioning.
export function getSpriteOffsetFlippedClass(imageId: number): string {
  return `ae-sof-${imageId}`;
}

// getPreviewOffsetClass — returns CSS class for preview icon offset positioning.
export function getPreviewOffsetClass(imageId: number, partType: string): string {
  return `ae-po-${imageId}-${partType}`;
}

// getSwatchColorClass — returns CSS class for a color swatch background.
export function getSwatchColorClass(hex: string): string {
  return `ae-bg-${hex.replace('#', '').toUpperCase()}`;
}

// addNeededKey — Increment ref count for a sprite key and schedule sync.
// Components call this when a sprite key appears (mount or key change).
export function addNeededKey(key: string): void {
  if (!vectorizedKeys.has(key)) return;
  const refs = (neededKeys.get(key) ?? 0) + 1;
  neededKeys.set(key, refs);
  console.log(`SVG needed: ${key} (refs: ${refs})`);
  scheduleSyncSvgs();
}

// removeNeededKey — Decrement ref count for a sprite key and schedule sync.
// Components call this when a sprite key disappears (cleanup or key change).
export function removeNeededKey(key: string): void {
  const count = neededKeys.get(key);
  if (count === undefined) return;
  if (count <= 1) {
    neededKeys.delete(key);
    console.log(`SVG released: ${key} (refs: 0, removed)`);
  } else {
    neededKeys.set(key, count - 1);
    console.log(`SVG released: ${key} (refs: ${count - 1})`);
  }
  scheduleSyncSvgs();
}

function scheduleSyncSvgs(): void {
  if (!syncScheduled) { syncScheduled = true; queueMicrotask(syncSvgs); }
}

// syncSvgs — Microtask-batched reconciliation of neededKeys vs activeSvgs.
// Unload phase: revoke blob URLs for keys no longer needed.
// Load phase: create blob URLs for newly needed keys (reads SVG from disk).
// Re-checks neededKeys.has(key) after each await to handle keys removed during async loading.
async function syncSvgs(): Promise<void> {
  syncScheduled = false;
  let unloaded = 0;
  let loaded = 0;

  // Unload phase — revoke blob URLs for keys no longer needed
  for (const key of [...activeSvgs.keys()]) {
    if (!neededKeys.has(key)) {
      URL.revokeObjectURL(activeSvgs.get(key)!);
      activeSvgs.delete(key);
      svgTriggers.dirty(key);
      console.log(`SVG unload: ${key}`);
      unloaded++;
    }
  }

  // Load phase — create blob URLs for newly needed keys
  const toLoad = [...neededKeys.keys()].filter(k => !activeSvgs.has(k));
  for (const key of toLoad) {
    // Re-check: key may have been removed during a previous await in this loop
    if (!neededKeys.has(key)) { console.log(`SVG sync skip (stale): ${key}`); continue; }

    const blob = await retrieveSvg(key);
    if (!blob) continue;
    // Re-check after async read — key may have been removed during disk I/O
    if (!neededKeys.has(key)) { console.log(`SVG sync skip (stale): ${key}`); continue; }

    const url = URL.createObjectURL(blob);

    // Preload: decode SVG before making it visible to components.
    // Browser caches decoded image data by URL — when the <img> element receives
    // this blob URL as src, it paints immediately without a blank frame.
    const preload = new Image();
    preload.src = url;
    try { await preload.decode(); } catch {
      console.log(`SVG decode failed: ${key}`);
      URL.revokeObjectURL(url);
      continue;
    }

    // Final re-check after decode — key may have been removed during decode
    if (!neededKeys.has(key)) { console.log(`SVG sync skip (stale): ${key}`); URL.revokeObjectURL(url); continue; }

    activeSvgs.set(key, url);
    svgTriggers.dirty(key);
    console.log(`SVG load: ${key}`);
    loaded++;
  }

  if (loaded > 0 || unloaded > 0) {
    console.log(`SVG sync: ${loaded} loaded, ${unloaded} unloaded, ${activeSvgs.size} active`);
  }
}

// --- Vectorization helpers ---
// Pixel extraction and sequential vectorization for sprites/ entries only.
// ui/ entries stay raster (not vectorized). frames/ entries stay raster.

interface SpriteItem {
  key: string;
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

// extractPixels — Extract pixel data from atlas regions matching the filter.
// Uses a shared temporary 2D canvas to read pixel data from atlas page images.
function extractPixels(entryFilter: (e: typeof entries[0]) => boolean): SpriteItem[] {
  const filtered = entries.filter(entryFilter);
  const extractCanvas = document.createElement('canvas');
  const extractCtx = extractCanvas.getContext('2d')!;
  const items: SpriteItem[] = [];
  for (const entry of filtered) {
    const region = regions[entry.key];
    if (!region) continue;
    extractCanvas.width = entry.w;
    extractCanvas.height = entry.h;
    extractCtx.clearRect(0, 0, entry.w, entry.h);
    extractCtx.drawImage(region.img, entry.x, entry.y, entry.w, entry.h, 0, 0, entry.w, entry.h);
    const imageData = extractCtx.getImageData(0, 0, entry.w, entry.h);
    items.push({ key: entry.key, data: imageData.data, width: entry.w, height: entry.h });
  }
  return items;
}

// vectorizeItems — Vectorize items sequentially via depixelizeImage, store SVGs on disk.
// Always uses sequential loop (never depixelizeBatch) to avoid OOM with ~580 sprites.
// Only uncached items are passed in — initSvgStore() validates cache before this is called.
async function vectorizeItems(items: SpriteItem[]): Promise<number> {
  const { depixelizeImage } = await import('libdepixelize-wasm');
  vectorizationRan = true;
  let upgraded = 0;
  for (const item of items) {
    const result = await depixelizeImage(
      { data: item.data, width: item.width, height: item.height },
      { method: 'voronoi' },
    );
    if (!result.svg) continue;
    // Store on disk via storeSvg() — SVG string GC'd after storage copies it.
    await storeSvg(item.key, result.svg);
    vectorizedKeys.add(item.key);
    upgraded++;
  }
  return upgraded;
}

// vectorizeSprites() — Background runtime SVG vectorization for avatar body parts (sprites/).
// Validates cache via build-time hash — cached items skipped before pixel extraction.
// Only sprites/ entries are vectorized — ui/ and frames/ stay raster.
export async function vectorizeSprites(): Promise<void> {
  const cached = await initSvgStore();
  const items = extractPixels(e => e.key.startsWith('sprites/') && !cached.has(e.key));
  const totalSprites = entries.filter(e => e.key.startsWith('sprites/')).length;
  if (items.length === 0) {
    console.log(`SVG sprite upgrade: ${totalSprites} cached, 0 to vectorize`);
    return;
  }
  const start = performance.now();
  const upgraded = await vectorizeItems(items);
  const elapsed = performance.now() - start;
  console.log(`SVG sprite upgrade: ${upgraded} vectorized, ${totalSprites - items.length} cached in ${(elapsed / 1000).toFixed(1)}s`);
}

// terminateWorkerPool — Terminate the libdepixelize WASM worker after vectorization.
// Only terminates if vectorization actually ran this session (worker was created).
// If everything was cached, no worker was ever created — skips destroyPool().
export async function terminateWorkerPool(): Promise<void> {
  if (!vectorizationRan) return;
  try {
    const { destroyPool } = await import('libdepixelize-wasm');
    await destroyPool();
  } catch (e) {
    console.warn('Failed to destroy depixelize worker pool:', e);
  }
}
