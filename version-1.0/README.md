# Habbo Registration v1.0

TypeScript and HTML Canvas replacement for the Flash-based `HabboRegistration.swf` (v38, 2007) avatar editor. Renders entirely on a `<canvas>` element with no Flash dependency.

# Screenshot 

<img width="406" height="327" alt="image" src="https://github.com/user-attachments/assets/51e02526-9b62-4c62-bf77-c049ea9a5638" />

## Requirements

- Node.js 18+
- npm

## Building

```
cd version-1.0
npm install
npm run build
```

This runs the TypeScript compiler followed by a Vite IIFE build. Output goes to `dist/habbo-registration.iife.js` (roughly 14KB).

For local development with hot reload:

```
cd version-1.0
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Asset extraction

Sprites and UI assets are extracted from the decompiled SWF via a bundled script:

```
npm run extract
```

This reads from `decompiled/` (FFDEC output) and writes to `assets/`. You only need to run this once, or again if the decompiled source changes.

## Assets

The build copies `assets/` into `dist/`. This folder contains:

- `data/figure_data_xml.xml` - part/set/colour definitions (original v38 format)
- `data/figure_editor.xml` - localisation strings
- `data/symbols.csv` - sprite name to filename mapping
- `data/spriteoffsets.csv` - sprite x/y offsets extracted from the decompiled SWF
- `sprites/` - individual avatar part PNGs
- `ui/` - UI element PNGs (arrows, buttons, backgrounds, palette controls)

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
    setGenderAndFigure: function(gender, figure) {
      // Called whenever the figure or gender changes.
      // gender: 'M' or 'F'
      // figure: numeric figure string, e.g. '1750118022210132810129003'
    },
    setAllowedToProceed: function(allowed) {
      // Called to indicate whether the current figure is valid for submission.
      // allowed: true/false
    },
  };

  // Editor config
  window.HabboRegistrationConfig = {
    figure: '1750118022210132810129003',
    gender: 'M',
    assetsPath: './',
    figuredata_url: 'data/figure_data_xml.xml',
    localization_url: 'data/figure_editor.xml',
  };
</script>

<script src="habbo-registration.iife.js"></script>
```

The editor attaches itself to the `#editor-container` div automatically.

### Config options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `figure` | string | `'1750118022210132810129003'` | Numeric figure string to load. |
| `gender` | string | `'M'` | `'M'` or `'F'`. |
| `assetsPath` | string | `'./'` | Base path for the `data/`, `sprites/`, and `ui/` asset folders. Relative to the page. |
| `figuredata_url` | string | `'figure_data_xml.xml'` | Path to the figure data XML file, relative to `assetsPath`. |
| `localization_url` | string | `'figure_editor.xml'` | Path to the localisation XML file, relative to `assetsPath`. |

### Reading the result

The `setGenderAndFigure` callback is the primary way to get the figure string. It fires on every change (part selection, colour change, gender switch, randomise).

## Project structure

```
version-1.0/
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
      AvatarRenderer.ts       - Full avatar rendering (all parts, directions, flipping)
      PreviewIconRenderer.ts  - Small preview icon rendering for the part navigator
      SpriteLoader.ts         - PNG sprite loading and caching
      ColorTint.ts            - Pixel-level colour multiplication
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
  decompiled/                 - FFDEC decompiled SWF output
  dist/                       - Build output
```

## Origin

The source data comes from the decompiled `HabboRegistration.swf` (v38, August 2007, ActionScript 2). This single SWF contains both the editor UI and all avatar sprites. It was decompiled with FFDEC. Sprite offsets are derived from the SVG shape exports in `decompiled/shapes/`.
