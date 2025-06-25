import { Link, useNavigate } from "@tanstack/react-router";
import { useBoards, useCreateBoard, useDeleteBoard } from "../hooks/useBoard";
import { useAuth } from "../hooks/useAuth"; 
import type { Board } from "../types"; 
type HeaderProps = {
  boardId?: string;
};

export default function Header({ boardId }: HeaderProps) {
  const { data, isLoading } = useBoards();
  const { mutate: deleteBoard } = useDeleteBoard();
  const { mutate: createBoard } = useCreateBoard();
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  console.log("Headers - raw data:", data);
  console.log("Headers - boards:", data?.boards);
  

  const boards: Board[] = data?.boards || [];

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  return (
    <header className="w-full text-center p-6 bg-gray-800 text-white rounded-b-2xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Gestor de Tareas</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Hola, {user?.name}</span>
          <button 
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-600"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
      
      <div className="flex justify-around items-center gap-6">
        <div className="flex justify-between items-center gap-4">
          {boards.map((board: Board) => (
            <Link
              key={board.id}
              to={"/board/$boardId"}
              params={{ boardId: board.id }}
              className="text-lg hover:text-blue-400 transition"
            >
              {board.name}
            </Link>
          ))}
          <button
            onClick={() => {
              const name = prompt("Nombre del nuevo tablero:");
              if (name) createBoard({ name}); 
            }}
            className="text-lg text-blue-400 hover:text-blue-600 transition">
              +
          </button>
          {boardId && (
            <button
              onClick={() => {
                deleteBoard(boardId);
                navigate({ to: "/" });
              }}
              className="text-lg text-red-400 hover:text-red-600 transition"
            >
              Eliminar Tablero
            </button>
          )}
        </div>
        <Link to="/settings" className="" >⚙️</Link>
      </div>
    </header>
  );
}