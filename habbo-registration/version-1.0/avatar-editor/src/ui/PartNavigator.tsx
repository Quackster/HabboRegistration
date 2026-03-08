// PartNavigator — 5 pairs of arrow buttons for cycling through part styles.
//
// CSS module classes with layout vars. Vertical position per arrow pair via ae-pay-{index}
// class from atlas-sprites.css. classList toggles .enabled/.disabled. No inline style attributes.

import { For } from 'solid-js';
import '../data/atlas-sprites.css';
import { PART_TYPES } from '../config';
import { isThrottled, triggerThrottle } from './clickThrottle';
import SpriteElement from './SpriteElement';
import styles from './PartNavigator.module.css';

export default function PartNavigator(props: {
  onNavigate: (partType: string, dir: 'prev' | 'next') => void;
}) {
  return (
    <For each={[...PART_TYPES]}>{(partType, i) => {
      function handleClick(dir: 'prev' | 'next') {
        if (isThrottled()) return;
        props.onNavigate(partType, dir);
        triggerThrottle();
      }

      return (
        <>
          {/* Left arrow (prev) */}
          <div
            class={`${styles.button} ${styles.left} ae-pay-${i()}`}
            classList={{
              [styles.enabled]: !isThrottled(),
              [styles.disabled]: isThrottled(),
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick('prev'); }
            }}
            onClick={() => handleClick('prev')}
          >
            <SpriteElement atlasKey="ui/arrowLeft" />
          </div>

          {/* Right arrow (next) */}
          <div
            class={`${styles.button} ${styles.right} ae-pay-${i()}`}
            classList={{
              [styles.enabled]: !isThrottled(),
              [styles.disabled]: isThrottled(),
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick('next'); }
            }}
            onClick={() => handleClick('next')}
          >
            <SpriteElement atlasKey="ui/arrowRight" />
          </div>
        </>
      );
    }}</For>
  );
}
