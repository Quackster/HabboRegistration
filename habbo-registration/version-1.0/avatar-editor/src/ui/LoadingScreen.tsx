// LoadingScreen — Loading animation with cycling atlas frames.
//
// Frames stay raster-only (never vectorized). Uses pre-generated CSS sprite
// classes from atlas-sprites.css for background-image and background-position.
// CSS invert filter applied via .frame class.

import { createSignal, onMount, onCleanup } from 'solid-js';
import '../data/atlas-sprites.css';
import { getRegionClass, getAtlasPageClass } from '../rendering/Atlas';
import styles from './LoadingScreen.module.css';

const TOTAL_FRAMES = 18;
const FRAME_INTERVAL = 83; // ~12fps, matching original Flash frame rate

export default function LoadingScreen() {
  const [frame, setFrame] = createSignal(0);
  let interval: number | undefined;

  onMount(() => {
    interval = window.setInterval(() => {
      setFrame(f => (f + 1) % TOTAL_FRAMES);
    }, FRAME_INTERVAL);
  });

  onCleanup(() => {
    if (interval !== undefined) clearInterval(interval);
  });

  return (
    <div class={styles.container}>
      {(() => {
        const frameKey = () => `frames/${frame() + 1}`;
        return (
          <div class={`${styles.frame} ${getRegionClass(frameKey())} ${getAtlasPageClass(frameKey())}`} />
        );
      })()}
    </div>
  );
}
