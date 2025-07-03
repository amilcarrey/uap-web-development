export default function LandingPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-50 px-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center">¡Bienvenida al Gestor de Tareas!</h1>
      <p className="mt-2 text-gray-600 text-center">Iniciá sesión o registrate para comenzar.</p>

      <div className="mt-6 flex gap-4">
        <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Iniciar sesión
        </a>
        <a href="/register" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          Registrarse
        </a>
      </div>
    </div>
  );
}
