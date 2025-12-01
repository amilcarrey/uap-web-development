const API_BASE_URL = 'http://localhost:3001/api';

// Axios configurado para cookies HTTP-only
import axios from 'axios';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enviar cookies automáticamente
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Variable para prevenir redirecciones múltiples
let isRedirecting = false;

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // ✅ Solo redirigir en casos específicos y evitar loops
        if (error.response?.status === 401 && !isRedirecting) {
        const currentPath = window.location.pathname;
        
        // ✅ Solo redirigir si NO estamos ya en login/register
        if (currentPath !== '/login' && currentPath !== '/register') {
            console.log('🔄 Redirecting to login due to 401');
            isRedirecting = true;
            
            setTimeout(() => {
            window.location.href = '/login';
            }, 100);
        }
        }
        
        return Promise.reject(error);
    }
);

// ✅ Reset flag cuando la URL cambia
api.interceptors.request.use((config) => {
    isRedirecting = false;
    return config;
});

export default api;