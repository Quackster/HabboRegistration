// optimize-assets.ts — Build pipeline for avatar editor assets.
//
// 1. buildAtlas(): Read raw PNGs at native 1x → shelf-pack → composite into WebP atlas
//    pages. Generates atlas-data.csv with region coordinates for Vite ?raw import.
//    Vectorization happens at runtime in Atlas.ts for resolution independence.
// 2. convertFigureDataToCSV(): Convert figure_data_xml.xml to compact figuredata.csv.
// 3. generateAtlasCSS(): Generate src/data/atlas-sprites.css with pre-computed CSS classes
//    for atlas regions, sprite offsets, preview offsets, color swatches, and layout
//    positions. All classes use global `ae-` prefix to avoid host page collisions.

import { readdir, readFile, stat, unlink, writeFile, rmdir } from "fs/promises";
import { join, resolve, parse } from "path";
import sharp from "sharp";
import { DOMParser } from "@xmldom/xmldom";

const ROOT = resolve(import.meta.dirname, "..");
const ASSETS = join(ROOT, "assets");

const DIRS = ["sprites", "ui", "frames"];

const MAX_PAGE_SIZE = 4096;

interface RasterizedSprite {
  key: string;
  pixels: Buffer;
  w: number;   // 1x width
  h: number;   // 1x height
}

interface PackedSprite extends RasterizedSprite {
  page: number;
  x: number;
  y: number;
}

