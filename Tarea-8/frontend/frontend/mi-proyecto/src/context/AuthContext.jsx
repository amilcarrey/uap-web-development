// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios'; // Importa la instancia de Axios configurada
import Cookies from 'js-cookie'; // Para manejar cookies directamente si es necesario

// Crea el contexto de autenticación
const AuthContext = createContext(null);

// Crea un hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Almacena los datos del usuario (id, username, email)
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación
    const [loading, setLoading] = useState(true); // Para saber si estamos cargando la sesión inicial

    // Función para el login
    const login = async (email, password) => {
        try {
            setLoading(true);
            const res = await api.post('/auth/login', { email, password });
            // El backend setea una cookie HTTP-only.
            setUser(res.data.user); // Guardamos los datos del usuario del backend
            setIsAuthenticated(true);
            setLoading(false);
            return res.data.user; // Devolvemos los datos del usuario si es exitoso
        } catch (err) {
            setLoading(false);
            // Asegúrate de limpiar la sesión si el login falla por alguna razón
            setUser(null);
            setIsAuthenticated(false);
            throw err; // Re-lanza el error para que el componente lo maneje
        }
    };

    // Función para el registro
    const register = async (username, email, password) => {
        try {
            setLoading(true);
            const res = await api.post('/auth/register', { username, email, password });
            setUser(res.data.user); // Guardamos los datos del usuario del backend
            setIsAuthenticated(true);
            setLoading(false);
            return res.data.user; // Devolvemos los datos del usuario si es exitoso
        } catch (err) {
            setLoading(false);
            // Asegúrate de limpiar la sesión si el registro falla por alguna razón
            setUser(null);
            setIsAuthenticated(false);
            throw err;
        }
    };

    // Función para el logout
    const logout = async () => {
        try {
            await api.post('/auth/logout'); // Llama al endpoint de logout del backend
            setUser(null);
            setIsAuthenticated(false);
            // js-cookie no es estrictamente necesario para httpOnly,
            // pero si tuvieras otras cookies que no fueran httpOnly, las borrarías aquí.
            // Para la cookie 'token' httpOnly, el backend ya la invalida.
        } catch (err) {
            console.error('Error logging out:', err);
        } finally {
            setLoading(false);
        }
    };

    // MODIFICACIÓN CRÍTICA AQUÍ: useEffect para verificar el estado de la sesión al cargar la app
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                setLoading(true);
                // Hacer una petición a /api/auth/me para verificar la sesión
                const res = await api.get('/auth/me'); // Este endpoint verifica la cookie HTTP-only
                setUser(res.data.user);
                setIsAuthenticated(true);
                console.log("Sesión persistente encontrada para:", res.data.user.username); // Debugging
            } catch (error) {
                // Si /auth/me falla (ej. 401 Unauthorized por cookie expirada/inexistente)
                console.warn('No active session found or session expired.', error.response?.data?.message || error.message);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []); // El array de dependencias vacío asegura que se ejecuta solo una vez al montar

    const authContextValue = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        setUser // Para poder actualizar el usuario desde fuera si es necesario
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};