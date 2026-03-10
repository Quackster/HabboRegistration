// SpriteElement — Reusable component for rendering atlas-backed UI images.
//
// Raster-only: <div> with CSS sprite classes (background-image, background-position
// from pre-generated atlas-sprites.css). UI assets are not vectorized.

import '../data/atlas-sprites.css';
import { getAtlasPageClass, getRegionClass } from '../rendering/Atlas';
import styles from './SpriteElement.module.css';

export default function SpriteElement(props: { atlasKey: string; class?: string }) {
  return (
    <div class={`${styles.sprite} ${styles.raster} ${getRegionClass(props.atlasKey)} ${
      getAtlasPageClass(props.atlasKey)}${props.class ? ` ${props.class}` : ''}`} />
  );
}
