import { UIAssets } from './UIAssets';
import { HitRegionManager } from './HitRegion';
import { EventBus } from '../model/EditorState';
import { FigureData } from '../data/FigureData';
import { FigureDataSet } from '../data/FigureDataSet';
import { PreviewIconRenderer } from '../rendering/PreviewIconRenderer';

const MAX_COLS = 5;
const MAX_ROWS = 3;
const MENU_MARGIN = 9;
const ITEM_SIZE = 45;

interface PageItem {
  type: 'part' | 'remove' | 'back' | 'forward';
  index?: number;
}

export class BodyPartMenu {
  private uiAssets: UIAssets;
  private hitRegions: HitRegionManager;
  private eventBus: EventBus;
  private previewRenderer: PreviewIconRenderer;

  private locationX: number;
  private locationY: number;
  private useClub: boolean;

  private currentSetType = 'hd';
  private currentGender = 'M';
  private currentColor = 'FFFFFF';
  private currentSelectedId = 0;
  private setIsMandatory = true;
  private pageData: PageItem[][] = [];
  private currentPageIndex = 0;
  private currentSelectionPageNo = 0;

  // Cache preview icons
  private previewCache: Map<number, HTMLCanvasElement> = new Map();

  constructor(
    x: number,
    y: number,
    useClub: boolean,
    uiAssets: UIAssets,
    hitRegions: HitRegionManager,
    eventBus: EventBus,
    previewRenderer: PreviewIconRenderer
  ) {
    this.locationX = x;
    this.locationY = y;
    this.useClub = useClub;
    this.uiAssets = uiAssets;
    this.hitRegions = hitRegions;
    this.eventBus = eventBus;
    this.previewRenderer = previewRenderer;
  }

  showMenu(
    setType: string,
    gender: string,
    colorStr: string,
    selectedId: number,
    isMandatory: boolean
  ): void {
    this.currentSetType = setType;
    this.currentGender = gender;
    this.currentColor = colorStr || 'FDFDFD';
    this.currentSelectedId = selectedId || 0;
    this.setIsMandatory = isMandatory ?? true;
    this.previewCache.clear();

    if (this.currentSelectedId === 0) {
      this.currentSelectionPageNo = 0;
    }

    const sets = FigureData.getInstance().getSetsForSetType(
      this.currentSetType, this.currentGender, this.useClub, true
    );

    // Build page data (matches BodyPartMenu.as pagination logic)
    this.pageData = [];
    let pageIndex = 0;
    let currentPage: PageItem[] = [];
    const maxPerPage = MAX_COLS * MAX_ROWS;
    let itemCount = 0;
    let partIndex = 0;

    while (partIndex < sets.length) {
      // First item on first page: maybe add "remove" button
      if (pageIndex === 0 && partIndex === 0) {
        if (!this.setIsMandatory) {
          currentPage.push({ type: 'remove' });
          itemCount++;
        }
      } else if (itemCount === 0 && pageIndex > 0) {
        currentPage.push({ type: 'back' });
        itemCount++;
      }

      // Last slot: forward arrow if more items remain
      if (itemCount === maxPerPage - 1 && partIndex < sets.length) {
        currentPage.push({ type: 'forward' });
        itemCount++;
      } else {
        // Track which page contains the selected item
        if (sets[partIndex].getSetId() === selectedId) {
          this.currentSelectionPageNo = pageIndex;
        }
        currentPage.push({ type: 'part', index: partIndex });
        partIndex++;
        itemCount++;
      }

      if (partIndex === sets.length) {
        this.pageData.push(currentPage);
      } else if (itemCount === maxPerPage) {
        this.pageData.push(currentPage);
        itemCount = 0;
        currentPage = [];
        pageIndex++;
      }
    }

    // Handle empty sets
    if (sets.length === 0 && !this.setIsMandatory) {
      this.pageData = [[{ type: 'remove' }]];
    }

    this.currentPageIndex = this.currentSelectionPageNo;
  }

  setColor(colorStr: string): void {
    this.currentColor = colorStr;
    this.previewCache.clear();
  }

  setSelection(setId: number): void {
    this.currentSelectedId = setId;
  }

  clearSelection(): void {
    this.currentSelectedId = 0;
  }

