// clickThrottle — Global click throttle shared by all button components.
//
// Any button click disables ALL buttons (opacity 0.5, cursor default) for CLICK_THROTTLE ms.
// All buttons participate: gender, part nav, color palette, rotation, randomize, continue.
// Some buttons (RandomizeButton, GenderSelector, ContinueButton) also have their own longer
// cooldowns on top of this global throttle.
//
// Module-level SolidJS signal: isThrottled() is reactive (triggers re-render in components
// that read it), triggerThrottle() starts/resets the cooldown timer.

import { createSignal } from 'solid-js';
import { CLICK_THROTTLE } from '../config';

const [throttled, setThrottled] = createSignal(false);
let timer: ReturnType<typeof setTimeout> | undefined;

export function isThrottled(): boolean { return throttled(); }

export function triggerThrottle(): void {
  if (timer !== undefined) clearTimeout(timer);
  setThrottled(true);
  timer = setTimeout(() => {
    setThrottled(false);
    timer = undefined;
  }, CLICK_THROTTLE);
}
