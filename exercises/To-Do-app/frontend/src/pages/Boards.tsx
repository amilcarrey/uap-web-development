import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createBoard, getBoards } from '../services/boardService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Boards = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ title: '', description: '' });

  const { data: boards, isLoading } = useQuery({
    queryKey: ['boards'],
    queryFn: getBoards,
    enabled: !!user,
  });

  const createBoardMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['boards'] }),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBoardMutation.mutateAsync(formData);
      setFormData({ title: '', description: '' });
    } catch (error) {
      console.error('Error al crear el tablero:', error);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Mis Tableros</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div className="form-group">
          <label>Título</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <button type="submit" disabled={createBoardMutation.isPending} className="btn">
          {createBoardMutation.isPending ? 'Creando...' : 'Crear Tablero'}
        </button>
      </form>
      {isLoading ? (
        <p>Cargando tableros...</p>
      ) : (
        <div className="board-grid">
          {boards?.map((board) => (
            <div
              key={board.id}
              className="board-card"
              onClick={() => navigate(`/boards/${board.id}`)}
            >
              <h3>{board.title}</h3>
              <p>{board.description || 'Sin descripción'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}