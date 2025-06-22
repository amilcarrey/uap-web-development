const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    console.log('🔍 authMiddleware - URL:', req.url);
    console.log('🔍 authMiddleware - Parámetros:', req.params);
    
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'No autorizado - Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, 'tu_clave_secreta_super_segura');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'No autorizado - Token inválido' });
    }
};

module.exports = authMiddleware; 