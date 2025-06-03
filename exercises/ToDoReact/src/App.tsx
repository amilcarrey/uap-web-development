import { Navigate } from "@tanstack/react-router";

interface AppProps {
  redirectTo?: string;
}

function App({ redirectTo = "/tab/today" }: AppProps) {
  return <Navigate to={redirectTo} />;
}

export default App;
