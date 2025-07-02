// Archivo de prueba para verificar que apiUrl funciona correctamente
import { apiUrl, API_BASE_URL } from './src/utils/api.js';

console.log('🔧 Testing API URL configuration...');
console.log('API_BASE_URL:', API_BASE_URL);
console.log('apiUrl("/api/test"):', apiUrl('/api/test'));
console.log('✅ API URL configuration is working correctly');
