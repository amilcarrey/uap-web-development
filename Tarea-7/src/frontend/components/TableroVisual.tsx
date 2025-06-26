import React from "react";
import { useParams } from "react-router-dom";
import {
  useTableros,
  useCrearTablero,
  useEditarTablero,
  useEliminarTablero,
} from "../hooks/useTableros";
import { ListaTareas } from "./ListaTarea";
import { FilterForm } from "./Filtros";

const VistaTablero: React.FC = () => {
  const { tableroId } = useParams<{ tableroId: string }>();

  const { data: tableros, isLoading: cargandoTableros } = useTableros();
  const crearTablero = useCrearTablero();
  const editarTablero = useEditarTablero();
  const eliminarTablero = useEliminarTablero();

  if (cargandoTableros) {
    return <p className="encabezado">Cargando tableros...</p>;
  }

  if (!tableroId) {
    return <p className="encabezado">No se seleccionó tablero</p>;
  }

  const tableroActual = tableros?.find((t) => t.id === tableroId);

  return (
    <>
      <div className="encabezado">
        Tablero actual: {tableroActual ? tableroActual.nombre : "Sin nombre"}
      </div>

      <div className="filtros">
        <FilterForm />
      </div>

      <div className="to-do">
        <ListaTareas tableroId={tableroId} />
      </div>

      <div className="container">
        <div>
          <div id="subencabezado">Mis Tableros</div>
          <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: "1rem" }}>
            {tableros?.map((tab) => (
              <li key={tab.id} style={{ marginBottom: "0.5rem" }}>
                <a
                  href={`/tablero/${tab.id}`}
                  style={{
                    fontWeight: tab.id === tableroId ? "bold" : "normal",
                    color: "#cc6666",
                    textDecoration: "none",
                    marginRight: "0.5rem",
                  }}
                >
                  {tab.nombre}
                </a>

                <button
                  onClick={() => {
                    const nuevoNombre = prompt(
                      "Nuevo nombre del tablero:",
                      tab.nombre
                    );
                    if (nuevoNombre && nuevoNombre.trim()) {
                      editarTablero.mutate({ id: tab.id, nombre: nuevoNombre.trim() });
                    }
                  }}
                  style={{
                    marginLeft: "0.5rem",
                    background: "none",
                    border: "none",
                    color: "#888",
                    cursor: "pointer",
                  }}
                  title="Editar"
                >
                  ✏️
                </button>


                <button
                  onClick={() => {
                    const confirmar = confirm(`¿Eliminar el tablero "${tab.nombre}"?`);
                    if (confirmar) {
                      eliminarTablero.mutate(tab.id);
                    }
                  }}
                  style={{
                    marginLeft: "0.3rem",
                    background: "none",
                    border: "none",
                    color: "#d44",
                    cursor: "pointer",
                  }}
                  title="Eliminar"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const nombre = (e.currentTarget.elements.namedItem("nombre") as HTMLInputElement)
              .value;
            if (nombre.trim()) {
              crearTablero.mutate({ nombre });
              e.currentTarget.reset();
            }
          }}
          style={{ marginTop: "1rem" }}
        >
          <input
            name="nombre"
            placeholder="Nuevo tablero"
            style={{
              padding: "0.5rem",
              border: "1px solid #e88c8c",
              borderRadius: "10px 0 0 10px",
              width: "60%",
            }}
          />
          <button type="submit" className="boton-add">
            Agregar
          </button>
        </form>
      </div>
    </>
  );
};

export default VistaTablero;
