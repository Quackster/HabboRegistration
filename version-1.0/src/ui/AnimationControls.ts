import * as state from '../model/EditorState';
import { addHitRegion } from './HitRegion';

const ACTIONS = ['std', 'wlk', 'sit', 'wav', 'spk', 'lay'];
const LABELS = ['Stand', 'Walk', 'Sit', 'Wave', 'Talk', 'Lay'];

const BTN_W = 36;
const BTN_H = 16;
const BTN_GAP = 2;
const START_X = 92;
const START_Y = 264;

export function setupAnimationControls(onAction: (action: string) => void): void {
  for (let i = 0; i < ACTIONS.length; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = START_X + col * (BTN_W + BTN_GAP);
    const y = START_Y + row * (BTN_H + BTN_GAP);
    const action = ACTIONS[i];
    addHitRegion({
      x, y, width: BTN_W, height: BTN_H,
      id: 'animation',
      onClick: () => onAction(action),
    });
  }
}

export function drawAnimationControls(ctx: CanvasRenderingContext2D): void {
  for (let i = 0; i < ACTIONS.length; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = START_X + col * (BTN_W + BTN_GAP);
    const y = START_Y + row * (BTN_H + BTN_GAP);
    const isActive = state.currentAction === ACTIONS[i];

    ctx.save();
    ctx.fillStyle = isActive ? '#4A7A95' : '#8BB8CC';
    ctx.strokeStyle = '#4A7A95';
    ctx.lineWidth = 1;

    const r = 3;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + BTN_W - r, y);
    ctx.quadraticCurveTo(x + BTN_W, y, x + BTN_W, y + r);
    ctx.lineTo(x + BTN_W, y + BTN_H - r);
    ctx.quadraticCurveTo(x + BTN_W, y + BTN_H, x + BTN_W - r, y + BTN_H);
    ctx.lineTo(x + r, y + BTN_H);
    ctx.quadraticCurveTo(x, y + BTN_H, x, y + BTN_H - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 9px Verdana';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(LABELS[i], x + BTN_W / 2, y + BTN_H / 2);
    ctx.restore();
  }
}
