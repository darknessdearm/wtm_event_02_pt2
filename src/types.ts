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
  ishidden?: boolean; // เพิ่มสถานะซ่อนสำหรับไอเทมที่ต้องปลดล็อกก่อนใช้งาน
  isLocked?: boolean; // เพิ่มสถานะล็อกสำหรับไอเทมที่ต้องปลดล็อกก่อนใช้งาน
}

interface Scenario {
  id: string;
  description: string;
  mapArea?: string[];
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

export type { Character, Item, Scenario, MapOption, Position };
