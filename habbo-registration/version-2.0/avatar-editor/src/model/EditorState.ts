import { Figure } from './Figure';
import { DEFAULT_DIRECTION, DEFAULT_SET_TYPE } from '../config';

export type EditorEvent =
  | 'setTypeSelected'
  | 'setSelected'
  | 'colorSelected'
  | 'randomizeAvatar'
  | 'stateChanged';

export interface SetTypeSelectedData {
  setType: string;
}

export interface SetSelectedData {
  setId: number;
  setType: string;
}

export interface ColorSelectedData {
  colorStr: string;
  targetSetType: string;
  colorId: number;
}

type EventCallback = (data: unknown) => void;

export class EventBus {
  private listeners: Map<EditorEvent, EventCallback[]> = new Map();

  on(event: EditorEvent, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: EditorEvent, callback: EventCallback): void {
    const cbs = this.listeners.get(event);
    if (cbs) {
      const idx = cbs.indexOf(callback);
      if (idx !== -1) cbs.splice(idx, 1);
    }
  }

  emit(event: EditorEvent, data?: unknown): void {
    const cbs = this.listeners.get(event);
    if (cbs) {
      for (const cb of cbs) {
        cb(data);
      }
    }
  }
}

export class EditorState {
  figure: Figure;
  storedMaleFigure: Figure;
  storedFemaleFigure: Figure;
  mainMenuIndex = 0;
  subMenuIndex = 0;
  currentSetType: string = DEFAULT_SET_TYPE;
  bodyPartPage = 0;
  colorPage = 0;
  avatarDirection: number = DEFAULT_DIRECTION;
  userHasClub: boolean;
  showClubSelections: boolean;
  eventBus: EventBus;

  constructor(userHasClub: boolean, showClubSelections: boolean) {
    this.userHasClub = userHasClub;
    this.showClubSelections = showClubSelections;
    this.figure = new Figure();
    this.storedMaleFigure = new Figure('M');
    this.storedFemaleFigure = new Figure('F');
    this.eventBus = new EventBus();
  }
}
