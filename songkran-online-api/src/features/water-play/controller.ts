import { Request, Response } from 'express';
import { WaterPlayService } from '../../entities/water-play/service';
import { AuthRequest } from '../../shared/middleware/auth';

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
};
