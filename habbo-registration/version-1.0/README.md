# Habbo Registration v1.0

TypeScript and HTML Canvas replacement for the Flash-based `HabboRegistration.swf` (v38, 2007) avatar editor. Renders entirely on a `<canvas>` element with no Flash dependency.

# Screenshot

<img width="406" height="327" alt="image" src="https://github.com/user-attachments/assets/51e02526-9b62-4c62-bf77-c049ea9a5638" />

## Requirements

- Node.js 18+
- npm

## Building

```
cd avatar-editor
npm install
npm run build
```

This runs the TypeScript compiler followed by a Vite IIFE build. Output goes to `avatar-editor/dist/habbo-registration.iife.js` (roughly 14KB).

For local development with hot reload:

```
cd avatar-editor
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Asset extraction

Sprites and UI assets are extracted from the decompiled SWF via a bundled script:

```
npm run extract-and-optimize
```

This reads from `decompiled/` (FFDEC output in the version-1.0 root) and writes to `avatar-editor/assets/`. The `optimize-assets` script packs raw PNGs at native 1x resolution into WebP atlas pages — no vectorization at build time. Vectorization happens at runtime via `libdepixelize-wasm` (see [Runtime SVG Vectorization](#runtime-svg-vectorization)).

You only need to run this once, or again if the decompiled source changes.

## Assets

The build copies `avatar-editor/assets/` into `dist/`. This folder contains:

- `data/figure_data_xml.xml` - part/set/colour definitions (original v38 format)
- `data/figure_editor.xml` - localisation strings
- `data/symbols.csv` - sprite name to filename mapping
- `data/spriteoffsets.csv` - sprite x/y offsets extracted from the decompiled SWF
- `atlas_*.webp` - packed atlas pages containing native pixel-art at 1x (sprites, UI, frames)

These must be served from the same path as the JS file (or set `assetsPath` in the config).

## Usage

### Replacing the Flash object

Remove the Flash `<object>`/`<embed>` tag and replace it with a container div and two script blocks.

The first script defines `window.HabboRegistration`, which is the callback interface the editor uses to communicate state changes back to your page. The second script loads the built JS file.

```html
<div id="editor-container"></div>

<script>
  // Callback interface - the editor calls these as the user makes changes.
  // In the original SWF these were ExternalInterface calls.
  window.HabboRegistration = {
    setGenderAndFigure: function (gender, figure) {
      // Called whenever the figure or gender changes.
      // gender: 'M' or 'F'
      // figure: numeric figure string, e.g. '1750118022210132810129003'
    },
    setAllowedToProceed: function (allowed) {
      // Called to indicate whether the current figure is valid for submission.
      // allowed: true/false
    },
  };

  // Editor config
  window.HabboRegistrationConfig = {
    figure: "1750118022210132810129003",
    gender: "M",
    assetsPath: "./",
    figuredata_url: "data/figure_data_xml.xml",
    localization_url: "data/figure_editor.xml",
  };
</script>

<script src="habbo-registration.iife.js"></script>
```

The editor attaches itself to the `#editor-container` div automatically.

### Config options

| Option             | Type   | Default                       | Description                                                                           |
| ------------------ | ------ | ----------------------------- | ------------------------------------------------------------------------------------- |
| `figure`           | string | `'1750118022210132810129003'` | Numeric figure string to load.                                                        |
| `gender`           | string | `'M'`                         | `'M'` or `'F'`.                                                                       |
| `assetsPath`       | string | `'./'`                        | Base path for the `data/`, `sprites/`, and `ui/` asset folders. Relative to the page. |
| `figuredata_url`   | string | `'figure_data_xml.xml'`       | Path to the figure data XML file, relative to `assetsPath`.                           |
| `localization_url` | string | `'figure_editor.xml'`         | Path to the localisation XML file, relative to `assetsPath`.                          |

### Reading the result

The `setGenderAndFigure` callback is the primary way to get the figure string. It fires on every change (part selection, colour change, gender switch, randomise).

## Project structure

```
version-1.0/
  avatar-editor/
    src/
      index.ts                  - Entry point, init, render loop
      config.ts                 - Layout constants and part definitions
      api/
        Bridge.ts               - window.HabboRegistration callback wrapper
      data/
        FigureData.ts           - Parses figure_data_xml.xml (parts, sets, palettes)
        Localization.ts         - Parses figure_editor.xml (UI strings)
        SymbolMap.ts            - Parses symbols.csv and spriteoffsets.csv
      model/
        EditorState.ts          - Shared editor state and event bus
        FigureString.ts         - Numeric figure string parsing and encoding
      rendering/
        Atlas.ts                - Atlas loading and runtime SVG vectorization (vectorizeSprites)
        AvatarRenderer.ts       - Full avatar rendering (all parts, directions, flipping)
        PreviewIconRenderer.ts  - Small preview icon rendering for the part navigator
        SpriteLoader.ts         - Thin wrapper over Atlas.getRegion(), returns AtlasRegion
        ColorTint.ts            - Pixel-level colour multiplication at physical resolution (srcW/srcH)
        UIAssets.ts             - UI image loading from decompiled SWF assets
      ui/
        CanvasManager.ts        - Canvas setup, input handling, render loop
        BackgroundPanel.ts      - Editor background panel
        GenderSelector.ts       - Boy/girl radio buttons
        AvatarDisplay.ts        - Avatar preview with rotation
        RotationControls.ts     - Left/right rotation arrows
        AnimationControls.ts    - Action/animation controls
        PartNavigator.ts        - Part selection arrows and preview icons
        ColorPalette.ts         - Colour palette grid with paging
        RandomizeButton.ts      - Randomise button
        ContinueButton.ts       - Continue/proceed button
        HitRegion.ts            - Click/hover region management
    scripts/
      extract-assets.ts         - Extracts sprites and data from decompiled SWF
    assets/                     - Runtime assets (copied to dist on build)
    dist/                       - Build output
  decompiled/                   - FFDEC decompiled SWF output
```

## Runtime SVG Vectorization

Avatar sprites are vectorized at runtime for resolution independence, using a two-phase approach:

- **Old behavior**: Build-time vectorize PNGs via libdepixelize-wasm → rasterize at 4x supersample via @resvg/resvg-js → downsample with Sharp lanczos3 → pack into WebP atlas. Resolution-locked at 1x.
- **New behavior**: Pack raw PNGs at native 1x into WebP atlas pages. At runtime, extract sprite pixels from atlas → vectorize in Web Worker pool via `depixelizeBatch()` → create SVG `HTMLImageElement`s at DPI-matched resolution (e.g., 4x on 2x DPI screens).
- **Changed behavior**: `AtlasRegion` now has `srcW`/`srcH` fields for physical source dimensions (distinct from logical `w`/`h`). `drawRegion()` uses `srcW`/`srcH` for the source rect. `ColorTint` operates at physical resolution for quality preservation. `@resvg/resvg-js` is no longer a dependency; `libdepixelize-wasm` moved from devDependencies to dependencies.

The app loads and renders instantly with raster sprites. Vectorization runs in the background and silently upgrades sprites when complete. On high-DPI displays or when zooming, SVG-backed sprites maintain smooth curves without pixelation.

## Origin

The source data comes from the decompiled `HabboRegistration.swf` (v38, August 2007, ActionScript 2). This single SWF contains both the editor UI and all avatar sprites. It was decompiled with FFDEC. Sprite offsets are derived from the SVG shape exports in `decompiled/shapes/`.
