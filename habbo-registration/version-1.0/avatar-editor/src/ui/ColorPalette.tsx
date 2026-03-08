// ColorPalette — Grid of colored swatches with pagination.
//
// CSS module classes with layout vars. Swatch positions via ae-cs-{col}-{row} classes,
// container Y via ae-cpy-{index} class, swatch colors via ae-bg-{HEX} class — all from
// atlas-sprites.css. classList toggles .enabled/.disabled. No inline style attributes.

import { createSignal, createMemo, createEffect, on, Show, For } from 'solid-js';
import '../data/atlas-sprites.css';
import { PART_TYPES } from '../config';
import { coord } from '../data/Layout';
import { getSwatchColorClass } from '../rendering/Atlas';
import { isThrottled, triggerThrottle } from './clickThrottle';
import SpriteElement from './SpriteElement';
import styles from './ColorPalette.module.css';

export interface PaletteData {
  colors: string[];
  selectedIndex: number;
}

export default function ColorPalette(props: {
  partType: string;
  palette: PaletteData | undefined;
  y: number;
  onSelect: (partType: string, color: string, index: number) => void;
}) {
  const [page, setPage] = createSignal(0);

  const colorsPerPage = coord('colors_per_page');
  const colorCols = coord('color_cols');

  // Sync page to selected color's page only when selectedIndex changes.
  const selectedIndex = () => props.palette?.selectedIndex ?? 0;
  createEffect(on(selectedIndex, (idx) => {
    setPage(Math.floor(idx / colorsPerPage));
  }));

  const visibleColors = createMemo(() => {
    const p = props.palette;
    if (!p) return [];
    const ep = page();
    const start = ep * colorsPerPage;
    const end = Math.min(start + colorsPerPage, p.colors.length);
    const result: { color: string; globalIndex: number; col: number; row: number }[] = [];
    for (let i = start; i < end; i++) {
      const localIdx = i - start;
      result.push({
        color: p.colors[i],
        globalIndex: i,
        col: localIdx % colorCols,
        row: Math.floor(localIdx / colorCols),
      });
    }
    return result;
  });

  const emptySlots = createMemo(() => {
    const filled = visibleColors().length;
    const result: { col: number; row: number }[] = [];
    for (let i = filled; i < colorsPerPage; i++) {
      result.push({
        col: i % colorCols,
        row: Math.floor(i / colorCols),
      });
    }
    return result;
  });

  const totalPages = createMemo(() => {
    const p = props.palette;
    if (!p) return 0;
    return Math.ceil(p.colors.length / colorsPerPage);
  });

  const hasMultiplePages = () => totalPages() > 1;

  const prevPage = () => {
    if (isThrottled()) return;
    setPage(p => (p - 1 + totalPages()) % totalPages());
    triggerThrottle();
  };

  const nextPage = () => {
    if (isThrottled()) return;
    setPage(p => (p + 1) % totalPages());
    triggerThrottle();
  };

  function handleColorClick(color: string, globalIndex: number) {
    if (isThrottled()) return;
    props.onSelect(props.partType, color, globalIndex);
    triggerThrottle();
  }

  return (
    <Show when={props.palette}>
      <div class={`${styles.container} ae-cpy-${PART_TYPES.indexOf(props.partType as typeof PART_TYPES[number])}`}>
        {/* Color swatches */}
        <For each={visibleColors()}>{(item) =>
          <div
            role="button"
            class={`${styles.swatch} ae-cs-${item.col}-${item.row}`}
            classList={{
              [styles.enabled]: !isThrottled(),
              [styles.disabled]: isThrottled(),
            }}
            tabIndex={0}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleColorClick(item.color, item.globalIndex); }
            }}
            onClick={() => handleColorClick(item.color, item.globalIndex)}
          >
            <SpriteElement atlasKey="ui/colorButtonBg" />
            <div class={`${styles.colorFill} ${getSwatchColorClass(item.color)}`} />
            <Show when={item.globalIndex === props.palette!.selectedIndex}>
              <div class={styles.selector}>
                <SpriteElement atlasKey="ui/paletteSelector" />
              </div>
            </Show>
          </div>
        }</For>

        {/* Empty slots */}
        <For each={emptySlots()}>{(slot) =>
          <div class={`${styles.emptySlot} ae-cs-${slot.col}-${slot.row}`}>
            <SpriteElement atlasKey="ui/inactiveColorButton" />
          </div>
        }</For>

        {/* Page arrows */}
        <Show when={hasMultiplePages()}>
          <div
            role="button"
            classList={{
              [styles.arrow]: true,
              [styles.arrowLeft]: true,
              [styles.enabled]: !isThrottled(),
              [styles.disabled]: isThrottled(),
            }}
            tabIndex={0}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); prevPage(); }
            }}
            onClick={prevPage}
          >
            <SpriteElement atlasKey="ui/paletteArrowLeft" />
          </div>
          <div
            role="button"
            classList={{
              [styles.arrow]: true,
              [styles.arrowRight]: true,
              [styles.enabled]: !isThrottled(),
              [styles.disabled]: isThrottled(),
            }}
            tabIndex={0}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nextPage(); }
            }}
            onClick={nextPage}
          >
            <SpriteElement atlasKey="ui/paletteArrowRight" />
          </div>
        </Show>
      </div>
    </Show>
  );
}
