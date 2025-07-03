import jwt from "jsonwebtoken";

const autenticarJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    console.error("ERROR JWT:", error);  // <-- AGREGALO ACÁ
    res.status(403).json({ message: 'Token inválido' });
  }
};

export default autenticarJWT;
