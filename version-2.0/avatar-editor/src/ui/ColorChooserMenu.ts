import { UIAssets } from './UIAssets';
import { HitRegionManager } from './HitRegion';
import { EventBus } from '../model/EditorState';
import { FigureData } from '../data/FigureData';
import { FigureDataColor } from '../data/FigureDataColor';
import { parseColor } from '../rendering/ColorTint';

const BUTTON_WIDTH = 27;
const BUTTON_HEIGHT = 27;
const MENU_MARGIN_HOR = 3;
const MENU_MARGIN_VER = 2;
const MAX_COLS = 9;
const MAX_ROWS = 4;
const COLOR_ICON_OFFSET = 3; // colorBg drawn offset +3,+3 inside button

interface ColorPageItem {
  type: 'color' | 'back' | 'forward';
  index?: number;
}

export class ColorChooserMenu {
  private uiAssets: UIAssets;
  private hitRegions: HitRegionManager;
  private eventBus: EventBus;

  private locationX: number;
  private locationY: number;
  private currentSelectedId = 0;
  private targetSetType = 'hd';
  private showClubColors = false;
  private currentPaletteId = 1;
  private pageData: ColorPageItem[][] = [];
  private currentPageIndex = 0;
  private currentSelectionPageNo = 0;

  constructor(
    x: number,
    y: number,
    uiAssets: UIAssets,
    hitRegions: HitRegionManager,
    eventBus: EventBus
  ) {
    this.locationX = x;
    this.locationY = y;
    this.uiAssets = uiAssets;
    this.hitRegions = hitRegions;
    this.eventBus = eventBus;
  }

  showColorChooser(
    paletteId: number,
    selectedId: number,
    targetSetType: string,
    showClubColors: boolean
  ): void {
    this.currentSelectedId = selectedId || 0;
    this.targetSetType = targetSetType;
    this.showClubColors = showClubColors ?? false;
    this.currentPaletteId = paletteId;
    this.currentSelectionPageNo = 0;

    const colors = FigureData.getInstance().getColorsForPaletteId(
      this.currentPaletteId, this.showClubColors, true
    );

    // Build page data (matches ColorChooserMenu.as)
    this.pageData = [];
    let currentPage: ColorPageItem[] = [];
    let pageIndex = 0;
    const maxPerPage = MAX_COLS * MAX_ROWS;
    let itemCount = 0;
    let colorIndex = 0;

    while (colorIndex < colors.length) {
      // Back arrow on pages > 0
      if (itemCount === 0 && pageIndex > 0) {
        currentPage.push({ type: 'back' });
        itemCount++;
      }

      // Forward arrow if near end of page and more items remain
      if (itemCount === maxPerPage - 1 && colorIndex < colors.length - 1) {
        currentPage.push({ type: 'forward' });
        itemCount++;
      } else {
        if (colors[colorIndex].getID() === this.currentSelectedId) {
          this.currentSelectionPageNo = pageIndex;
        }
        currentPage.push({ type: 'color', index: colorIndex });
        colorIndex++;
        itemCount++;
      }

      if (colorIndex === colors.length) {
        this.pageData.push(currentPage);
      } else if (itemCount === maxPerPage) {
        this.pageData.push(currentPage);
        itemCount = 0;
        currentPage = [];
        pageIndex++;
      }
    }

    this.currentPageIndex = this.currentSelectionPageNo;
  }

