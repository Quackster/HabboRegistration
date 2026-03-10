// Vite plugin factories — all custom plugins used by the avatar editor build.

import type { Plugin } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import zlib from 'node:zlib';
import { transform } from 'esbuild';
import { compression, defineAlgorithm } from 'vite-plugin-compression2';
import { createHashNamer } from './vite-utils';

// Layout entries from CSV that should NOT get px suffix
const UNITLESS_KEYS = new Set(['avatar_scale', 'colors_per_page', 'color_cols']);

// stripRawWhitespace — Minify embedded CSV/XML strings in production builds.
// CSV lines trimmed + empty lines removed; XML inter-element whitespace stripped.
export function stripRawWhitespace(dev: boolean): Plugin[] {
  if (dev) return [];
  return [{
    name: 'strip-raw-whitespace',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      if (id.endsWith('.csv?raw') || id.endsWith('.xml?raw')) {
        // Vite wraps ?raw content in: export default "escaped content"
        // Use JSON.parse to properly unescape, then JSON.stringify to re-escape.
        const match = code.match(/export default ("(?:[^"\\]|\\.)*")/s);
        if (!match) return null;
        let raw: string = JSON.parse(match[1]);
        if (id.endsWith('.csv?raw')) {
          raw = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0).join('\n');
        } else {
          raw = raw.replace(/>\s+</g, '><').trim();
        }
        return { code: `export default ${JSON.stringify(raw)}`, map: null };
      }
      return null;
    },
  }];
}

// cssVarMangling — manages layout CSS vars and CSS custom property mangling.
//
// Layout values from layout.csv exposed as --ae- prefixed CSS custom properties in :root.
// Components use var(--ae-canvas-width) etc. in CSS modules. In production, all --ae-
// properties get short hash-based names via createHashNamer for minimal CSS output.
//
// Virtual module:
//   virtual:layout-vars.css — :root { --ae-canvas-width: 406px; ... } from layout.csv
export function cssVarMangling(dev: boolean): Plugin[] {
  const csvPath = resolve(__dirname, 'src/data/layout.csv');
  const csvText = readFileSync(csvPath, 'utf-8');
  const layoutEntries: { key: string; value: string }[] = [];
  for (const line of csvText.trim().split('\n')) {
    const [key, value] = line.split(',');
    if (key && value !== undefined) {
      layoutEntries.push({ key: key.trim(), value: value.trim() });
    }
  }

  // Build mapping: long CSS property name -> short name (production only)
  // SHA-256 hash via createHashNamer — collision-free, order-independent.
  const longToShort = new Map<string, string>();
  const propNamer = createHashNamer('--ae-');

  for (const entry of layoutEntries) {
    const longName = `--ae-${entry.key.replace(/_/g, '-')}`;
    longToShort.set(longName, propNamer(longName));
  }

  // Generate :root CSS with layout var declarations
  function generateRootCss(): string {
    const lines = [':root {'];
    for (const entry of layoutEntries) {
      const longName = `--ae-${entry.key.replace(/_/g, '-')}`;
      const propName = dev ? longName : longToShort.get(longName)!;
      const unit = UNITLESS_KEYS.has(entry.key) ? '' : 'px';
      lines.push(`  ${propName}: ${entry.value}${unit};`);
    }
    lines.push('}');
    return lines.join('\n');
  }

  const VIRTUAL_CSS_ID = 'virtual:layout-vars.css';
  const RESOLVED_CSS_ID = '\0' + VIRTUAL_CSS_ID;

  return [{
    name: 'css-var-mangling',
    resolveId(id: string) {
      if (id === VIRTUAL_CSS_ID) return RESOLVED_CSS_ID;
      return null;
    },
    load(id: string) {
      if (id === RESOLVED_CSS_ID) return generateRootCss();
      return null;
    },
    transform(code: string, id: string) {
      if (dev || !id.endsWith('.module.css')) return null;
      // Single-pass regex: match all --ae-{name} patterns, replace via map
      const result = code.replace(/--ae-[\w-]+/g, (match) =>
        longToShort.get(match) ?? match
      );
      if (result === code) return null;
      return { code: result, map: null };
    },
  }];
}

