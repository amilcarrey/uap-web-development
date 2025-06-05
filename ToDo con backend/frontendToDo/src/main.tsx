import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ConfiguracionProvider } from "./components/Configuraciones.tsx";
import App from "./App.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ConfiguracionProvider>
      <App />
    </ConfiguracionProvider>
  </QueryClientProvider>
);
