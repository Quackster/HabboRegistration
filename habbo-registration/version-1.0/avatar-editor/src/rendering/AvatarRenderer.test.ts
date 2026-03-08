import { describe, it, expect } from 'vitest';
import { buildSpriteName, getActionForPart } from './AvatarRenderer';

describe('AvatarRenderer', () => {
  describe('buildSpriteName', () => {
    it('builds correct sprite name', () => {
      expect(buildSpriteName('h', 'std', 'bd', '001', 2, 0)).toBe('h_std_bd_001_2_0');
    });

    it('includes walk frame', () => {
      expect(buildSpriteName('h', 'wlk', 'bd', '001', 2, 3)).toBe('h_wlk_bd_001_2_3');
    });
  });

  describe('getActionForPart', () => {
    it('returns std for std action', () => {
      expect(getActionForPart('bd', 'std', 0)).toEqual({ action: 'std', frame: 0 });
    });

    it('returns wlk with frame for walk-affected parts', () => {
      expect(getActionForPart('bd', 'wlk', 2)).toEqual({ action: 'wlk', frame: 2 });
    });

    it('returns std for parts not affected by walk', () => {
      expect(getActionForPart('hr', 'wlk', 2)).toEqual({ action: 'std', frame: 0 });
    });

    it('returns std for eyes during walk', () => {
      expect(getActionForPart('ey', 'wlk', 2)).toEqual({ action: 'std', frame: 0 });
    });

    it('returns action with frame 0 for non-walk actions', () => {
      expect(getActionForPart('ls', 'wav', 0)).toEqual({ action: 'wav', frame: 0 });
    });

    it('returns std for parts not affected by wav', () => {
      expect(getActionForPart('bd', 'wav', 0)).toEqual({ action: 'std', frame: 0 });
    });
  });
});
