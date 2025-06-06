// Ejemplo de middleware
module.exports = (req, res, next) => {
  console.log('Middleware ejecutado');
  next();
};
