# Photo inbox

Drop zone for new, full-size photos. **Git ignores everything in this folder except this README**, so originals never get committed. That keeps the repository small, because Git keeps every file it has ever stored, even after the file is deleted.

## How to use

1. Make one folder per item, named with the item's id (the same as its folder in `src/content/items/`):

   ```
   photos-inbox/
   ├── palatka-4-mestnaya/   ← existing item: photos are added after its current ones
   │   ├── IMG_2041.jpg
   │   └── IMG_2042.jpg
   └── mangal-skladnoy/      ← new item: its folder and item.yaml are created
       └── IMG_2100.jpg
   ```

2. Run:

   ```bash
   npm run photos:import
   ```

   For each photo, the script:
   - resizes it to 1600 px, fixes rotation and removes GPS/location data;
   - saves it as `1.jpg`, `2.jpg`, … in `src/content/items/<id>/`;
   - adds it to the `photos:` list in `item.yaml`;
   - deletes the original from this inbox.

3. For a **new** item, fill in `name`, `category` and `price` in the generated `item.yaml`. The site won't build until you do, so a half-finished item is never published.

4. Commit and push.

Photos are imported in file-name order, and the first photo of a new item becomes its cover. To change the order later, reorder the `photos:` list in `item.yaml`.

iPhone HEIC photos usually can't be read. Export them as JPG first, or set the iPhone camera to **Settings → Camera → Formats → Most Compatible**.
