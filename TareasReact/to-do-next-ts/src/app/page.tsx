'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Share2, LogOut, Settings, ClipboardList, UserPlus, Users } from 'lucide-react';
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
import ConfigModal from '@/components/ConfigModal';

export default function HomePage() {
  // estados y stores para usuario, tableros, tareas, modales, etc
  const usuario = useUserStore((state) => state.usuario);
  const limpiarUsuario = useUserStore((state) => state.limpiarUsuario);
  const { tableroId, setTableroId, rol, setRol } = useTableroStore();

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
  const [mostrarCompartir, setMostrarCompartir] = useState(false);
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const { tableros, crearTablero, eliminarTablero, isLoading } = useTableros();
  const tareasQuery = useTareas(filtro, pagina, tableroId, busqueda);
  const agregarTarea = useAgregarTarea(filtro, pagina, tableroId || '');
  const toggleTarea = useToggleTarea(filtro, pagina, tableroId || '');
  const borrarTarea = useBorrarTarea(filtro, pagina, tableroId || '');
  const editarTarea = useEditarTarea(filtro, pagina, tableroId || '');
  const limpiarTareas = useLimpiarTareas(filtro, pagina, tableroId || '');
  const API = process.env.NEXT_PUBLIC_API_URL;

  // si no hay usuario, muestro pantalla de login
  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-gray-700">No has iniciado sesión</h1>
          <a
            href="/login"
            className="inline-block bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800"
          >
            Ir a iniciar sesión
          </a>
          <p className="text-sm text-gray-600">
            ¿No tenés cuenta?{' '}
            <a href="/register" className="text-cyan-700 hover:underline">
              Registrate
            </a>
          </p>
        </div>
      </div>
    );
  }

  // modal para gestionar permisos de usuarios en el tablero
  function GestionarPermisosModal({ onClose }: { onClose: () => void }) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
            aria-label="Cerrar"
          >
            ×
          </button>
          <h3 className="text-lg font-semibold mb-4 text-cyan-700 flex items-center gap-2">
            <Users size={20} /> Gestionar permisos
          </h3>
          {permisosUsuarios.length === 0 ? (
            <p className="text-gray-500">No hay usuarios con permisos en este tablero.</p>
          ) : (
            <div className="space-y-3">
              {permisosUsuarios.map((u) => (
                <div key={u.usuarioId} className="flex items-center gap-3">
                  <span className="text-sm font-medium">{u.nombre}</span>
                  <select
                    value={u.rol}
                    onChange={async (e) => {
                      const nuevoRol = e.target.value as 'editor' | 'lectura';
                      try {
                        const res = await fetch(`${API}/api/tableros/${tableroId}/permiso`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          credentials: 'include',
                          body: JSON.stringify({
                            usuarioId: u.usuarioId,
                            nuevoRol,
                          }),
                        });
                        if (!res.ok) throw new Error('Error al actualizar rol');
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
        </div>
      </div>
    );
  }

  // modal para compartir el tablero con otro usuario
  function CompartirTableroModal({ onClose }: { onClose: () => void }) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
            aria-label="Cerrar"
          >
            ×
          </button>
          <h3 className="text-lg font-semibold mb-4 text-cyan-700 flex items-center gap-2">
            <UserPlus size={20} /> Compartir tablero
          </h3>
          <div className="flex flex-col gap-3">
            <input
              type="email"
              value={emailCompartir}
              onChange={(e) => setEmailCompartir(e.target.value)}
              placeholder="Email del usuario"
              className="border px-3 py-2 rounded w-full"
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
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email: emailCompartir, rol: rolCompartir }),
                  });
                  const json = await res.json();
                  if (!res.ok) throw new Error(json.error || 'Error al compartir');
                  setMensajeCompartir('✅ Tablero compartido con éxito');
                } catch (error: any) {
                  setMensajeCompartir(`❌ ${error.message}`);
                }
              }}
              className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800 transition"
            >
              Compartir
            </button>
            {mensajeCompartir && (
              <p className="text-sm mt-2 text-gray-600">{mensajeCompartir}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // layout principal de la página
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800">
      {/* header con nombre de la app y usuario */}
      <header className="flex justify-between items-center p-4 shadow bg-white/80 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-cyan-700 tracking-tight select-none flex items-center gap-2">
          TO-DO
        </h1>
        {usuario ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium bg-cyan-100 px-3 py-1 rounded-full shadow-sm">
              Hola, <span className="font-bold">{usuario.nombre}</span>
            </span>
            <button
              onClick={() => setMostrarConfig(true)}
              className="flex items-center gap-1 text-cyan-700 hover:text-cyan-900 text-base px-3 py-1 rounded transition bg-cyan-50 hover:bg-cyan-100 shadow"
            >
              <Settings size={18} /> Configuración
            </button>
            <button
              onClick={async () => {
                try {
                  await fetch(`${API}/api/auth/logout`, {
                    method: 'POST',
                    credentials: 'include',
                  });
                } catch (e) {
                  console.error('Error al cerrar sesión', e);
                } finally {
                  limpiarUsuario();
                }
              }}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm px-3 py-1 rounded transition bg-red-50 hover:bg-red-100"
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

      {/* modales de configuración, compartir y permisos */}
      {mostrarCompartir && (
        <CompartirTableroModal
          onClose={() => {
            setEmailCompartir('');
            setMensajeCompartir('');
            setMostrarCompartir(false);
          }}
        />
      )}

      {mostrarGestionPermisos && <GestionarPermisosModal onClose={() => setMostrarGestionPermisos(false)} />}

      <main className="max-w-5xl mx-auto px-6 pb-10 mt-8">
        {/* sección de tableros */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-cyan-800 flex items-center gap-2">
              <ClipboardList size={22} className="text-cyan-700" /> Tableros
            </h2>
            <button
              onClick={() => setMostrarFormNuevo(!mostrarFormNuevo)}
              className="flex items-center gap-2 text-cyan-700 hover:text-cyan-900 font-medium bg-cyan-50 px-4 py-2 rounded shadow-sm transition"
            >
              <Plus size={20} /> Nuevo
            </button>
          </div>

          {/* formulario para crear tablero nuevo */}
          {mostrarFormNuevo && (
            <div className="flex gap-2 mb-4 bg-white p-4 rounded-lg shadow">
              <input
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                placeholder="Nombre del tablero"
                className="flex-1 border px-3 py-2 rounded focus:outline-cyan-400"
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
                className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
              >
                Crear
              </button>
            </div>
          )}

          {/* lista de tableros */}
          <div className="flex flex-wrap gap-4">
            {isLoading ? (
              <p>Cargando tableros...</p>
            ) : (
              tableros?.map((t) => (
                <div
                  key={t.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border shadow-sm transition-all duration-200 cursor-pointer
                    ${t.id === tableroId ? 'bg-cyan-100 border-cyan-400 ring-2 ring-cyan-200' : 'bg-white hover:bg-cyan-50'}
                  `}
                >
                  <button
                    onClick={() => {
                      setTableroId(t.id);
                      setRol(t.rol);
                      setPagina(1);
                    }}
                    className="font-medium text-base"
                  >
                    {t.nombre}
                  </button>
                  {t.rol === 'propietario' && (
                    <div className="flex gap-2">
                      {/* botón para compartir tablero */}
                      <button
                        onClick={() => setMostrarCompartir(true)}
                        className="text-cyan-700 hover:text-cyan-900 text-xs px-2 py-1 rounded bg-cyan-50 hover:bg-cyan-100 transition"
                        title="Compartir tablero"
                      >
                        <UserPlus size={16} />
                      </button>
                      {/* botón para gestionar permisos */}
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch(`${API}/api/tableros/${t.id}/usuarios`, {
                              credentials: 'include',
                            });
                            const data = await res.json();
                            setPermisosUsuarios(data.usuarios || []);
                            setMostrarGestionPermisos(true);
                          } catch {
                            setPermisosUsuarios([]);
                            setMostrarGestionPermisos(true);
                          }
                        }}
                        className="text-cyan-700 hover:text-cyan-900 text-xs px-2 py-1 rounded bg-cyan-50 hover:bg-cyan-100 transition"
                        title="Gestionar permisos"
                      >
                        <Users size={16} />
                      </button>
                      {/* botón para eliminar tablero */}
                      <button
                        onClick={() => eliminarTablero.mutate(t.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Eliminar tablero"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* muestro permisos si está abierto el modal y hay usuarios */}
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
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                          usuarioId: u.usuarioId,
                          nuevoRol,
                        }),
                      });

                      if (!res.ok) throw new Error('Error al actualizar rol');

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

        {/* sección de tareas */}
        {tableroId && (
          <>
            {(rol === 'propietario' || rol === 'editor') && (
              <div className="mt-6 flex gap-2">
                {/* input para agregar tarea */}
                <input
                  type="text"
                  value={nuevaTarea}
                  onChange={(e) => setNuevaTarea(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && nuevaTarea.trim() && agregarTarea) {
                      agregarTarea.mutate(nuevaTarea);
                      setNuevaTarea('');
                    }
                  }}
                  placeholder="Escribe una nueva tarea"
                  className="flex-1 border px-3 py-2 rounded text-gray-800"
                />

                {/* botón para agregar tarea */}
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

            <input
              type="text"
              placeholder="Buscar tareas..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPagina(1); // reiniciar a la página 1 si se busca algo
              }}
              className="w-full border px-3 py-2 rounded mt-4"
            />

            {/* filtros de tareas */}
            <Filtros filtroActual={filtro} onChange={setFiltro} />

            {/* lista de tareas */}
            <TaskList
              tareas={Array.isArray(tareasQuery.data?.tareas) ? tareasQuery.data.tareas : []}
              isLoading={tareasQuery.isLoading}
              onToggle={(id) => toggleTarea.mutate(id)}
              onDelete={(id) => borrarTarea.mutate(id)}
              onEdit={(id, nuevoTexto) => editarTarea.mutate({ id, texto: nuevoTexto })}
              rol={rol}
            />

            {/* botón para limpiar tareas completadas */}
            <div className="mt-4">
              <button
                onClick={() => limpiarTareas.mutate()}
                disabled={limpiarTareas.isPending}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                {limpiarTareas.isPending ? 'Eliminando...' : 'Eliminar tareas completadas'}
              </button>
            </div>

            {/* paginación */}
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
