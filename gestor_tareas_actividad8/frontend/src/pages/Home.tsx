import { useParams } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import FilterButtons from '../components/FilterButtons';
import ClearCompleted from '../components/ClearCompleted';
import { useTasks } from '../hooks/useTasks';
import { useUIStore } from '../store/uiStore';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const Home = () => {
  const { boardId } = useParams(); // Añadido: obtener boardId de la URL
  
  const {
    tasks,
    total,
    isLoading,
    isError,
    page,
    setPage,
    toggleTask,
    deleteTask,
    clearCompleted,
  } = useTasks(boardId || ''); // Modificado: pasar boardId al hook

  const filter = useUIStore((state) => state.filter);
  const setFilter = useUIStore((state) => state.setFilter);

  const filtered = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const totalPages = Math.ceil(total / 5);

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage message="Error al cargar las tareas" />;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <TaskForm boardId={boardId || ''} /> {/* Modificado: pasar boardId */}
      <TaskList
        tasks={filtered}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />
      <FilterButtons currentFilter={filter} onChange={setFilter} />
      <ClearCompleted onClear={clearCompleted} />

      {/* ✅ Paginación */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm">
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Home;