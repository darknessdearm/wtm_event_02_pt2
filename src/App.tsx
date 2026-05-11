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
const basePath = "/wtm_event_02_pt2/";
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path={basePath} element={<Home />} />
          <Route path={`${basePath}history`} element={<History />} />
          <Route path={`${basePath}items`} element={<Items />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
