import { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import FilterButtons from '../components/FilterButtons';
import ClearCompleted from '../components/ClearCompleted';
import { getTasks, createTask, updateTask, deleteTask, deleteCompletedTasks } from '../services/api';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  const handleAddTask = async (text) => {
    try {
      const newTask = await createTask({ text, completed: false });
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      const updatedTask = await updateTask(taskId, {
        ...taskToUpdate,
        completed: !taskToUpdate.completed
      });
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleClearCompleted = async () => {
    try {
      await deleteCompletedTasks();
      setTasks(tasks.filter(task => !task.completed));
    } catch (error) {
      console.error('Error clearing completed tasks:', error);
    }
  };

  return (
    <main className="contenedor-principal">
      <TaskForm onAddTask={handleAddTask} />
      <TaskList
        tasks={filteredTasks}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDelete}
      />
      <ClearCompleted
        onClearCompleted={handleClearCompleted}
        hasCompletedTasks={tasks.some(task => task.completed)}
      />
      <FilterButtons
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
      />
    </main>
  );
};

export default Home;