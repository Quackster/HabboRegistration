import { describe, it, expect } from 'vitest';
import { FLIP_LIST, RENDER_ORDER, PART_TYPES } from './config';

describe('config', () => {
  describe('FLIP_LIST', () => {
    it('has 8 entries', () => {
      expect(FLIP_LIST).toHaveLength(8);
    });

    it('direction 4 mirrors direction 2', () => {
      expect(FLIP_LIST[4]).toBe(FLIP_LIST[2]);
    });

    it('direction 0 maps to 0 (no flip)', () => {
      expect(FLIP_LIST[0]).toBe(0);
    });

    it('direction 7 maps to 7 (no flip)', () => {
      expect(FLIP_LIST[7]).toBe(7);
    });
  });

  describe('RENDER_ORDER', () => {
    it('has 14 entries', () => {
      expect(RENDER_ORDER).toHaveLength(14);
    });

    it('starts with left-side parts (back layer)', () => {
      expect(RENDER_ORDER[0]).toBe('li');
    });

    it('ends with right-side parts (front layer)', () => {
      expect(RENDER_ORDER[RENDER_ORDER.length - 1]).toBe('rs');
    });
  });

  describe('PART_TYPES', () => {
    it('has 5 entries', () => {
      expect(PART_TYPES).toHaveLength(5);
    });

    it('contains hr, hd, ch, lg, sh in order', () => {
      expect([...PART_TYPES]).toEqual(['hr', 'hd', 'ch', 'lg', 'sh']);
    });
  });
});
