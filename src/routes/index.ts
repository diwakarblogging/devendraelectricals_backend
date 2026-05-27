import { Router } from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import inquiryRoutes from './inquiryRoutes';
import uploadRoutes from './uploadRoutes';
import bannerRoutes from './bannerRoutes';
import testimonialRoutes from './testimonialRoutes';
import dashboardRoutes from './dashboardRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/upload', uploadRoutes);
router.use('/banners', bannerRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
