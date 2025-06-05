import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NuevaTareaInput from './components/NuevaTareaInput';
import TareaList from './components/TareaList';
import Filtros from './components/Filtros';
import { ToastContainer } from 'react-toastify';
import { useEliminarCompletadas, useTareas } from './hooks/useTareas';
import { useAppStore } from './store/appStore';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const eliminarCompletadas = useEliminarCompletadas();
  const { showToast } = useAppStore();
  const limit = 10;
  const { data, error, isLoading } = useTareas(page, limit);

  console.log('Current page:', page);
  console.log('data.total:', data?.total);
  const totalPages = data?.total ? Math.ceil(data.total / limit) : 1;
  console.log('totalPages:', totalPages);

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

  // Callback para navegar a la última página tras agregar una tarea
  const handleTareaAgregada = () => {
    const newTotalPages = data?.total ? Math.ceil((data.total + 1) / limit) : 1;
    setPage(newTotalPages);
    showToast('Tarea agregada correctamente', 'success');
  };

  if (isLoading && !data) return <div>Cargando aplicación...</div>;
  if (error) return <div>Error al cargar: {(error as Error).message}</div>;

  return (
    <QueryClientProvider client={queryClient}>
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
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </QueryClientProvider>
  );
};

export default App;