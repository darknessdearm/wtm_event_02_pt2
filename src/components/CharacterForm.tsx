// components/CharacterForm.tsx
import React, { useState } from "react";
import { Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import type { Scenario, Item } from "../types";
import ResultCard from "./ResultCard";
import { scenarios } from "../data";

interface CharacterFormProps {
  onAddCharacter: (character: any) => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({ onAddCharacter }) => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [mapArea, setMapArea] = useState("");
  const [result, setResult] = useState<Scenario | null>(null);

  const handleSubmit = () => {
    if (!name || !position || !mapArea) return;
    // สุ่ม scenario ที่ตรงกับ mapArea
    const filtered = scenarios.filter(s => s.reward.mapArea === mapArea);
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setResult(random);

    // บันทึกตัวละคร (เฉพาะครั้งเดียว)
    onAddCharacter({
      name,
      position,
      mapArea,
      itemsCollected: [random.reward],
    });
  };

  return (
    <div>
      <TextField label="ชื่อตัวละคร" value={name} onChange={e => setName(e.target.value)} />
      <TextField label="ตำแหน่ง" value={position} onChange={e => setPosition(e.target.value)} />
      <FormControl>
        <InputLabel>พื้นที่</InputLabel>
        <Select value={mapArea} onChange={e => setMapArea(e.target.value)}>
          <MenuItem value="Forest">Forest</MenuItem>
          <MenuItem value="Desert">Desert</MenuItem>
          <MenuItem value="Castle">Castle</MenuItem>
        </Select>
      </FormControl>
      <Button onClick={handleSubmit}>สุ่มสถานการณ์</Button>

      {result && <ResultCard scenario={result} onConfirm={() => {}} />}
    </div>
  );
};

export default CharacterForm;