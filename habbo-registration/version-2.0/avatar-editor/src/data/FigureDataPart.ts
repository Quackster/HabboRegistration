export class FigureDataPart {
  private partId: number;
  private partType: string;
  private colorable: boolean;

  constructor(partId: number, partType: string, colorable: boolean) {
    this.partId = partId;
    this.partType = partType;
    this.colorable = colorable;
  }

  getPartId(): number {
    return this.partId;
  }

  getPartType(): string {
    return this.partType;
  }

  isPartColorable(): boolean {
    return this.colorable;
  }
}
