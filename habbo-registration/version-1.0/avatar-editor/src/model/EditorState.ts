export type EditorEvent =
  | 'figureChanged'
  | 'genderChanged'
  | 'directionChanged'
  | 'actionChanged'
  | 'colorChanged'
  | 'animationTick'
  | 'redraw';

type Listener = () => void;

class EventBus {
  private listeners: Map<string, Listener[]> = new Map();

  on(event: EditorEvent, fn: Listener): void {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(fn);
  }

  emit(event: EditorEvent): void {
    const fns = this.listeners.get(event);
    if (fns) fns.forEach(fn => fn());
  }
}

export const events = new EventBus();

// Per-part state: [setIndex, colorIndex]
export const partState: Record<string, [number, number]> = {};

export let chosenGender = 'male';
export let direction = 4;
export let currentAction = 'std';
export let animationFrame = 0;

export function setGender(g: string): void {
  chosenGender = g;
  events.emit('genderChanged');
}

export function setDirection(d: number): void {
  direction = ((d % 8) + 8) % 8;
  events.emit('directionChanged');
}

export function rotateDirection(dir: 'prev' | 'next'): void {
  const delta = dir === 'next' ? -1 : 1;
  setDirection(direction + delta);
}

export function setAction(a: string): void {
  currentAction = a;
  animationFrame = 0;
  events.emit('actionChanged');
}

export function nextAnimationFrame(): void {
  animationFrame = (animationFrame + 1) % 4;
  events.emit('animationTick');
}

export function getGenderCode(): string {
  return chosenGender === 'female' ? 'F' : 'M';
}
