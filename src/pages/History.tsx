// src/pages/History.tsx
import React, { useEffect, useState } from "react";
import type { Character } from "../types";
import { onValue, ref } from "firebase/database";
import { db } from "../firebase";
import {
  Autocomplete,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { mapOptions } from "../data";
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

  return (
    <div className="container">
      <h2>บันทึกการค้นหา</h2>
      <Grid
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          flexDirection: "row",
        }}
      >
        <Autocomplete
          id="free-solo-demo"
          freeSolo
          options={characters.map((option) => option.name)}
          renderInput={(params) => (
            <TextField
              sx={{ minWidth: "300px" }}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                characters;
              }}
              color="primary"
              label="Search characters..."
              {...params}
            />
          )}
        />
        <IconButton onClick={() => {}}>
          <Search color="primary" />
        </IconButton>
      </Grid>
      <Grid container spacing={2}>
        {searchTerm &&
          characters.map((char) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={char.id}>
              <Card key={char.id} sx={{ mt: 1, mb: 1, width: "100%" }}>
                <CardContent>
                  <Typography variant="h6">
                    {char.name} ({char.position})
                  </Typography>
                  <Typography>
                    {mapOptions.find((area) => area.id === char.mapArea)?.name}
                  </Typography>
                  <Typography>ไอเทมที่ได้รับ:</Typography>
                  <ul>
                    {char.itemsCollected.map((item) => (
                      <li key={item.id}>
                        {item.name} ({item.mapArea})
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

export default History;
