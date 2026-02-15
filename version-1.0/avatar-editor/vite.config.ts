import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'HabboRegistration',
      fileName: 'habbo-registration',
      formats: ['iife'],
    },
    outDir: 'dist',
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
  publicDir: 'assets',
});
