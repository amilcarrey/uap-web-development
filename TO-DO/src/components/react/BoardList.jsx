import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { getBoards, createBoard, deleteBoard } from '../../services/boardService'

const BoardList = () => {
  const [newBoardName, setNewBoardName] = useState('')
  const queryClient = useQueryClient()

  const { data: boards, isLoading } = useQuery({
    queryKey: ['boards'],
    queryFn: getBoards,
  })

  const createBoardMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      setNewBoardName('')
    },
  })

  const deleteBoardMutation = useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
    },
  })

  const handleCreateBoard = (e) => {
    e.preventDefault()
    if (newBoardName.trim()) {
      createBoardMutation.mutate({ name: newBoardName })
    }
  }

  if (isLoading) return <div>Cargando tableros...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Mis Tableros</h1>
      
      <form onSubmit={handleCreateBoard} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="Nombre del nuevo tablero"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Crear Tablero
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards?.map((board) => (
          <div
            key={board.id}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{board.name}</h2>
              <button
                onClick={() => deleteBoardMutation.mutate(board.id)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <Link
              to="/boards/$boardId"
              params={{ boardId: board.id }}
              className="block mt-4 text-blue-500 hover:text-blue-700"
            >
              Ver tareas →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BoardList 