import { useParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import TodoFilters from '../components/TodoFilters';
import Pagination from '../components/Pagination';
import ErrorMessage from '../components/ErrorMessage';
import { useTaskManager } from '../hooks/useTaskManager';

const BoardDetail = () => {
  const { boardName } = useParams();
  
  // Hook personalizado que combina Zustand + Tanstack Query
  const {
    // Datos procesados
    paginatedTasks,
    totalPages,
    completedCount,
    totalCount,
    filter,
    currentPage,
    
    // Estados
    isLoading,
    error,
    editingTaskId,
    
    // Handlers
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleEditTask,
    handleSaveEdit,
    handleCancelEdit,
    handleClearCompleted,
    handlePageChange,
    handleFilterChange,
    
    // Utilidades
    getEmptyMessage
  } = useTaskManager(boardName);

  return (
    <PageLayout title={`Tablero: ${boardName}`}>
      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      <TodoForm 
        onAdd={handleAddTask}
        isLoading={isLoading}
        placeholder="Nueva tarea..."
        buttonText="Agregar"
      />

      <TodoFilters
        currentFilter={filter}
        onFilterChange={handleFilterChange}
        onClearCompleted={handleClearCompleted}
        completedCount={completedCount}
        isLoading={isLoading}
      />

      <TodoList
        todos={paginatedTasks}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
        onEdit={handleEditTask}
        editingId={editingTaskId}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
        isLoading={isLoading}
        error={error}
        emptyMessage={getEmptyMessage()}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />

      {/* Estadísticas */}
      {totalCount > 0 && (
        <div className="mt-6 text-center text-white/60 text-sm">
          {paginatedTasks.length} de {totalCount} tareas mostradas
          {filter !== 'all' && ` (filtro: ${filter})`}
        </div>
      )}
    </PageLayout>
  );
};

export default BoardDetail; 