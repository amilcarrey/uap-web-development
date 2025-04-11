import { state } from "../services/state";
import type { Task } from "../services/state";


export function addTask(name: string) {
    const newTask: Task ={
        id:crypto.randomUUID(),
        name,
        completed: false,

    };
    state.tasks.push(newTask);
}

export function deleteTask(id: string) {
    state.tasks = state.tasks.filter(task => task.id !== id);
}

export function completeTask(id: string) {
    const task = state.tasks.find(task => task.id === id);
    if (task) task.completed = !task.completed;
}

export function clearCompletedTasks() {
    state.tasks = state.tasks.filter(task => !task.completed);
}

export function getTasksFiltered(filter: string | null) {
    if (filter === "completed") return state.tasks.filter(t => t.completed);
    if (filter === "incompleted") return state.tasks.filter(t => !t.completed);
    return state.tasks;
}
