import pool from "../db/db.js";

function permisoTablero(rolesPermitidos) {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        console.log("❌ Usuario no autenticado");
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const { id: userId } = req.user;
      let tableroId = req.params.tableroId || req.params.id;
      
      console.log(`🔍 Verificando permisos para usuario ${userId}`);
      console.log(`📋 Params:`, req.params);
      console.log(`📝 Body:`, req.body);
      console.log(`🎯 TableroId inicial:`, tableroId);

      // Si no hay tableroId en los params, intentar obtenerlo del body (para crear tareas)
      if (!tableroId && req.body.tableroId) {
        tableroId = req.body.tableroId;
        console.log(`📝 TableroId obtenido del body:`, tableroId);
      }

      // Si aún no hay tableroId, intentar obtenerlo de la tarea (para operaciones de tarea)
      if (!tableroId && req.params.id) {
        const currentPath = req.route?.path || req.path || req.originalUrl;
        console.log(`🛣️ Ruta actual:`, currentPath);
        
        // Si la ruta contiene /tareas/ o estamos en una operación de tarea
        if (currentPath.includes('/tareas/') || req.originalUrl.includes('/tareas/')) {
          console.log(`🔍 Buscando tableroId para tarea ${req.params.id}`);
          const tareaResult = await pool.query(
            "SELECT tablero_id FROM tareas WHERE id = $1",
            [req.params.id]
          );
          
          if (tareaResult.rows.length > 0) {
            tableroId = tareaResult.rows[0].tablero_id;
            console.log(`🎯 TableroId obtenido de la tarea:`, tableroId);
          } else {
            console.log(`❌ No se encontró la tarea con id ${req.params.id}`);
            return res.status(404).json({ message: "Tarea no encontrada" });
          }
        }
      }

      if (!tableroId) {
        console.log("❌ No se pudo obtener el tableroId");
        return res.status(400).json({ 
          message: "ID de tablero no encontrado",
          debug: {
            params: req.params,
            body: req.body,
            path: req.route?.path || req.path
          }
        });
      }

      console.log(`🔍 Verificando permisos en tablero ${tableroId} para usuario ${userId}`);
      
      const result = await pool.query(
        "SELECT rol FROM tablero_usuarios WHERE tablero_id = $1 AND usuario_id = $2",
        [tableroId, userId]
      );

      const permiso = result.rows[0]?.rol;

      console.log(`👤 Usuario ${userId} tiene rol "${permiso}" en tablero ${tableroId}`);
      console.log(`✅ Roles permitidos:`, rolesPermitidos);

      if (!permiso || !rolesPermitidos.includes(permiso)) {
        console.log(`❌ Permiso denegado: ${permiso} no está en [${rolesPermitidos.join(', ')}]`);
        return res.status(403).json({
          message: "No tenés permiso para esta acción",
          required: rolesPermitidos,
          current: permiso || "ninguno",
          tableroId: tableroId,
          userId: userId
        });
      }

      console.log(`✅ Permiso concedido para usuario ${userId} en tablero ${tableroId}`);
      
      // Agregar tableroId al request para uso posterior
      req.tableroId = tableroId;
      next();
    } catch (error) {
      console.error("💥 Error en permisoTablero:", error);
      res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
  };
}

export { permisoTablero };
