// GenderSelector — Boy/Girl radio buttons with text labels.
//
// CSS module classes with layout vars and calc() for positioning. Text color
// via ae-text-color class from atlas-sprites.css. classList toggles .enabled/.disabled.
// No inline style attributes.

import { createSignal, onCleanup } from 'solid-js';
import '../data/atlas-sprites.css';
import { GENDER_COOLDOWN } from '../config';
import { getText } from '../data/Localization';
import { isThrottled, triggerThrottle } from './clickThrottle';
import SpriteElement from './SpriteElement';
import styles from './GenderSelector.module.css';

export default function GenderSelector(props: {
  gender: string;
  onChange: (gender: string) => void;
}) {
  const isMale = () => props.gender === 'male';
  const [ready, setReady] = createSignal(true);
  let cooldownTimer: ReturnType<typeof setTimeout> | undefined;

  onCleanup(() => { if (cooldownTimer !== undefined) clearTimeout(cooldownTimer); });

  const enabled = () => ready() && !isThrottled();

  function handleBoyClick() {
    if (!enabled() || isMale()) return;
    props.onChange('male');
    triggerThrottle();
    setReady(false);
    cooldownTimer = setTimeout(() => { setReady(true); cooldownTimer = undefined; }, GENDER_COOLDOWN);
  }

  function handleGirlClick() {
    if (!enabled() || !isMale()) return;
    props.onChange('female');
    triggerThrottle();
    setReady(false);
    cooldownTimer = setTimeout(() => { setReady(true); cooldownTimer = undefined; }, GENDER_COOLDOWN);
  }

  return (
    <>
      {/* Boy */}
      <div
        classList={{
          [styles.hitArea]: true,
          [styles.hitBoy]: true,
          [styles.enabled]: enabled(),
          [styles.disabled]: !enabled(),
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleBoyClick(); }
        }}
        onClick={handleBoyClick}
      />
      <span class={`${styles.label} ${styles.labelBoy} ae-text-color`}>
        {getText('boy')}
      </span>
      <div class={`${styles.radio} ${styles.radioBoy}`}>
        <SpriteElement atlasKey={isMale() ? 'ui/radioOn' : 'ui/radioOff'} />
      </div>

      {/* Girl */}
      <div
        classList={{
          [styles.hitArea]: true,
          [styles.hitGirl]: true,
          [styles.enabled]: enabled(),
          [styles.disabled]: !enabled(),
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleGirlClick(); }
        }}
        onClick={handleGirlClick}
      />
      <span class={`${styles.label} ${styles.labelGirl} ae-text-color`}>
        {getText('girl')}
      </span>
      <div class={`${styles.radio} ${styles.radioGirl}`}>
        <SpriteElement atlasKey={!isMale() ? 'ui/radioOn' : 'ui/radioOff'} />
      </div>
    </>
  );
}
