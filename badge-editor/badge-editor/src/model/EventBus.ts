type Listener = (...args: unknown[]) => void;

const listeners: Map<string, Listener[]> = new Map();

export function on(event: string, fn: Listener): void {
  if (!listeners.has(event)) listeners.set(event, []);
  listeners.get(event)!.push(fn);
}

export function off(event: string, fn: Listener): void {
  const arr = listeners.get(event);
  if (arr) {
    const idx = arr.indexOf(fn);
    if (idx >= 0) arr.splice(idx, 1);
  }
}

export function emit(event: string, ...args: unknown[]): void {
  const arr = listeners.get(event);
  if (arr) arr.forEach((fn) => fn(...args));
}

// Event names
export const EVT_COLOR_CHANGE = 'ColorChange';
export const EVT_POSITION_CHANGE = 'PositionChange';
export const EVT_GRAPHIC_CHANGE = 'GraphicChange';
export const EVT_LAYER_TOGGLE = 'LayerToggle';
export const EVT_REDRAW = 'Redraw';
