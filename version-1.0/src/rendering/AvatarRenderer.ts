import { RENDER_ORDER, FLIP_LIST, FLIP_WIDTH, WALK_ELEMENTS, ACTION_PARTS, HEAD_ELEMENTS } from '../config';
import { getSpriteInfo } from '../data/SymbolMap';
import { getSpriteSync, loadSprite } from './SpriteLoader';
import { applyColorTint, parseColor } from './ColorTint';

export interface PartInfo {
  partName: string;   // sub-part type: bd, ch, hd, etc.
  modelNum: string;   // 3-digit model number: 001, 021, etc.
  mainPart: string;   // which main part this belongs to: hr, hd, ch, lg, sh
  color: string;      // hex color string: E8B137
}

// Current parts being rendered
const parts: Map<string, PartInfo> = new Map();

export function clearParts(): void {
  parts.clear();
}

export function clearPartsForMainPart(mainPart: string): void {
  for (const [key, info] of parts) {
    if (info.mainPart === mainPart) {
      parts.delete(key);
    }
  }
}

export function setPart(partName: string, modelNum: string, color: string, mainPart: string): void {
  parts.set(partName, { partName, modelNum, mainPart, color });
}

export function setPartColor(mainPart: string, color: string): void {
  for (const info of parts.values()) {
    if (info.mainPart === mainPart) {
      info.color = color;
    }
  }
}

export function getParts(): Map<string, PartInfo> {
  return parts;
}

function buildSpriteName(type: string, action: string, part: string, model: string, dir: number, frame: number): string {
  return `${type}_${action}_${part}_${model}_${dir}_${frame}`;
}

function getActionForPart(partName: string, currentAction: string, animFrame: number): { action: string; frame: number } {
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

export function render(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  direction: number,
  currentAction: string,
  animFrame: number,
  scale: number = 1
): void {
  const flipDir = FLIP_LIST[direction];
  const isFlipped = direction !== flipDir;

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  if (isFlipped) {
    // Mirror horizontally around the avatar center
    ctx.translate(baseX + FLIP_WIDTH * scale, baseY);
    ctx.scale(-scale, scale);
  } else {
    ctx.translate(baseX, baseY);
    ctx.scale(scale, scale);
  }

  // Draw each sub-part in depth order
  for (const partName of RENDER_ORDER) {
    const info = parts.get(partName);
    if (!info) continue;

    const { action, frame } = getActionForPart(partName, currentAction, animFrame);
    const spriteName = buildSpriteName('h', action, partName, info.modelNum, flipDir, frame);
    const spriteInfo = getSpriteInfo(spriteName);
    if (!spriteInfo) continue;

    const img = getSpriteSync(spriteInfo.imageId);
    if (!img) {
      // Load async for next frame
      loadSprite(spriteInfo.imageId);
      continue;
    }

    const drawX = spriteInfo.offsetX;
    const drawY = spriteInfo.offsetY;

    // Apply color tint (skip eyes)
    if (partName === 'ey') {
      ctx.drawImage(img, drawX, drawY);
    } else {
      const [r, g, b] = parseColor(info.color);
      applyColorTint(ctx, img, r, g, b, drawX, drawY);
    }
  }

  ctx.restore();
}

export function renderPreview(
  ctx: CanvasRenderingContext2D,
  mainPart: string,
  offsetY: number,
  scale: number = 1
): void {
  // Render parts belonging to this main part in std/dir2 for preview
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.scale(scale, scale);

  for (const partName of RENDER_ORDER) {
    const info = parts.get(partName);
    if (!info || info.mainPart !== mainPart) continue;
    if (partName === 'bd' || partName === 'lh' || partName === 'rh') continue;

    const spriteName = buildSpriteName('h', 'std', partName, info.modelNum, 2, 0);
    const spriteInfo = getSpriteInfo(spriteName);
    if (!spriteInfo) continue;

    const img = getSpriteSync(spriteInfo.imageId);
    if (!img) continue;

    const drawX = spriteInfo.offsetX;
    const drawY = spriteInfo.offsetY + offsetY;

    if (partName === 'ey') {
      ctx.drawImage(img, drawX, drawY);
    } else {
      const [r, g, b] = parseColor(info.color);
      applyColorTint(ctx, img, r, g, b, drawX, drawY);
    }
  }

  ctx.restore();
}

export async function preloadCurrentSprites(direction: number, currentAction: string): Promise<void> {
  const flipDir = FLIP_LIST[direction];
  const promises: Promise<unknown>[] = [];

  for (const partName of RENDER_ORDER) {
    const info = parts.get(partName);
    if (!info) continue;

    // Preload std frame
    const stdName = buildSpriteName('h', 'std', partName, info.modelNum, flipDir, 0);
    const stdInfo = getSpriteInfo(stdName);
    if (stdInfo) promises.push(loadSprite(stdInfo.imageId));

    // Preload action frames
    if (currentAction !== 'std') {
      const { action, frame } = getActionForPart(partName, currentAction, 0);
      if (action !== 'std') {
        if (action === 'wlk') {
          for (let f = 0; f < 4; f++) {
            const wName = buildSpriteName('h', 'wlk', partName, info.modelNum, flipDir, f);
            const wInfo = getSpriteInfo(wName);
            if (wInfo) promises.push(loadSprite(wInfo.imageId));
          }
        } else {
          const aName = buildSpriteName('h', action, partName, info.modelNum, flipDir, 0);
          const aInfo = getSpriteInfo(aName);
          if (aInfo) promises.push(loadSprite(aInfo.imageId));
        }
      }
    }
  }

  await Promise.allSettled(promises);
}
