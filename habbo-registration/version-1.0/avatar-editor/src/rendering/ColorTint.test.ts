import { describe, it, expect } from 'vitest';
import { parseColor, getTintFilterId, getRasterTintClass, getVectorTintClass, getFeColorMatrixValues } from './ColorTint';

describe('ColorTint', () => {
  describe('parseColor', () => {
    it('parses hex with # prefix', () => {
      expect(parseColor('#E8B137')).toEqual([232, 177, 55]);
    });

    it('parses hex without # prefix', () => {
      expect(parseColor('E8B137')).toEqual([232, 177, 55]);
    });

    it('returns [0,0,0] for empty string', () => {
      expect(parseColor('')).toEqual([0, 0, 0]);
    });

    it('parses white', () => {
      expect(parseColor('FFFFFF')).toEqual([255, 255, 255]);
    });

    it('parses black', () => {
      expect(parseColor('000000')).toEqual([0, 0, 0]);
    });
  });

  describe('getTintFilterId', () => {
    it('returns filter ID from RGB values', () => {
      expect(getTintFilterId(232, 177, 55)).toBe('tint-E8B137');
    });

    it('pads single-digit hex values', () => {
      expect(getTintFilterId(0, 0, 0)).toBe('tint-000000');
    });

    it('handles max values', () => {
      expect(getTintFilterId(255, 255, 255)).toBe('tint-FFFFFF');
    });
  });

  describe('getRasterTintClass', () => {
    it('returns ae-tr-HEX class for non-white color', () => {
      expect(getRasterTintClass('E8B137')).toBe('ae-tr-E8B137');
    });

    it('handles # prefix', () => {
      expect(getRasterTintClass('#E8B137')).toBe('ae-tr-E8B137');
    });

    it('returns empty string for white (no tint needed)', () => {
      expect(getRasterTintClass('FFFFFF')).toBe('');
    });

    it('returns empty string for empty string', () => {
      expect(getRasterTintClass('')).toBe('');
    });
  });

  describe('getVectorTintClass', () => {
    it('returns ae-tv-HEX class for non-white color', () => {
      expect(getVectorTintClass('E8B137')).toBe('ae-tv-E8B137');
    });

    it('handles # prefix', () => {
      expect(getVectorTintClass('#E8B137')).toBe('ae-tv-E8B137');
    });

    it('returns empty string for white (no tint needed)', () => {
      expect(getVectorTintClass('FFFFFF')).toBe('');
    });

    it('returns empty string for empty string', () => {
      expect(getVectorTintClass('')).toBe('');
    });
  });

  describe('getFeColorMatrixValues', () => {
    it('returns correct matrix values', () => {
      const values = getFeColorMatrixValues(255, 0, 0);
      expect(values).toBe('1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0');
    });

    it('white produces identity-like matrix', () => {
      const values = getFeColorMatrixValues(255, 255, 255);
      expect(values).toBe('1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0');
    });
  });
});
