// import { useState } from "react";

// type NuevaTareaFormProps = {
//   agregarTarea: (texto: string) => void;
// };

// export function NuevaTareaForm({ agregarTarea }: NuevaTareaFormProps) {
//   const [texto, setTexto] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const limpio = texto.trim();
//     if (limpio.length === 0) return;
//     await agregarTarea(limpio);
//     setTexto("");
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex w-full gap-2">
//       <input
//         className="border border-gray-300 rounded-md p-2 flex-1"
//         type="text"
//         placeholder="Nueva tarea"
//         value={texto}
//         onChange={(e) => setTexto(e.target.value)}
//       />
//       <button
//         type="submit"
//         className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
//       >
//         Agregar
//       </button>
//     </form>
//   );
// }

import { useState } from "react";

type NuevaTareaFormProps = {
  agregarTarea: (texto: string) => void;
};

export function NuevaTareaForm({ agregarTarea }: NuevaTareaFormProps) {
  const [texto, setTexto] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = texto.trim();
    if (!limpio) return;
    await agregarTarea(limpio);
    setTexto("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      {/* input redondeado, placeholder gris claro */}
      <input
        type="text"
        placeholder="What do you need to do?"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        className="flex-1 rounded-full border border-gray-300 px-6 py-3 text-lg
                   placeholder-gray-400 focus:outline-none focus:border-pink-300"
      />

      {/* botón azul pastel */}
      <button
        type="submit"
        className="bg-blue-300 hover:bg-blue-400 text-white font-bold
                   rounded-full px-6 py-3 transition-colors"
      >
        ADD
      </button>
    </form>
  );
}
