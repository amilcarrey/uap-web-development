import React, { useState } from "react";
import { useTableros } from "../hooks/hooks_tablero/useTableros";
import { useAddTablero } from "../hooks/hooks_tablero/useAddTablero";
import { useDeleteTablero } from "../hooks/hooks_tablero/useDeleteTablero";
import { type Tablero } from "../types";
import { useAsignarPermiso } from "../hooks/hooks_tablero/useAsignarPermiso";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";


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
  const addTableroMutation = useAddTablero();
  const deleteTableroMutation = useDeleteTablero();
  const asignarPermisos = useAsignarPermiso();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoNombreTablero, setNuevoNombreTablero] = useState("");
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [tableroAEliminar, setTableroAEliminar] = useState<Tablero | null>(null);
  const [modalAsignarAbierto, setModalAsignarAbierto] = useState(false);
  const { userId } = useAuth();


  // Estados para asignar permiso
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
  const [inputUserId, setInputUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<"propietario" | "editor" | "lectura">("editor");

  // Limpiar formulario asignar permisos
  const limpiarFormulario = () => {
    setSelectedBoardId(null);
    setInputUserId("");
    setSelectedRole("editor");
  };

  // Manejar envío asignar permiso
  const handleAsignarPermiso = () => {
    if (!selectedBoardId) {
      addToast("Por favor selecciona un tablero.", "error");
      return;
    }
    if (!inputUserId.trim() || isNaN(Number(inputUserId))) {
      addToast("Ingresa un ID de usuario válido.", "error");
      return;
    }

    asignarPermisos.mutate(
      {
        boardId: selectedBoardId,
        userId: Number(inputUserId),
        role: selectedRole,
      },
      {
        onSuccess: () => {
          addToast("Permiso asignado correctamente.", "success");
          setModalAsignarAbierto(false);
          limpiarFormulario();
        },
        onError: (error: Error) => {
          addToast(`Error asignando permiso: ${error.message}`, "error");
        },
      }
    );
  };

  const { settings } = useSettings();
  const theme = settings?.theme || "light";



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
              ? (theme === "dark" ? "bg-blue-400 text-white" : "bg-orange-300 text-black")
              : (theme === "dark" ? "bg-gray-900 text-white" : "bg-orange-100 text-black")
          }`}
        >
          {tablero.name}
        </div>
      ))}

      {/* Botón añadir tablero */}
      <button
        onClick={() => setModalAbierto(true)}
        className={`px-6 py-3 rounded shadow-md ${theme === "dark" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-300 hover:bg-green-400 text-black"}`}
      >
        +
      </button>

      {/* Botón eliminar tablero */}
      {selectedTableroId !== null && (
        <button
          onClick={() => {
            const tablero = tableros.find((t: Tablero) => t.id === selectedTableroId);
            if (tablero) {
              setTableroAEliminar(tablero);
              setModalEliminarAbierto(true);
            }
          }}
          className={`px-6 py-3 rounded shadow-md ${theme === "dark" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-300 hover:bg-red-400 text-black"}`}
        >
          🗑️
        </button>
      )}

      {/* Botón asignar permisos */}
      <button
        onClick={() => setModalAsignarAbierto(true)}
        className={`px-6 py-3 rounded shadow-md ${theme === "dark" ? "bg-orange-600 hover:bg-orange-700 text-white" : "bg-orange-300 hover:bg-orange-400 text-black"}`}
      >
        🤫
      </button>
    </nav>

    {/* Modal Crear Tablero */}
    {modalAbierto && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className={`rounded-lg shadow-lg p-6 w-full max-w-sm ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
          <h2 className="text-xl font-semibold mb-4 text-center">Crear nuevo tablero</h2>
          <input
            type="text"
            value={nuevoNombreTablero}
            onChange={(e) => setNuevoNombreTablero(e.target.value)}
            placeholder="Nombre del tablero"
            className={`w-full p-3 rounded border mb-4 ${theme === "dark" ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-black"}`}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setModalAbierto(false)}
              className={`px-4 py-2 rounded ${theme === "dark" ? "bg-gray-600 hover:bg-gray-500 text-white" : "bg-gray-300 hover:bg-gray-400 text-black"}`}
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
              className={`px-4 py-2 rounded font-semibold ${theme === "dark" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-400 hover:bg-green-500 text-black"}`}
            >
              Crear
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Modal Asignar Permisos */}
    {modalAsignarAbierto && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className={`rounded-lg shadow-lg p-6 w-full max-w-md ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
          <h2 className="text-xl font-semibold mb-4 text-center">Asignar permiso</h2>

          <label className="block mb-2 font-semibold">
            Selecciona tablero:
            <select
              className={`w-full p-2 rounded border mb-4 ${theme === "dark" ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-black"}`}
              value={selectedBoardId ?? ""}
              onChange={(e) => setSelectedBoardId(Number(e.target.value))}
            >
              <option value="" disabled>-- Selecciona un tablero --</option>
              {tableros.filter((t:Tablero) => t.ownerId === userId).map((t:Tablero) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </label>

          <label className="block mb-2 font-semibold">
            ID Usuario:
            <input
              type="number"
              className={`w-full p-2 rounded border mb-4 ${theme === "dark" ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-black"}`}
              placeholder="ID usuario"
              value={inputUserId}
              onChange={(e) => setInputUserId(e.target.value)}
            />
          </label>

          <label className="block mb-4 font-semibold">
            Rol:
            <select
              className={`w-full p-2 rounded border ${theme === "dark" ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-black"}`}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as "propietario" | "editor" | "lectura")}
            >
              <option value="propietario">Propietario</option>
              <option value="editor">Editor</option>
              <option value="lectura">Lectura</option>
            </select>
          </label>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setModalAsignarAbierto(false);
                limpiarFormulario();
              }}
              className={`px-4 py-2 rounded ${theme === "dark" ? "bg-gray-600 hover:bg-gray-500 text-white" : "bg-gray-300 hover:bg-gray-400 text-black"}`}
            >
              Cancelar
            </button>
            <button
              onClick={handleAsignarPermiso}
              className={`px-4 py-2 rounded font-semibold ${theme === "dark" ? "bg-orange-600 hover:bg-orange-700 text-white" : "bg-orange-400 hover:bg-orange-500 text-black"}`}
              disabled={asignarPermisos.isPending}
            >
              {asignarPermisos.isPending ? "Asignando..." : "Asignar"}
            </button>
          </div>

          <div className="mt-4">
            <h1>Tu ID de usuario es: {userId}</h1>
          </div>
        </div>
      </div>
    )}

    {/* Modal Eliminar Tablero */}
    {modalEliminarAbierto && tableroAEliminar && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className={`rounded-lg shadow-lg p-6 w-full max-w-sm ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
          <h2 className="text-xl font-semibold mb-4 text-center">Eliminar tablero</h2>
          <p className="mb-4 text-center">
            Compi ¿Estás seguro que quieres eliminar{" "}
            <strong>{tableroAEliminar.name}</strong> y todas sus tareas?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setModalEliminarAbierto(false);
                setTableroAEliminar(null);
              }}
              className={`px-4 py-2 rounded ${theme === "dark" ? "bg-gray-600 hover:bg-gray-500 text-white" : "bg-gray-300 hover:bg-gray-400 text-black"}`}
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                deleteTableroMutation.mutate(tableroAEliminar.id, {
                  onSuccess: () => {
                    addToast("¡Tablero eliminado!", "success");
                    setSelectedTableroId(1);
                    setModalEliminarAbierto(false);
                    setTableroAEliminar(null);
                  },
                  onError: () => {
                    addToast("Error al eliminar tablero", "error");
                  },
                });
              }}
              className={`px-4 py-2 rounded font-semibold ${theme === "dark" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-400 hover:bg-red-500 text-black"}`}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
}