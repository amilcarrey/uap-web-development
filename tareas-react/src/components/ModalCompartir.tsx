import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

export function ModalCompartir({ tableroId, onClose }) {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [rol, setRol] = useState("lector");
  const [mensaje, setMensaje] = useState("");
  const [usuarios, setUsuarios] = useState<{ nombre: string; rol: string }[]>([]);
  const [editando, setEditando] = useState<string | null>(null);
  const [nuevoRol, setNuevoRol] = useState("lector");

  // Cargar usuarios compartidos
  useEffect(() => {
    axios
      .get(`http://localhost:8008/api/tableros/${tableroId}/usuarios`, { withCredentials: true })
      .then((res) => setUsuarios(res.data))
      .catch(() => setUsuarios([]));
  }, [tableroId, mensaje]);

  const handleCompartir = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8008/api/tableros/${tableroId}/compartir`,
        { nombreUsuario, rol },
        { withCredentials: true }
      );
      setMensaje("Usuario agregado correctamente");
      setNombreUsuario("");
      setRol("lector");
    } catch (err) {
      setMensaje("Error al compartir: " + (err as any).response?.data?.error || "Error");
    }
  };

  const handleEditarPermiso = async (nombre: string) => {
    try {
      await axios.post(
        `http://localhost:8008/api/tableros/${tableroId}/compartir`,
        { nombreUsuario: nombre, rol: nuevoRol },
        { withCredentials: true }
      );
      setMensaje("Permiso actualizado");
      setEditando(null);
    } catch (err) {
      setMensaje("Error al actualizar permiso: " + (err as any).response?.data?.error || "Error");
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-lg z-50 flex flex-col p-6">
      <button
        onClick={onClose}
        className="self-end text-gray-500 hover:text-black mb-2"
      >
        Cerrar
      </button>
      <h3 className="text-lg font-semibold mb-4">Compartir tablero</h3>
      <form onSubmit={handleCompartir} className="flex flex-col gap-3 mb-4">
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={nombreUsuario}
          onChange={e => setNombreUsuario(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        <select value={rol} onChange={e => setRol(e.target.value)} className="border rounded px-3 py-2">
          <option value="lector">Lector</option>
          <option value="editor">Editor</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Compartir</button>
      </form>
      <div className="mb-2">
        <h4 className="font-semibold mb-1">Usuarios con acceso:</h4>
        <ul>
          {usuarios.map((u) => (
            <li key={u.nombre} className="flex items-center justify-between mb-1">
              <span>
                {u.nombre} <span className="text-xs text-gray-500">({u.rol})</span>
              </span>
              {u.rol !== "propietario" && (
                editando === u.nombre ? (
                  <>
                    <select
                      value={nuevoRol}
                      onChange={e => setNuevoRol(e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="lector">Lector</option>
                      <option value="editor">Editor</option>
                    </select>
                    <button
                      onClick={() => handleEditarPermiso(u.nombre)}
                      className="ml-2 text-blue-500 text-xs"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditando(null)}
                      className="ml-1 text-gray-400 text-xs"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditando(u.nombre);
                      setNuevoRol(u.rol);
                    }}
                    className="ml-2 text-gray-500 hover:text-blue-500"
                    title="Editar permiso"
                  >
                    <FaEdit />
                  </button>
                )
              )}
            </li>
          ))}
        </ul>
      </div>
      {mensaje && <div className="mt-2 text-sm">{mensaje}</div>}
    </div>
  );
}