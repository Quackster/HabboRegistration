export interface HitRect {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  cursor?: string;
  onClick?: () => void;
}

export class HitRegionManager {
  private regions: HitRect[] = [];

  clear(): void {
    this.regions = [];
  }

  add(region: HitRect): void {
    this.regions.push(region);
  }

  remove(id: string): void {
    this.regions = this.regions.filter(r => r.id !== id);
  }

  removeByPrefix(prefix: string): void {
    this.regions = this.regions.filter(r => !r.id.startsWith(prefix));
  }

  hitTest(x: number, y: number): HitRect | null {
    // Test in reverse order (topmost first)
    for (let i = this.regions.length - 1; i >= 0; i--) {
      const r = this.regions[i];
      if (x >= r.x && x < r.x + r.width && y >= r.y && y < r.y + r.height) {
        return r;
      }
    }
    return null;
  }

  getCursorAt(x: number, y: number): string {
    const hit = this.hitTest(x, y);
    return hit?.cursor || 'default';
  }

  handleClick(x: number, y: number): boolean {
    const hit = this.hitTest(x, y);
    if (hit?.onClick) {
      hit.onClick();
      return true;
    }
    return false;
  }
}
