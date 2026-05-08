// types.ts
interface Character {
  name: string;
  position: string;
  mapArea: string;
  itemsCollected: Item[];
}

interface Item {
  id: string;
  name: string;
  mapArea: string;
}

interface Scenario {
  id: string;
  description: string;
  reward: Item;
}

export { Character, Item, Scenario };
