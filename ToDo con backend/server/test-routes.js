// Script para probar las rutas del servidor
import fetch from "node-fetch";

const baseURL = "http://localhost:3000";

async function testRoutes() {
  console.log("🧪 Probando rutas del servidor...\n");

  // Test 1: Verificar que el servidor esté corriendo
  try {
    console.log("1. Probando conexión básica...");
    const response = await fetch(`${baseURL}/test`);
    console.log(`   Status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log(`   Respuesta: ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // Test 2: Probar la ruta de registro
  try {
    console.log("\n2. Probando ruta de registro...");
    const response = await fetch(`${baseURL}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "testuser",
        email: "test@example.com",
        password: "testpassword",
      }),
    });

    console.log(`   Status: ${response.status}`);
    const data = await response.text();
    console.log(`   Respuesta: ${data}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // Test 3: Probar una ruta que sabemos que no existe
  try {
    console.log("\n3. Probando ruta inexistente...");
    const response = await fetch(`${baseURL}/api/nonexistent`);
    console.log(`   Status: ${response.status}`);
    const data = await response.text();
    console.log(`   Respuesta: ${data}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

testRoutes();
