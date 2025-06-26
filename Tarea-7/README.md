# TO - DO

## Configuración del proyecto localmente 

- Clonar el repositorio


git clone https://github.com/tu-usuario/repo.git
cd repo

- Instalar dependencias
(Backend)
cd backend
npm install

(Frontend)
cd ../frontend
npm install

- Ejecutar el proyecto

cd src
npm run dev

Esto levanta el servidor en `http://localhost:3000`, y el frontend en  `http://localhost:5173`.



## Autenticación
Se utilizan cookies y JWT en el backend.

POST `/api/auth/register` -> Crea un nuevo usuario.
  
POST `/api/auth/login` -> Inicia sesión con credenciales válidas.


## API

- Tableros

| Método | Endpoint           | Descripción                      |
|--------|--------------------|----------------------------------|
| GET    | `/api/tableros`    | Tableros del usuario autenticado |
| POST   | `/api/tableros`    | Crear un nuevo tablero           |
| PUT    | `/api/tableros/:id`| Editar el nombre de un tablero   |
| DELETE | `/api/tableros/:id`| Eliminar un tablero              |

- Ejemplo: Crear tablero

POST /api/tableros
{
  "nombre": "Mi nuevo tablero"
}

- Tareas

| Método | Endpoint                      | Descripción                      |
|--------|-------------------------------|----------------------------------|
| GET    | `/api/tableros/:id/tareas`    | Obtener tareas de un tablero     |
| POST   | `/api/tableros/:id/tareas`    | Crear tarea en un tablero        |
| PUT    | `/api/tareas/:id`             | Editar una tarea                 |
| DELETE | `/api/tareas/:id`             | Eliminar una tarea               |

- Ejemplo: Crear tarea

POST /api/tableros/abc123/tareas
{
  "titulo": "Estudiar redes",
  "descripcion": "Practicar IP y subnetting",
  "estado": "pendiente"
}


