import { defineConfig, mergeConfig } from 'vitest/config';
import { createViteConfig } from './vite.config';

export default mergeConfig(createViteConfig(true), defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
}));
