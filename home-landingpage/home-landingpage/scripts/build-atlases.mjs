import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(__dirname, '..');
const decompiledDir = resolve(projectDir, '../decompiled');

const FRAMES_PER_ATLAS = 100;
const ATLAS_COLS = 10;
const ATLAS_FRAME_W = 462;
const ATLAS_FRAME_H = 295;
const TOTAL_FRAMES = 1195;
const ATLAS_COUNT = Math.ceil(TOTAL_FRAMES / FRAMES_PER_ATLAS); // 12

// Crop coords within the 1066×1228 source PNG
const SRC_X = 314;
const SRC_Y = 566;

const atlasDir = resolve(projectDir, 'assets/atlases');
const imagesDir = resolve(projectDir, 'assets/images');

await mkdir(atlasDir, { recursive: true });
await mkdir(imagesDir, { recursive: true });

// Build sprite atlases
for (let atlasIdx = 0; atlasIdx < ATLAS_COUNT; atlasIdx++) {
  const firstFrame = atlasIdx * FRAMES_PER_ATLAS + 1;
  const lastFrame = Math.min(firstFrame + FRAMES_PER_ATLAS - 1, TOTAL_FRAMES);
  const count = lastFrame - firstFrame + 1;

  process.stdout.write(`Building atlas-${atlasIdx}.webp (frames ${firstFrame}–${lastFrame})... `);

  const composites = [];

  for (let i = 0; i < count; i++) {
    const frameNum = firstFrame + i;
    const col = i % ATLAS_COLS;
    const row = Math.floor(i / ATLAS_COLS);

    const srcPath = resolve(decompiledDir, `sprites/DefineSprite_102/${frameNum}.png`);
    const buf = await sharp(srcPath)
      .extract({ left: SRC_X, top: SRC_Y, width: ATLAS_FRAME_W, height: ATLAS_FRAME_H })
      .toBuffer();

    composites.push({
      input: buf,
      left: col * ATLAS_FRAME_W,
      top: row * ATLAS_FRAME_H,
    });
  }

  const atlasW = ATLAS_COLS * ATLAS_FRAME_W;
  const atlasH = Math.ceil(FRAMES_PER_ATLAS / ATLAS_COLS) * ATLAS_FRAME_H;

  await sharp({
    create: {
      width: atlasW,
      height: atlasH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .webp({ lossless: true })
    .toFile(resolve(atlasDir, `atlas-${atlasIdx}.webp`));

  console.log('done');
}

// Convert UI images to WebP
for (const name of ['2', '6']) {
  const src = resolve(decompiledDir, `images/${name}.png`);
  const dst = resolve(imagesDir, `${name}.webp`);
  process.stdout.write(`Converting images/${name}.png → images/${name}.webp... `);
  await sharp(src).webp({ lossless: true }).toFile(dst);
  console.log('done');
}

console.log(`\nAll ${ATLAS_COUNT} atlases + 2 images built successfully.`);
