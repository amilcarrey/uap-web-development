// Importa React y ReactDOM para renderizar la aplicación
import React from "react";
import ReactDOM from "react-dom/client";

// Importa el componente principal de la aplicación
import App from "./App";

// Importa BrowserRouter para el manejo de rutas
import { BrowserRouter } from "react-router-dom";

// Importa el proveedor de autenticación
import { AuthProvider } from "./contexts/AuthContext";

// Importa los estilos globales
import "./index.css"; 

// Renderiza la aplicación en el elemento con id "root"
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Provee el enrutamiento a la aplicación */}
    <BrowserRouter>
      {/* Provee el contexto de autenticación a la aplicación */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);