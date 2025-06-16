import { Link, useLocation } from "react-router-dom";
import { useTableros, useCrearTablero, useEliminarTablero } from "../hooks/useTableros";
import { useState } from "react";

export function TablerosNav() {
  const { data: tableros, isLoading } = useTableros();
  const crearTablero = useCrearTablero();
  const eliminarTablero = useEliminarTablero();
  const [nuevoNombre, setNuevoNombre] = useState("");
  const location = useLocation();

  if (isLoading) return <div>Cargando tableros...</div>;

  // Extrae el id del tablero activo de la ruta
  const match = location.pathname.match(/\/tablero\/(\w+)/);
  const selectedId = match ? match[1] : "";

  return (
    <div>
      <h3 style={{ marginBottom: "1em", color: "#18a558" }}>Tableros</h3>
      <ul className="tableros-list">
        {tableros?.map((t) => (
          <li key={t.id}>
            <Link
              to={`/tablero/${t.id}`}
              className={selectedId === t.id ? "selected" : ""}
            >
              {t.nombre}
            </Link>
            <button
              onClick={() => eliminarTablero.mutate(t.id)}
              aria-label={`Eliminar tablero ${t.nombre}`}
              title="Eliminar tablero"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <form
        style={{ marginTop: "1em", display: "flex", gap: ".5em" }}
        onSubmit={e => {
          e.preventDefault();
          if (nuevoNombre.trim()) {
            crearTablero.mutate({ nombre: nuevoNombre });
            setNuevoNombre("");
          }
        }}
      >
        <input
          value={nuevoNombre}
          onChange={e => setNuevoNombre(e.target.value)}
          placeholder="Nuevo tablero"
          type="text"
        />
        <button type="submit">Crear</button>
      </form>
    </div>
  );
}
