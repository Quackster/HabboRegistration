// Demo app Vite config — builds the avatar editor as a standalone HTML app.
//
// Old: libraryAssetsPlugin copied atlas WebP from library dist to demo dist, with
//   publicDir + configureServer middleware for dev mode URL rewriting. assetsPath config
//   required in HabboRegistrationConfig.
// New: Atlas files imported via import.meta.glob in Atlas.ts — Vite handles them through
//   the asset pipeline in both dev and prod. No publicDir, no atlas copying, no URL rewriting.

import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'path';
import minifyHtml from '@minify-html/node';
import { createViteConfig } from '../vite.config';
import { copyExternalDeps } from '../vite-plugins';

// Old: No HTML minification — generate-dist-html wrote raw HTML via writeFileSync.
// Previous: @minify-html/node minifies inline CSS, inline JS, and HTML structure, but not
//   JSON inside <script type="importmap"> (treated as content, not executable JS).
// New: @minify-html/node for CSS/JS/HTML, then post-process importmap scripts —
//   JSON.parse + JSON.stringify strips whitespace from importmap JSON.
function htmlMinifyPlugin(): Plugin {
  return {
    name: 'html-minify',
    transformIndexHtml(html) {
      const minified = minifyHtml.minify(Buffer.from(html), {
        minify_css: true,
        minify_js: true,
      }).toString();
      return minified.replace(
        /(<script type=importmap>)([\s\S]*?)(<\/script>)/i,
        (_, open, json, close) => `${open}${JSON.stringify(JSON.parse(json))}${close}`,
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const dev = mode === 'development';
  const config = createViteConfig(dev, false); // lib=false → app mode
  if (!dev) {
    config.plugins!.push(htmlMinifyPlugin());
    // Old: No external dep copying — libdepixelize-wasm bundled into code-split chunk.
    // Previous: copyExternalDeps(dev) — hardcoded deps, raw copyFile, no minification/compression.
    // New: Caller provides { src, dest } array — esbuild minifies + zlib compresses in plugin.
    config.plugins!.push(...copyExternalDeps(dev, [
      { src: resolve(__dirname, '../node_modules/libdepixelize-wasm/dist/index.js'), dest: 'libdepixelize-wasm.js' },
      { src: resolve(__dirname, '../node_modules/comlink/dist/esm/comlink.mjs'), dest: 'comlink.js' },
    ]));
  }
  return config;
});
