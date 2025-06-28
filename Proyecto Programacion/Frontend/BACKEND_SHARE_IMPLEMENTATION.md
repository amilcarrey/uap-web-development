# 🔧 BACKEND: Implementar Funcionalidad Real de Compartir Tableros

## 📋 **Problema Actual**
El frontend está simulando el compartir tableros localmente, pero no envía peticiones reales al backend. Por eso cuando el usuario compartido inicia sesión, no ve el tablero.

## 🔨 **Endpoints que Necesitas Implementar**

### **1. Compartir Tablero**
```http
POST /api/boards/:boardId/share
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "userId": 3,
  "permission": "view"  // opcional: "view", "edit", "admin"
}

Respuesta:
{
  "message": "Tablero compartido exitosamente",
  "permission": {
    "boardId": "8", 
    "userId": 3,
    "permission": "view"
  }
}
```

### **2. Remover Acceso a Tablero**
```http
DELETE /api/boards/:boardId/share/:userId
Authorization: Bearer <token>

Respuesta:
{
  "message": "Acceso removido exitosamente"
}
```

### **3. Obtener Usuarios con Acceso (Opcional)**
```http
GET /api/boards/:boardId/shared-users
Authorization: Bearer <token>

Respuesta:
[
  {
    "id": 3,
    "alias": "usuario123",
    "firstName": "Usuario",
    "lastName": "Ejemplo"
  }
]
```

### **4. Modificar Obtener Tableros (CRÍTICO)**
Actualizar el endpoint existente que obtiene los tableros del usuario para incluir también los tableros compartidos con él.

```http
GET /api/boards
Authorization: Bearer <token>

Respuesta: Tableros propios + tableros compartidos
```

## 🗃️ **Estructura de Base de Datos Sugerida**

Si no tienes tabla de permisos, necesitas crearla:

```sql
CREATE TABLE board_permissions (
  id SERIAL PRIMARY KEY,
  board_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  permission_type VARCHAR(20) DEFAULT 'view',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(board_id, user_id)
);
```

## 🎯 **Código Base para Implementar**

### **BoardController (método para compartir)**
```javascript
async shareBoard(req, res) {
  try {
    const { boardId } = req.params;
    const { userId, permission = 'view' } = req.body;
    const currentUserId = req.user.id;
    
    // Verificar que el tablero existe y el usuario actual es propietario
    const board = await this.boardDbService.getBoardById(boardId);
    if (!board || board.userId !== currentUserId) {
      return res.status(404).json({ error: 'Tablero no encontrado o sin permisos' });
    }
    
    // Verificar que el usuario objetivo existe
    const targetUser = await this.userDbService.getUserById(userId);
    if (!targetUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Crear permiso
    const result = await this.boardDbService.shareBoardWithUser(boardId, userId, permission);
    
    res.json({
      message: 'Tablero compartido exitosamente',
      permission: result
    });
    
  } catch (error) {
    console.error('Error compartiendo tablero:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
```

### **BoardDbService (métodos necesarios)**
```javascript
async shareBoardWithUser(boardId, userId, permission) {
  // Crear o actualizar permiso en board_permissions
}

async removeBoardAccess(boardId, userId) {
  // Eliminar permiso de board_permissions
}

async getBoardsForUser(userId) {
  // Retornar tableros propios + tableros compartidos
}

async getSharedUsersForBoard(boardId) {
  // Retornar usuarios que tienen acceso al tablero
}
```

## ⚡ **Prioridad de Implementación**

1. **CRÍTICO**: Modificar endpoint de obtener tableros para incluir compartidos
2. **ALTO**: Endpoint POST para compartir tablero
3. **MEDIO**: Endpoint DELETE para remover acceso
4. **BAJO**: Endpoint GET para usuarios compartidos

## 🧪 **Cómo Probar**

Una vez implementado:
1. Comparte un tablero desde el frontend
2. Verifica en Network que se envía la petición POST
3. Inicia sesión con el usuario compartido
4. Verifica que ve el tablero compartido

---

**El frontend YA ESTÁ LISTO** para enviar las peticiones reales. Solo necesitas implementar los endpoints en el backend! 🚀
