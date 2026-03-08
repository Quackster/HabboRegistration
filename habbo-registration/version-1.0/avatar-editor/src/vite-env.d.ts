/// <reference types="vite/client" />

// Build-time constant injected by vite.config.ts via `define`.
// SHA-256 fingerprint of libdepixelize-wasm version + WebP atlas files.
// Used by Atlas.ts initSvgStore() to validate on-disk SVG cache.
declare const __VECTORIZE_DB_HASH__: string;

// Virtual module: layout CSS custom properties (--ae-canvas-width, etc.) generated
// from src/data/layout.csv by the cssVarMangling Vite plugin.
declare module 'virtual:layout-vars.css';
