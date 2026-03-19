import { Router } from 'express';
import {
	googleRedirect,
	googleCallback,
	lineRedirect,
	lineCallback,
	facebookRedirect,
	facebookCallback,
	getMe,
} from './controller';
import { requireAuth } from '../../shared/middleware/auth';

const router = Router();

// Google OAuth
router.get('/google', googleRedirect);
router.get('/google/callback', googleCallback);

// LINE OAuth
router.get('/line', lineRedirect);
router.get('/line/callback', lineCallback);

// Facebook OAuth
router.get('/facebook', facebookRedirect);
router.get('/facebook/callback', facebookCallback);

// Current user
router.get('/me', requireAuth as any, getMe);

export default router;
