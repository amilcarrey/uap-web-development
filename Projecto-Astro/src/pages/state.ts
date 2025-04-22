export type Task = {
    id: number;
    name: string;
    completed: boolean;
}

export const state = {
    tasks: [] as Task[],
    nextId: 1,
    filter: 'all'
}