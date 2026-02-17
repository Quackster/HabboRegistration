import { readdir, readFile, stat, unlink, writeFile, rmdir } from "fs/promises";
import { join, resolve, parse } from "path";
import sharp from "sharp";
import { DOMParser } from "@xmldom/xmldom";

const ROOT = resolve(import.meta.dirname, "..");
const ASSETS = join(ROOT, "assets");

const DIRS = ["sprites", "ui", "frames"];

interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface ImageEntry {
  key: string;
  path: string;
  width: number;
  height: number;
}

// Simple shelf-based bin packing
function shelfPack(
  entries: ImageEntry[],
  maxWidth: number,
): { width: number; height: number; regions: Map<string, Region> } {
  const sorted = [...entries].sort((a, b) => b.height - a.height);

  const regions = new Map<string, Region>();
  let shelfY = 0;
  let shelfHeight = 0;
  let cursorX = 0;
  let totalWidth = 0;

  for (const entry of sorted) {
    if (cursorX + entry.width > maxWidth) {
      shelfY += shelfHeight;
      shelfHeight = 0;
      cursorX = 0;
    }

    regions.set(entry.key, {
      x: cursorX,
      y: shelfY,
      w: entry.width,
      h: entry.height,
    });

    cursorX += entry.width;
    if (cursorX > totalWidth) totalWidth = cursorX;
    if (entry.height > shelfHeight) shelfHeight = entry.height;
  }

  return { width: totalWidth, height: shelfY + shelfHeight, regions };
}

async function convertToWebP() {
  let totalFiles = 0;
  let totalBefore = 0;
  let totalAfter = 0;

  for (const dir of DIRS) {
    const dirPath = join(ASSETS, dir);
    let files: string[];
    try {
      files = (await readdir(dirPath)).filter((f: string) => f.endsWith(".png"));
    } catch {
      continue;
    }

    if (files.length === 0) continue;

    console.log(`Converting ${files.length} PNGs in ${dir}/...`);

    for (const file of files) {
      const pngPath = join(dirPath, file);
      const webpPath = join(dirPath, file.replace(/\.png$/, ".webp"));

      const before = (await stat(pngPath)).size;
      await sharp(pngPath).webp({ lossless: true }).toFile(webpPath);
      const after = (await stat(webpPath)).size;

      await unlink(pngPath);

      totalBefore += before;
      totalAfter += after;
      totalFiles++;
    }
  }

  if (totalFiles > 0) {
    console.log(`\nConverted ${totalFiles} files`);
    console.log(`Before: ${(totalBefore / 1024).toFixed(0)} KB`);
    console.log(`After:  ${(totalAfter / 1024).toFixed(0)} KB`);
    console.log(
      `Saved:  ${((totalBefore - totalAfter) / 1024).toFixed(0)} KB (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%)`,
    );
  }
}

async function buildAtlas() {
  const allEntries: ImageEntry[] = [];

  for (const dir of DIRS) {
    const dirPath = join(ASSETS, dir);
    let files: string[];
    try {
      files = (await readdir(dirPath)).filter((f: string) => f.endsWith(".webp"));
    } catch {
      continue;
    }

    for (const file of files) {
      const filePath = join(dirPath, file);
      const meta = await sharp(filePath).metadata();
      const name = parse(file).name;
      // Prefix with dir to avoid key collisions (e.g. "sprites/123", "ui/background", "frames/1")
      allEntries.push({
        key: `${dir}/${name}`,
        path: filePath,
        width: meta.width!,
        height: meta.height!,
      });
    }
  }

  if (allEntries.length === 0) {
    console.log("No images found, skipping atlas generation");
    return;
  }

  console.log(`\nBuilding atlas from ${allEntries.length} images...`);

  const { width, height, regions } = shelfPack(allEntries, 4096);

  const composites: sharp.OverlayOptions[] = [];
  for (const entry of allEntries) {
    const region = regions.get(entry.key)!;
    composites.push({
      input: entry.path,
      left: region.x,
      top: region.y,
    });
  }

  const atlasImage = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .webp({ lossless: true });

  const atlasPath = join(ASSETS, "atlas.webp");
  const manifestPath = join(ASSETS, "atlas.csv");

  await atlasImage.toFile(atlasPath);

  const csvLines: string[] = [];
  for (const [key, region] of regions) {
    csvLines.push(`${key},${region.x},${region.y},${region.w},${region.h}`);
  }
  await writeFile(manifestPath, csvLines.join("\n"));

  const atlasSize = (await stat(atlasPath)).size;
  console.log(`  → atlas.webp: ${width}x${height}px, ${(atlasSize / 1024).toFixed(0)} KB`);

  // Delete individual files and remove empty directories
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


async function main() {
  await convertToWebP();
  await buildAtlas();
  await convertFigureDataToCSV();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
