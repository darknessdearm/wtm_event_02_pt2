// src/components/RewardCard.tsx
import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import type { Scenario } from "../types";

interface Props {
  scenario: Scenario;
  onConfirm: () => void;
}

const RewardCard: React.FC<Props> = ({ scenario, onConfirm }) => {
  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6">สถานการณ์:</Typography>
        <Typography>{scenario.description}</Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>ของรางวัล:</Typography>
        <Typography>{scenario.reward.name} (จาก {scenario.reward.mapArea})</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={onConfirm}>รับไอเทมนี้</Button>
      </CardContent>
    </Card>
  );
};

export default RewardCard;