import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import TaskList from "../components/TaskList";
import type { TaskFilter } from "../types";
import Header from "../components/Header";
import BoardUsers from "../components/boardUsers";
import { useSingleBoard } from "../hooks/useBoard";

export default function BoardPage() {
  const { boardId } = useParams({ from: "/board/$boardId" });
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [showUsers, setShowUsers] = useState(false);
  
  const { data: boardData, isLoading } = useSingleBoard(boardId);
  const boardName = boardData?.name || "Tablero";

  if (isLoading) {
    return (
      <>
        <Header boardId={boardId} />
        <div className="p-4 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header boardId={boardId} />
      
      <div className="relative">
        {showUsers && (
          <div className="fixed inset-0 z-10 flex justify-end">
            <div 
              className="bg-gray-800 w-80 h-full overflow-y-auto shadow-lg animate-slide-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl text-white">Gestión de usuarios</h2>
                  <button 
                    onClick={() => setShowUsers(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <BoardUsers boardId={boardId} />
              </div>
            </div>
            <div 
              className="fixed inset-0 -z-10" 
              onClick={() => setShowUsers(false)}
            ></div>
          </div>
        )}
        
        <div className="flex justify-center">
          <div className="p-4 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-white">Tablero: {boardName}</h2>
              
              <button 
                onClick={() => setShowUsers(true)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Gestionar usuarios
              </button>
            </div>

            <TaskList 
              boardId={boardId} 
              filter={filter} 
              onFilter={setFilter}
            />
          </div>
        </div>
      </div>
    </>
  );
}