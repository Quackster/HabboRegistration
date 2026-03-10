// AvatarRenderer — Pure utility functions for avatar sprite name construction and action logic.
// Parts state lives in SolidJS signals (App.tsx); rendering is layered DOM <img> elements (AvatarDisplay.tsx).
// Exports: buildSpriteName(), getActionForPart(), PartInfo interface.

import { ACTION_PARTS } from '../config';

export interface PartInfo {
  partName: string;   // sub-part type: bd, ch, hd, etc.
  modelNum: string;   // 3-digit model number: 001, 021, etc.
  mainPart: string;   // which main part this belongs to: hr, hd, ch, lg, sh
  color: string;      // hex color string: E8B137
}

export function buildSpriteName(type: string, action: string, part: string, model: string, dir: number, frame: number): string {
  return `${type}_${action}_${part}_${model}_${dir}_${frame}`;
}

export function getActionForPart(partName: string, currentAction: string, animFrame: number): { action: string; frame: number } {
  if (currentAction === 'std') {
    return { action: 'std', frame: 0 };
  }

  // Check if this part is affected by the current action
  const affectedParts = ACTION_PARTS[currentAction];
  if (affectedParts && affectedParts.includes(partName)) {
    if (currentAction === 'wlk') {
      return { action: 'wlk', frame: animFrame };
    }
    return { action: currentAction, frame: 0 };
  }

  // Not affected by this action, use std
  return { action: 'std', frame: 0 };
}
