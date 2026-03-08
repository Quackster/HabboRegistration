import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-solid';
import GenderSelector from './GenderSelector';

// Mock dependencies
vi.mock('../config', () => ({
  CLICK_THROTTLE: 100,
  GENDER_COOLDOWN: 100,
}));

vi.mock('./clickThrottle', () => ({
  isThrottled: () => false,
  triggerThrottle: () => {},
}));

vi.mock('../data/Layout', () => ({
  coord: (key: string) => {
    const coords: Record<string, number> = {
      gender_boy_x: 20, gender_girl_x: 80,
      gender_y: 10, gender_label_y: 30,
      gender_hit_pad_x: 5, gender_hit_pad_y: 5,
      gender_hit_w: 50, gender_hit_h: 30,
      gender_label_offset_x: 15, gender_label_offset_y: 0,
      font_size: 11,
    };
    return coords[key] ?? 0;
  },
}));

vi.mock('../data/Localization', () => ({
  getText: (key: string) => key === 'boy' ? 'Boy' : 'Girl',
}));

// Mock atlas-sprites.css — generated at build time, not available in test environment.
vi.mock('../data/atlas-sprites.css', () => ({}));

// Mock atlas: raster-only rendering via CSS class-based helpers.
vi.mock('../rendering/Atlas', () => ({
  getAtlasPageClass: () => 'ae-ap-0',
  getRegionClass: (key: string) => `ae-r-${key.replace(/\//g, '-')}`,
}));

describe('GenderSelector', () => {
  it('renders boy and girl labels', () => {
    const screen = render(() => <GenderSelector gender="male" onChange={() => {}} />);
    const spans = screen.container.querySelectorAll('span');
    const texts = Array.from(spans).map(s => s.textContent);
    expect(texts).toContain('Boy');
    expect(texts).toContain('Girl');
  });

  it('fires onChange when clicking the other gender', () => {
    const onChange = vi.fn();
    const screen = render(() => <GenderSelector gender="male" onChange={onChange} />);
    // Query by computed cursor style — hit area divs are the only divs with
    // cursor: pointer (radio divs have pointer-events: none, SpriteElement doesn't set cursor)
    const clickDivs = Array.from(screen.container.querySelectorAll('div'))
      .filter(d => getComputedStyle(d).cursor === 'pointer');
    expect(clickDivs.length).toBeGreaterThanOrEqual(2);
    (clickDivs[1] as HTMLElement).click();
    expect(onChange).toHaveBeenCalledWith('female');
  });

  it('does not fire onChange when clicking current gender', () => {
    const onChange = vi.fn();
    const screen = render(() => <GenderSelector gender="male" onChange={onChange} />);
    const clickDivs = Array.from(screen.container.querySelectorAll('div'))
      .filter(d => getComputedStyle(d).cursor === 'pointer');
    (clickDivs[0] as HTMLElement).click();
    expect(onChange).not.toHaveBeenCalled();
  });
});
