// Ejemplo de middleware
const logger = (req, res, next) => {
  console.log('Middleware ejecutado');
  next();
};

export default logger;
