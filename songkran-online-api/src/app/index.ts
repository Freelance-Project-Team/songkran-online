import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import authRoutes from '../features/auth/routes';
import activityRoutes from '../features/activity/routes';
import healthRoutes from '../features/health/routes';
import { swaggerSpec } from '../shared/swagger/spec';

dotenv.config();

const app: Express = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/activities', activityRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs.json', (_req, res) => res.json(swaggerSpec));

export default app;
