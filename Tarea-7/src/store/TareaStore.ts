import { create } from 'zustand'
import type { Tarea } from '../types/tarea'

interface TareaState {
  tareas: Tarea[]
  fetchTareas: () => Promise<void>
  addTarea: (content: string) => Promise<void>
  toggleTarea: (id: number) => Promise<void>
  eliminarTarea: (id: number) => Promise<void>
  clearCompletadas: () => Promise<void>
}

export const useTareaStore = create<TareaState>((set, get) => ({
  tareas: [],

  fetchTareas: async () => {
    const res = await fetch('/api/tareas')
    if (!res.ok) return
    const data: Tarea[] = await res.json()
    set({ tareas: data })
  },

  addTarea: async (content) => {
    const res = await fetch('/api/tareas', {
      method: 'POST',
      body: JSON.stringify({ content }),
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) get().fetchTareas()
  },

  toggleTarea: async (id) => {
    const tarea = get().tareas.find(t => t.id === id)
    if (!tarea) return

    const res = await fetch(`/api/tareas/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed: !tarea.completed }),
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) get().fetchTareas()
  },

  eliminarTarea: async (id) => {
    const res = await fetch(`/api/tareas/${id}`, {
      method: 'DELETE',
    })
    if (res.ok) get().fetchTareas()
  },

  clearCompletadas: async () => {
    const completadas = get().tareas.filter(t => t.completed)
    await Promise.all(completadas.map(t =>
      fetch(`/api/tareas/${t.id}`, { method: 'DELETE' })
    ))
    get().fetchTareas()
  },
}))
