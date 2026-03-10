import { describe, it, expect } from 'vitest';
import { parseFigureString, encodeFigureString, padColorIndex } from './FigureString';

describe('FigureString', () => {
  describe('parseFigureString', () => {
    it('parses a 25-char figure string into 5 slices', () => {
      const slices = parseFigureString('1750118022210132810129003');
      expect(slices).toHaveLength(5);
      expect(slices[0]).toEqual({ modelId: '175', colorIdx: '01' });
      expect(slices[1]).toEqual({ modelId: '180', colorIdx: '22' });
      expect(slices[2]).toEqual({ modelId: '210', colorIdx: '13' });
      expect(slices[3]).toEqual({ modelId: '281', colorIdx: '01' });
      expect(slices[4]).toEqual({ modelId: '290', colorIdx: '03' });
    });

    it('returns defaults for invalid length', () => {
      const slices = parseFigureString('abc');
      expect(slices).toHaveLength(5);
      for (const s of slices) {
        expect(s).toEqual({ modelId: '001', colorIdx: '01' });
      }
    });
  });

  describe('encodeFigureString', () => {
    it('encodes slices back to 25-char string', () => {
      const slices = [
        { modelId: '175', colorIdx: '01' },
        { modelId: '180', colorIdx: '22' },
        { modelId: '210', colorIdx: '13' },
        { modelId: '281', colorIdx: '01' },
        { modelId: '290', colorIdx: '03' },
      ];
      expect(encodeFigureString(slices)).toBe('1750118022210132810129003');
    });

    it('pads short model IDs and color indices', () => {
      const slices = [{ modelId: '1', colorIdx: '1' }];
      expect(encodeFigureString(slices)).toBe('00101');
    });
  });

  describe('roundtrip', () => {
    it('parse → encode → same string', () => {
      const original = '1750118022210132810129003';
      const slices = parseFigureString(original);
      expect(encodeFigureString(slices)).toBe(original);
    });
  });

  describe('padColorIndex', () => {
    it('pads single digit', () => {
      expect(padColorIndex(1)).toBe('01');
      expect(padColorIndex(9)).toBe('09');
    });

    it('does not pad double digit', () => {
      expect(padColorIndex(10)).toBe('10');
      expect(padColorIndex(22)).toBe('22');
    });
  });
});
