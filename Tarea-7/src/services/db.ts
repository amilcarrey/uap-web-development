import type { Tarea } from '../types/tarea'

let tareas: Tarea[] = [
  { id: 1, content: "Personal Work No.1", completed: false, tableroId: "default" },
  { id: 2, content: "Personal Work No.2", completed: false, tableroId: "default" },
  // más tareas iniciales...
]

let nextId = tareas.length + 1

export const db = {
  getAll: async (tableroId: string): Promise<Tarea[]> => {
    if (!tableroId) return tareas
    return tareas.filter(t => t.tableroId === tableroId)
  },

  add: async (data: Omit<Tarea, "id">): Promise<Tarea> => {
    const nuevaTarea: Tarea = { id: nextId++, ...data }
    tareas.push(nuevaTarea)
    return nuevaTarea
  },

  update: async (id: number, data: Partial<Tarea>): Promise<Tarea | null> => {
    const idx = tareas.findIndex(t => t.id === id)
    if (idx === -1) return null
    tareas[idx] = { ...tareas[idx], ...data }
    return tareas[idx]
  },

  delete: async (id: number): Promise<void> => {
    tareas = tareas.filter(t => t.id !== id)
  }
}
