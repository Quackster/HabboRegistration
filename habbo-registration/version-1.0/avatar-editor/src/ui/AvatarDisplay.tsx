// AvatarDisplay — Hybrid <div>/<img> compositing for the avatar.
//
// Raster sprites render as <div> elements with CSS sprite backgrounds (atlas page class +
// region class + offset class). SVG sprites render as <img> elements with blob URLs.
// Color tinting applied via CSS classes (feColorMatrix filter references).
// Z-ordering via .z{n} CSS classes. Flipping via .flipped class with scaleX(-1).

import { createEffect, on, onCleanup, For, Show, createSignal } from 'solid-js';
import '../data/atlas-sprites.css';
import { RENDER_ORDER, FLIP_LIST, ANIMATION_INTERVAL, PART_LABELS } from '../config';
import { getSpriteInfo } from '../data/SymbolMap';
import { getSvgBlobUrl, addNeededKey, removeNeededKey, getAtlasPageClass, getRegionClass, getSpriteOffsetClass, getSpriteOffsetFlippedClass } from '../rendering/Atlas';
import { buildSpriteName, getActionForPart, type PartInfo } from '../rendering/AvatarRenderer';
import { getRasterTintClass, getVectorTintClass } from '../rendering/ColorTint';
import styles from './AvatarDisplay.module.css';

// Pre-build z-index class name array for RENDER_ORDER (up to 14 entries)
const Z_CLASSES = Array.from({ length: 14 }, (_, i) => styles[`z${i}` as keyof typeof styles]);

export default function AvatarDisplay(props: {
  parts: Map<string, PartInfo>;
  direction: number;
  action: string;
}) {
  const [animFrame, setAnimFrame] = createSignal(0);
  let walkInterval: number | undefined;

  // Manage walk animation interval based on current action
  createEffect(() => {
    const isWalking = props.action === 'wlk';
    if (isWalking && walkInterval === undefined) {
      walkInterval = window.setInterval(() => {
        setAnimFrame(f => (f + 1) % 4);
      }, ANIMATION_INTERVAL);
    } else if (!isWalking && walkInterval !== undefined) {
      clearInterval(walkInterval);
      walkInterval = undefined;
      setAnimFrame(0);
    }
  });

  onCleanup(() => {
    if (walkInterval !== undefined) clearInterval(walkInterval);
  });

  return (
    <div class={styles.container}>
      <For each={RENDER_ORDER}>{(partName, zIndex) => {
        const info = () => props.parts.get(partName);
        const flipDir = () => FLIP_LIST[props.direction];
        const isFlipped = () => props.direction !== flipDir();

        const spriteData = () => {
          const i = info();
          if (!i) return null;
          const { action, frame } = getActionForPart(partName, props.action, animFrame());
          const name = buildSpriteName('h', action, partName, i.modelNum, flipDir(), frame);
          const si = getSpriteInfo(name);
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

              const rasterTint = () => partName === 'ey' ? '' : getRasterTintClass(info()!.color);
              const vectorTint = () => partName === 'ey' ? '' : getVectorTintClass(info()!.color);
              const svgUrl = () => getSvgBlobUrl(sd().key);

              const baseClass = () =>
                `${styles.part} ${Z_CLASSES[zIndex()] || ''} ${isFlipped() ? styles.flipped : ''} ${
                  getRegionClass(sd().key)} ${
                  isFlipped() ? getSpriteOffsetFlippedClass(sd().si.imageId) : getSpriteOffsetClass(sd().si.imageId)}`;

              return (
                <Show when={svgUrl()} fallback={
                  <div
                    class={`${baseClass()} ${styles.raster} ${getAtlasPageClass(sd().key)} ${rasterTint()}`}
                    role="img"
                    aria-label={PART_LABELS[partName] ?? partName}
                  />
                }>
                  {(url) => (
                    <img
                      src={url()}
                      class={`${baseClass()} ${styles.vector} ${vectorTint()}`}
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
  );
}
