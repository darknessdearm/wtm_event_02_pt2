// src/itemPool.ts
import type { ItemPoolEntry } from "./types";
import { ref, set, get } from "firebase/database";
import { db } from "./firebase";
import poolJson from "./itemPool.json";

export const defaultItemPool = poolJson as Record<string, ItemPoolEntry>;

export async function seedItemPool(
  force = false,
  pool: Record<string, ItemPoolEntry> = defaultItemPool,
): Promise<void> {
  const poolRef = ref(db, "itemPool");
  if (!force) {
    const snap = await get(poolRef);
    if (snap.exists()) {
      console.warn("itemPool already exists. Call seedItemPool(true) to overwrite.");
      return;
    }
  }
  await set(poolRef, pool);
  console.log("itemPool seeded:", pool);
}

export async function seedItemPoolFromFile(file: File, force = false): Promise<void> {
  const text = await file.text();
  const parsed = JSON.parse(text) as Record<string, ItemPoolEntry>;
  await seedItemPool(force, parsed);
}

if (typeof window !== "undefined") {
  const w = window as unknown as {
    seedItemPool: typeof seedItemPool;
    seedItemPoolFromFile: typeof seedItemPoolFromFile;
  };
  w.seedItemPool = seedItemPool;
  w.seedItemPoolFromFile = seedItemPoolFromFile;
}
