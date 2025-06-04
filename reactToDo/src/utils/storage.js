export const loadTasks = () => {
  const saved = localStorage.getItem('todo-tasks');
  return saved ? JSON.parse(saved) : {
    Personal: [],
    University: [],
    Work: []
  };
};

export const saveTasks = (tasks) => {
  localStorage.setItem('todo-tasks', JSON.stringify(tasks));
};