# Gestor de Tareas - Proyecto Full Stack

Este proyecto implementa una aplicación completa para la gestión de tareas, desarrollada con una arquitectura full stack. El backend está construido con **Node.js**, **Express** y **Prisma ORM**, mientras que el frontend está desarrollado con **React** y **TypeScript**. La autenticación se realiza mediante **JWT**, y se incorpora control de acceso por roles, paginación, búsqueda, validaciones con Zod y documentación formal de la API.

---

## Características Implementadas

- ✅ Autenticación con JWT (login y registro de usuarios)
- ✅ Creación y edición de tableros
- ✅ Creación, edición, eliminación y marcado de tareas
- ✅ Paginación y búsqueda de tareas
- ✅ Roles y permisos: OWNER, EDITOR, VIEWER
- ✅ Validaciones avanzadas (Zod)
- ✅ Manejo de errores en frontend y backend
- ✅ Documentación de la API (`docs/api-docs.md`)
- ✅ Base de datos relacional con Prisma
- ✅ Estilo profesional y estructura modular
- ✅ Interfaz moderna con React y Tailwind CSS

---

## Requisitos Previos

- Node.js 18 o superior
- PostgreSQL (u otro motor compatible con Prisma)
- Yarn o npm
- Git

---

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/usuario/proyecto-gestor-tareas.git
cd proyecto-gestor-tareas
```

2. Instalar dependencias:

```bash
cd backend
npm install

cd ../frontend
npm install
```

3. Configurar variables de entorno en `backend/.env`:

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/gestor
JWT_SECRET=una_clave_segura
```

4. Ejecutar migraciones y poblar la base de datos:

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

5. Iniciar el servidor backend:

```bash
npm run dev
```

6. Iniciar el cliente frontend:

```bash
cd ../frontend
npm run dev
```
---

### 🧪 Datos de prueba disponibles

El script de seed crea tres usuarios con tableros compartidos:

| Usuario | Email                | Contraseña       | Tableros propios  | Acceso a tableros de otros |
|---------|----------------------|------------------|-------------------|-----------------------------|
| Alicia  | alicia@example.com   | claveAlicia123   | Limpieza, Trabajo | Trabajo (compartido con Brenda como EDITOR), Limpieza (compartido con Carlos como VIEWER) |
| Brenda  | brenda@example.com   | claveBrenda123   | Estudio           | Trabajo                     |
| Carlos  | carlos@example.com   | claveCarlos123   | —                 | Limpieza                    |

Cada tablero contiene tareas relevantes a su temática para facilitar las pruebas de paginación, edición, y gestión de permisos.

---

## Uso

Una vez en ejecución, la aplicación estará disponible en:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000](http://localhost:3000)

---

## Documentación de la API

La documentación completa de la API se encuentra disponible en el archivo:

```
docs/api-docs.md
```

Incluye todos los endpoints, parámetros, ejemplos de uso y posibles errores.

---

## Autoría

- **Nombre:** Noemí Raquel Fernández Leyes  
- **Asignatura:** Programación 3 
- **Docentes:** Martín Aranda y Amilcar Rey  
