import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
	userId: number;
	email?: string | null;
	name?: string | null;
}

export const signToken = (payload: JwtPayload): string => {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
	return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const signOAuthState = (data: object): string => {
	return jwt.sign(data, JWT_SECRET, { expiresIn: '5m' });
};

export const verifyOAuthState = (token: string): object => {
	return jwt.verify(token, JWT_SECRET) as object;
};
