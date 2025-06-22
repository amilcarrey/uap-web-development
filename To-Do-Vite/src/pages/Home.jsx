import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PageLayout from '../components/PageLayout';

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [sharedLink, setSharedLink] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const handleSharedLinkSubmit = (e) => {
    e.preventDefault();
    
    if (!sharedLink.trim()) {
      addToast('Por favor ingresa un enlace', 'error');
      return;
    }

    // Extraer el token del enlace
    const url = new URL(sharedLink);
    const token = url.pathname.split('/').pop();
    
    if (!token) {
      addToast('Enlace no válido', 'error');
      return;
    }

    // Navegar al tablero compartido
    navigate(`/shared/${token}`);
  };

  const extractTokenFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSharedLink(text);
    } catch (error) {
      addToast('No se pudo acceder al portapapeles', 'error');
    }
  };

  return (
    <PageLayout title={`¡Hola, ${user?.username || 'Usuario'}!`} showBackButton={false}>
      <div className="text-center">
        <p className="text-white/80 mb-8 text-lg">Bienvenido</p>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate('/boards')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Ver Tableros
          </button>
          
          {/* Botón de admin solo para luca */}
          {user?.username === 'luca' && (
            <button
              onClick={() => navigate('/admin')}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              🛠️ Dashboard Administrativo
            </button>
          )}
          
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Sección de enlaces compartidos */}
        <div className="mt-8 pt-8 border-t border-white/20">
          <h3 className="text-white font-semibold mb-4">Acceder a Tablero Compartido</h3>
          <form onSubmit={handleSharedLinkSubmit} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={sharedLink}
                onChange={(e) => setSharedLink(e.target.value)}
                placeholder="Pega aquí el enlace compartido..."
                className="flex-1 p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={extractTokenFromClipboard}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
                title="Pegar desde portapapeles"
              >
                📋
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Ver Tablero Compartido
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home; 