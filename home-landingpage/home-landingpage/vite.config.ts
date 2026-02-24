import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'HomeLandingpage',
      fileName: 'home-landingpage',
      formats: ['iife'],
    },
    outDir: 'dist',
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
  plugins: [
    {
      name: 'generate-dist-html',
      closeBundle() {
        const html = readFileSync('index.html', 'utf-8')
          .replace('./', "assets/")
          .replace('<script type="module" src="/src/index.ts"></script>', '<script src="home-landingpage.iife.js"></script>');
        writeFileSync('dist/index.html', html);
      },
    },
  ],
});
