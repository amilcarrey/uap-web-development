
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useParams y useNavigate
import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';
import useNotificationStore from '../store/notificationStore';

import {
  useTasks,
  useAddTask,
  useToggleTaskCompletion,
  useDeleteTask,
  useClearCompletedTasks,
  useUpdateTask,
  useBoards, // Importa useBoards para obtener el nombre del tablero
} from '../hooks/useTasks';

const BoardView = () => {
  const { boardId } = useParams(); // Obtiene el boardId de la URL
  const navigate = useNavigate(); // Para la navegación programática

  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const showNotification = useNotificationStore((state) => state.showNotification);

  // Obtiene el nombre del tablero
  const { data: boards } = useBoards();
  const currentBoard = boards?.find(board => board.id === boardId);

  // Pasa boardId al hook useTasks
  const { data, isLoading, isError, error } = useTasks(boardId, filter, currentPage, tasksPerPage);

  const tasks = data?.tasks || [];
  const totalTasks = data?.total || 0;
  const totalPages = Math.ceil(totalTasks / tasksPerPage);

  const addTaskMutation = useAddTask();
  const toggleTaskCompletionMutation = useToggleTaskCompletion();
  const deleteTaskMutation = useDeleteTask();
  const clearCompletedTasksMutation = useClearCompletedTasks();
  const updateTaskMutation = useUpdateTask();

  const [editingTask, setEditingTask] = useState(null);

  // --- Manejadores de Tareas (Ahora con boardId) ---
  const handleAddTask = (newTaskText) => {
    // Pasa el boardId a la mutación
    addTaskMutation.mutate({ boardId, taskText }, {
      onSuccess: () => {
        showNotification('Task added successfully!', 'success');
      },
      onError: (err) => {
        showNotification(`Error adding task: ${err.message}`, 'error');
      }
    });
  };

  const handleToggleCompleted = (id) => {
    toggleTaskCompletionMutation.mutate({ boardId, id }, { // Pasa boardId
      onSuccess: () => {
        showNotification('Task updated!', 'success');
      },
      onError: (err) => {
        showNotification(`Error updating task: ${err.message}`, 'error');
      }
    });
  };

  const handleDeleteTask = (id) => {
    deleteTaskMutation.mutate({ boardId, id }, { // Pasa boardId
      onSuccess: () => {
        showNotification('Task deleted!', 'success');
        if (tasks.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
      },
      onError: (err) => {
        showNotification(`Error deleting task: ${err.message}`, 'error');
      }
    });
  };

  const handleClearCompleted = () => {
    clearCompletedTasksMutation.mutate(boardId, { // Pasa boardId directamente
      onSuccess: () => {
        showNotification('Completed tasks cleared!', 'success');
        setCurrentPage(1);
      },
      onError: (err) => {
        showNotification(`Error clearing tasks: ${err.message}`, 'error');
      }
    });
  };

  const startEditing = (taskToEdit) => {
    setEditingTask(taskToEdit);
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const handleEditTask = (updatedText) => {
    if (editingTask && updatedText.trim() !== '') {
      updateTaskMutation.mutate(
        {
          boardId, // Pasa boardId
          id: editingTask.id,
          updatedTaskData: {
            text: updatedText,
            completed: editingTask.completed,
          },
        },
        {
          onSuccess: () => {
            showNotification('Task updated successfully!', 'success');
            setEditingTask(null);
          },
          onError: (err) => {
            showNotification(`Error updating task: ${err.message}`, 'error');
          },
        }
      );
    } else {
      showNotification('Task text cannot be empty.', 'error');
    }
  };

  // Si el tablero no se encuentra, o si boards es undefined (todavía cargando)
  if (!boardId || (!isLoading && !currentBoard && !isError)) {
    // Si no hay boardId en la URL o el tablero no existe después de cargar,
    // y no estamos en estado de error, redirige a la raíz o a una página de "no encontrado"
    return (
        <div className="text-center text-gray-600 mt-10">
            {boardId ? `Board "${boardId}" not found.` : "No board selected."}
            <br />
            <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Go to Boards List
            </button>
        </div>
    );
  }

  return (
    <div className="w-full"> {/* Envuelve todo el contenido del tablero */}
        <h2 className="text-3xl font-bold text-gray-800 text-center my-4">
            {currentBoard?.name || 'Loading Board...'}
        </h2>

        {editingTask ? (
          <AddTaskForm
            onAddTask={handleEditTask}
            initialTaskText={editingTask.text}
            isEditing={true}
            onCancelEdit={cancelEditing}
          />
        ) : (
          <AddTaskForm onAddTask={handleAddTask} />
        )}

        <section className="text-center my-5">
          <button
            onClick={() => { setFilter('all'); setCurrentPage(1); }}
            className={`mx-2 text-blue-600 font-bold hover:underline ${filter === 'all' ? 'underline' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => { setFilter('active'); setCurrentPage(1); }}
            className={`mx-2 text-blue-600 font-bold hover:underline ${filter === 'active' ? 'underline' : ''}`}
          >
            Active
          </button>
          <button
            onClick={() => { setFilter('completed'); setCurrentPage(1); }}
            className={`mx-2 text-blue-600 font-bold hover:underline ${filter === 'completed' ? 'underline' : ''}`}
          >
            Completed
          </button>
        </section>

        <section className="bg-yellow-100 rounded-2xl w-3/5 mx-auto p-5 shadow-lg">
          <section className="flex flex-col gap-2">
            {isLoading ? (
              <p className="text-center">Loading tasks...</p>
            ) : isError ? (
              <p className="text-center text-red-500">Failed to load tasks: {error.message}</p>
            ) : tasks.length === 0 ? (
              <p className="text-center text-gray-500">No tasks to display.</p>
            ) : (
              tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleCompleted={handleToggleCompleted}
                  onDeleteTask={handleDeleteTask}
                  onEditTask={startEditing}
                  isEditing={editingTask && editingTask.id === task.id}
                />
              ))
            )}
            <footer className="flex justify-between items-center mt-5">
              <span className="text-gray-600">{totalTasks} items left</span>
              <div className="flex gap-2">
                <button
                  onClick={handleClearCompleted}
                  className="text-cyan-400 underline"
                  disabled={clearCompletedTasksMutation.isLoading}
                >
                  Clear completed
                </button>
                {totalPages > 1 && (
                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1 || isLoading}
                      className="px-3 py-1 rounded-md bg-blue-500 text-white disabled:opacity-50"
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        disabled={currentPage === pageNumber || isLoading}
                        className={`px-3 py-1 rounded-md ${currentPage === pageNumber ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'} disabled:opacity-50`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages || isLoading}
                      className="px-3 py-1 rounded-md bg-blue-500 text-white disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </footer>
          </section>
        </section>
    </div>
  );
};

export default BoardView;