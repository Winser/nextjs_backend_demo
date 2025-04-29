import { expressjwt as jwt } from 'express-jwt';
import * as express from 'express';

const getTokenFromHeaders = (req: express.Request): string | undefined => {
    if (!req.headers.authorization) {
        return undefined;
    }
    const headerParts = req.headers.authorization.split(' ')
    const prefix = headerParts[0];
    if ((prefix === 'Token') || (prefix === 'Bearer')) {
        return headerParts[1];
    }
    return undefined;
};

const auth = {
    required: jwt({
        secret: process.env.JWT_SECRET || 'superSecret',
        getToken: getTokenFromHeaders,
        algorithms: ['HS256'],
    }),
    optional: jwt({
        secret: process.env.JWT_SECRET || 'superSecret',
        credentialsRequired: false,
        getToken: getTokenFromHeaders,
        algorithms: ['HS256'],
    }),
};

export default auth;