import { Request, Response } from 'express';
import { ActivityService } from '../../entities/activity/service';
import { AuthRequest } from '../../shared/middleware/auth';

export const ActivityController = {
	list: async (_req: Request, res: Response) => {
		try {
			const activities = await ActivityService.findAll();
			res.json(activities);
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},

	get: async (req: AuthRequest, res: Response) => {
		try {
			const activityId = Number(req.params.id);
			const activity = await ActivityService.findById(activityId);
			if (!activity) return res.status(404).json({ message: 'Activity not found' });

			ActivityService.logAccess(
				activityId,
				req.user?.userId,
				req.ip,
				req.headers['user-agent']
			).catch(() => {});

			res.json(activity);
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},

	join: async (req: AuthRequest, res: Response) => {
		try {
			const activityId = Number(req.params.id);
			const userId = req.user!.userId;

			const activity = await ActivityService.findById(activityId);
			if (!activity) return res.status(404).json({ message: 'Activity not found' });

			const already = await ActivityService.isJoined(userId, activityId);
			if (already) {
				return res.json({ message: 'Already joined', joined: true });
			}

			await ActivityService.join(userId, activityId);
			res.json({ message: 'Joined successfully', joined: true });
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},

	stats: async (req: Request, res: Response) => {
		try {
			const activityId = Number(req.params.id);
			const activity = await ActivityService.findById(activityId);
			if (!activity) return res.status(404).json({ message: 'Activity not found' });

			const stats = await ActivityService.getStats(activityId);
			res.json({ activityId, ...stats });
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},
};
