// src/pages/History.tsx
import React, { useEffect, useState } from "react";
import type { Character } from "../types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Card, CardContent, Typography } from "@mui/material";

const History: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      const snapshot = await getDocs(collection(db, "characters"));
      const chars: Character[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Character));
      setCharacters(chars);
    };
    fetchCharacters();
  }, []);

  return (
    <div>
      <h2>ประวัติตัวละคร</h2>
      {characters.map(char => (
        <Card key={char.id} sx={{ mt: 1 }}>
          <CardContent>
            <Typography variant="h6">{char.name} ({char.position})</Typography>
            <Typography>พื้นที่: {char.mapArea}</Typography>
            <Typography>ไอเทมที่ได้รับ:</Typography>
            <ul>
              {char.itemsCollected.map(item => <li key={item.id}>{item.name} ({item.mapArea})</li>)}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default History;