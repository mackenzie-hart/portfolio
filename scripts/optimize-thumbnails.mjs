// Pre-builds the landing-page case study thumbnails.
//
// Source files in src/assets/thumbs/ are raw exports (16K+ px) and never
// ship as-is. This resizes them to display size, applies a light unsharp
// mask to counter the softening a ~11x downsample introduces, and writes
// optimized WebP output to public/thumbs/. Re-run after replacing a source
// file in src/assets/thumbs/.
//
// Usage: node scripts/optimize-thumbnails.mjs

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcDir = path.join(root, 'src/assets/thumbs');
const outDir = path.join(root, 'public/thumbs');

const TARGET_WIDTH = 1400;
const WEBP_QUALITY = 97;

const files = [
  { in: 'rume-thumb.png', out: 'rume-thumb.webp' },
  { in: 'aether-bg.png', out: 'aether-bg.webp' },
  { in: 'greenroom-bg.png', out: 'greenroom-bg.webp' },
];

await mkdir(outDir, { recursive: true });

for (const { in: inFile, out: outFile } of files) {
  const inPath = path.join(srcDir, inFile);
  const outPath = path.join(outDir, outFile);

  const info = await sharp(inPath)
    .resize({ width: TARGET_WIDTH, kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.8, m1: 0.6, m2: 0.3 })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outPath);

  console.log(`${inFile} -> ${outFile}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
}
