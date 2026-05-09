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
  Card,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { RewardCard } from "../components";
import type { Scenario, Character, Item } from "../types";
import { collection, addDoc } from "firebase/firestore";
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
    if (!name || !position || !mapArea) return;
    const filtered = items.filter((s) => s.mapArea === mapArea);
    const dropItem: Item =
      filtered[Math.floor(Math.random() * filtered.length)];
    const randomScenario =
      scenarios[Math.floor(Math.random() * scenarios.length)];
    setCurrentScenario(randomScenario);
    setFoundItem(dropItem);
  };

  const handleConfirm = async () => {
    if (!currentScenario) return;
    const newChar: Character = {
      name,
      position,
      mapArea,
      itemsCollected: [],
    };
    // เขียนไป Firestore
    await addDoc(collection(db, "characters"), newChar);
    alert("บันทึกเรียบร้อย!");
    setName("");
    setPosition("");
    setMapArea("");
    setCurrentScenario(null);
  };

  return (
    <Container className="container">
      <section className="titleSection">
        <Typography variant="h4" className="prompt-regular">
          สุ่มสถานการณ์ในการค้นพาเด็กหญิง Part 2
        </Typography>
      </section>

      <Paper sx={{ p: 2, mb: 3, width: { xs: "100%", sm: "80%", md: "60%" } }}>
        <div className="infoSection">
          <Typography variant="body1" className="prompt-regular" gutterBottom>
            กรอกข้อมูลตัวละครของคุณ
          </Typography>
        </div>

        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              className="selectSection"
              color="primary"
              label="ชื่อ-นามสกุลตัวละคร"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mr: 1 }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl className="selectSection">
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
            <FormControl className="selectSection">
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

      {/* {currentScenario && foundItem && ( */}
      <RewardCard
        scenario={{ id: "s1", description: "เจอปีศาจในป่า" } as Scenario} // คุณอาจต้องปรับโครงสร้าง Scenario ใน data.ts เพื่อให้มี reward
        rewardItem={{ id: "i1", name: "Sword", mapArea: "001" } as Item} // คุณอาจต้องปรับโครงสร้าง Scenario ใน data.ts เพื่อให้มี reward
        mapName={
          mapOptions.find((m) => m.id === mapArea)?.name || "Unknown Map"
        }
        onConfirm={handleConfirm}
      />
      {/* )} */}
    </Container>
  );
};

export default Home;
