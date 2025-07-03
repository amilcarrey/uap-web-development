import jwt from "jsonwebtoken";

const autenticarJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token requerido' });

  try {
    // Usar una clave temporal hardcodeada mientras arreglo el problema del .env
    const JWT_SECRET = process.env.JWT_SECRET || "1234567890123456789012345678901234567890123456789012345678901234567890";
    const decoded = jwt.verify(token, JWT_SECRET);
    // Almaceno la información del usuario decodificada del JWT
    req.usuario = decoded;
    next();
  } catch (error) {
    console.error("Error al verificar JWT:", error);
    res.status(403).json({ message: 'Token inválido' });
  }
};

export default autenticarJWT;
