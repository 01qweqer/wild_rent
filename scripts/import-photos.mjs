// Moves new photos from photos-inbox/ into the catalog.
// Usage: npm run photos:import
//
// photos-inbox/<item-id>/*.jpg  →  src/content/items/<item-id>/<next number>.jpg
// - photos are resized to 1600 px, rotated correctly, and stripped of metadata (incl. GPS)
// - they are appended to the `photos:` list in item.yaml (in file-name order)
// - if the item does not exist yet, a stub item.yaml is created; the build fails
//   until you fill in name, category and price, so a half-done item is never published
// - originals are deleted from the inbox after a successful import
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import sharp from 'sharp';

const INBOX = 'photos-inbox';
const ITEMS = 'src/content/items';
const MAX_SIDE = 1600;
const PHOTO_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif']);
const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const STUB = `# NEW ITEM — fill in name, category and price, then delete this comment.
# The site will not build until these are filled in.
name: TODO
category: TODO   # an id from src/content/categories.yaml
price: 0         # price per day, digits only
photos:
`;

const isPhoto = (name) => PHOTO_EXT.has(extname(name).toLowerCase());

/** Next free number for "<n>.jpg" in an item folder. */
async function nextNumber(dir) {
  if (!existsSync(dir)) return 1;
  const nums = (await readdir(dir))
    .map((f) => /^(\d+)\.[a-z]+$/i.exec(f)?.[1])
    .filter(Boolean)
    .map(Number);
  return nums.length ? Math.max(...nums) + 1 : 1;
}

/** Appends "- ./<file>" lines to the photos: list of an item.yaml text. */
function addToPhotosList(yaml, files) {
  const lines = yaml.replace(/\s+$/, '').split('\n');
  const start = lines.findIndex((l) => /^photos:\s*(#.*)?$/.test(l));
  if (start === -1) {
    return [...lines, 'photos:', ...files.map((f) => `  - ./${f}`)].join('\n') + '\n';
  }
  let end = start;
  let indent = '  ';
  for (let i = start + 1; i < lines.length; i++) {
    const m = /^(\s+)-\s/.exec(lines[i]);
    if (m) {
      indent = m[1];
      end = i;
    } else if (lines[i].trim() !== '' && !lines[i].trim().startsWith('#')) {
      break;
    }
  }
  lines.splice(end + 1, 0, ...files.map((f) => `${indent}- ./${f}`));
  return lines.join('\n') + '\n';
}

if (!existsSync(INBOX)) {
  console.log(`Папка ${INBOX}/ не найдена.`);
  process.exit(0);
}

const entries = await readdir(INBOX, { withFileTypes: true });
const loose = entries.filter((e) => e.isFile() && isPhoto(e.name)).map((e) => e.name);
const folders = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();

let imported = 0;
let failed = false;
const created = [];

for (const id of folders) {
  if (!ID_RE.test(id)) {
    console.error(`✗ ${INBOX}/${id}/: имя папки должно быть латиницей, цифрами и "-" (например palatka-4-mestnaya). Пропущено.`);
    failed = true;
    continue;
  }
  const src = join(INBOX, id);
  const photos = (await readdir(src))
    .filter(isPhoto)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (photos.length === 0) continue;

  const dest = join(ITEMS, id);
  const yamlPath = join(dest, 'item.yaml');
  await mkdir(dest, { recursive: true });
  let n = await nextNumber(dest);
  const added = [];

  for (const photo of photos) {
    const from = join(src, photo);
    const name = `${n}.jpg`;
    try {
      await sharp(from)
        .rotate()
        .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(join(dest, name));
    } catch {
      console.error(`✗ ${from}: не удалось открыть. Сохраните фото как JPG и запустите снова.`);
      failed = true;
      continue;
    }
    await rm(from);
    added.push(name);
    n++;
  }
  if (added.length === 0) continue;

  const isNew = !existsSync(yamlPath);
  const yaml = isNew ? STUB : await readFile(yamlPath, 'utf8');
  await writeFile(yamlPath, addToPhotosList(yaml, added));
  if (isNew) created.push(yamlPath);
  imported += added.length;
  console.log(`✓ ${id}: добавлено ${added.length} фото (${added.join(', ')})`);

  if ((await readdir(src)).length === 0) await rm(src, { recursive: true });
}

console.log(imported ? `\nИмпортировано фото: ${imported}` : '\nНовых фото в папках не найдено.');
if (created.length) {
  console.log('\nСозданы новые товары — заполните name, category и price:');
  for (const c of created) console.log('  ' + c);
}
if (loose.length) {
  console.log(`\nФото лежат прямо в ${INBOX}/ и не импортированы — разложите их по папкам с id товара:`);
  for (const f of loose) console.log('  ' + f);
}
if (failed) process.exitCode = 1;
