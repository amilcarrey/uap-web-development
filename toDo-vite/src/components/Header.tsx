export default function Header() {
  return (
    <header className="w-full text-center p-6 bg-gray-800 text-white rounded-b-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-4">Gestor de Tareas</h1>
      <div className="flex justify-center gap-6">
        <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition">
          Profesional
        </button>
        <button className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-4 py-2 rounded-xl transition">
          Personal
        </button>
      </div>
    </header>
  );
}
