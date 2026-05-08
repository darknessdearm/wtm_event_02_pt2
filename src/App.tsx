// App.tsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CharacterForm from "./components/CharacterForm";
import CharacterHistory from "./components/CharacterHistory";
import ItemCollection from "./components/ItemCollection";
import type { Character } from "./types";
import { items } from "./data";

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  const addCharacter = (char: Character) => {
    setCharacters(prev => [...prev, char]);
  };

  return (
    <Router>
      <nav>
        <Link to="/">หน้าแรก</Link> | <Link to="/history">ประวัติตัวละคร</Link> | <Link to="/items">รวมไอเทม</Link>
      </nav>
      <Routes>
        <Route path="/" element={<CharacterForm onAddCharacter={addCharacter} />} />
        <Route path="/history" element={<CharacterHistory characters={characters} />} />
        <Route path="/items" element={<ItemCollection items={items} />} />
      </Routes>
    </Router>
  );
};

export default App;