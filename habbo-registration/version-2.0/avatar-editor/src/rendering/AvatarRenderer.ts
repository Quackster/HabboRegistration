import { Figure } from '../model/Figure';
import { FigureData } from '../data/FigureData';
import { DrawOrder } from '../data/DrawOrder';
import { SymbolMap } from '../data/SymbolMap';
import { SpriteLoader } from './SpriteLoader';
import { applyColorTint, parseColor } from './ColorTint';
import {
  FLIP_LIST,
  AVATAR_CANVAS_WIDTH,
  AVATAR_CANVAS_HEIGHT,
  FLIP_WIDTH,
} from '../config';

// The Flash BitmapData.draw transform: translate(0, canvasHeight + offsetY) = translate(0, 106 + (-8)) = translate(0, 98)
const DRAW_TRANSLATE_Y = 98;

interface PartEntry {
  partType: string;
  partId: number;
  colorStr: string;
  colorable: boolean;
}

export class AvatarRenderer {
  private spriteLoader: SpriteLoader;
  private debugLogDone = false;

  constructor(spriteLoader: SpriteLoader) {
    this.spriteLoader = spriteLoader;
  }

  /**
   * Collect parts and hidden layers from a figure.
   */
  private collectParts(figure: Figure): {
    partsMap: Map<string, PartEntry[]>;
    hiddenLayers: string[];
  } {
    const fd = FigureData.getInstance();
    const partsMap: Map<string, PartEntry[]> = new Map();
    const hiddenLayers: string[] = [];

    for (const item of figure.getFigureData()) {
      const setId = item.getSetId();
      const colorId = item.getColorId();
      const colorData = fd.getColorData(colorId);
      const colorStr = colorData ? colorData.getColorStr() : 'FFFFFF';
      const setData = fd.getSetForId(setId);

      if (setData) {
        hiddenLayers.push(...setData.getHiddenLayers());
        for (const part of fd.getPartsForSetId(setId)) {
          const partType = part.getPartType();
          if (!partsMap.has(partType)) {
            partsMap.set(partType, []);
          }
          partsMap.get(partType)!.push({
            partType,
            partId: part.getPartId(),
            colorStr,
            colorable: part.isPartColorable(),
          });
        }
      }
    }

    // hr/hrb hide logic from AvatarImage.hideLayers()
    // If the figure has hrb parts and hrb is not currently hidden, hide hr (show hrb only)
    if (partsMap.has('hrb') && !hiddenLayers.includes('hrb')) {
      hiddenLayers.push('hr');
    }

    return { partsMap, hiddenLayers };
  }

