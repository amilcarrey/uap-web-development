import MainPage from "./pages/MainPage.tsx";
import { ConfigPage } from "./pages/ConfigPage.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { AuthInitializer } from "./components/AuthInitializer.tsx";

function App() {
  return (
    <>
      <AuthInitializer />
      <Router>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          } />
          <Route path="/:id" element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <ConfigPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
}

export default App;
