// src/pages/LandingPage.tsx
export default function LandingPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">¡Bienvenida al Gestor de Tareas!</h1>
      <p className="mt-2 text-gray-600">Iniciá sesión o registrate para comenzar.</p>

      <div className="mt-4 flex gap-4">
        <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded">Iniciar sesión</a>
        <a href="/register" className="bg-green-600 text-white px-4 py-2 rounded">Registrarse</a>
      </div>
    </div>
  );
}
