// frontend/src/components/BoardView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    useBoards,
} from '../hooks/useTasks';

const BoardView = () => {
    const { boardId } = useParams(); // Obtiene el boardId de la URL (es un STRING)
    const navigate = useNavigate();

    // --- IMPORTANTE: Convertimos boardId a número aquí
    const numericBoardId = Number(boardId); 

    console.log('BoardView rendered for boardId:', boardId); // DEBUG: 1
    console.log('Numeric Board ID:', numericBoardId); // Nuevo DEBUG
    console.log('Type of boardId from useParams:', typeof boardId); // Nuevo DEBUG
    console.log('Type of numericBoardId:', typeof numericBoardId); // Nuevo DEBUG

    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 5;

    const showNotification = useNotificationStore((state) => state.showNotification);

    const { data: boards, isLoading: isLoadingBoards } = useBoards(); // Añadí isLoadingBoards
    
    // --- CAMBIO CLAVE AQUÍ: Usamos numericBoardId para la comparación
    const currentBoard = boards?.find(board => board.id === numericBoardId);

    console.log('Boards data:', boards); // DEBUG: 2
    console.log('Current Board:', currentBoard); // DEBUG: 3
    if (boards && boards.length > 0) {
        console.log('Type of first board.id from API:', typeof boards[0].id); // Nuevo DEBUG
        console.log('First board from API:', boards[0]); // Nuevo DEBUG
    }

    // Pasamos numericBoardId a useTasks
    const { data, isLoading, isError, error } = useTasks(numericBoardId, filter, currentPage, tasksPerPage); 

    const tasks = data?.tasks || [];
    const totalTasks = data?.total || 0;
    const totalPages = Math.ceil(totalTasks / tasksPerPage);

    console.log('Tasks data:', data); // DEBUG: 4
    console.log('Is Loading Tasks:', isLoading); // DEBUG: 5
    console.log('Is Error Tasks:', isError); // DEBUG: 6
    console.log('Tasks Error:', error); // DEBUG: 7

    // --- CORRECCIONES CRÍTICAS EN LA INICIALIZACIÓN DE MUTACIONES ---
    // Los hooks de mutación (useAddTask, useToggleTaskCompletion, etc.) 
    // NO NECESITAN el boardId al ser inicializados. 
    // Lo reciben como parte del objeto en el mutateFn.
    const addTaskMutation = useAddTask(); 
    const toggleTaskCompletionMutation = useToggleTaskCompletion(); 
    const deleteTaskMutation = useDeleteTask(); 
    const clearCompletedTasksMutation = useClearCompletedTasks(); 
    const updateTaskMutation = useUpdateTask(); 

    // --- CORRECCIONES EN LOS MANEJADORES DE MUTACIONES ---
    const handleAddTask = async (text) => {
        try {
            // addTaskMutation.mutateAsync espera un objeto { boardId, taskText }
            await addTaskMutation.mutateAsync({ boardId: numericBoardId, taskText: text }); 
            showNotification('Task added successfully!', 'success');
        } catch (error) {
            console.error('Error adding task:', error);
            showNotification(`Error adding task: ${error.response?.data?.message || error.message}`, 'error');
        }
    };

    const handleToggleCompleted = async (taskId) => {
        try {
            // toggleTaskCompletionMutation.mutateAsync espera un objeto { boardId, id }
            await toggleTaskCompletionMutation.mutateAsync({ boardId: numericBoardId, id: taskId });
            showNotification('Task updated!', 'success');
        } catch (error) {
            console.error('Error toggling task completion:', error);
            showNotification(`Error updating task: ${error.response?.data?.message || error.message}`, 'error');
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            // deleteTaskMutation.mutateAsync espera un objeto { boardId, id }
            await deleteTaskMutation.mutateAsync({ boardId: numericBoardId, id: taskId });
            showNotification('Task deleted!', 'success');
        } catch (error) {
            console.error('Error deleting task:', error);
            showNotification(`Error deleting task: ${error.response?.data?.message || error.message}`, 'error');
        }
    };

    const handleClearCompleted = async () => {
        try {
            // clearCompletedTasksMutation.mutateAsync espera el boardId directamente
            await clearCompletedTasksMutation.mutateAsync(numericBoardId);
            showNotification('Completed tasks cleared!', 'success');
        } catch (error) {
            console.error('Error clearing completed tasks:', error);
            showNotification(`Error clearing tasks: ${error.response?.data?.message || error.message}`, 'error');
        }
    };

    // Estados para la edición
    const [editingTask, setEditingTask] = useState(null); // Almacena la tarea que se está editando

    const handleEditTask = (task) => {
        setEditingTask(task); // Cuando se hace clic en editar, guarda la tarea en el estado de edición
    };

    const handleUpdateTask = async (updatedText) => {
        if (!editingTask) return;
        try {
            // updateTaskMutation.mutateAsync espera un objeto { boardId, id, updatedTaskData }
            await updateTaskMutation.mutateAsync({
                boardId: numericBoardId,
                id: editingTask.id, // Asegúrate de que tu `api/tasks.js` use `id` para el endpoint PUT /tasks/:id
                updatedTaskData: { text: updatedText }, // Envía solo el texto para actualizar
            });
            showNotification('Task updated successfully!', 'success');
            setEditingTask(null); // Limpia el estado de edición
        } catch (error) {
            console.error('Error updating task:', error);
            showNotification(`Error updating task: ${error.response?.data?.message || error.message}`, 'error');
        }
    };

    const handleCancelEdit = () => {
        setEditingTask(null); // Cancela la edición, borrando la tarea del estado de edición
    };

    // --- Lógica condicional de retorno ---
    if (!boardId) {
        console.log('DEBUG: boardId is missing, showing "No board selected" message.'); // DEBUG: 8
        return (
            <div className="text-center text-gray-600 mt-10">
                No board selected.
                <br />
                <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Go to Boards List
                </button>
            </div>
        );
    }

    if (isLoadingBoards) { // Añadido check para boards
        console.log('DEBUG: Boards are still loading.'); // DEBUG: 9
        return <div className="text-center text-gray-600 mt-10">Loading board information...</div>;
    }

    // Aquí, currentBoard debería estar definido si los IDs coinciden ahora.
    if (!currentBoard) { // Simplificamos la condición ya que isLoading y isError se manejan abajo para tasks
        console.log('DEBUG: Board not found or not loaded, showing "not found" message.'); // DEBUG: 10
        return (
            <div className="text-center text-gray-600 mt-10">
                Board "{boardId}" not found.
                <br />
                <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Go to Boards List
                </button>
            </div>
        );
    }

    if (isLoading) {
        console.log('DEBUG: Tasks are loading.'); // DEBUG: 11
        return <p className="text-center">Loading tasks...</p>;
    }

    if (isError) {
        console.log('DEBUG: Error loading tasks.', error); // DEBUG: 12
        return (
            <p className="text-center text-red-500">
                Failed to load tasks: {error?.message || 'Unknown error'}
            </p>
        );
    }

    console.log('DEBUG: Rendering tasks section.'); // DEBUG: 13 (Si llegamos aquí, la sección de tareas debería verse)

    // Lógica de paginación
    const startIndex = (currentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    const currentTasks = tasks.slice(startIndex, endIndex);

    const filterTasks = (filterType) => {
        setFilter(filterType);
        setCurrentPage(1); // Reset page on filter change
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mx-auto p-4 flex flex-col items-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 mt-10 text-center">
                {currentBoard.name} Tasks
            </h1>

            {/* Formulario de añadir/editar tarea */}
            <AddTaskForm
                onAddTask={editingTask ? handleUpdateTask : handleAddTask} // Usa la función de actualizar si estamos editando
                initialTaskText={editingTask ? editingTask.text : ''} // Pasa el texto de la tarea a editar
                isEditing={!!editingTask} // Pasa true si hay una tarea en edición
                onCancelEdit={handleCancelEdit} // Pasa la función para cancelar la edición
            />

            <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-lg mb-6">
                <div className="flex justify-around mb-4 border-b pb-4">
                    <button
                        onClick={() => filterTasks('all')}
                        className={`px-4 py-2 rounded-md transition-colors duration-200 ${filter === 'all' ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => filterTasks('active')}
                        className={`px-4 py-2 rounded-md transition-colors duration-200 ${filter === 'active' ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => filterTasks('completed')}
                        className={`px-4 py-2 rounded-md transition-colors duration-200 ${filter === 'completed' ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'}`}
                    >
                        Completed
                    </button>
                </div>

                {tasks.length === 0 && !isLoading && !isError ? (
                    <p className="text-center text-gray-500">No tasks found for this board.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggleCompleted={handleToggleCompleted}
                                onDeleteTask={handleDeleteTask}
                                onEditTask={handleEditTask} // Pasa la función para iniciar la edición
                                isEditing={editingTask?.id === task.id} // Indica si esta tarea en particular está siendo editada
                            />
                        ))}
                    </ul>
                )}


                {tasks.length > 0 && (
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                        <button
                            onClick={handleClearCompleted}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200 text-sm"
                        >
                            Clear Completed
                        </button>
                        {totalPages > 1 && (
                            <div className="flex space-x-1">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => paginate(i + 1)}
                                        className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BoardView;