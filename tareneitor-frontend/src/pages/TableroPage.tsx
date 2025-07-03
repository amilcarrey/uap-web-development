import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import type { Tarea } from '../types/tarea';
import { Header } from "../components/Header";
import { BackButton } from "../components/BackButton";

export function TableroPage() {
  const { id } = useParams();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [filtro, setFiltro] = useState<'todas' | 'completadas' | 'pendientes'>('todas');
  const [busqueda, setBusqueda] = useState('');

  const fetchTareas = async () => {
    try {
      const res = await api.get(`/tableros/${id}/tareas`, {
        params: filtro !== 'todas' ? { completada: filtro === 'completadas' } : {},
      });
      setTareas(res.data);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
    }
  };

  useEffect(() => {
    fetchTareas();
  }, [id, filtro]);

  const handleCrearTarea = async () => {
    if (!nuevaTarea.trim()) return;
    try {
      await api.post(`/tableros/${id}/tareas`, { contenido: nuevaTarea });
      setNuevaTarea('');
      fetchTareas();
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  };

  const handleEliminarTarea = async (idTarea: number) => {
    try {
      await api.delete(`/tareas/${idTarea}`);
      fetchTareas();
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  const handleToggleCompletada = async (tarea: Tarea) => {
    try {
      await api.put(`/tareas/${tarea.id_tarea}`, {
        completada: !tarea.completada,
      });
      fetchTareas();
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };

  const handleEliminarCompletadas = async () => {
    try {
      await api.delete(`/tableros/${id}/tareas`);
      fetchTareas();
    } catch (error) {
      console.error('Error al eliminar tareas completadas:', error);
    }
  };

  const tareasFiltradas = tareas.filter((t) =>
    t.contenido.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="p-6 max-w-3xl mx-auto mt-20">
        <BackButton />

        <h1 className="text-2xl font-bold mb-4">Tareas del tablero</h1>

        <div className="flex gap-2 mb-4">
          <input
            value={nuevaTarea}
            onChange={(e) => setNuevaTarea(e.target.value)}
            placeholder="Nueva tarea"
            className="border p-2 flex-1"
          />
          <button
            onClick={handleCrearTarea}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Crear
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFiltro('todas')}
            className={`px-3 py-1 rounded ${
              filtro === 'todas' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltro('completadas')}
            className={`px-3 py-1 rounded ${
              filtro === 'completadas' ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
          >
            Completadas
          </button>
          <button
            onClick={() => setFiltro('pendientes')}
            className={`px-3 py-1 rounded ${
              filtro === 'pendientes' ? 'bg-yellow-600 text-white' : 'bg-gray-200'
            }`}
          >
            Pendientes
          </button>
        </div>

        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar tarea"
          className="border p-2 w-full mb-4"
        />

        <ul className="space-y-2">
          {tareasFiltradas.map((tarea) => (
            <li
              key={tarea.id_tarea}
              className="flex items-center justify-between border p-2 rounded"
            >
              <div className={`${tarea.completada ? 'line-through text-gray-400' : ''}`}>
                {tarea.contenido}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleCompletada(tarea)}
                  className={`px-2 py-1 rounded text-white ${
                    tarea.completada
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                  aria-label={tarea.completada ? 'Marcar como pendiente' : 'Marcar como completada'}
                >
                  {tarea.completada ? 'Desmarcar' : 'Completar'}
                </button>

                <button
                  onClick={() => handleEliminarTarea(tarea.id_tarea)}
                  className="text-red-500 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={handleEliminarCompletadas}
          className="mt-4 text-sm text-red-600 underline"
        >
          Eliminar todas las completadas
        </button>
      </div>
    </>
  );
}
