// generate-wallet.js
import { ethers } from "ethers";

console.log('🔐 Generando nueva wallet de prueba para Sepolia...\n');

// Crear wallet aleatoria
const wallet = ethers.Wallet.createRandom();

console.log('✅ Wallet creada exitosamente!\n');
console.log('================================================');
console.log('📍 ADDRESS (Dirección pública):');
console.log(wallet.address);
console.log('\n🔑 PRIVATE KEY (Clave privada):');
console.log(wallet.privateKey);
console.log('\n📝 MNEMONIC (Frase de recuperación):');
console.log(wallet.mnemonic.phrase);
console.log('================================================\n');

console.log('⚠️  IMPORTANTE:');
console.log('1. Copia la PRIVATE KEY y pégala en tu archivo .env');
console.log('2. Copia la ADDRESS para solicitar Sepolia ETH');
console.log('3. NUNCA compartas tu private key con nadie');
console.log('4. Esta wallet es SOLO para desarrollo/testing\n');