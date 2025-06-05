import { useState } from 'react';
import Tabs from './components/Tabs';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import TaskFilters from './components/TaskFilters';

export default function App() {
  const [activeTab, setActiveTab] = useState('Personal');
  const [filter, setFilter] = useState('all');

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
          
          <AddTask category={activeTab} />
          
          <TaskFilters 
            currentFilter={filter}
            onFilterChange={setFilter}
            category={activeTab}
          />
          
          <TaskList 
            category={activeTab}
            filter={filter}
          />
        </div>
      </div>
    </div>
  );
}