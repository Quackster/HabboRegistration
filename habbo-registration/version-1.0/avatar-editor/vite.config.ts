// Vite config assembly — imports utilities from vite-utils.ts and plugins from vite-plugins.ts.

import { defineConfig } from 'vite';
import { resolve } from 'path';
import solidPlugin from 'vite-plugin-solid';
import eslintPlugin from 'vite-plugin-eslint2';
import { createHashNamer, computeVectorizeDbHash, esbuildOptions } from './vite-utils';
import { stripRawWhitespace, cssVarMangling, esbuildMinifyPlugin, compressionPlugins } from './vite-plugins';

// Exported for vitest.config.ts and demo/vite.config.ts.
// lib=true (default) for library build, lib=false for app mode (demo build processes HTML natively).
export function createViteConfig(dev: boolean, lib = true) {
  const classNamer = createHashNamer('ae-');

  return {
    build: {
      ...(lib ? {
        lib: {
          entry: resolve(__dirname, 'src/index.tsx'),
          fileName: 'habbo-registration',
          formats: ['es'] as const,
        },
      } : {}),
      outDir: 'dist',
      // Explicit true — ensures stale compressed files (.gz, .br, .zst) and renamed outputs
      // are always cleaned before each build.
      emptyOutDir: true,
      // Note: build.minify is NOT set here. Vite library mode with ES format intentionally skips
      //   whitespace minification to preserve pure annotations for tree-shaking (vitejs/vite#6555).
      //   Setting build.minify: 'esbuild' has no effect on ES lib output. Instead, final bundle
      //   minification is handled by esbuildMinifyPlugin() via Vite generateBundle hook.
      rollupOptions: {
        // Externalized — bare specifier preserved in output, host page resolves via import map.
        // Enables browser cache sharing when multiple page components use the same library.
        // Build-only — Vite dev server resolves from node_modules as before.
        external: ['libdepixelize-wasm'],
        output: {
          // Rollup compact output — arrow functions, const bindings, object shorthand.
          compact: true,
          minifyInternalExports: true,
          generatedCode: {
            arrowFunctions: true,
            constBindings: true,
            objectShorthand: true,
          },
        },
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
      },
    },
    // CSS modules with ae- prefixed class names for host page isolation.
    // Dev: ae-GenderSelector__hitBoy__abc12 (readable).
    // Prod: SHA-256 hash via createHashNamer — collision-free, 6-char base64url.
    css: {
      modules: {
        generateScopedName: dev
          ? 'ae-[name]__[local]__[hash:base64:5]'
          : (name: string, filename: string) => classNamer(`${filename}:${name}`),
      },
    },
    esbuild: esbuildOptions(dev),
    define: {
      __VECTORIZE_DB_HASH__: JSON.stringify(computeVectorizeDbHash()),
    },
    // Atlas files imported via import.meta.glob in Atlas.ts and processed through
    // Vite's asset pipeline with content hashing — no public directory needed.
    publicDir: false,
    // demo/vite.config.ts handles HTML natively in app mode.
    // vite-plugin-eslint2 added in dev for browser overlay ESLint errors.
    plugins: [
      solidPlugin(),
      ...(dev ? [eslintPlugin()] : []),
      ...cssVarMangling(dev),
      ...stripRawWhitespace(dev),
      ...esbuildMinifyPlugin(dev),
      ...compressionPlugins(dev),
    ],
  };
}

export default defineConfig(({ mode }) => createViteConfig(mode === 'development'));
