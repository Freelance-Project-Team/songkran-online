import prisma from '../../shared/prisma/index';

export const WaterPlayService = {
	log: async (data: {
		character: string;
		locationId: string;
		userId?: number;
		ip?: string;
		userAgent?: string;
	}) => {
		return prisma.waterPlayLog.create({ data });
	},

	getLogs: async (limit = 100, offset = 0) => {
		return prisma.waterPlayLog.findMany({
			orderBy: { createdAt: 'desc' },
			take: limit,
			skip: offset,
			include: { user: { select: { id: true, name: true, email: true } } },
		});
	},

	getStats: async () => {
		const total = await prisma.waterPlayLog.count();

		const byLocation = await prisma.waterPlayLog.groupBy({
			by: ['locationId'],
			_count: { _all: true },
			orderBy: { _count: { locationId: 'desc' } },
		});

		const byCharacter = await prisma.waterPlayLog.groupBy({
			by: ['character'],
			_count: { _all: true },
		});

		return {
			total,
			byLocation: byLocation.map((r) => ({ locationId: r.locationId, count: r._count._all })),
			byCharacter: byCharacter.map((r) => ({ character: r.character, count: r._count._all })),
		};
	},
};
