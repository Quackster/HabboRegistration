export class FigureSetItem {
  private setType: string;
  private setId: number;
  private colorId: number;

  constructor(setType: string, setId: number, colorId: number) {
    this.setType = setType;
    this.setId = setId;
    this.colorId = colorId;
  }

  setValues(setType: string, setId: number, colorId: number): void {
    this.setType = setType;
    this.setId = setId;
    this.colorId = colorId;
  }

  getSetType(): string {
    return this.setType;
  }

  getSetId(): number {
    return this.setId;
  }

  getColorId(): number {
    return this.colorId;
  }
}
