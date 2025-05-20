import { useEffect, useState } from 'react';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  clearCompletedTasks
} from './services/api';

import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterButtons from './components/FilterButtons';
import ClearCompleted from './components/ClearCompleted';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(console.error);
  }, []);

  const handleAddTask = async (text) => {
    const newTask = await createTask(text);
    setTasks(prev => [...prev, newTask]);
  };

  const handleToggleComplete = async (id, completed) => {
    const updatedTask = await updateTask(id, { completed });
    setTasks(prev =>
      prev.map(task => task.id === id ? updatedTask : task)
    );
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleClearCompleted = async () => {
    await clearCompletedTasks();
    setTasks(prev => prev.filter(task => !task.completed));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Gestor de Tareas</h1>
      <TaskForm onAdd={handleAddTask} />
      <FilterButtons currentFilter={filter} onChange={setFilter} />
      <TaskList
        tasks={filteredTasks}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDelete}
      />
      <ClearCompleted onClear={handleClearCompleted} />
    </div>
  );
};

export default App;
