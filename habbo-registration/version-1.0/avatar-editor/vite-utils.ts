// Pure utilities used by Vite config and plugins — no Vite plugin types.
// vite-utils.ts (utilities), vite-plugins.ts (plugin factories), vite.config.ts (config assembly).

import { createHash } from 'crypto';
import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';
import type { ESBuildOptions } from 'vite';

// computeVectorizeDbHash — SHA-256 fingerprint of inputs that affect vectorization output.
// Used as __VECTORIZE_DB_HASH__ build-time constant to validate the on-disk SVG cache.
// Combines libdepixelize-wasm version + WebP atlas file contents. If hash matches the stored
// value, cached SVGs are reused (skipping 30-60+ seconds of vectorization).
export function computeVectorizeDbHash(): string {
  const hash = createHash('sha256');
  // libdepixelize-wasm version — different versions may produce different SVG output
  const depixPkg = JSON.parse(readFileSync(resolve(__dirname, 'node_modules/libdepixelize-wasm/package.json'), 'utf-8'));
  hash.update(depixPkg.version);
  // 1x WebP atlas file contents — source pixel data for vectorization
  const atlasFiles = readdirSync(resolve(__dirname, 'assets'))
    .filter(f => /^atlas_\d+\.webp$/.test(f))
    .sort();
  for (const file of atlasFiles) {
    hash.update(readFileSync(resolve(__dirname, 'assets', file)));
  }
  return hash.digest('hex').slice(0, 16); // 16 hex chars = 64 bits — sufficient for cache key
}

type Drop = ('console' | 'debugger')[];

export function esbuildOptions(dev: boolean): ESBuildOptions {
  return {
    target: 'esnext',
    minifyIdentifiers: !dev,
    minifyWhitespace: !dev,
    minifySyntax: !dev,
    treeShaking: !dev,
    ignoreAnnotations: !dev,
    legalComments: dev ? 'inline' : 'none',
    // console.log/warn/error dropped in production — diagnostics are dev-only.
    drop: dev ? ([] as Drop) : ['console'],
  };
}

// createHashNamer — generates short, collision-free hash-based names with a given prefix.
// Uses SHA-256 of the input string, encoded as base64url, starting at 6 characters
// (64^6 = 68.7B possibilities — collision probability ~3.5×10⁻⁸ with <100 names).
// Explicit collision check: if a truncated hash collides (practically impossible at 6 chars),
// progressively extends length until unique. Tracks all assigned hashes in a Set.
//
// Used for both CSS module class names and CSS custom properties in production.
// SHA-256 hash with collision-free guarantee (progressively extends length if needed).
export function createHashNamer(prefix: string) {
  const assigned = new Set<string>();
  return (input: string): string => {
    const hash = createHash('sha256').update(input).digest('base64url');
    for (let len = 6; len <= hash.length; len++) {
      const candidate = `${prefix}${hash.slice(0, len)}`;
      if (!assigned.has(candidate)) {
        assigned.add(candidate);
        return candidate;
      }
    }
    // Unreachable — SHA-256 base64url is 43 chars, full hash always unique
    const full = `${prefix}${hash}`;
    assigned.add(full);
    return full;
  };
}
