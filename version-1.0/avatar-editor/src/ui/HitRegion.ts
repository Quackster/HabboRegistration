export interface HitRegionDef {
  x: number;
  y: number;
  width: number;
  height: number;
  onClick: () => void;
  id?: string;
  cursor?: string;
}

const regions: HitRegionDef[] = [];

export function addHitRegion(region: HitRegionDef): void {
  regions.push(region);
}

export function removeHitRegions(id: string): void {
  for (let i = regions.length - 1; i >= 0; i--) {
    if (regions[i].id === id) regions.splice(i, 1);
  }
}

export function clearHitRegions(): void {
  regions.length = 0;
}

export function handleClick(x: number, y: number): boolean {
  // Check in reverse order (topmost first)
  for (let i = regions.length - 1; i >= 0; i--) {
    const r = regions[i];
    if (x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height) {
      r.onClick();
      return true;
    }
  }
  return false;
}

export function getCursorAt(x: number, y: number): string {
  for (let i = regions.length - 1; i >= 0; i--) {
    const r = regions[i];
    if (x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height) {
      return r.cursor || 'pointer';
    }
  }
  return 'default';
}
