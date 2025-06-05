import { useState, useEffect } from 'react';
import { loadTasks, saveTasks } from './utils/storage';
import Tabs from './components/Tabs';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import TaskFilters from './components/TaskFilters';

export default function App() {
  const [activeTab, setActiveTab] = useState('Personal');
  const [tasks, setTasks] = useState(() => {
    const loaded = loadTasks();
    return loaded && loaded.Personal ? loaded : {
      Personal: [],
      Universidad: [],
      Work: []
    };
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    console.log('--- DEBUG ---');
    console.log('Todas las tareas:', tasks);
    console.log('Categoría activa:', activeTab);
    console.log('Tareas filtradas:', getFilteredTasks());
  }, [tasks, activeTab, filter]);

  const addTask = (text) => {
    if (!text.trim()) return;
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
    
    if (!currentTasks.length) {
      console.warn(`No hay tareas en ${activeTab}`);
    }

    return currentTasks.filter(task => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    });
  };

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Task Manager</h1>
          
          <Tabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            tabs={['Personal', 'Universidad', 'Work']} 
          />
          
          <AddTask onAddTask={addTask} />
          
          <TaskFilters 
            currentFilter={filter}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
            activeCount={getFilteredTasks().filter(t => !t.completed).length}
          />
          
          <TaskList 
            tasks={getFilteredTasks()} 
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        </div>
      </div>
    </div>
  );
}