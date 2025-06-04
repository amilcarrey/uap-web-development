import { useState } from 'react';
import Tabs from './components/Tabs';
import TaskList from './components/TaskList';
import './index.css';  // Estilos globales

export default function App() {
  const [activeTab, setActiveTab] = useState('Personal');
  const [tasks, setTasks] = useState({
    Personal: ['Buy groceries', 'Go to gym'],
    University: ['Finish assignment', 'Read chapter 5'],
    Work: ['Prepare presentation', 'Reply to emails'],
  });

  return (
    <div className="container">
      <h1>My Tasks</h1>
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      <TaskList tasks={tasks[activeTab]} />
    </div>
  );
}
