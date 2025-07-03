# Backend

## Instalación de dependencias del Backend y el Frontend

Para instalar todas las dependencias necesarias para este proyecto, simplemente ejecuta el siguiente comando en la terminal:

```
npm run setup
```

Esto ejecuta internamente `npm install`, que lee el archivo `package.json` y descarga automáticamente todas las dependencias listadas en las secciones `dependencies` y `devDependencies`.


## Información para pruebas

- Para realizar pruebas, es necesario tener un usuario creado con las siguientes credenciales:
  ```json
  {
    "alias": "Daniel2102",
    "password": "Daniel"
  },
  {
    "alias": "Agustin2102",
    "password": "Agustin"
  },
  {
    "alias": "Flavia2102",
    "password": "Flavia"
  }
  ```
- En la base de datos, cada usuario tiene asignado varios tableros con sus tareas asociadas --Ovio, solo si los datos de la BD quedan guardados despues de hacer el pull... Sino ni idea, crea usuarios nuevos. O verificar que existen haciendo **npx prisma studio**, te muestra el estado de la BD--.

### En el caso de usar Postman:
- Para crear un tablero, primero debes autenticarte usando el endpoint de login y luego usar el endpoint correspondiente para crear tableros.
- Si necesitas probar otros endpoints, asegúrate de usar el token JWT que se obtiene al iniciar sesión.
- Esos serian lo más basico que se puede hacer, los demas endpoints funcionan parecidos

## Endpoints principales

### Autenticación
- **POST** `/api/auth/login` - Iniciar sesión
- **POST** `/api/auth/register` - Registrar nuevo usuario

### Tableros
- **GET** `/api/boards` - Obtener tableros del usuario autenticado
- **POST** `/api/boards` - Crear un nuevo tablero
- **PUT** `/api/boards/:id` - Actualizar un tablero
- **DELETE** `/api/boards/:id` - Eliminar un tablero

### Tareas
- **GET** `/api/boards/:boardId/tasks` - Obtener tareas de un tablero
- **POST** `/api/boards/:boardId/tasks` - Crear una nueva tarea
- **PUT** `/api/boards/:boardId/tasks/:id` - Actualizar una tarea
- **DELETE** `/api/boards/:boardId/tasks/:id` - Eliminar una tarea

### Permisos
- **GET** `/api/boards/:boardId/permissions` - Obtener permisos de un tablero
- **POST** `/api/boards/:boardId/permissions` - Asignar permisos

### Preferencias
- **GET** `/api/preferences` - Obtener preferencias del usuario
- **PUT** `/api/preferences` - Actualizar preferencias


