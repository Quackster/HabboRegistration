import { AVATAR_X, AVATAR_Y, AVATAR_SCALE, ANIMATION_INTERVAL } from '../config';
import * as state from '../model/EditorState';
import * as renderer from '../rendering/AvatarRenderer';

let animTimerId: number | null = null;

export function drawAvatar(ctx: CanvasRenderingContext2D): void {
  renderer.render(
    ctx,
    AVATAR_X,
    AVATAR_Y,
    state.direction,
    state.currentAction,
    state.animationFrame,
    AVATAR_SCALE
  );

  if (state.currentAction === 'wlk') {
    startAnimation();
  }
}

export function startAnimation(): void {
  stopAnimation();
  animTimerId = window.setInterval(() => {
    state.nextAnimationFrame();
    state.events.emit('redraw');
  }, ANIMATION_INTERVAL);
}

export function stopAnimation(): void {
  if (animTimerId !== null) {
    clearInterval(animTimerId);
    animTimerId = null;
  }
}
