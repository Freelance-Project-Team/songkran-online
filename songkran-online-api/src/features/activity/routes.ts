import { Router } from 'express';
import { ActivityController } from './controller';
import { requireAuth, optionalAuth } from '../../shared/middleware/auth';

const router = Router();

// GET /activities
router.get('/', ActivityController.list);

// GET /activities/:id — log access (optional auth for userId tracking)
router.get('/:id', optionalAuth as any, ActivityController.get);

// POST /activities/:id/join — requires login
router.post('/:id/join', requireAuth as any, ActivityController.join);

// GET /activities/:id/stats
router.get('/:id/stats', ActivityController.stats);

export default router;
