require('dotenv').config();

const app = require('./src/app');
const sequelize = require('./src/config/database');

const PORT = process.env.PORT || 3001;

sequelize.sync()
  .then(() => {
    console.log('✅ Base de datos sincronizada con Sequelize');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
    });
  })
  .catch(error => {
    console.error('❌ Error al conectar con la base de datos:', error);
  });
