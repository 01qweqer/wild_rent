// Fails if any photo in src/content/items is too large.
// Big photos make the site slow on mobile internet and bloat the repository forever
// (git keeps every version, even after the file is deleted).
// Fix: run `npm run photos` and commit the result.
import { readdir, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';

const ROOT = 'src/content/items';
const LIMIT = 1024 * 1024; // 1 MB
const PHOTO_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.avif']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (PHOTO_EXT.has(extname(entry.name).toLowerCase())) yield path;
  }
}

const tooBig = [];
for await (const file of walk(ROOT)) {
  const { size } = await stat(file);
  if (size > LIMIT) tooBig.push(`  ${file} — ${(size / 1024 / 1024).toFixed(1)} MB`);
}

if (tooBig.length) {
  console.error(`Слишком большие фото (больше 1 MB):\n${tooBig.join('\n')}\n\nЗапустите: npm run photos`);
  process.exit(1);
}
console.log('Размер фото в порядке.');
