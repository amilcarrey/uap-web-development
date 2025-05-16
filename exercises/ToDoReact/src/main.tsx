import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./styles/index.css"; // si tenés tailwind u otros estilos globales

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
