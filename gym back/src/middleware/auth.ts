import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({
        message: 'Accès refusé. Aucun jeton fourni ou format invalide.',
      });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here';
    const verified = jwt.verify(token, secret);
    req.user = verified;
    next();
  } catch (error: any) {
    console.error(`[AUTH-ERROR] JWT Verification failed: ${error.message}`);
    res.status(401).json({ message: 'Jeton invalide ou expiré.' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: 'Accès interdit. Rôle non autorisé.' });
    }
    next();
  };
};


