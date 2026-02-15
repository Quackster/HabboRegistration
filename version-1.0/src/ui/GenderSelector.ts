import { GENDER_BOY_X, GENDER_GIRL_X, GENDER_Y, GENDER_LABEL_Y } from '../config';
import { getText } from '../data/Localization';
import { getUIAsset } from '../rendering/UIAssets';
import * as state from '../model/EditorState';
import { addHitRegion } from './HitRegion';

export function setupGenderSelector(onGenderChange: (gender: string) => void): void {
  // Boy radio
  addHitRegion({
    x: GENDER_BOY_X - 5,
    y: GENDER_Y - 5,
    width: 50,
    height: 24,
    id: 'gender',
    onClick: () => {
      if (state.chosenGender !== 'male') {
        onGenderChange('male');
      }
    },
  });

  // Girl radio
  addHitRegion({
    x: GENDER_GIRL_X - 5,
    y: GENDER_Y - 5,
    width: 50,
    height: 24,
    id: 'gender',
    onClick: () => {
      if (state.chosenGender !== 'female') {
        onGenderChange('female');
      }
    },
  });
}

export function drawGenderSelector(ctx: CanvasRenderingContext2D): void {
  const isMale = state.chosenGender === 'male';

  // Labels
  ctx.font = 'bold 11px Verdana';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'center';
  ctx.fillText(getText('boy'), GENDER_BOY_X + 8, GENDER_LABEL_Y + 11);
  ctx.fillText(getText('girl'), GENDER_GIRL_X + 8, GENDER_LABEL_Y + 11);

  // Radio buttons using original Flash images
  const radioOn = getUIAsset('radioOn');
  const radioOff = getUIAsset('radioOff');

  if (radioOn && radioOff) {
    ctx.drawImage(isMale ? radioOn : radioOff, GENDER_BOY_X, GENDER_Y);
    ctx.drawImage(!isMale ? radioOn : radioOff, GENDER_GIRL_X, GENDER_Y);
  }
}
