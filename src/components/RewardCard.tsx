// src/components/RewardCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import type { Scenario, Item } from "../types";
import { Close } from "@mui/icons-material";
import { resolveItemImage } from "../utils/itemImages";

interface Props {
  scenario: Scenario;
  rewardItem: Item;
  mapName: string;
  onRefresh?: () => void;
  onConfirm: () => void;
}

const RewardCard: React.FC<Props> = ({
  scenario,
  rewardItem,
  mapName,
  onRefresh,
  onConfirm,
}) => {
  const [showDialog, setShowDialog] = React.useState(false);

  const handleConfirm = () => {
    setShowDialog(true);
  };

  const renderDialog = () => {
    return (
      <Dialog open={showDialog} onClose={handleConfirm}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ mt: 2, px: 3 }}>
            คุณแน่ใจใช่ไหมว่าต้องการรับไอเทมนี้?
          </Typography>
          <IconButton
            onClick={() => setShowDialog(false)}
            sx={{ mt: 1, mr: 1 }}
          >
            <Close />
          </IconButton>
        </div>
        <DialogContent>
          <DialogContentText>
            หากคุณกด "รับไอเทมนี้" คุณจะได้รับไอเทมดังกล่าว
            และไม่สามารถเปลี่ยนแปลงได้
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {onRefresh && (
            <Button
              onClick={() => {
                onRefresh();
                setShowDialog(false);
              }}
              color="secondary"
              variant="contained"
              sx={{
                width: { xs: "100%", sm: "auto" },
                height: { xs: "50px", sm: "auto" },
              }}
            >
              กดสุ่มอีกครั้ง
            </Button>
          )}
          <Button
            onClick={() => {
              setShowDialog(false);
              onConfirm();
            }}
            color="primary"
            variant="contained"
            sx={{
              width: { xs: "100%", sm: "auto" },
              height: { xs: "50px", sm: "auto" },
            }}
          >
            รับไอเทมนี้
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      {renderDialog()}
      <Card sx={{ mt: 2, mb: 3, width: { xs: "100%", sm: "80%" } }}>
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
            <Grid size={{ xs: 12, sm: 4 }}>
              <img
                src={resolveItemImage(rewardItem.imgUrl)}
                style={{
                  maxWidth: "250px",
                  maxHeight: "250px",
                  justifyContent: "center",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </Grid>
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{
                mt: 2,
                ml: { xs: 0, sm: 2 },
                px: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <Grid>
                <Typography variant="h4" style={{ textAlign: "left" }}>
                  คุณเจอกับ....
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="h6" style={{ textAlign: "left" }}>
                  สถานการณ์:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "left",
                    fontSize: { xs: "18px", sm: "20px" },
                  }}
                >
                  {scenario.description}
                </Typography>
              </Grid>

              <Grid></Grid>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                จากพื้นที่ {mapName}
              </Typography>
              <Typography
                variant="h6"
                style={{ textAlign: "left" }}
                sx={{ mt: 1 }}
              >
                ไอเทมที่ได้รับ: {rewardItem.name}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-line", // preserves \n as line breaks
                  wordBreak: "break-word", // breaks long words/URLs
                  overflowWrap: "break-word",
                }}
              >
                คำอธิบาย:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textAlign: "left",
                  whiteSpace: "pre-line", // preserves \n as line breaks
                  wordBreak: "break-word", // breaks long words/URLs
                  overflowWrap: "break-word",
                }}
              >
                {rewardItem.description}
              </Typography>
            </Grid>
          </Grid>

          {onRefresh && (
            <Button
              variant="contained"
              color="secondary"
              sx={{
                mt: 2,
                mr: 2,
                width: { xs: "100%", sm: "auto" },
                height: { xs: "50px", sm: "auto" },
              }}
              onClick={onRefresh}
              size="large"
            >
              กดสุ่มอีกครั้ง
            </Button>
          )}
          <Button
            variant="contained"
            sx={{
              mt: 2,
              width: { xs: "100%", sm: "auto" },
              height: { xs: "50px", sm: "auto" },
            }}
            onClick={handleConfirm}
            size="large"
          >
            รับไอเทมนี้
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default RewardCard;
