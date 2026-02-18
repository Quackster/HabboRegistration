export interface BadgeLayer {
  type: 'symbol' | 'base';
  symbolNum: number;   // 1-based sprite number, -1 = empty/none
  colorIndex: number;  // 1-based color index
  position: number;    // 1-9 for symbols (3x3 grid), ignored for base
  visible: boolean;
}

export function createSymbolLayer(): BadgeLayer {
  return {
    type: 'symbol',
    symbolNum: -1,
    colorIndex: 1,
    position: 5, // center
    visible: false,
  };
}

export function createBaseLayer(): BadgeLayer {
  return {
    type: 'base',
    symbolNum: 1,
    colorIndex: 1,
    position: 5,
    visible: true,
  };
}
