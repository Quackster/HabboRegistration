declare global {
  interface Window {
    HabboRegistrationConfig?: {
      figure?: string;
      gender?: string;
      assetsPath?: string;
      post_url?: string;
      post_enabled?: boolean;
      post_figure?: string;
      post_gender?: string;
      container?: string;
      backgroundColor?: string;
      textColor?: string;
      localization_url?: string;
    };
    HabboRegistration?: {
      setGenderAndFigure?: (gender: string, figure: string) => void;
      setAllowedToProceed?: (allowed: boolean) => void;
      onSubmit?: (gender: string, figure: string) => void;
    };
  }
}

export function getConfig() {
  const cfg = window.HabboRegistrationConfig || {};
  return {
    figure: cfg.figure || "",
    gender: cfg.gender || "",
    rawFigure: cfg.figure,
    rawGender: cfg.gender,
    assetsPath: cfg.assetsPath || "./",
    postUrl: cfg.post_url || "",
    postEnabled: cfg.post_enabled ?? false,
    postFigure: cfg.post_figure || "figure",
    postGender: cfg.post_gender || "gender",
    container: cfg.container || "editor-container",
    backgroundColor: cfg.backgroundColor || "",
    textColor: cfg.textColor || "",
    localizationUrl: cfg.localization_url || "data/figure_editor.xml",
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

export function sendSubmit(gender: string, figure: string): void {
  const cb = window.HabboRegistration?.onSubmit;
  if (cb) {
    cb(gender, figure);
  }
}

export function submitFormPost(gender: string, figure: string): void {
  const config = getConfig();
  if (!config.postEnabled || !config.postUrl) return;

  window.location.href =
    config.postUrl +
    config.postGender +
    "=" +
    gender +
    "&" +
    config.postFigure +
    "=" +
    figure;
}
