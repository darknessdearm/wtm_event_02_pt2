# Item Pool — Setup & Usage

The item pool lives at `/itemPool` in Firebase Realtime Database. Each entry has an `id` and a `quantity`. The Home page weighted-randomizes from this pool and decrements the quantity by 1 when a user confirms an item.

```
itemPool: {
  i1:  { id: "i1",  quantity: 1  },
  i2:  { id: "i2",  quantity: 10 },
  ...
}
```

`isOnlyOne` items are seeded with `quantity: 1`; everything else defaults to `10`.

---

## 1. Configure Firebase

Create `.env.local` (gitignored) at the project root with your Firebase web config:

```bash
VITE_API_KEY=...
VITE_AUTH_DOMAIN=...
VITE_DATABASE_URL=...
VITE_PROJECT_ID=...
VITE_STORAGE_BUCKET=...
VITE_MESSAGING_SENDER_ID=...
VITE_APP_ID=...
```

## 2. Start the dev server

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## 3. Seed `/itemPool` (one-time)

Open DevTools → Console and run **one** of the options below.

### Option A — Seed from the bundled JSON

Uses [src/itemPool.json](src/itemPool.json) as the source of truth.

```js
// Writes only if /itemPool doesn't exist yet
await window.seedItemPool();

// Force-overwrite an existing pool
await window.seedItemPool(true);
```

To change quantities: edit [src/itemPool.json](src/itemPool.json), save (Vite hot-reloads), then run `await window.seedItemPool(true)`.

### Option B — Seed from any local JSON file (no rebuild)

Useful when the JSON lives outside the repo, or you want to try variations without editing source.

```js
const input = document.createElement('input');
input.type = 'file';
input.accept = 'application/json';
input.onchange = async () => {
  await window.seedItemPoolFromFile(input.files[0], true);
};
input.click();
```

The file must match this shape:

```json
{
  "i1":  { "id": "i1",  "quantity": 1 },
  "i2":  { "id": "i2",  "quantity": 10 }
}
```

## 4. Verify in the Firebase Console

Open Realtime Database → you should see an `itemPool` node with every item id and its quantity.

---

## How the random draw works

On the Home page:

1. User fills name / position / map area and clicks **สุ่มสถานการณ์**.
2. The app filters `items` by `mapArea`, keeps only ids whose pool `quantity > 0`, and picks one weighted by remaining quantity (an item with `quantity: 10` is 10× more likely than one with `quantity: 1`).
3. If the user re-rolls, **no decrement happens** — the pool only changes on confirm.
4. When the user clicks **รับไอเทมนี้**, a Firebase transaction (`runTransaction`) atomically decrements `/itemPool/<id>/quantity` by 1. If the value is already 0 (another user grabbed the last one between roll and confirm), the transaction aborts and an "ไอเทมหมด" dialog is shown.

## Resetting the pool

```js
await window.seedItemPool(true);
```

This overwrites `/itemPool` with the JSON's current values. Existing character data under `/characters` is left untouched.
