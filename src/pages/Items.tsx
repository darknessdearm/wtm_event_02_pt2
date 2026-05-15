// src/pages/Items.tsx
import React, { useEffect, useState } from "react";
import type { Item } from "../types";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { Card, CardContent, Grid, Typography } from "@mui/material";

type CollectedItem = Item & { count: number };

const Items: React.FC = () => {
  const [items, setItems] = useState<CollectedItem[]>([]);

  useEffect(() => {
    const charactersRef = ref(db, "characters");
    const unsubscribe = onValue(charactersRef, (snapshot) => {
      const value = snapshot.val() as Record<string, unknown> | null;
      if (!value) {
        setItems([]);
        return;
      }

      const counts = new Map<string, CollectedItem>();
      for (const raw of Object.values(value)) {
        const data = (raw ?? {}) as { itemsCollected?: unknown };
        const itemsRaw = data.itemsCollected;
        const collected: Item[] = Array.isArray(itemsRaw)
          ? (itemsRaw as Item[])
          : itemsRaw && typeof itemsRaw === "object"
            ? (Object.values(itemsRaw as Record<string, unknown>) as Item[])
            : [];

        for (const item of collected) {
          if (!item?.id) continue;
          const existing = counts.get(item.id);
          if (existing) {
            existing.count += 1;
          } else {
            counts.set(item.id, { ...item, count: 1 });
          }
        }
      }

      setItems(Array.from(counts.values()));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div
      style={{
        flexGrow: 1,
        padding: "32px 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2>รวมไอเทมทั้งหมด</h2>
      <Grid container spacing={2} sx={{ width: "100%" }}>
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
                    width: "100%",
                    maxWidth: "250px",
                    maxHeight: "250px",
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                    margin: "0 auto",
                  }}
                  alt={item.name}
                />
                <Typography sx={{ overflowWrap: "anywhere", textAlign: "center" }}>
                  {item.name} ×{item.count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Items;
