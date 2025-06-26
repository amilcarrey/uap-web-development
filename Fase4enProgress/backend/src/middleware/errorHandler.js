//errorHandler.js
exports.errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Definir código de estado predeterminado
  let statusCode = 500;
  let message = 'Error interno del servidor';

  // Manejar errores conocidos
  if (err.message.includes('Credenciales inválidas')) {
    statusCode = 401;
    message = err.message;
  } else if (err.message.includes('El email ya está registrado')) {
    statusCode = 409;
    message = err.message;
  } else if (err.message.includes('son requeridos')) {
    statusCode = 400;
    message = err.message;
  }

  // Enviar respuesta de error
  res.status(statusCode).json({
    success: false,
    error: message,
  });
};