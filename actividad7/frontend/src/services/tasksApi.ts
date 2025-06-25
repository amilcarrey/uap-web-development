// src/services/tasksApi.ts
export const getTasks = async () => {
  return [
    { id: 1, text: 'Aprender Zustand', completed: false },
    { id: 2, text: 'Usar React Query', completed: true },
  ];
};
