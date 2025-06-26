// frontend/src/api/axios.js
import axios from 'axios';

// Crea una instancia de Axios con configuraciones predeterminadas
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // URL base de tu backend
    withCredentials: true, // ¡CRUCIAL! Esto permite que las cookies (como tu token) se envíen automáticamente
});

// Opcional: Interceptores para manejar errores globales o añadir lógica
api.interceptors.response.use(
    (response) => response, // Si la respuesta es exitosa, la devuelve
    (error) => {
        // Si hay un error 401 (Unauthorized) y no es la ruta de login,
        // podrías redirigir al usuario al login.
        // Esto lo haremos mejor con un AuthContext más adelante.
        if (error.response && error.response.status === 401) {
            console.warn('Unauthorized request. User might need to log in again.');
            // En un AuthContext real, aquí harías logout y redirigirías
        }
        return Promise.reject(error); // Rechaza la promesa con el error
    }
);

export default api;