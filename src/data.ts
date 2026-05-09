// src/data.ts
import type { Scenario, Item, MapOption } from "./types";

export const items: Item[] = [
  { id: "i1", name: "Sword", mapArea: "001" },
  { id: "i2", name: "Shield", mapArea: "002" },
  { id: "i3", name: "Potion", mapArea: "003" },
];

export const scenarios: Scenario[] = [
  { id: "s1", description: "เจอปีศาจในป่า" },
  { id: "s2", description: "พบสมบัติกลางทะเลทราย" },
  { id: "s3", description: "ช่วยเจ้าหญิงในปราสาท" },
];

export const positionOptions = [
  { id: "p1", name: "นักเรียน" },
  { id: "p2", name: "ชาวเมือง" },
];

export const mapOptions: MapOption[] = [
  {
    id: "001",
    name: "พื้นที่ 1 - ประภาคารร้าง",
    description: "ประภาคารร้างที่ถูกลืม",
  },
  {
    id: "002",
    name: "พื้นที่ 2 - ป่ารอบๆ เรือนจำ",
    description: "ป่าทึบที่ล้อมรอบเรือนจำ",
  },
  {
    id: "003",
    name: "พื้นที่ 3 - โรงเรียน Murrwood High",
    description: "โรงเรียน High School ประจำเมือง",
  },
];
