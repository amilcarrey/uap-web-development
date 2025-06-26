# Gestor de Tareas - Proyecto 

## Descripción  
Aplicación web para gestionar tareas organizadas en tableros. Permite registrar usuarios, crear tableros, agregar tareas y compartir tableros con otros usuarios con distintos permisos.

---

## Tecnologías usadas  

- Backend: Node.js, Express, Prisma ORM, SQLite  
- Frontend: React  
- Autenticación: JWT en headers  
- Base de datos: SQLite  
- Gestor de paquetes: npm

---

## Requisitos previos  

- Node.js (v16 o superior recomendado)  
- npm 
- Visual Studio Code u otro editor  
- (Opcional) Postman para probar API  

---

## Instalación y ejecución 

##Backend
1. Clonar el repositorio  
2. Instalar dependencias  
npm install  
3. Aplicar migraciones Prisma  
npx prisma migrate dev --name init  
4. Iniciar el backend  
npm run dev (por defecto corre en http://localhost:4321)


##Frontend
1. Ir a la carpeta frontend
2. Instalar dependencias
npm install
3. Iniciar la app  
npm run dev (por defecto corre en http://localhost:5173)


---

## Uso
Nota: El backend debe de estar corriendo antes del frontend.

1. Abrir la aplicación en el navegador

2. Iniciar sesión con el usuario de prueba (ver datos más abajo) o registrarse nuevo usuario

3. Crear y gestionar tableros y tareas

4. Compartir tableros con otros usuarios 

---

## Datos de prueba

Para probar la aplicación, usar el siguiente usuario:

id usuario:1
Email: testgestor@x.com
Contraseña: 1234

id usuario:2
Email: test2gestor@y.com
Contraseña: 2345

Este usuario tiene un tablero con tareas de ejemplo para facilitar las pruebas.

---


## API

Documentación API

Notas generales
- Todos los endpoints protegidos requieren el header:
Authorization: Bearer <token>  
Ejemplo: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

- Algunos endpoints requieren permisos específicos en el tablero:

propietario: Dueño del tablero.
editor: Puede modificar tareas.
lectura: Puede consultar datos.


POST /api/register
Registra un nuevo usuario.

Body JSON:
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}

Respuesta:
{
  "message": "Usuario creado",
  "userId": 1
}


POST /api/login
Inicia sesión y devuelve un token JWT.

Body JSON:
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}

Respuesta:
{
  "message": "Inicio de sesión exitoso",
  "userId": 1,
  "token": "JWT_TOKEN_AQUI"
}


Configuración del usuario
GET /api/configuracion
Obtiene configuración del usuario autenticado.

PUT /api/configuracion
Actualiza configuración del usuario.

Body JSON ejemplo:
{
  "refetchInterval": 15000,
  "descripcionMayusculas": true,
  "theme": "dark"
}



Tableros

POST /api/tableros/add
Crea un nuevo tablero (requiere autenticación).

DELETE /api/tableros/delete/:boardId
Elimina un tablero (requiere ser propietario).

GET /api/tableros/get
Obtiene los tableros donde el usuario tiene permisos.

GET /api/tableros/getById/:boardId
Obtiene un tablero específico (requiere permiso de lectura).




Permisos

POST /api/permisos/tablero/:boardId/permisos
Asigna permisos a otro usuario en el tablero (requiere ser propietario).

Body JSON:

{
  "userId": 2,
  "role": "editor"
}



Tareas
POST /api/tareas/add/:boardId
Crea una tarea (requiere editor).

DELETE /api/tareas/delete/:boardId
Elimina una tarea (requiere editor).

Body JSON:
{
  "id": 1
}


PATCH /api/tareas/edit/:boardId
Edita una tarea (requiere editor).

Body JSON:
{
  "id": 1,
  "descripcion": "Nueva descripción"
}

POST /api/tareas/toggle/:boardId
Alterna estado completado (requiere editor).

Body JSON:
{
  "id": 1
}


POST /api/tareas/clearCompleted/:boardId
Elimina todas las tareas completadas (requiere editor).

GET /api/tareas/getFiltered/:boardId
Obtiene tareas con filtro y paginación (requiere lectura).

Query params:
filter=complete|incomplete|all
page=1
limit=5

GET /api/tareas/search/:boardId
Busca tareas con filtro y paginación (requiere lectura).

Query params:
query=texto
filter=complete|incomplete|all
page=1
limit=10


---

Notas
- JWT debe enviarse en el header: Authorization: Bearer <token>.
- El backend y frontend deben correr simultáneamente para que la app funcione correctamente.
- Backend corre en puerto (4321) y frontend (5173).
- Para aplicar configuraciones y guardar en base de datos se debe presionar botón de guardar configuración.


