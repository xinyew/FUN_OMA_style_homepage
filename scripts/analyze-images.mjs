/* Measures every project image before the build:
   - brightness of the top band (0-255 luma). Under 157 the nav switches to white
     ink over that image, the same rule the source site applies.
   - a 24px blurred placeholder shown while the full image loads.
   Writes src/data/images.json, keyed by "<project-folder>/<file>". */
import sharp from 'sharp';
import { readdir, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('src/content/projects');
const OUT = path.resolve('src/data/images.json');
const THRESHOLD = 157;
const BAND = 0.15;
const EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);

async function topBrightness(file, width, height) {
  const bandHeight = Math.max(1, Math.round(height * BAND));
  const { data, info } = await sharp(file)
    .rotate()
    .flatten({ background: '#000000' })
    .extract({ left: 0, top: 0, width, height: bandHeight })
    .resize(64, Math.max(1, Math.round((64 * bandHeight) / width)), { fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const c = info.channels;
  let sum = 0;
  for (let i = 0; i < data.length; i += c) {
    sum += c >= 3 ? 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2] : data[i];
  }
  return sum / (data.length / c);
}

const result = {};
const folders = (await readdir(ROOT, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort();
for (const folder of folders) {
  const files = (await readdir(path.join(ROOT, folder))).filter((f) => EXTS.has(path.extname(f).toLowerCase())).sort();
  for (const f of files) {
    const file = path.join(ROOT, folder, f);
    const meta = await sharp(file).rotate().metadata();
    const swap = meta.orientation && meta.orientation >= 5;
    const width = swap ? meta.height : meta.width;
    const height = swap ? meta.width : meta.height;
    const brightness = await topBrightness(file, width, height);
    const lqip = await sharp(file).rotate().flatten({ background: '#000000' }).resize(24).blur(1.2).jpeg({ quality: 50 }).toBuffer();
    result[`${folder}/${f}`] = {
      width,
      height,
      brightness: Math.round(brightness),
      ground: brightness < THRESHOLD ? 'dark' : 'light',
      lqip: `data:image/jpeg;base64,${lqip.toString('base64')}`
    };
    console.log(`${folder}/${f}`.padEnd(36), String(Math.round(brightness)).padStart(3), brightness < THRESHOLD ? 'dark' : 'light');
  }
}
await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(result, null, 2) + '\n');
