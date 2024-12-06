import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/verifyTokens';
import { JwtPayload } from 'jsonwebtoken';
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}


export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req?.cookies?.accessToken;
    if (!accessToken) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    const verified = verifyAccessToken(accessToken);
    if (!verified || typeof verified === 'string') {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    req.userId = verified.userId as string;
    next();
}