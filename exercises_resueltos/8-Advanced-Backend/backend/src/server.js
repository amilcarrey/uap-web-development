const app = require('./app');
const http = require('http');
const { sequelize } = require('./models');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

async function startServer() {
  try {
    // It's better to run migrations manually or via a script
    // await sequelize.sync(); // { force: true } // Careful with force: true in dev
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    server.listen(PORT, () => {
      console.log(`Server is running on port `);
      console.log(`Access it at http://localhost:`);
    });
  } catch (error) {
    console.error('Unable to connect to the database or start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Application specific logging, shutdown server gracefully etc.
  process.exit(1);
});

startServer();
