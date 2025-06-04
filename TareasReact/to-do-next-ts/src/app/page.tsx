'use client';

import { useEffect, useState } from 'react';
import { useTableroStore } from '@/stores/tableroStore';
import { useTareas, useAgregarTarea } from '@/hooks/useTareas';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import { Plus } from 'lucide-react';
import {
  useToggleTarea,
  useBorrarTarea,
  useEditarTarea,
} from '@/hooks/useTareas';


export default function HomePage() {
  const [filtro, setFiltro] = useState('todas');
  const { tableroId, setTableroId } = useTableroStore();
  const [tableros, setTableros] = useState<{ id: string; nombre: string }[]>([]);
  const [pagina, setPagina] = useState(1);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [mostrarFormNuevo, setMostrarFormNuevo] = useState(false);

  const tareasQuery = useTareas(filtro, pagina, tableroId);
  const agregarTarea = useAgregarTarea(filtro, pagina, tableroId || '');

  useEffect(() => {
    const cargarTableros = async () => {
      const res = await fetch('/api/tableros');
      const data = await res.json();

      if (data.length === 0) {
        const resCrear = await fetch('/api/tableros', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accion: 'crear', nombre: 'Principal' }),
        });
        const creado = await resCrear.json();
        setTableros([creado]);
        setTableroId(creado.id);
      } else {
        setTableros(data);
        if (!tableroId) setTableroId(data[0].id);
      }
    };

    cargarTableros();
  }, []);

  const crearTablero = async () => {
    if (!nuevoNombre.trim()) return;
    const res = await fetch('/api/tableros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'crear', nombre: nuevoNombre }),
    });
    if (res.ok) {
      const creado = await res.json();
      setTableros((prev) => [...prev, creado]);
      setNuevoNombre('');
      setTableroId(creado.id);
      setMostrarFormNuevo(false);
    }
  };

  const eliminarTablero = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este tablero?')) return;

    const res = await fetch('/api/tableros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'eliminar', id }),
    });

    if (res.ok) {
      setTableros((prev) => prev.filter((t) => t.id !== id));
      if (tableroId === id) {
        const siguiente = tableros.find((t) => t.id !== id);
        setTableroId(siguiente?.id || '');
      }
    }
  };

  const toggleTarea = useToggleTarea(filtro, pagina, tableroId || '');
  const borrarTarea = useBorrarTarea(filtro, pagina, tableroId || '');
  const editarTarea = useEditarTarea(filtro, pagina, tableroId || '');


  return (
    <main className="max-w-xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold text-cyan-700 text-center">TO-DO</h1>

      <label htmlFor="" className='text-gray-800'>Tableros:</label>
      <div className="flex justify-between items-center gap-2">
        <div className="flex flex-wrap gap-2">
          {tableros.map((t) => (
            <div key={t.id} className="flex items-center gap-1">
              <button
                onClick={() => {
                  setTableroId(t.id);
                  setPagina(1);
                }}
                className={`px-3 py-1 rounded border font-semibold text-sm transition ${tableroId === t.id
                  ? 'bg-cyan-600 text-white border-cyan-600'
                  : 'bg-gray-100 text-gray-800 border-gray-300'
                  }`}
              >
                {t.nombre}
              </button>
              <button
                onClick={() => eliminarTablero(t.id)}
                className="text-red-600 hover:text-red-800 text-sm"
                title="Eliminar tablero"
              >
                ✕
              </button>
            </div>
          ))}

        </div>

        <button
          onClick={() => setMostrarFormNuevo(!mostrarFormNuevo)}
          className="text-cyan-700 hover:text-cyan-900 flex items-center gap-1"
        >
          <Plus size={20} />
        </button>
      </div>

      {mostrarFormNuevo && (
        <div className="flex gap-2 mt-2">
          <input
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            placeholder="Nombre del nuevo tablero"
            className="flex-1 border px-3 py-2 rounded text-gray-800"
          />
          <button
            onClick={crearTablero}
            className="bg-cyan-700 text-white px-4 py-2 rounded"
          >
            Crear
          </button>
        </div>
      )}

      {tableroId && (
        <>
          <TaskForm tableroId={tableroId} onAdd={(texto) => agregarTarea.mutate(texto)} />

          <div className="flex gap-2 justify-center mb-2">
            {['todas', 'completas', 'incompletas'].map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`px-4 py-2 rounded-md border ${filtro === f
                  ? 'bg-cyan-600 text-white border-cyan-600'
                  : 'bg-gray-100 text-gray-800 border-gray-300'
                  }`}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {tareasQuery.isLoading ? (
            <p className="text-center text-gray-500">Cargando tareas...</p>
          ) : (
            <TaskList
              tareas={tareasQuery.data?.tareas || []}
              onToggle={(id) => toggleTarea.mutate(id)}
              onDelete={(id) => borrarTarea.mutate(id)}
              onEdit={(id, texto) => editarTarea.mutate({ id, texto })}
            />


          )}

          <div className="flex justify-center gap-4 mt-4">
            <button
              disabled={pagina === 1}
              onClick={() => setPagina((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1 border rounded text-gray-500"
            >
              Anterior
            </button>
            <span className="px-3 py-1 text-gray-500">Página {pagina}</span>
            <button
              onClick={() => setPagina((prev) => prev + 1)}
              className="px-3 py-1 border rounded text-gray-500"
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {!tableroId && (
        <p className="text-center text-gray-500">No hay tablero seleccionado.</p>
      )}
    </main>
  );
}
