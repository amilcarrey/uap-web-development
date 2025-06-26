const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticación
 * Verifica que exista un JWT válido en la cookie 'token'
 * Si es válido, añade req.user = { id: userId }
 * Si falta o es inválido, responde 401 Unauthorized
 */
module.exports = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: userId };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
