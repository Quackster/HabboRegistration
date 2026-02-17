import { RENDER_ORDER, PREVIEW_OFFSETS } from '../config';
import { getSpriteInfo } from '../data/SymbolMap';
import { getSpriteSync } from './SpriteLoader';
import { applyColorTint, parseColor } from './ColorTint';
import { getUIAsset } from './UIAssets';
import { drawRegion } from './Atlas';
import { PartInfo } from './AvatarRenderer';

export function renderPreviewIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  mainPart: string,
  parts: Map<string, PartInfo>
): void {
  const offsetY = PREVIEW_OFFSETS[mainPart] || 0;
  const prevBg = getUIAsset('prevIconBg');
  const prevMask = getUIAsset('prevIconMask');

  // Draw preview icon background (47x47)
  if (prevBg) {
    drawRegion(ctx, prevBg, x + 11, y - 4);
  }

  // Clip to mask area (33x33, offset to match original Flash mask position)
  ctx.save();
  const clipX = x + 18;
  const clipY = y + 3;
  const clipW = prevMask ? prevMask.w : 33;
  const clipH = prevMask ? prevMask.h : 33;
  ctx.beginPath();
  ctx.rect(clipX, clipY, clipW, clipH);
  ctx.clip();

  // Render relevant parts at direction 2, std action
  for (const partName of RENDER_ORDER) {
    const info = parts.get(partName);
    if (!info || info.mainPart !== mainPart) continue;
    if (partName === 'bd' || partName === 'lh' || partName === 'rh') continue;

    const spriteName = `h_std_${partName}_${info.modelNum}_2_0`;
    const spriteInfo = getSpriteInfo(spriteName);
    if (!spriteInfo) continue;

    const region = getSpriteSync(spriteInfo.imageId);
    if (!region) continue;

    const drawX = x + spriteInfo.offsetX;
    const drawY = y + spriteInfo.offsetY + offsetY;

    if (partName === 'ey') {
      drawRegion(ctx, region, drawX, drawY);
    } else {
      const [r, g, b] = parseColor(info.color);
      applyColorTint(ctx, region, r, g, b, drawX, drawY);
    }
  }

  ctx.restore();
}
