// Shrinks photos in src/content/items so the repository stays small.
// Usage: npm run photos
// - resizes anything larger than MAX_SIDE px on its longest side
// - re-encodes JPEG/PNG/WEBP/HEIC files larger than MAX_BYTES as JPEG
// - fixes rotation from phone EXIF data and strips metadata (incl. GPS location)
import { readdir, rename, stat, unlink, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import sharp from 'sharp';

const ROOT = 'src/content/items';
const MAX_SIDE = 1600;
const MAX_BYTES = 600 * 1024;
const PHOTO_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (PHOTO_EXT.has(extname(entry.name).toLowerCase())) yield path;
  }
}

let changed = 0;
const renamed = [];
for await (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase();
  const { size } = await stat(file);
  let meta;
  try {
    meta = await sharp(file).metadata();
  } catch {
    console.error(`✗ ${file}: не удалось открыть. Сохраните фото как JPG и запустите снова.`);
    process.exitCode = 1;
    continue;
  }
  const tooBig = Math.max(meta.width ?? 0, meta.height ?? 0) > MAX_SIDE || size > MAX_BYTES;
  const needsConvert = ext === '.heic' || ext === '.heif';
  if (!tooBig && !needsConvert) continue;

  const buffer = await sharp(file)
    .rotate()
    .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();

  // Keep .jpg/.jpeg names so item.yaml does not need to change.
  const target = ext === '.jpg' || ext === '.jpeg' ? file : file.slice(0, -ext.length) + '.jpg';
  await writeFile(target + '.tmp', buffer);
  if (target !== file) {
    await unlink(file);
    renamed.push(`${file} → ${target}`);
  }
  await rename(target + '.tmp', target);
  changed++;
  console.log(`✓ ${target}: ${(size / 1024).toFixed(0)} KB → ${(buffer.length / 1024).toFixed(0)} KB`);
}

console.log(changed ? `\nОптимизировано фото: ${changed}` : 'Все фото уже оптимизированы.');
if (renamed.length) {
  console.log('\nВНИМАНИЕ: эти файлы переименованы в .jpg — поправьте имена в item.yaml:');
  for (const r of renamed) console.log('  ' + r);
}
