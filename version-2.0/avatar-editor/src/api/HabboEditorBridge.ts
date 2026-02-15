declare global {
  interface Window {
    HabboEditor?: {
      setGenderAndFigure?: (gender: string, figure: string) => void;
      setAllowedToProceed?: (allowed: boolean) => void;
      setEditorState?: (state: string) => void;
      showHabboClubNotice?: () => void;
      hideHabboClubNotice?: () => void;
      showOldFigureNotice?: () => void;
    };
  }
}

const INIT_PROCEED_TIMEOUT = 5000;

export class HabboEditorBridge {
  private initBlockActive = true;
  private editorOkToProceed = true;
  private initBlockTimer: number | null = null;

  constructor() {
    // 5-second init block before setAllowedToProceed calls pass through
    this.initBlockTimer = window.setTimeout(() => {
      this.initBlockActive = false;
      this.setAllowedToProceed(this.editorOkToProceed);
    }, INIT_PROCEED_TIMEOUT);
  }

  setGenderAndFigure(gender: string, figure: string): void {
    try {
      window.HabboEditor?.setGenderAndFigure?.(gender, figure);
    } catch (e) {
      console.warn('HabboEditor.setGenderAndFigure failed:', e);
    }
  }

  setAllowedToProceed(allowed: boolean): void {
    this.editorOkToProceed = allowed;
    if (this.initBlockActive) return;
    try {
      window.HabboEditor?.setAllowedToProceed?.(allowed);
    } catch (e) {
      console.warn('HabboEditor.setAllowedToProceed failed:', e);
    }
  }

  setEditorState(state: string): void {
    try {
      window.HabboEditor?.setEditorState?.(state);
    } catch (e) {
      console.warn('HabboEditor.setEditorState failed:', e);
    }
  }

  showHabboClubNotice(): void {
    try {
      window.HabboEditor?.showHabboClubNotice?.();
    } catch (e) {
      console.warn('HabboEditor.showHabboClubNotice failed:', e);
    }
  }

  hideHabboClubNotice(): void {
    try {
      window.HabboEditor?.hideHabboClubNotice?.();
    } catch (e) {
      console.warn('HabboEditor.hideHabboClubNotice failed:', e);
    }
  }

  showOldFigureNotice(): void {
    try {
      window.HabboEditor?.showOldFigureNotice?.();
    } catch (e) {
      console.warn('HabboEditor.showOldFigureNotice failed:', e);
    }
  }

  destroy(): void {
    if (this.initBlockTimer !== null) {
      clearTimeout(this.initBlockTimer);
    }
  }
}
