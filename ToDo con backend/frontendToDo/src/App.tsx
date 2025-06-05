import MainPage from "./pages/MainPage.tsx";
import { ConfigPage } from "./pages/ConfigPage.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/:id" element={<MainPage />} />
          <Route path="/settings" element={<ConfigPage />} />
        </Routes>
      </Router>
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
}

export default App;
