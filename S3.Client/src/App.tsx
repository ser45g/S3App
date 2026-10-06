import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./providers/theme-provider";
import HomePage from "./components/pages/home/home-page";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme-mode-key">
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
