// ContinueButton — Button with delayed activation and CSS sprite background.
// CSS module classes with layout vars. classList toggles .enabled/.disabled.
// No transition on opacity (intentional — matches original behavior).

import { createSignal, onMount, onCleanup } from 'solid-js';
import { CONTINUE_DELAY } from '../config';
import { getText } from '../data/Localization';
import SpriteElement from './SpriteElement';
import { isThrottled, triggerThrottle } from './clickThrottle';
import styles from './ContinueButton.module.css';

export default function ContinueButton(props: {
  onContinue: () => void;
}) {
  const [active, setActive] = createSignal(false);
  let timer: number | undefined;

  onMount(() => {
    timer = window.setTimeout(() => {
      setActive(true);
    }, CONTINUE_DELAY);
  });

  onCleanup(() => {
    if (timer !== undefined) clearTimeout(timer);
  });

  const handleClick = () => {
    if (isThrottled() || !active()) return;
    props.onContinue();
    triggerThrottle();
    setActive(false);
    timer = window.setTimeout(() => {
      setActive(true);
    }, CONTINUE_DELAY);
  };

  const enabled = () => active() && !isThrottled();

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
      <SpriteElement atlasKey="ui/continueBtn" />
      <span class={styles.label}>
        {getText('continue')}
      </span>
    </div>
  );
}
