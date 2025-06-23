import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PageLayout from '../components/PageLayout';

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
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
      </div>
    </PageLayout>
  );
};

export default Home; 