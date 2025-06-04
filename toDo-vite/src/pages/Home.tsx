import { Link } from "@tanstack/react-router";
import { useBoardStore } from "../stores/useBoardStore";

import { boardRoute } from "../routes"; 

export default function Home() {
  const { boards, addBoard } = useBoardStore();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Mis tableros</h2>

      <ul className="space-y-4">
        {boards.map((board) => (
          <li key={board.id}>
            <Link
              to={boardRoute.to} params={{ boardId: board.id }}
              className="block p-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
            >
              {board.name}
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          const name = prompt("Nombre del nuevo tablero:");
          if (name) addBoard(name);
        }}
        className="mt-6 block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
      >
        + 
      </button>
    </div>
  );
}
