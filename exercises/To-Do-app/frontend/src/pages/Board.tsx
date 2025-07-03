import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask } from '../services/taskService';
import { getBoardUsers, addUserToBoard } from '../services/boardUserService';
import { useAuth } from '../hooks/useAuth';

export const Board = () => {
  const { id } = useParams<{ id: string }>();
  const boardId = parseInt(id || '0');
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [taskFormData, setTaskFormData] = useState({ title: '', description: '', status: 'pending' as 'pending' | 'in_progress' | 'done' });
  const [userFormData, setUserFormData] = useState({ userId: '', role: 'viewer' as 'owner' | 'editor' | 'viewer' });

  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ['tasks', boardId],
    queryFn: () => getTasks(boardId),
    enabled: !!user,
  });

  const { data: boardUsers, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['boardUsers', boardId],
    queryFn: () => getBoardUsers(boardId),
    enabled: !!user,
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: { title: string; description?: string; status: 'pending' | 'in_progress' | 'done' }) => createTask(boardId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', boardId] }),
  });

  const addUserMutation = useMutation({
    mutationFn: (data: { userId: number; role: 'owner' | 'editor' | 'viewer' }) => addUserToBoard(boardId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['boardUsers', boardId] }),
  });

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTaskMutation.mutateAsync(taskFormData);
      setTaskFormData({ title: '', description: '', status: 'pending' });
    } catch (error) {
      console.error('Error al crear la tarea:', error);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addUserMutation.mutateAsync({ userId: parseInt(userFormData.userId), role: userFormData.role });
      setUserFormData({ userId: '', role: 'viewer' });
    } catch (error) {
      console.error('Error al añadir usuario:', error);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (tasksLoading || usersLoading) {
    return <p>Cargando...</p>;
  }

  if (tasksError || usersError) {
    return <p style={{ color: 'red' }}>{(tasksError || usersError)?.message || 'Error al cargar los datos'}</p>;
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Tablero {id}</h2>

      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Tareas</h3>
      <form onSubmit={handleTaskSubmit} style={{ marginBottom: '2rem' }}>
        <div className="form-group">
          <label>Título</label>
          <input
            type="text"
            value={taskFormData.title}
            onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <input
            type="text"
            value={taskFormData.description}
            onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Estado</label>
          <select
            value={taskFormData.status}
            onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value as 'pending' | 'in_progress' | 'done' })}
          >
            <option value="pending">Pendiente</option>
            <option value="in_progress">En progreso</option>
            <option value="done">Completada</option>
          </select>
        </div>
        <button type="submit" disabled={createTaskMutation.isPending} className="btn">
          {createTaskMutation.isPending ? 'Creando...' : 'Crear Tarea'}
        </button>
      </form>

      {tasks?.length ? (
        <div className="board-grid">
          {tasks.map((task) => (
            <div key={task.id} className="board-card">
              <h3>{task.title}</h3>
              <p>{task.description || 'Sin descripción'}</p>
              <p>Estado: {task.status === 'pending' ? 'Pendiente' : task.status === 'in_progress' ? 'En progreso' : 'Completada'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay tareas en este tablero.</p>
      )}

      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', marginTop: '2rem' }}>Usuarios</h3>
      <form onSubmit={handleUserSubmit} style={{ marginBottom: '2rem' }}>
        <div className="form-group">
          <label>ID de Usuario</label>
          <input
            type="number"
            value={userFormData.userId}
            onChange={(e) => setUserFormData({ ...userFormData, userId: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Rol</label>
          <select
            value={userFormData.role}
            onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as 'owner' | 'editor' | 'viewer' })}
          >
            <option value="owner">Propietario</option>
            <option value="editor">Editor</option>
            <option value="viewer">Espectador</option>
          </select>
        </div>
        <button type="submit" disabled={addUserMutation.isPending} className="btn">
          {addUserMutation.isPending ? 'Añadiendo...' : 'Añadir Usuario'}
        </button>
      </form>

      {boardUsers?.length ? (
        <div className="board-grid">
          {boardUsers.map((boardUser) => (
            <div key={boardUser.userId} className="board-card">
              <h3>{boardUser.user.name}</h3>
              <p>Email: {boardUser.user.email}</p>
              <p>Rol: {boardUser.role === 'owner' ? 'Propietario' : boardUser.role === 'editor' ? 'Editor' : 'Espectador'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay usuarios asignados a este tablero.</p>
      )}
    </div>
  );
};