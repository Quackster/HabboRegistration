declare global {
  interface Window {
    HabboBadgeEditorConfig?: {
      badge_data?: string;
      assetsPath?: string;
      badge_data_url?: string;
      localization_url?: string;
      groupId?: string;
    };
    HabboBadgeEditor?: {
      onSave?: (code: string, groupId: string) => void;
      onCancel?: () => void;
    };
  }
}

export function getConfig() {
  return window.HabboBadgeEditorConfig ?? {};
}

export function getAssetsPath(): string {
  const cfg = getConfig();
  const base = cfg.assetsPath ?? '';
  return base.endsWith('/') ? base : base ? base + '/' : '';
}

export function fireSave(code: string): void {
  const groupId = getConfig().groupId ?? '0';
  window.HabboBadgeEditor?.onSave?.(code, groupId);
}

export function fireCancel(): void {
  window.HabboBadgeEditor?.onCancel?.();
}
