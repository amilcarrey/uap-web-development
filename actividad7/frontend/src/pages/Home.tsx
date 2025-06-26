import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import FilterButtons from '../components/FilterButtons';
import ClearCompleted from '../components/ClearCompleted';
import { useTasks } from '../hooks/useTasks';
import { useUIStore } from '../store/uiStore';

const Home = () => {
  const {
    data: tasks = [],
    isLoading,
    isError,
    toggleTask,
    deleteTask,
    clearCompleted,
  } = useTasks();

  const filter = useUIStore((state) => state.filter);
  const setFilter = useUIStore((state) => state.setFilter);

  const filtered = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error cargando tareas</p>;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <TaskForm />
      <TaskList
        tasks={filtered}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />
      <FilterButtons currentFilter={filter} onChange={setFilter} />
      <ClearCompleted onClear={clearCompleted} />
    </div>
  );
};

export default Home;
