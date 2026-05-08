// src/pages/Items.tsx
import React, { useEffect, useState } from "react";
import type { Item } from "../types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Card, CardContent, Typography } from "@mui/material";

const Items: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const snapshot = await getDocs(collection(db, "items"));
      const allItems: Item[] = snapshot.docs.map(doc => doc.data() as Item);
      setItems(allItems);
    };
    fetchItems();
  }, []);

  return (
    <div>
      <h2>รวมไอเทมทั้งหมด</h2>
      {items.map(item => (
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