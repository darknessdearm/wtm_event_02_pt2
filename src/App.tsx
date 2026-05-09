// App.tsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home, History, Items } from "./pages";
import type { Character } from "./types";
import { items } from "./data";
import { Navbar } from "./components";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/items" element={<Items />} />
      </Routes>
    </Router>
  );
};

export default App;
