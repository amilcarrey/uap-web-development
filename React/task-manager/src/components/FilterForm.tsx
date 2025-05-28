// type FilterFormProps = {
//   filtro: string;
//   setFiltro: (value: string) => void;
// };

// export function FilterForm({
//   filtro,
//   setFiltro,
// }: FilterFormProps) {
//   return (
//     <form className="flex flex-col sm:flex-row w-full justify-between gap-2">
//       <select
//         className="border border-gray-300 rounded-md p-2"
//         value={filtro}
//         onChange={(e) => setFiltro(e.target.value)}
//       >
//         <option value="todas">Todas</option>
//         <option value="completadas">Completadas</option>
//         <option value="incompletas">Incompletas</option>
//       </select>
//     </form>
//   );
// }

type FilterFormProps = {
  filtro: string;
  setFiltro: (val: string) => void;
};

export function FilterForm({ filtro, setFiltro }: FilterFormProps) {
  const base =
    "px-6 py-2 rounded-full font-bold transition-colors select-none text-sm";
  return (
    <div className="flex justify-center gap-3">
      <button
        className={`${base} ${
          filtro === "todas"
            ? "bg-green-300 text-white"
            : "bg-gray-100 text-slate-800"
        }`}
        onClick={() => setFiltro("todas")}
      >
        All
      </button>
      <button
        className={`${base} ${
          filtro === "incompletas"
            ? "bg-green-300 text-white"
            : "bg-gray-100 text-slate-800"
        }`}
        onClick={() => setFiltro("incompletas")}
      >
        Incomplete
      </button>
      <button
        className={`${base} ${
          filtro === "completadas"
            ? "bg-green-300 text-white"
            : "bg-gray-100 text-slate-800"
        }`}
        onClick={() => setFiltro("completadas")}
      >
        Completed
      </button>
    </div>
  );
}
