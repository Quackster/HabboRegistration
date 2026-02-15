import { FigureDataSet } from '../data/FigureDataSet';
import { DrawOrder } from '../data/DrawOrder';
import { SymbolMap } from '../data/SymbolMap';
import { SpriteLoader } from './SpriteLoader';
import { applyColorTint, parseColor } from './ColorTint';

// Y offsets from PreviewIcon.as — shifts the rendered avatar within the 45x45 preview
const PART_Y_OFFSETS: Record<string, number> = {
  hr: 83, ha: 82, he: 82, ea: 75, fa: 72,
  hd: 78, ch: 53, ca: 53, wa: 43, lg: 32, sh: 23,
};
const PART_Y_OFFSET = -95;
const PART_X_OFFSETS: Record<string, number> = {
  hr: 1, ha: 0, he: 0, ea: -3, fa: -4,
  hd: 0, ch: 0, ca: 0, wa: 0, lg: 0, sh: -2,
};
// Flash uses 3, but that centers for the mask window (+18,+3,33x33) not the full 45x45 cell.
// Shift left to center content in the visible cell area.
const PART_X_OFFSET = -9;

const DRAW_TRANSLATE_Y = 98;
const ICON_SIZE = 45;

export class PreviewIconRenderer {
  private spriteLoader: SpriteLoader;

  constructor(spriteLoader: SpriteLoader) {
    this.spriteLoader = spriteLoader;
  }

  /**
   * Render a 45x45 preview icon for a figure set.
   * Matches PreviewIcon.as: renders parts at direction 2, excludes bd/lh/rh.
   */
  renderIcon(set: FigureDataSet, colorStr: string): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = ICON_SIZE;
    canvas.height = ICON_SIZE;
    const ctx = canvas.getContext('2d')!;

    const symbolMap = SymbolMap.getInstance();
    const drawOrder = DrawOrder.getInstance();

    const setType = set.getSetType();
    const parts = set.getParts();
    const direction = 2; // Preview always uses direction 2

    const renderOrder = drawOrder.getOrderArray(direction, 'std');

    // Skip bd, lh, rh per PreviewIcon.createBodypart()
    const skipTypes = new Set(['bd', 'lh', 'rh']);

    // Build part data with depth ordering
    const partEntries: Array<{
      partType: string;
      partId: number;
      colorable: boolean;
      depth: number;
    }> = [];

    for (const part of parts) {
      const partType = part.getPartType();
      if (skipTypes.has(partType)) continue;

      const depth = renderOrder.indexOf(partType);
      partEntries.push({
        partType,
        partId: part.getPartId(),
        colorable: part.isPartColorable(),
        depth: depth >= 0 ? depth : 999,
      });
    }

    // Sort by render order depth
    partEntries.sort((a, b) => a.depth - b.depth);

    // The preview icon offset moves the rendered avatar within the 45x45 box
    const yOff = (PART_Y_OFFSETS[setType] ?? 50) + PART_Y_OFFSET;
    const xOff = (PART_X_OFFSETS[setType] ?? 0) + PART_X_OFFSET;

    // Enable clipping to icon size
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, ICON_SIZE, ICON_SIZE);
    ctx.clip();

    for (const entry of partEntries) {
      const renderString = `h_std_${entry.partType}_${entry.partId}_${direction}_0`;
      const filename = symbolMap.getFilenameForName(renderString);
      if (!filename) continue;

      const img = this.spriteLoader.getSprite(filename);
      if (!img) continue;

      // Get sprite MC-local position
      const offset = symbolMap.getOffsetForName(renderString);

      let [r, g, b] = [255, 255, 255];
      if (entry.partType !== 'ey' && entry.colorable) {
        [r, g, b] = parseColor(colorStr);
      }

      // Original PreviewIcon.as:
      // 1. setFrameAndRegpoint renders sprite into 64x106 bitmap (sprite at MC offset + translate(0,98))
      // 2. moveY adds PART_Y_OFFSETS[setType] + PART_Y_OFFSET
      // 3. moveX adds PART_X_OFFSETS[setType] + PART_X_OFFSET
      // So final position in preview: (spriteX + xOff, spriteY + yOff)
      // where spriteX/Y = MC-local offset + translate(0,98)
      const spriteX = offset.x + xOff;
      const spriteY = offset.y + DRAW_TRANSLATE_Y + yOff;

      applyColorTint(ctx, img, r, g, b, spriteX, spriteY);
    }

    ctx.restore();
    return canvas;
  }
}
