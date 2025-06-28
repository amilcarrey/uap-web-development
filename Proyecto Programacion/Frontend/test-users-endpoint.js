// Script para probar el nuevo endpoint /api/users
const baseURL = 'http://localhost:3000';

async function testUsersEndpoint() {
  console.log('🧪 Probando el nuevo endpoint /api/users...\n');

  // Test del endpoint sin autenticación (debe fallar)
  try {
    console.log('1. Probando endpoint sin autenticación...');
    const response = await fetch(`${baseURL}/api/users`);
    console.log(`   Status: ${response.status}`);
    if (response.status === 401 || response.status === 403) {
      console.log('   ✅ Correctamente protegido - requiere autenticación\n');
    } else {
      console.log('   ❌ Endpoint no protegido\n');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test de estructura de respuesta esperada
  console.log('2. Estructura de respuesta esperada:');
  console.log(`   GET ${baseURL}/api/users?limit=50&offset=0`);
  console.log('   Headers: Authorization: Bearer <token>');
  console.log('   Respuesta esperada:');
  console.log(`   {
     "users": [...],
     "total": number,
     "currentUser": { "id": number, "alias": string },
     "pagination": { "limit": number, "offset": number }
   }\n`);

  // Test de parámetros de consulta
  console.log('3. Parámetros de consulta soportados:');
  console.log('   - limit: número máximo de usuarios (por defecto 50, máximo 100)');
  console.log('   - offset: desplazamiento para paginación (por defecto 0)\n');

  console.log('✅ Para probar con autenticación, usa:');
  console.log('   curl -H "Authorization: Bearer YOUR_TOKEN" ' + baseURL + '/api/users');
  console.log('   o abre la consola del navegador tras hacer login.\n');
}

testUsersEndpoint();