async function buildAtlas() {
  const sprites: RasterizedSprite[] = [];

  for (const dir of DIRS) {
    const dirPath = join(ASSETS, dir);
    let files: string[];
    try {
      files = (await readdir(dirPath)).filter((f: string) => f.endsWith(".png"));
    } catch {
      continue;
    }

    if (files.length === 0) continue;

    console.log(`Reading ${files.length} PNGs in ${dir}/...`);

    for (const file of files) {
      const pngPath = join(dirPath, file);
      const { data, info } = await sharp(pngPath)
        .raw()
        .ensureAlpha()
        .toBuffer({ resolveWithObject: true });

      const name = parse(file).name;
      sprites.push({
        key: `${dir}/${name}`,
        pixels: data,
        w: info.width,
        h: info.height,
      });
    }
  }

  if (sprites.length === 0) {
    console.log("No images found, skipping atlas generation");
    return;
  }

  console.log(`\n${sprites.length} sprites read at native 1x resolution`);

  // Shelf-pack: sort by height descending for better packing
  sprites.sort((a, b) => b.h - a.h);

  const packed: PackedSprite[] = [];
  let currentPage = 0;
  let rowX = 0;
  let rowY = 0;
  let rowHeight = 0;

  for (const sprite of sprites) {
    if (rowX + sprite.w > MAX_PAGE_SIZE) {
      rowY += rowHeight;
      rowX = 0;
      rowHeight = 0;
    }

    if (rowY + sprite.h > MAX_PAGE_SIZE) {
      currentPage++;
      rowX = 0;
      rowY = 0;
      rowHeight = 0;
    }

    packed.push({
      ...sprite,
      page: currentPage,
      x: rowX,
      y: rowY,
    });

    rowX += sprite.w;
    if (sprite.h > rowHeight) rowHeight = sprite.h;
  }

  const totalPages = currentPage + 1;
  console.log(`  Packed into ${totalPages} atlas page(s)`);

  // Composite each page as WebP (images go to assets/ for publicDir)
  for (let page = 0; page < totalPages; page++) {
    const pageSprites = packed.filter((s) => s.page === page);

    let pageHeight = 0;
    for (const s of pageSprites) {
      const bottom = s.y + s.h;
      if (bottom > pageHeight) pageHeight = bottom;
    }

    const outPath = join(ASSETS, `atlas_${page}.webp`);
    await sharp({
      create: {
        width: MAX_PAGE_SIZE,
        height: pageHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(
        pageSprites.map((s) => ({
          input: s.pixels,
          raw: { width: s.w, height: s.h, channels: 4 as const },
          left: s.x,
          top: s.y,
        })),
      )
      .webp({
        nearLossless: true,
        quality: 80,
        preset: 'drawing',
        effort: 6,
        smartSubsample: true,
      })
      .toFile(outPath);

    const fileSize = (await stat(outPath)).size;
    console.log(`  atlas_${page}.webp: ${MAX_PAGE_SIZE}x${pageHeight}, ${pageSprites.length} sprites, ${(fileSize / 1024).toFixed(0)} KB`);
  }

  // Generate CSV in src/ for Vite ?raw import (no header)
  const csvLines = packed.map(
    (s) => `${s.key},${s.page},${s.x},${s.y},${s.w},${s.h}`,
  );
  const csvPath = join(ROOT, "src", "rendering", "atlas-data.csv");
  await writeFile(csvPath, csvLines.join("\n"));
  const csvSize = (await stat(csvPath)).size;
  console.log(`  atlas-data.csv: ${csvLines.length} entries, ${(csvSize / 1024).toFixed(0)} KB`);

  // Delete individual PNG files and empty directories
  for (const dir of DIRS) {
    const dirPath = join(ASSETS, dir);
    try {
      const files = await readdir(dirPath);
      for (const file of files) {
        await unlink(join(dirPath, file));
      }
      await rmdir(dirPath);
      console.log(`  Removed ${dir}/`);
    } catch {
      // Directory didn't exist
    }
  }
}

function padModel(str: string): string {
  while (str.length < 3) str = "0" + str;
  return str;
}

async function convertFigureDataToCSV() {
  const xmlPath = join(ASSETS, "data", "figure_data_xml.xml");
  let xmlText: string;
  try {
    xmlText = await readFile(xmlPath, "utf-8");
  } catch {
    console.log("No figure_data_xml.xml found, skipping conversion");
    return;
  }

  const doc = new DOMParser().parseFromString(xmlText, "text/xml");
  const root = doc.documentElement!;
  const lines: string[] = [];

  for (let g = 0; g < root.childNodes.length; g++) {
    const gNode = root.childNodes[g] as Element;
    if (gNode.nodeType !== 1) continue;
    const gender = gNode.getAttribute("i")!;

    for (let t = 0; t < gNode.childNodes.length; t++) {
      const typeNode = gNode.childNodes[t] as Element;
      if (typeNode.nodeType !== 1) continue;
      const partType = typeNode.getAttribute("i")!;

      for (let s = 0; s < typeNode.childNodes.length; s++) {
        const styleNode = typeNode.childNodes[s] as Element;
        if (styleNode.nodeType !== 1) continue;
        const styleId = styleNode.getAttribute("i")!;

        const parts: string[] = [];
        const colors: string[] = [];

        // Parse <ps><p t="ch">21</p>...</ps>
        for (let c = 0; c < styleNode.childNodes.length; c++) {
          const child = styleNode.childNodes[c] as Element;
          if (child.nodeType !== 1) continue;
          if (child.tagName === "ps") {
            for (let p = 0; p < child.childNodes.length; p++) {
              const pNode = child.childNodes[p] as Element;
              if (pNode.nodeType !== 1) continue;
              parts.push(`${pNode.getAttribute("t")}:${padModel(pNode.textContent || "")}`);
            }
          } else if (child.tagName === "cs") {
            for (let cc = 0; cc < child.childNodes.length; cc++) {
              const cNode = child.childNodes[cc] as Element;
              if (cNode.nodeType !== 1) continue;
              colors.push(cNode.textContent || "");
            }
          }
        }

        lines.push(`${gender},${partType},${styleId},${parts.join("|")},${colors.join("|")}`);
      }
    }
  }

  const csvPath = join(ASSETS, "data", "figuredata.csv");
  await writeFile(csvPath, lines.join("\n"));

  const xmlSize = (await stat(xmlPath)).size;
  const csvSize = (await stat(csvPath)).size;
  console.log(`\nConverted figure_data_xml.xml to figuredata.csv`);
  console.log(`  XML: ${(xmlSize / 1024).toFixed(0)} KB → CSV: ${(csvSize / 1024).toFixed(0)} KB (saved ${((1 - csvSize / xmlSize) * 100).toFixed(1)}%)`);

  await unlink(xmlPath);
}


async function generateAtlasCSS() {
  const SRC_DATA = join(ROOT, "src", "data");
  const ATLAS_CSV = join(ROOT, "src", "rendering", "atlas-data.csv");

  // --- Parse layout.csv ---
  const layoutText = await readFile(join(SRC_DATA, "layout.csv"), "utf-8");
  const layout = new Map<string, number>();
  for (const line of layoutText.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const [key, val] = trimmed.split(",");
    layout.set(key, parseFloat(val));
  }

  const flipWidth = layout.get("flip_width")!;
  const previewClipOffsetX = layout.get("preview_clip_offset_x")!;
  const previewClipOffsetY = layout.get("preview_clip_offset_y")!;
  const previewStartY = layout.get("preview_start_y")!;
  const previewSpacing = layout.get("preview_spacing")!;
  const colorPaletteStartY = layout.get("color_palette_start_y")!;
  const colorPaletteSpacing = layout.get("color_palette_spacing")!;
  const partArrowStartY = layout.get("part_arrow_start_y")!;
  const partArrowSpacing = layout.get("part_arrow_spacing")!;
  const colorCellSize = layout.get("color_cell_size")!;
  const colorCols = layout.get("color_cols")!;
  const colorsPerPage = layout.get("colors_per_page")!;

  const previewOffsets: Record<string, number> = {
    hr: layout.get("preview_offset_hr")!,
    hd: layout.get("preview_offset_hd")!,
    ch: layout.get("preview_offset_ch")!,
    lg: layout.get("preview_offset_lg")!,
    sh: layout.get("preview_offset_sh")!,
  };

  // --- Parse atlas-data.csv ---
  const atlasText = await readFile(ATLAS_CSV, "utf-8");
  interface AtlasEntry { key: string; page: number; x: number; y: number; w: number; h: number }
  const atlasEntries: AtlasEntry[] = [];
  const spriteWidths = new Map<string, number>(); // imageId → width for sprites/ entries
  for (const line of atlasText.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const [key, page, x, y, w, h] = trimmed.split(",");
    atlasEntries.push({ key, page: +page, x: +x, y: +y, w: +w, h: +h });
    if (key.startsWith("sprites/")) {
      spriteWidths.set(key.slice(8), +w);
    }
  }

  // --- Parse spriteoffsets.csv ---
  const offsetsText = await readFile(join(SRC_DATA, "spriteoffsets.csv"), "utf-8");
  interface SpriteOffset { id: string; offsetX: number; offsetY: number }
  const spriteOffsets: SpriteOffset[] = [];
  for (const line of offsetsText.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const [id, ox, oy] = trimmed.split(";");
    spriteOffsets.push({ id, offsetX: +ox, offsetY: +oy });
  }

  // --- Parse figuredata.csv for unique colors ---
  const figureText = await readFile(join(SRC_DATA, "figuredata.csv"), "utf-8");
  const colorSet = new Set<string>();
  for (const line of figureText.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const cols = trimmed.split(",");
    if (cols.length < 5) continue;
    const colorsPart = cols[4];
    if (colorsPart) {
      for (const hex of colorsPart.split("|")) {
        if (hex) colorSet.add(hex);
      }
    }
  }

  // --- Build CSS rules ---
  const rules: string[] = [];

  // 1. Atlas page classes
  const pages = new Set<number>();
  for (const e of atlasEntries) pages.add(e.page);
  for (const p of [...pages].sort((a, b) => a - b)) {
    rules.push(`.ae-ap-${p}{background-image:url(../../assets/atlas_${p}.webp)}`);
  }

  // 2. Region classes
  for (const e of atlasEntries) {
    const cls = e.key.replace(/\//g, "-");
    rules.push(`.ae-r-${cls}{width:${e.w}px;height:${e.h}px;background-position:${-e.x}px ${-e.y}px}`);
  }

  // 3. Sprite offset classes
  for (const o of spriteOffsets) {
    rules.push(`.ae-so-${o.id}{left:${o.offsetX}px;top:${o.offsetY}px}`);
  }

  // 4. Sprite offset flipped classes
  for (const o of spriteOffsets) {
    const regionW = spriteWidths.get(o.id);
    if (regionW === undefined) continue;
    const flippedLeft = flipWidth - o.offsetX - regionW;
    rules.push(`.ae-sof-${o.id}{left:${flippedLeft}px;top:${o.offsetY}px}`);
  }

  // 5. Preview offset classes
  const partTypes = ["hr", "hd", "ch", "lg", "sh"];
  for (const o of spriteOffsets) {
    if (!spriteWidths.has(o.id)) continue;
    for (const type of partTypes) {
      const left = o.offsetX - previewClipOffsetX;
      const top = o.offsetY + previewOffsets[type] - previewClipOffsetY;
      rules.push(`.ae-po-${o.id}-${type}{left:${left}px;top:${top}px}`);
    }
  }

  // 6. Swatch color classes
  for (const hex of [...colorSet].sort()) {
    rules.push(`.ae-bg-${hex}{background-color:#${hex}}`);
  }

  // 7. Preview Y classes
  for (let n = 0; n < 5; n++) {
    rules.push(`.ae-py-${n}{top:${previewStartY + n * previewSpacing}px}`);
  }

  // 8. Color palette Y classes
  for (let n = 0; n < 5; n++) {
    rules.push(`.ae-cpy-${n}{top:${colorPaletteStartY + n * colorPaletteSpacing}px}`);
  }

  // 9. Part arrow Y classes
  for (let n = 0; n < 5; n++) {
    rules.push(`.ae-pay-${n}{top:${partArrowStartY + n * partArrowSpacing}px}`);
  }

  // 10. Color swatch position classes
  const colorRows = colorsPerPage / colorCols;
  for (let c = 0; c < colorCols; c++) {
    for (let r = 0; r < colorRows; r++) {
      rules.push(`.ae-cs-${c}-${r}{left:${c * colorCellSize}px;top:${r * colorCellSize}px}`);
    }
  }

  // 11. Config defaults
  rules.push(`.ae-text-color{color:#333333}`);
  rules.push(`.ae-bg{background:#FFFFFF}`);

  // --- Write output ---
  const cssPath = join(SRC_DATA, "atlas-sprites.css");
  const cssContent = rules.join("\n") + "\n";
  await writeFile(cssPath, cssContent);
  const cssSize = (await stat(cssPath)).size;
  console.log(`\nGenerated atlas-sprites.css: ${rules.length} rules, ${(cssSize / 1024).toFixed(0)} KB`);
}

async function main() {
  await buildAtlas();
  await convertFigureDataToCSV();
  await generateAtlasCSS();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
