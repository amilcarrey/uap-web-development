// Configuración de la app Express
require('dotenv').config();
import express from 'express';
import cors from 'cors';
import boardRoutes from './routes/boardRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/boards', boardRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

export default app;
