const jwt = require('jsonwebtoken');
// Se obtiene la clave secreta del entorno o se usa un valor por defecto
const JWT_SECRET = process.env.JWT_SECRET || 'secreto123';

// Middleware para verificar el token JWT en las cookies
function verificarToken(req, res, next) {
  // Obtiene el token de las cookies de la petición
  const token = req.cookies.token;

  // Si no hay token, responde con error 401 (no autorizado)
  if (!token) {
    return res.status(401).json({ mensaje: 'Token no encontrado' });
  }

  try {
    // Verifica y decodifica el token usando la clave secreta
    const decoded = jwt.verify(token, JWT_SECRET);
    // Guarda el payload del JWT en la petición para usarlo después
    req.usuario = decoded;
    next(); // Continúa con el siguiente middleware o ruta
  } catch (err) {
    // Si el token es inválido, responde con error 401
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
}

// Exporta el middleware para usarlo en otras partes de la aplicación
module.exports = verificarToken;