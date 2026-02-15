import { FigureSetItem } from './FigureSetItem';
import { FigureData } from '../data/FigureData';

const SET_SEPARATOR = '.';
const SET_ITEM_SEPARATOR = '-';

const SET_TYPE_PROBABILITIES: Array<[string, string, number]> = [
  ['M', 'hr', 97], ['M', 'ha', 40], ['M', 'he', 15], ['M', 'ea', 30],
  ['M', 'fa', 15], ['M', 'ca', 10], ['M', 'wa', 40], ['M', 'sh', 95],
  ['F', 'hr', 100], ['F', 'ha', 40], ['F', 'he', 25], ['F', 'ea', 15],
  ['F', 'fa', 8], ['F', 'ca', 15], ['F', 'wa', 40], ['F', 'sh', 95],
];

export class Figure {
  private figureData: FigureSetItem[] = [];
  private gender: string = 'M';

  constructor(gender?: string, figureString?: string) {
    if (gender) this.setGender(gender);
    if (figureString) this.parseFigureString(figureString);
  }

  setGender(gender: string): void {
    switch (gender.toLowerCase()) {
      case 'm': case 'male':
        this.gender = 'M';
        break;
      case 'f': case 'female':
        this.gender = 'F';
        break;
      default:
        this.gender = gender.toUpperCase();
    }
  }

  getGender(): string {
    return this.gender;
  }

  getFigureData(): FigureSetItem[] {
    return this.figureData;
  }

  parseFigureString(figureStr: string): boolean {
    this.figureData = [];
    if (!figureStr || figureStr.length === 0) return false;

    const fd = FigureData.getInstance();
    const sets = figureStr.split(SET_SEPARATOR);
    let parsedOk = true;

    for (const setStr of sets) {
      const parts = setStr.split(SET_ITEM_SEPARATOR);
      if (parts.length !== 3) {
        this.figureData = [];
        return false;
      }

      let setType = parts[0];
      let setId = parseInt(parts[1], 10);
      let colorId = parseInt(parts[2], 10) || 0;

      const setData = fd.getSetForId(setId);
      if (setData && setData.isSelectable()) {
        if (setData.isColorable() && colorId > 0) {
          const colorData = fd.getColorData(colorId);
          if (colorData) {
            const correctPalette = colorData.getPaletteId() === setData.getPaletteId();
            if (!correctPalette) {
              const validColors = fd.getColorsForPaletteId(setData.getPaletteId(), false, true);
              if (validColors.length > 0) {
                colorId = validColors[0].getID();
                parsedOk = false;
              }
            }
          }
        }
      } else {
        const validSets = fd.getSetsForSetType(setType, this.gender, false, true);
        if (validSets.length > 0) {
          const validSet = validSets[0];
          setId = validSet.getSetId();
          const validColors = fd.getColorsForPaletteId(validSet.getPaletteId(), false, true);
          if (validColors.length > 0) {
            colorId = validColors[0].getID();
          }
          parsedOk = false;
        }
      }

      this.setSetItem(setType, setId, colorId);
    }

    const figureValid = this.validateAndFixFigure();
    return figureValid && parsedOk;
  }

  getFigureString(): string {
    const fd = FigureData.getInstance();
    const parts: string[] = [];

    for (const item of this.figureData) {
      const setType = item.getSetType();
      const setId = item.getSetId();
      const colorId = item.getColorId();
      const setData = fd.getSetForId(setId);

      let colorStr = '';
      if (setData && setData.isColorable()) {
        colorStr = String(colorId);
      }

      parts.push(`${setType}${SET_ITEM_SEPARATOR}${setId}${SET_ITEM_SEPARATOR}${colorStr}`);
    }

    return parts.join(SET_SEPARATOR);
  }

  setSetItem(setType: string, setId: number, colorId: number): void {
    for (const item of this.figureData) {
      if (item.getSetType() === setType) {
        item.setValues(setType, setId, colorId);
        return;
      }
    }
    this.figureData.push(new FigureSetItem(setType, setId, colorId));
  }

  removeSetItemByType(setType: string): void {
    const idx = this.figureData.findIndex(item => item.getSetType() === setType);
    if (idx !== -1) {
      this.figureData.splice(idx, 1);
    }
  }

  setSetTypeColor(setType: string, colorId: number): void {
    for (const item of this.figureData) {
      if (item.getSetType() === setType) {
        item.setValues(setType, item.getSetId(), colorId);
      }
    }
  }

