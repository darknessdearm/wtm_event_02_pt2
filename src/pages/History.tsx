// src/pages/History.tsx
import React, { useEffect, useState } from "react";
import type { Character } from "../types";
import { onValue, ref } from "firebase/database";
import { db } from "../firebase";
import {
  Box,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { mapOptions, positionOptions } from "../data";
import { Search } from "@mui/icons-material";

const History: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filtered = characters.filter((char) =>
    char.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h2>บันทึกการค้นหา</h2>
      <TextField
        fullWidth
        placeholder="ค้นหาตัวละคร..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          mb: 3,
          width: "100%",
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(255,255,255,0.12)",
            borderRadius: "12px",
            "& fieldset": {
              borderColor: "rgba(255,255,255,0.4)",
              borderWidth: "2px",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255,255,255,0.7)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#c084fc",
            },
          },
          "& .MuiOutlinedInput-input": {
            color: "#fff",
            fontSize: "16px",
            padding: "14px 16px",
            "&::placeholder": {
              color: "rgba(255,255,255,0.5)",
              opacity: 1,
            },
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "rgba(255,255,255,0.6)" }} />
              </InputAdornment>
            ),
          },
        }}
      />
      <Grid container spacing={2} sx={{ width: "100%" }}>
        {filtered.map((char) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={char.id}>
            <Card
              key={char.id}
              sx={{ width: "100%", height: "100%", boxSizing: "border-box" }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ textAlign: "center", mt: 1 }}>
                  {char.name != "" ? char.name : "Unknown Character"}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2">
                    {
                      positionOptions.find((pos) => pos.id === char.position)
                        ?.name
                    }
                  </Typography>
                </Box>

                <Box sx={{ marginTop: "8px" }}>
                  <Typography variant="body2" sx={{ textAlign: "left", px: 3 }}>
                    สถานที่สำรวจ:
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: "left", px: 3 }}>
                    •{" "}
                    {
                      mapOptions.find((area) => area.id === char.mapArea)
                        ?.description
                    }
                  </Typography>
                </Box>

                {char.itemsCollected.length > 0 && (
                  <Box sx={{ marginTop: "8px" }}>
                    <Typography
                      variant="body2"
                      sx={{ textAlign: "left", px: 3 }}
                    >
                      ไอเทมที่ได้รับ:
                    </Typography>
                    {char.itemsCollected.map((item) => (
                      <Typography
                        variant="body2"
                        sx={{ textAlign: "left", px: 3 }}
                        key={item.id}
                      >
                        • {item.name}
                      </Typography>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default History;
