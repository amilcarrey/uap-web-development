import { useParams } from 'react-router-dom';
import { useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskSearch from '../components/TaskSearch';
import { useTasks } from '../hooks/useTasks';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import Loader from './Loader'; // ✅ asegúrate de tener este componente

const BoardPage = () => {
  const { boardId } = useParams();
  const [search, setSearch] = useState('');
  const { tasks = [], isError, isLoading, refetch } = useTasks(boardId || '', 1, search);

  const toggleTask = async (id: string) => {
    try {
      await api.patch(`/tasks/${id}/toggle`);
      refetch();
    } catch {
      toast.error('Error al cambiar estado');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      refetch();
    } catch {
      toast.error('Error al eliminar tarea');
    }
  };

  const handleSearch = (query: string) => {
    setSearch(query.trim());
    refetch();
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Tablero: {boardId}</h1>

      {isLoading ? (
        <Loader /> // 🌀 mientras carga
      ) : (
        <>
          <TaskForm boardId={boardId || ''} page={1} />
          <TaskSearch value={search} onSearch={handleSearch} />
          <TaskList 
            tasks={tasks} 
            onToggle={toggleTask} 
            onDelete={deleteTask}
            error={isError}
          />
        </>
      )}
    </div>
  );
};

export default BoardPage;
