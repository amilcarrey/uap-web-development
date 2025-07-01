
# TODO - Lista de Tareas Pendientes

## 🔒 Permisos y Viewers

### Corregir toasts en modo solo lectura
**Problema:** Los usuarios con permisos de viewer reciben mensajes de toast indicando que completaron acciones cuando intentan modificar tareas, aunque el backend bloquea correctamente estas acciones.

### Vista simplificada para viewers
**Problema:** Los usuarios con permisos de solo lectura no tienen una indicación clara de que el tablero es de solo lectura, causando confusión al intentar realizar acciones.

## 🔗 Navegación y Enlaces

### Links del dropdown de configuraciones
**Problema:** Los enlaces del dropdown que dirigen a la sección de configuraciones no funcionan correctamente.

## 📋 Gestión de Tableros

### Aislamiento de modales por tablero
**Problema:** El modal de compartir no está aislado por tablero, causando que los datos se mezclen entre diferentes tableros.

### Permisos no se actualizan en el modal
**Problema:** Al quitar permisos, la petición funciona pero los usuarios invitados siguen apareciendo en el modal. Posiblemente los datos quedan en el storage local sin actualizarse.

### Botón de crear tablero faltante
**Problema:** Los usuarios nuevos no pueden crear tableros porque el botón de "Crear nuevo tablero" no aparece en su interfaz.

### Orden del propietario en lista
**Problema:** En el modal de compartir, el dueño del tablero debería aparecer siempre primero, pero cada vez que se comparte con un nuevo usuario, la posición del propietario baja en la lista.

### Toasts incorrectos al crear/eliminar tableros
**Problema:** Los mensajes de toast muestran error al crear o eliminar tableros, aunque las operaciones se ejecutan correctamente.

### Lentitud en operaciones de tableros
**Problema:** Las operaciones de alta y baja de tableros tardan demasiado tiempo en renderizarse en la interfaz.

## 🔍 Búsqueda de Tareas

### Búsqueda muestra todas las tareas
**Problema:** La búsqueda de tareas muestra todas las tareas del tablero en lugar de filtrar, y además permite realizar acciones sobre las tareas (mostrado en toasts) cuando debería ser solo visualización de resultados.