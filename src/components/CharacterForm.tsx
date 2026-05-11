// components/CharacterForm.tsx
import React, { useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import type { Scenario, Item } from "../types";
import RewardCard from "./RewardCard";
import { scenarios, items, mapOptions } from "../data";

interface CharacterFormProps {
  onAddCharacter: (character: any) => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({ onAddCharacter }) => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [mapArea, setMapArea] = useState("");
  const [result, setResult] = useState<Scenario | null>(null);
  const [foundItem, setFoundItem] = useState<Item | null>(null);

  const handleSubmit = () => {
    if (!name || !position || !mapArea) return;
    const randomScenario =
      scenarios[Math.floor(Math.random() * scenarios.length)];
    const filteredItems = items.filter((i) => i.mapArea === mapArea);
    const dropItem =
      filteredItems[Math.floor(Math.random() * filteredItems.length)];
    setResult(randomScenario);
    setFoundItem(dropItem ?? null);

    onAddCharacter({
      name,
      position,
      mapArea,
      itemsCollected: dropItem ? [dropItem] : [],
    });
  };

  return (
    <div>
      <TextField
        label="ชื่อตัวละคร"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="ตำแหน่ง"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
      />
      <FormControl>
        <InputLabel>พื้นที่</InputLabel>
        <Select value={mapArea} onChange={(e) => setMapArea(e.target.value)}>
          <MenuItem value="Forest">Forest</MenuItem>
          <MenuItem value="Desert">Desert</MenuItem>
          <MenuItem value="Castle">Castle</MenuItem>
        </Select>
      </FormControl>
      <Button onClick={handleSubmit}>สุ่มสถานการณ์</Button>

      {result && foundItem && (
        <RewardCard
          scenario={result}
          rewardItem={foundItem}
          mapName={mapOptions.find((m) => m.id === mapArea)?.name ?? mapArea}
          onConfirm={() => {}}
        />
      )}
    </div>
  );
};

export default CharacterForm;
