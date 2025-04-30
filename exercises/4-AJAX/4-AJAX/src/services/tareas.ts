//src/services/tareas.ts


import type { Tarea } from "../types";

let tareas: Tarea[] = [
    {content: "tarea 1", completed: false, id: "0"},
    {content: "tarea 2", completed: false, id: "1"},
    {content: "tarea 3", completed: false, id: "2"},
];

//obtener todas las tareas

export const getTareas = (filter:string = "TODAS"): Tarea[] =>{
    switch(filter){
        case "COMPLETADAS":
            return tareas.filter((tarea) => tarea.completed);
        case "NO COMPLETADAS":
            return tareas.filter((tarea) => !tarea.completed);
        default:
            return tareas;
    }
}

export const addTarea = (content: string): Tarea => {
    const nuevaTarea: Tarea = {
        id: crypto.randomUUID(),
        content,
        completed: false,
    };

    tareas.push(nuevaTarea);
    return nuevaTarea;
};

export const completarTarea = (id: string): Tarea |undefined => {
    const tarea = tareas.find((tarea) => tarea.id === id);

    if (tarea){
        tarea.completed = !tarea.completed;
    }

    return tarea;
};


export const eliminarTarea = (id: string):boolean =>{
    const index = tareas.findIndex((tarea)=> tarea.id === id);

    if (index !== -1){
        tareas.splice(index, 1);
        return true // se pudo eliminar
    }

    return false
}

export const eliminarTareasCompletadas = () : number => {
    const tareasIniciales = tareas.length;
    tareas = tareas.filter((tarea) => !tarea.completed);

    const tareasEliminadas = tareasIniciales - tareas.length;
    return tareasEliminadas;
}