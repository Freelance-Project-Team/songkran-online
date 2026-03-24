import { Request, Response } from 'express';
import { WaterPlayService } from '../../entities/water-play/service';
import { AuthRequest } from '../../shared/middleware/auth';
import { generatePhoto } from './photo-generator';

const VALID_CHARACTERS = ['boy', 'girl'];
const VALID_LOCATIONS = ['arun', 'phakeaw', 'yaksuwan', 'saochingcha'];

export const WaterPlayController = {
	log: async (req: AuthRequest, res: Response) => {
		try {
			const { character, locationId } = req.body;

			if (!character || !VALID_CHARACTERS.includes(character)) {
				return res.status(400).json({ message: 'Invalid character. Must be boy or girl.' });
			}
			if (!locationId || !VALID_LOCATIONS.includes(locationId)) {
				return res.status(400).json({
					message: 'Invalid locationId. Must be arun, phakeaw, yaksuwan, or saochingcha.',
				});
			}

			await WaterPlayService.log({
				character,
				locationId,
				userId: req.user?.userId,
				ip: req.ip,
				userAgent: req.headers['user-agent'],
			});

			res.json({ message: 'Logged successfully' });
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},

	getLogs: async (req: Request, res: Response) => {
		try {
			const limit = Math.min(Number(req.query.limit) || 100, 500);
			const offset = Number(req.query.offset) || 0;

			const logs = await WaterPlayService.getLogs(limit, offset);
			res.json({ logs, limit, offset });
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},

	getStats: async (_req: Request, res: Response) => {
		try {
			const stats = await WaterPlayService.getStats();
			res.json(stats);
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},

	generatePhoto: async (req: Request, res: Response) => {
		try {
			const { faceDataUrl, locationId, character, userName, lang } = req.body;

			if (!character || !VALID_CHARACTERS.includes(character)) {
				return res.status(400).json({ message: 'Invalid character. Must be boy or girl.' });
			}
			if (!locationId || !VALID_LOCATIONS.includes(locationId)) {
				return res.status(400).json({
					message: 'Invalid locationId. Must be arun, phakeaw, yaksuwan, or saochingcha.',
				});
			}

			const pngBuffer = await generatePhoto({
				faceDataUrl: faceDataUrl || '',
				locationId,
				character,
				userName: userName || '',
				lang: lang || 'th',
			});

			res.set('Content-Type', 'image/png');
			res.set('Cache-Control', 'no-store');
			res.send(pngBuffer);
		} catch (error: any) {
			console.error('[generate-photo]', error);
			res.status(500).json({ message: error.message });
		}
	},

	generateSharePhoto: async (req: Request, res: Response) => {
		try {
			const { faceDataUrl, locationId, character, userName, lang } = req.body;

			if (!character || !VALID_CHARACTERS.includes(character)) {
				return res.status(400).json({ message: 'Invalid character. Must be boy or girl.' });
			}
			if (!locationId || !VALID_LOCATIONS.includes(locationId)) {
				return res.status(400).json({
					message: 'Invalid locationId. Must be arun, phakeaw, yaksuwan, or saochingcha.',
				});
			}

			const pngBuffer = await generatePhoto({
				faceDataUrl: faceDataUrl || '',
				locationId,
				character,
				userName: userName || '',
				lang: lang || 'th',
			});

			// Save to public/shares
			const { randomUUID } = require('crypto');
			const fs = require('fs/promises');
			const path = require('path');

			const shareId = randomUUID();
			const sharesDir = path.join(process.cwd(), 'public', 'shares');

			try {
				await fs.mkdir(sharesDir, { recursive: true });
			} catch (err) {
				// Ignore if dir exists
			}

			const filePath = path.join(sharesDir, `${shareId}.png`);
			await fs.writeFile(filePath, pngBuffer);

			res.json({ shareId });
		} catch (error: any) {
			console.error('[generate-share-photo]', error);
			res.status(500).json({ message: error.message });
		}
	},
};
