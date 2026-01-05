import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-do-not-use-in-prod';

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = (req: any, res: any, next: NextFunction) => {
  const token = req.cookies.token;
  // console.log('DEBUG: Auth Middleware - Cookies:', req.cookies); // TOO NOISY

  if (!token) {
    console.log('DEBUG: Auth Middleware - No Token Found. Headers:', req.headers.cookie);
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
};