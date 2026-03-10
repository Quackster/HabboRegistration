// RandomizeButton — Button with CSS sprite background and native text label.
// CSS module classes with layout vars. classList toggles .enabled/.disabled.

import { createSignal, onCleanup } from 'solid-js';
import { RANDOMIZE_COOLDOWN } from '../config';
import { getText } from '../data/Localization';
import SpriteElement from './SpriteElement';
import { isThrottled, triggerThrottle } from './clickThrottle';
import styles from './RandomizeButton.module.css';

export default function RandomizeButton(props: {
  onRandomize: () => void;
}) {
  const [ready, setReady] = createSignal(true);
  let cooldownTimer: ReturnType<typeof setTimeout> | undefined;

  onCleanup(() => {
    if (cooldownTimer !== undefined) clearTimeout(cooldownTimer);
  });

  function handleClick() {
    if (isThrottled() || !ready()) return;
    props.onRandomize();
    triggerThrottle();
    setReady(false);
    cooldownTimer = setTimeout(() => {
      setReady(true);
      cooldownTimer = undefined;
    }, RANDOMIZE_COOLDOWN);
  }

  const enabled = () => ready() && !isThrottled();

  return (
    <div
      role="button"
      classList={{
        [styles.container]: true,
        [styles.enabled]: enabled(),
        [styles.disabled]: !enabled(),
      }}
      tabIndex={0}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); }
      }}
      onClick={handleClick}
    >
      <SpriteElement atlasKey="ui/randomizeBtn" />
      <span class={styles.label}>
        {getText('randomize')}
      </span>
    </div>
  );
}
