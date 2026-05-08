// components/CharacterHistory.tsx
import React from "react";
import type { Character } from "../types";
import { Card, CardContent, Typography } from "@mui/material";

interface Props {
  characters: Character[];
}

const CharacterHistory: React.FC<Props> = ({ characters }) => {
  return (
    <div>
      {characters.map((char, idx) => (
        <Card key={idx} sx={{ margin: 2 }}>
          <CardContent>
            <Typography variant="h6">{char.name} ({char.position})</Typography>
            <Typography>พื้นที่ที่เคยเข้าร่วม:</Typography>
            <ul>
              {char.itemsCollected.map(item => (
                <li key={item.id}>{item.name} (จาก {item.mapArea})</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CharacterHistory;