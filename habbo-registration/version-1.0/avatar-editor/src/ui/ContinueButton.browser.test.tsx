import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from 'vitest-browser-solid';
import ContinueButton from './ContinueButton';

vi.mock('../config', () => ({
  CONTINUE_DELAY: 100, // Short delay for testing
}));

vi.mock('../data/Layout', () => ({
  coord: (key: string) => {
    const coords: Record<string, number> = {
      continue_x: 300, continue_y: 280,
      continue_w: 90, continue_h: 25,
      font_size: 11, letter_spacing: 0,
    };
    return coords[key] ?? 0;
  },
}));

vi.mock('../data/Localization', () => ({
  getText: (key: string) => key === 'continue' ? 'Continue' : key,
}));

// Mock atlas-sprites.css — generated at build time, not available in test environment.
vi.mock('../data/atlas-sprites.css', () => ({}));

// Mock atlas: raster-only rendering via CSS class-based helpers.
vi.mock('../rendering/Atlas', () => ({
  getAtlasPageClass: () => 'ae-ap-0',
  getRegionClass: (key: string) => `ae-r-${key.replace(/\//g, '-')}`,
}));

vi.mock('./clickThrottle', () => ({
  isThrottled: () => false,
  triggerThrottle: () => {},
}));

describe('ContinueButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts inactive with opacity 0.5', () => {
    const screen = render(() => <ContinueButton onContinue={() => {}} />);
    const btn = screen.container.firstElementChild as HTMLElement;
    // Computed opacity from CSS module class .disabled
    expect(getComputedStyle(btn).opacity).toBe('0.5');
  });

  it('activates after delay with opacity 1', async () => {
    const screen = render(() => <ContinueButton onContinue={() => {}} />);
    const btn = screen.container.firstElementChild as HTMLElement;
    vi.advanceTimersByTime(150);
    // SolidJS needs a microtask tick
    await Promise.resolve();
    expect(getComputedStyle(btn).opacity).toBe('1');
  });

  it('fires onContinue only when active', async () => {
    const onContinue = vi.fn();
    const screen = render(() => <ContinueButton onContinue={onContinue} />);
    const btn = screen.container.firstElementChild as HTMLElement;

    // Click while inactive
    btn.click();
    expect(onContinue).not.toHaveBeenCalled();

    // Activate
    vi.advanceTimersByTime(150);
    await Promise.resolve();

    // Click while active
    btn.click();
    expect(onContinue).toHaveBeenCalledOnce();
  });
});
