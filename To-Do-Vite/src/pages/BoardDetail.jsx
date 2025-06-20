import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { fetchTasks, createTask, updateTask, deleteTask, deleteCompletedTasks } from '../config/api';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import PageLayout from '../components/PageLayout';

const BoardDetail = () => {
  const { boardName } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { addToast } = useToast();
  const [tasksData, setTasksData] = useState({ tasks: [], total: 0, page: 1, totalPages: 1 });
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks(boardName);
      setTasksData({ tasks: data, total: data.length, page: 1, totalPages: 1 });
      setError(null);
    } catch (err) {
      setError('Error al cargar las tareas');
      addToast('Error al cargar las tareas', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    const interval = setInterval(loadTasks, settings.refetchInterval * 1000);
    return () => clearInterval(interval);
  }, [boardName, settings.refetchInterval, currentPage]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      try {
        const newTaskData = await createTask(boardName, newTask);
        setTasksData(prev => ({
          ...prev,
          tasks: [...prev.tasks, newTaskData],
          total: prev.total + 1
        }));
        setNewTask('');
        setError(null);
        addToast('Tarea creada exitosamente', 'success');
      } catch (err) {
        setError('Error al crear la tarea');
        addToast('Error al crear la tarea', 'error');
        console.error(err);
      }
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const task = tasksData.tasks.find(t => t.id === taskId);
      const updatedTask = await updateTask(boardName, taskId, { completed: !task.completed });
      setTasksData(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? updatedTask : t)
      }));
      addToast('Tarea actualizada exitosamente', 'success');
    } catch (err) {
      setError('Error al actualizar la tarea');
      addToast('Error al actualizar la tarea', 'error');
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(boardName, taskId);
      setTasksData(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== taskId),
        total: prev.total - 1
      }));
      addToast('Tarea eliminada exitosamente', 'success');
    } catch (err) {
      setError('Error al eliminar la tarea');
      addToast('Error al eliminar la tarea', 'error');
      console.error(err);
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const handleSaveEdit = async (taskId) => {
    try {
      const updatedTask = await updateTask(boardName, taskId, { text: editingTaskText });
      setTasksData(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? updatedTask : t)
      }));
      setEditingTaskId(null);
      addToast('Tarea editada exitosamente', 'success');
    } catch (err) {
      setError('Error al actualizar la tarea');
      addToast('Error al actualizar la tarea', 'error');
      console.error(err);
    }
  };

  const handleClearCompleted = async () => {
    try {
      await deleteCompletedTasks(boardName);
      setTasksData(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => !t.completed),
        total: prev.tasks.filter(t => !t.completed).length
      }));
      addToast('Tareas completadas eliminadas exitosamente', 'success');
    } catch (err) {
      setError('Error al eliminar las tareas completadas');
      addToast('Error al eliminar las tareas completadas', 'error');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <PageLayout title={`Tablero: ${boardName}`}>
        <div className="text-white text-xl text-center">Cargando tareas...</div>
      </PageLayout>
    );
  }

  const filteredTasks = tasksData?.tasks?.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  }) || [];

  // PAGINACIÓN
  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / itemsPerPage));
  const paginatedTasks = filteredTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <PageLayout title={`Tablero: ${boardName}`}>
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleAddTask} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Nueva tarea..."
            className="flex-1 p-2 rounded-lg bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Agregar
          </button>
        </div>
      </form>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filter === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filter === 'active' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filter === 'completed' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Completadas
          </button>
        </div>
        {tasksData?.tasks?.some(t => t.completed) && (
          <button
            onClick={handleClearCompleted}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            Limpiar completadas
          </button>
        )}
      </div>

      <div className="space-y-2">
        {paginatedTasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              task.completed
                ? 'bg-green-500/20 border-green-500/30'
                : 'bg-white/10 border-white/20'
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => handleToggleTask(task.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  task.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-white/50 hover:border-green-500'
                }`}
              >
                {task.completed && <FaCheck size={12} />}
              </button>
              
              {editingTaskId === task.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editingTaskText}
                    onChange={(e) => setEditingTaskText(e.target.value)}
                    className="flex-1 p-1 rounded bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(task.id)}
                    className="text-green-400 hover:text-green-300"
                  >
                    <FaCheck size={16} />
                  </button>
                  <button
                    onClick={() => setEditingTaskId(null)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              ) : (
                <span
                  className={`flex-1 ${
                    task.completed ? 'line-through text-white/60' : 'text-white'
                  }`}
                >
                  {task.text}
                </span>
              )}
            </div>
            
            {editingTaskId !== task.id && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditTask(task)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <FaEdit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-white/20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors"
          >
            Anterior
          </button>
          <span className="px-3 py-1 text-white">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-white/20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}

      {paginatedTasks.length === 0 && (
        <div className="text-center text-white/60 py-8">
          {filter === 'all' ? 'No hay tareas en este tablero' : 'No hay tareas con este filtro'}
        </div>
      )}
    </PageLayout>
  );
};

export default BoardDetail; 