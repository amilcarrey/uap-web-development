Configuración del Proyecto - Backend & Frontend
 Describe paso a paso la instalación y configuración del proyecto de recordatorios con tableros colaborativos. Incluye backend (Express + SQL Server) y frontend (React + React Query).

 Requisitos Previos

### Backend

Node.js (v18 o superior)

SQL Server (cualquier versión compatible con drivers mssql)

Frontend

Node.js (igual que backend)

npm o yarn

Instalación del Backend

1. Clonar repositorio

cd backend

2. Instalar dependencias

npm install

3. Crear archivo .env para las variable de entorno

PORT=3000
DB_SERVER=localhost
DB_USER=tu_usuario_sql
DB_PASSWORD=tu_contraseña
DB_NAME=tpFinalProgra2
JWT_SECRET=clave_secreta_segura



4. Ejecutar servidor

npm run dev

Librerías Backend Instaladas

express: servidor HTTP

mssql: conector SQL Server

jsonwebtoken: para JWT

cookie-parser: leer cookies

dotenv: variables de entorno

cors: CORS cross-origin

uuid: generar IDs



Para instalarlas:

npm install express mssql jsonwebtoken cookie-parser dotenv cors uuid 


### Instalación del Frontend

cd frontend
npm install

Crear archivo .env en frontend/

VITE_API_BASE_URL=http://localhost:3000/api

Ejecutar servidor de desarrollo

npm run dev

### Base de Datos (Resumen)

Debes tener las siguientes tablas:

users: usuarios registrados

boards: tableros

permissions: control de acceso (viewer, full_access, owner)

reminders: recordatorios por tablero

user_settings: configuraciones por usuario


 ### Seguridad

* Las sesiones se mantienen mediante cookies HTTP-only (JWT).
* La autenticación se maneja con middleware `authWithCookiesMiddleware`.
* La autorización se controla con `requirePermission(level)`.
* El frontend valida estado de sesión automáticamente y redirige según permisos.
* Todas las rutas sensibles requieren autenticación.

