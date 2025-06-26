import { useState } from 'react';
import { useLogin, useRegister } from '../hooks/useAuthUser';
import { useModalStore } from '../store/modalStore'; 

export default function Login() {
  // Estados para Login
    // aca manejamos el login  datos que le vamos a pasar al hook de login para enviar al backend
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para Modal de Registro, aca se manejan los datos del registro 
  // es lo que le vamos a pasar al hook de registro para enviar al backend
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Hooks para Login y Registro
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  // Manejar Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await loginMutation.mutateAsync({ email, password });
      useModalStore.getState().openModal('¡Bienvenido!', 'success'); 
      setTimeout(() => {
        window.location.href = '/settings';
      }, 1000);
    } catch (error) {
      useModalStore.getState().openModal( 
        error instanceof Error ? error.message : 'Error en login', 
        'error'
      );
    }
  };

  // Manejar Registro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (registerPassword !== confirmPassword) {
      useModalStore.getState().openModal('Las contraseñas no coinciden', 'error'); 
      return;
    }

    if (registerPassword.length < 6) {
      useModalStore.getState().openModal('La contraseña debe tener al menos 6 caracteres', 'error'); 
      return;
    }
    
    try {
      await registerMutation.mutateAsync({ 
        email: registerEmail, 
        password: registerPassword 
      });
      useModalStore.getState().openModal('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.', 'success'); 
      
      // Cerrar modal y limpiar formulario
      setShowRegisterModal(false);
      setRegisterEmail(''); 
      setRegisterPassword('');
      setConfirmPassword('');
    } catch (error) {
      useModalStore.getState().openModal( 
        error instanceof Error ? error.message : 'Error en registro', 
        'error'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 relative">
      
      {/* Formulario de Login */}
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg"> 
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            📋 TaskManager
          </h2>
          <p className="mt-2 text-gray-600">Inicia sesión en tu cuenta</p>
        </div>

        {/* Formulario Login */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="tu@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)} // son de estado local y despues es lo que le vamos a pasar a los hooks para que manden al back
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Tu contraseña"
              />
            </div>
          </div>

          {/* Botón Login */}
          <div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {loginMutation.isPending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>

          {/* Botón Registro */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:underline transition-colors"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </form>
      </div>

      {/* Modal de Registro - Igual que tus otros modales */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Crear Nueva Cuenta
              </h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Formulario Registro */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Register Email */}
              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="register-email"
                  name="registerEmail"
                  type="email"
                  required
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Register Password */}
              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <input
                  id="register-password"
                  name="registerPassword"
                  type="password"
                  required
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirmar Contraseña
                </label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Repite tu contraseña"
                />
              </div>

              {/* Botones Modal - Mismos estilos que TaskManager */}
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                >
                  {registerMutation.isPending ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creando...
                    </span>
                  ) : (
                    'Crear Cuenta'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}