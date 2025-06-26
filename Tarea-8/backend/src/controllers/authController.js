// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../models'); // Importa los modelos (incluido User)
const User = db.User; // Accede al modelo User

// Clave secreta para JWT (¡DEBE SER UNA VARIABLE DE ENTORNO EN PRODUCCIÓN!)
// Por ahora la ponemos aquí, pero luego la moveremos al .env
const JWT_SECRET = process.env.JWT_SECRET || 'programing3'; // Usamos dotenv

// Función para el registro de usuarios
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 1. Verificar si el usuario ya existe
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'El usuario con este email ya existe.' });
        }

        user = await User.findOne({ where: { username } });
        if (user) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
        }

        // 2. Hashear la contraseña
        const salt = await bcrypt.genSalt(10); // Genera un "salt" para mayor seguridad
        const hashedPassword = await bcrypt.hash(password, salt); // Hashea la contraseña

        // 3. Crear el nuevo usuario en la base de datos
        user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // 4. Generar JWT para el nuevo usuario (opcional, pero común)
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }, // El token expira en 1 hora
            (err, token) => {
                if (err) throw err;

                // 5. Enviar el JWT en una cookie HTTP-only
                res.cookie('token', token, {
                    httpOnly: true, // No accesible por JavaScript en el navegador
                    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
                    sameSite: 'strict', // Protección CSRF
                    maxAge: 3600000 // 1 hora en milisegundos
                });

                res.status(201).json({ message: 'Usuario registrado exitosamente', user: { id: user.id, username: user.username, email: user.email } });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor al registrar usuario.');
    }
};

// Función para el inicio de sesión de usuarios
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Verificar si el usuario existe por email
        let user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        // 2. Comparar la contraseña ingresada con la hasheada en la DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        // 3. Generar JWT
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }, // El token expira en 1 hora
            (err, token) => {
                if (err) throw err;

                // 4. Enviar el JWT en una cookie HTTP-only
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 3600000
                });

                res.status(200).json({ message: 'Inicio de sesión exitoso', user: { id: user.id, username: user.username, email: user.email } });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor al iniciar sesión.');
    }
};

// Función para cerrar sesión
exports.logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0) // Establece la fecha de expiración en el pasado para eliminar la cookie
    });
    res.status(200).json({ message: 'Sesión cerrada exitosamente.' });
};

// NUEVA FUNCIÓN: Obtener el usuario actual (verificar sesión)
exports.getMe = async (req, res) => {
    try {
        // `req.user` es adjuntado por el middleware `verifyToken`.
        // Asegúrate de que tu middleware adjunta al menos `req.user.id`.
        if (!req.user || !req.user.id) {
            // Esto no debería ocurrir si `verifyToken` funciona correctamente,
            // pero es una buena salvaguarda.
            return res.status(401).json({ message: 'No autenticado o ID de usuario faltante.' });
        }

        // Buscar el usuario en la base de datos para devolver sus datos actualizados.
        // Excluye la contraseña del resultado.
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] } // Usamos findByPk y attributes para excluir password
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Si el usuario existe y está autenticado, devuelve sus datos.
        res.status(200).json({ user });

    } catch (error) {
        console.error('Error al obtener datos del usuario en getMe:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};