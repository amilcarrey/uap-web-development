import React, { useState, useEffect } from "react";
import { NuevoTableroForm } from "../components/NuevoTablero";
import { Link } from "react-router-dom";

interface Tablero {
  id: number;
  nombre: string;
}

export default function HomePage() {
  const [tableros, setTableros] = useState<Tablero[]>([]);

  const cargarTableros = async () => {
    const res = await fetch("/api/tableros");
    const data = await res.json();
    setTableros(data);
  };

  const crearTablero = async (nombre: string) => {
    const res = await fetch("/api/tableros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });
    const data = await res.json();
    setTableros((prev) => [...prev, data]);
  };

  useEffect(() => {
    cargarTableros();
  }, []);

  return (
    <div>
      <h1>Mis tableros</h1>
      <NuevoTableroForm onCreate={crearTablero} />
      <ul>
        {tableros.map((tablero) => (
          <li key={tablero.id}>
            <Link to={`/tablero/${tablero.id}`}>{tablero.nombre}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
