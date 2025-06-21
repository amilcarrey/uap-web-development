import { useRouteError, Link } from 'react-router-dom';
import { FaRegFrown, FaHome } from 'react-icons/fa';
import AnimatedBackground from './AnimatedBackground';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const statusCode = error.status || 'Error';
  const statusText = error.statusText || 'Algo salió mal';

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 text-white overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-3xl mx-auto bg-black/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/10">
        <div className="text-center">
          <FaRegFrown className="mx-auto text-7xl sm:text-9xl text-blue-300 mb-6" />

          <h1 className="text-5xl sm:text-6xl font-bold mb-2">{statusCode}</h1>
          <p className="text-xl sm:text-2xl text-white/80 mb-8">{statusText}</p>
          
          {error.data && (
            <p className="text-md sm:text-lg text-white/60 mb-8 font-mono bg-white/5 p-3 rounded-lg overflow-x-auto">
              {error.data}
            </p>
          )}

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors shadow-lg"
          >
            <FaHome />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
} 