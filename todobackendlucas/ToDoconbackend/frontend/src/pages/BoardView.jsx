import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBoard } from '../hooks/useBoards';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useDeleteCompletedTasks } from '../hooks/useTasks';
import { 
  PlusIcon, 
  TrashIcon, 
  ArrowLeftIcon,
  CheckIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import CreateTaskModal from '../components/CreateTaskModal';
import EditTaskModal from '../components/EditTaskModal';

const BoardView = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const { data: board, isLoading: boardLoading } = useBoard(boardId);
  const { data: tasks, isLoading: tasksLoading } = useTasks(boardId);
  
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const deleteCompletedMutation = useDeleteCompletedTasks();

  const handleCreateTask = async (taskData) => {
    try {
      await createTaskMutation.mutateAsync({ boardId, ...taskData });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTaskMutation.mutateAsync({ 
        boardId, 
        taskId: editingTask.id, 
        ...taskData 
      });
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateTaskMutation.mutateAsync({
        boardId,
        taskId: task.id,
        completada: !task.completada
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await deleteTaskMutation.mutateAsync({ boardId, taskId });
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleDeleteCompleted = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todas las tareas completadas?')) {
      try {
        await deleteCompletedMutation.mutateAsync(boardId);
      } catch (error) {
        console.error('Error deleting completed tasks:', error);
      }
    }
  };

  const canEdit = board?.rol === 'propietario' || board?.rol === 'editor';
  const pendingTasks = tasks?.filter(task => !task.completada) || [];
  const completedTasks = tasks?.filter(task => task.completada) || [];

  if (boardLoading || tasksLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {board?.nombre}
                </h1>
                {board?.descripcion && (
                  <p className="text-gray-600">{board.descripcion}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {canEdit && (
                <>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Nueva Tarea
                  </button>
                  
                  {completedTasks.length > 0 && (
                    <button
                      onClick={handleDeleteCompleted}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <TrashIcon className="h-5 w-5 mr-2" />
                      Limpiar Completadas
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tareas Pendientes */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Pendientes ({pendingTasks.length})
              </h2>
            </div>
            <div className="p-6">
              {pendingTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay tareas pendientes
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300"
                    >
                      <div className="flex items-center flex-1">
                        {canEdit && (
                          <button
                            onClick={() => handleToggleComplete(task)}
                            className="mr-3 h-5 w-5 border-2 border-gray-300 rounded hover:border-indigo-500"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {task.titulo}
                          </h3>
                          {task.descripcion && (
                            <p className="text-sm text-gray-500">
                              {task.descripcion}
                            </p>
                          )}
                          {task.fecha_vencimiento && (
                            <p className="text-xs text-gray-400">
                              Vence: {new Date(task.fecha_vencimiento).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {canEdit && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingTask(task)}
                            className="text-gray-400 hover:text-indigo-600"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tareas Completadas */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Completadas ({completedTasks.length})
              </h2>
            </div>
            <div className="p-6">
              {completedTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay tareas completadas
                </div>
              ) : (
                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center flex-1">
                        {canEdit && (
                          <button
                            onClick={() => handleToggleComplete(task)}
                            className="mr-3 h-5 w-5 bg-green-500 rounded flex items-center justify-center"
                          >
                            <CheckIcon className="h-3 w-3 text-white" />
                          </button>
                        )}
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 line-through">
                            {task.titulo}
                          </h3>
                          {task.descripcion && (
                            <p className="text-sm text-gray-500 line-through">
                              {task.descripcion}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {canEdit && (
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTask}
        isLoading={createTaskMutation.isPending}
      />

      {editingTask && (
        <EditTaskModal
          isOpen={true}
          onClose={() => setEditingTask(null)}
          onSubmit={handleUpdateTask}
          task={editingTask}
          isLoading={updateTaskMutation.isPending}
        />
      )}
    </div>
  );
};

export default BoardView;
