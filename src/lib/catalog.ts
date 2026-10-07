import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../site.config';

export type Item = CollectionEntry<'items'>;
export type Category = CollectionEntry<'categories'>;

/** Builds a link that respects the site's base path (/wild_rent/). */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return `${base}/${clean}`;
}

const nf = new Intl.NumberFormat('ru-RU');

export function formatPrice(value: number): string {
  return `${nf.format(value)} ${SITE.currency}`;
}

/** "4 000 ₸", "1 000–2 000 ₸" or "от 1 500 ₸". */
export function itemPrice(item: Item): string {
  const { price, priceTo, priceFrom } = item.data;
  if (priceTo) return `${nf.format(price)}–${nf.format(priceTo)} ${SITE.currency}`;
  return priceFrom ? `от ${formatPrice(price)}` : formatPrice(price);
}

/** "сутки" unless the item sets its own unit. */
export function itemUnit(item: Item): string {
  return item.data.unit ?? SITE.priceUnit;
}

/**
 * Items with photos get a card and their own page.
 * Items without photos are shown as a compact row (name, price, WhatsApp button).
 * Adding a photo to an item moves it from the list into the cards automatically.
 */
export function hasPhotos(item: Item): boolean {
  return item.data.photos.length > 0;
}

/** Link to the item's page, or undefined if the item has no page (no photos yet). */
export function itemPageUrl(item: Item): string | undefined {
  return hasPhotos(item) ? url(`item/${item.id}/`) : undefined;
}

/** wa.me link with a pre-filled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function itemWhatsappMessage(item: Item): string {
  const page = itemPageUrl(item);
  const lines = [
    'Здравствуйте! Хочу арендовать:',
    `${item.data.name} — ${itemPrice(item)} / ${itemUnit(item)}`,
    ...(page ? [`${import.meta.env.SITE.replace(/\/$/, '')}${page}`] : []),
    '',
    'Даты: ',
  ];
  return lines.join('\n');
}

const byOrderThenName = (a: Item, b: Item) =>
  a.data.order - b.data.order || a.data.name.localeCompare(b.data.name, 'ru');

export async function getCategories(): Promise<Category[]> {
  const categories = await getCollection('categories');
  return categories.sort(
    (a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name, 'ru'),
  );
}

export async function getItems(): Promise<Item[]> {
  const items = await getCollection('items');
  const order = new Map((await getCategories()).map((c, i) => [c.id, i]));
  return items.sort(
    (a, b) =>
      (order.get(a.data.category.id) ?? 999) - (order.get(b.data.category.id) ?? 999) ||
      byOrderThenName(a, b),
  );
}

export async function getItemsByCategory(categoryId: string): Promise<Item[]> {
  const items = await getCollection('items', (item) => item.data.category.id === categoryId);
  return items.sort(byOrderThenName);
}
