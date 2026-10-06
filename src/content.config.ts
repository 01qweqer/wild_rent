import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Categories live in one file: src/content/categories.yaml
const categories = defineCollection({
  loader: file('src/content/categories.yaml'),
  schema: z.object({
    name: z.string(),
    // Lower numbers are shown first.
    order: z.number().default(100),
    description: z.string().optional(),
  }),
});

// Every item is a folder: src/content/items/<item-id>/item.yaml + its photos.
// The folder name becomes the item's web address: /item/<item-id>/
const items = defineCollection({
  loader: glob({
    pattern: '*/item.yaml',
    base: './src/content/items',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      category: reference('categories'),
      // Price per day.
      price: z.number().int().positive(),
      // Optional deposit shown on the item page.
      deposit: z.number().int().positive().optional(),
      // false = "Сейчас в аренде" badge is shown.
      available: z.boolean().default(true),
      // true = shown on the home page.
      featured: z.boolean().default(false),
      // Lower numbers are shown first inside a category.
      order: z.number().default(100),
      photos: z.array(image()).min(1, 'Добавьте хотя бы одно фото'),
      description: z.string().optional(),
      // Characteristics: "Название: значение" pairs, shown in the given order.
      specs: z.record(z.string(), z.union([z.string(), z.number()])).default({}),
      // For sets: ids (folder names) of the items included in the set.
      includes: z.array(reference('items')).default([]),
      // For sets: extra things in the set that are not separate items on the site.
      includesText: z.array(z.string()).default([]),
    }),
});

export const collections = { categories, items };
