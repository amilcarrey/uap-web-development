'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Share2, LogOut } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { useTableroStore } from '@/stores/tableroStore';
import { useTableros } from '@/hooks/useTableros';
import {
  useAgregarTarea,
  useBorrarTarea,
  useEditarTarea,
  useLimpiarTareas,
  useTareas,
  useToggleTarea,
} from '@/hooks/useTareas';
import TaskList from '@/components/TaskList';
import Filtros from '@/components/FiltroButtons';

export default function HomePage() {
  const usuario = useUserStore((state) => state.usuario);
  const limpiarUsuario = useUserStore((state) => state.limpiarUsuario);
  const { tableroId, setTableroId, rol, setRol } = useTableroStore();

  const [tokenCargado, setTokenCargado] = useState(false);
  const [filtro, setFiltro] = useState('todas');
  const [pagina, setPagina] = useState(1);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [mostrarFormNuevo, setMostrarFormNuevo] = useState(false);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [emailCompartir, setEmailCompartir] = useState('');
  const [rolCompartir, setRolCompartir] = useState<'editor' | 'lectura'>('lectura');
  const [mensajeCompartir, setMensajeCompartir] = useState('');
  const [permisosUsuarios, setPermisosUsuarios] = useState<{ usuarioId: string; nombre: string; rol: 'editor' | 'lectura' }[]>([]);
  const [mostrarGestionPermisos, setMostrarGestionPermisos] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) limpiarUsuario();
    setTokenCargado(true);
  }, []);

  const { tableros, crearTablero, eliminarTablero, isLoading } = useTableros();
  const tareasQuery = useTareas(filtro, pagina, tableroId);
  const agregarTarea = useAgregarTarea(filtro, pagina, tableroId || '');
  const toggleTarea = useToggleTarea(filtro, pagina, tableroId || '');
  const borrarTarea = useBorrarTarea(filtro, pagina, tableroId || '');
  const editarTarea = useEditarTarea(filtro, pagina, tableroId || '');
  const limpiarTareas = useLimpiarTareas(filtro, pagina, tableroId || '');
  const API = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800">
      <header className="flex justify-end p-4">
        {usuario ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Hola, {usuario.nombre}</span>
            <button
              onClick={() => {
                limpiarUsuario();
                localStorage.removeItem('token');
              }}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
            >
              <LogOut size={16} /> Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <a href="/login" className="text-cyan-700 hover:underline">Iniciar sesión</a>
            <a href="/register" className="text-cyan-700 hover:underline">Registrarse</a>
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-10">
        <h1 className="text-4xl font-bold mb-6 text-cyan-800">📝 Gestor de Tareas</h1>

        {/* TABLEROS */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Tableros</h2>
            <button
              onClick={() => setMostrarFormNuevo(!mostrarFormNuevo)}
              className="flex items-center gap-1 text-cyan-700 hover:text-cyan-900"
            >
              <Plus size={20} /> Nuevo
            </button>
          </div>

          {mostrarFormNuevo && (
            <div className="flex gap-2 mb-4">
              <input
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                placeholder="Nombre del tablero"
                className="flex-1 border px-3 py-2 rounded"
              />
              <button
                onClick={() => {
                  if (nuevoNombre.trim()) {
                    crearTablero.mutate(nuevoNombre, {
                      onSuccess: (nuevo) => {
                        setTableroId(nuevo.id);
                        setPagina(1);
                      },
                    });
                    setNuevoNombre('');
                    setMostrarFormNuevo(false);
                  }
                }}
                className="bg-cyan-600 text-white px-4 py-2 rounded"
              >
                Crear
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {isLoading ? (
              <p>Cargando tableros...</p>
            ) : (
              tableros?.map((t) => (
                <div
                  key={t.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border shadow-sm ${t.id === tableroId ? 'bg-cyan-100 border-cyan-300' : 'bg-white'
                    }`}
                >
                  <button
                    onClick={() => {
                      setTableroId(t.id);
                      setRol(t.rol);
                      setPagina(1);
                    }}
                    className="font-medium text-sm"
                  >
                    {t.nombre}
                  </button>
                  {t.rol === 'propietario' && (
                    <button
                      onClick={() => eliminarTablero.mutate(t.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar tablero"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {tableroId && rol === 'propietario' && (
            <div className="mt-6 p-4 border rounded bg-white shadow-sm">
              <h3 className="text-md font-semibold mb-2 flex items-center gap-2"><Share2 size={18} /> Compartir tablero</h3>
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="email"
                  value={emailCompartir}
                  onChange={(e) => setEmailCompartir(e.target.value)}
                  placeholder="Email del usuario"
                  className="border px-3 py-2 rounded w-full md:w-auto"
                />
                <select
                  value={rolCompartir}
                  onChange={(e) => setRolCompartir(e.target.value as 'editor' | 'lectura')}
                  className="border px-3 py-2 rounded"
                >
                  <option value="lectura">Solo lectura</option>
                  <option value="editor">Editor</option>
                </select>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(`${API}/api/tableros/${tableroId}/compartir`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ email: emailCompartir, rol: rolCompartir }),
                      });
                      const json = await res.json();
                      if (!res.ok) throw new Error(json.error || 'Error al compartir');
                      setMensajeCompartir('✅ Tablero compartido con éxito');
                      setEmailCompartir('');
                    } catch (error: any) {
                      setMensajeCompartir(`❌ ${error.message}`);
                    }
                  }}
                  className="bg-cyan-700 text-white px-4 py-2 rounded"
                >
                  Compartir
                </button>
              </div>
              {mensajeCompartir && <p className="text-sm mt-2 text-gray-600">{mensajeCompartir}</p>}
            </div>
          )}
        </section>
        {tableroId && rol === 'propietario' && (
          <button
            onClick={async () => {
              try {
                const res = await fetch(`${API}/api/tableros/${tableroId}/usuarios`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                const data = await res.json();
                setPermisosUsuarios(data.usuarios); // este endpoint te lo explico si no lo tenés
                setMostrarGestionPermisos(true);
              } catch (e) {
                console.error('Error al obtener permisos:', e);
              }
            }}
            className="mt-4 text-sm text-cyan-800 hover:underline"
          >
            Gestionar permisos
          </button>
        )}
        {mostrarGestionPermisos && permisosUsuarios.length > 0 && (
          <div className="mt-4 space-y-2">
            {permisosUsuarios.map((u) => (
              <div key={u.usuarioId} className="flex items-center gap-3">
                <span className="text-sm">{u.nombre}</span>
                <select
                  value={u.rol}
                  onChange={async (e) => {
                    const nuevoRol = e.target.value as 'editor' | 'lectura';
                    try {
                      const res = await fetch(`${API}/api/tableros/${tableroId}/permiso`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          usuarioId: u.usuarioId,
                          nuevoRol,
                        }),
                      });

                      if (!res.ok) throw new Error('Error al actualizar rol');

                      // actualizar localmente
                      setPermisosUsuarios((prev) =>
                        prev.map((p) =>
                          p.usuarioId === u.usuarioId ? { ...p, rol: nuevoRol } : p
                        )
                      );
                    } catch (e) {
                      alert('Error al actualizar el rol');
                    }
                  }}
                  className="border rounded px-2 py-1"
                >
                  <option value="lectura">Lectura</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {/* TAREAS */}
        {tableroId && (
          <>
            {(rol === 'propietario' || rol === 'editor') && (
              <div className="mt-6 flex gap-2">
                <input
                  type="text"
                  value={nuevaTarea}
                  onChange={(e) => setNuevaTarea(e.target.value)}
                  placeholder="Escribe una nueva tarea"
                  className="flex-1 border px-3 py-2 rounded text-gray-800"
                />
                <button
                  onClick={() => {
                    if (nuevaTarea.trim() && agregarTarea) {
                      agregarTarea.mutate(nuevaTarea);
                      setNuevaTarea('');
                    }
                  }}
                  className="bg-cyan-700 text-white px-4 py-2 rounded"
                >
                  Agregar
                </button>
              </div>
            )}

            <Filtros filtroActual={filtro} onChange={setFiltro} />

            <TaskList
              tareas={Array.isArray(tareasQuery.data?.tareas) ? tareasQuery.data.tareas : []}
              isLoading={tareasQuery.isLoading}
              onToggle={(id) => toggleTarea.mutate(id)}
              onDelete={(id) => borrarTarea.mutate(id)}
              onEdit={(id, nuevoTexto) => editarTarea.mutate({ id, texto: nuevoTexto })}
              rol={rol}
            />

            <div className="mt-4">
              <button
                onClick={() => limpiarTareas.mutate()}
                disabled={limpiarTareas.isPending}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                {limpiarTareas.isPending ? 'Eliminando...' : 'Eliminar tareas completadas'}
              </button>
            </div>

            <div className="flex justify-between mt-6">
              <button
                disabled={pagina === 1}
                onClick={() => setPagina((p) => p - 1)}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-4 py-1">Página {pagina}</span>
              <button
                onClick={() => setPagina((p) => p + 1)}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
