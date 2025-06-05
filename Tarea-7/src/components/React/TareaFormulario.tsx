import React, { useState } from 'react'

interface Props {
  onAgregar: (content: string) => void
}

export default function FormularioTarea({ onAgregar }: Props) {
  const [input, setInput] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    onAgregar(input.trim())
    setInput('')
  }

  return (
    <form onSubmit={submit}>
      <input
        placeholder="Nueva tarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit">Agregar</button>
    </form>
  )
}
