import { Request, Response } from 'express';
import Inquiry from '../models/Inquiry';
import Product from '../models/Product';
import { sendInquiryNotification } from '../utils/email';

export const getInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '20', status, search } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter)
        .populate('product', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Inquiry.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: inquiries.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: inquiries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate('product', 'name slug images');
    if (!inquiry) {
      res.status(404).json({ success: false, message: 'Inquiry not found' });
      return;
    }

    if (!inquiry.isRead) {
      inquiry.isRead = true;
      await inquiry.save();
    }

    res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, message, product: productId, productName, quantity } = req.body;

    if (!name || !phone || !message) {
      res.status(400).json({ success: false, message: 'Name, phone, and message are required' });
      return;
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      message,
      product: productId || undefined,
      productName: productName || undefined,
      quantity: quantity || undefined,
    });

    if (productId) {
      await Product.findByIdAndUpdate(productId, { $inc: { inquiryCount: 1 } });
    }

    await sendInquiryNotification({ name, email, phone, message, productName });

    res.status(201).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, notes } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      res.status(404).json({ success: false, message: 'Inquiry not found' });
      return;
    }

    res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      res.status(404).json({ success: false, message: 'Inquiry not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
