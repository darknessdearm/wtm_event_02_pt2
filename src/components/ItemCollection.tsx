// components/ItemCollection.tsx
import React from "react";
import type { Item } from "../types";
import { Card, CardContent, Typography } from "@mui/material";

interface Props {
  items: Item[];
}

const ItemCollection: React.FC<Props> = ({ items }) => {
  return (
    <div>
      {items.map((item) => (
        <Card key={item.id} sx={{ margin: 1 }}>
          <CardContent>
            <Typography>{item.name}</Typography>
            <Typography variant="caption">พื้นที่: {item.mapArea}</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ItemCollection;
