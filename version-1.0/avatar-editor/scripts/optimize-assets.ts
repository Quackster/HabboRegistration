import { readdir, stat, unlink } from "fs/promises";
import { join, resolve } from "path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "..");
const ASSETS = join(ROOT, "assets");

const DIRS = ["sprites", "ui", "frames"];

async function convertToWebP() {
  let totalFiles = 0;
  let totalBefore = 0;
  let totalAfter = 0;

  for (const dir of DIRS) {
    const dirPath = join(ASSETS, dir);
    let files: string[];
    try {
      files = (await readdir(dirPath)).filter((f) => f.endsWith(".png"));
    } catch {
      console.log(`Skipping ${dir}/ (not found)`);
      continue;
    }

    if (files.length === 0) {
      console.log(`Skipping ${dir}/ (no PNGs)`);
      continue;
    }

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

  console.log(`\nConverted ${totalFiles} files`);
  console.log(`Before: ${(totalBefore / 1024).toFixed(0)} KB`);
  console.log(`After:  ${(totalAfter / 1024).toFixed(0)} KB`);
  console.log(
    `Saved:  ${((totalBefore - totalAfter) / 1024).toFixed(0)} KB (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%)`,
  );
}

async function main() {
  await convertToWebP();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
