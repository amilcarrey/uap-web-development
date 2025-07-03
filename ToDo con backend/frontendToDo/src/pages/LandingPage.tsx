import React from "react";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue  -100 to-white">
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Bienvenido a <span className="text-blue-500">Atareado</span>
        </h1>
        <p className="mb-8 text-gray-600">
          La forma más simple de organizar tus tareas y tableros.
        </p>
        <div className="flex gap-4">
          <Link to="/login">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition font-semibold">
              Iniciar sesión
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition font-semibold">
              Registrarse
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
