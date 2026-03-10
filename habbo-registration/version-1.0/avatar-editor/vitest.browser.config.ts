import { defineConfig } from 'vitest/config';
import solidPlugin from 'vite-plugin-solid';
import { playwright } from '@vitest/browser-playwright';
import { createViteConfig } from './vite.config';

// Extract custom plugins from vite config (cssVarMangling, stripRawWhitespace)
// so browser tests can resolve virtual:layout-vars.css imports.
const viteConfig = createViteConfig(true);
const customPlugins = viteConfig.plugins.filter(
  (p: any) => p?.name === 'css-var-mangling' || p?.name === 'strip-raw-whitespace'
);

export default defineConfig({
  plugins: [solidPlugin(), ...customPlugins],
  test: {
    include: ['src/**/*.browser.test.tsx'],
    browser: {
      enabled: true,
      provider: playwright({
        launchOptions: {
          args: [
            '--use-gl=angle',
            '--use-angle=swiftshader',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-software-rasterizer',
            '--in-process-gpu',
            '--disable-background-networking',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-ipc-flooding-protection',
            '--no-first-run',
            '--disable-extensions',
            '--disable-component-update',
            '--disable-hang-monitor',
          ],
        },
      }),
      headless: true,
      // Old: screenshotFailures enabled by default — created __screenshots__/ with
      //   failure PNGs on test failures (purely artifacts, no snapshot tests use them).
      // New: Disabled — prevents untracked __screenshots__/ directories.
      screenshotFailures: false,
      instances: [{ browser: 'chromium' }],
    },
  },
});
