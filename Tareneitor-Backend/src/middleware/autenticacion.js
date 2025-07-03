const jwt = require('jsonwebtoken'); // Importa la librería jsonwebtoken para manejar JWT
const JWT_SECRET = process.env.JWT_SECRET || 'secreto123'; // Obtiene la clave secreta del entorno o usa un valor por defecto

// Middleware para autenticar usuarios usando JWT
function autenticar(req, res, next) {
  const token = req.cookies.token; // Obtiene el token de las cookies

  if (!token) {
    // Si no hay token, responde con error de no autorizado
    return res.status(401).json({ mensaje: 'No autorizado, token no encontrado' });
  }

  try {
    // Verifica y decodifica el token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded; // Guarda la información del usuario decodificada en la petición
    next(); // Llama al siguiente middleware/controlador
  } catch (error) {
    // Si el token es inválido o expiró, responde con error de no autorizado
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}

module.exports = { autenticar }; // Exporta el middleware para usarlo en otras partes de la aplicación
