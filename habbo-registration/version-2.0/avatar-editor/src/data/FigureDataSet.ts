import { FigureDataPart } from './FigureDataPart';

export class FigureDataSet {
  private setId: number;
  private setType: string;
  private paletteId: number;
  private gender: string;
  private clubOnly: boolean;
  private selectable: boolean;
  private colorable: boolean;
  private parts: FigureDataPart[];
  private hiddenLayers: string[];

  constructor(
    setId: number,
    setType: string,
    paletteId: number,
    gender: string,
    parts: FigureDataPart[],
    clubOnly: boolean,
    selectable: boolean,
    colorable: boolean,
    hiddenLayers: string[]
  ) {
    this.setId = setId;
    this.setType = setType;
    this.paletteId = paletteId;
    this.gender = gender;
    this.clubOnly = clubOnly;
    this.selectable = selectable;
    this.colorable = colorable;
    this.parts = parts;
    this.hiddenLayers = hiddenLayers;
  }

  getSetId(): number {
    return this.setId;
  }

  getSetType(): string {
    return this.setType;
  }

  getPaletteId(): number {
    return this.paletteId;
  }

  getGender(): string {
    return this.gender;
  }

  isClubOnly(): boolean {
    return this.clubOnly;
  }

  isSelectable(): boolean {
    return this.selectable;
  }

  isColorable(): boolean {
    return this.colorable;
  }

  getParts(): FigureDataPart[] {
    return this.parts;
  }

  getHiddenLayers(): string[] {
    return this.hiddenLayers;
  }
}
