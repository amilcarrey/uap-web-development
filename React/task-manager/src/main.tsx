import React from "react";
import ReactDOM from "react-dom/client";
import ToDoApp from "./ToDoApp";
import "./index.css"; // si usás Tailwind o estilos globales

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ToDoApp />
    </React.StrictMode>
  );
}
