import { Router } from 'express';
import {
  getInquiries,
  getInquiry,
  createInquiry,
  updateInquiry,
  deleteInquiry,
} from '../controllers/inquiryController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/', protect, authorize('admin', 'manager'), getInquiries);
router.get('/:id', protect, authorize('admin', 'manager'), getInquiry);
router.post('/', createInquiry);
router.put('/:id', protect, authorize('admin', 'manager'), updateInquiry);
router.delete('/:id', protect, authorize('admin'), deleteInquiry);

export default router;
