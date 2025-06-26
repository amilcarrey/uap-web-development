import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa"; // Agrega FaTrash

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

  const recargarUsuarios = () => {
    axios
      .get(`http://localhost:8008/api/tableros/${tableroId}/usuarios`, { withCredentials: true })
      .then((res) => setUsuarios(res.data))
      .catch(() => setUsuarios([]));
  };

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
      recargarUsuarios(); // <-- recarga la lista
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
      recargarUsuarios(); // <-- recarga la lista
    } catch (err) {
      setMensaje("Error al actualizar permiso: " + (err as any).response?.data?.error || "Error");
    }
  };

  const handleEliminarColaborador = async (nombre: string) => {
    try {
      await axios.delete(
        `http://localhost:8008/api/tableros/${tableroId}/colaboradores/${nombre}`,
        { withCredentials: true }
      );
      setMensaje("Colaborador eliminado");
      recargarUsuarios();
    } catch (err) {
      setMensaje("Error al eliminar colaborador: " + (err as any).response?.data?.error || "Error");
    }
  };

  return (
    <div className="border-l  border-white/50 fixed right-0 top-0 h-full w-full max-w-sm backdrop-blur-md shadow-lg z-50 flex flex-col p-6 text-white/50">
    <button
      onClick={onClose}
      className="self-end text-gray-100 bg-white/20 hover:text-white mb-2 border border-white rounded-full p-1"
      aria-label="Cerrar"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
      <h3 className="text-lg text-white font-semibold mb-4">Compartir tablero</h3>
      <form onSubmit={handleCompartir} className="flex flex-col text-white gap-3 mb-4">
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={nombreUsuario}
          onChange={e => setNombreUsuario(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        <select value={rol} onChange={e => setRol(e.target.value)} className="border rounded px-3 py-2 text-white">
          <option className="text-black" value="lector">Lector</option>
          <option  className="text-black" value="editor">Editor</option>
        </select>
        <button type="submit" className="bg-black/90 border border-white/20 text-white px-4 py-2 rounded">Compartir</button>
      </form>
      <div className="mb-2">
        <h4 className="font-semibold text-white mb-1">Usuarios con acceso:</h4>
        <ul>
          {usuarios.map((u) => (
            <li key={u.nombre} className="flex text-white/70 items-center justify-between mb-1">
              <span>
                {u.nombre} <span className="text-xs text-gray-400">({u.rol})</span>
              </span>
              {u.rol !== "propietario" && (
                <div className="flex items-center">
                  {editando === u.nombre ? (
                    <>
                      <select
                        value={nuevoRol}
                        onChange={e => setNuevoRol(e.target.value)}
                        className="border rounded px-2 py-1 text-white text-xs"
                      >
                        <option className="text-black" value="lector">Lector</option>
                        <option className="text-black" value="editor">Editor</option>
                      </select>
                      <button
                        onClick={() => handleEditarPermiso(u.nombre)}
                        className="ml-2 text-white/40 text-xs"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditando(null)}
                        className="ml-1 text-white/40 text-xs"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditando(u.nombre);
                          setNuevoRol(u.rol);
                        }}
                        className="ml-2 text-white/50 hover:text-blue-500"
                        title="Editar permiso"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleEliminarColaborador(u.nombre)}
                        className="ml-2 text-white/50 hover:text-red-500"
                        title="Eliminar colaborador"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      {mensaje && <div className="mt-2 text-sm">{mensaje}</div>}
    </div>
  );
}