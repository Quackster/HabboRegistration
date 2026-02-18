import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  publicDir: 'assets',
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'HabboBadgeEditor',
      formats: ['iife'],
      fileName: () => 'badge-editor.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
});
