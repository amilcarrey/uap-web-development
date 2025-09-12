'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

/**
 * Componente de menú desplegable de usuario
 * Muestra diferentes opciones según el estado de autenticación
 */
export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Verificar estado de autenticación usando cookies
  useEffect(() => {
    // Marcar como montado para evitar hidratación mismatch
    setMounted(true);
    
    // Verificar autenticación mediante cookie
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include' // Incluir cookies
        });
        
        setIsAuthenticated(response.ok);
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    
    // Escuchar eventos personalizados de login/logout
    const handleAuthChange = () => checkAuth();
    window.addEventListener('userLogin', handleAuthChange);
    window.addEventListener('userLogout', handleAuthChange);
    
    return () => {
      window.removeEventListener('userLogin', handleAuthChange);
      window.removeEventListener('userLogout', handleAuthChange);
    };
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = async () => {
    try {
      // Llamar al endpoint de logout
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include' // Incluir cookies
      });
      
      if (response.ok) {
        // Actualizar estado local
        setIsAuthenticated(false);
        setIsOpen(false);
        
        // Disparar evento personalizado para notificar el logout
        window.dispatchEvent(new CustomEvent('userLogout'));
        
        // Mostrar mensaje de confirmación
        alert('Sesión cerrada exitosamente');
        
        // Recargar la página para limpiar cualquier estado residual
        window.location.reload();
      } else {
        throw new Error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error en logout:', error);
      alert('Error al cerrar sesión. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Botón del menú con icono de usuario */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 hover:bg-green-500 transition-all duration-300 shadow-lg"
        aria-label="Menú de usuario"
      >
        <svg 
          className="w-6 h-6 text-white" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
          />
        </svg>
      </button>

      {/* Menú desplegable */}
      {isOpen && mounted && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-green-200 py-2 z-50">
          {!isAuthenticated ? (
            // Opciones para usuarios no autenticados
            <>
              <Link
                href="/login"
                className="block px-4 py-2 text-green-800 hover:bg-green-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Iniciar Sesión
                </div>
              </Link>
              <Link
                href="/register"
                className="block px-4 py-2 text-green-800 hover:bg-green-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Registrarse
                </div>
              </Link>
            </>
          ) : (
            // Opciones para usuarios autenticados
            <>
              <div className="px-4 py-2 text-sm text-green-600 border-b border-green-100">
                Usuario conectado
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-green-800 hover:bg-green-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar Sesión
                </div>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}