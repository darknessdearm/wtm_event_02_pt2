// types.ts
interface Character {
  id?: string; // เพิ่ม id สำหรับ Firestore
  name: string;
  position: string;
  mapArea: string;
  itemsCollected: Item[];
}

interface Item {
  id: string;
  name: string;
  description?: string;
  imgUrl?: string;
  mapArea: string;
  isOnlyOne?: boolean;
}

interface Scenario {
  id: string;
  description: string;
  mapArea?: string;
}

interface MapOption {
  id: string;
  name: string;
  description: string;
}

interface Position {
  id: string;
  name: string;
}

interface ItemPoolEntry {
  id: string;
  quantity: number;
}

export type { Character, Item, Scenario, MapOption, Position, ItemPoolEntry };
