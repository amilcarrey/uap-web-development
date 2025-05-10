export let tasks = [
    { id: 1, text: "Hacer la tarea", completed: false },
    { id: 2, text: "Limpiar", completed: false },
    { id: 3, text: "Hacer la compra", completed: true },
    { id: 4, text: "Hacer la comida", completed: false },
    { id: 5, text: "Hacer la cama", completed: false },
  ];
  
  // Función para agregar tareas
  export function addTask(text: string) {
    tasks.push({ id: Date.now(), text, completed: false });
    }
  // Función para eliminar tareas
  export function deleteTask(id: number) {
    tasks = tasks.filter(task => task.id !== id);
    }
  // Función cambiar estado completas o no
  export function toggleTaskCompletion(id: number) {
        tasks = tasks.map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        );
    }
  export function deleteCompletedTasks() {
  tasks = tasks.filter(task => !task.completed);
    }
    export function listarTareas(filtro?: "completadas" | "pendientes") {
        console.log("Tareas actuales:", tasks);
        if (filtro === "completadas") return tasks.filter(t => t.completed);
        if (filtro === "pendientes") return tasks.filter(t => !t.completed);
        return tasks;
      }


