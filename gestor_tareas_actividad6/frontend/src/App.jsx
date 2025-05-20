import { useEffect, useState } from 'react';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  deleteCompletedTasks
} from './services/api';

import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterButtons from './components/FilterButtons';
import ClearCompleted from './components/ClearCompleted';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(console.error);
  }, []);

  const handleAddTask = async (text) => {
    try {
      const newTask = await createTask({ text, completed: false });
      setTasks(prev => [...prev, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const updatedTask = await updateTask(id, { completed });
      setTasks(prev =>
        prev.map(task => task.id === id ? updatedTask : task)
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleClearCompleted = async () => {
    try {
      await deleteCompletedTasks();
      setTasks(prev => prev.filter(task => !task.completed));
    } catch (error) {
      console.error('Error clearing completed tasks:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="app-container">
      <header className="fondo-seccion">
        <h1 className="titulo-principal">Gestión de tareas</h1>
      </header>

      <main className="contenedor-principal">
        <TaskForm onAdd={handleAddTask} />
        
        <section className="seccion-tareas">
          <TaskList
            tasks={filteredTasks}
            onToggle={handleToggleComplete}
            onDelete={handleDelete}
          />
          <ClearCompleted onClear={handleClearCompleted} />
        </section>

        <div className="filtros">
          <FilterButtons currentFilter={filter} onChange={setFilter} />
        </div>
      </main>
    </div>
  );
};

export default App;
