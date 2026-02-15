declare global {
  interface Window {
    HabboRegistrationConfig?: {
      figure?: string;
      gender?: string;
      assetsPath?: string;
      figuredata_url?: string;
      localization_url?: string;
    };
    HabboRegistration?: {
      setGenderAndFigure?: (gender: string, figure: string) => void;
      setAllowedToProceed?: (allowed: boolean) => void;
    };
  }
}

export function getConfig() {
  const cfg = window.HabboRegistrationConfig || {};
  return {
    figure: cfg.figure || '1750118022210132810129003',
    gender: cfg.gender || 'M',
    assetsPath: cfg.assetsPath || './',
    figuredataUrl: cfg.figuredata_url || 'figure_data_xml.xml',
    localizationUrl: cfg.localization_url || 'figure_editor.xml',
  };
}

export function sendFigure(gender: string, figure: string): void {
  const cb = window.HabboRegistration?.setGenderAndFigure;
  if (cb) {
    cb(gender, figure);
  }
}

export function sendAllowedToProceed(allowed: boolean): void {
  const cb = window.HabboRegistration?.setAllowedToProceed;
  if (cb) {
    cb(allowed);
  }
}
