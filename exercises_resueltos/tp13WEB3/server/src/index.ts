import express from 'express';
import cors from 'cors';
import { CONFIG } from './config';
import { getNonce, signIn } from './controllers/authController';
import { claimTokens, getStatus } from './controllers/faucetController';
import { authenticateToken } from './middleware/auth';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/auth/message', getNonce);
app.post('/auth/signin', signIn);

app.get('/faucet/status/:address', authenticateToken, getStatus);
app.post('/faucet/claim', authenticateToken, claimTokens);

app.listen(CONFIG.PORT, () => {
    console.log(`Server running on port ${CONFIG.PORT}`);
});
