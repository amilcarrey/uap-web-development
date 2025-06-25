import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useTableros, useCrearTablero, useEliminarTablero, useTablero } from '../hooks/useTableros';
import { useClientStore } from '../store/clientStore';
import { useAuthStatus } from '../hooks/useAutenticacion';
import { useQuery } from '@tanstack/react-query';
import type { Usuario } from '../types/Tarea';
import BarraBusquedaTareas from "./BarraBusquedaTareas";


interface HeaderProps {
  tableroNombre?: string;
}

const Header = ({ tableroNombre }: HeaderProps) => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombreTablero, setNombreTablero] = useState('');
  const [mostrarCompartir, setMostrarCompartir] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
  const [compartiendo, setCompartiendo] = useState(false);

  const { data: tablerosData } = useTableros();
  const crearTableroMutation = useCrearTablero();
  const eliminarTableroMutation = useEliminarTablero();
  const { mostrarToast } = useClientStore();
  const navigate = useNavigate();

  // Alias actual de la URL
  const params = useParams({ strict: false });
  const aliasActual = params?.alias as string;

  // Usuario autenticado y tablero actual (React Query)
  const { data: authData } = useAuthStatus();
  const { data: tableroData } = useTablero(aliasActual);

  // ¿Es propietario?
  const soyPropietario = !!(
    authData?.usuario &&
    tableroData?.tablero &&
    authData.usuario.id === tableroData.tablero.propietarioId
  );

  // Usuarios registrados (React Query)
  const { data: usuariosData, isLoading: cargandoUsuarios } = useQuery<Usuario[]>({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/api/usuarios', { credentials: 'include' });
      const data = await res.json();
      return data.usuarios || [];
    },
    enabled: mostrarCompartir, // Solo consulta cuando se abre el modal
  });

  // Compartir tablero
  const handleCompartir = async (rol: 'lector' | 'editor') => {
    if (!usuarioSeleccionado) return;
    setCompartiendo(true);
    console.log('Compartiendo con rol:', rol); // <-- LOG AQUÍ
    try {
      const res = await fetch(`http://localhost:3001/api/tableros/${aliasActual}/compartir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ emailUsuario: usuarioSeleccionado, rol }),
      });
      const data = await res.json();
      if (data.success) {
        mostrarToast('Tablero compartido correctamente', 'exito');
        setMostrarCompartir(false);
      } else {
        mostrarToast(data.error || 'Error al compartir', 'error');
      }
    } catch {
      mostrarToast('Error al compartir', 'error');
    }
    setCompartiendo(false);
  };

  const handleCrearTablero = (e: React.FormEvent) => {
    e.preventDefault();
    const nombre = nombreTablero.trim();
    if (!nombre) return;

    const alias = nombre.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    crearTableroMutation.mutate({ nombre, alias }, {
      onSuccess: () => {
        mostrarToast('Tablero creado con éxito', 'exito');
        setNombreTablero('');
        setMostrarFormulario(false);
        navigate({ to: '/tablero/$alias', params: { alias } });
      },
      onError: (error) => {
        mostrarToast(error.message || 'Error al crear tablero', 'error');
      },
    });
  };

  const handleEliminarTablero = () => {
    if (!aliasActual) {
      mostrarToast('No hay tablero seleccionado para eliminar', 'error');
      return;
    }
    if (aliasActual === 'configuracion') {
      mostrarToast('No se puede eliminar el tablero de configuración', 'error');
      return;
    }
    eliminarTableroMutation.mutate(aliasActual, {
      onSuccess: (data) => {
        mostrarToast(data.mensaje || 'Tablero eliminado correctamente', 'exito');
        navigate({ to: '/tablero/$alias', params: { alias: 'configuracion' } });
      },
      onError: (error) => {
        mostrarToast(error.message || 'Error al eliminar tablero', 'error');
      },
    });
  };

  const handleTableroClick = (alias: string) => {
    navigate({ to: '/tablero/$alias', params: { alias } });
  };

  return (
    <header>
      {/* Botón casita arriba a la izquierda */}
      <button
        onClick={() => navigate({ to: "/" })}
        className="absolute top-4 left-4 bg-white rounded-full p-2 shadow hover:bg-pink-100 transition"
        title="Ir al inicio"
        style={{ zIndex: 1000 }}
      >
        {/* SVG de casita */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
        </svg>
      </button>

      <h1 className="my-2 mx-auto text-center text-black text-7xl font-bold">ToDo</h1>
      {authData?.usuario?.nombre && (
        <div className="text-center text-xs text-gray-600 mb-2">
          Bienvenido {authData.usuario.nombre}
        </div>
      )}
      
      {tableroNombre && (
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          📋 {tableroNombre}
        </h2>
      )}
      
      <div className="categories flex justify-center items-center space-x-6 mb-4">
        
        {tablerosData?.tableros.map((tablero) => (
          <button
            key={tablero.id}
            onClick={() => handleTableroClick(tablero.alias)}
            className="boton-estilo cursor-pointer"
          >
            {tablero.nombre}
          </button>
        ))}
        
        {/* Botón + para crear tablero */}
        <button 
          type="button" 
          className="boton-estilo bg-green-500 hover:bg-green-600"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          title="Crear nuevo tablero"
        >
          +
        </button>

        {/* eliminar tablero actual */}
        {aliasActual && (
          <button 
            type="button" 
            className="boton-estilo bg-red-500 hover:bg-red-600"
            onClick={handleEliminarTablero}
            disabled={eliminarTableroMutation.isPending || aliasActual === 'configuracion'}
            title={`Eliminar tablero: ${tableroNombre || aliasActual}`}
          >
            {eliminarTableroMutation.isPending ? '⏳' : '-'}
          </button>
        )}
      </div>

      {/* crear tablero */}
      {mostrarFormulario && (
        <div className="mt-4 bg-pink-400 p-4 rounded-lg shadow-md max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-3 text-center">Crear Nuevo Tablero</h3>
          <form onSubmit={handleCrearTablero} className="flex flex-col gap-3">
            <input
              type="text"
              value={nombreTablero}
              onChange={(e) => setNombreTablero(e.target.value)}
              placeholder="Nombre del tablero..."
              className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              autoFocus
              maxLength={30}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={crearTableroMutation.isPending || !nombreTablero.trim()}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300"
              >
                {crearTableroMutation.isPending ? 'Creando...' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarFormulario(false);
                  setNombreTablero('');
                }}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Botón compartir */}
      {aliasActual && aliasActual !== 'configuracion' && (
        <button
          onClick={() => setMostrarCompartir(true)}
          className="absolute top-16 left-4 bg-white rounded-full p-2 shadow hover:bg-blue-100 transition"
          title="Compartir tablero"
          style={{ zIndex: 1000 }}
        >
          {/* SVG de compartir */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 8a3 3 0 11-6 0 3 3 0 016 0zm6 8a6 6 0 10-12 0h12zm-6-6v6" />
          </svg>
        </button>
      )}

      {/* Modal de compartir */}
      {mostrarCompartir && (
        <div
          className="absolute left-4 top-28 bg-white p-4 rounded shadow-lg border w-72 z-50"
          style={{ minWidth: 250 }}
        >
          <h3 className="text-lg font-bold mb-3">Compartir tablero</h3>
          {cargandoUsuarios ? (
            <p>Cargando usuarios...</p>
          ) : (
            <select
              className="w-full border p-2 rounded mb-4"
              value={usuarioSeleccionado}
              onChange={e => setUsuarioSeleccionado(e.target.value)}
            >
              <option value="">Selecciona un usuario</option>
              {usuariosData?.filter(u => u.email !== undefined).map(u => (
                <option key={u.id} value={u.email}>
                  {u.email}
                </option>
              ))}
            </select>
          )}
          <div className="flex gap-2">
            <button
              className="flex-1 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
              disabled={!usuarioSeleccionado || compartiendo}
              onClick={() => handleCompartir('lector')}
            >
              Lectura
            </button>
            <button
              className="flex-1 bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600"
              disabled={!usuarioSeleccionado || compartiendo}
              onClick={() => handleCompartir('editor')}
            >
              Edición
            </button>
            <button
              className="flex-1 bg-gray-400 text-white rounded px-4 py-2 hover:bg-gray-500"
              onClick={() => setMostrarCompartir(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <BarraBusquedaTareas /> {/* <-- Agregalo aquí */}
    </header>
  );
};

export default Header;