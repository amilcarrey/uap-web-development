import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTableros, useCrearTablero } from '../hooks/useTableros';
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
  const navigate = useNavigate();

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

  const handleTableroClick = (alias: string) => {
    navigate({ to: '/tablero/$alias', params: { alias } });
  };

  return (
    <>
      <h1 className="my-2 mx-auto text-center text-black text-7xl font-bold">ToDo</h1>
      
      {tableroNombre && (
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          📋 {tableroNombre}
        </h2>
      )}
      
      <div className="categories flex justify-center items-center space-x-6 mb-4">
        {/* Renderizar TODOS los tableros dinámicamente */}
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
      </div>

      {/* Formulario para crear tablero */}
      {mostrarFormulario && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
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