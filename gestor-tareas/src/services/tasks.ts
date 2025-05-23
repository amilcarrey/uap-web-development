import type { Task } from "../types";

export const tasks: Task[] = [
    {
        id: "0",
        content: "Coordinar un masaje con el kine",
        checked: true
    }
    ,
    {
        id: "1",
        content: "Cevichito con la pipol",
        checked: false
    }
    ,
    {
        id: "2",
        content: "meter cacho",
        checked: true
    }
    ,    
    {
        id: "3",
        content: "on la pipol",
        checked: true
    }
    ,    
    {
        id: "7",
        content: "pipol",
        checked: true
    }
    ,    
    {
        id: "8",
        content: "ol",
        checked: true
    }
]


//revisar ese return
export const getTareas = (check: boolean | undefined) =>
{
    if(check === undefined) return tasks
    return tasks.filter((t) => t.checked == check);
}

export const addTarea = (content: string) =>
{
    const newTarea = {id: crypto.randomUUID(), content: content, checked: false}
    tasks.push(newTarea);
    return newTarea;
}

export const checkTarea = (id: string) =>
{
    const tarea = tasks.find((t) => t.id == id);
    if(!tarea) throw new Error();
    tarea.checked = tarea.checked == false? true : false; 
    return tarea;
}

export const deleteTarea = (id: string) =>
{
    console.log(id)
    const tarea = tasks.find((t) => t.id == id);
    console.log(tarea)
    if(!tarea) throw new Error();
    const index = tasks.indexOf(tarea);
    tasks.splice(index, 1);
    return tarea;
}


