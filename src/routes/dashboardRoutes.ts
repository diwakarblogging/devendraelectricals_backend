import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/stats', protect, authorize('admin', 'manager'), getDashboardStats);

export default router;
