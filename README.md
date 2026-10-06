# Wild Rent

Online catalog for a camping and fishing equipment rental shop. Customers browse photos and prices, then book through WhatsApp: every "Арендовать" button opens WhatsApp with the item name, price and link already filled in.

- Russian-language site and mobile-first layout (phone, tablet, desktop).
- Static site built with [Astro](https://astro.build) and hosted on GitHub Pages. It needs no server, database or paid service.
- All content lives in this repository as plain YAML files plus photos.

Live address after the first deploy: **https://01qweqer.github.io/wild_rent/**

---

## One-time setup

1. Go to **Settings → Pages** in the repository on GitHub. Under **Build and deployment → Source**, choose **GitHub Actions**.
2. Merge this branch into `main`. Every push to `main` rebuilds and publishes the site in about 1–2 minutes. Progress shows in the **Actions** tab.
3. Replace the placeholders:
   - `src/site.config.ts`: WhatsApp number, phone, city, address, working hours, Instagram.
   - `public/logo.svg`: the real logo. For a PNG logo, put `logo.png` in `public/` and set `logo: 'logo.png'` in `src/site.config.ts`.
   - `src/content/items/*`: the sample items. Delete them all and add real ones (see below).

---

## How content is organized

```
src/content/
├── categories.yaml              ← list of categories
└── items/
    ├── palatka-4-mestnaya/      ← one folder = one item
    │   ├── item.yaml            ← name, price, specs…
    │   ├── 1.jpg                ← photos (the first one is the cover)
    │   └── 2.jpg
    └── nabor-pohod-na-dvoih/
        └── …
```

The folder name becomes the page address: `…/item/palatka-4-mestnaya/`. Use Latin letters, digits and `-` only, and don't rename a folder after customers have the link.

### Item file (`item.yaml`)

```yaml
name: Палатка 4-местная, двухслойная   # required
category: palatki                      # required: an id from categories.yaml
price: 4000                            # required: price per day, digits only
deposit: 20000                         # optional: shown as "Залог"
available: true                        # optional: false shows the "Сейчас в аренде" badge
featured: true                         # optional: show on the home page under "Популярное"
order: 1                               # optional: lower = earlier in its category
photos:                                # required: at least one; the first is the cover
  - ./1.jpg
  - ./2.jpg
description: >                         # optional
  Просторная палатка для семьи…
specs:                                 # optional: shown as a table, in this order
  Вместимость: 4 человека
  Вес: 7,5 кг
```

### Sets

A set is an ordinary item in the `nabory` category with two extra fields:

```yaml
includes:                  # folder names of items in the set; shown as links
  - palatka-2-mestnaya
  - spalnik-kokon
includesText:              # extra contents that aren't separate items
  - Набор посуды на двоих
```

Each item page also shows "Входит в наборы" with links to the sets that contain it.

---

## Common edits

| Task | What to do |
|---|---|
| Change a price | Edit `price:` in the item's `item.yaml` |
| Mark as rented out / back | `available: false` / `available: true` |
| Add an item | Put its photos in `photos-inbox/<new-item-id>/`, run `npm run photos:import`, fill in the generated `item.yaml` |
| Remove an item | Delete its folder (and remove it from any set's `includes`) |
| Add or rename a category | Edit `src/content/categories.yaml` |
| Change contacts | Edit `src/site.config.ts` |

You can make simple edits, such as a price or `available`, directly on github.com: open the file, click the pencil icon, then **Commit changes**. The site updates about 2 minutes later.

### Photos: read this before adding any

Phone photos are 3–8 MB each. Committed as-is, 100 items with a few photos each would push the repository over GitHub's limits. Git keeps every version forever, so deleting large photos later doesn't shrink the repository.

To prevent that, the build **fails if any photo is larger than 1 MB**.

- **On a computer (recommended):** put the originals in `photos-inbox/<item-id>/` and run `npm run photos:import`. The script shrinks them to 1600 px, fixes rotation, removes GPS data, adds them to `item.yaml` and empties the inbox. Git ignores the inbox, so the originals are never committed. See [`photos-inbox/README.md`](photos-inbox/README.md).
- **Photos already inside an item folder:** `npm run photos` shrinks any that are too big.
- **On github.com:** shrink the photos before uploading (any image resizer, max 1600 px, JPEG).

The site itself also produces small WebP versions for each screen size, so visitors on mobile data load only what they need.

---

## If something breaks

If an `item.yaml` has a mistake (a typo in `category`, a price written as text, a missing photo), the build in the **Actions** tab fails with a message naming the file and field. **The live site keeps showing the last working version** until you fix it.

---

## Working on a computer

Requires Node.js 22.12+.

```bash
npm install
npm run dev        # http://localhost:4321/wild_rent/ with live reload
npm run photos:import  # move photos from photos-inbox/ into items
npm run photos         # shrink oversized photos already in item folders
npm run build      # production build into dist/
```

## Own domain (optional)

To use something like `wildrent.kz`:

1. Set `site: 'https://wildrent.kz'` and remove the `base` line in `astro.config.mjs`.
2. Add the domain in **Settings → Pages → Custom domain**, and set up DNS with your domain registrar as GitHub's instructions describe.
