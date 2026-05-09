// src/components/RewardCard.tsx
import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import type { Scenario, Item } from "../types";

interface Props {
  scenario: Scenario;
  rewardItem: Item;
  mapName: string;
  onConfirm: () => void;
}

const RewardCard: React.FC<Props> = ({
  scenario,
  rewardItem,
  mapName,
  onConfirm,
}) => {
  return (
    <Card sx={{ mt: 2, mb: 3, width: { xs: "100%", sm: "80%", md: "60%" } }}>
      <CardContent>
        <Typography variant="h6">สถานการณ์:</Typography>
        <Typography>{scenario.description}</Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          ของรางวัล:
        </Typography>
        <Typography>
          {rewardItem.name} (จาก {mapName})
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={onConfirm}>
          รับไอเทมนี้
        </Button>
      </CardContent>
    </Card>
  );
};

export default RewardCard;
