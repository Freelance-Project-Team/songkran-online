import { Request, Response } from 'express';
import { UserService } from '../../entities/user/service';
import { signToken, signOAuthState, verifyOAuthState } from '../../shared/utils/jwt';
import {
	getGoogleAuthUrl,
	getGoogleProfile,
	getLineAuthUrl,
	getLineProfile,
	getFacebookAuthUrl,
	getFacebookProfile,
	OAuthProfile,
} from './oauth';
import { OAuthProvider } from '@prisma/client';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body: any): string | null {
	const { name, email, password, confirmPassword, mode } = body;
	if (!email || !EMAIL_RE.test(email)) return 'Invalid email address';
	if (!password || password.length < 8) return 'Password must be at least 8 characters';
	if (mode === 'register') {
		if (!name || name.trim().length < 2) return 'Name must be at least 2 characters';
		if (password !== confirmPassword) return 'Passwords do not match';
	}
	return null;
}

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

const handleOAuthCallback = async (
	profile: OAuthProfile,
	provider: OAuthProvider,
	res: Response
) => {
	const user = await UserService.upsertByProvider(provider, profile);
	const token = signToken({ userId: user.id, email: user.email, name: user.name });
	res.redirect(`${CLIENT_URL}/auth/callback?token=${token}`);
};

export const googleRedirect = (_req: Request, res: Response) => {
	const state = signOAuthState({ provider: 'google' });
	res.redirect(getGoogleAuthUrl(state));
};

export const googleCallback = async (req: Request, res: Response) => {
	try {
		const { code, state } = req.query as { code: string; state: string };
		verifyOAuthState(state);
		const profile = await getGoogleProfile(code);
		await handleOAuthCallback(profile, OAuthProvider.GOOGLE, res);
	} catch (error: any) {
		res.redirect(`${CLIENT_URL}/auth/error?message=${encodeURIComponent(error.message)}`);
	}
};

export const lineRedirect = (_req: Request, res: Response) => {
	const state = signOAuthState({ provider: 'line' });
	res.redirect(getLineAuthUrl(state));
};

export const lineCallback = async (req: Request, res: Response) => {
	try {
		const { code, state } = req.query as { code: string; state: string };
		verifyOAuthState(state);
		const profile = await getLineProfile(code);
		await handleOAuthCallback(profile, OAuthProvider.LINE, res);
	} catch (error: any) {
		res.redirect(`${CLIENT_URL}/auth/error?message=${encodeURIComponent(error.message)}`);
	}
};

export const facebookRedirect = (_req: Request, res: Response) => {
	const state = signOAuthState({ provider: 'facebook' });
	res.redirect(getFacebookAuthUrl(state));
};

export const facebookCallback = async (req: Request, res: Response) => {
	try {
		const { code, state } = req.query as { code: string; state: string };
		verifyOAuthState(state);
		const profile = await getFacebookProfile(code);
		await handleOAuthCallback(profile, OAuthProvider.FACEBOOK, res);
	} catch (error: any) {
		res.redirect(`${CLIENT_URL}/auth/error?message=${encodeURIComponent(error.message)}`);
	}
};

export const getMe = async (req: Request & { user?: any }, res: Response) => {
	try {
		const user = await UserService.findById(req.user.userId);
		if (!user) return res.status(404).json({ message: 'User not found' });
		const { password: _, ...safeUser } = user as any;
		res.json(safeUser);
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

export const register = async (req: Request, res: Response) => {
	const error = validate({ ...req.body, mode: 'register' });
	if (error) return res.status(400).json({ message: error });

	try {
		const { name, email, password } = req.body;
		const user = await UserService.registerWithEmail(name.trim(), email.toLowerCase(), password);
		const token = signToken({ userId: user.id, email: user.email, name: user.name });
		const { password: _, ...safeUser } = user as any;
		res.status(201).json({ token, user: safeUser });
	} catch (err: any) {
		if (err.message === 'EMAIL_ALREADY_IN_USE') {
			return res.status(409).json({ message: 'This email is already registered' });
		}
		res.status(500).json({ message: 'Registration failed. Please try again.' });
	}
};

export const login = async (req: Request, res: Response) => {
	const error = validate({ ...req.body, mode: 'login' });
	if (error) return res.status(400).json({ message: error });

	try {
		const { email, password } = req.body;
		const user = await UserService.loginWithEmail(email.toLowerCase(), password);
		const token = signToken({ userId: user.id, email: user.email, name: user.name });
		const { password: _, ...safeUser } = user as any;
		res.json({ token, user: safeUser });
	} catch (err: any) {
		if (err.message === 'INVALID_CREDENTIALS') {
			return res.status(401).json({ message: 'Invalid email or password' });
		}
		res.status(500).json({ message: 'Login failed. Please try again.' });
	}
};
