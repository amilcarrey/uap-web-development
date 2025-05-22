import type { Tarea } from "../types";

type TareaListProps = {
  tareas: Tarea[];
  toggleTarea: (index: number) => void;
  eliminarTarea: (index: number) => void;
};

// export function TareaList({ tareas, toggleTarea, eliminarTarea }: TareaListProps) {
//   if (tareas.length === 0) {
//     return <p className="text-gray-500 text-center">No hay tareas</p>;
//   }

//   return (
//     <ul className="space-y-2">
//       {tareas.map((tarea, index) => (
//         <li
//           key={index}
//           className="flex justify-between items-center border border-gray-200 rounded-md p-2"
//         >
//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={tarea.completada}
//               onChange={() => toggleTarea(index)}
//             />
//             <span
//               className={`${
//                 tarea.completada ? "line-through text-gray-400" : ""
//               }`}
//             >
//               {tarea.texto}
//             </span>
//           </div>
//           <button
//             onClick={() => eliminarTarea(index)}
//             className="text-red-500 text-sm hover:underline"
//           >
//             Eliminar
//           </button>
//         </li>
//       ))}
//     </ul>
//   );
// }
export function TareaList({ tareas, toggleTarea, eliminarTarea }: TareaListProps) {
  if (!tareas.length) return <p className="text-gray-500 text-center">No hay tareas</p>;

  return (
    <ul className="space-y-2">
      {tareas.map((t, i) => (
        <li key={i} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
          {/* toggle */}
          <button
            onClick={() => toggleTarea(i)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold
                       bg-pink-300 hover:bg-pink-400 transition"
          >
            {t.completada ? "✓" : "○"}
          </button>

          <span
            className={`flex-1 mx-4 text-lg ${
              t.completada ? "line-through text-gray-400" : ""
            }`}
          >
            {t.texto}
          </span>

          {/* delete */}
          <button
            onClick={() => eliminarTarea(i)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold
                       bg-pink-300 hover:bg-pink-400 transition"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
