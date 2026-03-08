// PreviewIcon — Clipped preview icon showing a mini avatar for a part type.
//
// Hybrid <div>/<img> rendering: raster sprites as CSS sprite <div> elements,
// SVG sprites as <img> with blob URLs. Container Y position via pre-computed
// ae-py-{index} CSS class. Per-sprite offsets via getPreviewOffsetClass().
// Active SVG requester at LRU_PRIORITY_MEDIUM — preview icons get their own
// SVGs, evicted after NORMAL UI but before HIGH avatar display parts.

import { createEffect, on, onCleanup, For, Show } from 'solid-js';
import '../data/atlas-sprites.css';
import { RENDER_ORDER, PART_LABELS, PART_TYPES } from '../config';
import { getSpriteInfo } from '../data/SymbolMap';
import { getSvgBlobUrl, addNeededKey, removeNeededKey, getAtlasPageClass, getRegionClass, getPreviewOffsetClass } from '../rendering/Atlas';
import { buildSpriteName, type PartInfo } from '../rendering/AvatarRenderer';
import { getRasterTintClass, getVectorTintClass } from '../rendering/ColorTint';
import SpriteElement from './SpriteElement';
import styles from './PreviewIcon.module.css';

export default function PreviewIcon(props: {
  partType: string;
  parts: Map<string, PartInfo>;
  y: number;
}) {
  return (
    <div class={`${styles.container} ae-py-${PART_TYPES.indexOf(props.partType as typeof PART_TYPES[number])}`}>
      {/* Background */}
      <div class={styles.bg}>
        <SpriteElement atlasKey="ui/prevIconBg" />
      </div>

      {/* Clipped sprite area */}
      <div class={styles.clip}>
        <For each={RENDER_ORDER}>{(partName) => {
          const spriteData = () => {
            const info = props.parts.get(partName);
            if (!info || info.mainPart !== props.partType) return null;
            if (partName === 'bd' || partName === 'lh' || partName === 'rh') return null;
            const spriteName = buildSpriteName('h', 'std', partName, info.modelNum, 2, 0);
            const si = getSpriteInfo(spriteName);
            if (!si) return null;
            const spriteKey = `sprites/${si.imageId}`;
            return { si, key: spriteKey };
          };

          return (
            <Show when={spriteData()}>
              {(sd) => {
                // Ref-counted SVG lifecycle — acquire blob URL on key change, release on cleanup.
                // SolidJS disposes <Show> children when condition becomes false —
                // onCleanup releases the last held key to prevent blob URL leaks.
                let prevKey: string | null = null;
                createEffect(on(
                  () => sd().key,
                  (key) => {
                    if (prevKey) removeNeededKey(prevKey);
                    prevKey = key;
                    if (key) addNeededKey(key);
                  }
                ));
                onCleanup(() => { if (prevKey) { removeNeededKey(prevKey); prevKey = null; } });

                const info = () => props.parts.get(partName);
                const rasterTint = () => partName === 'ey' ? '' : getRasterTintClass(info()?.color ?? '');
                const vectorTint = () => partName === 'ey' ? '' : getVectorTintClass(info()?.color ?? '');
                const svgUrl = () => getSvgBlobUrl(sd().key);

                return (
                  <Show when={svgUrl()} fallback={
                    <div
                      class={`${styles.part} ${styles.raster} ${getRegionClass(sd().key)} ${getAtlasPageClass(sd().key)} ${
                        getPreviewOffsetClass(sd().si.imageId, props.partType)} ${rasterTint()}`}
                      role="img"
                      aria-label={PART_LABELS[partName] ?? partName}
                    />
                  }>
                    {(url) => (
                      <img
                        src={url()}
                        class={`${styles.part} ${styles.vector} ${getRegionClass(sd().key)} ${
                          getPreviewOffsetClass(sd().si.imageId, props.partType)} ${vectorTint()}`}
                        alt={PART_LABELS[partName] ?? partName}
                        draggable={false}
                      />
                    )}
                  </Show>
                );
              }}
            </Show>
          );
        }}</For>
      </div>
    </div>
  );
}
