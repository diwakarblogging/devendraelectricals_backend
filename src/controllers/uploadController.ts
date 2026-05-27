import { Request, Response } from 'express';
import cloudinary from '../utils/cloudinary';
import multer from 'multer';
import { Readable } from 'stream';

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export const uploadImages = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      res.status(400).json({ success: false, message: 'No files uploaded' });
      return;
    }

    const files = req.files as Express.Multer.File[];
    const uploadResults: { url: string; publicId: string }[] = [];

    for (const file of files) {
      const result = await new Promise<{ url: string; publicId: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'devendra-electricals',
            resource_type: 'image',
            quality: 'auto',
            fetch_format: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else if (result) resolve({ url: result.secure_url, publicId: result.public_id });
            else reject(new Error('Upload failed'));
          }
        );

        const bufferStream = new Readable();
        bufferStream.push(file.buffer);
        bufferStream.push(null);
        bufferStream.pipe(uploadStream);
      });

      uploadResults.push(result);
    }

    res.status(200).json({
      success: true,
      data: uploadResults,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { publicId } = req.params;
    await cloudinary.uploader.destroy(publicId);
    res.status(200).json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
};