// esbuildMinifyPlugin — Vite plugin (enforce: 'post') with generateBundle hook that runs esbuild
//   minification on the final JS chunks after all other processing is complete.
// Vite ES library output intentionally skips whitespace minification to preserve /*#__PURE__*/
//   annotations for tree-shaking (vitejs/vite#6555). build.minify: 'esbuild' has no effect on
//   ES lib format. Using generateBundle (runs after all renderChunk hooks) ensures our
//   minification is not undone by Vite's internal post-processing.
export function esbuildMinifyPlugin(dev: boolean): Plugin[] {
  if (dev) return [];
  return [{
    name: 'esbuild-minify',
    enforce: 'post' as const,
    async generateBundle(_options, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk') {
          const result = await transform(chunk.code, {
            minifyWhitespace: true,
            minifySyntax: true,
            target: 'esnext',
            format: 'esm',
            legalComments: 'none',
          });
          chunk.code = result.code;
        }
      }
    },
  }];
}

// Compression options — shared between compressionPlugins (vite-plugin-compression2 for bundle
//   assets) and copyExternalDeps (manual zlib for external deps that bypass the bundle pipeline).
const GZIP_OPTS: zlib.ZlibOptions = {
  level: zlib.constants.Z_BEST_COMPRESSION,
  memLevel: 9,
};

const BROTLI_OPTS: zlib.BrotliOptions = {
  params: {
    [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
    [zlib.constants.BROTLI_PARAM_LGWIN]: 24,
    [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
  },
};

const ZSTD_OPTS = {
  params: {
    [zlib.constants.ZSTD_c_compressionLevel]: 22,
    [zlib.constants.ZSTD_c_strategy]: zlib.constants.ZSTD_btultra2,
  },
};

// compressionPlugins — pre-compressed .gz, .br, .zst files generated at build time.
export function compressionPlugins(dev: boolean): Plugin[] {
  if (dev) return [];
  return [
    compression({
      algorithms: [
        defineAlgorithm('gzip', GZIP_OPTS),
        defineAlgorithm('brotliCompress', BROTLI_OPTS),
        defineAlgorithm('zstd', ZSTD_OPTS),
      ],
      threshold: 512,
    }),
  ];
}

// copyExternalDeps — minifies, mangles, and compresses externalized dependency ESM files
//   into dist/libs/ during build. esbuild transform (minify whitespace/syntax/identifiers,
//   tree-shaking, drop console.*, exports preserved) + manual zlib compression
//   (gzip/brotli/zstd with same settings as compressionPlugins). Caller provides
//   { src, dest } array — reusable across projects with different external deps.
//   writeBundle hook runs after Vite writes output — external deps bypass the normal
//   bundle pipeline, so minification and compression are applied manually here.
export interface ExternalDep {
  /** Absolute path to the source ESM file in node_modules */
  src: string;
  /** Output filename in dist/libs/ (e.g. 'comlink.js') */
  dest: string;
}

export function copyExternalDeps(dev: boolean, deps: ExternalDep[]): Plugin[] {
  if (dev) return [];
  return [{
    name: 'copy-external-deps',
    async writeBundle(options) {
      const outDir = options.dir!;
      const libsDir = resolve(outDir, 'libs');
      await mkdir(libsDir, { recursive: true });

      for (const dep of deps) {
        const code = readFileSync(dep.src, 'utf-8');
        const result = await transform(code, {
          minifyWhitespace: true,
          minifySyntax: true,
          minifyIdentifiers: true,
          treeShaking: true,
          drop: ['console'],
          target: 'esnext',
          format: 'esm',
          legalComments: 'none',
        });
        const destPath = resolve(libsDir, dep.dest);
        const buf = Buffer.from(result.code);
        await writeFile(destPath, buf);

        await Promise.all([
          writeFile(`${destPath}.gz`, zlib.gzipSync(buf, GZIP_OPTS)),
          writeFile(`${destPath}.br`, zlib.brotliCompressSync(buf, BROTLI_OPTS)),
          writeFile(`${destPath}.zst`, zlib.zstdCompressSync(buf, ZSTD_OPTS)),
        ]);
      }
    },
  }];
}
