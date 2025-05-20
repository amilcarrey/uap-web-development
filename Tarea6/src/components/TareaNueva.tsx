import { useState } from 'react'

type Props = {
  onAgregar: (texto: string) => void
}

export default function NuevoMensajeForm({ onAgregar }: Props) {
  const [texto, setTexto] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (texto.trim()) {
      onAgregar(texto.trim())
      setTexto('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="buscador">
      <input
        type="text"
        placeholder="Agregar una tarea..."
        value={texto}
        onChange={e => setTexto(e.target.value)}
      />
      <button type="submit">ADD</button>
    </form>
  )
}
