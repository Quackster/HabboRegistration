// index.tsx — SolidJS entry point for the Avatar Editor.
// Mounts the AvatarEditor component tree into the configured container element.

import { render } from 'solid-js/web';
import 'virtual:layout-vars.css';
import AvatarEditor from './App';
import { getConfig } from './api/Bridge';
// Scoped CSS module class for container styling — part of library CSS output.
import styles from './App.module.css';

function init() {
  const config = getConfig();
  const container = document.getElementById(config.container);
  if (!container) {
    console.error(`No #${config.container} element found`);
    return;
  }
  container.classList.add(styles.container);
  render(() => <AvatarEditor />, container);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
