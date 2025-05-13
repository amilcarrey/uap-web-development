interface Tarea {
    id: number;
    texto: string;
    completada: boolean;
}

let tareas: Tarea[] = [];

export const getTareas = async () => {
    return tareas;
}

export const addTarea = async (texto: string) => {
    const tarea: Tarea = {
        id: Math.floor(Math.random() * 1000),
        texto,
        completada: false,
    };
    tareas.push(tarea);
    return tarea;
}

export const updateTarea = async (id: number, completada: boolean) => {
    const tarea = tareas.find(t => t.id === id);
    if (!tarea) {
        throw new Error("Tarea no encontrada");
    }
    tarea.completada = completada;
    return tarea;
}

export const deleteTarea = async (id: number) => {
    tareas = tareas.filter(t => t.id !== id);
    return tareas;
}

