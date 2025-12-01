
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, isLoading, isAuthenticated } = useAuth();

    // ✅ Mostrar loading mientras verifica autenticación
    if (isLoading) {
        return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking authentication...</p>
            </div>
        </div>
        );
    }

    // ✅ Solo redirigir después de verificar completamente
    if (!isAuthenticated || !user) {
        console.log('🔄 ProtectedRoute: Redirecting to login');
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};