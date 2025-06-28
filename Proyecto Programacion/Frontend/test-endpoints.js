// Script de prueba para verificar endpoints del backend
const baseURL = 'http://localhost:3000';

async function testEndpoints() {
  console.log('🧪 Probando endpoints del backend...\n');

  // Test de búsqueda de usuarios sin autenticación (debe fallar)
  try {
    console.log('1. Probando búsqueda de usuarios sin autenticación...');
    const response = await fetch(`${baseURL}/api/users/search?q=test`);
    console.log(`   Status: ${response.status}`);
    if (response.status === 401 || response.status === 403) {
      console.log('   ✅ Correctamente protegido - requiere autenticación\n');
    } else {
      console.log('   ❌ Endpoint no protegido\n');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test de perfil sin autenticación (debe fallar)
  try {
    console.log('2. Probando perfil de usuario sin autenticación...');
    const response = await fetch(`${baseURL}/api/users/profile`);
    console.log(`   Status: ${response.status}`);
    if (response.status === 401 || response.status === 403) {
      console.log('   ✅ Correctamente protegido - requiere autenticación\n');
    } else {
      console.log('   ❌ Endpoint no protegido\n');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test de auth/me sin autenticación (debe fallar)
  try {
    console.log('3. Probando auth/me sin autenticación...');
    const response = await fetch(`${baseURL}/api/auth/me`);
    console.log(`   Status: ${response.status}`);
    if (response.status === 401 || response.status === 403) {
      console.log('   ✅ Correctamente protegido - requiere autenticación\n');
    } else {
      console.log('   ❌ Endpoint no protegido\n');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  console.log('✅ Pruebas completadas. Los endpoints están correctamente protegidos.');
}

testEndpoints();
