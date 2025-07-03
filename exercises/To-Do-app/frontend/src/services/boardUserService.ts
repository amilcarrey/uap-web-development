import axios from 'axios';
import { type BoardUser } from '../types/types';

export const getBoardUsers = async (boardId: number) => {
  const response = await axios.get(`http://localhost:3000/api/boards/${boardId}/users`, { withCredentials: true });
  return response.data.boardUsers as BoardUser[];
};

export const addUserToBoard = async (boardId: number, data: { userId: number; role: 'owner' | 'editor' | 'viewer' }) => {
  const response = await axios.post(`http://localhost:3000/api/boards/${boardId}/users`, data, { withCredentials: true });
  return response.data.boardUser as BoardUser;
};