  getCurrentSelectedColorId(): number {
    return this.currentSelectedId;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.hitRegions.removeByPrefix('color_');

    if (this.pageData.length === 0) return;

    const pageNo = Math.max(0, Math.min(this.currentPageIndex, this.pageData.length - 1));
    const pageItems = this.pageData[pageNo];
    if (!pageItems) return;

    const colors = FigureData.getInstance().getColorsForPaletteId(
      this.currentPaletteId, this.showClubColors, true
    );

    let colIdx = 0;
    let rowIdx = 0;

    for (let i = 0; i < pageItems.length; i++) {
      const locX = this.locationX + colIdx * (BUTTON_WIDTH + MENU_MARGIN_HOR);
      const locY = this.locationY + rowIdx * (BUTTON_HEIGHT + MENU_MARGIN_VER);
      const item = pageItems[i];

      if (item.type === 'color' && item.index !== undefined) {
        const color = colors[item.index];
        if (!color) { colIdx++; continue; }

        const selected = color.getID() === this.currentSelectedId;
        this.drawColorButton(ctx, color, locX, locY, selected);

        const colorId = color.getID();
        const colorStr = color.getColorStr();
        this.hitRegions.add({
          id: `color_${i}`,
          x: locX,
          y: locY,
          width: BUTTON_WIDTH,
          height: BUTTON_HEIGHT,
          cursor: 'pointer',
          onClick: () => {
            this.currentSelectedId = colorId;
            this.eventBus.emit('colorSelected', {
              colorStr,
              targetSetType: this.targetSetType,
              colorId,
            });
          },
        });
      } else if (item.type === 'forward') {
        this.drawSmallArrow(ctx, 'Right', locX, locY);

        this.hitRegions.add({
          id: `color_forward`,
          x: locX,
          y: locY,
          width: BUTTON_WIDTH,
          height: BUTTON_HEIGHT,
          cursor: 'pointer',
          onClick: () => {
            this.currentPageIndex++;
            this.eventBus.emit('stateChanged');
          },
        });
      } else if (item.type === 'back') {
        this.drawSmallArrow(ctx, 'Left', locX, locY);

        this.hitRegions.add({
          id: `color_back`,
          x: locX,
          y: locY,
          width: BUTTON_WIDTH,
          height: BUTTON_HEIGHT,
          cursor: 'pointer',
          onClick: () => {
            this.currentPageIndex--;
            this.eventBus.emit('stateChanged');
          },
        });
      }

      colIdx++;
      if (colIdx >= MAX_COLS) {
        colIdx = 0;
        rowIdx++;
      }
    }
  }

  private drawColorButton(
    ctx: CanvasRenderingContext2D,
    color: FigureDataColor,
    x: number,
    y: number,
    selected: boolean
  ): void {
    const colorStr = color.getColorStr();
    const [r, g, b] = parseColor(colorStr);

    // Draw tinted colorBg
    const bgImg = this.uiAssets.get('colorBg');
    if (bgImg) {
      // Tint the color background
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = bgImg.width;
      tempCanvas.height = bgImg.height;
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.drawImage(bgImg, 0, 0);

      const imageData = tempCtx.getImageData(0, 0, bgImg.width, bgImg.height);
      const data = imageData.data;
      const rF = r / 255;
      const gF = g / 255;
      const bF = b / 255;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.round(data[i] * rF);
        data[i + 1] = Math.round(data[i + 1] * gF);
        data[i + 2] = Math.round(data[i + 2] * bF);
      }
      tempCtx.putImageData(imageData, 0, 0);
      ctx.drawImage(tempCanvas, x + COLOR_ICON_OFFSET, y + COLOR_ICON_OFFSET);
    } else {
      // Fallback: draw colored rectangle
      ctx.fillStyle = `#${colorStr}`;
      ctx.fillRect(x + COLOR_ICON_OFFSET, y + COLOR_ICON_OFFSET, 21, 21);
    }

    // Club tag
    if (color.isClubOnly()) {
      const hcTag = this.uiAssets.get('hcTagSmall');
      if (hcTag) {
        ctx.drawImage(hcTag, x + 1, y + 1);
      }
    }

    // Selection indicator
    if (selected) {
      const selImg = this.uiAssets.get('colorSelect');
      if (selImg) {
        ctx.drawImage(selImg, x, y);
      }
    }
  }

  private drawSmallArrow(ctx: CanvasRenderingContext2D, direction: string, x: number, y: number): void {
    const arrowName = direction === 'Right' ? 'arrowSmallRight' : 'arrowSmallLeft';
    const arrow = this.uiAssets.get(arrowName);
    if (arrow) {
      ctx.drawImage(arrow, x, y);
    }
  }
}
