import { Navigate } from "@tanstack/react-router";
import { useAuthStore } from "./store/authStore";
import "./utils/debugLogin"; // Import debug utility

interface AppProps {
  redirectTo?: string;
}

function App({ redirectTo = "/tab/today" }: AppProps) {
  const { isAuthenticated, user } = useAuthStore();

  console.log("🔄 App render:", {
    isAuthenticated,
    userName: user?.username,
    redirectTo,
  });

  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    console.log("🔒 Not authenticated, redirecting to /auth");
    return <Navigate to="/auth" />;
  }

  console.log("✅ Authenticated, redirecting to:", redirectTo);
  return <Navigate to={redirectTo} />;
}

export default App;
