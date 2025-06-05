type Props = {
  filtro: string;
  onChange: (filtro: string) => void;
};

export default function Filters({ filtro, onChange }: Props) {
  return (
    <div className="flex text-blue-600 gap-4 my-1 justify-center">
      {["all", "active", "completed"].map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-3 py-1 ${
            filtro === f ? "font-bold text-blue-600 border-b-2 border-blue-600" : ""
          }`}
        >
          {f === "all" ? "Todas" : f === "active" ? "Activas" : "Completadas"}
        </button>
      ))}
    </div>
  );
}
