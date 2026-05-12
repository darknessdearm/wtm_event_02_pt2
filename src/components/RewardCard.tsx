// src/components/RewardCard.tsx
import React from "react";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";
import type { Scenario, Item } from "../types";

interface Props {
  scenario: Scenario;
  rewardItem: Item;
  mapName: string;
  onRefresh: () => void;
  onConfirm: () => void;
}

const RewardCard: React.FC<Props> = ({
  scenario,
  rewardItem,
  mapName,
  onRefresh,
  onConfirm,
}) => {
  return (
    <Card sx={{ mt: 2, mb: 3, width: { xs: "100%", sm: "80%", md: "60%" } }}>
      <CardContent>
        <Grid
          container
          sx={{
            mb: 2,
            justifyContent: "center",
            direction: "row",
            alignItems: "center",
          }}
        >
          <Grid size="auto">
            <img
              src={rewardItem.imgUrl ?? ""}
              style={{ maxWidth: "200px", maxHeight: "200px" }}
            />
          </Grid>
          <Grid
            size="auto"
            sx={{
              ml: 2,
              px: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">สถานการณ์:</Typography>
            <Typography>{scenario.description}</Typography>

            <Typography variant="subtitle1">จาก {mapName}</Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              ของรางวัล:
            </Typography>
            <Typography>{rewardItem.name}</Typography>
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-line", // preserves \n as line breaks
                wordBreak: "break-word", // breaks long words/URLs
                overflowWrap: "break-word",
              }}
            >
              คำอธิบาย: {rewardItem.description}
            </Typography>
          </Grid>
        </Grid>

        <Button variant="contained" sx={{ mt: 2, mr: 2 }} onClick={onRefresh}>
          กดสุ่มใหม่
        </Button>
        <Button variant="contained" sx={{ mt: 2 }} onClick={onConfirm}>
          รับไอเทมนี้
        </Button>
      </CardContent>
    </Card>
  );
};

export default RewardCard;
