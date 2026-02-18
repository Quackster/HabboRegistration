import { type AtlasRegion, getRegion } from './Atlas';

export const UI_ASSET_NAMES = [
  'background', 'prevIconBg', 'prevIconMask',
  'arrowRight', 'arrowLeft', 'rotateLeft', 'rotateRight',
  'paletteArrowLeft', 'paletteArrowRight',
  'radioOn', 'radioOff',
  'colorSwatch', 'colorButtonBg', 'inactiveColorButton', 'paletteSelector',
  'continueBtn', 'backBtn', 'randomizeBtn', 'nameBg',
] as const;

export type UIAssetName = typeof UI_ASSET_NAMES[number];

export function getUIAsset(name: UIAssetName): AtlasRegion | undefined {
  return getRegion(`ui/${name}`);
}
