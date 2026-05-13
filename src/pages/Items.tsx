// src/pages/Items.tsx
import React, { useEffect, useState } from "react";
import type { Item } from "../types";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { Card, CardContent, Grid, Typography } from "@mui/material";

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
    <div
      style={{
        marginTop: "32px",
        padding: "0 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <h2>รวมไอเทมทั้งหมด</h2>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
            <Card
              key={item.id}
              sx={{ mt: 1, mb: 1, width: "100%", height: "100%" }}
            >
              <CardContent>
                <img
                  src={item.imgUrl ?? ""}
                  style={{
                    maxWidth: "250px",
                    maxHeight: "250px",
                    justifyContent: "center",
                    display: "block",
                    margin: "0 auto",
                  }}
                  alt={item.name}
                />
                <Typography>{item.name}</Typography>
                <Typography variant="caption"></Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Items;
