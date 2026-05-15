// src/pages/Items.tsx
import React, { useEffect, useState } from "react";
import type { Item } from "../types";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { resolveItemImage } from "../utils/itemImages";
import { items as itemCatalog } from "../data";

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.5;

const DIARY_PIECE_IDS = ["i20", "i21", "i22"] as const;
const COMBINED_DIARY_ID = "i29";

type CollectedItem = Item & { count: number };

const Items: React.FC = () => {
  const [items, setItems] = useState<CollectedItem[]>([]);
  const [selected, setSelected] = useState<CollectedItem | null>(null);
  const [zoom, setZoom] = useState<number>(ZOOM_MIN);

  const openItem = (item: CollectedItem) => {
    setSelected(item);
    setZoom(ZOOM_MIN);
  };
  const closeItem = () => setSelected(null);
  const zoomIn = () => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP));
  const zoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP));
  const zoomReset = () => setZoom(ZOOM_MIN);

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

      const hasAllDiaryPieces = DIARY_PIECE_IDS.every((id) => counts.has(id));
      if (hasAllDiaryPieces && !counts.has(COMBINED_DIARY_ID)) {
        const combined = itemCatalog.find((it) => it.id === COMBINED_DIARY_ID);
        if (combined) {
          counts.set(COMBINED_DIARY_ID, { ...combined, count: 1 });
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
        justifyContent: "flex-start",
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
              <CardActionArea
                onClick={() => openItem(item)}
                sx={{ height: "100%" }}
              >
                <CardContent>
                  <img
                    src={resolveItemImage(item.imgUrl)}
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
                  <Typography
                    sx={{ overflowWrap: "anywhere", textAlign: "center" }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    sx={{ overflowWrap: "anywhere", textAlign: "center" }}
                  >
                    ถูกเจอแล้ว {item.count} ชิ้น
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={selected !== null}
        onClose={closeItem}
        maxWidth="md"
        fullWidth
      >
        {selected && (
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ position: "relative" }}>
              <IconButton
                onClick={closeItem}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 2,
                  bgcolor: "rgba(255,255,255,0.85)",
                  "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                }}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>

              <Box
                sx={{
                  width: "100%",
                  height: { xs: 320, sm: 420, md: 520 },
                  overflow: "auto",
                  bgcolor: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  component="img"
                  src={resolveItemImage(selected.imgUrl)}
                  alt={selected.name}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    transform: `scale(${zoom})`,
                    transformOrigin: "center center",
                    transition: "transform 0.15s ease-out",
                    cursor: zoom > ZOOM_MIN ? "grab" : "zoom-in",
                  }}
                  onClick={() => (zoom >= ZOOM_MAX ? zoomReset() : zoomIn())}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  py: 1,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <IconButton
                  onClick={zoomOut}
                  disabled={zoom <= ZOOM_MIN}
                  aria-label="zoom out"
                >
                  <ZoomOutIcon />
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{ minWidth: 48, textAlign: "center" }}
                >
                  {Math.round(zoom * 100)}%
                </Typography>
                <IconButton
                  onClick={zoomIn}
                  disabled={zoom >= ZOOM_MAX}
                  aria-label="zoom in"
                >
                  <ZoomInIcon />
                </IconButton>
                <IconButton
                  onClick={zoomReset}
                  disabled={zoom === ZOOM_MIN}
                  aria-label="reset zoom"
                >
                  <RestartAltIcon />
                </IconButton>
              </Box>

              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ overflowWrap: "anywhere" }}>
                  {selected.name} ×{selected.count}
                </Typography>
                {selected.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {selected.description}
                  </Typography>
                )}
              </Box>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Items;
