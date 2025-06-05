import { Link } from "react-router";

export const ConfigPage = () => {
  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <header className="bg-blend-hue text-white p-4 text-center shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="text-blue-400">Atareado</span>.com
          </h1>
        </div>
      </header>
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Configuración</h2>
        <p>Aquí puedes ajustar la configuración de tu aplicación.</p>
      </div>
      <div className="max-w-6xl mx-auto p-4">
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
        >
          Volver a la página principal
        </Link>
      </div>
    </div>
  );
};
