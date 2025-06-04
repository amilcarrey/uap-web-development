import { useState } from 'react';
import Tabs from './components/Tabs';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import TaskFilters from './components/TaskFilters';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('Personal');
  const [tasks, setTasks] = useState({
    Personal: [
      { id: 1, text: 'Comprar leche', completed: false },
      { id: 2, text: 'Ir al gimnasio', completed: false }
    ],
    University: [
      { id: 3, text: 'Terminar ensayo', completed: false },
      { id: 4, text: 'Leer capítulo 5', completed: false }
    ],
    Work: [
      { id: 5, text: 'Preparar presentación', completed: false },
      { id: 6, text: 'Responder emails', completed: false }
    ]
  });
  const [filter, setFilter] = useState('all');

  const addTask = (taskText) => {
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false
    };
    
    setTasks(prevTasks => ({
      ...prevTasks,
      [activeTab]: [...prevTasks[activeTab], newTask]
    }));
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [activeTab]: prevTasks[activeTab].map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const deleteTask = (taskId) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [activeTab]: prevTasks[activeTab].filter(task => task.id !== taskId)
    }));
  };

  const clearCompleted = () => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [activeTab]: prevTasks[activeTab].filter(task => !task.completed)
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
        onToggleCompletion={toggleTaskCompletion}
        onDeleteTask={deleteTask}
      />
    </div>
  );
}
