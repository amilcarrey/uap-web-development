import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useTableros, useCrearTablero, useEliminarTablero } from '../hooks/useTableros';
import { useClientStore } from '../store/clientStore';

interface HeaderProps {
  tableroNombre?: string;
}

const Header = ({ tableroNombre }: HeaderProps) => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombreTablero, setNombreTablero] = useState('');
  const { data: tablerosData } = useTableros();
  const { mostrarToast } = useClientStore();
  const crearTableroMutation = useCrearTablero();
  const eliminarTableroMutation = useEliminarTablero();
  const navigate = useNavigate();
  
  // Obtener el alias actual de la URL
  const params = useParams({ strict: false });
  const aliasActual = params?.alias as string;

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
        navigate({ to: '/tablero/$alias', params: { alias: 'configuracion' } });      },
      onError: (error) => {
        mostrarToast(error.message || 'Error al eliminar tablero', 'error');
      },
    });
  };

  const handleTableroClick = (alias: string) => {
    navigate({ to: '/tablero/$alias', params: { alias } });
  };

  return (
    <>
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
    </>
  );
};

export default Header;