  getSetItemById(setId: number): FigureSetItem | null {
    for (const item of this.figureData) {
      if (item.getSetId() === setId) return item;
    }
    return null;
  }

  getSetItemByType(setType: string): FigureSetItem | null {
    for (const item of this.figureData) {
      if (item.getSetType() === setType) return item;
    }
    return null;
  }

  getSetTypeColorId(setType: string): number {
    const item = this.getSetItemByType(setType);
    return item ? item.getColorId() : -1;
  }

  getClubColors(): Array<{ colorData: ReturnType<typeof FigureData.prototype.getColorData> }> {
    const fd = FigureData.getInstance();
    const clubColors: Array<{ colorData: ReturnType<typeof FigureData.prototype.getColorData> }> = [];
    for (const item of this.figureData) {
      const colorData = fd.getColorData(item.getColorId());
      if (colorData && colorData.isClubOnly()) {
        clubColors.push({ colorData });
      }
    }
    return clubColors;
  }

  getClubSets(): Array<{ setData: ReturnType<typeof FigureData.prototype.getSetForId> }> {
    const fd = FigureData.getInstance();
    const clubSets: Array<{ setData: ReturnType<typeof FigureData.prototype.getSetForId> }> = [];
    for (const item of this.figureData) {
      const setData = fd.getSetForId(item.getSetId());
      if (setData && setData.isClubOnly()) {
        clubSets.push({ setData });
      }
    }
    return clubSets;
  }

  randomizeFigure(gender: string, useClub = false): void {
    this.figureData = [];
    let actualGender = gender;
    if (gender === 'U') {
      actualGender = Math.random() < 0.5 ? 'M' : 'F';
    }
    this.setGender(actualGender);

    const fd = FigureData.getInstance();
    const setTypes = fd.getSetTypes();

    for (const [setType, mandatory] of setTypes) {
      const prob = this.getSetTypeProbability(setType);
      const randomGet = Math.floor(Math.random() * 100) <= prob;

      if (mandatory || randomGet) {
        const sets = fd.getSetsForSetType(setType, this.gender, useClub, true);
        if (sets.length === 0) continue;

        const set = sets[Math.floor(Math.random() * sets.length)];
        const paletteId = set.getPaletteId();
        let colorArr = fd.getColorsForPaletteId(paletteId, useClub, true);

        if (setType === 'hd') {
          colorArr = colorArr.slice(0, 10);
        }

        if (colorArr.length === 0) continue;
        const colorIndex = Math.floor(Math.random() * colorArr.length);
        const colorId = colorArr[colorIndex].getID();

        this.setSetItem(setType, set.getSetId(), colorId);
      }
    }
  }

  private getSetTypeProbability(setType: string): number {
    for (const [g, st, prob] of SET_TYPE_PROBABILITIES) {
      if (g === this.gender && st === setType) {
        return prob;
      }
    }
    return 30;
  }

  validateAndFixFigure(): boolean {
    const fd = FigureData.getInstance();
    const replacingSets: Array<{ setType: string; setId: number; paletteId: number }> = [];
    let wasValid = true;

    for (const item of this.figureData) {
      const setType = item.getSetType();
      const setId = item.getSetId();
      const setData = fd.getSetForId(setId);

      if (!setData || !setData.isSelectable()) {
        const newSets = fd.getSetsForSetType(setType, this.gender, false, true);
        if (newSets.length > 0) {
          replacingSets.push({
            setType: newSets[0].getSetType(),
            setId: newSets[0].getSetId(),
            paletteId: newSets[0].getPaletteId(),
          });
        }
      } else {
        const colorId = item.getColorId();
        const colorData = fd.getColorData(colorId);
        if (colorData && !colorData.isSelectable()) {
          const paletteId = colorData.getPaletteId();
          const validColors = fd.getColorsForPaletteId(paletteId, false, true);
          if (validColors.length > 0) {
            this.setSetItem(setType, setId, validColors[0].getID());
            wasValid = false;
          }
        }
      }
    }

    for (const rep of replacingSets) {
      const colors = fd.getColorsForPaletteId(rep.paletteId, false, true);
      const colorId = colors.length > 0 ? colors[0].getID() : 0;
      this.setSetItem(rep.setType, rep.setId, colorId);
      wasValid = false;
    }

    return wasValid;
  }
}
