// src/pages/Home.tsx
import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { RewardCard } from "../components";
import type { Scenario, Character, Item } from "../types";
import { ref, push } from "firebase/database";
import { db } from "../firebase";
import { items, positionOptions, scenarios, mapOptions } from "../data"; // สมมติคุณมีไฟล์ data.ts เก็บ scenarios
import "./Home.css";
import "../App.css";

const Home: React.FC = () => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [mapArea, setMapArea] = useState("");
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [foundItem, setFoundItem] = useState<Item | null>(null);

  const handleSubmit = () => {
    if (!name || !position || !mapArea) {
      const newErrors = {
        name: !name.trim(),
        position: !position,
        mapArea: !mapArea,
      };

      setErrors(newErrors);

      return;
    } else setErrors({ name: false, position: false, mapArea: false });
    const filtered = items.filter((s) => s.mapArea === mapArea);
    const dropItem: Item =
      filtered[Math.floor(Math.random() * filtered.length)];
    const randomScenario =
      scenarios[Math.floor(Math.random() * scenarios.length)];
    setCurrentScenario(randomScenario);
    setFoundItem(dropItem);
  };

  const [errors, setErrors] = useState({
    name: false,
    position: false,
    mapArea: false,
  });

  const handleConfirm = async () => {
    // validate fields

    try {
      const newChar: Character = {
        name,
        position,
        mapArea,
        itemsCollected: [...(foundItem ? [foundItem] : [])],
      };

      console.log("New character to save:", newChar);

      await push(ref(db, "characters"), newChar);

      alert("บันทึกเรียบร้อย!");

      // reset form
      setName("");
      setPosition("");
      setMapArea("");
      setCurrentScenario(null);

      // clear errors
      setErrors({
        name: false,
        position: false,
        mapArea: false,
      });
    } catch (error) {
      console.error("Save failed:", error);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
  };
  return (
    <Container className="container">
      <section className="titleSection">
        <Typography variant="h4" className="prompt-regular">
          สุ่มสถานการณ์ในการค้นพาเด็กหญิง Part 2
        </Typography>
      </section>

      <Paper sx={{ p: 2, mb: 3, width: { xs: "100%", sm: "80%" } }}>
        <div className="infoSection">
          <Typography variant="body1" className="prompt-regular" gutterBottom>
            กรอกข้อมูลตัวละครของคุณ
          </Typography>
        </div>

        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              fullWidth
              required
              label="ชื่อ-นามสกุลตัวละคร"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              helperText={errors.name ? "กรุณากรอกชื่อ" : ""}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required error={errors.position}>
              <InputLabel>ตำแหน่ง</InputLabel>
              <Select
                label="ตำแหน่ง"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                {positionOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required error={errors.mapArea}>
              <InputLabel>พื้นที่</InputLabel>
              <Select
                label="พื้นที่"
                value={mapArea}
                onChange={(e) => setMapArea(e.target.value)}
              >
                {mapOptions.map((area) => (
                  <MenuItem key={area.id} value={area.id}>
                    {area.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Button onClick={handleSubmit} variant="contained" size="large">
        สุ่มสถานการณ์
      </Button>

      {currentScenario && foundItem && (
        <RewardCard
          scenario={currentScenario} // คุณอาจต้องปรับโครงสร้าง Scenario ใน data.ts เพื่อให้มี reward
          rewardItem={foundItem} // คุณอาจต้องปรับโครงสร้าง Scenario ใน data.ts เพื่อให้มี reward
          mapName={
            mapOptions.find((m) => m.id === mapArea)?.name || "Unknown Map"
          }
          onRefresh={handleSubmit}
          onConfirm={handleConfirm}
        />
      )}
    </Container>
  );
};

export default Home;
