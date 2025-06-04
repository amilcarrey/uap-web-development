import { Link,useNavigate } from "@tanstack/react-router";
import { useBoardStore } from "../stores/useBoardStore";

type HeaderProps = {
  boardId?: string;
};

export default function Header({ boardId }: HeaderProps) {
  const { boards, addBoard, removeBoard } = useBoardStore();
  const navigate = useNavigate();

  return (
    <header className="w-full text-center p-6 bg-gray-800 text-white rounded-b-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-4">Gestor de Tareas</h1>
      <div className="flex justify-around items-center gap-6">
        <div className="flex justify-between items-center gap-4">

       

        {boards.map((board) => (
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
            if (name) addBoard(name);
          }}
          className="text-lg text-blue-400 hover:text-blue-600 transition">
            +
        </button>
        {boardId && (
          <button
            onClick={() => {removeBoard(boardId)
              navigate({to:"/"}); // Redirigir a la página principal después de eliminar
              
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
