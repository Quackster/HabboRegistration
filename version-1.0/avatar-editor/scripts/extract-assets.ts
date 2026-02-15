import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const VERSION_ROOT = resolve(ROOT, '..');
const DECOMPILED = join(VERSION_ROOT, 'decompiled');
const ASSETS = join(ROOT, 'assets');

function main() {
  console.log('=== Habbo Registration Asset Extraction ===');

  // Create output directories
  mkdirSync(join(ASSETS, 'data'), { recursive: true });
  mkdirSync(join(ASSETS, 'sprites'), { recursive: true });

  // 1. Parse symbols.csv
  const symbolsCsv = readFileSync(join(DECOMPILED, 'symbolClass', 'symbols.csv'), 'utf-8');
  const symbols: Array<{ spriteId: number; name: string }> = [];

  for (const line of symbolsCsv.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const [idStr, name] = trimmed.split(';');
    if (!idStr || !name) continue;
    symbols.push({ spriteId: parseInt(idStr, 10), name });
  }

  console.log(`Parsed ${symbols.length} symbols`);

  // 2. For each sprite, compute imageId and shapeId, extract offset from SVG
  const offsets: Array<{ imageId: number; offsetX: number; offsetY: number }> = [];
  let copied = 0;
  let skipped = 0;

  for (const { spriteId, name } of symbols) {
    const imageId = spriteId - 2;
    const shapeId = spriteId - 1;

    // Check if image exists
    const imagePath = join(DECOMPILED, 'images', `${imageId}.png`);
    if (!existsSync(imagePath)) {
      skipped++;
      continue;
    }

    // Parse SVG for offset
    let offsetX = 0;
    let offsetY = 0;
    const svgPath = join(DECOMPILED, 'shapes', `${shapeId}.svg`);
    if (existsSync(svgPath)) {
      const svgContent = readFileSync(svgPath, 'utf-8');
      const match = svgContent.match(/transform="matrix\(1(?:\.0)?,\s*0(?:\.0)?,\s*0(?:\.0)?,\s*1(?:\.0)?,\s*(-?[\d.]+),\s*(-?[\d.]+)\)"/);
      if (match) {
        offsetX = -parseFloat(match[1]);
        offsetY = -parseFloat(match[2]);
      }
    }

    // Copy image
    copyFileSync(imagePath, join(ASSETS, 'sprites', `${imageId}.png`));
    offsets.push({ imageId, offsetX, offsetY });
    copied++;
  }

  console.log(`Copied ${copied} sprite PNGs (skipped ${skipped})`);

  // 3. Generate spriteoffsets.csv
  const offsetLines = offsets.map(o => `${o.imageId};${o.offsetX};${o.offsetY}`);
  writeFileSync(join(ASSETS, 'data', 'spriteoffsets.csv'), offsetLines.join('\n') + '\n');
  console.log(`Generated spriteoffsets.csv with ${offsets.length} entries`);

  // 4. Copy data files
  copyFileSync(
    join(DECOMPILED, 'symbolClass', 'symbols.csv'),
    join(ASSETS, 'data', 'symbols.csv')
  );
  copyFileSync(
    join(VERSION_ROOT, 'figure_data_xml.xml'),
    join(ASSETS, 'data', 'figure_data_xml.xml')
  );
  copyFileSync(
    join(VERSION_ROOT, 'figure_editor.xml'),
    join(ASSETS, 'data', 'figure_editor.xml')
  );
  console.log('Copied data files (symbols.csv, figure_data_xml.xml, figure_editor.xml)');

  // 5. Copy UI sprite PNGs from decompiled MovieClip sprite directories
  mkdirSync(join(ASSETS, 'ui'), { recursive: true });

  const UI_SPRITES: Record<string, string> = {
    'DefineSprite_1683_aso#47002': 'background',
    'DefineSprite_1627_prevIconBg': 'prevIconBg',
    'DefineSprite_1633_prevIconMask': 'prevIconMask',
    'DefineSprite_1654_arrowRight': 'arrowRight',
    'DefineSprite_1657_aso#07863': 'arrowLeft',
    'DefineSprite_1648_aso#43797': 'rotateLeft',
    'DefineSprite_1651_aso#49786': 'rotateRight',
    'DefineSprite_1660_aso#94493': 'paletteArrowLeft',
    'DefineSprite_1663_aso#37808': 'paletteArrowRight',
    'DefineSprite_1669_radioButtonOn': 'radioOn',
    'DefineSprite_1666_radioButtonOff': 'radioOff',
    'DefineSprite_1636_aso#82515': 'colorSwatch',
    'DefineSprite_1645_colorButtonBg': 'colorButtonBg',
    'DefineSprite_1642_inactiveColorButton': 'inactiveColorButton',
    'DefineSprite_1639_paletteSelector': 'paletteSelector',
    'DefineSprite_1675_aso#87112': 'continueBtn',
    'DefineSprite_1677_aso#81123': 'backBtn',
    'DefineSprite_1680_aso#00482': 'randomizeBtn',
    'DefineSprite_1672_nameBg': 'nameBg',
  };

  let uiCopied = 0;
  for (const [dirName, outName] of Object.entries(UI_SPRITES)) {
    const src = join(DECOMPILED, 'sprites', dirName, '1.png');
    if (existsSync(src)) {
      copyFileSync(src, join(ASSETS, 'ui', `${outName}.png`));
      uiCopied++;
    } else {
      console.warn(`UI sprite not found: ${dirName}`);
    }
  }
  console.log(`Copied ${uiCopied} UI sprite PNGs`);

  console.log('=== Extraction complete ===');
}

main();
