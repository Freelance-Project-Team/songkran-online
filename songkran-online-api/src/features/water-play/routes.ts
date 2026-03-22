import { Router } from 'express';
import { WaterPlayController } from './controller';
import { optionalAuth } from '../../shared/middleware/auth';

const router = Router();

// POST /water-play/log — log character + location selection (optional auth for userId tracking)
router.post('/log', optionalAuth as any, WaterPlayController.log);

// GET /water-play/logs — get all logs
router.get('/logs', WaterPlayController.getLogs);

// GET /water-play/stats — get stats by location and character
router.get('/stats', WaterPlayController.getStats);

export default router;
