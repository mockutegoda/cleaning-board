# Cleaning board

A photo checklist for a household cleaner, made for one iPad in the kitchen.

The cleaner opens it when she arrives, works through the photos and taps each
one off. The owner adds and edits the tasks behind a PIN.

There is no server, no account and no cost. Everything — including the photos —
is stored on the iPad itself, in the browser's IndexedDB.

## The files

| File | What it is |
| --- | --- |
| `index.html` | The whole app: markup, styles and JavaScript in one readable file |
| `sw.js` | Service worker, so the app opens with the wifi off |
| `manifest.json` | Name and icon for the home-screen app |
| `icon-192.png`, `icon-512.png` | The icon |

Plain HTML, CSS and JavaScript. No build step, no npm, no framework. To change
something, open `index.html` in any text editor and edit it.

---

## Publishing to GitHub Pages

You only do this once. Afterwards, updating the app is just steps 6–7 again.

1. Sign in at [github.com](https://github.com) and click **New repository**.
2. Name it `cleaning-board`. Choose **Public**. Do not tick "Add a README".
   Click **Create repository**.
3. On the next page, click **uploading an existing file**.
4. Drag in all five files: `index.html`, `sw.js`, `manifest.json`,
   `icon-192.png`, `icon-512.png`. Do not drag the folder itself — the files
   must sit at the top level of the repository, not inside a subfolder.
   (`README.md` is optional; upload it if you like.)
5. Click **Commit changes**.
6. Go to **Settings** (top of the repository) → **Pages** (left sidebar).
7. Under "Build and deployment", set **Source** to `Deploy from a branch`,
   set the branch to `main` and the folder to `/ (root)`. Click **Save**.
8. Wait a minute or two, then reload that page. It will show:
   **Your site is live at `https://YOUR-USERNAME.github.io/cleaning-board/`**

That address is the app. Open it in a browser to check it works.

> **Why publish it at all?** iOS Safari is unreliable about IndexedDB and
> service workers when a page is opened straight from a file. A real
> `https://` address is also required for "Add to Home Screen". Publishing is
> the simplest way to get one.

### Updating it later

Edit `index.html`, then in the repository click the file → the pencil icon →
paste the new contents → **Commit changes**. Also open `sw.js` and change the
version line:

```js
const CACHE_VERSION = 'cleaning-board-v1';   // -> 'cleaning-board-v2'
```

That is what tells the iPad to fetch the new version instead of the copy it
already has. Then, on the iPad, close the app fully and open it again — twice
if needed. **Updating never touches the tasks or photos**, which live in the
iPad's own storage, not in the repository.

---

## Adding it to the iPad home screen

Do this on the iPad, in **Safari** (not Chrome — only Safari can install a
home-screen app on iOS).

1. Open `https://YOUR-USERNAME.github.io/cleaning-board/` in Safari.
2. Wait for the board to appear, so the app has a chance to store itself for
   offline use.
3. Tap the **Share** button — the square with an arrow pointing up, in the
   toolbar.
4. Scroll down the share sheet and tap **Add to Home Screen**.
5. The name will be "Cleaning". Tap **Add**.
6. Close Safari. From now on, open the app using the green tick icon on the
   home screen, **not** through Safari. Opened this way it runs full screen
   with no address bar, and the cleaner cannot wander off into the web.

Two more things worth doing on the iPad:

- **Settings → Display & Brightness → Auto-Lock → Never**, if you want the
  screen to stay on all day. (The app also asks the iPad to stay awake while
  the board is open, but this setting is more reliable.)
- **Do not use Private Browsing** when first opening the site. Data saved in a
  private tab is thrown away.

---

## Using it

### The cleaner's screen

- Tap the photo to see it big.
- Tap the circle in the corner of a card, or the big **Mark as done** button,
  to tick it off.
- Finished tasks dim and move to the end. They never disappear, so a mistake
  can be undone by tapping again.
- In the big view: swipe or use the arrows to move between tasks, pinch to zoom
  in on a detail, double tap to zoom back out, swipe down or tap ✕ to close.
- `From last time` on a card means it was not finished at the last visit.

There is nothing here that can delete a task or reach the admin screen.

### The admin screen

Tap the small gear in the top corner of the board and enter the PIN.

The first time ever, it asks you to choose a 4-digit PIN. Only a scrambled
version of it is stored, so it cannot be read back out of the iPad — **write it
down somewhere**. Five wrong tries locks the keypad for a minute. Admin returns
to the board by itself after five minutes of being left alone.

**Tasks.** Every visit (repeating) and This visit only (one-off). Edit, delete,
or hold the grip on the right of a row and drag to reorder.

**Add task.** Take a photo, or choose one from the library — usually easier, as
you can AirDrop photos from a phone to the iPad first. Photos are shrunk on the
way in, so a 10MB iPhone photo is stored at a few hundred KB. A live preview
shows exactly how the card will look, which is worth a glance: a pale photo can
swallow the caption.

**Start new visit.** Press this when the cleaner arrives. It:

- unticks every repeating task,
- keeps unfinished one-offs and marks them `From last time`,
- deletes one-offs that were finished.

Nothing ever resets on a timer. Visits are irregular, and an automatic reset on
the wrong day would wipe the board in the middle of a clean. If it has been
more than three days, the screen mentions it — that is all it does.

**Backup.** This matters. The tasks and photos exist on this iPad and nowhere
else. If the iPad is lost, wiped, or Safari clears its storage, they are gone.
`Export backup` writes one `.json` file holding everything, photos included;
save it to iCloud Drive or mail it to yourself. `Restore from backup` reads one
back, replacing the whole board. Do it after any big change.

---

## Running it on a computer first

Because of how browsers treat local files, open it through a small web server
rather than double-clicking `index.html`. In Terminal:

```sh
cd cleaning-board
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. It behaves the same as on the iPad, with a
mouse instead of a finger.

## Starting over

To wipe the board completely on the iPad: Settings → Safari → Advanced →
Website Data, find the `github.io` entry and delete it. Everything goes,
including the PIN, and the app starts fresh with its five example tasks.
Export a backup first if you want anything back.
