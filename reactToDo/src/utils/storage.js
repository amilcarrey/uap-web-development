export const loadTasks = () => {
  try {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error loading tasks:', error);
    return null;
  }
};

export const saveTasks = (tasks) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};