  getCurrentSetType(): string {
    return this.currentSetType;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.hitRegions.removeByPrefix('bodypart_');

    if (this.pageData.length === 0) return;

    const pageNo = Math.max(0, Math.min(this.currentPageIndex, this.pageData.length - 1));
    const pageItems = this.pageData[pageNo];
    if (!pageItems) return;

    const sets = FigureData.getInstance().getSetsForSetType(
      this.currentSetType, this.currentGender, this.useClub, true
    );

    let colIdx = 0;
    let rowIdx = 0;

    for (let i = 0; i < pageItems.length; i++) {
      const locX = this.locationX + colIdx * (ITEM_SIZE + MENU_MARGIN);
      const locY = this.locationY + rowIdx * (ITEM_SIZE + MENU_MARGIN);
      const item = pageItems[i];

      if (item.type === 'part' && item.index !== undefined) {
        const set = sets[item.index];
        if (!set) { colIdx++; continue; }

        const setId = set.getSetId();
        const isSelected = setId === this.currentSelectedId;

        this.drawPartItem(ctx, set, locX, locY, isSelected);

        this.hitRegions.add({
          id: `bodypart_${i}`,
          x: locX,
          y: locY,
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          cursor: 'pointer',
          onClick: () => {
            this.eventBus.emit('setSelected', {
              setId: set.getSetId(),
              setType: this.currentSetType,
            });
          },
        });
      } else if (item.type === 'remove') {
        this.drawRemoveItem(ctx, locX, locY, this.currentSelectedId === 0);

        this.hitRegions.add({
          id: `bodypart_remove`,
          x: locX,
          y: locY,
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          cursor: 'pointer',
          onClick: () => {
            this.eventBus.emit('setSelected', {
              setId: 0,
              setType: this.currentSetType,
            });
          },
        });
      } else if (item.type === 'forward') {
        this.drawArrow(ctx, 'Right', locX, locY);

        this.hitRegions.add({
          id: `bodypart_forward`,
          x: locX,
          y: locY,
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          cursor: 'pointer',
          onClick: () => {
            this.currentPageIndex++;
            this.eventBus.emit('stateChanged');
          },
        });
      } else if (item.type === 'back') {
        this.drawArrow(ctx, 'Left', locX, locY);

        this.hitRegions.add({
          id: `bodypart_back`,
          x: locX,
          y: locY,
          width: ITEM_SIZE,
          height: ITEM_SIZE,
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

  private drawPartItem(
    ctx: CanvasRenderingContext2D,
    set: FigureDataSet,
    x: number,
    y: number,
    selected: boolean
  ): void {
    // Draw preview icon (clipped to cell area)
    const setId = set.getSetId();
    if (!this.previewCache.has(setId)) {
      const icon = this.previewRenderer.renderIcon(set, this.currentColor);
      this.previewCache.set(setId, icon);
    }
    const preview = this.previewCache.get(setId)!;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, ITEM_SIZE, ITEM_SIZE);
    ctx.clip();
    ctx.drawImage(preview, x, y);
    ctx.restore();

    // Draw selection highlight (grey border) for currently selected item
    if (selected) {
      const selBg = this.uiAssets.get('partSelected');
      if (selBg) {
        ctx.drawImage(selBg, x - 1, y - 1);
      }
    }

    // Draw HC tag if club item
    if (set.isClubOnly()) {
      const hcTag = this.uiAssets.get('hcTagSmall');
      if (hcTag) {
        ctx.drawImage(hcTag, x + 41, y + 25);
      }
    }
  }

  private drawRemoveItem(ctx: CanvasRenderingContext2D, x: number, y: number, selected: boolean): void {
    // partRemove shape has internal offset (6,6), so add that to the placement
    const removeIcon = this.uiAssets.get('partRemove');
    if (removeIcon) {
      ctx.drawImage(removeIcon, x + 10, y - 5);
    }

    // Draw selection highlight (grey border) for currently selected item
    if (selected) {
      const selBg = this.uiAssets.get('partSelected');
      if (selBg) {
        ctx.drawImage(selBg, x - 1, y - 1);
      }
    }
  }

  private drawArrow(ctx: CanvasRenderingContext2D, direction: string, x: number, y: number): void {
    const arrowName = direction === 'Right' ? 'partArrowRight' : 'partArrowLeft';
    const arrow = this.uiAssets.get(arrowName);
    if (arrow) {
      ctx.drawImage(arrow, x, y);
    }
  }
}
