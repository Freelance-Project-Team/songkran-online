import prisma from '../../shared/prisma/index';

export const ActivityService = {
	findAll: async () => {
		return prisma.activity.findMany({ orderBy: { createdAt: 'desc' } });
	},

	findById: async (id: number) => {
		return prisma.activity.findUnique({ where: { id } });
	},

	join: async (userId: number, activityId: number) => {
		return prisma.activityParticipant.upsert({
			where: { userId_activityId: { userId, activityId } },
			create: { userId, activityId },
			update: {},
		});
	},

	isJoined: async (userId: number, activityId: number) => {
		const record = await prisma.activityParticipant.findUnique({
			where: { userId_activityId: { userId, activityId } },
		});
		return record !== null;
	},

	logAccess: async (activityId: number, userId?: number, ip?: string, userAgent?: string) => {
		return prisma.activityAccessLog.create({
			data: { activityId, userId, ip, userAgent },
		});
	},

	getStats: async (activityId: number) => {
		const [participantCount, accessCount] = await Promise.all([
			prisma.activityParticipant.count({ where: { activityId } }),
			prisma.activityAccessLog.count({ where: { activityId } }),
		]);

		const uniqueUserAccess = await prisma.activityAccessLog.groupBy({
			by: ['userId'],
			where: { activityId, userId: { not: null } },
			_count: true,
		});

		return {
			participantCount,
			accessCount,
			uniqueUserAccessCount: uniqueUserAccess.length,
		};
	},
};
