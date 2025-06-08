export type Task = {
  id: number
  task_content: string
  completed: boolean
}

export type Board = {
  id: string
  name: string
  tasks: Task[]
  nextTaskId: number
}

export const state: { boards: Board[] } = {
  boards: [
    {
      id: 'default',
      name: 'Mi tablero',
      tasks: [],
      nextTaskId: 1,
    },
  ],
}