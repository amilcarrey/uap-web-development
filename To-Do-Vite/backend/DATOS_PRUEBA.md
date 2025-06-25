# 📊 Datos de Prueba - To-Do App

## 🎯 Propósito
Este documento describe los datos de prueba disponibles en la aplicación para facilitar la evaluación y demostración de funcionalidades.

## 👥 Usuarios Disponibles

### 🔑 Credenciales de Acceso

| Usuario | Contraseña | Rol | Descripción |
|---------|------------|-----|-------------|
| `luca` | `admin123` | **Administrador** | Usuario principal con acceso completo |
| `maria` | `password123` | Usuario | Usuario con permisos de editor en algunos tableros |
| `juan` | `password123` | Usuario | Usuario con permisos de solo lectura |
| `ana` | `password123` | Usuario | Usuario sin tableros compartidos |

## 📋 Tableros de Prueba

### 1. **Tareas Personales** (Propietario: luca)
- **Categoría**: Personal
- **Tareas**: 5 tareas (2 completadas, 3 pendientes)
- **Compartido con**: maria (editor)

### 2. **Proyectos Universidad** (Propietario: luca)
- **Categoría**: Universidad
- **Tareas**: 5 tareas (1 completada, 4 pendientes)
- **Compartido con**: juan (viewer)

### 3. **Compras Casa** (Propietario: maria)
- **Categoría**: Personal
- **Tareas**: 4 tareas (1 completada, 3 pendientes)
- **Compartido con**: luca (editor)

### 4. **Estudios Programación** (Propietario: juan)
- **Categoría**: Universidad
- **Tareas**: 4 tareas (1 completada, 3 pendientes)
- **Compartido con**: nadie

## 🔗 Enlaces Compartidos

### Enlaces de Solo Lectura
- **Tablero Personal**: `http://localhost:5173/shared/[TOKEN]`
- **Tablero Universidad**: `http://localhost:5173/shared/[TOKEN]`

*Nota: Los tokens se generan dinámicamente al ejecutar el seed. Revisa la consola para obtener los tokens actuales.*

## 🧪 Casos de Prueba

### 1. **Autenticación y Autorización**
- ✅ Login con diferentes usuarios
- ✅ Verificación de permisos por tablero
- ✅ Acceso denegado a tableros sin permisos

### 2. **Gestión de Tableros**
- ✅ Crear nuevos tableros
- ✅ Ver solo tableros con permisos
- ✅ Eliminar tableros (solo propietarios)
- ✅ Compartir tableros con otros usuarios

### 3. **Gestión de Tareas**
- ✅ Crear, editar, eliminar tareas
- ✅ Marcar como completadas/pendientes
- ✅ Filtros (todas, activas, completadas)
- ✅ Búsqueda por texto
- ✅ Paginación
- ✅ Eliminar tareas completadas en lote

### 4. **Sistema de Permisos**
- ✅ **Owner**: Control total del tablero
- ✅ **Editor**: Puede gestionar tareas
- ✅ **Viewer**: Solo puede ver

### 5. **Configuraciones**
- ✅ Personalizar intervalo de actualización
- ✅ Configurar visualización (mayúsculas)
- ✅ Persistencia de preferencias

### 6. **Panel de Administración**
- ✅ Estadísticas del sistema
- ✅ Lista de usuarios
- ✅ Eliminación de usuarios

## 🚀 Cómo Usar

### 1. **Iniciar la Aplicación**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 2. **Acceder con Datos de Prueba**
1. Ir a `http://localhost:5173`
2. Usar cualquiera de las credenciales listadas arriba
3. Explorar las diferentes funcionalidades

### 3. **Probar Diferentes Escenarios**
- **Como luca (admin)**: Acceso completo a todo
- **Como maria**: Ver sus tableros + tableros compartidos
- **Como juan**: Ver sus tableros + tablero compartido (solo lectura)
- **Como ana**: Solo sus propios tableros

## 🔄 Regenerar Datos de Prueba

Si necesitas regenerar los datos de prueba:

```bash
cd backend
npm run seed
```

*Nota: Esto agregará datos sin duplicar registros existentes.*

## 📈 Estadísticas de Datos

- **Usuarios**: 4
- **Tableros**: 4
- **Tareas**: 18
- **Relaciones de permisos**: 3
- **Enlaces compartidos**: 2

## 🎯 Funcionalidades a Demostrar

1. **Sistema completo de autenticación**
2. **Gestión granular de permisos**
3. **CRUD completo de tareas**
4. **Filtros y búsqueda avanzada**
5. **Paginación y optimización**
6. **Configuraciones personalizables**
7. **Enlaces compartidos**
8. **Panel administrativo**
9. **Interfaz responsive**
10. **Notificaciones en tiempo real**

---

*Estos datos están diseñados para demostrar todas las funcionalidades requeridas en el proyecto.* 