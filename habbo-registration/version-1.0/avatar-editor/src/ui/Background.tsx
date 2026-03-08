// Background — Renders the editor background panel as a CSS sprite.
// CSS module class .background with layout var --ae-background-y for vertical positioning.

import SpriteElement from './SpriteElement';
import styles from './Background.module.css';

export default function Background() {
  return (
    <SpriteElement
      atlasKey="ui/background"
      class={styles.background}
    />
  );
}
