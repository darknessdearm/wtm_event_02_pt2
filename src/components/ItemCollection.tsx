// components/ItemCollection.tsx
import React from "react";
import type { Item } from "../types";
import { Card, CardContent, Typography } from "@mui/material";
import { mapOptions } from "../data";

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
            <Typography variant="caption">
              พื้นที่:{" "}
              {mapOptions.find((e) => e.id === item.mapArea)?.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ItemCollection;
