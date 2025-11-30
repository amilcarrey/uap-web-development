# Tarea 8: Backend Avanzado con Autenticación y Autorización

Este proyecto implementa un backend robusto con Express.js y un frontend con React (Vite) para una aplicación de gestión de tableros y tareas, incluyendo autenticación, autorización y persistencia en base de datos PostgreSQL.

## Estructura del Proyecto

-   `/backend`: Contiene el servidor Express.js, lógica de API, modelos Sequelize, etc.
-   `/src`: Contiene el código fuente de la aplicación frontend React.
-   `.env` (raíz del proyecto): Variables de entorno para el frontend.
-   `backend/.env`: Variables de entorno para el backend.

## Prerrequisitos

-   Node.js (v18 LTS o superior recomendado)
-   npm (o yarn)
-   PostgreSQL (base de datos relacional)

## Configuración de la Base de Datos (PostgreSQL)

1.  **Instalar PostgreSQL**: Asegúrate de tener PostgreSQL instalado y corriendo en tu sistema.
2.  **Crear Base de Datos**:
    *   Conéctate a PostgreSQL (e.g., usando `psql`).
    *   Crea la base de datos principal y la de pruebas:
        ```sql
        CREATE DATABASE mydb;
        CREATE DATABASE mydb_test;
        -- Opcional: Crear un usuario específico y otorgarle permisos
        -- CREATE USER myuser WITH PASSWORD 'mypassword';
        -- GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
        -- GRANT ALL PRIVILEGES ON DATABASE mydb_test TO myuser;
        ```
    *   **Importante**: Actualiza las URLs de la base de datos en `backend/.env` si usas nombres de base de datos, usuarios o contraseñas diferentes.

## Configuración del Backend

1.  **Navegar al directorio del backend**:
    ```bash
    cd backend
    ```
2.  **Instalar dependencias**:
    ```bash
    npm install
    ```
3.  **Configurar Variables de Entorno**:
    *   Crea un archivo `.env` dentro del directorio `backend` (es decir, `backend/.env`).
    *   Copia el contenido de `backend/.env.example` (si existiera, o usa la siguiente plantilla) y ajústalo a tu configuración local:
        ```env
        # backend/.env
        PORT=3001
        NODE_ENV=development

        # PostgreSQL Connection URL
        # Format: postgresql://[user[:password]@][host][:port]/[database_name]
        DATABASE_URL=postgresql://user:password@localhost:5432/mydb
        DATABASE_URL_TEST=postgresql://user:password@localhost:5432/mydb_test # Para pruebas futuras

        # JWT Secrets
        JWT_SECRET=tu_super_secreto_jwt_aqui # Cambia esto por una cadena aleatoria y segura
        JWT_EXPIRES_IN=1d # Ejemplo: 1 día
        COOKIE_SECRET=tu_super_secreto_cookie_aqui # Cambia esto por otra cadena aleatoria y segura
        COOKIE_EXPIRES_IN_DAYS=1

        # Frontend URL (para CORS)
        FRONTEND_URL=http://localhost:3000 # O el puerto que use tu frontend
        ```
    *   **Nota**: Reemplaza `user`, `password`, `localhost`, `5432`, `mydb`, `mydb_test` según tu configuración de PostgreSQL.
    *   Genera secretos seguros para `JWT_SECRET` y `COOKIE_SECRET`.

4.  **Ejecutar Migraciones de Base de Datos**:
    *   Desde el directorio `backend`, ejecuta:
        ```bash
        npm run db:migrate
        ```
    *   Esto creará todas las tablas necesarias en tu base de datos `mydb`.

5.  **Iniciar el Servidor Backend**:
    *   Para desarrollo con Nodemon (recarga automática):
        ```bash
        npm run dev
        ```
    *   Para producción:
        ```bash
        npm start
        ```
    *   El backend debería estar corriendo en `http://localhost:3001` (o el puerto especificado en `PORT`).
    *   Puedes verificar la salud del API en `http://localhost:3001/health` y la documentación en `http://localhost:3001/api-docs`.

## Configuración del Frontend

1.  **Navegar al directorio raíz del proyecto** (si estás en `/backend`, usa `cd ..`).
2.  **Instalar dependencias**:
    ```bash
    npm install
    ```
3.  **Configurar Variables de Entorno**:
    *   Asegúrate de tener un archivo `.env` en la raíz del proyecto.
    *   Debe contener la URL base del API del backend:
        ```env
        # .env (en la raíz del proyecto)
        VITE_API_BASE_URL=http://localhost:3001/api/v1
        ```
    *   Ajusta el puerto si tu backend corre en un puerto diferente al `3001`.

4.  **Iniciar la Aplicación Frontend**:
    ```bash
    npm run dev
    ```
    *   La aplicación React (Vite) debería estar disponible en `http://localhost:3000` (o el puerto que Vite elija si el 3000 está ocupado).

## Scripts Útiles (Backend - desde directorio `/backend`)

-   `npm run dev`: Inicia el servidor de desarrollo con Nodemon.
-   `npm start`: Inicia el servidor de producción.
-   `npm run db:migrate`: Aplica las migraciones pendientes a la base de datos.
-   `npm run db:migrate:undo`: Revierte la última migración aplicada.
-   `npm run db:seed:all`: (Si se crean seeders) Puebla la base de datos con datos de prueba.
-   `npm run db:create:migration --name=nombre-de-migracion`: Crea un nuevo archivo de migración.

## Scripts Útiles (Frontend - desde directorio raíz)

-   `npm run dev`: Inicia el servidor de desarrollo de Vite.
-   `npm run build`: Compila la aplicación para producción (los archivos resultantes estarán en `/dist`).
-   `npm run lint`: Ejecuta ESLint para verificar el código.
-   `npm run preview`: Sirve localmente la build de producción.

## Consideraciones Adicionales

*   **Seguridad de Secretos**: Nunca cometas archivos `.env` con secretos reales a repositorios públicos. Usa `.gitignore` para excluirlos. Considera mecanismos como Doppler, Vault o variables de entorno del sistema de despliegue para producción.
*   **Datos de Prueba (Seeders)**: Para poblar la base de datos con datos iniciales o de prueba, puedes crear archivos seeder usando `npm run db:create:seed --name=nombre-del-seeder` (en `/backend`) y luego ejecutarlos con `npm run db:seed:all`.
*   **CORS**: La configuración de CORS en `backend/src/app.js` está actualmente configurada para permitir peticiones desde `FRONTEND_URL`. Ajústala si tu frontend corre en un dominio/puerto diferente en producción.

¡Éxito con la configuración y ejecución del proyecto!
