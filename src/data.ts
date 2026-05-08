// src/data.ts
import type { Scenario, Item } from "./types";

export const items: Item[] = [
  { id: "i1", name: "Sword", mapArea: "Forest" },
  { id: "i2", name: "Shield", mapArea: "Desert" },
  { id: "i3", name: "Potion", mapArea: "Castle" },
];

export const scenarios: Scenario[] = [
  { id: "s1", description: "เจอปีศาจในป่า", reward: items[0] },
  { id: "s2", description: "พบสมบัติกลางทะเลทราย", reward: items[1] },
  { id: "s3", description: "ช่วยเจ้าหญิงในปราสาท", reward: items[2] },
];