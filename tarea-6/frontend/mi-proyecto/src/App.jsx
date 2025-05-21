import { useState, useEffect } from 'react';
import TaskItem from './components/TaskItem';
import AddTaskForm from './components/AddTaskForm';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tasks?filter=${filter}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (e) {
      console.error("Error fetching tasks:", e);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (newTaskText) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: newTaskText }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchTasks(); // Vuelve a cargar las tareas para reflejar el cambio
    } catch (e) {
      console.error("Error adding task:", e);
      setError("Failed to add task. Please try again.");
    }
  };

  const handleToggleCompleted = async (index) => {
    try {
      const response = await fetch(`/api/tasks/toggle-completed/${index}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setTasks(prevTasks =>
        prevTasks.map((task, i) =>
          i === index ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (e) {
      console.error("Error toggling task completion:", e);
      setError("Failed to update task. Please try again.");
    }
  };

  const handleDeleteTask = async (index) => {
    try {
      const response = await fetch(`/api/tasks/delete-task/${index}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
    } catch (e) {
      console.error("Error deleting task:", e);
      setError("Failed to delete task. Please try again.");
    }
  };

  const handleClearCompleted = async () => {
    try {
      const response = await fetch('/api/tasks/clear-completed', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchTasks();
    } catch (e) {
      console.error("Error clearing completed tasks:", e);
      setError("Failed to clear completed tasks. Please try again.");
    }
  };

  return (
    <div className="font-sans bg-gray-100 min-h-screen overflow-y-auto">
      <header className="text-center py-2">
        <h1 className="text-[25px] bg-gradient-to-r from-cyan-400 to-blue-700 bg-clip-text text-transparent w-fit mx-auto">TODO</h1>
      </header>
      <main className="container mx-auto px-4">
        {/* */}
        <section className="flex w-full mt-2 mb-2">
            <button className="flex-1 text-center text-blue-500 text-2xl py-2 px-5 border-b-2 border-transparent hover:bg-cyan-200">Personal</button>
            <button className="flex-1 text-center text-blue-500 text-2xl py-2 px-5 border-b-2 border-transparent hover:bg-cyan-200">Profesional</button>
        </section>

        <AddTaskForm onAddTask={handleAddTask} />

        <section className="text-center my-5">
          <button
            onClick={() => setFilter('all')}
            className={`mx-2 text-blue-600 font-bold hover:underline ${filter === 'all' ? 'underline' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`mx-2 text-blue-600 font-bold hover:underline ${filter === 'active' ? 'underline' : ''}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`mx-2 text-blue-600 font-bold hover:underline ${filter === 'completed' ? 'underline' : ''}`}
          >
            Completed
          </button>
        </section>

        <section className="bg-yellow-100 rounded-2xl w-3/5 mx-auto p-5 shadow-lg">
          <section className="flex flex-col gap-2">
            {loading ? (
              <p className="text-center">Loading tasks...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : tasks.length === 0 ? (
              <p className="text-center text-gray-500">No tasks to display.</p>
            ) : (
              tasks.map((task, index) => (
                <TaskItem
                  key={index}
                  task={task}
                  index={index}
                  onToggleCompleted={handleToggleCompleted}
                  onDeleteTask={handleDeleteTask}
                />
              ))
            )}
            <footer className="flex justify-end mt-5">
              <button
                onClick={handleClearCompleted}
                className="text-cyan-400 underline"
              >
                Clear completed
              </button>
            </footer>
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;