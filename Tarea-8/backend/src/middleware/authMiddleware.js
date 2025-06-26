// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../../models'); // Asegurate que esta ruta sea correcta
const User = db.User; // Accede al modelo User

// Middleware para proteger rutas
const protect = async (req, res, next) => {
    let token;

    // Comprobar si el token está en las cookies
    if (req.cookies.token) {
        token = req.cookies.token;
    }

    // Si no hay token, el usuario no está autorizado
    if (!token) {
        return res.status(401).json({ message: 'No autorizado, no hay token' });
    }

    try {
        // Verificar el token
        // Asegúrate de que process.env.JWT_SECRET sea el mismo que usas para firmar el token
        // Recordatorio: En desarrollo, si no usas .env, tu JWT_SECRET en authController.js es 'programing3'
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'programing3'); // Usa tu secreto aquí

        // Buscar al usuario por ID (excluyendo la contraseña)
        // Accede a decoded.user.id porque así está estructurado tu payload en authController.js
        req.user = await User.findByPk(decoded.user.id, {
            attributes: { exclude: ['password'] }
        });

        // Si el usuario no existe, no autorizado
        if (!req.user) {
            return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
        }

        // Continuar con la siguiente función middleware/ruta
        next();

    } catch (error) {
        console.error('Error de autenticación:', error);
        // Puedes ser más específico aquí, ej. si el token expiró o es inválido
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'No autorizado, token expirado' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'No autorizado, token inválido' });
        } else {
            return res.status(401).json({ message: 'No autorizado, fallo en la verificación del token' });
        }
    }
};

module.exports = { protect }; // Exporta el middleware `protect`