# Habbo Badge Editor

TypeScript and HTML Canvas replacement for the Flash-based `BadgeEditor.swf` badge editor. Renders entirely on a `<canvas>` element with no Flash dependency.

## Screenshot

<img width="280" height="367" alt="image" src="https://github.com/user-attachments/assets/e0d5032b-9630-4175-a4da-7d86987e55c8" />

## Requirements

- Node.js 18+
- npm

## Building

```
cd badge-editor
npm install
npm run build
```

This runs the TypeScript compiler followed by a Vite IIFE build. Output goes to `badge-editor/dist/badge-editor.js`.

For local development with hot reload:

```
cd badge-editor
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:3000`).

## Assets

The build copies `badge-editor/assets/` into `dist/`. This folder contains:

- `data/badge_data.xml` - 18 colour definitions used by the editor
- `data/badge_editor.xml` - localisation strings (headers, labels, button text)
- `sprites/symbols/` - 67 symbol PNGs (1-67)
- `sprites/bases/` - 24 base PNGs (1-24)
- `sprites/ui/` - UI element PNGs (arrows, buttons, grids, colour cells)

These must be served from the same path as the JS file (or set `assetsPath` in the config).

## Usage

### Replacing the Flash object

Remove the Flash `<object>`/`<embed>` tag and replace it with a container div and two script blocks.

The first script defines `window.HabboBadgeEditor`, which is the callback interface the editor uses to communicate save/cancel actions back to your page. The second script loads the built JS file.

```html
<div id="editor-container"></div>

<script>
  // Callback interface - the editor calls these when the user clicks Save or Cancel.
  // In the original SWF these were ExternalInterface calls.
  window.HabboBadgeEditor = {
    onSave: function(code, groupId) {
      // Called when the user clicks Save.
      // code: badge string, e.g. 'b0502Xs13181s01014'
      // groupId: group ID from config
    },
    onCancel: function() {
      // Called when the user clicks Cancel.
    },
  };

  // Editor config
  window.HabboBadgeEditorConfig = {
    badge_data: '',
    assetsPath: '',
    badge_data_url: 'data/badge_data.xml',
    localization_url: 'data/badge_editor.xml',
    groupId: '0',
  };
</script>

<script src="badge-editor.js"></script>
```

The editor attaches itself to the `#editor-container` div automatically.

### Config options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `badge_data` | string | `''` | Pre-existing badge code to load for editing. If empty, a default badge is used. |
| `assetsPath` | string | `''` | Base path for the `data/` and `sprites/` asset folders. Relative to the page. |
| `badge_data_url` | string | `'data/badge_data.xml'` | URL to the badge colour data XML file. |
| `localization_url` | string | `'data/badge_editor.xml'` | URL to the localisation strings XML file. |
| `groupId` | string | `'0'` | Group ID passed back to the `onSave` callback. |

### Reading the result

The `onSave` callback fires when the user clicks the Save button. It receives the serialised badge code string and the group ID.

```js
window.HabboBadgeEditor = {
  onSave: function(code, groupId) {
    // code is the badge string, e.g. 'b0502Xs13181s01014'
    // Send it to your server, store it, etc.
  },
};
```

### Badge code format

A badge code is a string that encodes 5 layers (4 symbols + 1 base). Each layer is a short token:

- Base layer: `b` + 2-digit part number + 2-digit colour index
- Symbol layer: `s` + 2-digit part number + 2-digit colour index + position digit (1-9)

Layers with part number `00` are empty. A symbol layer with `X` after the base token indicates no symbols are set.

## Project structure

```
badge-editor/
  src/
    index.ts              - Entry point, data loading, render loop
    config.ts             - Layout constants extracted from the SWF
    api/
      Bridge.ts           - window.HabboBadgeEditor callback wrapper
    data/
      ExternalData.ts     - Loads badge_data.xml (colour definitions)
      Localization.ts     - Loads badge_editor.xml (UI text strings)
    model/
      BadgeModel.ts       - Badge state, serialise/deserialise
      BadgeLayer.ts       - Layer data structure (type, symbol, colour, position)
      EventBus.ts         - Simple pub/sub event system
    rendering/
      SpriteLoader.ts     - PNG sprite preloading and caching
      BadgeRenderer.ts    - Badge preview composition
      ColorTint.ts        - Pixel-level colour tinting
    ui/
      CanvasManager.ts    - Canvas setup, hit regions, input handling
      LayerPanel.ts       - Symbol/base selection with arrows and toggle
      ColorPalette.ts     - 18-colour palette in a 2x9 grid
      PositionGrid.ts     - 3x3 position selector for symbol layers
      ButtonBar.ts        - Save and Cancel buttons
  assets/                 - Runtime assets (copied to dist on build)
  dist/                   - Build output
```

## Origin

The source data comes from the decompiled `BadgeEditor.swf` (ActionScript 2), extracted with FFDEC. All pixel positions, registration points, and sprite assets were taken directly from the SWF's PlaceObject2 tags and exported shapes.
