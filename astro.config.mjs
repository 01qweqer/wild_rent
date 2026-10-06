// @ts-check
import { defineConfig } from 'astro/config';

// The site is published at https://01qweqer.github.io/wild_rent/
// If you connect your own domain (e.g. wildrent.kz), set `site` to it and remove `base`.
export default defineConfig({
  site: 'https://01qweqer.github.io',
  base: '/wild_rent',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
