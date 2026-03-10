// SvgTintFilters — SVG feColorMatrix filter definitions with companion tint CSS classes.
//
// Renders a hidden SVG with feColorMatrix filter definitions for color tinting,
// plus a runtime <style> element with CSS classes for both raster and vector tinting.
// This is the single runtime CSS exception — all other styling uses pre-generated classes.

import { For } from 'solid-js';
import { parseColor, getFeColorMatrixValues, getTintFilterId } from '../rendering/ColorTint';
import styles from './SvgTintFilters.module.css';

export default function SvgTintFilters(props: { colors: string[] }) {
  // Filter out white (FFFFFF) — no tinting needed
  const tintColors = () => props.colors.filter(h => h.toUpperCase().replace('#', '') !== 'FFFFFF');

  return (
    <>
      <svg class={styles.hidden} aria-hidden="true">
        <defs>
          <For each={props.colors}>{(hex) => {
            const [r, g, b] = parseColor(hex);
            return (
              <filter id={getTintFilterId(r, g, b)} color-interpolation-filters="sRGB">
                <feColorMatrix type="matrix" values={getFeColorMatrixValues(r, g, b)} />
              </filter>
            );
          }}</For>
        </defs>
      </svg>
      <style>{tintColors().map(hex => {
        const h = hex.replace('#', '').toUpperCase();
        // Both raster and vector tinting use the same SVG feColorMatrix filter —
        // CSS filter applies to rendered output only, so transparent pixels stay transparent
        return `.ae-tr-${h},.ae-tv-${h}{filter:url(#tint-${h})}`;
      }).join('')}</style>
    </>
  );
}
