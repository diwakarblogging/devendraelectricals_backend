import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getSettings);
router.put('/', protect, authorize('admin'), updateSettings);

export default router;
