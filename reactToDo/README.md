# React ToDo App

## Descripción

Aplicación de gestión de tareas con tableros (boards), filtros, búsqueda, paginación y autenticación de usuarios.  
Incluye backend (Node.js + Express + Sequelize + SQLite) y frontend (React + Vite).  
**Todo el uso y las pruebas se realizan desde la interfaz web (frontend).**

---

## Requisitos

- Node.js >= 18
- npm >= 9

---

## Instalación y ejecución

1. **Clona el repositorio**

   ```bash
   git clone <URL_DEL_REPO>
   cd Programacion3/reactToDo
   ```

2. **Instala las dependencias**

   ```bash
   npm install
   ```

   > Esto instalará tanto las dependencias del backend como del frontend, ya que están en el mismo proyecto.

3. **Inicia el backend**

   ```bash
   cd backend
   node server.cjs
   ```
   El backend corre en [http://localhost:4000](http://localhost:4000)

4. **Inicia el frontend**

   Abre una nueva terminal en la carpeta `reactToDo` y ejecuta:

   ```bash
   npm run dev
   ```
   El frontend corre en [http://localhost:5173](http://localhost:5173)

---

## ¿Cómo funciona la app?

1. **Registro y Login:**  
   - Ingresa un nombre de usuario y contraseña para registrarte o iniciar sesión.
   - No se usa email, solo usuario y contraseña.

2. **Tableros (Boards):**  
   - Puedes crear, renombrar y eliminar tableros.
   - Todas las tareas pertenecen a un tablero.

3. **Tareas:**  
   - Crea, edita, elimina y marca tareas como completadas.
   - Puedes buscar tareas por texto, filtrar por estado (todas, activas, completadas) y paginar los resultados.
   - Puedes eliminar todas las tareas completadas de un tablero con un solo clic.

4. **Preferencias:**  
   - Puedes cambiar configuraciones personales desde el menú de ajustes.

---

## Notas

- **No es necesario usar Postman ni herramientas externas:**  
  Todo se prueba y usa desde el frontend.
- **La autenticación y la gestión de sesión son automáticas en la web:**  
  Cuando inicias sesión, el backend envía un token de autenticación (JWT) en una cookie HTTP-only.  
  El frontend maneja esta cookie automáticamente en cada request, por lo que no necesitas preocuparte por el token.
- **La base de datos es SQLite y se crea automáticamente al iniciar el backend.**


- usuario "patohe"
- contraseña "12345"

- usuario "ulises"
- contraseña "cuarteto"


---