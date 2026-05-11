// src/pages/Items.tsx
import React, { useEffect, useState } from "react";
import type { Item } from "../types";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { Card, CardContent, Typography } from "@mui/material";

const Items: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const itemsRef = ref(db, "items");
    const unsubscribe = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allItems: Item[] = Object.entries(data).map(([id, value]) => ({
          ...(value as Omit<Item, "id">),
          id,
        }));
        setItems(allItems);
      } else {
        setItems([]);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>รวมไอเทมทั้งหมด</h2>
      {items.map((item) => (
        <Card key={item.id} sx={{ mt: 1 }}>
          <CardContent>
            <Typography>{item.name}</Typography>
            <Typography variant="caption">พื้นที่: {item.mapArea}</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Items;
