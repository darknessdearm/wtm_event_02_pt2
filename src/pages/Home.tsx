// src/pages/Home.tsx
import React, { useState } from "react";
import { TextField, MenuItem, Select, InputLabel, FormControl, Button } from "@mui/material";
import RewardCard from "../components/RewardCard";
import type { Scenario, Character } from "../types";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { scenarios } from "../data"; // สมมติคุณมีไฟล์ data.ts เก็บ scenarios

const mapOptions = ["Forest", "Desert", "Castle"];

const Home: React.FC = () => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [mapArea, setMapArea] = useState("");
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);

  const handleSubmit = () => {
    if (!name || !position || !mapArea) return;
    const filtered = scenarios.filter(s => s.reward.mapArea === mapArea);
    const randomScenario = filtered[Math.floor(Math.random() * filtered.length)];
    setCurrentScenario(randomScenario);
  };

  const handleConfirm = async () => {
    if (!currentScenario) return;
    const newChar: Character = {
      name,
      position,
      mapArea,
      itemsCollected: [currentScenario.reward]
    };
    // เขียนไป Firestore
    await addDoc(collection(db, "characters"), newChar);
    alert("บันทึกเรียบร้อย!");
    setName(""); setPosition(""); setMapArea(""); setCurrentScenario(null);
  };

  return (
    <div>
      <h2>กรอกข้อมูลตัวละคร</h2>
      <TextField label="ชื่อตัวละคร" value={name} onChange={e => setName(e.target.value)} sx={{mr:1}} />
      <TextField label="ตำแหน่ง" value={position} onChange={e => setPosition(e.target.value)} sx={{mr:1}} />
      <FormControl sx={{mr:1, minWidth: 120}}>
        <InputLabel>พื้นที่</InputLabel>
        <Select value={mapArea} onChange={e => setMapArea(e.target.value)}>
          {mapOptions.map(area => <MenuItem key={area} value={area}>{area}</MenuItem>)}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleSubmit}>สุ่มสถานการณ์</Button>

      {currentScenario && <RewardCard scenario={currentScenario} onConfirm={handleConfirm} />}
    </div>
  );
};

export default Home;