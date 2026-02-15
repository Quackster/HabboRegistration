import {
  PART_TYPES, COLOR_PALETTE_X, COLOR_PALETTE_START_Y, COLOR_PALETTE_SPACING,
  COLORS_PER_PAGE, COLOR_COLS, COLOR_CELL_SIZE,
} from '../config';
import { parseColor } from '../rendering/ColorTint';
import { getUIAsset } from '../rendering/UIAssets';
import { addHitRegion, removeHitRegions } from './HitRegion';

interface PaletteState {
  colors: string[];
  selectedIndex: number;
  page: number;
}

const palettes: Record<string, PaletteState> = {};

let onColorSelect: ((partType: string, color: string, index: number) => void) | null = null;

export function setupColorPalette(callback: (partType: string, color: string, index: number) => void): void {
  onColorSelect = callback;
  for (const pt of PART_TYPES) {
    palettes[pt] = { colors: [], selectedIndex: 0, page: 0 };
  }
}

export function setColors(partType: string, colors: string[], selectedIndex: number): void {
  const p = palettes[partType];
  if (!p) return;
  p.colors = colors;
  p.selectedIndex = selectedIndex;
  p.page = Math.floor(selectedIndex / COLORS_PER_PAGE);
  rebuildHitRegions(partType);
}

export function updateSelectedColor(partType: string, index: number): void {
  const p = palettes[partType];
  if (!p) return;
  p.selectedIndex = index;
}

function rebuildHitRegions(partType: string): void {
  removeHitRegions(`color_${partType}`);
  const p = palettes[partType];
  if (!p) return;

  const partIdx = PART_TYPES.indexOf(partType as typeof PART_TYPES[number]);
  if (partIdx === -1) return;
  const baseX = COLOR_PALETTE_X;
  const baseY = COLOR_PALETTE_START_Y + partIdx * COLOR_PALETTE_SPACING;

  const startIdx = p.page * COLORS_PER_PAGE;
  const endIdx = Math.min(startIdx + COLORS_PER_PAGE, p.colors.length);

  for (let i = startIdx; i < endIdx; i++) {
    const localIdx = i - startIdx;
    const col = localIdx % COLOR_COLS;
    const row = Math.floor(localIdx / COLOR_COLS);
    const cx = baseX + col * COLOR_CELL_SIZE;
    const cy = baseY + row * COLOR_CELL_SIZE;

    const colorIdx = i;
    const color = p.colors[i];
    addHitRegion({
      x: cx, y: cy,
      width: COLOR_CELL_SIZE,
      height: COLOR_CELL_SIZE,
      id: `color_${partType}`,
      onClick: () => {
        p.selectedIndex = colorIdx;
        if (onColorSelect) onColorSelect(partType, color, colorIdx);
      },
    });
  }

  // Page arrows if needed
  if (p.colors.length > COLORS_PER_PAGE) {
    // Left arrow
    addHitRegion({
      x: baseX - 20, y: baseY,
      width: 18, height: 29,
      id: `color_${partType}`,
      onClick: () => {
        const totalPages = Math.ceil(p.colors.length / COLORS_PER_PAGE);
        p.page = (p.page - 1 + totalPages) % totalPages;
        rebuildHitRegions(partType);
      },
    });
    // Right arrow
    addHitRegion({
      x: baseX + 122, y: baseY,
      width: 18, height: 29,
      id: `color_${partType}`,
      onClick: () => {
        const totalPages = Math.ceil(p.colors.length / COLORS_PER_PAGE);
        p.page = (p.page + 1) % totalPages;
        rebuildHitRegions(partType);
      },
    });
  }
}

export function drawColorPalettes(ctx: CanvasRenderingContext2D): void {
  const colorBtnBg = getUIAsset('colorButtonBg');
  const inactiveBtn = getUIAsset('inactiveColorButton');
  const selector = getUIAsset('paletteSelector');
  const palArrowLeft = getUIAsset('paletteArrowLeft');
  const palArrowRight = getUIAsset('paletteArrowRight');

  for (let pi = 0; pi < PART_TYPES.length; pi++) {
    const partType = PART_TYPES[pi];
    const p = palettes[partType];
    if (!p) continue;

    const baseX = COLOR_PALETTE_X;
    const baseY = COLOR_PALETTE_START_Y + pi * COLOR_PALETTE_SPACING;

    const startIdx = p.page * COLORS_PER_PAGE;
    const endIdx = Math.min(startIdx + COLORS_PER_PAGE, p.colors.length);

    for (let i = startIdx; i < endIdx; i++) {
      const localIdx = i - startIdx;
      const col = localIdx % COLOR_COLS;
      const row = Math.floor(localIdx / COLOR_COLS);
      const cx = baseX + col * COLOR_CELL_SIZE;
      const cy = baseY + row * COLOR_CELL_SIZE;

      // Draw color button background
      if (colorBtnBg) {
        ctx.drawImage(colorBtnBg, cx, cy);
      }

      // Draw color fill on top (inset by 2px for the border)
      const [r, g, b] = parseColor(p.colors[i]);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(cx + 2, cy + 2, COLOR_CELL_SIZE - 4, COLOR_CELL_SIZE - 4);

      // Selection indicator using original selector image
      if (i === p.selectedIndex && selector) {
        ctx.drawImage(selector, cx - 1, cy - 1);
      }
    }

    // Fill empty slots with inactive button
    for (let i = endIdx - startIdx; i < COLORS_PER_PAGE; i++) {
      const col = i % COLOR_COLS;
      const row = Math.floor(i / COLOR_COLS);
      const cx = baseX + col * COLOR_CELL_SIZE;
      const cy = baseY + row * COLOR_CELL_SIZE;
      if (inactiveBtn) {
        ctx.drawImage(inactiveBtn, cx, cy);
      }
    }

    // Page arrows using original images
    if (p.colors.length > COLORS_PER_PAGE) {
      if (palArrowLeft) ctx.drawImage(palArrowLeft, baseX - 20, baseY);
      if (palArrowRight) ctx.drawImage(palArrowRight, baseX + 122, baseY);
    }
  }
}
