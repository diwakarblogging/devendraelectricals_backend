import { Request, Response } from 'express';
import Setting from '../models/Setting';

const DEFAULTS: Record<string, string> = {
  whatsappNumber: '+919876543210',
  phoneNumber: '+91-9876543210',
  shopAddress: '81/1, main road, near bank of baroda, barra-2, Barra, kanpur nagar, Kanpur, Uttar Pradesh 208027',
  shopEmail: 'info@devendraelectricals.com',
};

export const getSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const settings = await Setting.find().lean();
    const result: Record<string, string> = { ...DEFAULTS };
    for (const s of settings) {
      result[s.key] = s.value;
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const updates = req.body as Record<string, string>;
    const keys = Object.keys(DEFAULTS);

    for (const key of keys) {
      if (updates[key] !== undefined) {
        await Setting.findOneAndUpdate(
          { key },
          { value: updates[key] },
          { upsert: true, new: true }
        );
      }
    }

    const settings = await Setting.find().lean();
    const result: Record<string, string> = { ...DEFAULTS };
    for (const s of settings) {
      result[s.key] = s.value;
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
