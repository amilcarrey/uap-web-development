import { Link } from "@tanstack/react-router";

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center mt-50 justify-center backdrop-blur-md bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-3xl shadow-lg w-[90%] max-w-3xl mx-auto p-8 flex flex-col gap-6 text-gray-500">
      <h1 className="text-4xl font-bold mb-8 text-white">Bienvenido a 2.DO</h1>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-6 py-3 rounded-lg border border-gray-300 bg-white/10 bg-gradient-to-r text-white shadow-md transition hover:scale-105 hover:bg-gray-100"
        >
          Iniciar sesión
        </Link>
        <Link
          to="/register"
          className="px-6 py-3 rounded-lg bg-black text-white border border-gray-300 shadow-md transition hover:bg-gray-900"
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
}