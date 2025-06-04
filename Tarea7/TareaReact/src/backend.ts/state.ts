export type Task = {
    id: number;
    task_content: string;
    completed: boolean;
}

export const state = {
    tasks: [] as Task[],
    nextId: 1,
    filter: 'all'
}