import { useParams } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';

const BoardPage = () => {
  const { boardId } = useParams();
  const { tasks = [], toggleTask, deleteTask } = useTasks(boardId || '');

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Tablero: {boardId}</h1>
      <TaskForm boardId={boardId || ''} />
      <TaskList 
        tasks={tasks} 
        onToggle={toggleTask} 
        onDelete={deleteTask} 
      />
    </div>
  );
};

export default BoardPage;