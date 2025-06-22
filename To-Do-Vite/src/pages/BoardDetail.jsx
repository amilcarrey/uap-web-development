import { useParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import TodoFilters from '../components/TodoFilters';
import Pagination from '../components/Pagination';
import ErrorMessage from '../components/ErrorMessage';
import SearchInput from '../components/SearchInput';
import { useTaskManager } from '../hooks/useTaskManager';

const BoardDetail = () => {
  const { boardName } = useParams();
  
  const {
    paginatedTasks,
    totalPages,
    completedCount,
    totalCount,
    filter,
    searchTerm,
    currentPage,
    isLoading,
    error,
    editingTaskId,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleEditTask,
    handleSaveEdit,
    handleCancelEdit,
    handleClearCompleted,
    handlePageChange,
    handleFilterChange,
    handleSearchChange,
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

      <SearchInput 
        initialValue={searchTerm}
        onSearchChange={handleSearchChange}
        placeholder="Buscar por título..."
        debounceDelay={150}
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
    </PageLayout>
  );
};

export default BoardDetail; 