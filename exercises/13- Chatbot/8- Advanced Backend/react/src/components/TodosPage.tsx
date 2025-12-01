import React from 'react';
import { useParams } from 'react-router-dom';
import { AddToDo } from './AddToDo';
import { ToDoListWithContext } from './ToDoList';
import { ClearCompletedWithContext } from './ClearCompleted';
import { SearchTodos } from './SearchTodos';
import { useAppDispatch } from '../store/hooks';
import { setCurrentBoardId } from '../store/uiSlice';
import { useEffect } from 'react';
import { ChatBot } from './ChatBot';

export const TodosPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (boardId) {
      dispatch(setCurrentBoardId(parseInt(boardId, 10)));
    }
  }, [boardId, dispatch]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Board {boardId} - Todos
        </h1>
        
        {/* Add new todo */}
        <AddToDo />
        
        {/* Search */}
        <div className="my-6">
          <SearchTodos />
        </div>
        
        {/* Todos list with filters and pagination */}
        <ToDoListWithContext />
        
        {/* Clear completed */}
        <div className="mt-6">
          <ClearCompletedWithContext />
        </div>
      </div>

      {/* ChatBot Flotante - Esquina Inferior Izquierda */}
      <ChatBot boardId={boardId ? parseInt(boardId, 10) : 0} />
    </div>
  );
};
