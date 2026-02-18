import { getUI } from '../rendering/SpriteLoader';
import { addRegion } from './CanvasManager';
import { getText } from '../data/Localization';
import {
  SAVE_BUTTON_ORIGIN_X, SAVE_BUTTON_ORIGIN_Y,
  CANCEL_BUTTON_ORIGIN_X, CANCEL_BUTTON_ORIGIN_Y,
  REG_SAVEBUTTON, REG_CANCELBUTTON,
  SAVE_BTN_TEXT_X, SAVE_BTN_TEXT_Y,
  CANCEL_BTN_TEXT_X, CANCEL_BTN_TEXT_Y,
} from '../config';

/**
 * Draws Save and Cancel buttons using original SWF sprites with regPt-corrected positions.
 * Save button: sprite 346 (100x18, regPt 50,9) at origin (50, 354)
 * Cancel button: button 406 (100x18, regPt 50,9) at origin (230, 354)
 */
export function drawButtonBar(
  ctx: CanvasRenderingContext2D,
  onSave: () => void,
  onCancel: () => void
): void {
  // Save button PNG top-left = origin - regPt
  const saveBtnImg = getUI('savebutton');
  const sbX = SAVE_BUTTON_ORIGIN_X - REG_SAVEBUTTON.x;
  const sbY = SAVE_BUTTON_ORIGIN_Y - REG_SAVEBUTTON.y;
  ctx.drawImage(saveBtnImg, sbX, sbY);
  addRegion({
    x: sbX, y: sbY, w: saveBtnImg.width, h: saveBtnImg.height,
    onClick: onSave,
  });

  // Cancel button PNG top-left = origin - regPt
  const cancelBtnImg = getUI('cancelbutton');
  const cbX = CANCEL_BUTTON_ORIGIN_X - REG_CANCELBUTTON.x;
  const cbY = CANCEL_BUTTON_ORIGIN_Y - REG_CANCELBUTTON.y;
  ctx.drawImage(cancelBtnImg, cbX, cbY);
  addRegion({
    x: cbX, y: cbY, w: cancelBtnImg.width, h: cancelBtnImg.height,
    onClick: onCancel,
  });

  // Button text labels (from SWF text field placements)
  ctx.fillStyle = '#000000';
  ctx.font = '11px Verdana, Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(getText('save_btn'), SAVE_BTN_TEXT_X, SAVE_BTN_TEXT_Y);
  ctx.fillText(getText('cancel_btn'), CANCEL_BTN_TEXT_X, CANCEL_BTN_TEXT_Y);
}
