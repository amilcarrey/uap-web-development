import fs from "fs";

// Definimos interfaces para el estado y las tareas
export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export interface State {
  filter: string;
  tasks: Task[];
}

// Cargar estado desde el archivo JSON
export function loadState(): State {
  try {
    const data = fs.readFileSync("tasks.json", "utf8");
    console.log("Cargando estado desde tasks.json:", data);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error cargando el estado:", error);
    return { filter: "all", tasks: [] };
  }
}

// Estado inicial
export let state: State = loadState() || { filter: "all", tasks: [] };

// Guardar el estado en un archivo JSON
export function saveState(): void {
  fs.writeFileSync("tasks.json", JSON.stringify(state, null, 2));
  console.log("Estado guardado en tasks.json:", state.tasks);
}