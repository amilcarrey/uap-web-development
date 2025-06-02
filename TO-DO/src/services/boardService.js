const API_URL = 'http://localhost:3000/api'

export const getBoards = async () => {
  const response = await fetch(`${API_URL}/boards`)
  if (!response.ok) throw new Error('Error al obtener los tableros')
  return response.json()
}

export const getBoard = async (boardId) => {
  const response = await fetch(`${API_URL}/boards/${boardId}`)
  if (!response.ok) throw new Error('Error al obtener el tablero')
  return response.json()
}

export const createBoard = async (boardData) => {
  const response = await fetch(`${API_URL}/boards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(boardData),
  })
  if (!response.ok) throw new Error('Error al crear el tablero')
  return response.json()
}

export const updateBoard = async (boardId, boardData) => {
  const response = await fetch(`${API_URL}/boards/${boardId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(boardData),
  })
  if (!response.ok) throw new Error('Error al actualizar el tablero')
  return response.json()
}

export const deleteBoard = async (boardId) => {
  const response = await fetch(`${API_URL}/boards/${boardId}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Error al eliminar el tablero')
  return response.json()
} 