import { CANVAS_W, CANVAS_H, DEFAULT_CONTAINER, DEFAULT_ASSETS_PATH } from './config';
import { Animator } from './Animator';

interface HomeLandingpageConfig {
  container?: string;
  assetsPath?: string;
  autoRecord?: boolean;
}

declare global {
  interface Window {
    HomeLandingpageConfig?: HomeLandingpageConfig;
    HomeLandingpage?: { startRecording: () => void };
  }
}

function getConfig(): Required<HomeLandingpageConfig> {
  const cfg = window.HomeLandingpageConfig ?? {};
  return {
    container: cfg.container ?? DEFAULT_CONTAINER,
    assetsPath: cfg.assetsPath ?? DEFAULT_ASSETS_PATH,
    autoRecord: cfg.autoRecord ?? false,
  };
}

function init(): void {
  const { container: containerId, assetsPath, autoRecord } = getConfig();

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`[HomeLandingpage] No element with id="${containerId}" found`);
    return;
  }

  container.style.width = CANVAS_W + 'px';
  container.style.height = CANVAS_H + 'px';
  container.style.overflow = 'hidden';
  container.style.position = 'relative';

  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  canvas.style.display = 'block';
  container.appendChild(canvas);

  const overlayCanvas = document.createElement('canvas');
  overlayCanvas.width = CANVAS_W;
  overlayCanvas.height = CANVAS_H;
  overlayCanvas.style.position = 'absolute';
  overlayCanvas.style.top = '0';
  overlayCanvas.style.left = '0';
  overlayCanvas.style.pointerEvents = 'none';
  container.appendChild(overlayCanvas);

  const animator = new Animator(canvas, assetsPath, overlayCanvas);
  animator.start();
  window.HomeLandingpage = { startRecording: () => animator.startRecording() };
  if (autoRecord) animator.startRecording();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
