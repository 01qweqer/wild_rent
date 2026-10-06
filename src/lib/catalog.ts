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

export function formatPrice(value: number): string {
  return `${new Intl.NumberFormat('ru-RU').format(value)} ${SITE.currency}`;
}

/** wa.me link with a pre-filled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function itemWhatsappMessage(item: Item): string {
  const lines = [
    'Здравствуйте! Хочу арендовать:',
    `${item.data.name} — ${formatPrice(item.data.price)} / ${SITE.priceUnit}`,
    `${import.meta.env.SITE.replace(/\/$/, '')}${url(`item/${item.id}/`)}`,
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
