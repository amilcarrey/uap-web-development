import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import reviewRoutes from '../src/routes/reviewRoutes.js';
import authRoutes from '../src/routes/authRoutes.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../src/models/User.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);

process.env.JWT_SECRET = 'testsecret';

let mongoServer;
let token;
let userId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Create a user and get token
    const user = await User.create({
        name: 'Reviewer',
        email: 'reviewer@example.com',
        password: 'password123',
    });
    userId = user._id;
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Review Routes', () => {
    it('should create a review', async () => {
        const res = await request(app)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${token}`)
            .send({
                bookId: 'book123',
                rating: 5,
                content: 'Great book!',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('content', 'Great book!');
    });

    it('should get reviews for a book', async () => {
        const res = await request(app)
            .get('/api/reviews/book123');

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].content).toEqual('Great book!');
    });

    it('should not allow unauthenticated review creation', async () => {
        const res = await request(app)
            .post('/api/reviews')
            .send({
                bookId: 'book123',
                rating: 4,
                content: 'Good book',
            });

        expect(res.statusCode).toEqual(401);
    });

    it('should get reviews for the authenticated user', async () => {
        const res = await request(app)
            .get('/api/reviews/user/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].user).toEqual(userId.toString());
    });
});
