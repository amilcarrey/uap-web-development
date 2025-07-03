import axios from 'axios';

// Configuración de la instancia de Axios para las peticiones a la API
const api = axios.create({
    baseURL: 'http://localhost:3001/api', 
    withCredentials: true, // Para enviar cookies HTTP-only en las solicitudes
});

export default api;
