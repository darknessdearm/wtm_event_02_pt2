// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Home, History, Items } from "./pages";
import { Navbar } from "./components";

const theme = createTheme({
  typography: {
    fontFamily: '"Prompt", sans-serif',
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/items" element={<Items />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
