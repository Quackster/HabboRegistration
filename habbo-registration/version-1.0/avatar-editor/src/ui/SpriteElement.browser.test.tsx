import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-solid';
import SpriteElement from './SpriteElement';

// Mock atlas-sprites.css — generated at build time, not available in test environment.
vi.mock('../data/atlas-sprites.css', () => ({}));

// Mock atlas: raster-only rendering via getAtlasPageClass and getRegionClass.
vi.mock('../rendering/Atlas', () => ({
  getAtlasPageClass: (key: string) => key === 'ui/unknown' ? '' : 'ae-ap-0',
  getRegionClass: (key: string) => `ae-r-${key.replace(/\//g, '-')}`,
}));

describe('SpriteElement', () => {
  // Dimensions and backgrounds come from pre-generated atlas-sprites.css classes.
  it('renders with correct CSS classes for atlas region', async () => {
    const screen = render(() => <SpriteElement atlasKey="ui/testSprite" />);
    const el = screen.container.querySelector('div') as HTMLDivElement;
    expect(el).toBeTruthy();
    expect(el.className).toContain('ae-r-ui-testSprite');
    expect(el.className).toContain('ae-ap-0');
  });

  // SpriteElement always renders a div with CSS classes — visibility depends on atlas-sprites.css rules.
  it('renders div with region class for any atlas key', async () => {
    const screen = render(() => <SpriteElement atlasKey="ui/unknown" />);
    const el = screen.container.querySelector('div');
    expect(el).toBeTruthy();
    expect(el!.className).toContain('ae-r-ui-unknown');
  });

  it('applies additional class prop', async () => {
    const screen = render(() => (
      <SpriteElement atlasKey="ui/testSprite" class="extra-class" />
    ));
    const el = screen.container.querySelector('div') as HTMLDivElement;
    // CSS modules handle positioning via classes — verify class is applied
    expect(el.classList.contains('extra-class')).toBe(true);
  });
});
