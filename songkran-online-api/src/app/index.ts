import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import authRoutes from '../features/auth/routes';
import activityRoutes from '../features/activity/routes';
import waterPlayRoutes from '../features/water-play/routes';
import healthRoutes from '../features/health/routes';
import { swaggerSpec } from '../shared/swagger/spec';

dotenv.config();

const app: Express = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use((req, res, next) => {
	const start = Date.now();
	res.on('finish', () => {
		const ms = Date.now() - start;
		const status = res.statusCode;

		const methodColor: Record<string, string> = {
			GET: '\x1b[48;5;18m\x1b[37m', // Deep Blue
			POST: '\x1b[48;5;22m\x1b[37m', // Deep Green
			PUT: '\x1b[48;5;130m\x1b[37m', // Deep Orange/Rust
			DELETE: '\x1b[48;5;88m\x1b[37m', // Deep Red
			PATCH: '\x1b[48;5;23m\x1b[37m', // Deep Teal
			UNKNOWN: '\x1b[48;5;234m\x1b[37m', // Near Black
		};
		const statusColor =
			status >= 500
				? '\x1b[91m'
				: status >= 400
					? '\x1b[93m'
					: status >= 300
						? '\x1b[96m'
						: '\x1b[92m';
		const mc = methodColor[req.method] ?? '\x1b[97m';
		const reset = '\x1b[0m';
		const dim = '\x1b[90m';

		const time = new Date().toISOString().replace('T', ' ').slice(0, 19);
		const method = req.method.padEnd(7);

		console.log(
			`${dim}${time}${reset} ${mc}${method}${reset} ${dim}${req.path}${reset} ${statusColor}${status}${reset} ${dim}${ms}ms${reset}`
		);
	});
	next();
});

app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/activities', activityRoutes);
app.use('/water-play', waterPlayRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs.json', (_req, res) => res.json(swaggerSpec));

export default app;
