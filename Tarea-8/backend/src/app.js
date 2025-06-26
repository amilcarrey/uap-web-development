// backend/src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const db = require('../models'); // Importa los modelos (incluido User)
const authRoutes = require('./routes/authRoutes');
const boardRoutes = require('./routes/boardRoutes');
const taskRoutes = require('./routes/taskRoutes');
// const { protect } = require('./middleware/authMiddleware'); // No es necesario importarlo aquí, se usa en las rutas directamente

dotenv.config(); // Cargar variables de entorno (asegúrate de que esto solo se ejecute una vez en tu aplicación)

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json()); // Para parsear JSON en el body de las requests
app.use(express.urlencoded({ extended: true })); // Para parsear datos de formularios URL-encoded
app.use(cookieParser()); // Para parsear las cookies de las requests

// --- Configuración de CORS ---
// ¡CRÍTICO! El middleware de CORS DEBE ir antes de que definas tus rutas
// para que aplique las cabeceras a todas las peticiones a la API.
app.use(cors({
    origin: 'http://localhost:5173', // Reemplaza con la URL EXACTA de tu frontend (ej. 'http://localhost:5173')
    credentials: true, // ¡CRUCIAL para que se envíen/reciban cookies y headers de autorización!
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers específicos que el cliente puede enviar
}));
// --- FIN Configuración de CORS ---

// Rutas base (no protegidas o de prueba)
app.get('/', (req, res) => {
    res.send('¡API de Tareas funcionando!');
});

// Usa las rutas de autenticación con un prefijo /api/auth
app.use('/api/auth', authRoutes);

// Usa las rutas de tableros, que internamente usarán el middleware 'protect'
// Esto significa que las rutas definidas en boardRoutes (ej. router.get('/'))
// se accederán como /api/boards/
app.use('/api/boards', boardRoutes);

// Usa las rutas de tareas. Nota: Tus taskRoutes.js ya define prefijos como '/boards/:boardId/tasks'
// y '/tasks/:id'. Si montamos taskRoutes directamente en '/api', esas rutas serán
// /api/boards/:boardId/tasks y /api/tasks/:id, lo cual es correcto.
app.use('/api', taskRoutes);

// Ruta de prueba PROTEGIDA (mantener para verificar que protect funciona)
app.get('/api/protected', (req, res, next) => {
    // Aquí usamos el middleware 'protect' directamente en esta ruta específica
    require('./middleware/authMiddleware').protect(req, res, (err) => {
        if (err) return next(err); // Pasa el error al siguiente middleware si existe

        res.json({
            message: `Acceso a ruta protegida concedido para el usuario: ${req.user.username}`,
            user: req.user
        });
    });
});


// Middleware de manejo de errores (al final de todos los middlewares y rutas)
// Asegúrate de tener un middleware errorHandler definido, usualmente en ./middleware/errorMiddleware.js
// const { errorHandler } = require('./middleware/errorMiddleware');
// app.use(errorHandler); // Descomentar si tienes un errorHandler global

// Iniciar el servidor
db.sequelize.sync()
    .then(() => {
        console.log('Base de datos conectada y sincronizada.');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
            console.log(`Accede a http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error al conectar o sincronizar la base de datos:', err);
    });