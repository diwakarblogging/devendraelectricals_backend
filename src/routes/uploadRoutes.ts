import { Router } from 'express';
import { uploadImages, deleteImage, upload } from '../controllers/uploadController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.post('/', protect, authorize('admin'), upload.array('images', 10), uploadImages);
router.delete('/:publicId', protect, authorize('admin'), deleteImage);

export default router;
