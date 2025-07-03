import axios from 'axios';
import { type Board } from '../types/types';

export const createBoard = async (data: { title: string; description?: string }) => {
  const response = await axios.post('http://localhost:3000/api/boards', data, { withCredentials: true });
  return response.data.board as Board;
};

export const getBoards = async () => {
  const response = await axios.get('http://localhost:3000/api/boards', { withCredentials: true });
  return response.data.boards as Board[];
};