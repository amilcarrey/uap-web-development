import React, { useState, useEffect } from 'react';
import NuevaTareaInput from './components/NuevaTareaInput';
import TareaList from './components/TareaList';
import Filtros from './components/Filtros';
import { useEliminarCompletadas, useTareas } from './hooks/useTareas';
import { useAppStore } from './store/appStore';
import './App.css';

const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [minLoading, setMinLoading] = useState(true);
  const eliminarCompletadas = useEliminarCompletadas();
  const { showToast } = useAppStore();
  const limit = 10;
  const { data, error, isLoading } = useTareas(page, limit);

  console.log('App isLoading:', isLoading, 'data:', data);

  // Forzar un retraso mínimo de 500ms para que el loading sea visible
  useEffect(() => {
    if (isLoading) {
      setMinLoading(true);
      const timer = setTimeout(() => setMinLoading(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setMinLoading(false);
    }
  }, [isLoading]);

  const totalPages = data?.total ? Math.ceil(data.total / limit) : 1;

  const handleClearCompleted = () => {
    eliminarCompletadas.mutate(undefined, {
      onSuccess: () => {
        showToast('Tareas completadas eliminadas', 'success');
      },
      onError: () => {
        showToast('Error al eliminar tareas completadas', 'error');
      },
    });
  };

  const handleNextPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setPage((p) => {
      const newPage = p + 1;
      console.log('Setting page to:', newPage);
      return newPage;
    });
  };

  const handlePrevPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setPage((p) => {
      const newPage = Math.max(p - 1, 1);
      console.log('Setting page to:', newPage);
      return newPage;
    });
  };

  const handleTareaAgregada = () => {
    const newTotalPages = data?.total ? Math.ceil((data.total + 1) / limit) : 1;
    setPage(newTotalPages);
    showToast('Tarea agregada correctamente', 'success');
  };

  if (isLoading || minLoading) return <div className="loading-spinner">Cargando aplicación...</div>;
  if (error) return <div>Error al cargar: {(error as Error).message}</div>;

  return (
    <div className="app-container">
      <h1>Gestor de Tareas</h1>
      <NuevaTareaInput onTareaAgregada={handleTareaAgregada} />
      <Filtros />
      <TareaList page={page} />
      <div className="pagination">
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button
          type="button"
          onClick={handleNextPage}
          disabled={page >= totalPages}
        >
          Siguiente
        </button>
      </div>
      <button type="button" onClick={handleClearCompleted}>
        Clear Completed
      </button>
    </div>
  );
};

export default App;