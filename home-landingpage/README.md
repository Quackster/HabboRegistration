# Habbo Home Landing v1.0

TypeScript and HTML Canvas replacement for the Flash-based `home_landingpage.swf`. Renders the animated landing page entirely on a `<canvas>` element with no Flash dependency.

## Screenshot

![screenshot](./home_landingpage.gif)

## Requirements

- Node.js 18+
- npm

## Building

```
npm install
npm run build
```

This builds the sprite atlases from the decompiled SWF, runs the TypeScript compiler, and produces a Vite IIFE build. Output goes to `dist/home-landingpage.iife.js`.

For local development with hot reload:

```
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Asset extraction

Sprite atlases and UI images are extracted from the decompiled SWF via a bundled script:

```
npm run build:atlases
```

This reads from `../decompiled/` (FFDEC output) and writes to `assets/`. The script crops each of the 1195 animation frames from the large `DefineSprite_102` sprite PNGs and packs them into 12 WebP atlases (100 frames each, 10 columns × 10 rows). Two UI overlay images are also converted to WebP.

You only need to run this once, or again if the decompiled source changes.

## Assets

The build copies `assets/` into `dist/`. This folder contains:

- `atlases/atlas-0.webp` … `atlas-11.webp` — packed animation frames (12 atlases × 100 frames, 4620×2950 each)
- `images/2.webp` — gold border overlay image
- `images/6.webp` — loading screen background image

These must be served from the same path as the JS file (or set `assetsPath` in the config).

## Usage

### Replacing the Flash object

Remove the Flash `<object>`/`<embed>` tag and replace it with a container div and two script blocks.

The first script defines `window.HomeLandingpageConfig`. The second loads the built JS file.

```html
<div id="home-landingpage-container"></div>

<script>
  window.HomeLandingpageConfig = {
    container: "home-landingpage-container",
    assetsPath: "assets/",
  };
</script>

<script src="home-landingpage.iife.js"></script>
```

The widget attaches itself to the container div automatically and creates two stacked canvases: one for the animation and one for the overlay frame.

### Config options

| Option       | Type    | Default                        | Description                                                               |
| ------------ | ------- | ------------------------------ | ------------------------------------------------------------------------- |
| `container`  | string  | `'home-landingpage-container'` | ID of the container element the widget renders into.                      |
| `assetsPath` | string  | `'assets/'`                    | Base path for the `atlases/` and `images/` folders. Relative to the page. |
| `autoRecord` | boolean | `false`                        | Automatically start recording a WebM video when playback begins.          |

### Recording

A `window.HomeLandingpage.startRecording()` API is exposed after initialisation. It queues a recording that begins at the next loop start (frame 1) and stops at the loop end (frame 1195), then downloads a `home-landingpage.webm` file.

```js
window.HomeLandingpage.startRecording();
```

### Using the pre-recorded video instead

A `home-landingpage.webm` video of the full animation loop has already been generated from the canvas. If you don't need interactive control or dynamic rendering, you can embed the video directly instead of deploying the full widget:

```html
<video src="home-landingpage.webm" autoplay loop muted playsinline></video>
```

This avoids the need to serve the JS bundle and the 12 WebP atlases (~50 MB), making it the lightest option for a static embed.

## Project structure

```
home-landingpage/
  src/
    index.ts          - Entry point, config, init
    config.ts         - Canvas dimensions, animation constants, atlas packing constants
    Animator.ts       - Main render loop, frame timing, recording
    AtlasLoader.ts    - WebP atlas loading and frame lookup
    LoadingScreen.ts  - Loading animation before playback begins
  scripts/
    build-atlases.mjs - Extracts and packs sprite frames from decompiled SWF PNGs
  assets/             - Runtime assets (copied to dist on build)
  dist/               - Build output
../decompiled/        - FFDEC decompiled SWF output
```

## Origin

The source data comes from the decompiled `home_landingpage.swf`. The animation is a single sprite (`DefineSprite_102`) with 1195 frames looping at 36 fps on a 520×353 stage. It was decompiled with FFDEC. The atlas build script crops the visible area from each exported frame PNG and packs them into WebP atlases for efficient streaming.
