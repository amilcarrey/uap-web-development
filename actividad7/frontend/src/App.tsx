import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/boards/1" />} />
      <Route path="/boards/:boardId" element={<Home />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
