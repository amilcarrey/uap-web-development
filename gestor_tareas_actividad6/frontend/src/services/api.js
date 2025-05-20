const API_URL = 'http://localhost:3001/api/tasks';

export const getTasks = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return await response.json();
};

export const createTask = async (task) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  if (!response.ok) throw new Error('Failed to create task');
  return await response.json();
};

export const updateTask = async (id, task) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  if (!response.ok) throw new Error('Failed to update task');
  return await response.json();
};

export const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete task');
};

export const deleteCompletedTasks = async () => {
  const response = await fetch(`${API_URL}/completed`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete completed tasks');
};