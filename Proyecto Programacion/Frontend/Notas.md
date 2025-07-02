
# TODO - Lista de Tareas Pendientes

## 🔒 Permisos y Viewers

### Corregir toasts en modo solo lectura ✅ RESUELTO
**Problema:** Los usuarios con permisos de viewer reciben mensajes de toast indicando que completaron acciones cuando intentan modificar tareas, aunque el backend bloquea correctamente estas acciones.

### Vista simplificada para viewers ✅ RESUELTO
**Problema:** Los usuarios con permisos de solo lectura no tienen una indicación clara de que el tablero es de solo lectura, causando confusión al intentar realizar acciones.

## 🔗 Navegación y Enlaces

### Links del dropdown de configuraciones ✅ RESUELTO
**Problema:** Los enlaces del dropdown que dirigen a la sección de configuraciones no funcionan correctamente.

### Configuraciones globales ahora son específicas por usuario ✅ RESUELTO
**Problema:** Las configuraciones de aplicación (intervalo de actualización, mayúsculas en descripción) eran compartidas globalmente entre todos los usuarios y no se persistían.

## 📋 Gestión de Tableros

### Aislamiento de modales por tablero ✅ RESUELTO
**Problema:** El modal de compartir no estaba aislado por tablero, causando que los datos se mezclaran entre diferentes tableros.

### Permisos no se actualizan en el modal ✅ RESUELTO
**Problema:** Al quitar permisos, la petición funcionaba pero los usuarios invitados seguían apareciendo en el modal. Los datos quedaban en el storage local sin actualizarse.

### Botón de crear tablero faltante ✅ RESUELTO
**Problema:** Los usuarios nuevos no pueden crear tableros porque el botón de "Crear nuevo tablero" no aparece en su interfaz.

### Orden del propietario en lista ✅ RESUELTO
**Problema:** En el modal de compartir, el dueño del tablero debería aparecer siempre primero, pero cada vez que se comparte con un nuevo usuario, la posición del propietario baja en la lista.

### Toasts incorrectos al crear/eliminar tableros
**Problema:** Los mensajes de toast muestran error al crear o eliminar tableros, aunque las operaciones se ejecutan correctamente.

### Lentitud en operaciones de tableros
**Problema:** Las operaciones de alta y baja de tableros tardan demasiado tiempo en renderizarse en la interfaz.

## 🔍 Búsqueda de Tareas

### Búsqueda muestra todas las tareas ✅ RESUELTO
**Problema:** La búsqueda de tareas muestra todas las tareas del tablero en lugar de filtrar, y además permite realizar acciones sobre las tareas (mostrado en toasts) cuando debería ser solo visualización de resultados.
