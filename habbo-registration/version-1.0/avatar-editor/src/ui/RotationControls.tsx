// RotationControls — Left/right rotation arrow buttons.
// CSS module classes with layout vars for positioning. classList toggles
// .enabled/.disabled based on throttle state.

import { isThrottled, triggerThrottle } from './clickThrottle';
import SpriteElement from './SpriteElement';
import styles from './RotationControls.module.css';

export default function RotationControls(props: {
  onRotate: (dir: 'prev' | 'next') => void;
}) {
  function handleClick(dir: 'prev' | 'next') {
    if (isThrottled()) return;
    props.onRotate(dir);
    triggerThrottle();
  }

  return (
    <>
      <div
        role="button"
        classList={{
          [styles.button]: true,
          [styles.prev]: true,
          [styles.enabled]: !isThrottled(),
          [styles.disabled]: isThrottled(),
        }}
        tabIndex={0}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick('prev'); }
        }}
        onClick={() => handleClick('prev')}
      >
        <SpriteElement atlasKey="ui/rotateLeft" />
      </div>
      <div
        role="button"
        classList={{
          [styles.button]: true,
          [styles.next]: true,
          [styles.enabled]: !isThrottled(),
          [styles.disabled]: isThrottled(),
        }}
        tabIndex={0}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick('next'); }
        }}
        onClick={() => handleClick('next')}
      >
        <SpriteElement atlasKey="ui/rotateRight" />
      </div>
    </>
  );
}
