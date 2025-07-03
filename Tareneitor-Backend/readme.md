##### Tareneitor Backend

Tareneitor es una API RESTful desarrollada con **Express.js** y una base de datos relacional que permite gestionar **tableros de tareas colaborativos**, con control de permisos, autenticación segura con JWT y configuración personalizada por usuario.

Este backend está diseñado para integrarse con una aplicación frontend en **React**, ofreciendo una arquitectura limpia, escalable y segura.

---

##  Tecnologías utilizadas

- **Node.js** + **Express.js**
- **SQLite** (o cualquier DB relacional compatible)
- **Sequelize ORM**
- **JWT (JSON Web Token)**
- **bcrypt** (hashing de contraseñas)
- **cookie-parser**
- **dotenv** (variables de entorno)
- **nodemon** (modo desarrollo)

---

##  Instalación y ejecución

```bash
git clone https://github.com/tu-usuario/tareneitor-backend.git
cd tareneitor-backend
npm install
````

###  Variables de entorno

Crear un archivo `.env`:

```
PORT=3001
JWT_SECRET=supersecreto123
DATABASE_URL=sqlite://tareas.db
```

### 🔧 Comandos útiles

```bash
npm run init-db      # Inicializa la base de datos (crea tablas)
npm run dev          # Ejecuta el backend en modo desarrollo (con nodemon)
npm start            # Ejecuta en modo producción
```

---

##  Funcionalidades principales

### Usuarios

* Registro y login con email único y contraseña segura (bcrypt)
* Login persistente usando cookies HTTP-only con JWT
* CRUD básico para usuarios

### Tableros

* Crear tableros propios
* Compartir tableros con otros usuarios
* Control de permisos por usuario (propietario, editor, lector)
* Solo el propietario puede eliminar tableros o cambiar permisos

### Tareas

* Crear, editar, eliminar y completar tareas
* Cada tarea pertenece a un tablero
* Acciones restringidas según permisos
* Filtros, búsqueda y eliminación en lote

### Configuración del usuario

* Guardar preferencias como intervalo de actualización o visualización
* Persistencia de preferencias por usuario

### Seguridad

* Autenticación JWT segura en cookies HTTP-only
* Autorización granular por permisos
* Middleware de validación de sesión y permisos
* Manejo de errores unificado

---

## Modelo de datos (DER)

### Usuarios

```sql
id_usuario INTEGER PRIMARY KEY
nombre_usuario TEXT
correo TEXT UNIQUE
contraseña TEXT (hashed)
fecha_creacion DATETIME
```

### Configuración

```sql
id_config INTEGER PRIMARY KEY
usuario_id INTEGER UNIQUE
auto_refresh_interval INTEGER
vista_preferida TEXT
otras_preferencias JSON (opcional)
FOREIGN KEY (usuario_id) → Usuarios(id_usuario)
```

### Tableros

```sql
id_tablero INTEGER PRIMARY KEY
nombre TEXT
descripcion TEXT
propietario_id INTEGER
fecha_creacion DATETIME
FOREIGN KEY (propietario_id) → Usuarios(id_usuario)
```

### Permisos

```sql
usuario_id INTEGER
tablero_id INTEGER
permiso TEXT CHECK (permiso IN ('propietario', 'editor', 'lector'))
PRIMARY KEY (usuario_id, tablero_id)
```

### Tareas

```sql
id_tarea INTEGER PRIMARY KEY
contenido TEXT
completada BOOLEAN DEFAULT FALSE
tablero_id INTEGER
fecha_creacion DATETIME
FOREIGN KEY (tablero_id) → Tableros(id_tablero)
```

---

## Endpoints principales

# AUTENTICACIÓN
1. Registro de usuario
POST /api/auth/register
→ Validación, hashing con bcrypt, crea usuario

2. Login de usuario
POST /api/auth/login
→ Verifica contraseña, genera JWT, lo envía en cookie HTTP-only

3. Logout
POST /api/auth/logout
→ Borra cookie con token

4. Validar sesión (quién soy)
GET /api/auth/me
→ Lee cookie, verifica JWT, devuelve usuario

# AUTORIZACIÓN Y ROLES
5. Middleware de autenticación
Extrae cookie

Verifica JWT

Adjunta usuario a req.usuario

6. Middleware de autorización por rol o permiso
Verifica si el usuario tiene acceso al recurso (lector/editor/propietario)

# USUARIOS (CRUD)
7. Obtener todos los usuarios
GET /api/usuarios/

8. Obtener usuario por ID
GET /api/usuarios/:id

9. Buscar usuario por correo
GET /api/usuarios/:correo

10. Actualizar usuario
PUT /api/usuarios/:id

11. Eliminar usuario
DELETE /api/usuarios/:id

# TABLEROS
12. Crear un tablero
POST /api/tableros/

13. Obtener tableros propios
GET /api/tableros/propios

14. Obtener tableros compartidos
GET /api/tableros/compartidos

15. Obtener tablero por ID
GET /api/tableros/:id

16. Editar tablero
PUT /api/tableros/:id

17. Eliminar tablero
DELETE /api/tableros/:id

# PERMISOS DE TABLEROS
18. Compartir tablero
POST /api/tableros/:id/permisos
→ Requiere usuario_id y permiso ('lector' | 'editor')

19. Ver permisos de un tablero
GET /api/tableros/:id/permisos

20. Quitar permiso
DELETE /api/tableros/:id/permisos/:usuarioId

# TAREAS
21. Crear tarea
POST /api/tableros/:id/tareas
→ Solo si es editor o propietario

22. Obtener tareas de un tablero
GET /api/tableros/:id/tareas

23. Editar tarea
PUT /api/tareas/:id
→ Solo si es editor o propietario

24. Eliminar tarea
DELETE /api/tareas/:id
→ Solo si es editor o propietario

# CONFIGURACIÓN DE USUARIO
25. Crear configuración
POST /api/config/

26. Obtener configuración
GET /api/config/

27. Actualizar configuración
PUT /api/config/

## Autenticación y Autorización

* **Contraseñas**: Hasheadas con `bcrypt`
* **Sesión**: JWT firmado con `JWT_SECRET`, enviado como cookie HTTP-only
* **Roles de permisos**:

  * `propietario`: control total del tablero
  * `editor`: puede crear/editar tareas
  * `lector`: solo lectura
* **Middlewares**:

  * `autenticacion`: verifica sesión activa
  * `autorizar`: chequea permisos en tablero
  * `verificarPermisoTarea`: chequea si el usuario tiene permiso sobre una tarea

---

## Testing

Se uso **postman** para probar los endpoints y **Db browser lite (sqlize)** para la base de datos
---
