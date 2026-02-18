import { type AtlasRegion, getRegion } from './Atlas';

export function getSpriteSync(imageId: number): AtlasRegion | undefined {
  return getRegion(`sprites/${imageId}`);
}
