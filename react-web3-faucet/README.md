# React Web3 Faucet (Sepolia)

Aplicacion de ejemplo que combina un frontend React (Vite + Wagmi) con un backend Express que actua como intermediario seguro frente al contrato FaucetToken desplegado en Sepolia.

- Autenticacion **Sign-In with Ethereum (SIWE)** y sesion con JWT.
- El frontend nunca envia transacciones directas; todo pasa por el backend.
- El backend firma con una clave privada dedicada y expone endpoints protegidos.
- Solo se permite la red Sepolia para evitar gastos reales.

## Requisitos

- Node.js 18 o superior.
- Una wallet EVM (MetaMask u otra compatible) configurada para Sepolia.
- ETH de prueba para pagar gas en la cuenta del backend.

## Instalacion rapida

```bash
npm install
```

## Variables de entorno

Duplica `.env.example` en `.env` y ajusta los valores:

- `VITE_API_URL` apunta al backend (por defecto `http://localhost:4000`).
- `PRIVATE_KEY` clave privada de la cuenta que firmara las transacciones.
- `JWT_SECRET` secreto para firmar los tokens.
- `RPC_URL` RPC de Sepolia.
- `CONTRACT_ADDRESS` direccion del FaucetToken.
- `FRONTEND_URL` URL publica del frontend (usada para SIWE).
- `CORS_ORIGINS` lista de origenes permitidos (coma separada).

La cuenta configurada en `PRIVATE_KEY` debe tener ETH de prueba para cubrir gas al interactuar con el contrato.

## Scripts utiles

```bash
npm run server:dev   # Inicia el backend Express
npm run dev          # Inicia el frontend Vite
npm run build        # Compila el frontend
```

## Arquitectura

1. El frontend pide un mensaje SIWE a `/auth/message` y lo firma con la wallet del usuario.
2. El backend valida la firma en `/auth/signin`, emite un JWT y lo devuelve.
3. El frontend guarda el JWT y lo usa en las peticiones protegidas:
   - `POST /faucet/claim` reclama tokens a traves del backend.
   - `GET /faucet/status/:address` devuelve estado, balance y usuarios.
   - `GET /faucet/info` expone nombre, simbolo, decimales y monto del faucet.

Si el JWT caduca o no coincide con la direccion autenticada, el backend responde 401/403 y el frontend elimina la sesion.

## Estructura de carpetas

- `src/` componentes React, contexto de autenticacion, utilidades.
- `src/api/client.ts` cliente ligero para consumir el backend.
- `server/` backend Express con SIWE y llamadas al contrato mediante Viem.

## Notas

- Las rutas protegidas requieren cabecera `Authorization: Bearer <jwt>`.
- Los mensajes SIWE caducan a los 5 minutos si no se utilizan.
- Solo se acepta `chainId` 11155111 (Sepolia). Cualquier otra red es rechazada.
- El backend espera que la cuenta configurada sea la que ejecuta `claimTokens`.

