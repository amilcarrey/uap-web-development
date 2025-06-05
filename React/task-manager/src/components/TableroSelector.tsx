import { Link } from "@tanstack/react-router";
import { useConfigStore } from "../store/configStore";
import { boardRoute } from "../router";

const tableros = ["default", "personal", "trabajo"];

export function TableroSelector() {
  const board = useConfigStore((s) => s.board);

  return (
    <div className="flex gap-2 mb-4 justify-center">
      {tableros.map((nombre) => (
        <Link
          key={nombre}
          to={boardRoute.to}
            params={{ boardId: nombre }}
          
          className={`px-4 py-2 rounded-full font-medium border transition ${
            board === nombre
              ? "bg-pink-400 text-white border-pink-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {nombre}
        </Link>
      ))}
    </div>
  );
}
