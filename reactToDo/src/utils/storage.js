// utils/storage.js
export const loadTasks = () => {
  try {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : []; // Devuelve array vacío si no hay datos
  } catch (error) {
    console.error('Error loading tasks:', error);
    return []; // Devuelve array vacío en caso de error
  }
};

export const saveTasks = (tasks) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};