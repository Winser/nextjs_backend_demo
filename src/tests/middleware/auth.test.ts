import request from 'supertest';
import express, { Request } from 'express';
import auth from '../../middleware/auth';
import generateToken from '../../routes/auth/token.utils';

const app = express();
app.use(express.json());

// Mock route to test the middleware
app.get('/protected', auth.required, (req, res) => {
    res.status(200).send({ message: 'Access granted' });
});

app.get('/optional', auth.optional, (req, res) => {
    if (req.user) {
        res.status(200).send({ message: 'Access granted with token' });
    } else {
        res.status(200).send({ message: 'Access granted without token' });
    }
});

const validToken = generateToken(1);

describe('Auth Middleware', () => {
    it('should allow access to protected route with valid token', async () => {
        const response = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${validToken}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Access granted');
    });

    it('should deny access to protected route without token', async () => {
        const response = await request(app).get('/protected');
        expect(response.status).toBe(401);
    });

    it('should allow access to optional route without token', async () => {
        const response = await request(app).get('/optional');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Access granted without token');

    });

    it('should allow access to optional route with valid token', async () => {
        const response = await request(app)
            .get('/optional')
            .set('Authorization', `Bearer ${validToken}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Access granted with token');
    });

    it('should deny access to protected route with invalid token', async () => {
        const token = 'invalid.jwt.token';
        const response = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(401);
    });
});