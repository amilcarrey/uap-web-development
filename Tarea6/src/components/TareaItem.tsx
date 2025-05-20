import type { Tarea } from "../types/tarea";

type TareaItemProps = {
  tarea: Tarea;
  toggleComplete: () => void;
  removeItem: () => void;
};

export function TareaItem({
  tarea: { id, content, completed },
  toggleComplete,
  removeItem,
}: TareaItemProps) {
  return (
    <li
      data-id={id}
      className="w-full flex justify-between border border-gray-300 rounded-md p-2"
    >
      <p
        data-content="content"
        className={`flex-1 text-left text-xl ${
          completed ? "line-through text-gray-500" : ""
        }`}
      >
        {content}
      </p>
      <button
        className="bg-green-500 hover:bg-green-600 text-white rounded-md p-2 cursor-pointer"
        name="action"
        value="toggle"
        type="submit"
        onClick={toggleComplete}
      >
        {completed ? "Incompleta" : "Completar"}
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white rounded-md p-2 cursor-pointer"
        name="action"
        value="delete"
        type="submit"
        onClick={removeItem}
      >
        Eliminar
      </button>
    </li>
  );
}