  /**
   * Render avatar directly onto a target canvas at the specified position with scale.
   * Matches the original AvatarImage.drawAvatar() + GraphicLoader.getPartBitmap() pipeline.
   */
  drawAvatarToCanvas(
    targetCtx: CanvasRenderingContext2D,
    figure: Figure,
    direction: number,
    x: number,
    y: number,
    scale: number
  ): void {
    const drawOrder = DrawOrder.getInstance();
    const symbolMap = SymbolMap.getInstance();

    const flipDir = FLIP_LIST[direction];
    const needsFlip = direction !== flipDir;

    let renderOrder = drawOrder.getOrderArray(flipDir, 'std');
    if (renderOrder.length === 0) {
      renderOrder = ['li', 'lh', 'ls', 'bd', 'sh', 'lg', 'ch', 'wa', 'hd', 'fc', 'ey', 'hr', 'hrb', 'ri', 'rh', 'rs', 'ea', 'ca', 'fa', 'ha', 'he'];
    }

    const { partsMap, hiddenLayers } = this.collectParts(figure);

    const doDebugLog = !this.debugLogDone;
    if (doDebugLog) {
      this.debugLogDone = true;
      console.log(`[AvatarRenderer] Direction=${direction}, flipDir=${flipDir}, needsFlip=${needsFlip}`);
      console.log(`[AvatarRenderer] Draw order (${renderOrder.length} layers):`, renderOrder.join(', '));
      console.log(`[AvatarRenderer] Parts available:`, Array.from(partsMap.keys()).join(', '));
      console.log(`[AvatarRenderer] Hidden layers:`, hiddenLayers.join(', ') || '(none)');
    }

    // Render to offscreen 64x106 canvas
    const offscreen = document.createElement('canvas');
    offscreen.width = AVATAR_CANVAS_WIDTH;
    offscreen.height = AVATAR_CANVAS_HEIGHT;
    const offCtx = offscreen.getContext('2d')!;

    let renderedCount = 0;

    for (const layerName of renderOrder) {
      if (hiddenLayers.includes(layerName)) continue;
      const layerParts = partsMap.get(layerName);
      if (!layerParts) continue;

      for (const part of layerParts) {
        const renderString = `h_std_${part.partType}_${part.partId}_${flipDir}_0`;
        const filename = symbolMap.getFilenameForName(renderString);
        if (!filename) {
          if (doDebugLog) console.warn(`[AvatarRenderer] No sprite found for: ${renderString}`);
          continue;
        }

        const img = this.spriteLoader.getSprite(filename);
        if (!img) {
          if (doDebugLog) console.warn(`[AvatarRenderer] Sprite not loaded: ${filename} (${renderString})`);
          continue;
        }

        // Get sprite offset from SVG shape data
        // These are MC-local coordinates: where the image sits in the sprite's coordinate system
        const offset = symbolMap.getOffsetForName(renderString);

        let [r, g, b] = [255, 255, 255];
        if (part.partType !== 'ey' && part.colorable) {
          [r, g, b] = parseColor(part.colorStr);
        }

        // Flash getPartBitmap: BitmapData(64, 106), Matrix.translate(0, 98), then draw
        // Sprite at MC-local (offset.x, offset.y) maps to bitmap (offset.x, offset.y + 98)
        const drawX = offset.x;
        const drawY = offset.y + DRAW_TRANSLATE_Y;

        if (doDebugLog) {
          console.log(`[AvatarRenderer]   ${part.partType}:${part.partId} -> ${filename} offset=(${offset.x}, ${offset.y}) draw=(${drawX}, ${drawY}) img=${img.width}x${img.height} color=${part.colorStr} tint=(${r},${g},${b})`);
        }

        applyColorTint(offCtx, img, r, g, b, drawX, drawY);
        renderedCount++;
      }
    }

    if (doDebugLog) {
      console.log(`[AvatarRenderer] Rendered ${renderedCount} sprites to ${AVATAR_CANVAS_WIDTH}x${AVATAR_CANVAS_HEIGHT} offscreen canvas`);
      console.log(`[AvatarRenderer] Drawing at screen (${x}, ${y}) scale=${scale} -> ${AVATAR_CANVAS_WIDTH * scale}x${AVATAR_CANVAS_HEIGHT * scale}`);
    }

    // Disable smoothing for crisp pixel art scaling
    const prevSmoothing = targetCtx.imageSmoothingEnabled;
    targetCtx.imageSmoothingEnabled = false;

    // Flip if needed (directions 4,5,6 use flipped versions of 2,1,0)
    if (needsFlip) {
      const flipped = document.createElement('canvas');
      flipped.width = FLIP_WIDTH;
      flipped.height = AVATAR_CANVAS_HEIGHT;
      const fCtx = flipped.getContext('2d')!;
      fCtx.translate(FLIP_WIDTH, 0);
      fCtx.scale(-1, 1);
      fCtx.drawImage(offscreen, 0, 0);

      // In Flash, flipped holders have _x = FLIP_WIDTH, which shifts the
      // flipped content right. The parent AvatarImage MC at (x, y) with
      // scale maps this to screen x + (FLIP_WIDTH - CANVAS_WIDTH) * scale.
      targetCtx.drawImage(
        flipped, 0, 0, FLIP_WIDTH, AVATAR_CANVAS_HEIGHT,
        x, y,
        FLIP_WIDTH * scale,
        AVATAR_CANVAS_HEIGHT * scale
      );
    } else {
      targetCtx.drawImage(
        offscreen, x, y,
        AVATAR_CANVAS_WIDTH * scale,
        AVATAR_CANVAS_HEIGHT * scale
      );
    }

    targetCtx.imageSmoothingEnabled = prevSmoothing;

  }
}
