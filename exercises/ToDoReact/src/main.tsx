import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./styles/index.css"; // si tenés tailwind u otros estilos globales
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </QueryClientProvider>
);
