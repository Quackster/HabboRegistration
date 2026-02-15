import { UIAssets } from './UIAssets';
import { HitRegionManager } from './HitRegion';
import { MAIN_MENU_STRUCT } from '../config';
import { EventBus } from '../model/EditorState';
import { LocalizationConfig } from '../config';

// Constants from MainMenu.as
const MAIN_OFFSET_X = 18;
const MAIN_OFFSET_Y = 0;
const MAIN_ITEM_WIDTH = 60;
const MAIN_ITEM_MARGIN = 5;
const SUB_OFFSET_X = 10;
const SUB_OFFSET_Y = 50;
const SUB_ITEM_WIDTH = 46;
const SUB_ITEM_GENDER_WIDTH = 130;
const SUB_ITEM_MARGIN = 12;

export class MainMenu {
  private uiAssets: UIAssets;
  private hitRegions: HitRegionManager;
  private eventBus: EventBus;
  private localization: LocalizationConfig;

  private locationX: number;
  private locationY: number;
  private openedMainIndex = 0;
  private openedIndexes: number[];

  constructor(
    x: number,
    y: number,
    uiAssets: UIAssets,
    hitRegions: HitRegionManager,
    eventBus: EventBus,
    localization: LocalizationConfig
  ) {
    this.locationX = x;
    this.locationY = y;
    this.uiAssets = uiAssets;
    this.hitRegions = hitRegions;
    this.eventBus = eventBus;
    this.localization = localization;
    this.openedIndexes = MAIN_MENU_STRUCT.map(() => 0);
  }

  showMenuIndex(mainIndex?: number, subIndex?: number): void {
    if (mainIndex !== undefined) {
      this.openedMainIndex = Math.max(0, Math.min(mainIndex, MAIN_MENU_STRUCT.length - 1));
    }
    if (subIndex !== undefined) {
      const maxSub = MAIN_MENU_STRUCT[this.openedMainIndex].items.length - 1;
      this.openedIndexes[this.openedMainIndex] = Math.max(0, Math.min(subIndex, maxSub));
    }
  }

  getMenuMainOpenedIndex(): number {
    return this.openedMainIndex;
  }

  getMenuSubOpenedIndex(): number {
    return this.openedIndexes[this.openedMainIndex];
  }

  getSelectedSetType(): string {
    const menu = MAIN_MENU_STRUCT[this.openedMainIndex];
    const subIndex = this.openedIndexes[this.openedMainIndex];
    return menu.items[subIndex];
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.hitRegions.removeByPrefix('mainmenu_');

    // Draw main tabs
    for (let i = 0; i < MAIN_MENU_STRUCT.length; i++) {
      const item = MAIN_MENU_STRUCT[i];
      const locX = this.locationX + MAIN_OFFSET_X + i * (MAIN_ITEM_WIDTH + MAIN_ITEM_MARGIN);
      const locY = this.locationY + MAIN_OFFSET_Y;
      const selected = i === this.openedMainIndex;

      // Draw background
      const bgName = selected ? 'mainMenuMainSelectedBg' : 'mainMenuMainUnselectedBg';
      const bg = this.uiAssets.get(bgName);
      if (bg) {
        ctx.drawImage(bg, locX, locY);
      }

      // Draw icon
      const selStr = selected ? 'Selected' : 'Unselected';
      const icon = this.uiAssets.get(`mainMenuMain_${item.id}_${selStr}`);
      if (icon) {
        ctx.drawImage(icon, locX + 12, locY + 5);
      }

      // Hit region
      const mainIdx = i;
      this.hitRegions.add({
        id: `mainmenu_main_${i}`,
        x: locX,
        y: locY,
        width: MAIN_ITEM_WIDTH,
        height: bg ? bg.height : 40,
        cursor: 'pointer',
        onClick: () => this.mainItemClicked(mainIdx),
      });
    }

    // Draw sub-menu
    this.drawSubMenu(ctx);
  }

  private drawSubMenu(ctx: CanvasRenderingContext2D): void {
    const menu = MAIN_MENU_STRUCT[this.openedMainIndex];
    const subItems = menu.items;
    const isGender = menu.type === 'gender';
    const locY = this.locationY + SUB_OFFSET_Y;
    const itemWidth = isGender ? SUB_ITEM_GENDER_WIDTH : SUB_ITEM_WIDTH;
    const activeSubIndex = this.openedIndexes[this.openedMainIndex];

    for (let i = 0; i < subItems.length; i++) {
      const itemId = subItems[i];
      const locX = this.locationX + SUB_OFFSET_X + i * (itemWidth + SUB_ITEM_MARGIN);
      const selected = i === activeSubIndex;

      if (isGender) {
        // Gender sub-item
        if (selected) {
          const bg = this.uiAssets.get('mainMenuSubGenderSelectedBg');
          if (bg) ctx.drawImage(bg, locX, locY);
        } else {
          this.drawSubUnselectedBg(ctx, locX, locY, SUB_ITEM_GENDER_WIDTH, 35);
        }

        const icon = this.uiAssets.get(`mainMenuSub_${itemId}`);
        if (icon) {
          ctx.drawImage(icon, locX + 5, locY);
        }

        // Draw gender text
        const genderText = itemId === 'male' ? this.localization.boy : this.localization.girl;
        ctx.save();
        ctx.font = 'bold 12px Verdana';
        ctx.fillStyle = '#000000';
        ctx.textBaseline = 'middle';
        const textX = locX + (icon ? icon.width + 10 : 50);
        const textY = locY + 17;
        ctx.fillText(genderText, textX, textY);
        ctx.restore();

        this.hitRegions.add({
          id: `mainmenu_sub_${i}`,
          x: locX,
          y: locY,
          width: SUB_ITEM_GENDER_WIDTH,
          height: 35,
          cursor: 'pointer',
          onClick: () => this.subItemClicked(i, itemId),
        });
      } else {
        // Part type sub-item
        if (selected) {
          const bg = this.uiAssets.get('mainMenuSubSelectedBg');
          if (bg) ctx.drawImage(bg, locX, locY);
        } else {
          this.drawSubUnselectedBg(ctx, locX, locY, SUB_ITEM_WIDTH, 40);
        }

        const icon = this.uiAssets.get(`mainMenuSub_${itemId}`);
        if (icon) {
          ctx.drawImage(icon, locX + 5, locY);
        }

        this.hitRegions.add({
          id: `mainmenu_sub_${i}`,
          x: locX,
          y: locY,
          width: SUB_ITEM_WIDTH,
          height: 40,
          cursor: 'pointer',
          onClick: () => this.subItemClicked(i, itemId),
        });
      }
    }
  }

  private drawSubUnselectedBg(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number
  ): void {
    const r = 6;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.fillStyle = '#CCCCCC';
    ctx.fill();
  }

  private mainItemClicked(index: number): void {
    this.openedMainIndex = index;
    const subIndex = this.openedIndexes[this.openedMainIndex];
    const selectedSetType = MAIN_MENU_STRUCT[this.openedMainIndex].items[subIndex];
    this.eventBus.emit('setTypeSelected', { setType: selectedSetType });
  }

  private subItemClicked(index: number, itemId: string): void {
    this.openedIndexes[this.openedMainIndex] = index;
    this.eventBus.emit('setTypeSelected', { setType: itemId });
  }
}
