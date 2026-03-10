// ColorTint — Color tinting via SVG feColorMatrix filters.
// Browser GPU applies tinting at render time via inline SVG <filter> elements.
// This module provides filter ID generation, CSS class helpers, and feColorMatrix values.

// parseColor — converts hex color string to [r, g, b] tuple.
// Handles both "#E8B137" and "E8B137" formats.
export function parseColor(hex: string): [number, number, number] {
  hex = hex.replace('#', '');
  return [
    parseInt(hex.substring(0, 2), 16) || 0,
    parseInt(hex.substring(2, 4), 16) || 0,
    parseInt(hex.substring(4, 6), 16) || 0,
  ];
}

// getTintFilterId — returns the SVG filter element ID for referencing in JSX.
// e.g. getTintFilterId(232, 177, 55) → "tint-E8B137"
export function getTintFilterId(r: number, g: number, b: number): string {
  const hex = [r, g, b].map(c => c.toString(16).padStart(2, '0').toUpperCase()).join('');
  return `tint-${hex}`;
}

// getRasterTintClass — returns CSS class name for raster tint (SVG feColorMatrix filter).
// Returns empty string for white (no tinting needed).
export function getRasterTintClass(hex: string): string {
  const h = hex.replace('#', '').toUpperCase();
  return h === 'FFFFFF' || h === '' ? '' : `ae-tr-${h}`;
}

// getVectorTintClass — returns CSS class name for vector tint (SVG feColorMatrix filter).
// Returns empty string for white (no tinting needed).
export function getVectorTintClass(hex: string): string {
  const h = hex.replace('#', '').toUpperCase();
  return h === 'FFFFFF' || h === '' ? '' : `ae-tv-${h}`;
}

// getFeColorMatrixValues — returns the feColorMatrix "values" attribute string.
// Multiplies each RGB channel by the normalized color value, preserving alpha.
// color-interpolation-filters="sRGB" on the <filter> element ensures results match
// canvas-based pixel multiplication (linear RGB would produce different tint colors).
export function getFeColorMatrixValues(r: number, g: number, b: number): string {
  return `${r/255} 0 0 0 0  0 ${g/255} 0 0 0  0 0 ${b/255} 0 0  0 0 0 1 0`;
}
