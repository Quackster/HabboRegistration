export class FigureDataColor {
  private paletteId: number;
  private color: string;
  private id: number;
  private index: number;
  private clubOnly: boolean;
  private selectable: boolean;

  constructor(
    paletteId: number,
    color: string,
    id: number,
    index: number,
    clubOnly: boolean,
    selectable: boolean
  ) {
    this.paletteId = paletteId;
    this.color = color;
    this.id = id;
    this.index = index;
    this.clubOnly = clubOnly;
    this.selectable = selectable;
  }

  getPaletteId(): number {
    return this.paletteId;
  }

  getColorStr(): string {
    return this.color;
  }

  getID(): number {
    return this.id;
  }

  getIndex(): number {
    return this.index;
  }

  isClubOnly(): boolean {
    return this.clubOnly;
  }

  isSelectable(): boolean {
    return this.selectable;
  }
}
