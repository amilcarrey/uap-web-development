import React, { useState } from 'react'
import type { FormEvent } from 'react'
import { useMatch } from '@tanstack/react-router'
import { useAddTask } from '../hooks/useAddTask'
import { useConfigStore } from '../store/configStore' // ← agregamos el store

export default function AddReminderForm() {
  const {
    params: { boardId }
  } = useMatch({ from: '/boards/$boardId' })

  const [text, setText] = useState('')
  const addTaskMutation = useAddTask(boardId)

  const { uppercaseDescriptions } = useConfigStore() // ← obtenemos la config

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    const finalText = uppercaseDescriptions ? text.trim().toUpperCase() : text.trim()
    addTaskMutation.mutate({ text: finalText, boardId })
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nuevo recordatorio..."
        className="flex-1 px-3 py-1 border rounded"
      />
      <button
        type="submit"
        disabled={addTaskMutation.status === 'pending'}
        className="bg-rose-500 text-white px-4 py-1 rounded"
      >
        {addTaskMutation.status === 'pending' ? 'Agregando...' : 'Agregar'}
      </button>
      {addTaskMutation.status === 'error' && (
        <p className="text-red-500 mt-1">No se pudo agregar la tarea.</p>
      )}
    </form>
  )
}
