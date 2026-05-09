// src/pages/History.tsx
import React, { useEffect, useState } from "react";
import type { Character } from "../types";
import { onValue, ref } from "firebase/database";
import { db } from "../firebase";
import { Card, CardContent, Typography } from "@mui/material";

const History: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const charactersRef = ref(db, "characters");

    const unsubscribe = onValue(charactersRef, (snapshot) => {
      const value = snapshot.val() as Record<string, unknown> | null;

      if (!value) {
        setCharacters([]);
        return;
      }

      const chars: Character[] = Object.entries(value).map(([id, raw]) => {
        const data = (raw ?? {}) as Partial<Character> & {
          itemsCollected?: unknown;
        };

        const itemsRaw = data.itemsCollected;
        const itemsCollected = Array.isArray(itemsRaw)
          ? itemsRaw
          : itemsRaw && typeof itemsRaw === "object"
            ? Object.values(itemsRaw as Record<string, unknown>)
            : [];

        return {
          id,
          name: data.name ?? "",
          position: data.position ?? "",
          mapArea: data.mapArea ?? "",
          itemsCollected: itemsCollected as Character["itemsCollected"],
        };
      });

      setCharacters(chars);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <h2>ประวัติตัวละคร</h2>
      {characters.map((char) => (
        <Card key={char.id} sx={{ mt: 1 }}>
          <CardContent>
            <Typography variant="h6">
              {char.name} ({char.position})
            </Typography>
            <Typography>พื้นที่: {char.mapArea}</Typography>
            <Typography>ไอเทมที่ได้รับ:</Typography>
            <ul>
              {char.itemsCollected.map((item) => (
                <li key={item.id}>
                  {item.name} ({item.mapArea})
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default History;
