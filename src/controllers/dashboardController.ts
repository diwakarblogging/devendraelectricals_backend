import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import Inquiry from '../models/Inquiry';
import Banner from '../models/Banner';
import Testimonial from '../models/Testimonial';

export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalProducts,
      totalCategories,
      totalInquiries,
      totalBanners,
      totalTestimonials,
      pendingInquiries,
      featuredProducts,
      recentInquiries,
      recentProducts,
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Category.countDocuments({ isActive: true }),
      Inquiry.countDocuments(),
      Banner.countDocuments({ isActive: true }),
      Testimonial.countDocuments({ isActive: true }),
      Inquiry.countDocuments({ status: 'pending' }),
      Product.countDocuments({ featured: true, isActive: true }),
      Inquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
      Product.find({ isActive: true })
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const totalViews = await Product.aggregate([
      { $group: { _id: null, total: { $sum: '$viewCount' } } },
    ]);

    const categoryDistribution = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $project: { name: '$category.name', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalProducts,
          totalCategories,
          totalInquiries,
          totalBanners,
          totalTestimonials,
          pendingInquiries,
          featuredProducts,
          totalViews: totalViews[0]?.total || 0,
        },
        categoryDistribution,
        recentInquiries,
        recentProducts,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
