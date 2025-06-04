import React, { useState } from "react";
import { useTableros } from "../hooks/hooks_tablero/useTableros";
import { useAddTablero } from "../hooks/hooks_tablero/useAddTablero";
import { useDeleteTablero } from "../hooks/hooks_tablero/useDeleteTablero";
import { type Tablero } from "../types";

interface TablerosProps {
  selectedTableroId: number | null;
  setSelectedTableroId: (id: number | null) => void;
  addToast: (message: string, type?: "success" | "error" | "info") => void;
}

export const Tableros: React.FC<TablerosProps> = ({
  selectedTableroId,
  setSelectedTableroId,
  addToast,
}) => {
  const { data: tableros = [] } = useTableros();
  //hooks
  const addTableroMutation = useAddTablero();
  const deleteTableroMutation = useDeleteTablero();

  //Estados modal crear tablero
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoNombreTablero, setNuevoNombreTablero] = useState("");
  //Estados modal eliminar tablero
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [tableroAEliminar, setTableroAEliminar] = useState<Tablero | null>(null);

  return (
    <>
      {/* Lista de tableros */}
      <nav className="flex justify-center gap-4 mb-6 flex-wrap items-center">
        {tableros.map((tablero: Tablero) => (
          <div
            key={tablero.id}
            onClick={() => setSelectedTableroId(tablero.id)}
            className={`px-6 py-3 rounded shadow-md cursor-pointer transition ${
              selectedTableroId === tablero.id
                ? "bg-orange-300 dark:bg-blue-400"
                : "bg-orange-100 dark:bg-gray-900"
            }`}
          >
            {tablero.nombre}
          </div>
        ))}

        {/* Botón para añadir tablero */}
        <button
          onClick={() => setModalAbierto(true)}
          className="px-6 py-3 rounded shadow-md bg-green-300 hover:bg-green-400 text-black"
        >
          +
        </button>

        {/* Botón para eliminar tablero seleccionado */}
        {selectedTableroId !== null && (
          <button
            onClick={() => {
              const tablero = (tableros).find((t:Tablero) => t.id === selectedTableroId);
              if (tablero) {
                setTableroAEliminar(tablero);
                setModalEliminarAbierto(true);
              }
            }}
            className="px-6 py-3 rounded shadow-md bg-red-300 hover:bg-red-400 text-black"
          >
            🗑️
          </button>
        )}
      </nav>

      {/* Modal: Crear tablero */}
      {modalAbierto && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4 text-center text-black dark:text-white">
              Crear nuevo tablero
            </h2>
            <input
              type="text"
              value={nuevoNombreTablero}
              onChange={(e) => setNuevoNombreTablero(e.target.value)}
              placeholder="Nombre del tablero"
              className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalAbierto(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (nuevoNombreTablero.trim()) {
                    addTableroMutation.mutate(nuevoNombreTablero, {
                      onSuccess: () => {
                        addToast("¡Nuevo tablero creado! 📎", "success");
                        setModalAbierto(false);
                        setNuevoNombreTablero("");
                      },
                      onError: () => {
                        addToast("Error al crear tablero", "error");
                      },
                    });
                  }
                }}
                className="px-4 py-2 rounded bg-green-400 hover:bg-green-500 text-black font-semibold"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Eliminar tablero */}
      {modalEliminarAbierto && tableroAEliminar && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-white text-center">
              Eliminar tablero
            </h2>
            <p className="text-black dark:text-gray-300 mb-4 text-center">
              Compi ¿Estás seguro que quieres eliminar <strong>{tableroAEliminar.nombre}</strong> y todas sus tareas?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setModalEliminarAbierto(false);
                  setTableroAEliminar(null);
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteTableroMutation.mutate(tableroAEliminar.id, {
                    onSuccess: () => {
                      addToast("¡Tablero eliminado!", "success");
                      setSelectedTableroId(null);
                      setModalEliminarAbierto(false);
                      setTableroAEliminar(null);
                    },
                    onError: () => {
                      addToast("Error al eliminar tablero", "error");
                    },
                  });
                }}
                className="px-4 py-2 rounded bg-red-400 hover:bg-red-500 text-black font-semibold"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
