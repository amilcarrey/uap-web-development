import { useState } from 'react'

type Props = {
  onAgregar: (texto: string) => void
}

export default function NuevoMensajeForm({ onAgregar }: Props) {
  const [texto, setTexto] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (texto.trim()) {
      onAgregar(texto)
      setTexto('')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center rounded-full overflow-hidden shadow-sm"
    >
      <input
        value={texto}
        onChange={e => setTexto(e.target.value)}
        placeholder="Nueva tarea"
        className="flex-1 px-4 py-2 text-black bg-white outline-none"
      />
      <button
        type="submit"
        className="px-4 py-2 text-white bg-green-500 hover:bg-green-600 transition-colors"
      >
        Agregar
      </button>
    </form>
  )
}
