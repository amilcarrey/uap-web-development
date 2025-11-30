import { Request, Response } from 'express';
import { generateNonce, SiweMessage } from 'siwe';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config';

export const getNonce = (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send(generateNonce());
};

export const signIn = async (req: Request, res: Response) => {
    try {
        const { message, signature } = req.body;
        const siweMessage = new SiweMessage(message);
        const { data: fields } = await siweMessage.verify({ signature });

        const token = jwt.sign({ address: fields.address }, CONFIG.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, address: fields.address });
    } catch (e) {
        console.error(e);
        res.status(401).json({ error: 'Invalid signature' });
    }
};
