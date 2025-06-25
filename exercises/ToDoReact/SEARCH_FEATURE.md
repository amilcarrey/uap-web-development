# Funcionalidad de Búsqueda de Tareas

## Descripción

Se ha implementado un buscador de tareas por contenido que funciona mediante parámetros de URL y mantiene el estado de búsqueda mientras el usuario escribe.

## Características Implementadas

### ✅ **Búsqueda por Parámetros URL**

- La búsqueda se maneja a través del parámetro `search` en la URL
- URL ejemplo: `/tab/today?search=comprar`
- El estado se mantiene al navegar o recargar la página

### ✅ **Input con Debounce**

- Espera 300ms después de que el usuario deje de escribir antes de actualizar la URL
- Evita peticiones excesivas al servidor mientras se escribe
- Mantiene el foco en el input sin interrupciones

### ✅ **UI Integrada**

- Ubicado al lado del botón "Clear Completed" en FilterButtons
- Diseño consistente con el tema irlandés de la aplicación
- Icono de búsqueda y botón de limpiar integrados

### ✅ **Backend Compatible**

- El backend ya soportaba búsqueda mediante el parámetro `search`
- Búsqueda por contenido usando SQL `LIKE %term%`
- Compatible con filtros existentes (all, active, completed)

## Archivos Modificados

### Frontend

#### **Nuevos Archivos:**

- `src/hooks/useDebounce.ts` - Hook para debounce
- `src/components/SearchInput.tsx` - Componente de búsqueda

#### **Archivos Modificados:**

- `src/router.tsx` - Agregado `validateSearch` para parámetro search
- `src/components/FilterButtons.tsx` - Integración del SearchInput
- `src/components/TaskList.tsx` - Uso del parámetro search
- `src/hooks/useTasks.ts` - Soporte para parámetro search
- `src/components/AuthForm.tsx` - Ajuste para nuevos parámetros de router
- `src/components/TabList.tsx` - Ajuste para nuevos parámetros de router
- `src/pages/AuthPage.tsx` - Ajuste para nuevos parámetros de router

### Backend

No requiere modificaciones adicionales - ya soportaba búsqueda.

## Cómo Usar

### **Para el Usuario:**

1. Ve a cualquier board/tab
2. Escribe en el campo de búsqueda al lado del botón "Clear Completed"
3. Los resultados se filtran automáticamente
4. Usa el botón X para limpiar la búsqueda
5. La búsqueda se mantiene al navegar entre tabs

### **Para el Desarrollador:**

```typescript
// El hook useTasks ahora acepta un parámetro search opcional
const search = useSearch({ from: "/tab/$tabId" });
const { data, isLoading, error } = useTasks(search.search);

// Navegar manteniendo búsqueda
navigate({
  to: "/tab/$tabId",
  params: { tabId: "today" },
  search: { search: "mi búsqueda" },
});
```

## Funciones Clave

### **useDebounce Hook**

```typescript
const debouncedSearchTerm = useDebounce(searchTerm, 300);
```

### **SearchInput Component**

- Debounce automático
- Sincronización con URL
- Mantiene foco durante escritura
- Botón de limpiar integrado

### **Integración con Backend**

```sql
-- Query ejecutada en el backend
SELECT * FROM tasks
WHERE board_id = ?
  AND text LIKE %search_term%
  AND completed = ?
ORDER BY created_at DESC
```

## Estados de la Aplicación

### **Sin Búsqueda:**

- URL: `/tab/today`
- Muestra todas las tareas según filtro activo

### **Con Búsqueda:**

- URL: `/tab/today?search=comprar`
- Muestra tareas que contienen "comprar" en el texto
- Mensaje personalizado cuando no hay resultados

### **Búsqueda Vacía:**

- URL: `/tab/today?search=`
- Se comporta igual que sin búsqueda

## Características Técnicas

### **Debounce Strategy:**

- 300ms de delay
- Cancela búsquedas anteriores
- Actualiza URL usando `replace: true`

### **Focus Management:**

- Input mantiene foco durante escritura
- No se pierde foco al actualizar URL
- Enter no rompe el foco

### **Cache Management:**

- Cada búsqueda tiene su propia cache key
- `taskKeys.list(boardId, page, filter, search)`
- Cache se invalida correctamente

### **Error Handling:**

- Mensajes específicos para búsquedas sin resultados
- Mantiene funcionalidad normal en caso de errores
- Fallback graceful si falla la búsqueda

## Próximas Mejoras Posibles

### **UI Enhancements:**

- [ ] Sugerencias de búsqueda
- [ ] Historial de búsquedas
- [ ] Búsqueda avanzada (por fecha, estado, etc.)

### **Performance:**

- [ ] Indexación full-text en base de datos
- [ ] Paginación para búsquedas con muchos resultados
- [ ] Pre-carga de resultados comunes

### **UX:**

- [ ] Resaltado de términos encontrados
- [ ] Keyboard shortcuts (Ctrl+F)
- [ ] Búsqueda en múltiples boards

## Testing

### **Casos de Prueba Manuales:**

1. **Búsqueda Básica:**

   - Escribir "comprar" → Ver tareas filtradas
   - Limpiar búsqueda → Ver todas las tareas

2. **Navegación:**

   - Buscar → Cambiar de tab → Volver → Búsqueda debe persistir

3. **Filtros:**

   - Buscar + filtro "Completed" → Ver solo tareas completadas con el término

4. **Performance:**
   - Escribir rápido → No debe hacer múltiples requests
   - Input no debe perder foco

## Debugging

### **Logs en Consola:**

```
🔄 Fetching tasks for board: board-id, filter: all, page: 1, search: "término"
📋 useTasks: activeTab="today", boardId="board-id", filter="all", page=1, search="término"
```

### **URLs de Ejemplo:**

- Sin búsqueda: `/tab/today`
- Con búsqueda: `/tab/today?search=comprar`
- Búsqueda vacía: `/tab/today?search=`

---

**Nota:** Esta implementación es completamente compatible con versiones anteriores y no afecta la funcionalidad existente.
