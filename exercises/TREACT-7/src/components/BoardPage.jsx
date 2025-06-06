// Dentro de BoardPage.jsx, reemplazar TaskList por:
<TaskList
  tasks={filtered.map(task => ({
    ...task,
    title: uppercase ? task.title.toUpperCase() : task.title
  }))}
  onToggle={(id, completed) => handleToggle(id, completed)}
  onDelete={handleDelete}
  onEdit={async (id, newTitle) => {
    try {
      await updateTaskMutation.mutateAsync({ id, updates: { title: newTitle } });
      addToast({ message: 'Tarea editada', type: 'success' });
    } catch (err) {
      addToast({ message: err.message, type: 'error' });
    }
  }}
/>
