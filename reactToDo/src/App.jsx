import { useState, useEffect } from 'react';
import { loadTasks, saveTasks } from './utils/storage';
import Tabs from './components/Tabs';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import TaskFilters from './components/TaskFilters';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('Personal');
  const [tasks, setTasks] = useState(loadTasks());
  const [filter, setFilter] = useState('all');

  // Persiste los cambios en localStorage
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (text) => {
    const newTask = { id: Date.now(), text, completed: false };
    setTasks(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newTask]
    }));
  };

  const toggleTask = (id) => {
    setTasks(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const deleteTask = (id) => {
    setTasks(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(task => task.id !== id)
    }));
  };

  const clearCompleted = () => {
    setTasks(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(task => !task.completed)
    }));
  };

  const getFilteredTasks = () => {
    const currentTasks = tasks[activeTab] || [];
    switch(filter) {
      case 'active': return currentTasks.filter(task => !task.completed);
      case 'completed': return currentTasks.filter(task => task.completed);
      default: return currentTasks;
    }
  };

  return (
    <div className="container">
      <h1>My Tasks</h1>
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      <AddTask onAddTask={addTask} />
      <TaskFilters 
        currentFilter={filter}
        onFilterChange={setFilter} 
        onClearCompleted={clearCompleted}
      />
      <TaskList 
        tasks={getFilteredTasks()}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />
    </div>
  );
}
