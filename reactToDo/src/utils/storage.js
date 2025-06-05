export const loadTasks = () => {
  try {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : {
      Personal: [],
      Universidad: [],
      Work: []
    }; // Estructura inicial
  } catch (error) {
    console.error('Error loading tasks:', error);
    return {
      Personal: [],
      Universidad: [],
      Work: []
    };
  }
};