import './App.css';
import AddReminderForm from './components/AddReminderForm';
import ClearCompletedForm from './components/ClearCompletedForm';
import FilterLinks from './components/FilterLinks';
import ReminderList from './components/ReminderList';
import React, { useEffect, useState, useCallback } from 'react';

const BASE_URL = "http://localhost:4321/api";

interface Reminder {
  id: string;
  text: string;
  completed: boolean;
}

function App() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [filter, setFilter] = useState<string>('all');

  // Fetch reminders from API
  const fetchReminders = useCallback(async (currentFilter = filter) => {
    const response = await fetch(`${BASE_URL}/filter?filter=${currentFilter}`);
    const data = await response.json();
    setReminders(data.reminders || []);
    setFilter(data.filter || 'all');
  }, [filter]);

  // Listen for updates
  useEffect(() => {
    fetchReminders();

    const handleUpdate = () => fetchReminders();
    window.addEventListener("reminders-updated", handleUpdate);
    return () => window.removeEventListener("reminders-updated", handleUpdate);
  }, [fetchReminders]);

  // Handler for filter changes
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    fetchReminders(newFilter);
  };

  return (
    <main className="max-w-[600px] mx-auto p-8 bg-rose-50 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold text-center text-rose-700 mb-8">Mis Recordatorios</h1>
      <AddReminderForm onReminderAdded={fetchReminders} />
      <ReminderList reminders={reminders} onRemindersUpdated={fetchReminders} />
      <ClearCompletedForm reminders={reminders} onRemindersUpdated={fetchReminders} />
      <FilterLinks currentFilter={filter} onFilterChange={handleFilterChange} />
    </main>
  );
}

export default App;