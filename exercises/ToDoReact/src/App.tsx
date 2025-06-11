import { Navigate } from "@tanstack/react-router";
import { useAuthStore } from "./store/authStore";

interface AppProps {
  redirectTo?: string;
}

function App({ redirectTo = "/tab/today" }: AppProps) {
  const { isAuthenticated } = useAuthStore();

  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return <Navigate to={redirectTo} />;
}

export default App;
