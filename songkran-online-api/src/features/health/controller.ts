import { Request, Response } from 'express';
import prisma from '../../shared/prisma/index';

export const healthCheck = async (_req: Request, res: Response) => {
	const start = Date.now();

	let dbStatus: 'ok' | 'error' = 'ok';
	let dbLatencyMs: number | null = null;

	try {
		const dbStart = Date.now();
		await prisma.$queryRaw`SELECT 1`;
		dbLatencyMs = Date.now() - dbStart;
	} catch {
		dbStatus = 'error';
	}

	const status = dbStatus === 'ok' ? 'ok' : 'degraded';

	res.status(dbStatus === 'ok' ? 200 : 503).json({
		status,
		timestamp: new Date().toISOString(),
		uptime: Math.floor(process.uptime()),
		responseTimeMs: Date.now() - start,
		services: {
			database: {
				status: dbStatus,
				latencyMs: dbLatencyMs,
			},
		},
	});
};
