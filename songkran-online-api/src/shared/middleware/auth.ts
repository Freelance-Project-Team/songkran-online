import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';

export interface AuthRequest extends Request {
	user?: JwtPayload;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
	const authHeader = req.headers.authorization;
	if (!authHeader?.startsWith('Bearer ')) {
		res.status(401).json({ message: 'Unauthorized' });
		return;
	}

	const token = authHeader.slice(7);
	try {
		req.user = verifyToken(token);
		next();
	} catch {
		res.status(401).json({ message: 'Invalid or expired token' });
	}
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
	const authHeader = req.headers.authorization;
	if (authHeader?.startsWith('Bearer ')) {
		try {
			req.user = verifyToken(authHeader.slice(7));
		} catch {
			// noop
		}
	}
	next();
};
