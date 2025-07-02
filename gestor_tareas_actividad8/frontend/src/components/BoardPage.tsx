import { useParams } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const BoardPage = () => {
  const { boardId } = useParams();
  const { tasks = [], refetch } = useTasks(boardId || '');

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

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Tablero: {boardId}</h1>
      <TaskForm boardId={boardId || ''} page={1} />
      <TaskList 
        tasks={tasks} 
        onToggle={toggleTask} 
        onDelete={deleteTask} 
      />
    </div>
  );
};

export default BoardPage;
