import { useState } from 'react'
import { FaPlus, FaSpinner } from 'react-icons/fa'

function TodoForm({ onAdd, placeholder = "Nueva tarea...", buttonText = "Agregar", isLoading = false, className = "" }) {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (text.trim() && !isSubmitting && !isLoading) {
      setIsSubmitting(true)
      try {
        await onAdd(text.trim())
        setText('')
      } catch (error) {
        console.error('Error adding task:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  const isDisabled = isSubmitting || isLoading || !text.trim()

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 mb-6 ${className}`}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={isSubmitting || isLoading}
        className="flex-1 p-2 rounded-lg bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button 
        type="submit"
        disabled={isDisabled}
        className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center gap-2"
      >
        {(isSubmitting || isLoading) ? (
          <>
            <FaSpinner className="animate-spin" size={14} />
            {isSubmitting ? 'Agregando...' : 'Cargando...'}
          </>
        ) : (
          <>
            <FaPlus size={14} />
            {buttonText}
          </>
        )}
      </button>
    </form>
  )
}

export default TodoForm 