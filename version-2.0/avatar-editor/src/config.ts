export interface EditorConfig {
  figure: string;
  gender: string;
  userHasClub: boolean;
  showClubSelections: boolean;
  assetsPath: string;
  menuState?: string;
  localization: LocalizationConfig;
}

export interface LocalizationConfig {
  randomize: string;
  boy: string;
  girl: string;
}

export const DEFAULT_CONFIG: EditorConfig = {
  figure: '',
  gender: 'U',
  userHasClub: false,
  showClubSelections: true,
  assetsPath: '',
  localization: {
    randomize: 'Randomize',
    boy: 'Boy',
    girl: 'Girl',
  },
};

export const CANVAS_WIDTH = 495;
export const CANVAS_HEIGHT = 400; // Flash stage is 435x400 (confirmed from FFDEC frame exports)

export const AVATAR_CANVAS_WIDTH = 64;
export const AVATAR_CANVAS_HEIGHT = 106;
export const AVATAR_CANVAS_OFFSET_X = 0;
export const AVATAR_CANVAS_OFFSET_Y = -8; // translates to height + offset = 106 + (-8) = 98

export const FLIP_WIDTH = 68;
export const AVATAR_SCALE = 2;
export const AVATAR_DISPLAY_X = 323;
export const AVATAR_DISPLAY_Y = 70;

export const DEFAULT_DIRECTION = 4;
export const DEFAULT_SET_TYPE = 'hd';

export const FLIP_LIST = [0, 1, 2, 3, 2, 1, 0, 7];

export const MAIN_MENU_STRUCT = [
  { id: 'body', type: 'gender', items: ['male', 'female'] },
  { id: 'head', type: 'part', items: ['hr', 'ha', 'he', 'ea', 'fa'] },
  { id: 'chest', type: 'part', items: ['ch', 'ca'] },
  { id: 'legs', type: 'part', items: ['lg', 'sh', 'wa'] },
];
